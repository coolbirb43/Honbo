# Fresh GitHub repo — fix stuck live site

The old `coolbirb43/Honbo` repo has a stuck GitHub Pages deployment (serving `styles.css` / old layout while `main` has the new site). Starting a **new empty repo** is the fastest fix.

Your **local `docs/` folder** is the correct site. DNS for `honbo.com` can stay as-is.

---

## Step 1 — Create the new repo (GitHub website)

1. Log in at https://github.com/new  
2. **Repository name:** e.g. `honbo-website` (or `Honbo` after you delete the old repo)  
3. **Public**  
4. Do **not** add README, .gitignore, or license (empty repo)  
5. Click **Create repository**

Copy the new repo URL, e.g. `https://github.com/coolbirb43/honbo-website.git`

---

## Step 2 — Disconnect domain from the OLD repo (important)

Before deleting or abandoning the old repo:

1. Open https://github.com/coolbirb43/Honbo/settings/pages  
2. **Custom domain:** clear `honbo.com` and save (or remove the domain)  
3. Optional: **Settings → General → Danger zone → Delete this repository**

If you skip this, the new repo may not accept `honbo.com` until GitHub releases it (can take a few minutes).

---

## Step 3 — Push your local site to the new repo

In PowerShell, from this folder:

```powershell
cd "c:\Users\Acer\Desktop\honbo website"

python scripts/build.py

# Point git at the NEW repo (replace URL with yours)
git remote set-url origin https://github.com/coolbirb43/honbo-website.git

# One clean push of everything on main
git push -u origin main
```

If `git push` is rejected (unrelated histories), use a fresh git history instead:

```powershell
cd "c:\Users\Acer\Desktop\honbo website"

Remove-Item -Recurse -Force .git
git init -b main
git add .
git commit -m "Initial commit: Honbo website"
git remote add origin https://github.com/coolbirb43/honbo-website.git
git push -u origin main
```

---

## Step 4 — Turn on GitHub Pages (new repo)

1. New repo → **Settings** → **Pages**  
2. **Build and deployment → Source:** **Deploy from a branch**  
3. **Branch:** `main` · **Folder:** `/docs`  
4. Save — wait 1–3 minutes  
5. Check: `https://<username>.github.io/<repo-name>/`  
   - You should see the **new** layout (hero image, Locations, Best Sellers carousel)  
   - View page source: should reference `css/styles.min.css`, not `styles.css`

6. **Custom domain:** `honbo.com` → Save → enable **Enforce HTTPS** when offered

`docs/CNAME` already contains `honbo.com` — keep that file in the repo.

---

## Step 5 — Verify

| Check | Expected |
|--------|----------|
| Local http://127.0.0.1:8080/ | New design |
| GitHub Pages URL | New design |
| https://honbo.com | New design (after DNS + domain on new repo) |

Hard refresh: **Ctrl + Shift + R** or use a private/incognito window.

---

## After it works

- Delete the old repo if you no longer need it  
- Future updates: `python scripts/build.py` → `git add docs/` → `git commit` → `git push`

---

## Same repo name `Honbo`?

You can only reuse the name after deleting the old repository. Steps: remove custom domain → delete old `Honbo` → create new `Honbo` → push → Pages `main` + `/docs`.

GitHub project URL stays `https://coolbirb43.github.io/Honbo/` if you use the same repo name.
