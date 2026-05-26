# Honbo 漢堡 — Website

Hong Kong smash burger restaurant site (static HTML/CSS/JS).

**Live site:** https://coolbirb43.github.io/Honbo/

## Branches

| Branch | Description |
|--------|-------------|
| `v1` | First version — original layout (frozen) |
| `v2-redesign` | Updated version — [Burger & Beyond](https://burgerandbeyond.co.uk)-inspired parallax layout, Honbo branding |
| `main` | Currently matches **v1** |

To preview v2 locally: `git checkout v2-redesign`

To deploy v2 on GitHub Pages: **Settings → Pages → Branch:** `v2-redesign` · **Folder:** `/docs`

## GitHub Pages setup

1. Open your repo: https://github.com/coolbirb43/Honbo  
2. Go to **Settings** → **Pages** (left sidebar).  
3. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.  
4. **Branch:** `main` · **Folder:** `/docs` → click **Save**.  
5. Wait 1–3 minutes. GitHub will show the live URL at the top of the Pages settings page.

Your site will be at **https://coolbirb43.github.io/Honbo/**

> GitHub Pages only allows **root** or **docs** as the publish folder — not `src`. The site files live in `docs/`.

## View locally

```bash
cd docs
python -m http.server 8765
```

Then visit http://localhost:8765

## Structure

- `docs/` — `index.html`, `styles.css`, `script.js`, `assets/` (images)
- `assets/` (repo root) — `plan.txt` and local-only files (e.g. menu PDF)

The full menu PDF (`HONBONEWMENU_15x30_MASTTERFILE_3.pdf`) is kept locally only — it exceeds GitHub’s 100MB file size limit.
