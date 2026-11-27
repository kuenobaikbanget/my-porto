#!/usr/bin/env python3
"""Outline the 'kueno' wordmark from Space Grotesk (OFL) into pure SVG paths
and compose lockups with the cat symbol. No live <text> in any output."""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(HERE, "..", "public", "logo")
os.makedirs(PUBLIC, exist_ok=True)

TEXT = "kueno"
WEIGHT = 600
TRACKING_EM = -0.015  # slight negative tracking

font = TTFont(os.path.join(HERE, "SpaceGrotesk.ttf"))
instantiateVariableFont(font, {"wght": WEIGHT}, inplace=True)
upm = font["head"].unitsPerEm
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font["hmtx"]

# draw text into one path (font units, y-up)
d_parts = []
x = 0.0
for ch in TEXT:
    gname = cmap[ord(ch)]
    pen = SVGPathPen(glyph_set)
    tpen = TransformPen(pen, (1, 0, 0, 1, x, 0))
    glyph_set[gname].draw(tpen)
    d = pen.getCommands()
    if d:
        d_parts.append(d)
    adv = hmtx[gname][0] + TRACKING_EM * upm
    x += adv

bp = BoundsPen(glyph_set)
# measure bounds of whole text
x = 0.0
for ch in TEXT:
    gname = cmap[ord(ch)]
    tpen = TransformPen(bp, (1, 0, 0, 1, x, 0))
    glyph_set[gname].draw(tpen)
    x += hmtx[gname][0] + TRACKING_EM * upm
xMin, yMin, xMax, yMax = bp.bounds
text_w = xMax - xMin
text_h = yMax - yMin
print(f"text bounds (font units): x {xMin:.1f}..{xMax:.1f}  y {yMin:.1f}..{yMax:.1f}")

SYMBOL_D = (
    "M 62 92 L 80 42 L 114 88 Q 128 100 142 88 L 176 42 L 194 92 "
    "Q 212 92 212 112 L 212 176 Q 212 212 176 212 L 80 212 "
    "Q 44 212 44 176 L 44 112 Q 44 92 62 92 Z "
    "M 84 128 h 26 v 26 h -26 Z M 146 128 h 26 v 26 h -26 Z "
    "M 120 168 L 136 168 L 128 180 Z M 78 76 L 85 58 L 93 74 Z "
    "M 163 74 L 171 58 L 178 76 Z"
)


def wordmark_group(fill, scale, tx, baseline_y):
    """Emit a <g> with the wordmark path, flipped to SVG coords (y-down)."""
    # font y-up -> svg y-down: translate then scale(s, -s) then shift up by yMax
    d = " ".join(d_parts)
    return (
        f'<g transform="translate({tx:.2f},{baseline_y:.2f}) '
        f'scale({scale:.5f},{-scale:.5f}) translate({-xMin:.2f},{-yMax:.2f})">'
        f'<path fill="{fill}" fill-rule="evenodd" d="{d}"/></g>'
    )


def svg_doc(w, h, body, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}">\n'
        f"  <title>{title}</title>\n{body}\n</svg>\n"
    )


DARK = "#170e1f"
INK = "#f3edf7"
MINT = "#c6e3d1"

# --- wordmark-only masters (tight box around text, height = text height) ---
for name, fill in [("kueno-wordmark.svg", DARK), ("kueno-wordmark-light.svg", INK),
                   ("kueno-wordmark-mint.svg", MINT)]:
    s = 256.0 / text_h  # normalize height to 256
    body = wordmark_group(fill, s, 0, 0)
    doc = svg_doc(text_w * s + 20, 256, body, "kueno — wordmark")
    open(os.path.join(PUBLIC, name), "w").write(doc)
    print("wrote", name, f"{text_w*s:.1f}x256")

# --- horizontal lockup: symbol (256 tall) + wordmark, x-height = 104 ---
xh = None
bp2 = BoundsPen(glyph_set)
glyph_set[cmap[ord("x")]].draw(bp2)
xh = bp2.bounds[3] - bp2.bounds[1]
s = 104.0 / xh
gap = 60.0
wm_w = text_w * s
H = 256.0
W = 256 + gap + wm_w + 20
baseline = 128 - (s * text_h) / 2  # ink spans [baseline, baseline + s*text_h], centered on 128
for name, fill in [("kueno-lockup.svg", DARK), ("kueno-lockup-light.svg", INK)]:
    body = (
        f'<path fill="{fill}" fill-rule="evenodd" d="{SYMBOL_D}"/>\n'
        + wordmark_group(fill, s, 256 + gap, baseline)
    )
    open(os.path.join(PUBLIC, name), "w").write(svg_doc(W, H, body, "kueno — horizontal lockup"))
    print("wrote", name, f"{W:.1f}x{H:.0f}")

# --- stacked lockup: symbol on top, wordmark centered below ---
s2 = 300.0 / text_w  # wordmark width 300
wm_h = text_h * s2
gap2 = 44.0
W2 = 380.0
H2 = 256 + gap2 + wm_h
for name, fill in [("kueno-lockup-stacked.svg", DARK), ("kueno-lockup-stacked-light.svg", INK)]:
    sym = (f'<g transform="translate({(W2-256)/2:.2f},0)">'
           f'<path fill="{fill}" fill-rule="evenodd" d="{SYMBOL_D}"/></g>')
    baseline2 = 256 + gap2  # ink top starts right after the gap
    body = sym + "\n" + wordmark_group(fill, s2, (W2 - text_w * s2) / 2, baseline2)
    open(os.path.join(PUBLIC, name), "w").write(svg_doc(W2, H2, body, "kueno — stacked lockup"))
    print("wrote", name, f"{W2:.0f}x{H2:.1f}")
