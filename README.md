# Honbo 漢堡 — Website

## Resources used

| Resource | Use |
|----------|-----|
| [Google Fonts](https://fonts.google.com/) | Lobster, Pacifico, Barlow Condensed, Noto Sans TC |
| [GitHub Pages](https://pages.github.com/) | Free static site hosting |
| [Google Maps embed](https://www.google.com/maps) | Wan Chai & Central location maps |
| HTML5 / CSS3 / JavaScript | Static site (no framework) |
| Python 3 (`scripts/build.py`) | Optional minify step before deploy |

## Project layout

```
docs/                 ← Live site (GitHub Pages publishes this folder)
  index.html
  css/                styles.css (edit) · styles.min.css (deployed)
  js/                 app.js (edit) · app.min.js (deployed)
  assets/
    brand/            Logos, hero icon
    menu/             Illustrated burger PNGs
    photos/           Compressed JPG backgrounds
  .nojekyll
  robots.txt

scripts/build.py      Regenerate *.min.css / *.min.js after edits

archive/              Local-only originals (not deployed)
DEPLOYMENT.md         GoDaddy domain + GitHub Pages setup
```

## Before you deploy

```bash
python scripts/build.py
```

Then commit and push. The live site loads `*.min.css` and `*.min.js`.

## Branches

| Branch | Notes |
|--------|--------|
| `v3-vsco-scroll` | Current redesign |
| `v2-backup-pre-v3` | Snapshot before animation experiments |
| `v1` | Original layout |
