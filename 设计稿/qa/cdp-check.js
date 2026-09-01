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
    matchRows:document.querySelectorAll('#matchRanking .rank-item').length,
    matchSpecialtyButtons:document.querySelectorAll('button[data-match-specialty]').length,
    matchCityButtons:document.querySelectorAll('button[data-match-city]').length,
    matchSpecialtyChips:document.querySelectorAll('[data-match-chip-specialty]').length,
    matchCityChips:document.querySelectorAll('[data-match-chip-city]').length,
    matchCollapsed:document.getElementById('matchResults').classList.contains('match-collapsed'),
    matchBodyHidden:document.querySelector('.match-explorer-body').hidden,
    activeSpecialty:document.querySelector('button[data-match-specialty].active')?.dataset.matchSpecialty||'',
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
assert(desktop.matchRows === 5 && desktop.matchSpecialtyButtons === 4 && desktop.matchCityButtons === 3 && desktop.matchSpecialtyChips === 4 && desktop.matchCityChips === 4, `Hospital matching controls or national top five are incomplete: ${JSON.stringify(desktop)}`);
assert(desktop.matchCollapsed && desktop.matchBodyHidden && !desktop.activeSpecialty, 'Hospital matching card is not collapsed by default');
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
await evaluate(`document.documentElement.style.scrollBehavior='auto';document.getElementById('matchResults').scrollIntoView()`);
await sleep(300);
await shot('设计稿/qa/v03-hospital-match-collapsed-desktop.jpg');

