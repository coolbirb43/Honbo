# Honbo 漢堡 — Website

**Domain:** [honbo.com](https://honbo.com)  
**Hosting:** GitHub Pages (`docs/` folder)

## Resources used

| Resource | Use |
|----------|-----|
| [Google Fonts](https://fonts.google.com/) | Lobster, Pacifico, Barlow Condensed, Noto Sans TC |
| [GitHub Pages](https://pages.github.com/) | Static site hosting |
| [Google Maps embed](https://www.google.com/maps) | Wan Chai & Central maps |
| HTML5 / CSS3 / JavaScript | No framework |
| Python 3 (`scripts/build.py`) | Minify CSS/JS before deploy |

## Project layout

```
docs/                 Live site (published by GitHub Pages)
  index.html
  CNAME               honbo.com
  css/                styles.css · styles.min.css
  js/                 app.js · app.min.js
  assets/brand/       Logos, hero icon
  assets/menu/        Burger illustrations
  assets/photos/      Background photos
scripts/build.py      Run before deploy
DEPLOYMENT.md         GoDaddy + GitHub setup for honbo.com
```

## Deploy

```bash
python scripts/build.py
git add docs/
git commit -m "Deploy"
git push origin v3-vsco-scroll
```

See **DEPLOYMENT.md** for GoDaddy DNS steps.
