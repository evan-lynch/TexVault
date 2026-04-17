#!/usr/bin/env python3
"""
Generates the TexVault extension icons (16, 48, 128 px) as PNG files
using only Python standard library — no external dependencies needed.

Design: emerald green background (#059669) with a white "Tv" monogram.
The 16 px icon omits text (too small) and uses a solid green square.

Run from anywhere:
    python3 icons/create_icons.py
"""

import struct, zlib, os

OUT_DIR  = os.path.dirname(os.path.abspath(__file__))
EMERALD  = (5, 150, 105)   # #059669
WHITE    = (255, 255, 255)
DARK_BG  = (4, 120, 87)    # #047857 — slightly deeper, used for subtle border

# ── Bitmap glyphs (5 × 7, 1 = filled) ───────────────────────────────────────

T = [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
]

V = [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
]

# ── PNG encoder ───────────────────────────────────────────────────────────────

def _chunk(tag, data):
    body = tag + data
    return struct.pack('>I', len(data)) + body + struct.pack('>I', zlib.crc32(body) & 0xFFFFFFFF)

def encode_png(rows):
    """rows: list of lists of (r,g,b) tuples."""
    h = len(rows)
    w = len(rows[0])
    raw = bytearray()
    for row in rows:
        raw += b'\x00'          # filter type: None
        for r, g, b in row:
            raw += bytes([r, g, b])
    ihdr = _chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
    idat = _chunk(b'IDAT', zlib.compress(bytes(raw), 9))
    iend = _chunk(b'IEND', b'')
    return b'\x89PNG\r\n\x1a\n' + ihdr + idat + iend

# ── Icon renderer ─────────────────────────────────────────────────────────────

def render_glyph(glyph, ox, oy, scale, canvas, color):
    """Paint a glyph onto a canvas (list of lists of rgb tuples)."""
    h = len(canvas)
    w = len(canvas[0])
    for gy, row in enumerate(glyph):
        for gx, bit in enumerate(row):
            if not bit:
                continue
            for sy in range(scale):
                for sx in range(scale):
                    px = ox + gx * scale + sx
                    py = oy + gy * scale + sy
                    if 0 <= px < w and 0 <= py < h:
                        canvas[py][px] = color

def make_icon(size):
    canvas = [[EMERALD] * size for _ in range(size)]

    # Subtle 1 px inner border (slightly darker green) — gives a polished edge
    for i in range(size):
        canvas[0][i]      = DARK_BG
        canvas[size-1][i] = DARK_BG
        canvas[i][0]      = DARK_BG
        canvas[i][size-1] = DARK_BG

    if size >= 32:
        glyph_h  = 7            # rows in each glyph definition
        glyph_w  = 5            # cols in each glyph definition
        scale    = max(1, size // 20)
        gap      = max(1, scale)

        total_w  = (glyph_w * scale) * 2 + gap
        total_h  = glyph_h * scale

        ox_t = (size - total_w) // 2
        ox_v = ox_t + glyph_w * scale + gap
        oy   = (size - total_h) // 2

        render_glyph(T, ox_t, oy, scale, canvas, WHITE)
        render_glyph(V, ox_v, oy, scale, canvas, WHITE)

    return encode_png(canvas)

# ── Write files ───────────────────────────────────────────────────────────────

for size in (16, 48, 128):
    path = os.path.join(OUT_DIR, f'icon{size}.png')
    with open(path, 'wb') as f:
        f.write(make_icon(size))
    print(f'  created  {path}')

print('Done.')
