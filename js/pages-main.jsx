// pages-main.jsx — Splash + Home
const { useState: useS1, useEffect: useE1, useRef: useRef1 } = React;

/* cinematic atmospheric backdrop (earthy horizon) */
const SKY = {
  position: "absolute", inset: 0,
  background:
    "radial-gradient(120% 70% at 68% 12%, oklch(0.84 0.08 70 / 0.9), transparent 55%)," +
    "radial-gradient(90% 60% at 20% 90%, oklch(0.4 0.05 45 / 0.6), transparent 60%)," +
    "linear-gradient(178deg, oklch(0.66 0.07 246) 0%, oklch(0.74 0.06 90) 46%," +
    "oklch(0.5 0.06 56) 60%, oklch(0.26 0.04 44) 100%)",
};

/* Splash background slideshow — crossfades through the album's photo slots
   (same ids = single source of truth: re-dropping a photo on the Album page
   updates the splash too) with a slow ken-burns drift. Photos sit behind the
   frosted-glass veil so the foreground type stays crisp. Holds on one frame
   under reduced-motion. Skips slots that have no stored photo. */
const SPLASH_SHOTS = [
  "album-p1", "album-p2", "album-p3", "album-p4", "album-p5", "album-p6",
  "album-p7", "album-p8", "album-p9", "album-p10", "album-p11", "album-p12",
  "album-p13", "album-p14", "album-p15", "album-p16",
];

/* Sample the brightness of the photo region that sits behind the lower-left
   text cluster, so the foreground type can flip light/dark for contrast.
   Returns 0 (black) … 1 (white). Cached per data-URL — photos rarely change.
   We read the bottom-left quadrant of the source (roughly where name/roles
   land under a cover crop) and average relative luminance. */
