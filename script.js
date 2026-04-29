const tabs = Array.from(document.querySelectorAll("[data-tab]"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
const openTabButtons = Array.from(document.querySelectorAll("[data-open-tab]"));
let episodesMap;

function setActiveTab(tabId) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    if (isActive) {
      tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.id === tabId;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });

  if (tabId === "episodes" && episodesMap) {
    setTimeout(() => episodesMap.invalidateSize(), 50);
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveTab(tab.dataset.tab);
  });
});

const brandLink = document.querySelector(".brand");
if (brandLink) {
  brandLink.addEventListener("click", () => {
    setActiveTab("about");
  });
}

openTabButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const tabId = button.dataset.openTab;
    setActiveTab(tabId);
    const panelTarget = document.getElementById(tabId);
    if (panelTarget) {
      panelTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

function setupOtherInputs() {
  const radiosWithOther = Array.from(document.querySelectorAll("input[type='radio'][data-other-target]"));
  const targets = new Map();
  const syncHandlers = [];

  radiosWithOther.forEach((radio) => {
    const targetId = radio.dataset.otherTarget;
    if (!targets.has(targetId)) {
      targets.set(targetId, []);
    }
    targets.get(targetId).push(radio);
  });

  targets.forEach((radioGroup, targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const input = target.querySelector("input, textarea");

    function syncVisibility() {
      const activeOther = radioGroup.some((radio) => radio.checked);
      target.hidden = !activeOther;
      if (input) {
        input.required = activeOther;
        if (!activeOther) input.value = "";
      }
    }

    radioGroup.forEach((radio) => {
      radio.addEventListener("change", syncVisibility);
      const allInName = document.querySelectorAll(`input[type='radio'][name='${radio.name}']`);
      allInName.forEach((item) => item.addEventListener("change", syncVisibility));
    });

    syncVisibility();
    syncHandlers.push(syncVisibility);
  });

  return () => {
    syncHandlers.forEach((handler) => handler());
  };
}

const syncOtherInputs = setupOtherInputs();

const form = document.querySelector(".apply-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name");

    alert(
      `Thanks${name ? `, ${name}` : ""}! Your application is captured in this draft. We can wire this to Netlify Forms and your selection workflow next.`
    );

    form.reset();
    syncOtherInputs();
  });
}