const decisionInteractions = await evaluate(`(() => {
  const pathBefore=location.pathname;
  document.querySelector('[data-eligibility-target="opinion"]').click();
  document.querySelector('[data-coordination-target="plan"]').click();
  document.querySelector('button[data-match-specialty="cardiology"]').click();
  document.querySelector('[data-resource-target="cities"]').click();
  document.querySelector('button[data-match-city="Wuhan"]').click();
  document.querySelector('#matchRanking .rank-row').click();
  document.querySelector('[data-resource-panel="cities"]').scrollIntoView();
  return {
    eligibility:document.querySelector('.eligibility-choice.active')?.dataset.eligibilityTarget,
    eligibilityPanel:document.querySelector('[data-eligibility-panel="opinion"]').hidden,
    coordination:document.querySelector('.coordination-step.active')?.dataset.coordinationTarget,
    coordinationPanel:document.querySelector('[data-coordination-panel="plan"]').hidden,
    resource:document.querySelector('.resource-tab.active')?.dataset.resourceTarget,
    resourcePanel:document.querySelector('[data-resource-panel="cities"]').hidden,
    cityCount:document.querySelectorAll('[data-resource-panel="cities"] .city-scene').length,
    matchSpecialty:document.getElementById('matchResults').dataset.matchSpecialty,
    matchCity:document.getElementById('matchResults').dataset.matchCity,
    matchRows:document.querySelectorAll('#matchRanking .rank-item').length,
    matchOpen:document.getElementById('matchResults').dataset.matchOpen,
    matchBodyHidden:document.querySelector('.match-explorer-body').hidden,
    detailOpen:!document.querySelector('#matchRanking .rank-detail').hidden,
    pathBefore,
    pathAfter:location.pathname
  };
})()`);
assert(decisionInteractions.eligibility === 'opinion' && !decisionInteractions.eligibilityPanel, 'Eligibility decision interaction failed');
assert(decisionInteractions.coordination === 'plan' && !decisionInteractions.coordinationPanel, 'Coordination-stage interaction failed');
assert(decisionInteractions.resource === 'cities' && !decisionInteractions.resourcePanel && decisionInteractions.cityCount === 3, 'Hospital resource tabs failed');
assert(decisionInteractions.matchSpecialty === 'cardiology' && decisionInteractions.matchCity === 'Wuhan' && decisionInteractions.matchRows === 5 && decisionInteractions.detailOpen, 'Specialty, city or inline hospital detail interaction failed');
assert(decisionInteractions.matchOpen === 'true' && !decisionInteractions.matchBodyHidden, 'Hospital matching card did not expand after a selection');
assert(decisionInteractions.pathBefore === decisionInteractions.pathAfter, 'Hospital matching filters unexpectedly navigated away from the homepage');
await sleep(800);
const cityImagesReady = await evaluate(`[...document.querySelectorAll('[data-resource-panel="cities"] img')].every(img=>img.complete&&img.naturalWidth>0)`);
assert(cityImagesReady, 'City resource images failed to load after opening the tab');
await shot('设计稿/qa/v03-resource-cities-desktop.jpg');
await evaluate(`document.documentElement.style.scrollBehavior='auto';document.getElementById('matchResults').scrollIntoView()`);
await sleep(350);
await shot('设计稿/qa/v03-hospital-match-desktop.jpg');

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
  costLink:document.querySelector('.main-nav a[href="cost-estimate.html"]')?.getAttribute('href'),
  brand:getComputedStyle(document.body).getPropertyValue('--brand').trim(),
  theme:document.body.dataset.theme,
  title:document.querySelector('.page-hero h1').textContent.trim(),
  cityCards:document.querySelectorAll('[data-city-jump]').length,
  researchLabels:document.querySelectorAll('.hospital-rank').length,
  navRoutes:['hospitals.html','care-plan.html','cost-estimate.html','tcm-wellness.html','consultation.html'].every(href=>!!document.querySelector('.main-nav a[href="'+href+'"]')),
  heroImage:getComputedStyle(document.querySelector('.page-hero')).backgroundImage
}))()`);
assert(subpage.lang === 'zh-CN' && subpage.costLink === 'cost-estimate.html', `Subpage language or cost route is not unified: ${JSON.stringify(subpage)}`);
assert(subpage.brand === '#2a7b80' && subpage.theme === 'calm' && subpage.overflow <= 1, 'Subpage theme persistence or responsive width is incorrect');
assert(subpage.title.length > 0, 'Subpage Chinese title is missing');
assert(subpage.cityCards === 3 && subpage.researchLabels === 0 && subpage.navRoutes && subpage.heroImage.includes('hospital-zhongnan-exterior'), 'City discovery, navigation routes, hero image or label removal failed');
await shot('设计稿/qa/v03-hospitals-top-desktop.jpg');
await evaluate(`document.documentElement.style.scrollBehavior='auto';document.querySelector('.city-discovery').scrollIntoView()`);
await sleep(250);
await shot('设计稿/qa/mature-hospitals-city.jpg');
const cityClick = await evaluate(`(() => {document.querySelector('[data-city-jump=\"Chengdu\"]').click();return {city:document.getElementById('city-filter').value,count:document.getElementById('result-count').textContent};})()`);
assert(cityClick.city === 'Chengdu' && cityClick.count.includes('1'), 'City card does not filter the hospital list');
await sleep(250);
await shot('设计稿/qa/mature-hospitals-filter.jpg');

const secondaryPages = [
  ['care-plan.html','plan','clinical-patient-care-whsyy'],
  ['cost-estimate.html','cost','hospital-tongji-international'],
  ['tcm-wellness.html','tcm','case-rehab-care'],
  ['consultation.html','consultation','hospital-zhongnan-interior']
];
const secondaryResults = [];
for (const [path,page,imageName] of secondaryPages) {
  await go(path);
  const result = await evaluate(`(() => {
    const page=${JSON.stringify(page)};
    const dropdown=document.querySelector('.nav-dropdown');
    return {
      path:location.pathname,
      lang:document.documentElement.lang,
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      heroImage:getComputedStyle(document.querySelector('.page-hero')).backgroundImage,
      heroColor:getComputedStyle(document.querySelector('.page-hero h1')).color,
      pageActive:!!document.querySelector('[data-nav="'+page+'"].active'),
      dropdownActive:['cost','tcm','consultation'].includes(page)?dropdown.classList.contains('has-active'):true,
      navRoutes:['hospitals.html','care-plan.html','cost-estimate.html','tcm-wellness.html','consultation.html'].every(href=>!!document.querySelector('.main-nav a[href="'+href+'"]'))
    };
  })()`);
  assert(result.lang === 'zh-CN' && result.overflow <= 1, `${path} language or desktop width failed`);
  assert(result.heroImage.includes(imageName) && result.heroColor === 'rgb(255, 255, 255)', `${path} photographic hero is not applied`);
  assert(result.pageActive && result.dropdownActive && result.navRoutes, `${path} navigation state or routes failed`);
  secondaryResults.push(result);
  await shot(`设计稿/qa/v03-${page}-desktop.jpg`);
}

await go('care-plan.html');
const planInteraction = await evaluate(`(() => {const input=document.getElementById('condition');input.value='心脏手术方案评估';document.getElementById('plan-form').requestSubmit();return {title:document.querySelector('#plan-result h2')?.textContent,steps:document.querySelectorAll('#plan-result .plan-step').length,cost:document.querySelector('#plan-result a[href="cost-estimate.html"]')?.textContent};})()`);
assert(planInteraction.title.includes('心脏') && planInteraction.steps === 6 && planInteraction.cost, 'Care-plan generator failed');

await go('cost-estimate.html');
const costInteraction = await evaluate(`(() => {const before=document.getElementById('estimate-total').textContent;const days=document.getElementById('days');days.value='33';days.dispatchEvent(new Event('input',{bubbles:true}));return {before,after:document.getElementById('estimate-total').textContent,days:document.getElementById('days-value').textContent};})()`);
assert(costInteraction.before !== costInteraction.after && costInteraction.days.includes('33'), 'Cost-estimate interaction failed');

await go('tcm-wellness.html');
const tcmInteraction = await evaluate(`(() => {document.getElementById('wellness-form').requestSubmit();return {title:document.querySelector('#wellness-result h2')?.textContent,boxes:document.querySelectorAll('#wellness-result .safe-box').length};})()`);
assert(tcmInteraction.title.includes('症状') && tcmInteraction.boxes === 4, 'TCM consultation checklist failed');

await go('consultation.html');
const consultationTabs = await evaluate(`(() => {document.querySelector('[data-tab-target="institution"]').click();return {active:document.querySelector('.tab.active')?.dataset.tabTarget,panel:document.querySelector('[data-tab-panel="institution"]').classList.contains('active')};})()`);
assert(consultationTabs.active === 'institution' && consultationTabs.panel, 'Consultation tabs failed');

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
    matchControlColumns:getComputedStyle(document.querySelector('.match-controls')).gridTemplateColumns,
    matchRows:document.querySelectorAll('#matchRanking .rank-item').length,
    matchCollapsed:document.getElementById('matchResults').classList.contains('match-collapsed'),
    matchBodyHidden:document.querySelector('.match-explorer-body').hidden,
    budgetWidth:budget.getBoundingClientRect().width
  };
})()`);
assert(mobile.overflow <= 1 && mobile.menuOpen, 'Mobile navigation or horizontal width failed');
assert(!mobile.eligibilityColumns.includes(' ') && !mobile.coordinationColumns.includes(' ') && !mobile.resourceColumns.includes(' ') && !mobile.caseColumns.includes(' ') && !mobile.consultColumns.includes(' '), 'Mobile V03 grids did not collapse to one column');
assert(!mobile.matchControlColumns.includes(' ') && mobile.matchRows === 5, 'Mobile hospital matching layout or list failed');
assert(mobile.matchCollapsed && mobile.matchBodyHidden, 'Mobile hospital matching card is not collapsed by default');
await evaluate(`closeMenu(); document.documentElement.style.scrollBehavior='auto'; document.getElementById('matchResults').scrollIntoView()`);
await sleep(300);
await shot('设计稿/qa/v03-hospital-match-collapsed-mobile.jpg');
await evaluate(`closeMenu(); document.documentElement.style.scrollBehavior='auto'; document.getElementById('eligibility').scrollIntoView()`);
await sleep(300);
await shot('设计稿/qa/mature-home-mobile.jpg');
await evaluate(`document.documentElement.style.scrollBehavior='auto'; document.getElementById('journey').scrollIntoView()`);
await sleep(300);
await shot('设计稿/qa/v03-journey-mobile.jpg');
await evaluate(`document.documentElement.style.scrollBehavior='auto'; document.querySelector('button[data-match-specialty="oncology"]').click(); document.querySelector('#matchRanking .rank-row').click()`);
await sleep(300);
await shot('设计稿/qa/v03-hospital-match-mobile.jpg');

