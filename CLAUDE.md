# Personal Website — Khoren Mirzakhanian

A cinematic personal site ("The Grade & The Sky") for a colorist/editor +
wingsuit camera flyer — public-facing role labels are **"Picture Finishing"**
and **"Aerial Photography"** (`profile.roles` in js/data.js + the `<title>`
tag; owner request). Earthy/muted palette, elegant serif (Cormorant
Garamond) + Hanken Grotesk body + JetBrains Mono metadata. Originally mocked up
in Claude Design, implemented here as a static React-via-CDN site (no build
step — React UMD + Babel standalone in the browser).

## Layout & how to run
- **Entry point:** `index.html` at the repo root. Serve the root as a static
  site (any host: GitHub Pages, Netlify, Vercel). Locally needs a server (not
  `file://`) so the photo sidecar `fetch()`es resolve — e.g.
  `python3 -m http.server` then open the printed URL.
- `css/site.css` — design tokens (oklch palette, light/dark themes), type,
  buttons, utilities. `css/components.css` — nav, splash, grade-reveal, album,
  lightbox, footer, responsive.
- `js/data.js` (`window.SITE`) — all content (profile, posts, photos, work, now,
  links). The single place to edit copy.
- `js/components.jsx` — Nav, Footer, Timecode, SocialIcons, Slot, GradeReveal,
  ColorBars, PostRow. `js/pages-main.jsx` — Splash + Home. `js/pages-sub.jsx` —
  Blog, Album, Now, Work, Contact, Links, Lightbox. `js/app.jsx` — router/theme/
  tweaks/mount.
- `image-slot.js` — `<image-slot>` web component (drag-drop fillable photos).
- `tweaks-panel.jsx` — live tweak panel (name, theme, accent, serif, splash).
- `.image-slots.*.state.json` — saved photos (see Photo storage below).
- `project/` + `chats/` + `README.md` — the original Claude Design handoff
  bundle, kept for reference. The live site is the root copy, NOT `project/`.

## Cache-busting
Every script/style in `index.html` is loaded with `?v=N`. **Bump the version
whenever you edit that file** or a browser may serve a stale cached copy.
Current: site.css v16, components.css v51, image-slot v14, data.js v21,
tweaks-panel v7, components.jsx v26, pages-main.jsx v30, pages-sub.jsx v24,
app.jsx v15. (If these drift, `index.html` is the truth — update this list.)

## Active vs hidden pages (site under construction)
Active nav: **Photos · Films · Now · Links · Contact**, with the splash as the
landing. Note the **route ids are unchanged** — the "Photos" tab routes to
`album` and the "Films" tab routes to `projects`; only the display labels were
renamed (keeps routing, deep links, and the `album-*`/`project-*` photo state
files intact).
- `js/app.jsx` `ROUTES = ["splash", "album", "projects", "now", "links", "contact"]`.
  **home / work / blog are hidden** (omitted from ROUTES) but their components
  stay mapped — re-add the ids to restore. Brand-logo + splash "Enter" go to
  `album`.
- `js/components.jsx` `NAV` shows Photos / Films / Now / Links / Contact
  (`["album","Photos"]`, `["projects","Films"]`; hidden home/work/blog commented
  above). The Album page header kicker reads "Photos" to match.

## Films page (Projects)
IMDb "Full list of credits" button sits in the `PageHead` and is **centered**
(`.imdb-credits-link` in components.css: `display:flex; width:fit-content;
margin:18px auto 0`). It's the sole user of that class.

## Photo storage (image-slot.js)
Album + splash photos are user-filled `<image-slot>` components. Storage is
**one sidecar file per slot** (the host write bridge caps each write at ~2MB and
only allows `*.state.json` basenames):
- Manifest `.image-slots.state.json` → `{"ids":[...]}` lists live slots.
- Per-slot `.image-slots.<id>.state.json` → `{u,s,x,y}` (data-URL + crop frame).
- 16 photos saved (album-p1..p16). Splash slideshow reuses the SAME album ids
  (`SPLASH_SHOTS` in pages-main.jsx) → album is the single source of truth.
- Saving big uploads: downscale via canvas to JPEG (~1920px, q≈0.85), write
  per-slot files, update the manifest. WebP `toDataURL` may be unsupported in
  some runtimes (falls back to PNG/JPEG).

## No-crop album (`fit="native"`)
Album grid uses `<Slot fit="native">` so each photo's slot adopts the photo's
own aspect ratio (no crop/letterbox); masonry columns absorb the heights. The
lightbox uses a plain `<img class="lb-photo">` at natural aspect, scaled up to
~84vh / full width — no crop, full stored resolution.

## Lightbox portal
`Lightbox` (pages-sub.jsx) renders via `ReactDOM.createPortal(lb, document.body)`
— required because `.page`'s `pagein` animation leaves a residual identity
`transform` that would otherwise anchor the `position:fixed` overlay to the page
(dropping the photo below the fold) instead of the viewport.

## Splash
- **Hero cluster** (`.splash-body`): name/roles/tagline/buttons/color-bars/social
  icons at `transform: scale(0.6)` pinned lower-left; the whole cluster scales up
  to `scale(1)` on hover (0.55s). Tagline = `window.SITE.profile.tagline`
  ("Under construction. Coming soon.").
