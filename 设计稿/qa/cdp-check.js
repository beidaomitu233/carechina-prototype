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
await evaluate(`document.getElementById('journey').scrollIntoView()`);
await sleep(650);
await evaluate(`document.documentElement.style.scrollBehavior='auto';scrollTo(0,0)`);
await sleep(450);

const desktop = await evaluate(`(() => {
  const eligibilityChoices=[...document.querySelectorAll('.eligibility-choice')];
  const coordinationSteps=[...document.querySelectorAll('.coordination-step')];
  const resourceTabs=[...document.querySelectorAll('.resource-tab')];
  const cases=[...document.querySelectorAll('#cases .case-card')];
  const imgs=[...document.querySelectorAll('#cases img,.coordination-display img,[data-resource-panel="directions"] img')];
  const banned=['rgb(239, 232, 220)','rgb(247, 246, 242)'];
  const nodes=[...document.querySelectorAll('body *')];
  const flow=[...document.querySelectorAll('main>section[id]')].map(x=>x.id);
  const bannedComputed=nodes.some(node=>{const s=getComputedStyle(node);return banned.includes(s.backgroundColor)||banned.includes(s.color)});
  return {
    lang:document.documentElement.lang,
    overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    eligibilityCount:eligibilityChoices.length,
    coordinationCount:coordinationSteps.length,
    resourceTabCount:resourceTabs.length,
    caseCount:cases.length,
    imagesReady:imgs.every(x=>x.complete&&x.naturalWidth>0),
    hasCost:!!document.getElementById('cost-planner'),
    hasConsult:!!document.getElementById('assessmentForm'),
    hasTheme:!!document.getElementById('themeFab')&&document.body.dataset.theme==='clinic',
    hasContactWindow:!!document.getElementById('contactWindow'),
    mergedJourney:!!document.querySelector('.coordination-board')&&!document.getElementById('support'),
    flow,
    bannedComputed,
    titleWeight:getComputedStyle(document.querySelector('.home-hero h1')).fontWeight,
    titleLineHeight:getComputedStyle(document.querySelector('.home-hero h1')).lineHeight,
    visibleTitle:document.querySelector('.home-hero h1').textContent.trim()
  };
})()`);
assert(desktop.lang === 'zh-CN', 'Homepage is not Chinese-first');
assert(desktop.overflow <= 1, 'Desktop homepage has horizontal overflow');
assert(desktop.eligibilityCount === 4 && desktop.coordinationCount === 5 && desktop.resourceTabCount === 2, 'V03 decision controls are incomplete');
assert(desktop.caseCount === 3 && desktop.imagesReady, 'Treatment case or care images failed to load');
assert(desktop.hasCost && desktop.hasConsult && desktop.hasTheme && desktop.hasContactWindow && desktop.mergedJourney && !desktop.bannedComputed, 'V03 consultation, theme, merged journey, contact timing, or palette check failed');
assert(JSON.stringify(desktop.flow) === JSON.stringify(['top','eligibility','journey','specialties','cases','assessment','faq']), 'V03 patient-flow section order is incorrect');
assert(desktop.visibleTitle.includes('病情'), 'Chinese patient-first homepage copy is not visible');
await shot('设计稿/qa/mature-home-desktop.jpg');
for (const id of ['eligibility','journey','specialties','cases','assessment']) {
  await evaluate(`document.documentElement.style.scrollBehavior='auto';document.getElementById('${id}').scrollIntoView()`);
  await sleep(300);
  await shot(`设计稿/qa/v03-${id}-desktop.jpg`);
}

const decisionInteractions = await evaluate(`(() => {
  document.querySelector('[data-eligibility-target="opinion"]').click();
  document.querySelector('[data-coordination-target="plan"]').click();
  document.querySelector('[data-resource-target="cities"]').click();
  document.querySelector('[data-resource-panel="cities"]').scrollIntoView();
  return {
    eligibility:document.querySelector('.eligibility-choice.active')?.dataset.eligibilityTarget,
    eligibilityPanel:document.querySelector('[data-eligibility-panel="opinion"]').hidden,
    coordination:document.querySelector('.coordination-step.active')?.dataset.coordinationTarget,
    coordinationPanel:document.querySelector('[data-coordination-panel="plan"]').hidden,
    resource:document.querySelector('.resource-tab.active')?.dataset.resourceTarget,
    resourcePanel:document.querySelector('[data-resource-panel="cities"]').hidden,
    cityCount:document.querySelectorAll('[data-resource-panel="cities"] .city-scene').length
  };
})()`);
assert(decisionInteractions.eligibility === 'opinion' && !decisionInteractions.eligibilityPanel, 'Eligibility decision interaction failed');
assert(decisionInteractions.coordination === 'plan' && !decisionInteractions.coordinationPanel, 'Coordination-stage interaction failed');
assert(decisionInteractions.resource === 'cities' && !decisionInteractions.resourcePanel && decisionInteractions.cityCount === 3, 'Hospital resource tabs failed');
await sleep(800);
const cityImagesReady = await evaluate(`[...document.querySelectorAll('[data-resource-panel="cities"] img')].every(img=>img.complete&&img.naturalWidth>0)`);
assert(cityImagesReady, 'City resource images failed to load after opening the tab');
await shot('设计稿/qa/v03-resource-cities-desktop.jpg');

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
    eligibilityColumns:getComputedStyle(document.querySelector('.eligibility-shell')).gridTemplateColumns,
    coordinationColumns:getComputedStyle(document.querySelector('.coordination-board')).gridTemplateColumns,
    resourceColumns:getComputedStyle(document.querySelector('.resource-tabs')).gridTemplateColumns,
    caseColumns:getComputedStyle(cases).gridTemplateColumns,
    consultColumns:getComputedStyle(document.querySelector('.consult-grid')).gridTemplateColumns,
    budgetWidth:budget.getBoundingClientRect().width
  };
})()`);
assert(mobile.overflow <= 1 && mobile.menuOpen, 'Mobile navigation or horizontal width failed');
assert(!mobile.eligibilityColumns.includes(' ') && !mobile.coordinationColumns.includes(' ') && !mobile.resourceColumns.includes(' ') && !mobile.caseColumns.includes(' ') && !mobile.consultColumns.includes(' '), 'Mobile V03 grids did not collapse to one column');
await evaluate(`closeMenu(); document.documentElement.style.scrollBehavior='auto'; document.getElementById('eligibility').scrollIntoView()`);
await sleep(300);
await shot('设计稿/qa/mature-home-mobile.jpg');
await evaluate(`document.documentElement.style.scrollBehavior='auto'; document.getElementById('journey').scrollIntoView()`);
await sleep(300);
await shot('设计稿/qa/v03-journey-mobile.jpg');

socket.close();
console.log(JSON.stringify({ ok: true, desktop, budget, subpage, mobile }, null, 2));
