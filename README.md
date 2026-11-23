# ICFR-2027 website

Static site (HTML, CSS, JS). No build step or server needed.

## Go live
1. Upload the whole folder contents to your host (cPanel public_html, Netlify, GitHub Pages, Cloudflare Pages, etc.).
2. Open `index.html` to preview locally.

## Fill in the "Updating soon" details
Edit `js/config.js`: email, phone, address, submission portal link, registration link, Google Maps link.
They appear on every page automatically and the matching buttons switch on.

## Before launch
- Replace `https://www.example.org/` with your real domain in `sitemap.xml`, `robots.txt` and the `canonical` / `og:` tags (search and replace across the HTML files).
- Add dates in `important-dates.html` and `index.html` (search for "Updating soon"), the programme in `schedule.html`, and speaker talk topics in `speakers.html`.
- Optional: replace the hero photo in `index.html` with your own campus image.
