#!/usr/bin/env python3
"""Minify CSS/JS for production. Run from repo root: python scripts/build.py"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"


def minify_css(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s*([{}:;,>+~])\s*", r"\1", text)
    return text.strip()


def minify_js(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    text = re.sub(r"(^|[^:])//.*?$", r"\1", text, flags=re.M)
    text = re.sub(r"\n+", "\n", text)
    lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
    return "".join(lines)


def main() -> None:
    css_src = DOCS / "css" / "styles.css"
    js_src = DOCS / "js" / "app.js"
    css_out = DOCS / "css" / "styles.min.css"
    js_out = DOCS / "js" / "app.min.js"

    if css_src.exists():
        css_out.write_text(minify_css(css_src.read_text(encoding="utf-8")), encoding="utf-8")
        print(f"Wrote {css_out.relative_to(ROOT)} ({css_out.stat().st_size} bytes)")

    if js_src.exists():
        js_out.write_text(minify_js(js_src.read_text(encoding="utf-8")), encoding="utf-8")
        print(f"Wrote {js_out.relative_to(ROOT)} ({js_out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