const _briCache = new Map();
function regionBrightness(url) {
  if (!url) return Promise.resolve(null);
  if (_briCache.has(url)) return Promise.resolve(_briCache.get(url));
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const W = 56, H = 56;
        const c = document.createElement("canvas");
        c.width = W; c.height = H;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
        // bottom-left ~62% wide × ~55% tall of the frame
        ctx.drawImage(img, 0, ih * 0.45, iw * 0.62, ih * 0.55, 0, 0, W, H);
        const d = ctx.getImageData(0, 0, W, H).data;
        let sum = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) {
          sum += (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
          n++;
        }
        const avg = n ? sum / n : null;
        _briCache.set(url, avg);
        resolve(avg);
      } catch (e) { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function SplashSlideshow({ shots, activeId }) {
  return (
    <div className="splash-show">
      <div style={SKY} className="splash-show-base" />
      {shots.map((id) => (
        <div className={"splash-show-frame" + (id === activeId ? " active" : "")} key={id}>
          <Slot id={id} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", aspectRatio: "auto" }} />
        </div>
      ))}
    </div>
  );
}

function Splash({ go, profile, splash }) {
  const [, force] = useS1(0);
  const [pos, setPos] = useS1(0);
  const [tone, setTone] = useS1(null);
  const orderRef = useRef1(null);
  const prevNRef = useRef1(0);

  // Subscribe so the component re-renders once the photo store loads
  useE1(() => {
    if (!window.imageSlotStore) return;
    window.imageSlotStore.ensure();
    return window.imageSlotStore.subscribe(() => force(n => n + 1));
  }, []);

  // Only cycle through shots that have a stored photo
  const availableShots = SPLASH_SHOTS.filter(id =>
    window.imageSlotStore && window.imageSlotStore.get(id)
  );
  const n = availableShots.length;

  // Re-shuffle when the count of available shots changes
  if (prevNRef.current !== n) {
    prevNRef.current = n;
    const a = availableShots.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    orderRef.current = a;
  }

  const activeId = n ? availableShots[orderRef.current[pos % n]] : null;

  // advance the background slideshow (held under reduced-motion)
  useE1(() => {
    if (splash === "photo") return;
    if (!n) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setPos(p => (p + 1) % n), 5600);
    return () => clearInterval(t);
  }, [splash, n]);

  // While the current shot's sidecar hasn't hydrated yet, jump to the first
  // shot in the play order whose photo HAS landed — sidecars stream in one
  // by one on first load, so the gradient gives way to a photo as soon as
  // any file arrives instead of waiting on the randomly-chosen first slide.
  // Once everything is hydrated this is a no-op (current shot has a url).
  useE1(() => {
    if (splash === "photo") return;
    const store = window.imageSlotStore;
    if (!store) return;
    const seek = () => setPos((p) => {
      if (store.get(SPLASH_SHOTS[order.current[p]])) return p;
      const q = order.current.findIndex((i) => store.get(SPLASH_SHOTS[i]));
      return q >= 0 ? q : p;
    });
    seek();
    store.ensure();
    return store.subscribe(seek);
  }, [splash]);

  // which slot is currently behind the type
  const curId = splash === "photo" ? "splash-hero" : activeId;

  // sample it → flip the foreground ink. Re-runs when the frame changes and
  // when the photo store updates (a fresh drop / initial hydration).
  useE1(() => {
    let alive = true;
    const recompute = () => {
      const url = window.imageSlotStore && window.imageSlotStore.get(curId);
      if (!url) { if (alive) setTone(null); return; }
      regionBrightness(url).then(b => {
        if (!alive || b == null) return;
        setTone(b < 0.52 ? "dark" : "light");
      });
    };
    recompute();
    let unsub = () => {};
    if (window.imageSlotStore) {
      window.imageSlotStore.ensure();
      unsub = window.imageSlotStore.subscribe(recompute);
    }
    return () => { alive = false; unsub(); };
  }, [curId]);

  const toneClass = tone === "dark" ? " bg-dark" : tone === "light" ? " bg-light" : "";

  return (
    <section className={"splash" + toneClass}>
      <div className="splash-media">
        {splash === "photo"
          ? (window.imageSlotStore && window.imageSlotStore.get("splash-hero")
            ? <Slot id="splash-hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", aspectRatio: "auto" }} />
            : <div style={SKY} />)
          : <SplashSlideshow shots={availableShots} activeId={activeId} />}
        {/* Cinematic vignette — dark bottom + left edge independent of theme,
            so text is legible over any photo without relying solely on JS detection */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "linear-gradient(to top,  rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.36) 22%, rgba(0,0,0,0.08) 52%, transparent 78%)," +
            "linear-gradient(to right, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.08) 38%, transparent 65%)" }} />
      </div>
      <div className="splash-veil" />

      <div className="wrap-wide splash-top">
        <div className="splash-top-inner">
          <span className="kicker">{profile.location} · EST. 2014</span>
          <span className="kicker" style={{ opacity: 0.8 }}>PORTFOLIO - 2026</span>
        </div>
      </div>

      <div className="wrap-wide splash-body">
        <div style={{ maxWidth: 200 }}><ColorBars tall /></div>
        <h1 className="splash-name">{profile.name}</h1>
        <div className="splash-roles">
          {profile.roles.map((r, i) => (
            <span className="splash-role" key={i}>
              <span className="dot" style={{ background: r.kind === "flight" ? "var(--sky)" : "var(--accent)" }} />
              {r.label}
            </span>
          ))}
        </div>
        <p className="lead" style={{ maxWidth: "30ch" }}>{profile.tagline}</p>
        <div className="col gap-s" style={{ marginTop: 8 }}>
          <span className="btn-blocked-wrap" title="Site under construction — coming soon" style={{ width: "100%" }}>
            <button className="btn btn-blocked" aria-disabled="true" tabIndex={-1} style={{ width: "100%", justifyContent: "center" }}>Enter the site <ArrowR /></button>
          </span>
          <div className="row gap-s" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-ghost" onClick={() => go("projects")} style={{ flex: 1, justifyContent: "center", minWidth: 120 }}>Selected work</button>
            <button className="btn btn-ghost" onClick={() => go("album")} style={{ flex: 1, justifyContent: "center", minWidth: 120 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Gallery
            </button>
          </div>
        </div>
        <SocialIcons />
      </div>

      <div className="wrap-wide splash-enter">
        <Timecode fps={24} />
      </div>
    </section>
  );
}

