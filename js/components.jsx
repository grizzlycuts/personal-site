// components.jsx — shared building blocks
const { useState, useRef, useEffect, useCallback } = React;

/* Global session anchor so every <Timecode> across every page shows the SAME
   running value — continuous from page to page (components remount on route
   change, but this epoch is fixed for the session). */
const TC_EPOCH = (window.__TC_EPOCH = window.__TC_EPOCH || performance.now());
const TC_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function tcFrames(start, fps) {
  return start * fps + Math.floor(((performance.now() - TC_EPOCH) / 1000) * fps);
}

/* Live SMPTE timecode — ticks at `fps` from `start` seconds (default 01:00:00:00).
   Holds steady under prefers-reduced-motion. */
function Timecode({ fps = 24, start = 3600, className = "splash-tc", showRec = true, showFps = true, prefix = "" }) {
  const [frames, setFrames] = useState(() => tcFrames(start, fps));
  useEffect(() => {
    if (TC_REDUCED) return;
    let raf;
    const tick = () => { setFrames(tcFrames(start, fps)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fps, start]);

  const f = frames % fps;
  const totalSec = Math.floor(frames / fps);
  const s = totalSec % 60;
  const m = Math.floor(totalSec / 60) % 60;
  const h = Math.floor(totalSec / 3600) % 24;
  const p = (n) => String(n).padStart(2, "0");
  return (
    <span className={className + " mono"} aria-label="Running timecode">
      {showRec && <span className="tc-rec" aria-hidden="true" />}
      {prefix && <span className="tc-pre">{prefix}</span>}
      <span className="tc-digits">{p(h)}:{p(m)}:{p(s)}:{p(f)}</span>
      {showFps && <span className="tc-fps"> · {fps} FPS</span>}
    </span>
  );
}

/* ---------- tiny icons (simple strokes only) ---------- */
const Chevron = ({ d = "down", s = 16 }) => {
  const rot = { down: 90, up: -90, right: 0, left: 180 }[d];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
const ArrowR = ({ s = 15 }) => (
  <svg className="arrow" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- social icons + button row ---------- */
const IconInstagram = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const IconLinkedIn = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <line x1="7.2" y1="10.5" x2="7.2" y2="17" strokeLinecap="round" />
    <circle cx="7.2" cy="7.4" r="0.6" fill="currentColor" stroke="none" />
    <path d="M11 17v-3.6a2 2 0 0 1 4 0V17M11 17v-6.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconEmail = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M4 7.5l8 5.2 8-5.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconIMDb = ({ s = 18 }) => (
  <svg width={s * 1.9} height={s} viewBox="0 0 38 20" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="1" y="1" width="36" height="18" rx="3" />
    <text x="19" y="14.2" textAnchor="middle" fontFamily="var(--mono)" fontWeight="700"
      fontSize="9" letterSpacing="0.5" fill="currentColor" stroke="none">IMDb</text>
  </svg>
);

const SOCIALS = [
  { label: "Instagram", Icon: IconInstagram, href: "https://www.instagram.com/kolorlux/" },
  { label: "IMDb", Icon: IconIMDb, href: "https://www.imdb.com/name/nm5585716/" },
  { label: "LinkedIn", Icon: IconLinkedIn, href: "https://www.linkedin.com/in/khorenmirzakhanian/" },
  { label: "Email", Icon: IconEmail, href: "mailto:khoren@kolorlux.com" },
];
const SocialIcons = ({ className = "" }) => (
  <div className={"social-row " + className}>
    {SOCIALS.map(({ label, Icon, href }) => (
      <a key={label} className="social-btn" href={href} target={href.startsWith("mailto") ? undefined : "_blank"}
        rel="noopener noreferrer" aria-label={label} title={label}>
        <Icon />
      </a>
    ))}
  </div>
);

/* ---------- color-bars motif ---------- */
const ColorBars = ({ tall }) => (
  <div className={"bars" + (tall ? " tall" : "")} aria-hidden="true">
    <span className="bar-1" /><span className="bar-2" /><span className="bar-3" />
    <span className="bar-4" /><span className="bar-5" /><span className="bar-6" /><span className="bar-7" />
  </div>
);

/* ---------- placeholder image ---------- */
const Placeholder = ({ tone = "", label, sub, ar = "3 / 2", style = {} }) => (
  <div className="ph" data-tone={tone} style={{ aspectRatio: ar, ...style }}>
    {(label || sub) && (
      <div className="ph-label">
        <span>{label}</span>
        {sub && <span>{sub}</span>}
      </div>
    )}
  </div>
);

/* ---------- user-fillable image slot (drag & drop, persists) ---------- */
const Slot = ({ id, ar = "3 / 2", ph = "Drop an image", radius = 0, fit = "cover", style = {} }) => {
  // For fit="native" the slot sizes itself to each photo's own aspect ratio,
  // so React must NOT own aspect-ratio (it would clobber the value image-slot
  // sets on load). Pass `ar` as an attribute instead — image-slot uses it only
  // as the empty-state placeholder ratio.
  const native = fit === "native";
  const baseStyle = native
    ? { display: "block", width: "100%", height: "auto", ...style }
    : { display: "block", width: "100%", height: "auto", aspectRatio: ar, ...style };
  return (
    <image-slot
      id={id}
      shape={radius ? "rounded" : "rect"}
      radius={String(radius)}
      fit={fit}
      ar={ar}
      placeholder={ph}
      style={baseStyle}
    ></image-slot>
  );
};

/* ---------- before / after grade reveal ---------- */
const GRADE_FRAME = {
  position: "absolute", inset: 0,
  background:
    "radial-gradient(130% 90% at 72% 16%, oklch(0.86 0.075 72), transparent 58%)," +
    "linear-gradient(180deg, oklch(0.72 0.06 248) 0%, oklch(0.8 0.05 84) 51%," +
    "oklch(0.46 0.05 58) 52%, oklch(0.3 0.04 48) 100%)",
};
function GradeReveal() {
  const ref = useRef(null);
  const [pos, setPos] = useState(52);
  const drag = useRef(false);

  const move = useCallback((clientX) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    setPos(p);
  }, []);

  useEffect(() => {
    const mm = (e) => { if (drag.current) move(e.clientX); };
    const tm = (e) => { if (drag.current && e.touches[0]) move(e.touches[0].clientX); };
    const up = () => { drag.current = false; };
    window.addEventListener("mousemove", mm);
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [move]);

  return (
    <div className="grade" style={{ aspectRatio: "2 / 1" }} ref={ref}
      onMouseDown={(e) => { drag.current = true; move(e.clientX); }}
      onTouchStart={(e) => { drag.current = true; if (e.touches[0]) move(e.touches[0].clientX); }}>
      {/* AFTER — graded */}
      <div className="grade-layer grade-after">
        <div style={{ ...GRADE_FRAME, filter: "saturate(1.08) contrast(1.1) brightness(1.0)" }} />
        <span className="grade-tag" style={{ right: 14, borderColor: "var(--accent)", color: "var(--accent)" }}>Graded</span>
      </div>
      {/* BEFORE — flat / ungraded, clipped to the left of the handle */}
      <div className="grade-layer grade-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <div style={{ ...GRADE_FRAME, filter: "saturate(0.32) brightness(1.16) contrast(0.78) hue-rotate(6deg)" }} />
        <span className="grade-tag" style={{ left: 14 }}>Ungraded · Log</span>
      </div>
      <div className="grade-handle" style={{ left: `${pos}%` }} />
      <div className="grade-knob" style={{ left: `${pos}%`, top: "50%" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 7l-4 5 4 5M16 7l4 5-4 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ---------- navigation ---------- */
// NOTE (under construction): home / work / blog are hidden from the
// active site for now — kept here commented out so they're trivial to restore.
const NAV = [
  // ["home", "Home"], ["work", "Work"], ["blog", "Blog"],
  ["album", "Album"], ["projects", "Projects"], ["now", "Now"], ["links", "Links"], ["contact", "Contact"],
];
function Nav({ route, go, profile, theme, toggleTheme }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [route]);
  const onSplash = route === "splash";
  return (
    <React.Fragment>
    {!onSplash && (
      <div className="tc-top">
        <Timecode className="nav-tc" showFps={false} />
      </div>
    )}
    <header className="nav" style={onSplash ? { display: "none" } : {}}>
      <div className="wrap-wide nav-inner">
        <div className="brand" onClick={() => go("splash")}>
          <div className="monogram">{profile.monogram}</div>
          <div>
            <div className="brand-name">{profile.name}</div>
            <div className="brand-role">Colorist · Camera Flyer</div>
          </div>
        </div>
        <nav className="nav-links">
          {NAV.map(([id, label]) => (
            <a key={id} className={"nav-link" + (route === id ? " active" : "")}
              onClick={() => go(id)}>{label}</a>
          ))}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
            {theme === "dark" ? "☾" : "☀"}
          </button>
        </nav>
        <button className={"nav-burger" + (open ? " open" : "")} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </header>
    <div className={"nav-mobile" + (open ? " open" : "")}>
      {NAV.map(([id, label]) => (
        <a key={id} className={route === id ? "active" : ""} onClick={() => go(id)}>{label}</a>
      ))}
      <button className="btn btn-ghost" style={{ marginTop: 24, alignSelf: "flex-start" }} onClick={toggleTheme}>
        {theme === "dark" ? "☾  Dark" : "☀  Light"}
      </button>
    </div>
    </React.Fragment>
  );
}

/* ---------- footer ---------- */
function Footer({ profile, go }) {
  return (
    <footer className="footer">
      <div className="wrap-wide">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="serif" style={{ fontSize: 30, marginBottom: 10 }}>{profile.tagline}</div>
            <p className="muted" style={{ maxWidth: "34ch", fontSize: 15 }}>
              {profile.name} — {profile.location}. Available for color, finishing and aerial camera work.
            </p>
          </div>
          <div className="footer-col">
            <h4>Pages</h4>
            {NAV.map(([id, label]) => <a key={id} onClick={() => go(id)}>{label}</a>)}
          </div>
          <div className="footer-col">
            <h4>Elsewhere</h4>
            {window.SITE.links.slice(0, 4).map(l => <a key={l.label} href="#" onClick={e => e.preventDefault()}>{l.label}</a>)}
          </div>
        </div>
        <ColorBars />
        <div className="footer-bottom" style={{ marginTop: 22 }}>
          <span className="meta">© {new Date().getFullYear()} {profile.name}</span>
          <span className="meta tc-meta"><Timecode className="footer-tc" showRec={false} showFps={false} prefix="TC " /> — Built frame by frame</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- post row ---------- */
function PostRow({ post, i, go }) {
  const date = new Date(post.date + "T00:00:00");
  const ds = date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  return (
    <article className="post-row reveal" onClick={() => go("blog")}>
      <span className="post-num">{post.reel}</span>
      <div>
        <span className={"tag " + post.cat}>{post.cat === "color" ? "Color & Post" : "Flight"}</span>
        <h3 className="post-title" style={{ marginTop: 12 }}>{post.title}</h3>
        <p className="post-excerpt">{post.excerpt}</p>
      </div>
      <div className="post-side">
        <span className="meta">{ds}</span>
        <span className="meta">{post.read}</span>
      </div>
    </article>
  );
}

Object.assign(window, {
  Chevron, ArrowR, ColorBars, Placeholder, Slot, GradeReveal, Nav, Footer, PostRow, NAV, Timecode,
  SocialIcons, IconIMDb,
});
