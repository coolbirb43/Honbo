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

## GitHub Pages setup (do once — required for live site)

Open: https://github.com/coolbirb43/Honbo/settings/pages

**Option A (recommended): GitHub Actions**

1. **Build and deployment → Source:** **GitHub Actions** (not “Deploy from a branch”)  
2. After the next push to `main`, open **Actions** and confirm **Deploy site to GitHub Pages** is green  
3. Custom domain: `honbo.com` → save → **Enforce HTTPS** when DNS is verified  

**Option B: Branch deploy**

1. **Source:** **Deploy from a branch**  
2. **Branch:** `main` only · **Folder:** `/docs` (not `/` and not `v1`)  
3. Custom domain: `honbo.com` → **Enforce HTTPS**  

Only **`main`** exists on GitHub now. If Pages was still pointed at a deleted branch (`v1`, etc.), open Settings → Pages and set **`main`** + **`/docs`** (or **GitHub Actions**) — then save to trigger a new deploy.

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
