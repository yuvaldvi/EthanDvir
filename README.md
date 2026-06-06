# Ethan Dvir Motorsport

Static site for **Ethan Dvir Motorsport** — driver site covering the career roadmap, on-track results, and partnership opportunities.

Pure HTML / CSS / vanilla JS. No build step, no framework, no dependencies to install.

## Pages

- `index.html` — home / hero
- `about.html` — driver bio
- `career.html` — interactive roadmap + honours
- `partner.html` — partnership pitch + car map
- `contact.html` — contact form + links

## Local preview

Open `index.html` directly in a browser, or serve the folder with any static server:

```sh
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then visit http://localhost:8000

## Deploy (Netlify via GitHub)

1. Push this folder to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project → GitHub** → pick the repo.
3. **Build settings**: leave everything default. Publish directory: `.` (already set in `netlify.toml`).
4. Deploy. Custom domain can be attached in Site settings → Domain management.

`netlify.toml` is committed at the repo root and handles:
- No build command (static publish from root)
- Long cache headers on `/assets/*`
- Short cache headers on HTML
- Pretty URLs (`/career` → `/career.html`)
- Basic security headers

## File layout

```
.
├── index.html
├── about.html
├── career.html
├── partner.html
├── contact.html
├── styles.css
├── site.js
├── image-slot.js
├── tweaks-app.jsx
├── tweaks-panel.jsx
├── netlify.toml
├── assets/
│   ├── *.jpg / *.png      photography + logos
│   └── favicon.png
└── README.md
```

## Notes

- Fonts come from Google Fonts (Saira, Saira Condensed, Hanken Grotesk) — no local files needed.
- The Tweaks panel (`tweaks-app.jsx` / `tweaks-panel.jsx`) is a dev tool; safe to ship or remove from the script tags before going live if you want a leaner shipped page.
