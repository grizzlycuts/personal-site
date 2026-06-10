# Personal Website — project notes

## Photo storage (image-slot.js)
The album + splash photos are user-filled `<image-slot>` components. Storage is **one sidecar file per slot** (not a single combined file), because the host's in-browser `writeFile` bridge caps each write at ~2MB and only allows `*.state.json` basenames.

- **Index/manifest:** `.image-slots.state.json` → `{"ids":[...]}` lists which slots exist (tiny).
- **Per-slot data:** `.image-slots.<id>.state.json` → `{u,s,x,y}` (the data-URL + crop frame) for each slot.
- On drop/crop, image-slot writes only the changed slot's file + the index, so a single edit always stays under the cap and persists.
- `load()` reads the index, then fetches each per-slot file. It still back-reads a legacy combined sidecar (an object without `.ids`) for compatibility.

### When the user "uploads / saves photos"
Uploaded images can be huge (originals were ~6MB PNGs each, 72MB total). To save them:
1. In the user's view, downscale via canvas to **JPEG** (WebP `toDataURL` is NOT supported in this runtime — falls back to PNG, no savings). ~1920px longest side, q≈0.85 ≈ 0.5–1MB each.
2. The browser bridge can only write `*.state.json` files and caps each at ~2MB — so write **per-slot** files (`.image-slots.<id>.state.json`), one per photo. Do NOT try to write all photos in one combined file; it will fail with "content too large".
3. Update the index `.image-slots.state.json` with `{"ids":[...]}`.
4. The agent's `run_script`/`write_file` tools have a higher size limit than the browser bridge, but a `saveFile` that shrinks an existing file by >½ is refused — delete the old file first, then write the new small one.

Splash slideshow (`js/pages-main.jsx`, `SPLASH_SHOTS`) reuses album slot ids `album-p1..album-p12` so the album is the single source of truth.

## No-crop album (`fit="native"`)
The album grid uses `<Slot fit="native">` so each photo's slot **adopts the photo's own aspect ratio** (no crop, no letterbox) — the masonry columns absorb the varied heights. image-slot.js implements `fit="native"`: on image load it sets the host's `aspect-ratio` from `naturalWidth/Height`; empty slots fall back to the `ar` attribute. For native slots, React must NOT manage `aspect-ratio` (it would clobber the loaded value) — `Slot` omits it from the style object and passes `ar` as an attribute instead. The lightbox uses `fit="contain"` so the full frame always shows on black. Reframe/crop (double-click) is disabled for non-cover fits.

## Lightbox portal
`Lightbox` (`js/pages-sub.jsx`) is rendered via `ReactDOM.createPortal(lb, document.body)`. This is required: the `.page` element runs a `pagein` animation (`css/components.css`) whose `both` fill leaves a residual identity `transform`, which would otherwise become the containing block for the lightbox's `position: fixed` and drop the photo far below the fold. Portaling to `<body>` anchors it to the viewport. The lightbox photo is a plain `<img class="lb-photo">` sized to natural aspect, scaled up to ~84vh (portrait) / full width (landscape) — full stored resolution, no crop.

## Splash hero cluster (`.splash-body`, css/components.css)
The bottom-third cluster (name, roles, tagline, buttons, color bars, social icons) is `transform: scale(0.6)` with `transform-origin: 0 100%` (pinned lower-left, 40% smaller). On hover the **whole cluster** scales up to `scale(1)` via a 0.55s transition — `.splash-body:hover { transform: scale(1); }`. The frosted veil blur is `blur(4px)`; the bottom gradient div in `Splash` (pages-main.jsx) is `height: 26%`. Subtitle/tagline (`window.SITE.profile.tagline`) currently reads "Under construction. Coming soon." The splash "Selected work" ghost button links to the Album gallery (`go("album")`) and is overridden to highlight like the primary btn: `.splash-body .btn-ghost:hover { background: var(--ink); color: var(--bg); }` (css/site.css).

## Social icon buttons (`SocialIcons`/`SOCIALS`, js/components.jsx)
Row of 4 circular icon buttons in the splash (Instagram, IMDb, LinkedIn, Email). SVG icon components (`IconInstagram`/`IconIMDb`/`IconLinkedIn`/`IconEmail`) + `.social-btn` style in css/site.css (fills ink on hover, lifts 2px). External links use `target="_blank"`; Email is `mailto:`. NOTE: in the in-app **preview pane** (sandboxed iframe) Instagram & LinkedIn appear "blocked" because those sites send `X-Frame-Options: DENY` — this is a preview artifact only; the links open fine in a real browser tab on the published site.

