(function () {
  const root = document.documentElement;
  const page = document.body.dataset.page || "";
  const menuButton = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-main-nav]");
  const langButton = document.querySelector("[data-lang-toggle]");
  try { document.body.dataset.theme = localStorage.getItem("carechina-theme") || "clinic"; } catch (_) { document.body.dataset.theme = "clinic"; }

  document.querySelectorAll(`[data-nav="${page}"]`).forEach((link) => {
    link.classList.add("active");
    const dropdown = link.closest(".nav-dropdown");
    if (dropdown) dropdown.classList.add("has-active");
  });

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      nav.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
        dropdown.toggleAttribute("open", open && window.matchMedia("(max-width: 1040px)").matches);
      });
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      nav.querySelectorAll(".nav-dropdown").forEach((dropdown) => dropdown.removeAttribute("open"));
    }));
  }

  document.addEventListener("click", (event) => {
    if (nav && nav.classList.contains("open")) return;
    document.querySelectorAll(".nav-dropdown[open]").forEach((dropdown) => {
      if (!dropdown.contains(event.target)) dropdown.removeAttribute("open");
    });
  });

  function setLanguage(lang) {
    root.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-en][data-zh]").forEach((node) => {
      node.textContent = node.dataset[lang];
    });
    document.querySelectorAll("[data-placeholder-en][data-placeholder-zh]").forEach((node) => {
      node.placeholder = node.dataset[`placeholder${lang === "zh" ? "Zh" : "En"}`];
    });
    if (langButton) langButton.textContent = lang === "zh" ? "EN" : "中文";
    try { localStorage.setItem("carechina-language", lang); } catch (_) {}
    document.dispatchEvent(new CustomEvent("carechina:language", { detail: { lang } }));
  }

  let language = "en";
  try { language = localStorage.getItem("carechina-language") || "en"; } catch (_) {}
  setLanguage(language);
  if (langButton) langButton.addEventListener("click", () => setLanguage(root.lang.startsWith("zh") ? "en" : "zh"));

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }), { threshold: .08 })
    : null;
  document.querySelectorAll("[data-reveal]").forEach((node) => observer ? observer.observe(node) : node.classList.add("visible"));

  document.querySelectorAll("[data-tab-target]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const group = tab.closest("[data-tabs]");
      if (!group) return;
      group.querySelectorAll("[data-tab-target]").forEach((item) => item.classList.toggle("active", item === tab));
      group.parentElement.querySelectorAll("[data-tab-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.tabPanel === tab.dataset.tabTarget));
    });
  });
})();
