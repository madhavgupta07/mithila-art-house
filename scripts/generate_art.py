"""Generate original, Mithila-inspired SVG artwork for the sample storefront.

These are original illustrations made for this storefront. They are not presented as
historically authentic paintings or as work by a named artisan. Run with:
    python scripts/generate_art.py
"""
import math
import random
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "images" / "art"
OUT.mkdir(parents=True, exist_ok=True)

INK = "#2B1E18"
IVORY = "#F7EDD9"
INDIGO = "#25466C"
DEEP = "#162A45"
VERMILION = "#C13A24"
TERRA = "#B45C36"
MUSTARD = "#D6A32C"
FOREST = "#2E5B47"
ROSE = "#B2606C"


def n(x):
    return f"{x:.1f}"


def petal(cx, cy, length, width, angle, fill, stroke=INK, sw=2):
    """A pointed petal pointing up, rotated by angle degrees."""
    return (
        f'<g transform="translate({n(cx)} {n(cy)}) rotate({n(angle)})">'
        f'<path d="M0 0 C{n(-width)} {n(-length*0.28)} {n(-width*0.72)} {n(-length*0.82)} 0 {n(-length)} '
        f'C{n(width*0.72)} {n(-length*0.82)} {n(width)} {n(-length*0.28)} 0 0Z" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'
        f'<path d="M0 {n(-length*0.08)} L0 {n(-length*0.82)}" stroke="{stroke}" stroke-width="1" opacity=".55"/>'
        f"</g>"
    )


def dot(cx, cy, r=2.4, fill=INK, opacity=1):
    return f'<circle cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}" fill="{fill}" opacity="{opacity}"/>'


def lotus(cx, cy, scale=1, outer=VERMILION, inner=MUSTARD, petals=10):
    s = []
    for i in range(petals):
        a = -90 + i * (360 / petals)
        s.append(petal(cx, cy, 130 * scale, 34 * scale, a, outer))
    for i in range(7):
        a = -90 + i * (360 / 7) + 18
        s.append(petal(cx, cy + 10 * scale, 78 * scale, 25 * scale, a, inner))
    s.append(f'<circle cx="{n(cx)}" cy="{n(cy+10*scale)}" r="{n(15*scale)}" fill="{FOREST}" stroke="{INK}" stroke-width="2"/>')
    for i in range(8):
        a = math.radians(i * 45)
        s.append(dot(cx + math.cos(a) * 7 * scale, cy + 10 * scale + math.sin(a) * 7 * scale, 1.7 * scale, IVORY))
    return "".join(s)


def fish(cx, cy, scale=1, rot=0, body=INDIGO, accent=VERMILION):
    r = random.Random(int(cx * 3 + cy))
    s = [f'<g transform="translate({n(cx)} {n(cy)}) rotate({n(rot)}) scale({n(scale)})">']
    s.append(f'<path d="M-95 0 C-70 -48 20 -52 74 0 C20 52 -70 48 -95 0Z" fill="{body}" stroke="{INK}" stroke-width="3"/>')
    s.append(f'<path d="M74 0 L130 -44 L116 0 L130 44Z" fill="{accent}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>')
    s.append(f'<path d="M-30 -44 C-10 -78 30 -80 46 -52Z" fill="{MUSTARD}" stroke="{INK}" stroke-width="2.5"/>')
    s.append(f'<path d="M-20 44 C0 76 34 74 50 50Z" fill="{MUSTARD}" stroke="{INK}" stroke-width="2.5"/>')
    for row in range(3):
        for col in range(5):
            x = -55 + col * 24 + (row % 2) * 12
            y = -25 + row * 22
            s.append(f'<path d="M{x} {y-8} Q{x+10} {y} {x} {y+8}" fill="none" stroke="{IVORY}" stroke-width="2" opacity=".9"/>')
    s.append(dot(52, -10, 7, IVORY))
    s.append(dot(54, -10, 3, INK))
    for i in range(9):
        s.append(dot(-80 + i * 16, -54 + (i % 2) * 6, 2, accent))
    s.append("</g>")
    return "".join(s)


