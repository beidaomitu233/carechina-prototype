(function () {
  "use strict";
  const form = document.querySelector('[data-cost-form]');
  if (!form) return;
  const $ = (selector) => document.querySelector(selector);
  const input = (name) => form.elements.namedItem(name);
  const number = (name) => Number(input(name).value);
  const isZh = () => document.documentElement.lang.startsWith('zh');
  const text = (en, zh) => isZh() ? zh : en;
  const money = (amount) => '$' + Math.round(amount).toLocaleString('en-US');
  const range = (low, high) => low === high ? money(low) : money(low) + ' – ' + money(high);
  let plan;

  function render() {
    input('interpretDays').disabled = !input('interpreter').checked;
    input('interpretRate').disabled = !input('interpreter').checked;
    input('service').disabled = !input('coordination').checked;
    const invalid = [...form.querySelectorAll('input[type="number"]')].find((field) => !field.validity.valid);
    let error = invalid ? text('Check the amount or number entered in ', '请检查输入：') + invalid.labels[0].textContent : '';
    if (!error && number('nights') > number('days')) error = text('Hotel nights cannot exceed days in China.', '酒店晚数不能超过在华天数。');
    if (!error && input('interpreter').checked && number('interpretDays') > number('days')) error = text('Interpreter days cannot exceed days in China.', '翻译陪诊天数不能超过在华天数。');
    $('[data-cost-error]').textContent = error;
    $('[data-cost-error]').hidden = !error;
    $('[data-cost-download]').setAttribute('aria-disabled', String(Boolean(error)));
    if (error) $('[data-cost-download]').removeAttribute('href');
    $('[data-cost-consult]').setAttribute('aria-disabled', String(Boolean(error)));
    if (error) { $('[data-cost-total]').textContent = '—'; $('[data-cost-mobile-total]').textContent = '—'; plan = null; return; }
    const id = input('treatment').value;
    const treatment = window.HUAYIAN_TREATMENTS.find((item) => item.id === id);
    const values = treatment && treatment.cost.replaceAll(',', '').match(/\d+/g);
    const medical = values && values.length === 2 ? values.map(Number) : null;
    const people = number('companions') + 1;
    const hotel = number('nights') * number('rooms') * number('hotel');
    const daily = number('days') * people * number('daily');
    const flight = people * number('flight');
    const service = input('coordination').checked ? number('service') : 0;
    const interpreter = input('interpreter').checked ? number('interpretDays') * number('interpretRate') : 0;
    const support = hotel + daily + flight + service + interpreter;
    const low = (medical ? medical[0] : 0) + support;
    const high = (medical ? medical[1] : 0) + support;
    const reserveLow = Math.round(low * number('buffer') / 100);
    const reserveHigh = Math.round(high * number('buffer') / 100);
    const medicalText = medical ? range(...medical) : text('Hospital review required', '待医院评估');
    $('[data-medical-range]').textContent = medicalText;
    const detail = $('[data-cost-treatment-link]');
    detail.hidden = !treatment;
    if (treatment) detail.href = 'treatment.html?id=' + treatment.id;
    const city = input('city').selectedOptions[0].textContent;
    const care = treatment ? treatment[isZh() ? 'nameZh' : 'nameEn'] : text('Other / undecided', '其他 / 尚未确定');
    const unit = (n, singular, plural, zh) => n + ' ' + text(n === 1 ? singular : plural, zh);
    $('[data-plan-caption]').textContent = city + ' · ' + unit(number('days'), 'day', 'days', '天') + ' · ' + unit(people, 'person', 'people', '人');
    $('[data-total-label]').textContent = medical ? text('Planning range', '预计费用区间') : text('Travel & support subtotal', '行程与服务费用小计');
    const total = range(low + reserveLow, high + reserveHigh);
    $('[data-cost-total]').textContent = total;
    $('[data-cost-mobile-total]').textContent = total;
    $('[data-service-coordination]').textContent = money(service);
    $('[data-service-interpreter]').textContent = money(interpreter);
    input('interpretDays').disabled = !input('interpreter').checked;
    input('interpretRate').disabled = !input('interpreter').checked;
    const rows = [
      [text('Medical care', '医疗费用'), medicalText, care],
      [text('Accommodation', '酒店住宿'), money(hotel), `${unit(number('nights'), 'night', 'nights', '晚')} × ${unit(number('rooms'), 'room', 'rooms', '间')} × ${money(number('hotel'))}`],
      [text('Daily expenses', '餐饮与市内交通'), money(daily), `${unit(number('days'), 'day', 'days', '天')} × ${unit(people, 'person', 'people', '人')} × ${money(number('daily'))}`],
      [text('Return flights', '往返机票'), input('flight').value === '' ? text('Not included', '未计入') : money(flight), input('flight').value === '' ? '' : `${unit(people, 'person', 'people', '人')} × ${money(number('flight'))}`],
      [text('Care coordination', '就医协调'), money(service), input('coordination').checked ? text('One coordination budget', '单次服务预算') : text('Not selected', '未选择')],
      [text('Interpretation', '医疗翻译陪诊'), money(interpreter), input('interpreter').checked ? `${unit(number('interpretDays'), 'day', 'days', '天')} × ${money(number('interpretRate'))}` : text('Not selected', '未选择')]
    ];
    const list = $('[data-cost-breakdown]');
    list.replaceChildren();
    rows.forEach(([label, amount, formula]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      dt.textContent = label;
      const small = document.createElement('small');
      small.textContent = formula;
      dt.append(small);
      const dd = document.createElement('dd');
      dd.textContent = amount;
      row.append(dt, dd);
      list.append(row);
    });
    $('[data-reserve-label]').textContent = text('Contingency', '预留金') + ' · ' + number('buffer') + '%';
    $('[data-reserve]').textContent = range(reserveLow, reserveHigh);
    const missing = [];
    if (!medical) missing.push(text('medical fees', '医疗费用'));
    if (input('flight').value === '') missing.push(text('flights', '往返机票'));
    $('[data-cost-missing]').textContent = missing.length ? text('Not included: ', '尚未计入：') + missing.join(text(', ', '、')) : '';
    $('[data-cost-missing]').hidden = !missing.length;
    document.title = text('Cost calculator', '费用计算') + ' · HUAYIAN CARE TRIP';
    const caption = care + ' / ' + $('[data-plan-caption]').textContent;
    const assumptions = $('[data-cost-assumptions]').textContent;
    plan = { care:id, text: [text('HUAYIAN CARE TRIP · Budget (USD)', '华医安 · 费用预算（美元）'), caption, ...rows.map(([label,amount,formula]) => label + ': ' + amount + (formula ? ' (' + formula + ')' : '')), $('[data-reserve-label]').textContent + ': ' + $('[data-reserve]').textContent, $('[data-total-label]').textContent + ': ' + total, $('[data-cost-missing]').textContent, assumptions, $('.cost-disclaimer').textContent].filter(Boolean).join('\n') };
    $('[data-cost-download]').href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('\uFEFF' + plan.text);
  }
  form.addEventListener('submit', (event) => event.preventDefault());
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      document.body.classList.toggle('cost-summary-visible', entry.isIntersecting);
    }, {rootMargin:'-80px 0px -80px 0px'}).observe($('#cost-summary'));
  }
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  document.addEventListener('huayian:language', render);
  $('[data-cost-consult]').addEventListener('click', (event) => {
    if (!plan) { event.preventDefault(); form.reportValidity(); $('[data-cost-error]').scrollIntoView({block:'center'}); return; }
    try { sessionStorage.setItem('huayian-cost-plan', JSON.stringify(plan)); } catch (_) {}
  });
  render();
})();