const mobileSecondary = [];
for (const [path,page] of [['hospitals.html','hospitals'],...secondaryPages.map(([path,page])=>[path,page])]) {
  await go(path);
  const result = await evaluate(`(() => {
    document.querySelector('[data-menu-toggle]').click();
    const nav=document.querySelector('[data-main-nav]');
    const visibleLinks=[...nav.querySelectorAll('a')].filter(a=>getComputedStyle(a).display!=='none'&&a.getBoundingClientRect().height>0);
    return {
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      open:nav.classList.contains('open'),
      dropdownOpen:document.querySelector('.nav-dropdown').hasAttribute('open'),
      visibleLinks:visibleLinks.length,
      routes:['hospitals.html','care-plan.html','cost-estimate.html','tcm-wellness.html','consultation.html'].every(href=>visibleLinks.some(a=>a.getAttribute('href')===href)),
      heroColumns:getComputedStyle(document.querySelector('.page-hero-grid')).gridTemplateColumns
    };
  })()`);
  assert(result.overflow <= 1 && result.open && result.dropdownOpen && result.visibleLinks >= 8 && result.routes, `${path} mobile navigation or width failed`);
  assert(!result.heroColumns.includes(' '), `${path} mobile hero did not collapse to one column`);
  mobileSecondary.push({path,...result});
  await shot(`设计稿/qa/v03-${page}-mobile.jpg`);
}

socket.close();
console.log(JSON.stringify({ ok: true, desktop, budget, subpage, secondaryResults, planInteraction, costInteraction, tcmInteraction, consultationTabs, mobile, mobileSecondary }, null, 2));
