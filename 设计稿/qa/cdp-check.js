const targets = await fetch("http://127.0.0.1:9222/json/list").then((response) => response.json());
const target = targets.find((item) => item.type === "page");
if (!target) throw new Error("No debuggable page target found");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let callId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const handlers = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) handlers.reject(new Error(message.error.message));
  else handlers.resolve(message.result);
});

function call(method, params = {}) {
  const id = ++callId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
async function go(path) {
  await call("Page.navigate", { url: `http://127.0.0.1:4173/${path}` });
  await sleep(1000);
}
async function evaluate(expression) {
  const response = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await call("Page.enable");
await call("Runtime.enable");
await go("index.html");

const desktop = await evaluate(`(() => {
  const icon = document.querySelector('.trust-ico');
  const iconStyle = getComputedStyle(icon);
  const taskLinks = [...document.querySelectorAll('.task-grid-four .task-card a')].map((link) => link.getAttribute('href'));
  return {
    title: document.title,
    heroImage: getComputedStyle(document.querySelector('.home-hero')).backgroundImage,
    navLinks: document.querySelectorAll('.main-nav .nav-link').length,
    taskCards: document.querySelectorAll('.task-grid-four .task-card').length,
    taskLinks,
    trust: { width: icon.clientWidth, height: icon.clientHeight, align: iconStyle.alignItems, justify: iconStyle.justifyContent },
    retainedSections: ['specialties','matching','network','journey','support','cost','faq','assessment'].every((id) => !!document.getElementById(id))
  };
})()`);
assert(desktop.heroImage.includes("hero-international-care.jpg"), "Real hero image is missing");
assert(desktop.navLinks === 5, "Top navigation does not contain five destinations");
assert(desktop.taskCards === 4, "Task entry section does not contain four cards");
assert(JSON.stringify(desktop.taskLinks) === JSON.stringify(["hospitals.html","care-plan.html","cost-estimate.html","tcm-wellness.html"]), "Task links are not mapped to the four tools");
assert(desktop.trust.align === "center" && desktop.trust.justify === "center", "Trust numbers are not centered");
assert(desktop.retainedSections, "A home-redesign content section was lost");

const language = await evaluate(`(() => {
  if (document.documentElement.lang.startsWith('zh')) document.querySelector('[data-lang-toggle]').click();
  document.querySelector('[data-lang-toggle]').click();
  return {
    htmlLang: document.documentElement.lang,
    toggle: document.querySelector('[data-lang-toggle]').textContent,
    taskTitle: document.querySelector('#start h2').textContent,
    heroTitle: document.querySelector('.home-hero h1').textContent.trim()
  };
})()`);
assert(language.htmlLang === "zh-CN" && language.toggle === "EN", "Single language toggle did not switch to Chinese");
assert(language.taskTitle.includes("今天") && language.heroTitle.includes("来华就医"), "Merged sections did not translate together");

const legacyInteractions = await evaluate(`(() => {
  const chengdu = document.querySelector('[data-city="chengdu"]');
  chengdu.click();
  const city = document.querySelector('#cityTitle').textContent;
  const details = document.querySelector('#faq details');
  details.open = true;
  return { city, faqOpen: details.open, cityTabs: document.querySelectorAll('.city-tab').length };
})()`);
assert(legacyInteractions.city === "成都" && legacyInteractions.cityTabs === 3, "Retained city interaction failed");
assert(legacyInteractions.faqOpen, "Retained FAQ interaction failed");

await call("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await go("index.html");
const mobile = await evaluate(`(() => {
  const button = document.querySelector('.menu-btn');
  button.click();
  return {
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    menuWidth: button.getBoundingClientRect().width,
    languageWidth: document.querySelector('[data-lang-toggle]').getBoundingClientRect().width,
    panelOpen: document.querySelector('.mobile-panel').classList.contains('open'),
    taskColumns: getComputedStyle(document.querySelector('.task-grid-four')).gridTemplateColumns
  };
})()`);
assert(mobile.overflow <= 1, "Merged mobile page has horizontal overflow");
assert(mobile.menuWidth > 0 && mobile.languageWidth > 0 && mobile.panelOpen, "Mobile navigation controls failed");
assert(!mobile.taskColumns.includes(" "), "Task cards do not collapse to one column on mobile");

socket.close();
console.log(JSON.stringify({ ok: true, desktop, language, legacyInteractions, mobile }, null, 2));
