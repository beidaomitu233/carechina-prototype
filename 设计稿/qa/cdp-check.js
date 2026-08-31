import fs from 'node:fs';

const targets = await fetch('http://127.0.0.1:9222/json/list').then((response) => response.json());
const target = targets.find((item) => item.type === 'page');
if (!target) throw new Error('No debuggable page target found');

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let callId = 0;
const pending = new Map();
socket.addEventListener('message', (event) => {
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
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function evaluate(expression) {
  const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
}
async function go(path) {
  await call('Page.navigate', { url: `http://127.0.0.1:4173/${path}` });
  await sleep(900);
}
function assert(value, message) { if (!value) throw new Error(message); }
async function shot(file) {
  const result = await call('Page.captureScreenshot', { format: 'jpeg', quality: 78, captureBeyondViewport: false, fromSurface: true });
  fs.writeFileSync(file, Buffer.from(result.data, 'base64'));
}

await call('Page.enable');
await call('Runtime.enable');
await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await go('index.html');
await evaluate(`localStorage.removeItem('carechina-language'); localStorage.removeItem('carechina-theme'); location.reload()`);
await sleep(900);
await evaluate(`document.getElementById('cases').scrollIntoView()`);
await sleep(800);
await evaluate(`document.getElementById('support').scrollIntoView()`);
await sleep(650);
await evaluate(`document.documentElement.style.scrollBehavior='auto';scrollTo(0,0)`);
await sleep(450);

const desktop = await evaluate(`(() => {
  const tasks=[...document.querySelectorAll('#start .task-card')];
  const cases=[...document.querySelectorAll('#cases .case-card')];
  const imgs=[...document.querySelectorAll('#cases img,.support-visual img,#network img,#specialties img,#journey img')];
  const banned=['rgb(239, 232, 220)','rgb(247, 246, 242)'];
  const nodes=[...document.querySelectorAll('body *')];
  const flow=[...document.querySelectorAll('main>section[id]')].map(x=>x.id);
  const bannedComputed=nodes.some(node=>{const s=getComputedStyle(node);return banned.includes(s.backgroundColor)||banned.includes(s.color)});
  return {
    lang:document.documentElement.lang,
    overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    taskCount:tasks.length,
    taskTags:tasks.map(x=>x.tagName),
    taskLinks:tasks.map(x=>x.getAttribute('href')),
    caseCount:cases.length,
    imagesReady:imgs.every(x=>x.complete&&x.naturalWidth>0),
    hasCost:!!document.getElementById('cost-planner'),
    hasConsult:!!document.getElementById('assessmentForm'),
    hasTheme:!!document.getElementById('themeFab')&&document.body.dataset.theme==='clinic',
    mosaic:getComputedStyle(document.querySelector('.visual-mosaic')).gridTemplateAreas,
    removed:!document.getElementById('matching')&&!document.getElementById('partners'),
    flow,
    bannedComputed,
    titleWeight:getComputedStyle(document.querySelector('.home-hero h1')).fontWeight,
    titleLineHeight:getComputedStyle(document.querySelector('.home-hero h1')).lineHeight,
    visibleTitle:document.querySelector('.home-hero h1').textContent.trim()
  };
})()`);
assert(desktop.lang === 'zh-CN', 'Homepage is not Chinese-first');
assert(desktop.overflow <= 1, 'Desktop homepage has horizontal overflow');
assert(desktop.taskCount === 4 && desktop.taskTags.every((tag) => tag === 'A'), 'Task cards are not full-card links');
assert(JSON.stringify(desktop.taskLinks) === JSON.stringify(['hospitals.html','care-plan.html','#cost-planner','tcm-wellness.html']), 'Task destinations are incorrect');
assert(desktop.caseCount === 3 && desktop.imagesReady, 'Treatment case or city images failed to load');
assert(desktop.hasCost && desktop.hasConsult && desktop.hasTheme && desktop.removed && !desktop.bannedComputed, 'Merged consultation, theme switcher, removed modules, or palette check failed');
assert(desktop.mosaic.includes('hospital') && desktop.mosaic.includes('budget'), 'Large-format task mosaic is missing');
assert(JSON.stringify(desktop.flow) === JSON.stringify(['top','start','specialties','network','journey','support','assessment','cases','faq']), 'Patient-flow section order is incorrect');
assert(desktop.visibleTitle.includes('来华就医'), 'Chinese homepage copy is not visible');
await shot('设计稿/qa/mature-home-desktop.jpg');
for (const id of ['start','specialties','network','journey','support']) {
  await evaluate(`document.documentElement.style.scrollBehavior='auto';document.getElementById('${id}').scrollIntoView()`);
  await sleep(300);
  await shot(`设计稿/qa/upgrade-${id}-desktop.jpg`);
}

const budget = await evaluate(`(() => {
  const before=document.getElementById('budgetTotal').textContent;
  const scenario=document.getElementById('budgetScenario');
  const days=document.getElementById('budgetDays');
  scenario.value='complex'; scenario.dispatchEvent(new Event('input',{bubbles:true}));
  days.value='40'; days.dispatchEvent(new Event('input',{bubbles:true}));
  const after=document.getElementById('budgetTotal').textContent;
  document.documentElement.style.scrollBehavior='auto';document.getElementById('assessment').scrollIntoView();
  return {before,after,days:document.getElementById('budgetDaysValue').textContent};
})()`);
assert(budget.before !== budget.after && budget.days === '40' && budget.after.includes('¥'), 'Budget estimator does not react');
const consultation = await evaluate(`(() => {
  const need=document.getElementById('need');
  need.value='surgery';need.dispatchEvent(new Event('change',{bubbles:true}));
  document.getElementById('country').value='Saudi Arabia';
  document.getElementById('contact').value='patient@example.com';
  document.getElementById('condition').value='Planned cardiac review';
  document.getElementById('assessmentForm').requestSubmit();
  return {synced:document.getElementById('budgetScenario').value,message:document.getElementById('formMessage').classList.contains('show')};
})()`);
assert(consultation.synced === 'surgery' && consultation.message, 'Consultation form and budget scenario are not connected');
await sleep(350);
await shot('设计稿/qa/mature-budget-desktop.jpg');

const themeCheck = await evaluate(`(() => {
  document.getElementById('themeFab').click();
  document.querySelector('[data-theme-option=\"calm\"]').click();
  return {theme:document.body.dataset.theme,primary:getComputedStyle(document.body).getPropertyValue('--green').trim(),stored:localStorage.getItem('carechina-theme')};
})()`);
assert(themeCheck.theme === 'calm' && themeCheck.primary === '#2a7b80' && themeCheck.stored === 'calm', 'Theme switcher does not update or persist the palette');
await sleep(300);
await shot('设计稿/qa/upgrade-theme-panel.jpg');

await go('hospitals.html');
const subpage = await evaluate(`(() => ({
  lang:document.documentElement.lang,
  overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
  costLink:[...document.querySelectorAll('a')].find(x=>x.dataset.zh==='费用估算')?.getAttribute('href'),
  brand:getComputedStyle(document.body).getPropertyValue('--brand').trim(),
  theme:document.body.dataset.theme,
  title:document.querySelector('.page-hero h1').textContent.trim(),
  cityCards:document.querySelectorAll('[data-city-jump]').length,
  researchLabels:document.querySelectorAll('.hospital-rank').length
}))()`);
assert(subpage.lang === 'zh-CN' && subpage.costLink === 'index.html#cost-planner', 'Subpage language or cost route is not unified');
assert(subpage.brand === '#2a7b80' && subpage.theme === 'calm' && subpage.overflow <= 1, 'Subpage theme persistence or responsive width is incorrect');
assert(subpage.title.length > 0, 'Subpage Chinese title is missing');
assert(subpage.cityCards === 3 && subpage.researchLabels === 0, 'City-first hospital discovery or label removal failed');
await evaluate(`document.documentElement.style.scrollBehavior='auto';document.querySelector('.city-discovery').scrollIntoView()`);
await sleep(250);
await shot('设计稿/qa/mature-hospitals-city.jpg');
const cityClick = await evaluate(`(() => {document.querySelector('[data-city-jump=\"Chengdu\"]').click();return {city:document.getElementById('city-filter').value,count:document.getElementById('result-count').textContent};})()`);
assert(cityClick.city === 'Chengdu' && cityClick.count.includes('1'), 'City card does not filter the hospital list');
await sleep(250);
await shot('设计稿/qa/mature-hospitals-filter.jpg');

await evaluate(`localStorage.setItem('carechina-theme','clinic')`);
await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await go('index.html');
const mobile = await evaluate(`(() => {
  const menu=document.querySelector('.menu-btn'); menu.click();
  const budget=document.getElementById('cost-planner');
  const cases=document.querySelector('.case-grid');
  return {
    overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    menuOpen:document.querySelector('.mobile-panel').classList.contains('open'),
    taskColumns:getComputedStyle(document.querySelector('.task-grid-four')).gridTemplateColumns,
    caseColumns:getComputedStyle(cases).gridTemplateColumns,
    consultColumns:getComputedStyle(document.querySelector('.consult-grid')).gridTemplateColumns,
    budgetWidth:budget.getBoundingClientRect().width
  };
})()`);
assert(mobile.overflow <= 1 && mobile.menuOpen, 'Mobile navigation or horizontal width failed');
assert(!mobile.taskColumns.includes(' ') && !mobile.caseColumns.includes(' ') && !mobile.consultColumns.includes(' '), 'Mobile grids did not collapse to one column');
await evaluate(`closeMenu(); document.documentElement.style.scrollBehavior='auto'; document.getElementById('start').scrollIntoView()`);
await sleep(300);
await shot('设计稿/qa/mature-home-mobile.jpg');

socket.close();
console.log(JSON.stringify({ ok: true, desktop, budget, subpage, mobile }, null, 2));
