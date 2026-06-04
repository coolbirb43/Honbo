# Honbo SEO checklist (after deploy)

On-page SEO is implemented in `index.html` (meta tags, structured data, sitemap). Regenerate the sitemap after deploy with:

```bash
python scripts/generate_sitemap.py
```

(or `python scripts/build.py`, which runs it automatically). **No one can guarantee #1 on Google** — ranking also depends on Google Business Profile, reviews, backlinks, and how often people search for your exact brand name.

## Do these next (high impact)

1. **Google Search Console** — Add property `https://honbo.com`, verify ownership, submit `https://honbo.com/sitemap.xml`.
2. **Google Business Profile** — Create or claim listings for **both** Wan Chai and Central addresses (same NAP as the website).
3. **Bing Webmaster Tools** — Submit the same sitemap.
4. **Instagram / social bios** — Link to `https://honbo.com` (consistent URL everywhere).
5. **foodpanda & delivery listings** — Ensure they link to honbo.com where allowed.

## Brand queries (“Honbo”, “Honbo burger”)

You should rank well once Google indexes the site if you own **honbo.com** and have few competing brands with the same name. Keep posting on Instagram and get local food blogs to link to you.

## “Smash burgers Hong Kong” (competitive)

Harder — compete with Time Out, SCMP, TripAdvisor listicles. Tactics:

- Press page already links to FT, Bloomberg, Time Out (good for trust).
- Ask happy customers for **Google reviews** mentioning “smash burger”.
- Optional later: a short `/blog` or news post (e.g. “What is a smash burger?”) — only if you want more content.

## Monitor monthly

- Search Console → Performance → queries containing `honbo`, `smash burger`, `漢堡`
- Fix any “Coverage” or “Mobile usability” errors
