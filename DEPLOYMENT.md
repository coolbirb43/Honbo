# Deploy Honbo site — GitHub Pages + GoDaddy domain

## Part 1 — GitHub Pages (hosting)

### 1. Push your code

```bash
cd "honbo website"
python scripts/build.py
git add docs/
git commit -m "Build production site"
git push origin v3-vsco-scroll
```

### 2. Turn on GitHub Pages

1. Open https://github.com/coolbirb43/Honbo  
2. **Settings** → **Pages**  
3. **Source:** Deploy from a branch  
4. **Branch:** `v3-vsco-scroll` (or `main` if you merge there)  
5. **Folder:** `/docs`  
6. Click **Save**  
7. Wait 1–3 minutes. Your site will be at:

   **https://coolbirb43.github.io/Honbo/**

### 3. Optional — use `main` as production

```bash
git checkout main
git merge v3-vsco-scroll
git push origin main
```

Then set Pages branch to `main` / folder `/docs`.

---

## Part 2 — Connect your GoDaddy domain

Replace `yourdomain.com` with your real domain (e.g. `honbo.hk`).

### 1. Add custom domain in GitHub

1. Repo → **Settings** → **Pages**  
2. Under **Custom domain**, enter: `www.yourdomain.com` (recommended) or `yourdomain.com`  
3. Click **Save**  
4. When DNS is correct, enable **Enforce HTTPS**

### 2. Create `docs/CNAME` (recommended)

Create a file `docs/CNAME` containing only:

```
www.yourdomain.com
```

Commit and push. GitHub uses this to keep the domain after each deploy.

### 3. Configure DNS in GoDaddy

Log in to [GoDaddy](https://www.godaddy.com/) → **My Products** → your domain → **DNS** / **Manage DNS**.

#### Option A — `www.yourdomain.com` (easiest)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | `coolbirb43.github.io` | 1 hour |

#### Option B — root domain `yourdomain.com` (no www)

GitHub Pages apex (root) uses **A records**, not CNAME:

| Type | Name | Value |
|------|------|--------|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |

Optional: redirect `www` → root or root → `www` in GoDaddy **Forwarding**.

### 4. Wait for DNS

- Usually **15 minutes – 48 hours**  
- Check: https://www.whatsmydns.net/  
- In GitHub Pages settings, a green check means DNS is verified  

### 5. HTTPS

After DNS verifies, turn on **Enforce HTTPS** in GitHub Pages. GoDaddy does not issue the certificate; GitHub does (free).

---

## Part 3 — After launch checklist

- [ ] Run `python scripts/build.py` before each deploy  
- [ ] Test on phone: menu, carousels, maps, mailto link  
- [ ] Confirm `hello@honbo.hk` is the email you want for Inquire  
- [ ] Pages branch = `/docs`  

---

## Security note (Inspect Element)

Any website sent to a browser can be viewed in DevTools (HTML, CSS, JS, images). **This cannot be fully prevented** for a static site.

What we do:

- Production uses **minified** CSS/JS (harder to read, smaller downloads)  
- No API keys or secrets in the repo  
- Copyright notice in the footer  

What does **not** work reliably: disabling right-click, “hiding” source, or blocking Inspect Element — and those hurt real visitors.

To protect brand assets long term, register **copyright** / trademark for Honbo artwork and logos in Hong Kong.
