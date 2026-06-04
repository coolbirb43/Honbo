#!/usr/bin/env python3
"""Generate docs/sitemap.xml for honbo.com. Run from repo root: python scripts/generate_sitemap.py"""

from datetime import date
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "sitemap.xml"
SITE = "https://honbo.com"
NS = "http://www.sitemaps.org/schemas/sitemap/0.9"

# Single-page site: one canonical URL (hash fragments are not indexed as separate pages).
URLS = [
    {"loc": f"{SITE}/", "changefreq": "weekly", "priority": "1.0"},
]


def main() -> None:
    lastmod = date.today().isoformat()
    ET.register_namespace("", NS)
    urlset = ET.Element(f"{{{NS}}}urlset")

    for entry in URLS:
        url = ET.SubElement(urlset, f"{{{NS}}}url")
        ET.SubElement(url, f"{{{NS}}}loc").text = entry["loc"]
        ET.SubElement(url, f"{{{NS}}}lastmod").text = lastmod
        ET.SubElement(url, f"{{{NS}}}changefreq").text = entry["changefreq"]
        ET.SubElement(url, f"{{{NS}}}priority").text = entry["priority"]

    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ")
    OUT.write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        + ET.tostring(urlset, encoding="unicode")
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT.relative_to(ROOT)} ({len(URLS)} URL(s), lastmod={lastmod})")


if __name__ == "__main__":
    main()
