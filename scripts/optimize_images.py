#!/usr/bin/env python3
"""Resize and compress images for web. Run from repo root: python scripts/optimize_images.py"""

from __future__ import annotations

import io
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "docs" / "assets"

JPEG_QUALITY = 82
WEBP_QUALITY = 82
PNG_COMPRESS = 9


def save_webp(img: Image.Image, path: Path) -> int:
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
    img.save(path, "WEBP", quality=WEBP_QUALITY, method=6)
    return path.stat().st_size


def save_jpeg(img: Image.Image, path: Path) -> int:
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    return path.stat().st_size


def save_png(img: Image.Image, path: Path) -> int:
    if img.mode not in ("RGBA", "RGB", "P"):
        img = img.convert("RGBA")
    img.save(path, "PNG", optimize=True, compress_level=PNG_COMPRESS)
    return path.stat().st_size


def resize_max(img: Image.Image, max_px: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_px:
        return img
    scale = max_px / max(w, h)
    new_size = (max(1, int(w * scale)), max(1, int(h * scale)))
    return img.resize(new_size, Image.Resampling.LANCZOS)


def process_file(path: Path, max_px: int, recompress_jpeg: bool = False) -> tuple[int, int, int]:
    before = path.stat().st_size
    img = Image.open(path)
    img = resize_max(img, max_px)

    webp_path = path.with_suffix(".webp")
    webp_size = save_webp(img, webp_path)

    after = before
    if path.suffix.lower() in (".jpg", ".jpeg"):
        if recompress_jpeg:
            after = save_jpeg(img, path)
    elif path.suffix.lower() == ".png":
        after = save_png(img, path)

    return before, after, webp_size


def main() -> None:
    jobs: list[tuple[Path, int, bool]] = []

    photos = ASSETS / "photos"
    if photos.exists():
        for p in sorted(photos.glob("*")):
            if p.suffix.lower() not in (".jpg", ".jpeg", ".png"):
                continue
            max_px = 1920 if p.name == "hero.jpg" else 1200
            jobs.append((p, max_px, True))

    menu = ASSETS / "menu"
    if menu.exists():
        for p in sorted(menu.glob("*")):
            if p.suffix.lower() != ".png":
                continue
            jobs.append((p, 400, False))

    brand = ASSETS / "brand"
    if brand.exists():
        for p in sorted(brand.glob("*")):
            ext = p.suffix.lower()
            if ext not in (".png", ".jpg", ".jpeg"):
                continue
            if p.name.lower() == "new_logo.png":
                jobs.append((p, 1080, False))
            elif p.name.lower().startswith("honbo_"):
                jobs.append((p, 320, ext in (".jpg", ".jpeg")))
            elif "icon" in p.name.lower():
                jobs.append((p, 512, False))
            elif ext == ".png":
                jobs.append((p, 320, False))

    total_before = 0
    total_after = 0
    total_webp = 0

    print("Optimizing images...")
    for path, max_px, recompress in jobs:
        b, a, w = process_file(path, max_px, recompress)
        total_before += b
        total_after += a
        total_webp += w
        print(
            f"  {path.relative_to(ROOT)}: "
            f"{b/1024:.0f} KB -> {a/1024:.0f} KB (+ webp {w/1024:.0f} KB)"
        )

    print(
        f"\nDone. Assets: {total_before/1024/1024:.1f} MB -> "
        f"{total_after/1024/1024:.1f} MB (+ {total_webp/1024/1024:.1f} MB webp)"
    )


if __name__ == "__main__":
    main()
