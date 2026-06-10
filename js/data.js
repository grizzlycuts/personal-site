/* =================================================================
   SITE CONTENT  — placeholder copy the owner can replace.
   Names, projects and posts are illustrative.
   ================================================================= */
window.SITE = {
  profile: {
    name: "Khoren Mirzakhanian",            // ← tweakable in the panel
    monogram: "KM",
    location: "Los Angeles, CA",
    roles: [
      { label: "Colorist & Editor", kind: "color" },
      { label: "Wingsuit Camera Flyer", kind: "flight" },
    ],
    tagline: "Under construction. Coming soon.",
    email: "khoren@kolorlux.com",
    intro:
      "I shape the look of films and series in the grading suite — and I chase the same images through open air with a camera on my helmet. Two crafts, one obsession: getting the frame exactly right.",
  },

  /* ---- BLOG POSTS ---- */
  posts: [
    {
      id: "show-look-3-passes",
      title: "Building a show look in three passes",
      date: "2026-05-28",
      cat: "color",
      read: "8 MIN",
      reel: "R01",
      excerpt:
        "How I move from a flat normalization to a signature contrast curve without painting myself into a corner across 220 shots.",
    },
    {
      id: "exit-over-the-alps",
      title: "Exit over the Alps: filming a 4-way at golden hour",
      date: "2026-05-09",
      cat: "flight",
      read: "6 MIN",
      reel: "R02",
      excerpt:
        "Camera angles, fall-rate matching, and why the last forty seconds of light are worth the whole climb.",
    },
    {
      id: "skin-tones-honestly",
      title: "On skin tones, honestly",
      date: "2026-04-22",
      cat: "color",
      read: "11 MIN",
      reel: "R03",
      excerpt:
        "A working colorist's take on the vectorscope, the eye, and why the 'I-line' is a starting point — never the verdict.",
    },
    {
      id: "helmet-rig-2026",
      title: "My helmet camera rig for the 2026 season",
      date: "2026-04-03",
      cat: "flight",
      read: "5 MIN",
      reel: "R04",
      excerpt:
        "Weight, balance, snag hazards, and the exact mounting tweaks that survived a full season of jumps.",
    },
    {
      id: "grading-for-hdr-sdr",
      title: "One grade, two deliverables: HDR and SDR side by side",
      date: "2026-03-15",
      cat: "color",
      read: "9 MIN",
      reel: "R05",
      excerpt:
        "A trim-pass workflow that keeps the SDR honest to the HDR intent instead of fighting it shot by shot.",
    },
    {
      id: "reading-the-sky",
      title: "Reading the sky like a frame",
      date: "2026-02-26",
      cat: "flight",
      read: "7 MIN",
      reel: "R06",
      excerpt:
        "Cloud decks, haze, and back-light: how a flyer reads conditions the same way a colorist reads a scope.",
    },
  ],

  /* ---- ALBUM / PHOTOGRAPHY ---- */
  photos: [
    { id: "p1",  title: "Wing over the valley",    cat: "flight", tone: "sky",  loc: "Chamonix, FR",   gear: "5.2K / 24mm",      ar: "3 / 4" },
    { id: "p2",  title: "Suite, midnight pass",    cat: "stills", tone: "ink",  loc: "Studio B",       gear: "Reference monitor", ar: "3 / 2" },
    { id: "p3",  title: "Canopy, last light",      cat: "flight", tone: "clay", loc: "Empuriabrava",   gear: "5.2K / 16mm",      ar: "1 / 1" },
    { id: "p4",  title: "Grade still — INT. bar",  cat: "stills", tone: "clay", loc: "Feature / 2025", gear: "Frame export",      ar: "3 / 2" },
    { id: "p5",  title: "Formation, blue hour",    cat: "flight", tone: "sky",  loc: "Voss, NO",       gear: "5.2K / 24mm",      ar: "3 / 4" },
    { id: "p6",  title: "Backlit dust",            cat: "stills", tone: "clay", loc: "Series / 2026",  gear: "Frame export",      ar: "1 / 1" },
    { id: "p7",  title: "Cliff line",              cat: "flight", tone: "ink",  loc: "Lauterbrunnen",  gear: "5.2K / 16mm",      ar: "3 / 2" },
    { id: "p8",  title: "Scope & coffee",          cat: "stills", tone: "ink",  loc: "Studio B",       gear: "BTS / 35mm",       ar: "3 / 4" },
    { id: "p9",  title: "Opening over cloud",      cat: "flight", tone: "sky",  loc: "Interlaken",     gear: "5.2K / 24mm",      ar: "1 / 1" },
    { id: "p10", title: "Night exterior grade",    cat: "stills", tone: "ink",  loc: "Feature / 2024", gear: "Frame export",      ar: "3 / 2" },
    { id: "p11", title: "Spiral down",             cat: "flight", tone: "clay", loc: "Empuriabrava",   gear: "5.2K / 16mm",      ar: "3 / 4" },
    { id: "p12", title: "Window, warm key",        cat: "stills", tone: "clay", loc: "Short / 2025",   gear: "Frame export",      ar: "1 / 1" },
    { id: "p13", title: "Exit over the fjord",     cat: "flight", tone: "sky",  loc: "Aurland, NO",    gear: "5.2K / 16mm",      ar: "3 / 2" },
    { id: "p14", title: "Cool key, INT. kitchen",  cat: "stills", tone: "ink",  loc: "Feature / 2026", gear: "Frame export",      ar: "3 / 4" },
    { id: "p15", title: "Ridge run, low pass",     cat: "flight", tone: "clay", loc: "Dolomites, IT",  gear: "5.2K / 24mm",      ar: "1 / 1" },
    { id: "p16", title: "Tungsten & rain",         cat: "stills", tone: "clay", loc: "Series / 2025",  gear: "Frame export",      ar: "3 / 2" },
  ],

  /* ---- SELECTED WORK ---- */
  work: [
    { title: "The Long Quiet",  role: "Colorist",          type: "Feature",     year: "2026" },
    { title: "Salt & Static",   role: "Colorist · Online", type: "Series",      year: "2025" },
    { title: "Northwind",       role: "Editor",            type: "Doc Feature", year: "2025" },
    { title: "Glasshouse",      role: "Colorist",          type: "Series",      year: "2024" },
    { title: "Vela",            role: "Aerial Camera",     type: "Brand Film",  year: "2024" },
    { title: "Carry the Fire",  role: "Editor · Colorist", type: "Short",       year: "2023" },
  ],

  /* ---- PROJECTS ---- grouped by role; imdb optional (falls back to the
     owner's IMDb filmography when a title id isn't confirmed) ---- */
  imdbProfile: "https://www.imdb.com/name/nm5585716/",
  projectGroups: [
    {
      role: "Digital Intermediate Editor",
      films: [
        { id: "working-man",      title: "A Working Man",                     year: "2025", imdb: "tt9150192"  },
        { id: "stone-cold-fox",   title: "Stone Cold Fox",                    year: "2025", imdb: "tt27368237", poster: "https://m.media-amazon.com/images/M/MV5BYmIwMzMzNGQtMzdhZi00N2I3LWEwZjgtMjBhOGJkOWFkZjljXkEyXkFqcGc@._V1_FMjpg_UY337_.jpg" },
        { id: "hollywood-grit",   title: "Hollywood Grit",                    year: "2025", imdb: "tt30841007" },
        { id: "fallout",          title: "Fallout",                           year: "2024", imdb: "tt12637874" },
        { id: "smile2",           title: "Smile 2",                           year: "2024", imdb: "tt29268110" },
        { id: "kingdom",          title: "Kingdom of the Planet of the Apes", year: "2024", imdb: "tt11389872" },
        { id: "musica",           title: "Música",                            year: "2024", imdb: "tt19853698" },
        { id: "winner",           title: "Winner",                            year: "2024", imdb: "tt11433906" },
        { id: "monster-summer",   title: "Monster Summer",                    year: "2024", imdb: "tt3954936"  },
        { id: "war-is-over",      title: "War Is Over!",                      year: "2023", imdb: "tt29795707" },
        { id: "peripheral",       title: "The Peripheral",                    year: "2022", imdb: "tt8291284"  },
        { id: "downfall",         title: "Downfall: The Case Against Boeing", year: "2022", imdb: "tt11893274", poster: "https://m.media-amazon.com/images/M/MV5BYTQzZjhjMGYtOTAyZi00NmI3LTllMGQtYTg3NTIzMWM1YTI4XkEyXkFqcGc@._V1_.jpg" },
        { id: "after-antarctica", title: "After Antarctica",                  year: "2021", imdb: "tt8075000"  },
        { id: "chef-show",        title: "The Chef Show",                     year: "2019", imdb: "tt10359446" },
        { id: "theyll-love-me",   title: "They'll Love Me When I'm Dead",     year: "2018", imdb: "tt6893836"  },
      ],
    },
    {
      role: "Colorist",
      films: [
        { id: "lost-treasure",    title: "Lost Treasure of the Valley",                  year: "2019", imdb: "tt10687302" },
        { id: "diagnosis",        title: "Diagnosis",                                    year: "2019", imdb: "tt8201618"  },
        { id: "rm-crossroads",    title: "ReMastered: Devil at the Crossroads",          year: "2019", imdb: "tt9046574"  },
        { id: "rm-miami",         title: "ReMastered: The Miami Showband Massacre",      year: "2019", imdb: "tt9046568"  },
        { id: "rm-sam-cooke",     title: "ReMastered: The Two Killings of Sam Cooke",    year: "2019", imdb: "tt9046564"  },
        { id: "rm-stadium",       title: "ReMastered: Massacre at the Stadium",          year: "2019", imdb: "tt9046562"  },
        { id: "rm-tricky-dick",   title: "ReMastered: Tricky Dick and the Man in Black", year: "2018", imdb: "tt9046556"  },
        { id: "rm-lions-share",   title: "ReMastered: The Lion's Share",                 year: "2018", imdb: "tt9046576"  },
        { id: "rm-jam-master",    title: "ReMastered: Who Killed Jam Master Jay?",       year: "2018", imdb: "tt9046560"  },
        { id: "rm-sheriff",       title: "ReMastered: Who Shot the Sheriff?",            year: "2018", imdb: "tt9046548"  },
        { id: "year-of-the-scab", title: "Year of the Scab",                             year: "2017", imdb: "tt6794436"  },
        { id: "hodges",           title: "Hodges Half Dozen",                            year: "2017", imdb: "tt7891830"  },
        { id: "lost-memories",    title: "Lost Memories",                                year: "2017", imdb: "tt6791830"  },
        { id: "in-absentia",      title: "In Absentia",                                  year: "2017", imdb: "tt4917526"  },
        { id: "deadly-dance",     title: "A Deadly Dance",                               year: "2019", imdb: "tt5702314"  },
        { id: "perfect-lineup",   title: "Perfect Lineup",                               year: "2016", imdb: "tt5078858"  },
        { id: "family-weekends",  title: "The Family Weekends",                          year: "2016", imdb: "tt5347148"  },
        { id: "im-gabrielle",     title: "I'm Gabrielle",                                year: "2015", imdb: "tt5238882"  },
        { id: "her-first",        title: "Her First Black Guy",                          year: "2015", imdb: "tt4419706"  },
        { id: "arthur",           title: "Arthur",                                       year: "2015", imdb: "tt3484516"  },
        { id: "cry-now",          title: "Cry Now",                                      year: "2014", imdb: "tt1597070"  },
        { id: "snowflake",        title: "Snowflake",                                    year: "2014", imdb: "tt3699228"  },
      ],
    },
  ],

  /* ---- NOW ---- */
  now: [
    { label: "FINISHING", body: "Finishing a 3 part limited series special." },
    { label: "Flying",    body: "Lots of paragliding, making up for lost flights and hours from 2025 season." },
    { label: "Building",  body: "This website, and a few automations for conform." },
    { label: "Reading",   body: "After Death by Dean Koontz" },
  ],

  /* ---- LINKS / ELSEWHERE ---- */
  links: [
    { label: "IMDb",      handle: "Khoren Mirzakhanian",    note: "Credits",         href: "https://www.imdb.com/name/nm5585716/" },
    { label: "LinkedIn",  handle: "in/khorenmirzakhanian",  note: "Professional",    href: "https://www.linkedin.com/in/khorenmirzakhanian/" },
    { label: "Instagram", handle: "@kolorlux",              note: "Stills & flight", href: "https://www.instagram.com/kolorlux/" },
    { label: "Email",     handle: "khoren@kolorlux.com",    note: "Get in touch",    href: "mailto:khoren@kolorlux.com" },
  ],
};
