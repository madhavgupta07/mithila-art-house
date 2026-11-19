"""Download a small set of openly licensed documentary photos from Wikimedia Commons.

These are used only in editorial/heritage sections with visible attribution.
Run after scripts/fetch_commons.py: python scripts/prepare_heritage.py
"""
import io
import json
import re
import ssl
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "scripts" / ".tmp-commons" / "candidates.json"
OUT = ROOT / "public" / "images" / "heritage"
CREDITS = ROOT / "src" / "data" / "imageCredits.json"
OUT.mkdir(parents=True, exist_ok=True)
CREDITS.parent.mkdir(parents=True, exist_ok=True)
SSL_CONTEXT = ssl._create_unverified_context()
HEADERS = {"User-Agent": "MithilaGallerySample/1.0 (sample storefront imagery)"}

# index -> local filename used by the UI
SELECTION = {
    5: "artist-at-work",
    20: "painting-detail",
    30: "painting-bihar",
    43: "wedding-motifs",
    49: "craft-detail",
    18: "wedding-painting",
    11: "radha-krishna-exhibit",
    41: "paintings-for-sale",
    45: "artisan-portrait",
    15: "mahavidyas",
}

items = json.loads(SRC.read_text(encoding="utf-8"))
records = []
for idx, slug in SELECTION.items():
    item = items[idx]
    try:
        # Reuse the thumbnails already downloaded by fetch_commons.py to avoid
        # hammering the Commons image host (it rate-limits rapid requests).
        thumb = ROOT / "scripts" / ".tmp-commons" / f"thumb-{idx:03d}.jpg"
        im = ImageOps.exif_transpose(Image.open(thumb)).convert("RGB")
        path = OUT / f"{slug}.webp"
        im.save(path, "WEBP", quality=82, method=6)
        records.append({
            "file": f"/images/heritage/{slug}.webp",
            "title": re.sub(r"^File:", "", item["title"]),
            "author": item["artist"] or "Unknown",
            "license": item["license"],
            "source": item["page"],
            "licenseUrl": item["licenseUrl"],
        })
        print("saved", slug, im.size)
    except Exception as exc:
        print("failed", slug, exc)

CREDITS.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
print("credits", len(records))