## Album page (js/pages-sub.jsx)
Category filter pills (All / Flight / Stills & Grades) were **removed** — the album now shows all `window.SITE.photos` in one grid, no `filter` state.

## Splash dynamic foreground contrast (`js/pages-main.jsx` + css/components.css)
The splash type adapts to the photo behind the lower-left text cluster so it never gets lost on a busy/bright/dark frame. `Splash` owns the slideshow `idx` (lifted out of the old `SplashSlideshow`, now a presentational `<SplashSlideshow idx>`). `regionBrightness(dataUrl)` draws the bottom-left ~62%×55% of the current photo to a 56×56 canvas, averages relative luminance (0..1), caches per data-URL (`_briCache`). An effect samples `curId` (= `splash-hero` in photo mode, else `SPLASH_SHOTS[idx]`) via `window.imageSlotStore.get(curId)` and re-runs on `imageSlotStore.subscribe`. Threshold **< 0.52 → tone "dark"** (light type), else **"light"** (dark type); empty slot → no class (theme default).
- CSS: `.splash` defines `--splash-fg/-2/-3` + `--splash-scrim`; `.splash.bg-dark` = light ink (`oklch 0.91/0.83/0.73`) + dark drop-shadow scrim; `.splash.bg-light` = softened dark ink (`oklch 0.33/0.43/0.52`), **scrim none** (white glow was removed per owner). Applied to `.splash-name`, `.splash-body .lead`, `.splash-roles .splash-role` (note: needs `.splash-roles` prefix to beat the later base `.splash-role{color:var(--ink-2)}` rule), `.splash-tc`, `.splash-enter`, splash buttons + social icons. Transition is `color/text-shadow 0.8s` — kept short because the capture/print clock freezes transitions mid-flight (would otherwise show stale dark type in screenshots; live browser is fine).

## "Enter the site" disabled (under construction)
The primary splash CTA is intentionally **dead** while the site is unfinished. In `Splash` it's `<span class="btn-blocked-wrap"><button class="btn btn-blocked" aria-disabled tabIndex=-1>` — **no onClick**, so it never navigates. css/site.css: `.btn-blocked` has `pointer-events:none` (kills :hover fill + click) and hazard diagonals via `repeating-linear-gradient(-45deg, color-mix(--splash-fg 30%, transparent) 0 6px, transparent 6px 13px)` (adapts to the contrast tone); the `.btn-blocked-wrap` carries `cursor:not-allowed` + tooltip. "Selected work" ghost button still works (`go("album")`). Re-enable by restoring `onClick={() => go("home")}` and dropping the wrapper/class.

## Identity
Site owner is **Khoren Mirzakhanian** (monogram KM). Name/email/social handles live in `js/data.js` (`window.SITE.profile`); name is also the default for the tweakable name field. Real contact details (confirmed by owner): email **khoren@kolorlux.com**; socials in `SocialIcons`/`SOCIALS` (`js/components.jsx`) — Instagram `instagram.com/kolorlux`, IMDb `imdb.com/name/nm5585716/`, LinkedIn `linkedin.com/in/khorenmirzakhanian/`, Email mailto. Studio/brand handle is **Kolorlux**.

## Cache-busting
Every script/style is loaded with a `?v=N` query in `Personal Website.html`. **Bump the version whenever you edit that file** or the browser serves a stale cached copy. Current-ish: site.css v14, components.css v29, image-slot v13, data.js v15, components.jsx v19, pages-main.jsx v22, pages-sub.jsx v17, app.jsx v14, app.jsx v13.

## Hidden pages (under construction)
The **home / work / blog** pages are temporarily hidden from the active site (owner request, June 2026) — code is NOT deleted, just set aside. **Links is now ENABLED** (owner re-enabled it June 2026).
- `js/app.jsx`: `ROUTES` lists `splash, album, now, links, contact`; hidden ids commented next to it. The `Page` map still contains every component, so re-adding ids to `ROUTES` fully restores them.
- `js/components.jsx`: `NAV` shows Album / Now / Links / Contact; hidden items are commented out above. Brand-logo click now goes to `album` (was `home`).
- `js/pages-main.jsx`: splash "Enter" scrollcue now goes to `album` (was `home`). Splash slideshow order is shuffled once per mount (Fisher–Yates in `Splash`, `order` ref).
Active site = splash (landing) → Album, Now, Links, Contact.