def feather(cx, cy, length, angle, color):
    x2 = cx + math.sin(math.radians(angle)) * length
    y2 = cy - math.cos(math.radians(angle)) * length
    s = [f'<path d="M{cx} {cy} Q{n(cx + math.sin(math.radians(angle))*length*0.35)} {n(cy-length*0.55)} {n(x2)} {n(y2)}" fill="none" stroke="{FOREST}" stroke-width="2.5"/>']
    for t in (0.35, 0.55, 0.75):
        bx = cx + (x2 - cx) * t
        by = cy + (y2 - cy) * t
        w = 20 * (1 - t) + 8
        s.append(f'<path d="M{n(bx-w)} {n(by+10)} Q{n(bx)} {n(by-8)} {n(bx+w)} {n(by+10)} Q{n(bx)} {n(by+2)} {n(bx-w)} {n(by+10)}Z" fill="{color}" stroke="{INK}" stroke-width="1.4"/>')
    s.append(f'<ellipse cx="{n(x2)}" cy="{n(y2)}" rx="13" ry="18" fill="{MUSTARD}" stroke="{INK}" stroke-width="2"/>')
    s.append(f'<ellipse cx="{n(x2)}" cy="{n(y2)}" rx="6" ry="10" fill="{VERMILION}"/>')
    return "".join(s)


def peacock(cx, cy, scale=1, flip=False, fan=True):
    s = [f'<g transform="translate({n(cx)} {n(cy)}) scale({-scale if flip else scale} {scale})">']
    if fan:
        for i in range(11):
            s.append(feather(0, -20, 260, -70 + i * 14, VERMILION if i % 2 else MUSTARD))
    s.append(f'<path d="M-18 30 C-52 8 -46 -60 -10 -92 C20 -112 44 -90 34 -56 C26 -26 20 4 26 30Z" fill="{INDIGO}" stroke="{INK}" stroke-width="3"/>')
    s.append(f'<path d="M-12 30 C-30 -10 -22 -70 2 -84" fill="none" stroke="{IVORY}" stroke-width="2" opacity=".7"/>')
    s.append(f'<ellipse cx="-2" cy="-92" rx="20" ry="17" fill="{INDIGO}" stroke="{INK}" stroke-width="3"/>')
    s.append(f'<path d="M14 -95 L40 -88 L14 -82Z" fill="{MUSTARD}" stroke="{INK}" stroke-width="2"/>')
    s.append(dot(-8, -98, 3.5, IVORY))
    for i in range(3):
        s.append(f'<path d="M-10 {-106-i*3} Q-4 {-124-i*6} 4 {-106-i*3}" fill="none" stroke="{FOREST}" stroke-width="2"/>')
    s.append(f'<path d="M-18 30 C-60 46 -70 74 -46 96 C-22 112 34 110 48 92 C64 70 40 42 24 30Z" fill="{FOREST}" stroke="{INK}" stroke-width="3"/>')
    for i in range(5):
        s.append(f'<path d="M{-34+i*16} 46 Q{-30+i*16} 72 {-24+i*16} 92" fill="none" stroke="{MUSTARD}" stroke-width="2"/>')
    s.append(f'<path d="M-6 100 L-14 126 M16 100 L24 126" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>')
    s.append(f'<path d="M-22 128 L-2 128 M10 128 L32 128" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>')
    s.append("</g>")
    return "".join(s)


def sun(cx, cy, r=100, rays=20):
    s = []
    for i in range(rays):
        a = math.radians(i * 360 / rays)
        x1, y1 = cx + math.cos(a) * (r + 8), cy + math.sin(a) * (r + 8)
        x2, y2 = cx + math.cos(a) * (r + 48), cy + math.sin(a) * (r + 48)
        s.append(f'<path d="M{n(x1)} {n(y1)} L{n(x2)} {n(y2)}" stroke="{VERMILION}" stroke-width="3" stroke-linecap="round"/>')
        s.append(dot(x2, y2, 3, MUSTARD))
    s.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{MUSTARD}" stroke="{INK}" stroke-width="3"/>')
    s.append(f'<circle cx="{cx}" cy="{cy}" r="{r-16}" fill="none" stroke="{VERMILION}" stroke-width="2"/>')
    for i in range(12):
        s.append(petal(cx, cy, r - 24, 16, i * 30, VERMILION if i % 2 else TERRA))
    s.append(f'<circle cx="{cx}" cy="{cy}" r="20" fill="{IVORY}" stroke="{INK}" stroke-width="2.5"/>')
    s.append(dot(cx, cy, 7, VERMILION))
    return "".join(s)


