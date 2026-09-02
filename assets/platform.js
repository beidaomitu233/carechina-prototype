(function () {
  "use strict";
  const root = document.documentElement;
  const body = document.body;
  const page = body.dataset.page || "";
  let language = "en";
  try { language = localStorage.getItem("huayian-language-v04") || "en"; } catch (_) {}

  const copy = (item, key) => item[key + (language === "zh" ? "Zh" : "En")] || "";
  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  };
  const safeSite = (site) => String(site || "").toLowerCase().startsWith("http") ? site : "https://" + site;

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
    let specialty = null;
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
        .slice(0, 5);
      result.innerHTML = '<div class="match-result-head"><div><small>' + (language === "zh" ? "当前匹配" : "Current match") + '</small><h3>' + (language === "zh" ? specialtyMeta.zh : specialtyMeta.en) + '</h3></div><strong>' + rows.length + '/5</strong></div><div class="hospital-rank-list">' +
        rows.map((hospital) => '<a class="hospital-rank-row" href="hospitals.html?specialty=' + specialty + '&city=' + encodeURIComponent(city) + '"><span><b>' + copy(hospital, "name") + '</b><small>' + copy(hospital, "city") + ' · ' + copy(hospital, "dept") + '</small></span><span class="rank-note">' + copy(hospital, "rank") + '</span></a>').join("") +
        '</div>';
    };
    wrap.querySelectorAll("[data-specialty]").forEach((button) => button.addEventListener("click", () => {
      specialty = Number(button.dataset.specialty);
      wrap.querySelectorAll("[data-specialty]").forEach((item) => item.classList.toggle("active", item === button));
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
  }

  function initConsultation() {
    const form = document.querySelector("[data-consult-form]");
    if (!form) return;
    const care = form.querySelector('[name="care"]');
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
    return '<button class="hospital-card" type="button" data-hospital-id="' + item.id + '"><span class="hospital-logo">' + logo + '</span><span class="hospital-copy"><small>' + copy(item, "city") + '</small><h3>' + copy(item, "name") + '</h3><p>' + copy(item, "dept") + '</p></span><span class="hospital-rank">' + copy(item, "rank") + '</span></button>';
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
    modal.querySelector("[data-modal-gallery]").innerHTML = photos.slice(0,3).map((path) => '<img src="' + path + '" alt="">').join("");
    modal.querySelector("[data-modal-title]").textContent = copy(item, "name");
    modal.querySelector("[data-modal-copy]").textContent = copy(item, "special");
    modal.querySelector("[data-modal-city]").textContent = copy(item, "city");
    modal.querySelector("[data-modal-rank]").textContent = copy(item, "rank");
    modal.querySelector("[data-modal-dept]").textContent = copy(item, "dept");
    modal.querySelector("[data-modal-site]").href = safeSite(item.site);
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
  }

  setLanguage(language);
  initJourney();
  initStageBoard();
  initFloatingPanels();
  initHomeMatch();
  initConsultation();
  initTreatmentDirectory();
  initTreatmentDetail();
  initHospitalDirectory();
  initCases();
  initCaseDetail();
  initTcm();
})();
