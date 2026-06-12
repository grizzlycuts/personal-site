// app.jsx — router, theme, tweaks, mount
const { useState, useEffect, useCallback, useRef } = React;

// Opt into entrance animations only when JS runs AND motion is allowed.
// Until this class is set, .reveal elements stay at their visible base state,
// so print/PDF/capture/no-JS never render blank.
try {
  if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("anim");
  }
} catch (e) { /* leave content visible */ }

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "name": "Khoren Mirzakhanian",
  "accent": "oklch(0.58 0.085 45)",
  "serif": "Cormorant Garamond",
  "splash": "slideshow",
  "theme": "dark"
}/*EDITMODE-END*/;

const ACCENTS = [
  "oklch(0.58 0.085 45)",   // clay
  "oklch(0.56 0.058 242)",  // dusted sky
  "oklch(0.55 0.06 132)",   // sage
  "oklch(0.62 0.085 70)",   // ochre
  "oklch(0.5 0.09 25)",     // oxblood
];

// NOTE (under construction): home / work / blog are temporarily hidden
// from the active site. They're omitted from ROUTES so they can't be navigated to,
// but the page components below stay mapped — re-add the ids here to restore.
const ROUTES = ["splash", "album", "projects", "now", "links", "contact"];
// Hidden for now: "home", "work", "blog"

function getRoute() {
  const h = (window.location.hash || "").replace(/^#\/?/, "");
  return ROUTES.includes(h) ? h : "splash";
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState(getRoute());

  // hash routing
  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = useCallback((id) => {
    window.location.hash = "/" + id;
    setRoute(id);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme === "dark" ? "dark" : "light");
  }, [t.theme]);
  const toggleTheme = () => setTweak("theme", t.theme === "dark" ? "light" : "dark");

  // accent
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--accent", t.accent);
    r.setProperty("--accent-soft", `color-mix(in oklch, ${t.accent}, transparent 86%)`);
  }, [t.accent]);

  // serif
  useEffect(() => {
    document.documentElement.style.setProperty("--serif", `"${t.serif}", Georgia, serif`);
  }, [t.serif]);

  // reveal on scroll, re-run per route
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.05, rootMargin: "0px 0px -6% 0px" });
    const tm = setTimeout(() => els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) el.classList.add("in"); else io.observe(el);
    }), 40);
    // safety: never leave content hidden if the observer never fires
    const safety = setTimeout(() => els.forEach((el) => el.classList.add("in")), 900);
    return () => { clearTimeout(tm); clearTimeout(safety); io.disconnect(); };
  }, [route]);

  const profile = {
    ...window.SITE.profile,
    name: t.name || window.SITE.profile.name,
    monogram: (t.name || window.SITE.profile.name).split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase(),
  };

  const Page = { splash: Splash, home: Home, work: Work, blog: Blog, album: Album, projects: Projects, now: Now, links: Links, contact: Contact }[route] || Home;

  return (
    <>
      <Nav route={route} go={go} profile={profile} theme={t.theme} toggleTheme={toggleTheme} />
      <Page key={route} go={go} profile={profile} splash={t.splash} />

      <TweaksPanel>
        <TweakSection label="Identity" />
        <TweakText label="Name" value={t.name} onChange={(v) => setTweak("name", v)} />
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme} options={["light", "dark"]} onChange={(v) => setTweak("theme", v)} />
        <TweakColor label="Accent" value={t.accent} options={ACCENTS} onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Type" />
        <TweakSelect label="Headline serif" value={t.serif}
          options={["Cormorant Garamond", "Spectral", "EB Garamond"]}
          onChange={(v) => setTweak("serif", v)} />
        <TweakSection label="Splash" />
        <TweakRadio label="Treatment" value={t.splash} options={["slideshow", "photo"]}
          onChange={(v) => setTweak("splash", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