- **Background slideshow** behind a light **frosted-glass veil** (`.splash-veil`,
  `blur(3.1px)`, gradient-masked: small soft band behind top kickers + larger
  band behind the lower text, bottom tint 24%). Order is shuffled once per
  mount. Tweaks → Splash → Treatment toggles slideshow / single photo.
  Sidecars hydrate **progressively** (one notify per file, album ids first —
  see image-slot.js `hydrate()`); `availableShots` filters to hydrated slots,
  so the slideshow snaps to the first loaded photo on its own — do NOT add a
  "seek" effect for this (a broken one once blanked the whole site, PR #19).
- **Text legibility** (three layers): (1) always-on subtle `--splash-scrim`
  text-shadow, strengthened on `.bg-dark`, none on `.bg-light`; (2) film-style
  dark rgba vignette (bottom + left, inline gradient in pages-main.jsx) that
  works on any photo regardless of theme; (3) **dynamic contrast** — JS samples
  brightness behind the lower-left text (`regionBrightness`) and tags `.splash`
  `.bg-dark` (light ink) / `.bg-light` (softened dark ink). Threshold 0.52.
- **Buttons — two-tier layout:** "Enter the site" is a full-width primary,
  **disabled** while under construction (`.btn-blocked` — hazard diagonals,
  `pointer-events:none`, no `onClick`; re-enable by restoring
  `onClick={()=>go("home")}` and dropping the wrapper/class). Below it an
  equal-width ghost pair: **"Selected work"** → `go("projects")` (left) and
  **"Gallery"** (camera icon) → `go("album")` (right).

## Running timecode
Live SMPTE timecode anchored to one session epoch (`TC_EPOCH`) so every instance
stays in sync and continuous across navigation. Floats fixed top-center on every
page except splash (`.tc-top`, z-index 300); also in the splash + footer.

## Social icon buttons (`SocialIcons`/`SOCIALS`, js/components.jsx)
Row of 4 circular icon buttons (Instagram, IMDb, LinkedIn, Email) in the splash,
52px, spread with `justify-content: space-between` to span the button block's
width, with a **registration-mark crosshair separator** (`SocialSep`, 11px SVG,
`aria-hidden`, `pointer-events:none`) centered in each gap. Styles live in
**css/site.css** (`.social-row`/`.social-btn`/`.social-sep`), NOT components.css;
the only piece in components.css is the `.bg-dark` adaptive ink for the sep.
NOTE: in a sandboxed preview iframe Instagram/LinkedIn appear "blocked"
(`X-Frame-Options: DENY`) — a preview artifact only; they open fine in a real tab.

## Identity & real contact details (confirmed by owner)
Site owner **Khoren Mirzakhanian** (monogram KM). Studio/brand: **Kolorlux**.
- Email **khoren@kolorlux.com**
- Instagram `instagram.com/kolorlux` (@kolorlux)
- IMDb `imdb.com/name/nm5585716/`
- LinkedIn `linkedin.com/in/khorenmirzakhanian/`
Name/email live in `js/data.js` (`window.SITE.profile`); socials in
`SOCIALS`/`window.SITE.links`.

## Now page content (current, owner-provided)
FINISHING — "Finishing a 3 part limited series special." · Flying — "Lots of
paragliding, making up for lost flights and hours from 2025 season." · Building —
"This website, and a few automations for conform." · Reading — "After Death by
Dean Koontz". (Edit in `js/data.js` `now`.)

## Album / lightbox copy stripped (owner request)
The album hover-over caption overlay and the lightbox title/subtitle/shot-info
were removed — the album shows photos clean, the lightbox shows just the photo.

## Deploy (GitHub Pages → www.kolorlux.com)
`.github/workflows/pages.yml` assembles a clean `_site/` (site files + photo
sidecars + `.nojekyll`; never `chats/`, `project/`, or CLAUDE.md) and deploys
on every push to main. `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` is set at
workflow level (Node 20 actions deprecated June 2026). A broken push to main
blanks the LIVE site immediately — there is no staging. Lesson from PR #19:
a `ReferenceError` in any JSX file (e.g. a misnamed variable) crashes the
entire React tree → blank page for all visitors; sanity-check identifiers
against the file you're editing, and always bump `?v=N` for every file touched.
Note: the kolorlux.com domain is unreachable from the Claude sandbox (network
policy 403) — verify deploys via the Actions run status instead of curl.
Root-level static files shipped by the workflow's `cp` line (besides the JS/CSS
and photo sidecars): `index.html image-slot.js tweaks-panel.jsx robots.txt
sitemap.xml og-image.jpg`. Add any new root asset to that line or it won't deploy.

## Analytics & SEO (all in `index.html` <head>)
- **Google Analytics 4** — Measurement ID `G-YJNE8XX3H1`. Standard gtag snippet
  PLUS a `hashchange` listener that fires a `page_view` per route (the site is a
  hash-routed SPA, so without it only the initial landing is counted). GA needs
  CSP allowances: `googletagmanager.com` in `script-src`; `*.google-analytics.com`
  + `*.googletagmanager.com` in `connect-src` and `img-src`.
- **SEO tags:** meta `description`, `<link rel=canonical>`, Open Graph block,
  Twitter card (`summary_large_image`), and a JSON-LD `Person` schema (name, job
  titles, Kolorlux, LA, sameAs → IMDb/Instagram/LinkedIn).
- **Social thumbnail:** `og-image.jpg` (1200×630, the standard 1.91:1) referenced
  by `og:image` + `twitter:image`. It was cropped from an owner-supplied aerial
  photo via Pillow (no ImageMagick/ffmpeg in the sandbox — `pip install Pillow`).
  NOTE: a pasted image is NOT written to the working dir; recover its bytes from
  the session transcript JSONL (base64 under message.content[].source.data).
- **Crawl files:** `robots.txt` (allow all + sitemap pointer) and `sitemap.xml`
  (single root URL — hash fragments aren't separate URLs to crawlers).
- Owner still needs to submit the sitemap in Google Search Console, and social
  platforms cache OG data — use each platform's re-scrape/debugger after deploy.
- Real page copy is still pending (tagline = "Under construction") — the biggest
  remaining SEO lever is actual content, not more tags.
