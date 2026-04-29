const tabs = Array.from(document.querySelectorAll("[data-tab]"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
const openTabButtons = Array.from(document.querySelectorAll("[data-open-tab]"));

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