function initEpisodesMap() {
  const mapElement = document.getElementById("episodes-map");
  if (!mapElement || typeof L === "undefined") return;

  episodesMap = L.map("episodes-map", {
    scrollWheelZoom: true,
  }).setView([22.5, 80.0], 3);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(episodesMap);

  const locations = [
    {
      name: "Delhi, India",
      coords: [28.6139, 77.209],
      brief:
        "A layered city where old-world neighborhoods, food lanes, and modern rhythms meet.",
      episodes: [
        {
          title: "Street food and hidden lanes",
          url: "https://www.youtube.com/@THEUNTRAVELSHOW",
        },
      ],
    },
    {
      name: "Jaipur, India",
      coords: [26.9124, 75.7873],
      brief:
        "Royal architecture, craft traditions, and local stories that sit beyond postcard routes.",
      episodes: [
        {
          title: "Culture in one minute",
          url: "https://www.instagram.com/the.untravel.show?igsh=czhjaml2cG5wOGY=",
        },
      ],
    },
    {
      name: "Varanasi, India",
      coords: [25.3176, 82.9739],
      brief:
        "Sacred ghats, timeless rituals, and deeply personal narratives by the river.",
      episodes: [
        {
          title: "Deep dive destination story",
          url: "https://www.youtube.com/@THEUNTRAVELSHOW",
        },
      ],
    },
    {
      name: "Kochi, India",
      coords: [9.9312, 76.2673],
      brief:
        "A coastal blend of heritage, food culture, and contemporary creative life.",
      episodes: [
        {
          title: "Local culture and conversations",
          url: "https://www.youtube.com/@THEUNTRAVELSHOW",
        },
      ],
    },
    {
      name: "Budapest, Hungary",
      coords: [47.4979, 19.0402],
      brief:
        "Historic streets, Danube views, and layered cultural stories from Central Europe.",
      episodes: [
        {
          title: "Budapest Episode",
          url: "https://www.youtube.com/watch?v=bXpyIllUMGI",
        },
      ],
    },
    {
      name: "Dubrovnik, Croatia",
      coords: [42.6507, 18.0944],
      brief:
        "A walled coastal city with Adriatic charm, history, and cinematic old-town corners.",
      episodes: [
        {
          title: "Dubrovnik Episode",
          url: "https://www.youtube.com/watch?v=0UEx8eVkeMA",
        },
      ],
    },
    {
      name: "Ljubljana, Slovenia",
      coords: [46.0569, 14.5058],
      brief:
        "A relaxed riverside capital known for walkable neighborhoods and creative spirit.",
      episodes: [
        {
          title: "Ljubljana Episode",
          url: "https://www.youtube.com/watch?v=BROSc5GIk7o",
        },
      ],
    },
    {
      name: "Cotswolds, England",
      coords: [51.833, -1.8433],
      brief:
        "Rolling countryside, stone villages, and slow-travel storytelling in rural England.",
      episodes: [
        {
          title: "Cotswolds Episode",
          url: "https://www.youtube.com/watch?v=e85VRic1lS4",
        },
      ],
    },
    {
      name: "Hanoi, Vietnam",
      coords: [21.0278, 105.8342],
      brief:
        "Old Quarter energy, street food culture, and everyday life in Vietnam's capital.",
      episodes: [
        {
          title: "Hanoi Episode",
          url: "https://www.youtube.com/watch?v=PzH9Au_diZA&list=PL76-1IsJMwJKlz4J8Z7W-CZP03GnDwTJp",
        },
      ],
    },
    {
      name: "Bishkek, Kyrgyzstan",
      coords: [42.8746, 74.5698],
      brief:
        "A mountain-framed city and gateway to Central Asian landscapes and local culture.",
      episodes: [
        {
          title: "Bishkek Episode 1",
          url: "https://www.youtube.com/watch?v=RHsDCsXhBLI",
        },
        {
          title: "Bishkek Episode 2",
          url: "https://www.youtube.com/watch?v=q0puinIRWYE",
        },
        {
          title: "Bishkek Episode 3",
          url: "https://www.youtube.com/watch?v=hcb2NHl75wE",
        },
      ],
    },
    {
      name: "Kartarpur, Pakistan",
      coords: [32.0819, 75.0106],
      brief:
        "A deeply meaningful spiritual destination shaped by faith, history, and border stories.",
      episodes: [
        {
          title: "Kartarpur Episode 1",
          url: "https://www.youtube.com/watch?v=AfGv-TQlIas",
        },
        {
          title: "Kartarpur Episode 2",
          url: "https://www.youtube.com/watch?v=BcoorOvh5G8",
        },
      ],
    },
    {
      name: "Dublin, Ireland",
      coords: [53.3498, -6.2603],
      brief:
        "A literary, musical, and social city where pub culture and local character come alive.",
      episodes: [
        {
          title: "Dublin Episode 1",
          url: "https://youtu.be/Yq3uJeOkDPM?si=kmnu8jbA2qTFjPyu",
        },
        {
          title: "Dublin Episode 2",
          url: "https://youtu.be/S1P4Ny7qhVM?si=LTVGISIdV-LIiFrc",
        },
        {
          title: "Dublin Episode 3",
          url: "https://youtu.be/rxiyYQnJzzo?si=0qtuz_NGzSq8RiaB",
        },
        {
          title: "Dublin Episode 4",
          url: "https://youtu.be/zkFSPNFSfoo?si=KZlfSqqdcd20s4vm",
        },
      ],
    },
  ];

  locations.forEach((location) => {
    const marker = L.marker(location.coords).addTo(episodesMap);
    const episodesHtml = location.episodes
      .map(
        (episode) =>
          `<li><a href="${episode.url}" target="_blank" rel="noreferrer">${episode.title}</a></li>`
      )
      .join("");

    marker.bindPopup(`
      <div class="episode-popup">
        <h4>${location.name}</h4>
        <p>${location.brief}</p>
        <ul>${episodesHtml}</ul>
      </div>
    `);
  });
}

initEpisodesMap();
