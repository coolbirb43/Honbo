# Deploy Honbo — honbo.com (single branch: `main`)

## Live site = `main` branch only

All website files live in **`docs/`** on branch **`main`**.

After every change:

```bash
python scripts/build.py
git checkout main
git add docs/
git commit -m "Update site"
git push origin main
```

Wait 1–3 minutes, then hard refresh (**Ctrl + Shift + R**).

---

## GitHub Pages setup (do once)

1. https://github.com/coolbirb43/Honbo/settings/pages  
2. **Build and deployment → Source:** choose **GitHub Actions** (recommended)  
   - The workflow `.github/workflows/deploy-pages.yml` deploys `docs/` on every push to `main`  
3. **OR** use **Deploy from a branch** → Branch: **`main`** → Folder: **`/docs`**  
   - Do **not** use `v1`, `v2-redesign`, or root `/`  
4. **Custom domain:** `honbo.com`  
5. When DNS is verified → **Enforce HTTPS**

---

## GoDaddy DNS (honbo.com)

Four **A** records for **@**:

| Type | Name | Value |
|------|------|--------|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |

Remove old A/CNAME records that point to Vercel or other hosts.

Optional: forward `www.honbo.com` → `https://honbo.com` in GoDaddy.

---

## View locally (same files as live)

```bash
cd docs
python -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080/

---

## If you still see the old v1 layout

1. Confirm Pages source is **`main`** + **`/docs`** (or **GitHub Actions**)  
2. Hard refresh or try a private/incognito window  
3. Check https://github.com/coolbirb43/Honbo/actions — latest deploy should be green