def tree(cx, cy, scale=1):
    s = [f'<g transform="translate({n(cx)} {n(cy)}) scale({scale})">']
    s.append(f'<path d="M-14 250 C-10 150 -26 40 -6 -60 L14 -60 C26 40 12 150 18 250Z" fill="{TERRA}" stroke="{INK}" stroke-width="3"/>')
    for a in (-58, -30, 30, 58):
        rad = math.radians(a)
        ex, ey = math.sin(rad) * 150, -math.cos(rad) * 150
        s.append(f'<path d="M0 -20 Q{n(ex*0.4)} {n(ey*0.5-40)} {n(ex)} {n(ey)}" fill="none" stroke="{TERRA}" stroke-width="9" stroke-linecap="round"/>')
        s.append(f'<path d="M0 -20 Q{n(ex*0.4)} {n(ey*0.5-40)} {n(ex)} {n(ey)}" fill="none" stroke="{INK}" stroke-width="2"/>')
    rnd = random.Random(9)
    for i in range(46):
        a = rnd.uniform(-2.6, 0.6)
        rad = rnd.uniform(70, 230)
        x, y = math.cos(a) * rad, math.sin(a) * rad * 0.62 - 20
        fill = FOREST if i % 3 else VERMILION
        s.append(f'<ellipse cx="{n(x)}" cy="{n(y)}" rx="{n(rnd.uniform(14,26))}" ry="{n(rnd.uniform(10,18))}" fill="{fill}" stroke="{INK}" stroke-width="1.6" transform="rotate({n(rnd.uniform(-40,40))} {n(x)} {n(y)})"/>')
        if i % 4 == 0:
            s.append(dot(x, y, 3, MUSTARD))
    for i in range(7):
        x = -180 + i * 60
        y = -190 - (i % 3) * 28
        s.append(f'<path d="M{x} {y} q14 -14 28 0 q-14 14 -28 0Z" fill="{INDIGO}" stroke="{INK}" stroke-width="1.5"/>')
        s.append(dot(x + 6, y - 2, 1.6, IVORY))
    s.append("</g>")
    return "".join(s)


