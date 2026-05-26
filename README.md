# Honbo 漢堡 — Website

Hong Kong smash burger restaurant site (static HTML/CSS/JS).

**Live site (after GitHub Pages is enabled):** https://coolbirb43.github.io/Honbo/

## GitHub Pages setup

1. Open your repo: https://github.com/coolbirb43/Honbo  
2. Go to **Settings** → **Pages** (left sidebar).  
3. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.  
4. **Branch:** `main` · **Folder:** `/src` → click **Save**.  
5. Wait 1–3 minutes. GitHub will show the live URL at the top of the Pages settings page.

Your site will be at **https://coolbirb43.github.io/Honbo/**

> **Note:** Use `/src` as the folder so `index.html` is the site entry point. Images live in `src/assets/` so they deploy with the site.

## View locally

```bash
cd src
python -m http.server 8765
```

Then visit http://localhost:8765

## Structure

- `src/` — `index.html`, `styles.css`, `script.js`, `assets/` (images)
- `assets/` (repo root) — `plan.txt` and local-only files (e.g. menu PDF)

The full menu PDF (`HONBONEWMENU_15x30_MASTTERFILE_3.pdf`) is kept locally only — it exceeds GitHub’s 100MB file size limit.
