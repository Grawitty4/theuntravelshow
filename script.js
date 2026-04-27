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

openTabButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const tabId = button.dataset.openTab;
    setActiveTab(tabId);
    const tabTarget = document.querySelector(`[data-tab="${tabId}"]`);
    if (tabTarget) {
      tabTarget.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

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
  });
}