def diamond_band(x, y, w, h, fill=INDIGO, step=34):
    s = []
    cols = int(w // step)
    for i in range(cols + 1):
        cx = x + i * step
        for yy in (y, y + h):
            s.append(f'<path d="M{cx} {yy-8} L{cx+9} {yy} L{cx} {yy+8} L{cx-9} {yy}Z" fill="{fill}" stroke="{INK}" stroke-width="1"/>')
    rows = int(h // step)
    for j in range(rows + 1):
        cy = y + j * step
        for xx in (x, x + w):
            s.append(f'<path d="M{xx} {cy-8} L{xx+9} {cy} L{xx} {cy+8} L{xx-9} {cy}Z" fill="{TERRA}" stroke="{INK}" stroke-width="1"/>')
    return "".join(s)


def temple(cx, cy, scale=1):
    s = [f'<g transform="translate({n(cx)} {n(cy)}) scale({scale})">']
    s.append(f'<path d="M-160 180 L-160 -20 Q-160 -170 0 -230 Q160 -170 160 -20 L160 180Z" fill="{INDIGO}" stroke="{INK}" stroke-width="4"/>')
    s.append(f'<path d="M-132 170 L-132 -12 Q-132 -140 0 -192 Q132 -140 132 -12 L132 170Z" fill="{DEEP}" stroke="{MUSTARD}" stroke-width="3"/>')
    s.append(f'<path d="M-96 170 L-96 -8 Q-96 -108 0 -152 Q96 -108 96 -8 L96 170" fill="none" stroke="{VERMILION}" stroke-width="3"/>')
    s.append(f'<path d="M-60 170 L-60 60 Q-60 0 0 0 Q60 0 60 60 L60 170Z" fill="{MUSTARD}" stroke="{INK}" stroke-width="3"/>')
    s.append(f'<ellipse cx="0" cy="88" rx="30" ry="18" fill="{VERMILION}" stroke="{INK}" stroke-width="2.5"/>')
    s.append(f'<path d="M0 70 Q-12 50 0 32 Q12 50 0 70Z" fill="{MUSTARD}" stroke="{INK}" stroke-width="2"/>')
    for i in range(9):
        s.append(dot(-120 + i * 30, 150, 3, MUSTARD))
    s.append("</g>")
    return "".join(s)


def elephant(cx, cy, scale=1):
    s = [f'<g transform="translate({n(cx)} {n(cy)}) scale({scale})">']
    s.append(f'<path d="M-150 60 C-160 -20 -90 -70 -10 -60 C80 -50 130 -10 120 50 C115 90 60 110 0 104 L-110 104Z" fill="{TERRA}" stroke="{INK}" stroke-width="3.5"/>')
    s.append(f'<path d="M-140 40 C-190 10 -190 -70 -140 -90 C-110 -100 -80 -70 -90 -40Z" fill="{TERRA}" stroke="{INK}" stroke-width="3"/>')
    s.append(f'<path d="M-100 80 L-96 160 L-64 160 L-66 90Z M50 90 L56 160 L88 160 L78 84Z" fill="{TERRA}" stroke="{INK}" stroke-width="3"/>')
    s.append(f'<path d="M120 40 C170 20 170 -40 130 -50" fill="none" stroke="{INK}" stroke-width="4"/>')
    s.append(f'<path d="M-60 -54 C-20 -100 50 -96 84 -52 L70 -18 C30 -50 -20 -48 -50 -18Z" fill="{INDIGO}" stroke="{INK}" stroke-width="3"/>')
    for i in range(7):
        x = -46 + i * 18
        s.append(f'<path d="M{x} {-52-(i%2)*4} l8 22 l-16 0Z" fill="{MUSTARD}" stroke="{INK}" stroke-width="1"/>')
    s.append(dot(-122, -56, 5, INK))
    for i in range(6):
        s.append(f'<path d="M-130 {-20+i*20} q40 14 80 0" fill="none" stroke="{IVORY}" stroke-width="2" opacity=".8"/>')
    s.append("</g>")
    return "".join(s)


def figures(cx, cy, scale=1, wedding=False):
    s = [f'<g transform="translate({n(cx)} {n(cy)}) scale({scale})">']
    colors = [VERMILION, MUSTARD, FOREST, ROSE, INDIGO]
    for i in range(5):
        x = -190 + i * 95
        y = (i % 2) * 16
        fill = colors[i % len(colors)]
        s.append(f'<path d="M{x-26} {y+130} L{x-16} {y+18} L{x+16} {y+18} L{x+26} {y+130}Z" fill="{fill}" stroke="{INK}" stroke-width="2.5"/>')
        s.append(f'<circle cx="{x}" cy="{y-10}" r="17" fill="{TERRA if i%2 else MUSTARD}" stroke="{INK}" stroke-width="2.5"/>')
        s.append(f'<path d="M{x-17} {y-14} Q{x} {y-42} {x+17} {y-14}" fill="{INK}"/>')
        s.append(f'<path d="M{x-15} {y+28} L{x-42} {y+56} M{x+15} {y+28} L{x+42} {y+56}" stroke="{INK}" stroke-width="3"/>')
        for k in range(3):
            s.append(f'<path d="M{x-18+k*10} {y+52} L{x-18+k*10} {y+118}" stroke="{IVORY}" stroke-width="2" opacity=".8"/>')
        if wedding:
            s.append(f'<circle cx="{x}" cy="{y-32}" r="5" fill="{MUSTARD}"/>')
    s.append("</g>")
    return "".join(s)


def branch(cx, cy, scale=1):
    s = [f'<g transform="translate({n(cx)} {n(cy)}) scale({scale})">']
    s.append(f'<path d="M-220 180 C-100 90 40 40 210 -120" fill="none" stroke="{TERRA}" stroke-width="12" stroke-linecap="round"/>')
    s.append(f'<path d="M-220 180 C-100 90 40 40 210 -120" fill="none" stroke="{INK}" stroke-width="2.5"/>')
    for i in range(12):
        t = i / 11
        x = -220 + t * 430
        y = 180 - t * 300
        s.append(f'<ellipse cx="{n(x-14)}" cy="{n(y-26)}" rx="22" ry="10" fill="{FOREST}" stroke="{INK}" stroke-width="1.6" transform="rotate(-35 {n(x-14)} {n(y-26)})"/>')
        if i % 3 == 0:
            s.append(lotus(x + 20, y + 20, 0.28, ROSE, MUSTARD, 8))
    s.append("</g>")
    return "".join(s)


def parrots(cx, cy, scale=1):
    s = [f'<g transform="translate({n(cx)} {n(cy)}) scale({scale})">']
    for dx, flip, col in ((-90, False, FOREST), (90, True, INDIGO)):
        s.append(f'<g transform="translate({dx} 0) scale({-1 if flip else 1} 1)">')
        s.append(f'<path d="M-30 40 C-50 -10 -20 -60 20 -55 C50 -50 60 -20 40 10 C25 34 -5 48 -30 40Z" fill="{col}" stroke="{INK}" stroke-width="3"/>')
        s.append(f'<path d="M-20 38 C-70 60 -100 30 -110 -10 C-70 6 -40 10 -20 38Z" fill="{MUSTARD}" stroke="{INK}" stroke-width="2.5"/>')
        s.append(f'<circle cx="34" cy="-48" r="18" fill="{col}" stroke="{INK}" stroke-width="3"/>')
        s.append(f'<path d="M50 -50 L76 -40 L50 -32Z" fill="{VERMILION}" stroke="{INK}" stroke-width="2"/>')
        s.append(dot(40, -54, 3.5, IVORY))
        s.append(f'<path d="M-10 40 L-14 74 M14 36 L18 72" stroke="{INK}" stroke-width="3"/>')
        s.append("</g>")
    s.append("</g>")
    return "".join(s)


def rain(cx, cy, scale=1):
    s = [f'<g transform="translate({n(cx)} {n(cy)}) scale({scale})">']
    rnd = random.Random(12)
    for i in range(30):
        x = rnd.uniform(-230, 230)
        y = rnd.uniform(-260, 160)
        s.append(f'<path d="M{n(x)} {n(y)} l-14 34" stroke="{INDIGO}" stroke-width="2" opacity=".7"/>')
    for i in range(4):
        x = -180 + i * 120
        y = -220 + (i % 2) * 50
        s.append(f'<path d="M{x-60} {y} q30 -30 60 0 q30 -30 60 0 q30 -30 60 0" fill="none" stroke="{INDIGO}" stroke-width="3"/>')
    s.append("</g>")
    return "".join(s)


def mandala(cx, cy, r=250, rings=4):
    s = []
    for ring in range(rings):
        rad = r - ring * 52
        count = 8 + ring * 4
        for i in range(count):
            a = math.radians(i * 360 / count + ring * 11)
            x, y = cx + math.cos(a) * rad, cy + math.sin(a) * rad
            fill = [VERMILION, MUSTARD, FOREST, INDIGO][ring % 4]
            if ring % 2 == 0:
                s.append(petal(cx, cy, rad + 26, 26, i * 360 / count + ring * 11 + 90, fill))
            else:
                s.append(f'<path d="M{n(x)} {n(y-14)} L{n(x+14)} {n(y)} L{n(x)} {n(y+14)} L{n(x-14)} {n(y)}Z" fill="{fill}" stroke="{INK}" stroke-width="1.5"/>')
                s.append(dot(x, y, 3, IVORY))
    s.append(f'<circle cx="{cx}" cy="{cy}" r="48" fill="{MUSTARD}" stroke="{INK}" stroke-width="3"/>')
    s.append(lotus(cx, cy + 12, 0.34, VERMILION, FOREST, 10))
    return "".join(s)


def border(x=26, y=26, w=748, h=948):
    s = [
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="{DEEP}" stroke-width="4"/>',
        f'<rect x="{x+14}" y="{y+14}" width="{w-28}" height="{h-28}" fill="none" stroke="{TERRA}" stroke-width="2"/>',
        f'<rect x="{x+30}" y="{y+30}" width="{w-60}" height="{h-60}" fill="none" stroke="{INDIGO}" stroke-width="1.2" opacity=".8"/>',
    ]
    for i in range(26):
        cx = x + 58 + i * 26
        s.append(f'<path d="M{cx} {y+20} q6 -10 12 0 q-6 10 -12 0Z" fill="{MUSTARD}" stroke="{INK}" stroke-width=".8"/>')
        s.append(f'<path d="M{cx} {y+h-20} q6 -10 12 0 q-6 10 -12 0Z" fill="{VERMILION}" stroke="{INK}" stroke-width=".8"/>')
    for j in range(38):
        cy = y + 58 + j * 23
        s.append(dot(x + 20, cy, 2.6, VERMILION))
        s.append(dot(x + w - 20, cy, 2.6, INDIGO))
    return "".join(s)


def svg_doc(inner, w=800, h=1000, zoom=None):
    view = f"{zoom[0]} {zoom[1]} {zoom[2]} {zoom[3]}" if zoom else f"0 0 {w} {h}"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" width="{w}" height="{h}" role="img" aria-label="Original Mithila inspired illustration">
<defs>
<filter id="grain" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="4" seed="8" stitchTiles="stitch"/>
<feColorMatrix type="saturate" values="0"/>
</filter>
<radialGradient id="paper" cx="50%" cy="42%" r="75%">
<stop offset="0%" stop-color="#FBF4E6"/><stop offset="100%" stop-color="#EFE1C8"/>
</radialGradient>
</defs>
<rect width="{w}" height="{h}" fill="url(#paper)"/>
<rect width="{w}" height="{h}" filter="url(#grain)" opacity=".13" style="mix-blend-mode:multiply"/>
{inner}
</svg>'''


def build(slug, inner, seed):
    random.seed(seed)
    page = border() + inner
    (OUT / f"{slug}.svg").write_text(svg_doc(page), encoding="utf-8")
    (OUT / f"{slug}-detail.svg").write_text(svg_doc(page, zoom=(180, 190, 440, 550)), encoding="utf-8")
    frame = (
        f'<rect x="8" y="8" width="784" height="984" fill="none" stroke="#6B4426" stroke-width="22"/>'
        f'<rect x="20" y="20" width="760" height="960" fill="none" stroke="#C08A4E" stroke-width="6"/>'
        f'<rect x="26" y="26" width="748" height="948" fill="none" stroke="#3B2416" stroke-width="3"/>'
    )
    (OUT / f"{slug}-framed.svg").write_text(svg_doc(frame + page), encoding="utf-8")


# 1 — paired peacocks
build("art-peacock-dance", peacock(265, 430, 1.0, flip=False) + peacock(535, 430, 1.0, flip=True, fan=True)
      + lotus(400, 800, 0.55, VERMILION, MUSTARD, 12)
      + "".join(dot(400 + math.cos(i*math.pi/6)*120, 800 + math.sin(i*math.pi/6)*50, 3, INDIGO) for i in range(12)), 1)

# 2 — tree of life
build("art-tree-of-life", tree(400, 470, 1.05) + sun(640, 190, 48, 14) + f'<circle cx="160" cy="190" r="34" fill="{MUSTARD}" stroke="{INK}" stroke-width="3"/>'
      + f'<path d="M160 156 a34 34 0 1 0 0 68 a26 26 0 1 1 0-68Z" fill="{INDIGO}"/>'
      + "".join(f'<path d="M{i*60+70} 830 q20 -18 40 0" fill="none" stroke="{FOREST}" stroke-width="3"/>' for i in range(11)), 2)

# 3 — fish harmony
build("art-fish-harmony", fish(400, 390, 1.15, -18, INDIGO, VERMILION) + fish(400, 620, 1.15, 162, FOREST, MUSTARD)
      + lotus(400, 800, 0.4, ROSE, MUSTARD, 10)
      + "".join(f'<path d="M{110+i*22} 250 q10 -12 20 0" fill="none" stroke="{INDIGO}" stroke-width="2"/>' for i in range(26)), 3)

# 4 — lotus pond
build("art-lotus-bloom", lotus(400, 480, 1.25, ROSE, MUSTARD, 14) + sun(400, 190, 62, 16)
      + "".join(f'<path d="M90 {610+i*26} q40 -18 80 0 t80 0 t80 0 t80 0 t80 0 t80 0" fill="none" stroke="{INDIGO}" stroke-width="2.5" opacity=".8"/>' for i in range(7))
      + "".join(f'<ellipse cx="{150+i*100}" cy="{700+(i%2)*26}" rx="34" ry="14" fill="{FOREST}" stroke="{INK}" stroke-width="2"/>' for i in range(6)), 4)

# 5 — wedding mandap
build("art-wedding-mandap", temple(400, 320, 1.05) + figures(400, 620, 0.95, True)
      + "".join(petal(90 + i*52, 190, 44, 14, 180 if i%2 else 0, VERMILION if i%2 else MUSTARD) for i in range(13)), 5)

# 6 — sun and moon
build("art-sun-moon", sun(300, 450, 155, 26)
      + f'<circle cx="560" cy="400" r="118" fill="{INDIGO}" stroke="{INK}" stroke-width="3"/>'
      + f'<circle cx="606" cy="366" r="104" fill="{IVORY}"/>'
      + "".join(dot(560 + math.cos(i*math.pi/6)*92, 400 + math.sin(i*math.pi/6)*92, 4, MUSTARD) for i in range(12))
      + "".join(f'<path d="M{i*70+70} 760 q18 -20 36 0 q18 -20 36 0" fill="none" stroke="{FOREST}" stroke-width="3"/>' for i in range(9)), 6)

# 7 — geometric mandala
build("art-geometric-mandala", mandala(400, 500, 285, 5)
      + diamond_band(70, 120, 660, 760, INDIGO, 40), 7)

# 8 — Radha Krishna
build("art-radha-krishna",
      f'<path d="M400 210 C450 250 470 330 430 410 L460 700 L340 700 L370 410 C330 330 350 250 400 210Z" fill="{INDIGO}" stroke="{INK}" stroke-width="3"/>'
      + f'<circle cx="400" cy="205" r="42" fill="{INDIGO}" stroke="{INK}" stroke-width="3"/>'
      + f'<path d="M360 180 q40 -50 80 0" fill="none" stroke="{MUSTARD}" stroke-width="8"/>'
      + f'<path d="M435 250 L600 215" stroke="{MUSTARD}" stroke-width="10" stroke-linecap="round"/>'
      + "".join(dot(470+i*20, 248-i*5, 2.5, IVORY) for i in range(6))
      + f'<path d="M520 500 C610 470 650 550 610 640 C580 700 500 690 490 620Z" fill="{ROSE}" stroke="{INK}" stroke-width="3"/>'
      + f'<circle cx="580" cy="510" r="34" fill="{TERRA}" stroke="{INK}" stroke-width="3"/>'
      + "".join(petal(400, 830, 90, 24, -70+i*20, VERMILION if i%2 else MUSTARD) for i in range(8)), 8)

# 9 — elephant procession
build("art-elephant-procession", elephant(400, 480, 1.2) + sun(620, 200, 55, 14)
      + "".join(lotus(100+i*70, 840, 0.22, VERMILION, MUSTARD, 8) for i in range(9)), 9)

# 10 — kohbar (auspicious marriage diagram)
build("art-kohbar-auspicious",
      f'<rect x="110" y="160" width="580" height="680" fill="{IVORY}" stroke="{INDIGO}" stroke-width="4"/>'
      + f'<path d="M400 820 L400 300 M400 560 C260 520 200 420 180 300 M400 560 C540 520 600 420 620 300" fill="none" stroke="{FOREST}" stroke-width="8"/>'
      + fish(285, 400, 0.62, -25, INDIGO, VERMILION) + fish(515, 400, 0.62, 205, INDIGO, VERMILION)
      + lotus(400, 270, 0.62, VERMILION, MUSTARD, 12)
      + "".join(f'<path d="M{140+i*36} {200} l12 20 l-24 0Z" fill="{MUSTARD}" stroke="{INK}" stroke-width="1"/>' for i in range(15)), 10)

# 11 — parrots on a branch
build("art-parrot-branch", branch(400, 560, 1.0) + parrots(400, 400, 1.05)
      + "".join(dot(100+i*28, 150+(i%3)*20, 3, VERMILION) for i in range(20)), 11)

# 12 — temple diya
build("art-temple-diya", temple(400, 400, 1.0)
      + "".join(f'<ellipse cx="{180+i*55}" cy="780" rx="24" ry="10" fill="{MUSTARD}" stroke="{INK}" stroke-width="2"/>' for i in range(9))
      + "".join(f'<path d="M{180+i*55} 770 q-10 -30 0 -48 q10 18 0 48Z" fill="{VERMILION}" stroke="{INK}" stroke-width="1.5"/>' for i in range(9))
      + peacock(170, 700, 0.45, fan=False) + peacock(630, 700, 0.45, flip=True, fan=False), 12)

# 13 — monsoon peacock
build("art-monsoon-peacock", rain(400, 420, 1.0) + peacock(400, 600, 0.95, fan=True)
      + "".join(f'<circle cx="{130+i*60}" cy="{860-(i%2)*14}" r="7" fill="{FOREST}" stroke="{INK}" stroke-width="1.5"/>' for i in range(10)), 13)

# 14 — cosmic lotus
build("art-cosmic-lotus", mandala(400, 480, 250, 4) + sun(400, 480, 70, 18)
      + "".join(petal(400, 860, 70, 20, -60+i*15, FOREST if i%2 else VERMILION) for i in range(9)), 14)

# 15 — village life
build("art-village-life",
      f'<path d="M80 620 L200 500 L320 620Z" fill="{TERRA}" stroke="{INK}" stroke-width="3"/>'
      + f'<rect x="110" y="620" width="180" height="120" fill="{IVORY}" stroke="{INK}" stroke-width="3"/>'
      + f'<path d="M470 600 L590 480 L700 600Z" fill="{VERMILION}" stroke="{INK}" stroke-width="3"/>'
      + f'<rect x="495" y="600" width="190" height="140" fill="{IVORY}" stroke="{INK}" stroke-width="3"/>'
      + f'<path d="M0 760 q200 -40 400 0 t400 0 L800 900 L0 900Z" fill="{MUSTARD}" stroke="{INK}" stroke-width="3"/>'
      + f'<path d="M380 900 C380 810 420 770 400 700" fill="none" stroke="{TERRA}" stroke-width="7"/>'
      + sun(640, 220, 62, 16)
      + "".join(f'<path d="M{i*80+30} 770 l10 -20 l10 20Z" fill="{FOREST}" stroke="{INK}" stroke-width="1"/>' for i in range(9)), 15)

# 16 — modern abstract lotus
build("art-modern-abstract",
      "".join(f'<path d="M{400-230+i*14} 760 Q400 {300+i*10} {400+230-i*14} 760" fill="none" stroke="{INDIGO if i%2 else VERMILION}" stroke-width="2.5" opacity=".85"/>' for i in range(24))
      + lotus(400, 660, 1.0, VERMILION, MUSTARD, 12)
      + "".join(dot(400, 300+i*26, 3, FOREST) for i in range(10)), 16)

# Illustrative artist portrait placeholders (no real person depicted)
for idx, (bg, accent) in enumerate(((INDIGO, MUSTARD), (FOREST, VERMILION), (TERRA, MUSTARD)), start=1):
    s = [
        f'<rect width="800" height="1000" fill="{bg}"/>',
        f'<rect x="30" y="30" width="740" height="940" fill="none" stroke="{accent}" stroke-width="4"/>',
        f'<circle cx="400" cy="380" r="170" fill="{accent}" stroke="{IVORY}" stroke-width="4"/>',
        f'<path d="M120 1000 C140 720 250 600 400 600 C550 600 660 720 680 1000Z" fill="{accent}" stroke="{IVORY}" stroke-width="4"/>',
    ]
    for i in range(9):
        s.append(petal(400, 380, 190, 28, i * 40, bg if i % 2 else IVORY, stroke=accent, sw=1.5))
    for i in range(6):
        s.append(f'<path d="M170 {700+i*50} q230 60 460 0" fill="none" stroke="{IVORY}" stroke-width="3" opacity=".65"/>')
    (OUT / f"portrait-placeholder-{idx}.svg").write_text(svg_doc("".join(s)), encoding="utf-8")

print("generated", len(list(OUT.glob('*.svg'))), "svg files in", OUT)
