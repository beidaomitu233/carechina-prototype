(function () {
  "use strict";
  const root = document.documentElement;
  const body = document.body;
  const page = body.dataset.page || "";
  let language = "en";
  try { language = localStorage.getItem("huayian-language-v04") || "en"; } catch (_) {}

  const copy = (item, key) => item[key + (language === "zh" ? "Zh" : "En")] || item[key] || "";
  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  };
  const safeSite = (site) => String(site || "").toLowerCase().startsWith("http") ? site : "https://" + site;
  const technologySlug = (value) => String(value || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").replace(/-and-/g, "-");

  function initFooterContact() {
    const footerMain = document.querySelector(".site-footer .footer-main");
    if (!footerMain || footerMain.querySelector(".footer-contact")) return;
    const contact = document.createElement("div");
    contact.className = "footer-contact";
    contact.innerHTML = '<h3 data-en="Contact" data-zh="联系我们">Contact</h3><div class="footer-contact-list">' +
      '<a class="footer-contact-item" href="mailto:support@cmedtrip.com"><span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 6.5h18v12H3z"/><path d="m4 8 8 6 8-6"/></svg></span><span>support@cmedtrip.com</span></a>' +
      '<div class="footer-contact-item"><span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21a9 9 0 1 0-7.8-4.5L3 21l4.7-1.2A9 9 0 0 0 12 21Z"/><path d="M8.8 8.2c.3 3.2 2.1 5 5.3 5.9l1.3-1.3 2.1 1c-.4 2-1.6 3-3.4 2.8-4.3-.8-6.9-3.4-7.7-7.7-.2-1.8.8-3 2.8-3.4l1 2.1-1.4.6Z"/></svg></span><span>WhatsApp: xxxx</span></div>' +
      '<a class="footer-contact-item" href="tel:+8619987758890"><span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7.2 3.5 4.6 5.8c.2 6.7 6.9 13.4 13.6 13.6l2.3-2.6-4.2-3-2 2c-2.6-1.1-5-3.5-6.1-6.1l2-2-3-4.2Z"/></svg></span><span>+86 199 8775 8890</span></a>' +
      '<div class="footer-contact-item"><span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span><span data-en="Qingshan Digital Valley, Qingshan District, Wuhan, Hubei" data-zh="湖北省武汉市青山区青山数谷">Qingshan Digital Valley, Qingshan District, Wuhan, Hubei</span></div>' +
      '</div>';
    footerMain.appendChild(contact);
  }

  function initSiteLinks() {
    document.querySelectorAll("[data-main-nav]").forEach((nav) => {
      if (!nav.querySelector('[data-nav="tcm"]')) {
        const link = document.createElement("a");
        link.href = "tcm-wellness.html";
        link.dataset.nav = "tcm";
        link.dataset.en = "TCM & recovery";
        link.dataset.zh = "中医与调养";
        link.textContent = "TCM & recovery";
        const treatments = nav.querySelector('[data-nav="treatments"]');
        if (treatments) treatments.insertAdjacentElement("afterend", link);
        else nav.appendChild(link);
      }
      nav.querySelectorAll('[data-nav="partner"]').forEach((link) => link.remove());
      if (!nav.querySelector('[data-nav="costs"]')) {
        const link = document.createElement("a");
        link.href = "costs.html";
        link.dataset.nav = "costs";
        link.dataset.en = "Cost calculator";
        link.dataset.zh = "费用计算";
        link.textContent = "Cost calculator";
        const hospitals = nav.querySelector('[data-nav="hospitals"]');
        if (hospitals) hospitals.insertAdjacentElement("afterend", link);
        else nav.appendChild(link);
      }
    });
  }

  function setLanguage(next) {
    language = next === "zh" ? "zh" : "en";
    root.lang = language === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-en][data-zh]").forEach((node) => {
      node.textContent = node.dataset[language];
    });
    document.querySelectorAll("[data-placeholder-en][data-placeholder-zh]").forEach((node) => {
      node.placeholder = node.dataset["placeholder" + (language === "zh" ? "Zh" : "En")];
    });
    const toggle = document.querySelector("[data-lang-toggle]");
    if (toggle) toggle.textContent = language === "zh" ? "EN" : "中文";
    try { localStorage.setItem("huayian-language-v04", language); } catch (_) {}
    document.dispatchEvent(new CustomEvent("huayian:language", { detail: { lang: language } }));
  }

  initSiteLinks();
  document.querySelectorAll('[data-nav="' + page + '"]').forEach((link) => link.classList.add("active"));
  const menuButton = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-main-nav]");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      body.classList.toggle("menu-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("open");
      body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }
  const langButton = document.querySelector("[data-lang-toggle]");
  if (langButton) langButton.addEventListener("click", () => setLanguage(language === "zh" ? "en" : "zh"));

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }), { threshold: .08 })
    : null;
  document.querySelectorAll("[data-reveal]").forEach((node) => observer ? observer.observe(node) : node.classList.add("visible"));

  function initJourney() {
    const journey = document.querySelector("[data-journey]");
    if (!journey) return;
    const tabs = [...journey.querySelectorAll("[data-journey-tab]")];
    const panels = [...journey.querySelectorAll("[data-journey-panel]")];
    const companionSteps = [...journey.querySelectorAll("[data-companion-step]")];
    const stage = journey.querySelector(".journey-stage");
    let index = 0;
    let timer;
    const select = (next) => {
      index = (next + tabs.length) % tabs.length;
      tabs.forEach((tab, i) => tab.classList.toggle("active", i === index));
      panels.forEach((panel, i) => panel.classList.toggle("active", i === index));
      companionSteps.forEach((step, i) => step.classList.toggle("active", i === index));
      const progress = stage.querySelector(".journey-progress span");
      if (progress) {
        progress.style.animation = "none";
        void progress.offsetWidth;
        progress.style.animation = "";
      }
    };
    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => select(index + 1), 5000);
    };
    tabs.forEach((tab, i) => tab.addEventListener("click", () => { select(i); start(); }));
    stage.addEventListener("mouseenter", () => { clearInterval(timer); stage.classList.add("paused"); });
    stage.addEventListener("mouseleave", () => { stage.classList.remove("paused"); start(); });
    stage.addEventListener("focusin", () => { clearInterval(timer); stage.classList.add("paused"); });
    stage.addEventListener("focusout", () => { stage.classList.remove("paused"); start(); });
    start();
  }

  function initStageBoard() {
    const board = document.querySelector("[data-stage-board]");
    if (!board) return;
    const cards = [...board.querySelectorAll("[data-stage]")];
    const title = board.querySelector("[data-stage-title]");
    const description = board.querySelector("[data-stage-copy]");
    const link = board.querySelector("[data-stage-link]");
    const content = {
      explore: {
        en: ["Explore treatment options", "Browse care pathways or tell us what treatment you are considering.", "Explore treatments"],
        zh: ["查看医疗方向", "浏览医疗方向，或告诉我们您正在考虑的治疗。", "查看医疗方向"],
        href: "treatments.html"
      },
      records: {
        en: ["Request a specialist review", "Send records securely after a coordinator confirms what the hospital needs.", "Start consultation"],
        zh: ["申请专科评估", "协调员确认资料清单后，再安全提交病历。", "开启咨询"],
        href: "#consultation"
      },
      hospital: {
        en: ["Confirm hospital access", "Check the relevant department, current availability and expected schedule.", "Find a hospital"],
        zh: ["确认医院接诊", "核对相关专科、当前接诊情况与预计档期。", "查找医院"],
        href: "hospitals.html"
      },
      travel: {
        en: ["Arrange your China journey", "Coordinate admission, visa documents, arrival, accommodation and interpretation.", "View patient guide"],
        zh: ["安排来华行程", "衔接入院、签证材料、抵达、住宿与医疗翻译。", "查看患者指南"],
        href: "guide.html"
      }
    };
    let active = cards.find((card) => card.classList.contains("active")) || cards[0];
    const render = (card) => {
      active = card;
      cards.forEach((item) => item.classList.toggle("active", item === card));
      const item = content[card.dataset.stage];
      const copySet = item[language];
      title.textContent = copySet[0];
      description.textContent = copySet[1];
      link.textContent = copySet[2];
      link.href = item.href;
    };
    cards.forEach((card) => card.addEventListener("click", () => render(card)));
    document.addEventListener("huayian:language", () => render(active));
    render(active);
  }

  document.querySelectorAll(".faq-question").forEach((button) => button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const list = item.parentElement;
    list.querySelectorAll(".faq-item").forEach((row) => row.classList.toggle("open", row === item && !item.classList.contains("open")));
  }));

  function initFloatingPanels() {
    const support = document.querySelector("[data-support-panel]");
    const theme = document.querySelector("[data-theme-panel]");
    const closeAll = () => [support, theme].forEach((panel) => panel && panel.classList.remove("open"));
    const bind = (buttonSelector, panel) => {
      const button = document.querySelector(buttonSelector);
      if (!button || !panel) return;
      button.addEventListener("click", () => {
        const wasOpen = panel.classList.contains("open");
        closeAll();
        panel.classList.toggle("open", !wasOpen);
      });
    };
    bind("[data-support-toggle]", support);
    bind("[data-theme-toggle]", theme);
    document.querySelectorAll("[data-panel-close]").forEach((button) => button.addEventListener("click", closeAll));

    let themeName = "clinic";
    try { themeName = localStorage.getItem("huayian-theme") || "clinic"; } catch (_) {}
    body.dataset.theme = themeName;
    const themeButtons = [...document.querySelectorAll("[data-theme-value]")];
    const syncTheme = () => themeButtons.forEach((button) => button.classList.toggle("active", button.dataset.themeValue === body.dataset.theme));
    themeButtons.forEach((button) => button.addEventListener("click", () => {
      body.dataset.theme = button.dataset.themeValue;
      try { localStorage.setItem("huayian-theme", button.dataset.themeValue); } catch (_) {}
      syncTheme();
    }));
    syncTheme();

    const chatForm = document.querySelector("[data-chat-form]");
    const chatBody = document.querySelector("[data-chat-body]");
    if (chatForm && chatBody) {
      const reply = () => language === "zh" ? "已记录。协调员会在24小时内联系您。" : "Thank you. A care coordinator will contact you within 24 hours.";
      chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = chatForm.querySelector("input");
        if (!input.value.trim()) return;
        const user = document.createElement("div");
        user.className = "chat-message user";
        user.textContent = input.value.trim();
        chatBody.appendChild(user);
        input.value = "";
        window.setTimeout(() => {
          const message = document.createElement("div");
          message.className = "chat-message";
          message.textContent = reply();
          chatBody.appendChild(message);
          chatBody.scrollTop = chatBody.scrollHeight;
        }, 350);
      });
      chatBody.querySelectorAll(".chat-option").forEach((option) => option.addEventListener("click", () => {
        chatForm.querySelector("input").value = option.textContent;
        chatForm.requestSubmit();
      }));
    }
  }

  function initHomeMatch() {
    const wrap = document.querySelector("[data-home-match]");
    if (!wrap || !window.HUAYIAN_HOSPITALS) return;
    const citySelect = wrap.querySelector("[data-match-city]");
    const result = wrap.querySelector("[data-match-result]");
    const specialtyButtons = [...wrap.querySelectorAll("[data-specialty]")];
    let specialty = specialtyButtons.length ? Number(specialtyButtons[0].dataset.specialty) : null;
    Object.entries(window.HUAYIAN_HOSPITAL_FILTERS.cities).forEach(([id, city]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = language === "zh" ? city.zh : city.en;
      citySelect.appendChild(option);
    });
    const rankScore = (hospital) => {
      const match = (hospital.rank || "").match(/#(\d+)/);
      return (hospital.top ? -100 : 0) + (match ? Number(match[1]) : 180) - (hospital.halal || 0);
    };
    const render = () => {
      if (specialty === null) return;
      const city = citySelect.value;
      const specialtyMeta = window.HUAYIAN_HOSPITAL_FILTERS.specialties.find((item) => item.id === specialty);
      const rows = window.HUAYIAN_HOSPITALS
        .filter((hospital) => hospital.tags.includes(specialty) && (!city || hospital.city === city))
        .sort((a, b) => rankScore(a) - rankScore(b))
        .slice(0, 3);
      result.innerHTML = '<div class="match-result-head"><div><small>' + (language === "zh" ? "医院参考" : "Hospital references") + '</small><h3>' + (language === "zh" ? specialtyMeta.zh : specialtyMeta.en) + '</h3></div><strong>' + rows.length + '/3</strong></div><div class="home-hospital-grid">' +
        rows.map((hospital) => {
          const initials = copy(hospital, "name").split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
          const logo = logoMap[hospital.id] ? '<img src="' + logoMap[hospital.id] + '" alt="">' : '<span>' + initials + '</span>';
          return '<a class="home-hospital-card" href="hospitals.html?specialty=' + specialty + '&city=' + encodeURIComponent(city) + '"><span class="home-hospital-visual">' + logo + '</span><span class="home-hospital-body"><small>' + copy(hospital, "city") + '</small><h3>' + copy(hospital, "name") + '</h3><p class="home-hospital-summary">' + copy(hospital, "special") + '</p></span></a>';
        }).join("") +
        '</div>';
    };
    specialtyButtons.forEach((button) => button.addEventListener("click", () => {
      specialty = Number(button.dataset.specialty);
      specialtyButtons.forEach((item) => item.classList.toggle("active", item === button));
      render();
    }));
    citySelect.addEventListener("change", render);
    document.addEventListener("huayian:language", () => {
      [...citySelect.options].forEach((option, index) => {
        if (index === 0) option.textContent = language === "zh" ? "全部城市" : "All cities";
        else {
          const city = window.HUAYIAN_HOSPITAL_FILTERS.cities[option.value];
          option.textContent = language === "zh" ? city.zh : city.en;
        }
      });
      render();
    });
    specialtyButtons.forEach((button, index) => button.classList.toggle("active", index === 0));
    render();
  }

  function initConsultation() {
    const form = document.querySelector("[data-consult-form]");
    if (!form) return;
    const care = form.querySelector('[name="care"]');
    if (new URLSearchParams(location.search).get("estimate") === "1") {
      try {
        const estimate = JSON.parse(sessionStorage.getItem("huayian-cost-plan"));
        if (estimate) {
          care.value = [...care.options].some((option) => option.value === estimate.care) ? estimate.care : "other";
          form.querySelector('[name="need"]').value = estimate.text;
        }
      } catch (_) {}
    }
    const result = form.querySelector("[data-budget-result]");
    const ranges = {
      oncology:["US$25,000–80,000","4–8 weeks / 4–8周"],
      cardiac:["US$32,000–48,000","3–4 weeks / 3–4周"],
      orthopedics:["US$15,000–25,000","2–4 weeks / 2–4周"],
      ophthalmology:["US$6,000–15,000","1–3 weeks / 1–3周"]
    };
    care.addEventListener("change", () => {
      const plan = ranges[care.value];
      result.classList.toggle("active", Boolean(plan));
      if (plan) {
        result.querySelector("[data-budget-cost]").textContent = plan[0];
        result.querySelector("[data-budget-stay]").textContent = plan[1];
      }
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      setText("[data-form-state]", language === "zh" ? "咨询需求已提交" : "Consultation request submitted");
    });
  }

  function treatmentCard(item) {
    return '<a class="directory-card" href="treatment.html?id=' + item.id + '" data-category="' + item.category + '"><div class="directory-image"><img src="' + item.image + '" alt=""></div><div class="directory-body"><div class="directory-meta"><span>' + copy(item, "name") + '</span><span>' + item.cost + '</span></div><h3>' + copy(item, "name") + '</h3><p>' + copy(item, "summary") + '</p><div class="directory-facts"><div><span>' + (language === "zh" ? "预算参考" : "Planning range") + '</span><b>' + item.cost + '</b></div><div><span>' + (language === "zh" ? "预计在华" : "Typical stay") + '</span><b>' + item.stay + '</b></div></div></div></a>';
  }

  function initTreatmentDirectory() {
    const grid = document.querySelector("[data-treatment-grid]");
    if (!grid || !window.HUAYIAN_TREATMENTS) return;
    const search = document.querySelector("[data-treatment-search]");
    const chips = [...document.querySelectorAll("[data-treatment-category]")];
    let category = "all";
    const render = () => {
      const term = (search ? search.value : "").trim().toLowerCase();
      const items = window.HUAYIAN_TREATMENTS.filter((item) => {
        const text = [item.nameEn,item.nameZh,item.summaryEn,item.summaryZh].join(" ").toLowerCase();
        return (category === "all" || item.category === category) && (!term || text.includes(term));
      });
      grid.innerHTML = items.length ? items.map(treatmentCard).join("") : '<div class="empty-state">' + (language === "zh" ? "没有找到相关医疗方向。" : "No matching treatment found.") + '</div>';
      setText("[data-treatment-count]", String(items.length));
    };
    if (search) search.addEventListener("input", render);
    chips.forEach((chip) => chip.addEventListener("click", () => {
      category = chip.dataset.treatmentCategory;
      chips.forEach((item) => item.classList.toggle("active", item === chip));
      render();
    }));
    document.addEventListener("huayian:language", render);
    render();
  }

  function initTreatmentDetail() {
    const container = document.querySelector("[data-treatment-detail]");
    if (!container || !window.HUAYIAN_TREATMENTS) return;
    const id = new URLSearchParams(location.search).get("id") || "oncology";
    const item = window.HUAYIAN_TREATMENTS.find((row) => row.id === id) || window.HUAYIAN_TREATMENTS[0];
    const render = () => {
      document.title = copy(item, "name") + " · HUAYIAN CARE TRIP";
      setText("[data-detail-title]", copy(item, "name"));
      setText("[data-detail-summary]", copy(item, "summary"));
      setText("[data-detail-cost]", item.cost);
      setText("[data-detail-stay]", item.stay);
      const image = document.querySelector("[data-detail-image]");
      if (image) image.src = item.image;
      const list = document.querySelector("[data-detail-includes]");
      const includes = language === "zh" ? item.includesZh : item.includesEn;
      if (list) list.innerHTML = includes.map((value) => "<li>" + value + "</li>").join("");
      const technologyGrid = document.querySelector("[data-technology-grid]");
      const technologySet = window.HUAYIAN_TECHNOLOGIES && window.HUAYIAN_TECHNOLOGIES[item.id];
      if (technologyGrid && technologySet) {
        technologyGrid.innerHTML = technologySet.map((technology, index) => '<a class="technology-card" href="technology.html?category=' + item.id + '&tech=' + technologySlug(technology.nameEn) + '"><span>0' + (index + 1) + '</span><h3>' + copy(technology, "name") + '</h3><p>' + copy(technology, "summary") + '</p><small>' + copy(technology, "note") + '</small><b class="technology-card-link">' + (language === "zh" ? "查看技术详情" : "View treatment details") + ' →</b></a>').join("");
      }
      document.querySelectorAll("[data-specialty-link]").forEach((link) => link.href = "hospitals.html?specialty=" + item.specialtyId);
    };
    document.addEventListener("huayian:language", render);
    render();
  }

  const logoMap = {
    tj:"assets/hospital-logos/tj.png",uh:"assets/hospital-logos/uh.png",wc:"assets/hospital-logos/wc.png",
    zy1:"assets/hospital-logos/zy1.png",nh:"assets/hospital-logos/nh.png",gp:"assets/hospital-logos/gp.png",
    pumch:"assets/hospital-logos/pumch.png",bjt:"assets/hospital-logos/bjt.png"
  };
  const photoMap = {
    tj:["assets/hospitals/tj-exterior.jpg","assets/hospitals/tj-interior.jpg","assets/hospitals/tj-international-visit.jpg"],
    zn:["assets/hospital-zhongnan-exterior.jpg","assets/hospital-zhongnan-interior.jpg","assets/hospitals/zn-care.jpg"],
    wc:["assets/city-chengdu-hospital.jpg","assets/hero-international-care.jpg"],
    sysc:["assets/city-guangzhou-hospital.jpg","assets/clinical-surgery-whsyy.jpg"],
    zy1:["assets/hero-international-care.jpg","assets/case-zhejiang-international.png"]
  };
  function hospitalCard(item) {
    const initials = copy(item, "name").split(/\s+/).slice(0,2).map((word) => word[0]).join("");
    const logo = logoMap[item.id] ? '<img src="' + logoMap[item.id] + '" alt="">' : '<span class="hospital-logo-fallback">' + initials + '</span>';
    return '<button class="hospital-card" type="button" data-hospital-id="' + item.id + '"><span class="hospital-logo">' + logo + '</span><span class="hospital-copy"><small>' + copy(item, "city") + '</small><span class="hospital-name">' + copy(item, "name") + '</span><span class="hospital-summary">' + copy(item, "special") + '</span></span><span class="hospital-card-arrow" aria-hidden="true">↗</span></button>';
  }

  function initHospitalDirectory() {
    const list = document.querySelector("[data-hospital-list]");
    if (!list || !window.HUAYIAN_HOSPITALS) return;
    const search = document.querySelector("[data-hospital-search]");
    const city = document.querySelector("[data-hospital-city]");
    const specialty = document.querySelector("[data-hospital-specialty]");
    const more = document.querySelector("[data-hospital-more]");
    const query = new URLSearchParams(location.search);
    let limit = 12;
    const filters = window.HUAYIAN_HOSPITAL_FILTERS;
    setText("[data-directory-total]", String(window.HUAYIAN_HOSPITALS.length));
    setText("[data-directory-cities]", String(new Set(window.HUAYIAN_HOSPITALS.map((item) => item.city)).size));
    Object.entries(filters.cities).forEach(([id, item]) => city.add(new Option(language === "zh" ? item.zh : item.en, id)));
    filters.specialties.forEach((item) => specialty.add(new Option(language === "zh" ? item.zh : item.en, String(item.id))));
    city.value = query.get("city") || "";
    specialty.value = query.get("specialty") || "";
    const filtered = () => {
      const term = search.value.trim().toLowerCase();
      return window.HUAYIAN_HOSPITALS.filter((item) => {
        const haystack = [item.nameEn,item.nameZh,item.deptEn,item.deptZh,item.special,item.specialZh].join(" ").toLowerCase();
        return (!term || haystack.includes(term)) && (!city.value || item.city === city.value) && (specialty.value === "" || item.tags.includes(Number(specialty.value)));
      });
    };
    const render = () => {
      const rows = filtered();
      list.innerHTML = rows.slice(0, limit).map(hospitalCard).join("") || '<div class="empty-state">' + (language === "zh" ? "没有找到匹配医院。" : "No matching hospital found.") + '</div>';
      setText("[data-hospital-count]", String(rows.length));
      if (more) more.hidden = rows.length <= limit;
      list.querySelectorAll("[data-hospital-id]").forEach((button) => button.addEventListener("click", () => openHospital(button.dataset.hospitalId)));
    };
    const reset = () => { limit = 12; render(); };
    search.addEventListener("input", reset);
    city.addEventListener("change", reset);
    specialty.addEventListener("change", reset);
    if (more) more.addEventListener("click", () => { limit += 12; render(); });
    document.addEventListener("huayian:language", () => {
      const cityValue = city.value;
      const specialtyValue = specialty.value;
      city.innerHTML = '<option value="">' + (language === "zh" ? "全部城市" : "All cities") + '</option>';
      Object.entries(filters.cities).forEach(([id, item]) => city.add(new Option(language === "zh" ? item.zh : item.en, id)));
      specialty.innerHTML = '<option value="">' + (language === "zh" ? "全部专科" : "All specialties") + '</option>';
      filters.specialties.forEach((item) => specialty.add(new Option(language === "zh" ? item.zh : item.en, String(item.id))));
      city.value = cityValue;
      specialty.value = specialtyValue;
      render();
    });
    render();
  }

  function openHospital(id) {
    const modal = document.querySelector("[data-hospital-modal]");
    const item = window.HUAYIAN_HOSPITALS.find((row) => row.id === id);
    if (!modal || !item) return;
    const photos = photoMap[id] || ["assets/hero-international-care.jpg","assets/hospital-tongji-international.jpg"];
    modal.querySelector('[data-modal-gallery]').hidden = Boolean(item.source && !photoMap[id]);
    modal.querySelector("[data-modal-gallery]").innerHTML = photos.slice(0,3).map((path) => '<img src="' + path + '" alt="">').join("");
    modal.querySelector("[data-modal-title]").textContent = copy(item, "name");
    modal.querySelector("[data-modal-copy]").textContent = copy(item, "special");
    modal.querySelector("[data-modal-city]").textContent = copy(item, "city");
    modal.querySelector("[data-modal-rank]").textContent = copy(item, "rank");
    modal.querySelector("[data-modal-dept]").textContent = copy(item, "dept");
    modal.querySelector("[data-modal-site]").href = safeSite(item.site);
    let source = modal.querySelector('[data-modal-source]');
    if (!source) {
      source = document.createElement('a');
      source.dataset.modalSource = '';
      source.className = 'hospital-source-link';
      source.target = '_blank';
      source.rel = 'noopener';
      modal.querySelector('[data-modal-site]').insertAdjacentElement('afterend', source);
    }
    source.hidden = !item.source;
    if (item.source) {
      source.href = item.source;
      source.textContent = language === 'zh' ? '资料来源 ↗' : 'Source information ↗';
    }
    modal.classList.add("open");
    body.classList.add("menu-open");
  }

  document.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", () => {
    button.closest(".modal").classList.remove("open");
    body.classList.remove("menu-open");
  }));
  document.querySelectorAll(".modal").forEach((modal) => modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("open");
      body.classList.remove("menu-open");
    }
  }));

  function initCases() {
    const list = document.querySelector("[data-case-list]");
    if (!list || !window.HUAYIAN_CASES) return;
    const render = () => {
      list.innerHTML = window.HUAYIAN_CASES.map((item) => '<a class="case-row" href="case.html?id=' + item.id + '"><div class="case-row-media"><img src="' + item.image + '" alt=""></div><div class="case-row-copy"><p class="kicker">' + copy(item, "place") + '</p><h2>' + copy(item, "title") + '</h2><div class="case-facts"><span>' + copy(item, "patient") + '</span><span>' + copy(item, "treatment") + '</span><span>' + copy(item, "duration") + '</span></div><p>' + copy(item, "intro") + '</p><span class="text-link">' + (language === "zh" ? "查看诊疗行程" : "Read the journey") + '</span></div></a>').join("");
    };
    document.addEventListener("huayian:language", render);
    render();
  }

  function initCaseDetail() {
    const detail = document.querySelector("[data-case-detail]");
    if (!detail || !window.HUAYIAN_CASES) return;
    const id = new URLSearchParams(location.search).get("id") || window.HUAYIAN_CASES[0].id;
    const item = window.HUAYIAN_CASES.find((row) => row.id === id) || window.HUAYIAN_CASES[0];
    const render = () => {
      document.title = copy(item, "title") + " · HUAYIAN CARE TRIP";
      setText("[data-case-title]", copy(item, "title"));
      setText("[data-case-intro]", copy(item, "intro"));
      setText("[data-case-place]", copy(item, "place"));
      setText("[data-case-patient]", copy(item, "patient"));
      setText("[data-case-treatment]", copy(item, "treatment"));
      setText("[data-case-duration]", copy(item, "duration"));
      setText("[data-case-challenge]", copy(item, "challenge"));
      setText("[data-case-plan]", copy(item, "plan"));
      setText("[data-case-coordination]", copy(item, "coordination"));
      setText("[data-case-result]", copy(item, "result"));
      const image = document.querySelector("[data-case-image]");
      if (image) image.src = item.image;
      const source = document.querySelector("[data-case-source]");
      if (source) source.href = item.source;
    };
    document.addEventListener("huayian:language", render);
    render();
  }

  function initTcm() {
    const choices = [...document.querySelectorAll("[data-tcm]")];
    const result = document.querySelector("[data-tcm-result]");
    if (!choices.length || !result) return;
    const programs = {
      rehab:{
        en:["Post-treatment recovery","A physician reviews mobility, strength and treatment history before setting the rehabilitation schedule."],
        zh:["诊后康复","医生评估活动能力、体能与既往治疗后，再制定康复频次与周期。"]
      },
      pain:{
        en:["Pain management","A physician reviews the cause of pain, current medication and contraindications before selecting therapies."],
        zh:["疼痛管理","医生评估疼痛原因、当前用药与禁忌后，再选择适宜项目。"]
      },
      sleep:{
        en:["Sleep and stress","A physician assesses sleep, stress and overall health before preparing a combined plan."],
        zh:["睡眠与压力","医生综合评估睡眠、压力与整体健康后制定方案。"]
      },
      digestion:{
        en:["Digestive wellbeing","A TCM physician reviews appetite, digestion, medication and recent examinations before selecting supportive therapies."],
        zh:["脾胃调养","中医师结合饮食、消化、用药与近期检查制定辅助调养方案。"]
      },
      womens:{
        en:["Women's health","Cycle history, current treatment and wellbeing goals are reviewed before a physician-led program is prepared."],
        zh:["女性调养","结合生理周期、既往治疗与调养目标，由医生制定个体方案。"]
      },
      vitality:{
        en:["Vitality and balance","A personalized program combines consultation, daily therapies and progress review around your stay in China."],
        zh:["体质调养","围绕在华时间安排问诊、日常理疗与阶段复评。"]
      },
      respiratory:{
        en:["Respiratory recovery","A physician reviews respiratory symptoms, current treatment and exercise tolerance before preparing supportive care."],
        zh:["呼吸调养","医生结合呼吸症状、当前治疗与运动耐力制定辅助调养方案。"]
      },
      metabolic:{
        en:["Metabolic health","Nutrition, sleep, activity and current medication are reviewed together for a physician-led program."],
        zh:["代谢管理","结合营养、睡眠、活动与现有用药制定医生指导方案。"]
      },
      oncology:{
        en:["Cancer supportive care","Support for appetite, fatigue, sleep and recovery is coordinated with the oncology treatment team."],
        zh:["肿瘤辅助调养","围绕食欲、疲劳、睡眠与恢复进行辅助调养，并与肿瘤治疗团队协同。"]
      },
      senior:{
        en:["Healthy ageing","Function, medication, sleep and nutrition are reviewed to build a safe daily wellbeing plan."],
        zh:["银龄调养","综合功能、用药、睡眠与营养制定安全的日常调养方案。"]
      }
    };
    let active = null;
    const render = (choice) => {
      active = choice;
      choices.forEach((item) => item.classList.toggle("active", item === choice));
      result.classList.add("active");
      const content = programs[choice.dataset.tcm][language];
      setText("[data-tcm-title]", content[0]);
      setText("[data-tcm-copy]", content[1]);
    };
    choices.forEach((choice) => choice.addEventListener("click", () => render(choice)));
    document.addEventListener("huayian:language", () => { if (active) render(active); });
    render(choices[0]);
  }

  function initContactActions() {
    const state = document.querySelector("[data-contact-state]");
    document.querySelectorAll("[data-contact-action]").forEach((button) => button.addEventListener("click", async () => {
      const action = button.dataset.contactAction;
      if (action === "chat") {
        const panel = document.querySelector("[data-support-panel]");
        if (panel) {
          panel.classList.add("open");
          const input = panel.querySelector("input");
          if (input) input.focus();
        }
        if (state) state.textContent = language === "zh" ? "客服窗口已打开" : "Care chat opened";
      }
      if (action === "location") {
        const address = language === "zh" ? "湖北省武汉市青山区青山数谷" : "Qingshan Digital Valley, Qingshan District, Wuhan, Hubei";
        try { await navigator.clipboard.writeText(address); } catch (_) {}
        if (state) state.textContent = language === "zh" ? "地址已复制" : "Address copied";
      }
    }));
  }

  function initGuideDetail() {
    const container = document.querySelector("[data-guide-detail]");
    if (!container || !window.HUAYIAN_GUIDES) return;
    const id = new URLSearchParams(location.search).get("id") || window.HUAYIAN_GUIDES[0].id;
    const item = window.HUAYIAN_GUIDES.find((guide) => guide.id === id) || window.HUAYIAN_GUIDES[0];
    const render = () => {
      document.title = copy(item, "title") + " · HUAYIAN CARE TRIP";
      setText("[data-guide-title]", copy(item, "title"));
      setText("[data-guide-summary]", copy(item, "summary"));
      setText("[data-guide-reading]", copy(item, "reading"));
      const detailSet = window.HUAYIAN_GUIDE_DETAILS && window.HUAYIAN_GUIDE_DETAILS[item.id];
      const sections = detailSet ? detailSet.sections : item.sections;
      const content = document.querySelector("[data-guide-content]");
      if (content) content.innerHTML = sections.map((section) => '<section class="guide-article-section"><span>' + section.number + '</span><h2>' + copy(section, "title") + '</h2><p>' + copy(section, "body") + '</p>' + (section.points ? '<ul>' + section.points.map((point) => '<li>' + copy(point, "text") + '</li>').join("") + '</ul>' : '') + '</section>').join("");
      const alert = document.querySelector("[data-guide-alert]");
      if (alert) {
        alert.hidden = !(detailSet && detailSet.alertEn);
        if (detailSet && detailSet.alertEn) alert.textContent = copy(detailSet, "alert");
      }
      setText("[data-guide-updated]", detailSet ? copy(detailSet, "updated") : "");
      const sources = document.querySelector("[data-guide-sources]");
      if (sources) {
        const rows = detailSet && detailSet.sources ? detailSet.sources : [{url:item.source,nameEn:"Official information",nameZh:"官方信息"}];
        sources.innerHTML = rows.map((source) => '<a href="' + source.url + '" target="_blank" rel="noopener">' + copy(source, "name") + '</a>').join("");
      }
    };
    document.addEventListener("huayian:language", render);
    render();
  }

  function initTechnologyDetail() {
    const container = document.querySelector("[data-technology-detail]");
    if (!container || !window.HUAYIAN_TREATMENTS || !window.HUAYIAN_TECHNOLOGY_DETAILS) return;
    const query = new URLSearchParams(location.search);
    const categoryId = query.get("category") || "oncology";
    const treatment = window.HUAYIAN_TREATMENTS.find((item) => item.id === categoryId) || window.HUAYIAN_TREATMENTS[0];
    const technologySet = window.HUAYIAN_TECHNOLOGIES[treatment.id] || [];
    const requested = query.get("tech") || technologySlug(technologySet[0] && technologySet[0].nameEn);
    const technology = technologySet.find((item) => technologySlug(item.nameEn) === requested) || technologySet[0];
    const id = technologySlug(technology && technology.nameEn);
    const detail = window.HUAYIAN_TECHNOLOGY_DETAILS[id];
    const category = window.HUAYIAN_TECHNOLOGY_CATEGORIES && window.HUAYIAN_TECHNOLOGY_CATEGORIES[treatment.id];
    if (!technology || !detail || !category) return;
    const list = (selector, values) => {
      const node = document.querySelector(selector);
      if (node) node.innerHTML = values.map((value) => "<li>" + value + "</li>").join("");
    };
    const render = () => {
      document.title = copy(technology, "name") + " · HUAYIAN CARE TRIP";
      setText("[data-tech-title]", copy(technology, "name"));
      setText("[data-tech-category]", copy(treatment, "name"));
      setText("[data-tech-overview]", copy(technology, "summary"));
      setText("[data-tech-mechanism]", copy(detail, "mechanism"));
      setText("[data-tech-note]", copy(technology, "note"));
      setText("[data-tech-setting]", copy(detail, "setting"));
      setText("[data-tech-timing]", copy(detail, "timing"));
      setText("[data-tech-team]", copy(detail, "team"));
      const image = document.querySelector("[data-tech-image]");
      if (image) image.src = treatment.image;
      const back = document.querySelector("[data-tech-back]");
      if (back) back.href = "treatment.html?id=" + treatment.id;
      list("[data-tech-candidates]", language === "zh" ? detail.candidatesZh : detail.candidatesEn);
      list("[data-tech-assessment]", language === "zh" ? detail.assessmentZh : detail.assessmentEn);
      list("[data-tech-benefits]", language === "zh" ? detail.benefitsZh : detail.benefitsEn);
      list("[data-tech-limits]", language === "zh" ? detail.limitsZh : detail.limitsEn);
      list("[data-tech-risks]", language === "zh" ? detail.risksZh : detail.risksEn);
      list("[data-tech-records]", language === "zh" ? category.recordsZh : category.recordsEn);
      const pathway = language === "zh" ? category.pathZh : category.pathEn;
      const pathwayNode = document.querySelector("[data-tech-pathway]");
      if (pathwayNode) pathwayNode.innerHTML = pathway.map((step, index) => '<article><span>0' + (index + 1) + '</span><h3>' + step.title + '</h3><p>' + step.body + '</p></article>').join("");
      const coordination = language === "zh"
        ? [["资料准备", "按医院要求整理病历、影像与翻译件。"], ["医院评估", "协调对应专科复核、补充检查与线上会诊。"], ["在华诊疗", "衔接预约、医疗翻译、接送、住宿与家属安排。"], ["返程交接", "整理双语资料、用药说明与复诊时间。"]]
        : [["Case preparation", "Organize records, images and medical translations for the hospital."], ["Hospital review", "Coordinate specialty review, additional tests and online consultation."], ["Care in China", "Connect appointments, interpretation, transfers, stay and family arrangements."], ["Home handover", "Organize bilingual records, medicine instructions and follow-up dates."]];
      const coordinationNode = document.querySelector("[data-tech-coordination]");
      if (coordinationNode) coordinationNode.innerHTML = coordination.map((item, index) => '<article><span>0' + (index + 1) + '</span><div><b>' + item[0] + '</b><p>' + item[1] + '</p></div></article>').join("");
      const faqs = language === "zh" ? [
        ["这项技术适合我吗？", "是否适用需由医院结合诊断、既往治疗和检查结果判断。页面列出的是可能进入评估的人群，不代表治疗建议。"],
        ["出发前需要确认什么？", "医院需要完成资料复核，并确认适用性、所需补充检查、预计时间、风险与个案费用。"],
        ["需要在中国停留多久？", detail.timingZh + "。实际时间取决于检查、治疗反应与医院安排。"],
        ["主要风险是什么？", detail.risksZh.join("；") + "。医生会结合个体情况说明发生概率与处理方案。"]
      ] : [
        ["Could this treatment be suitable for me?", "Only the hospital can decide after reviewing the diagnosis, previous treatment and test results. The listed groups are assessment references, not a treatment recommendation."],
        ["What must be confirmed before travel?", "The hospital must confirm clinical suitability, additional tests, expected timing, risks and a case-specific estimate."],
        ["How long would I stay in China?", detail.timingEn + ". The actual schedule depends on testing, treatment response and hospital availability."],
        ["What risks should I discuss?", detail.risksEn.join("; ") + ". Your physician will explain individual likelihood and management options."]
      ];
      const faqNode = document.querySelector("[data-tech-faq]");
      if (faqNode) {
        faqNode.innerHTML = faqs.map((item, index) => '<article class="faq-item' + (index === 0 ? " open" : "") + '"><button class="faq-question" type="button"><span class="faq-num">0' + (index + 1) + '</span><b>' + item[0] + '</b><span class="faq-plus">＋</span></button><div class="faq-answer"><p>' + item[1] + '</p></div></article>').join("");
        faqNode.querySelectorAll(".faq-question").forEach((button) => button.addEventListener("click", () => {
          const item = button.closest(".faq-item");
          faqNode.querySelectorAll(".faq-item").forEach((row) => row.classList.toggle("open", row === item && !item.classList.contains("open")));
        }));
      }
    };
    document.addEventListener("huayian:language", render);
    render();
  }

  function initProcessBoard() {
    const board = document.querySelector("[data-process-board]");
    const detail = document.querySelector("[data-process-detail]");
    if (!board || !detail) return;
    const steps = [...board.querySelectorAll("[data-process-step]")];
    const content = {
      understand:{en:["Private intake","A care director confirms the medical goal, preferred timing, privacy needs and family arrangements.","A concise case brief","Arabic or English communication"],zh:["私密受理","专属负责人确认医疗目标、计划时间、隐私需求与家属安排。","个案需求摘要","支持阿拉伯语或英语沟通"]},
      organize:{en:["Record preparation","We issue a case-specific checklist, organize scans and coordinate medical translation.","A structured medical dossier","Secure submission after contact"],zh:["病历准备","按个案出具资料清单，整理扫描件并协调医学翻译。","结构化病历资料包","联系后通过安全渠道提交"]},
      review:{en:["Specialist review","The relevant hospital team reviews the file and may request an online consultation or additional tests.","A preliminary hospital opinion","Clinical decisions remain with the hospital"],zh:["专科评估","对应医院团队评估资料，并可要求线上问诊或补充检查。","医院初步评估意见","医疗判断由医院作出"]},
      match:{en:["Hospital shortlist","Specialty strength, current access, international service and family preferences are compared together.","Up to three relevant references","No single ranking decides the match"],zh:["医院匹配","综合专科实力、当前接诊、国际服务与家庭偏好进行比较。","不超过三家相关医院参考","不以单一排名决定匹配"]},
      submit:{en:["Hospital coordination","One case owner sends the agreed file, consolidates specialist questions and follows every response.","A traceable hospital submission","One contact across institutions"],zh:["院方协调","由同一负责人提交确认资料、汇总专科问题并跟进回复。","可追踪的医院提交记录","跨医院统一联系人"]},
      schedule:{en:["Decision package","We align the hospital plan, physician availability, expected stay and case estimate before any booking.","Plan, timing and estimate","You approve before travel is booked"],zh:["方案确认","预订前统一核对医院方案、医生档期、预计停留与个案费用。","方案、时间与费用文件","患者确认后再预订行程"]},
      arrive:{en:["Private arrival","Visa documentation, flights, VIP transfer, suitable accommodation, halal dining and companion needs are placed on one itinerary.","A door-to-hospital itinerary","Arrival contact throughout the transfer"],zh:["抵达接应","将签证材料、航班、贵宾接送、适配住宿、清真餐饮与家属需求纳入同一行程。","从抵达到医院的完整日程","接送期间保持专人联络"]},
      accompany:{en:["Care-day support","We coordinate admission, medical interpretation, private-room requests, daily logistics and family updates.","A daily care brief","Hospital availability is confirmed case by case"],zh:["陪同诊疗","协调入院、医疗翻译、私密病房需求、每日行程与家属进度同步。","每日诊疗简报","病房与服务以医院确认为准"]},
      continue:{en:["Return-home handover","Discharge records, medication instructions, translated summaries and follow-up appointments are organized before departure.","A bilingual handover file","Follow-up connected to the treating hospital"],zh:["返程交接","返程前整理出院记录、用药说明、翻译摘要与复诊安排。","双语医疗交接资料","后续复诊继续衔接原医院"]}
    };
    let active = steps[0];
    const render = (step) => {
      active = step;
      steps.forEach((item) => item.classList.toggle("active", item === step));
      const values = content[step.dataset.processStep][language];
      setText("[data-process-detail-title]", values[0]);
      setText("[data-process-detail-action]", values[1]);
      setText("[data-process-detail-deliverable]", values[2]);
      setText("[data-process-detail-standard]", values[3]);
    };
    steps.forEach((step) => step.addEventListener("click", () => render(step)));
    document.addEventListener("huayian:language", () => render(active));
    render(active);
  }

  function initPartnerForm() {
    const form = document.querySelector("[data-partner-form]");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const state = form.querySelector("[data-partner-state]");
      if (state) state.textContent = language === "zh" ? "合作申请已提交" : "Partnership inquiry submitted";
    });
  }

  initFooterContact();
  setLanguage(language);
  initJourney();
  initStageBoard();
  initFloatingPanels();
  initHomeMatch();
  initConsultation();
  initTreatmentDirectory();
  initTreatmentDetail();
  initTechnologyDetail();
  initProcessBoard();
  initHospitalDirectory();
  initCases();
  initCaseDetail();
  initTcm();
  initContactActions();
  initGuideDetail();
  initPartnerForm();
})();
