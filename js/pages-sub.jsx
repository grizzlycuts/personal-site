// pages-sub.jsx — Blog, Album, Now, Work, Contact, Links
const { useState: useS2, useEffect: useE2 } = React;

function PageHead({ kicker, title, lead, children }) {
  return (
    <header className="wrap-wide page-head">
      <span className="kicker reveal">{kicker}</span>
      {title && <h1 className="page-title reveal" style={{ marginTop: 18 }}>{title}</h1>}
      {lead && <p className="lead reveal" style={{ marginTop: 22, maxWidth: "44ch" }}>{lead}</p>}
      {children}
    </header>
  );
}

/* ---------------- BLOG ---------------- */
function Blog({ go, profile }) {
  const [filter, setFilter] = useS2("all");
  const posts = window.SITE.posts.filter(p => filter === "all" || p.cat === filter);
  const cats = [["all", "All"], ["color", "Color & Post"], ["flight", "Flight"]];
  return (
    <main className="page">
      <PageHead kicker="Journal" title="Writing"
        lead="Notes from the grading suite and the drop zone — craft, gear, and the occasional opinion.">
        <div className="filters reveal" style={{ marginTop: 30 }}>
          {cats.map(([id, label]) => (
            <button key={id} className={"filter" + (filter === id ? " active" : "")} onClick={() => setFilter(id)}>{label}</button>
          ))}
        </div>
      </PageHead>
      <section className="wrap-wide" style={{ paddingBottom: "clamp(60px,9vw,120px)" }}>
        <div className="posts-list">
          {posts.map((p, i) => <PostRow key={p.id} post={p} i={i} go={go} />)}
        </div>
      </section>
      <Footer profile={profile} go={go} />
    </main>
  );
}

/* ---------------- ALBUM ---------------- */
function Lightbox({ photos, index, setIndex }) {
  const open = index !== null;
  const p = open ? photos[index] : null;
  // Re-render when the photo store hydrates / changes so the <img> picks up
  // the stored data-URL once it's loaded.
  const [, force] = useS2(0);
  useE2(() => {
    if (!window.imageSlotStore) return;
    window.imageSlotStore.ensure();
    return window.imageSlotStore.subscribe(() => force((n) => n + 1));
  }, []);
  useE2(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((index + 1) % photos.length);
      if (e.key === "ArrowLeft") setIndex((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, photos.length]);

  const lb = (
    <div className={"lightbox" + (open ? " open" : "")} onClick={() => setIndex(null)}>
      {open && (
        <>
          <button className="lb-close" onClick={() => setIndex(null)}>✕</button>
          <button className="lb-nav prev" onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + photos.length) % photos.length); }}><Chevron d="left" s={18} /></button>
          <button className="lb-nav next" onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % photos.length); }}><Chevron d="right" s={18} /></button>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            {(window.imageSlotStore && window.imageSlotStore.get("album-" + p.id))
              ? <img className="lb-photo" src={window.imageSlotStore.get("album-" + p.id)} alt={p.title} />
              : <Slot id={"album-" + p.id} ar="3 / 2" fit="contain" ph={"Drop frame — " + p.title} style={{ width: "100%", aspectRatio: "3 / 2", maxHeight: "82vh", background: "transparent" }} />}
          </div>
        </>
      )}
    </div>
  );
  // Portal to <body> so the lightbox's position:fixed anchors to the viewport,
  // not the .page element (whose pagein animation leaves an identity transform
  // that would otherwise become the containing block and drop the photo below
  // the fold).
  return ReactDOM.createPortal(lb, document.body);
}

function Album({ go, profile }) {
  const [index, setIndex] = useS2(null);
  const all = window.SITE.photos;
  const photos = all;
  return (
    <main className="page">
      <PageHead kicker="Album">
      </PageHead>
      <section className="wrap-wide" style={{ paddingBottom: "clamp(60px,9vw,120px)" }}>
        <div className="album-grid">
          {photos.map((p) => {
            const realIdx = all.indexOf(p);
            return (
              <div className="album-item reveal" key={p.id} onClick={(e) => {
                const slot = e.currentTarget.querySelector("image-slot");
                if (slot && slot.hasAttribute("data-filled")) setIndex(realIdx);
              }}>
                <Slot id={"album-" + p.id} ar={p.ar} fit="native" ph={p.cat === "flight" ? "Drop flight frame" : "Drop still / grade"} />
              </div>
            );
          })}
        </div>
      </section>
      <Lightbox photos={all} index={index} setIndex={setIndex} />
      <Footer profile={profile} go={go} />
    </main>
  );
}

