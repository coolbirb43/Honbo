# Deploy Honbo site — GitHub Pages + GoDaddy (honbo.com)

## Part 1 — GitHub Pages

### 1. Build and push

```bash
cd "honbo website"
python scripts/build.py
git add docs/
git commit -m "Update site"
git push origin v3-vsco-scroll
```

### 2. Enable Pages

1. https://github.com/coolbirb43/Honbo → **Settings** → **Pages**
2. **Branch:** `v3-vsco-scroll` · **Folder:** `/docs` → **Save**
3. Temporary URL: https://coolbirb43.github.io/Honbo/

`docs/CNAME` is already set to **honbo.com**.

---

## Part 2 — GoDaddy DNS for honbo.com

### 1. GitHub custom domain

1. **Settings** → **Pages** → **Custom domain:** `honbo.com` → **Save**
2. When DNS verifies, enable **Enforce HTTPS**

### 2. GoDaddy DNS records

GoDaddy → **My Products** → **honbo.com** → **DNS** → **Manage DNS**

#### Root domain `honbo.com` (required)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `185.199.108.153` | 1 Hour |
| A | @ | `185.199.109.153` | 1 Hour |
| A | @ | `185.199.110.153` | 1 Hour |
| A | @ | `185.199.111.153` | 1 Hour |

#### Optional — `www.honbo.com`

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | `coolbirb43.github.io` | 1 Hour |

In GitHub Pages, you can set the primary domain to `honbo.com` and use GoDaddy **Forwarding** so `www.honbo.com` redirects to `honbo.com` (or the reverse).

### 3. Wait and verify

- DNS can take **15 minutes – 48 hours**
- Check: https://www.whatsmydns.net/#A/honbo.com
- GitHub Pages shows a green check when ready

### 4. HTTPS

Turn on **Enforce HTTPS** in GitHub Pages after the domain is verified.

---

## Checklist

- [ ] `python scripts/build.py` run before each deploy
- [ ] Pages branch = `v3-vsco-scroll`, folder = `/docs`
- [ ] Custom domain = `honbo.com`
- [ ] Four A records added in GoDaddy
- [ ] Site loads at https://honbo.com
