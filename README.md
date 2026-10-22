# KAGAMI
index.html (page) · assets/characters/*.webp (your artwork) · functions/api/feed.js (live news, Cloudflare Pages Function)

## Deploy from an Android phone (free)
1. github.com → New repository → Add file → Upload files. Upload everything, keeping folders (functions/api/feed.js, assets/characters/...).
2. dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Framework: None. Build command: empty. Output directory: `/`. Save and Deploy.
4. Your public address is `https://<project>.pages.dev`. Share that link.
5. To update: edit a file on GitHub and commit; Cloudflare redeploys automatically.

## Notes
- Live news only works on Cloudflare Pages with the /functions folder. Without it the site shows clearly labelled demo content.
- Feed endpoints in feed.js are unverified; the site shows which sources failed. Free-tier request limits apply (check Cloudflare's current limits).
- Swap artwork by replacing files in assets/characters/ (same filenames). No API keys are used.

## Effects (v2)
Background canvas (particles + streaks), hero entrance, glitch, parallax and reveals are in index.html. They switch to a lighter mode on save-data, weak devices or low battery, and stop for prefers-reduced-motion.