/* ---------------- NOW ---------------- */
function Now({ go, profile }) {
  return (
    <main className="page">
      <PageHead kicker={"Now · Updated " + new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        title="What I'm doing now" />
      <section className="wrap-wide" style={{ paddingBottom: "clamp(60px,9vw,120px)" }}>
        {window.SITE.now.map((n, i) => (
          <div className="now-grid reveal" key={i}>
            <span className="kicker" style={{ paddingTop: 4 }}>{n.label}</span>
            <p className="lead" style={{ fontSize: "clamp(20px,2.2vw,27px)", color: "var(--ink)" }}>{n.body}</p>
          </div>
        ))}
        <p className="meta" style={{ marginTop: 30 }}>Inspired by the /now page movement. This is the truth as of today.</p>
      </section>
      <Footer profile={profile} go={go} />
    </main>
  );
}

/* ---------------- WORK ---------------- */
function Work({ go, profile }) {
  return (
    <main className="page">
      <PageHead kicker="Selected Work" title="Work"
        lead="Color, finishing and aerial camera across features, series and short form. A fuller reel on request." />
      <section className="wrap-wide" style={{ paddingBottom: "clamp(40px,6vw,80px)" }}>
        {window.SITE.work.map((w, i) => (
          <div className="work-row reveal" key={i}>
            <div>
              <span className="meta">{w.type} · {w.year}</span>
              <div className="work-title" style={{ marginTop: 4 }}>{w.title}</div>
            </div>
            <span className={"tag " + (w.role.includes("Camera") ? "flight" : "color")}>{w.role}</span>
          </div>
        ))}
      </section>
      <section className="wrap-wide section" style={{ paddingTop: 0 }}>
        <div className="card reveal" style={{ padding: "clamp(30px,5vw,60px)", textAlign: "center" }}>
          <span className="kicker">Reel 2026</span>
          <h2 className="h-md serif" style={{ margin: "14px auto 20px", maxWidth: "20ch" }}>Want the full showreel and rate card?</h2>
          <button className="btn btn-accent" onClick={() => go("contact")}>Get in touch <ArrowR /></button>
        </div>
      </section>
      <Footer profile={profile} go={go} />
    </main>
  );
}

/* ---------------- CONTACT ---------------- */
function Contact({ go, profile }) {
  return (
    <main className="page">
      <PageHead kicker="Contact" title="Let's talk"
        lead="Color and finishing bookings, aerial camera work, or just to compare scopes — say hello." />
      <section className="wrap-wide" style={{ paddingBottom: "clamp(40px,6vw,80px)" }}>
        <a className="contact-mail" href={"mailto:" + profile.email}>{profile.email}</a>
        <div className="feature-grid" style={{ marginTop: "clamp(40px,6vw,70px)" }}>
          <div>
            <h4 className="kicker" style={{ marginBottom: 12 }}>Availability</h4>
            <p className="lead" style={{ fontSize: 22 }}>Booking color & finishing from Q3 2026. Aerial camera, seasonal.</p>
          </div>
          <div>
            <h4 className="kicker" style={{ marginBottom: 12 }}>Based in</h4>
            <p className="lead" style={{ fontSize: 22 }}>{profile.location} — remote grading worldwide. Will travel for the right exit.</p>
          </div>
        </div>
      </section>
      <Footer profile={profile} go={go} />
    </main>
  );
}

/* ---------------- LINKS ---------------- */
function Links({ go, profile }) {
  return (
    <main className="page">
      <PageHead kicker="Elsewhere" title="Links"
        lead="The other places I post frames, reels and the occasional landing." />
      <section className="wrap-wide" style={{ paddingBottom: "clamp(60px,9vw,120px)" }}>
        <div className="links-grid">
          {window.SITE.links.map((l) => (
            <a className="link-card" key={l.label} href={l.href}
              target={l.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer">
              <div>
                <div className="serif" style={{ fontSize: 24 }}>{l.label}</div>
                <div className="meta" style={{ marginTop: 4 }}>{l.handle}</div>
              </div>
              <div className="row center gap-s">
                <span className="faint" style={{ fontSize: 13 }}>{l.note}</span>
                <ArrowR />
              </div>
            </a>
          ))}
        </div>
      </section>
      <Footer profile={profile} go={go} />
    </main>
  );
}

/* ---------------- PROJECTS ---------------- */
function Projects({ go, profile }) {
  return (
    <main className="page">
      <PageHead kicker="Projects">
        <p className="meta reveal" style={{ marginTop: 14, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          Digital Intermediate Editor
        </p>
      </PageHead>
      <section className="wrap-wide" style={{ paddingBottom: "clamp(60px,9vw,120px)" }}>
        <div className="projects-grid">
          {window.SITE.projects.map((p) => (
            <a
              key={p.id}
              className="project-card"
              href={"https://www.imdb.com/title/" + p.imdb + "/"}
              target="_blank"
              rel="noopener noreferrer"
              title={p.title + " — IMDb"}
            >
              <div className="project-poster">
                <Slot id={"project-" + p.id} ar="2 / 3" ph={p.title} />
              </div>
              <div className="project-info">
                <div className="project-title serif">{p.title}</div>
                <div className="project-year mono">{p.year}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
      <Footer profile={profile} go={go} />
    </main>
  );
}

Object.assign(window, { Blog, Album, Now, Work, Contact, Links, Projects, PageHead, Lightbox });