function Home({ go, profile }) {
  const recent = window.SITE.posts.slice(0, 4);
  const work = window.SITE.work.slice(0, 4);
  return (
    <main className="page">
      {/* hero */}
      <section className="wrap-wide section" style={{ paddingBottom: "clamp(30px,5vw,60px)" }}>
        <span className="kicker reveal">Colorist & Editor — Wingsuit Camera Flyer</span>
        <h1 className="h-xl serif reveal" style={{ marginTop: 22, maxWidth: "16ch" }}>
          Color, frame, <em style={{ fontStyle: "italic", color: "var(--accent)" }}>and altitude.</em>
        </h1>
        <div className="row between center reveal" style={{ marginTop: 30, flexWrap: "wrap", gap: 30 }}>
          <p className="lead prose" style={{ maxWidth: "46ch" }}>{profile.intro}</p>
          <div className="col gap-s" style={{ alignItems: "flex-start" }}>
            <button className="link-arrow" onClick={() => go("work")}>See the work <ArrowR /></button>
            <button className="link-arrow" onClick={() => go("contact")}>Start a project <ArrowR /></button>
          </div>
        </div>
      </section>

      {/* featured grade reveal */}
      <section className="wrap-wide" style={{ paddingBottom: "clamp(50px,8vw,90px)" }}>
        <div className="row between center reveal" style={{ marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <span className="kicker">Featured — Before / After</span>
          <span className="meta">Drag to compare · The Long Quiet (2026)</span>
        </div>
        <div className="reveal"><GradeReveal /></div>
      </section>

      <div className="wrap-wide"><ColorBars /></div>

      {/* recent posts */}
      <section className="wrap-wide section">
        <div className="row between center" style={{ marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <h2 className="h-md serif reveal">Recent writing</h2>
          <button className="link-arrow" onClick={() => go("blog")}>All posts <ArrowR /></button>
        </div>
        <div className="posts-list">
          {recent.map((p, i) => <PostRow key={p.id} post={p} i={i} go={go} />)}
        </div>
      </section>

      {/* selected work teaser */}
      <section className="wrap-wide section" style={{ paddingTop: 0 }}>
        <div className="row between center" style={{ marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <h2 className="h-md serif reveal">Selected work</h2>
          <button className="link-arrow" onClick={() => go("work")}>Full list <ArrowR /></button>
        </div>
        {work.map((w, i) => (
          <div className="work-row reveal" key={i} onClick={() => go("work")}>
            <div>
              <span className="meta">{w.type} · {w.year}</span>
              <div className="work-title" style={{ marginTop: 4 }}>{w.title}</div>
            </div>
            <span className="tag">{w.role}</span>
          </div>
        ))}
      </section>

      {/* now + cta band */}
      <section className="wrap-wide section" style={{ paddingTop: 0 }}>
        <div className="feature-grid">
          <div className="card reveal" onClick={() => go("now")} style={{ padding: 0 }}>
            <div className="card-body" style={{ padding: 30 }}>
              <span className="kicker">Now</span>
              <h3 className="card-title" style={{ marginTop: 10 }}>What I'm working on this season</h3>
              <p className="muted" style={{ marginTop: 12 }}>{window.SITE.now[0].body}</p>
              <button className="link-arrow" style={{ marginTop: 18 }}>Read the now page <ArrowR /></button>
            </div>
          </div>
          <div className="card reveal" style={{ padding: 0, overflow: "hidden" }}>
            <Slot id="home-album-cover" ar="16 / 10" ph="Drop a cover image" />
            <div className="card-body" style={{ padding: 30 }}>
              <span className="kicker">Album</span>
              <h3 className="card-title" style={{ marginTop: 10 }}>Photography from the suite and the sky</h3>
              <button className="link-arrow" style={{ marginTop: 14 }} onClick={() => go("album")}>Open the gallery <ArrowR /></button>
            </div>
          </div>
        </div>
      </section>

      <Footer profile={profile} go={go} />
    </main>
  );
}

Object.assign(window, { Splash, Home });
