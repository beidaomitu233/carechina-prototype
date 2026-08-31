const targets = await fetch("http://127.0.0.1:9222/json/list").then((r) => r.json());
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
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function call(method, params = {}) {
  const id = ++callId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function go(path) {
  await call("Page.navigate", { url: `http://127.0.0.1:4173/${path}` });
  await sleep(900);
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
const report = [];

await go("index.html");
const home = await evaluate(`(() => {
  const icon = document.querySelector('.trust-ico');
  const style = getComputedStyle(icon);
  const bg = getComputedStyle(document.querySelector('.home-hero')).backgroundImage;
  return { title: document.title, bg, align: style.alignItems, justify: style.justifyContent, icon: [icon.clientWidth, icon.clientHeight], nav: document.querySelectorAll('.main-nav a').length };
})()`);
assert(home.bg.includes("hero-international-care.jpg"), "Home hero image is not applied");
assert(home.align === "center" && home.justify === "center", "Trust number is not centered");
assert(home.icon[0] === 44 && home.icon[1] === 44, "Trust number box changed size");
assert(home.nav === 5, "Primary navigation is incomplete");
report.push({ page: "home", ...home });

await go("hospitals.html");
const hospitals = await evaluate(`(() => {
  const input = document.querySelector('#hospital-search');
  input.value = 'cardio';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  const english = { count: document.querySelectorAll('.hospital-card').length, label: document.querySelector('#result-count').textContent };
  if (!document.documentElement.lang.startsWith('zh')) document.querySelector('[data-lang-toggle]').click();
  return { ...english, zhLabel: document.querySelector('#result-count').textContent };
})()`);
assert(hospitals.count >= 3 && hospitals.count < 12, "Hospital search did not filter results");
assert(hospitals.zhLabel.includes("家医院"), "Hospital count did not switch to Chinese");
report.push({ page: "hospitals", ...hospitals });

await go("care-plan.html");
const plan = await evaluate(`(() => {
  document.querySelector('#condition').value = 'cardiac surgery review';
  document.querySelector('#plan-form').requestSubmit();
  return { steps: document.querySelectorAll('.plan-step').length, hasConsult: !!document.querySelector('#plan-result a[href="consultation.html"]') };
})()`);
assert(plan.steps === 6 && plan.hasConsult, "Care plan generator did not build the six-step path");
report.push({ page: "care-plan", ...plan });

await go("cost-estimate.html");
const cost = await evaluate(`(() => {
  const before = document.querySelector('#estimate-total').textContent;
  const slider = document.querySelector('#days');
  slider.value = 30;
  slider.dispatchEvent(new Event('input', { bubbles: true }));
  const after = document.querySelector('#estimate-total').textContent;
  return { before, after, lines: document.querySelectorAll('.estimate-line').length };
})()`);
assert(cost.before !== cost.after && cost.lines === 5 && cost.after.includes(","), "Cost model did not recalculate and format the range");
report.push({ page: "cost-estimate", ...cost });

await go("tcm-wellness.html");
const tcm = await evaluate(`(() => {
  document.querySelector('#wellness-form').requestSubmit();
  return { boxes: document.querySelectorAll('.safe-box').length, redFlags: document.querySelectorAll('.red-flag').length, resultText: document.querySelector('#wellness-result').textContent.slice(0, 80) };
})()`);
assert(tcm.boxes === 4 && tcm.redFlags === 1, "TCM checklist or red-flag guidance is incomplete");
report.push({ page: "tcm-wellness", ...tcm });

await go("consultation.html");
const consult = await evaluate(`(() => {
  document.querySelector('#p-name').value = 'Test';
  document.querySelector('#p-country').value = 'Test region';
  document.querySelector('#p-language').value = 'English';
  document.querySelector('#p-summary').value = 'De-identified planning question';
  document.querySelector('#patient-form input[type="checkbox"]').checked = true;
  document.querySelector('#patient-form').requestSubmit();
  return { shown: document.querySelector('#success-state').classList.contains('show'), notice: document.querySelector('#success-state .notice').textContent };
})()`);
assert(consult.shown && /not transmitted|没有被发送/.test(consult.notice), "Consultation prototype did not show the local-only success state");
report.push({ page: "consultation", ...consult });

await call("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await go("index.html");
const mobile = await evaluate(`(() => {
  const menu = document.querySelector('[data-menu-toggle]');
  const lang = document.querySelector('[data-lang-toggle]');
  return { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, menuVisible: menu.getBoundingClientRect().width > 0, langVisible: lang.getBoundingClientRect().width > 0, h1: document.querySelector('h1').getBoundingClientRect().width };
})()`);
assert(mobile.overflow <= 1 && mobile.menuVisible && mobile.langVisible, "Mobile header or horizontal layout failed");
report.push({ page: "mobile-home", ...mobile });

socket.close();
console.log(JSON.stringify({ ok: true, report }, null, 2));
