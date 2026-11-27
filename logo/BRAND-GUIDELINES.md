# kueno — logo & icon guidelines (v1)

Mark: **Tuxedo Head** — solid geometric cat head with a keycap-square face,
square eyes and a small triangular nose. The cat is the same tuxedo desk
companion as the `CAT.EXE` widget in the portfolio.

All masters are pure SVG paths (no live text, no rasters, no filters).
Wordmark "kueno" is Space Grotesk SemiBold (OFL), converted to outlines.

## Files

| File | Use |
|---|---|
| `public/logo/kueno-symbol.svg` | master symbol, dark ink `#170e1f`, transparent bg |
| `public/logo/kueno-symbol-small.svg` | simplified small-size cut (favicon/16–32 px) |
| `public/logo/kueno-symbol-mono-f3edf7.svg` | light ink — **for dark backgrounds** |
| `public/logo/kueno-symbol-mono-c6e3d1.svg` | mint accent — dark backgrounds |
| `public/logo/kueno-symbol-mono-f3e6a2.svg` | butter accent — dark backgrounds |
| `public/logo/kueno-symbol-black.svg` / `-white.svg` | one-colour print/reversed |
| `public/logo/kueno-symbol-square.svg` | centred on square canvas (avatar/social) |
| `public/logo/kueno-symbol-app-icon.svg` | app icon: ink mark on `#170e1f` rounded tile |
| `public/logo/kueno-lockup.svg` / `-light.svg` | horizontal lockup (symbol + wordmark) |
| `public/logo/kueno-lockup-stacked(-light).svg` | stacked lockup |
| `public/logo/kueno-wordmark(-light/-mint).svg` | wordmark only |
| `public/logo/favicon.svg` / `favicon.ico` | browser tab icons (small cut) |
| `public/logo/apple-touch-icon.png`, `icon-192/512.png`, `maskable-512.png` | PWA / iOS icons |
| `public/logo/site.webmanifest` | manifest (already linked in `index.html`) |

## Colour

| Name | HEX | RGB | CMYK (approx) | Role |
|---|---|---|---|---|
| Canvas Dark | `#170e1f` | 23 14 31 | 26 55 0 88 | dark theme background, app-icon tile |
| Ink | `#f3edf7` | 243 237 247 | 0 4 0 3 | mark on dark |
| Cream | `#f3efe7` | 243 239 231 | 0 2 5 5 | light theme background |
| Mint | `#c6e3d1` | 198 227 209 | 13 0 8 11 | primary accent |
| Butter | `#f3e6a2` | 243 230 162 | 0 5 33 5 | secondary accent |

Rules: one-colour versions must stay legible — light ink on Canvas Dark,
dark ink on Cream. Never place the dark mark on dark, or light mark on light.

## Clear space & minimum size

- Clear space = the height of one eye (≈ 10 % of mark height) on all sides.
- Minimum digital size: symbol **16 px**, lockup **120 px** wide.
- Below 32 px always use `kueno-symbol-small.svg` (no inner-ear holes).

## Misuse

- Don't recolour outside the palette, add gradients/shadows/rotations.
- Don't stretch, outline, or redraw the face features.
- Don't put the mark on busy imagery without a solid tile behind it
  (use `kueno-symbol-app-icon.svg`).
- Wordmark is always lowercase "kueno", never spaced out or capitalised.

## Favicon / web icons

Already wired in `index.html` (`/logo/favicon.svg`, `/logo/favicon.ico`,
`/logo/apple-touch-icon.png`, manifest). Social share image (`og:image`)
stays as the profile photo `gambar.jpg`.

---
*Preview renders: `logo/kit/preview/` (kit variants + web dark/light).
Wordmark regenerable via `logo/make_wordmark.py` (needs `logo/SpaceGrotesk.ttf`).
Trademark clearance not performed — run a professional search before
registering.*
