"""Fetch openly licensed Madhubani/Mithila artwork candidates from Wikimedia Commons.

Development utility only. Produces a contact sheet so artwork can be reviewed before
being copied into public/images, plus a JSON manifest with attribution data.
"""
import json
import re
import ssl
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
TMP = ROOT / "scripts" / ".tmp-commons"
TMP.mkdir(parents=True, exist_ok=True)

QUERIES = [
    "Madhubani painting", "Mithila painting", "Madhubani art", "Mithila art",
    "Madhubani folk art", "Madhubani painting peacock", "Madhubani fish motif",
    "Mithila painting Radha Krishna", "Madhubani painting wedding",
    "Madhubani painting flower", "Madhubani painting bird", "Madhubani painting elephant",
    "Madhubani painting Krishna", "Madhubani painting geometric", "Madhubani painting mural",
]

API = "https://commons.wikimedia.org/w/api.php"
HEADERS = {"User-Agent": "MithilaGallerySample/1.0 (sample storefront imagery; contact: developer@example.invalid)"}
SSL_CONTEXT = ssl._create_unverified_context()


def api(params):
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=40, context=SSL_CONTEXT) as r:
        return json.load(r)


def clean(value):
    return re.sub(r"<[^>]+>", "", value or "").strip()


records = {}
for q in QUERIES:
    try:
        data = api({
            "action": "query", "generator": "search", "gsrsearch": q,
            "gsrnamespace": 6, "gsrlimit": 30, "prop": "imageinfo",
            "iiprop": "url|extmetadata|size|mime", "iiurlwidth": 700,
            "format": "json", "origin": "*",
        })
    except Exception as exc:
        print("query failed", q, exc)
        continue
    for page in (data.get("query") or {}).get("pages", {}).values():
        info = (page.get("imageinfo") or [{}])[0]
        meta = info.get("extmetadata") or {}
        title = page.get("title", "")
        if not re.search(r"\.(jpe?g|png|webp)$", title, re.I):
            continue
        lic = clean(meta.get("LicenseShortName", {}).get("value", ""))
        if not re.search(r"CC0|CC BY|Public domain|FAL|GODL", lic, re.I):
            continue
        if info.get("width", 0) < 500 or info.get("height", 0) < 400:
            continue
        records[title] = {
            "title": title,
            "thumb": info.get("thumburl") or info.get("url"),
            "url": info.get("url"),
            "page": info.get("descriptionurl"),
            "artist": clean(meta.get("Artist", {}).get("value", ""))[:160],
            "license": lic,
            "licenseUrl": meta.get("LicenseUrl", {}).get("value", ""),
            "description": clean(meta.get("ImageDescription", {}).get("value", ""))[:260],
            "width": info.get("width"), "height": info.get("height"),
        }

items = sorted(records.values(), key=lambda x: x["title"])
(TMP / "candidates.json").write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
print("candidates", len(items))

for i, item in enumerate(items):
    path = TMP / f"thumb-{i:03d}.jpg"
    if path.exists():
        continue
    try:
        req = urllib.request.Request(item["thumb"], headers=HEADERS)
        with urllib.request.urlopen(req, timeout=40, context=SSL_CONTEXT) as r:
            path.write_bytes(r.read())
    except Exception as exc:
        print("download failed", i, item["title"], exc)

font = ImageFont.load_default()
per_sheet = 24
cols, cell = 4, (300, 250)
for sheet_idx in range((len(items) + per_sheet - 1) // per_sheet):
    chunk = items[sheet_idx * per_sheet:(sheet_idx + 1) * per_sheet]
    rows = (len(chunk) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell[0], rows * cell[1]), "#f5f1e8")
    d = ImageDraw.Draw(sheet)
    for j, item in enumerate(chunk):
        i = sheet_idx * per_sheet + j
        p = TMP / f"thumb-{i:03d}.jpg"
        x, y = (j % cols) * cell[0], (j // cols) * cell[1]
        if p.exists():
            try:
                im = Image.open(p).convert("RGB")
                im.thumbnail((cell[0] - 12, cell[1] - 46))
                sheet.paste(im, (x + 6, y + 4))
            except Exception:
                pass
        label = f"#{i:03d} {item['title'][5:42]}"
        d.text((x + 6, y + cell[1] - 40), label, fill="#1a2438", font=font)
        d.text((x + 6, y + cell[1] - 26), item["license"][:36], fill="#6b4a2f", font=font)
    out = TMP / f"sheet-{sheet_idx}.jpg"
    sheet.save(out, quality=82)
    print("sheet", out)
