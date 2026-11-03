(function(){
'use strict';
/* ---------- Preisdaten ---------- */
const ALL = RAW_LIST.split('\n').map(l => { const [name, p] = l.split('|'); return { name, cents: Math.round(parseFloat(p) * 100) }; });
const PRICE = Object.fromEntries(ALL.map(x => [x.name, x.cents]));
const BE = Math.round(BLUTENTNAHME * 100);
const eur = c => (c / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const eurPlain = c => (c / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Exakte Namen */
const N = {
  BB: 'Blutbild (groß)', GLU: 'Glucose (Nüchternblutzucker)', HBA: 'HbA1c',
  LIP: 'Lipidprofil (Cholesterin, LDL, HDL, Triglyceride)', LEB: 'Leberwerte (GOT, GPT, gamma-GT)',
  GPT: 'GPT (ALAT)', GOT: 'GOT (ASAT)', GGT: 'Gamma-GT', ALP: 'Alkalische Phosphatase', BIL: 'Bilirubin (gesamt)',
  KREA: 'Kreatinin', HST: 'Harnstoff', NA: 'Natrium', K: 'Kalium', CYS: 'Cystatin C',
  TSH: 'Thyreotropin (TSH)', FT3: 'freies T3', FT4: 'freies T4', FER: 'Ferritin', CRP: 'CRP',
  B12: 'Vitamin B12', HOLO: 'Holotranscobalamin', FOL: 'Folsäure', D3: 'Vitamin D3 (25-OH)',
  CK: 'Creatinkinase', MG: 'Magnesium', HS: 'Harnsäure', LPS: 'Lipase', AMY: 'Amylase',
  COR: 'Cortisol', SE: 'Selen', ZN: 'Zink', TES: 'Testosteron, gesamt', SHBG: 'Sexualhormon-bindendes-Globulin (SHBG)', O3: 'Omega-3-Index'
};
Object.values(N).forEach(n => { if (PRICE[n] == null) throw new Error('Nicht auf der Liste: ' + n); });
const FASTING = new Set([N.GLU, N.LIP]);

const GROUP_OF = {
  [N.BB]: 'Blutbild', [N.CRP]: 'Blutbild', [N.GLU]: 'Stoffwechsel', [N.HBA]: 'Stoffwechsel', [N.LIP]: 'Stoffwechsel', [N.HS]: 'Stoffwechsel',
  [N.LEB]: 'Leber', [N.GPT]: 'Leber', [N.ALP]: 'Leber', [N.BIL]: 'Leber', [N.LPS]: 'Pankreas', [N.AMY]: 'Pankreas',
  [N.KREA]: 'Niere und Salze', [N.HST]: 'Niere und Salze', [N.NA]: 'Niere und Salze', [N.K]: 'Niere und Salze', [N.CYS]: 'Niere und Salze', [N.MG]: 'Niere und Salze',
  [N.TSH]: 'Schilddrüse', [N.FT3]: 'Schilddrüse', [N.FT4]: 'Schilddrüse', [N.FER]: 'Eisen',
  [N.B12]: 'Vitamine', [N.HOLO]: 'Vitamine', [N.FOL]: 'Vitamine', [N.D3]: 'Vitamine',
  [N.CK]: 'Muskel und Training', [N.TES]: 'Hormone', [N.SHBG]: 'Hormone'
};
const GROUP_ORDER = ['Blutbild', 'Stoffwechsel', 'Leber', 'Pankreas', 'Niere und Salze', 'Schilddrüse', 'Eisen', 'Vitamine', 'Muskel und Training', 'Hormone', 'Gewünschte Zusatzwerte'];

const FATIGUE_SENT = {
  [N.HBA]: 'Anhaltend hoher oder stark schwankender Zucker kann müde machen; ein Einzelwert erklärt keine Erschöpfung.',
  [N.GLU]: 'Anhaltend hoher oder stark schwankender Zucker kann müde machen; ein Einzelwert erklärt keine Erschöpfung.',
  [N.TSH]: 'Zu wenig oder zu viel Schilddrüsenhormon verändert Antrieb und Temperaturgefühl.',
  [N.FER]: 'Leere Eisenspeicher verringern den Sauerstofftransport.',
  [N.BB]: 'Blutarmut verringert den Sauerstofftransport.',
  [N.B12]: 'Wird für Blutbildung und Nerven gebraucht; ein normaler Serumwert schließt einen funktionellen Mangel nicht sicher aus.',
  [N.HOLO]: 'Wird für Blutbildung und Nerven gebraucht; ein normaler Wert schließt einen funktionellen Mangel nicht sicher aus.',
  [N.FOL]: 'Wird für Blutbildung und Nerven gebraucht; ein normaler Serumwert schließt einen funktionellen Mangel nicht sicher aus.',
  [N.D3]: 'Ein Mangel kann Müdigkeit begleiten, beweist sie aber nicht.',
  [N.KREA]: 'Austrocknung und ein gestörter Salzhaushalt machen schlapp; Kreatinin steigt auch durch Muskelmasse und Kreatin.',
  [N.CYS]: 'Zeigt die Nierenfunktion unabhängiger von Muskelmasse und Kreatin als Kreatinin.',
  [N.NA]: 'Austrocknung und ein gestörter Salzhaushalt machen schlapp.',
  [N.K]: 'Austrocknung und ein gestörter Salzhaushalt machen schlapp.',
  [N.CK]: 'Zeigt Muskelbelastung, nicht die Ursache von Alltagsmüdigkeit.'
};

const WISH_NOTE = {
  [N.O3]: 'teuer und ersetzt kein Lipidprofil',
  [N.HOLO]: 'teuer und doppelt zu Vitamin B12',
  [N.COR]: 'ohne feste Uhrzeit wenig aussagekräftig und kein Nachweis für Stress oder Übertraining',
  [N.TES]: 'nur morgens abnehmen, sonst wenig aussagekräftig',
  [N.CK]: 'nach harter Einheit erwartet erhöht; frühestens etwa 72 Stunden danach sinnvoll',
  [N.LPS]: 'eine leichte Erhöhung ohne starke Schmerzen ist keine Pankreatitis',
  [N.AMY]: 'eine leichte Erhöhung ohne starke Schmerzen ist keine Pankreatitis',
  [N.SE]: 'vergleichsweise teuer',
  [N.CYS]: 'zusätzlich zu Kreatinin, nicht statt Kreatinin',
  [N.D3]: 'nicht öfter als etwa alle 3 Monate sinnvoll',
  [N.CRP]: 'unspezifisch, hängt vom Infektstatus ab'
};

/* ---------- Formular-Definition ---------- */
const FORM = [
  { id: 'goal', n: 1, title: 'Ziel', hint: 'Mehrere möglich.', groups: [{ name: 'goal', type: 'check', opts: [
    ['vorsorge', 'Allgemeine Vorsorge ohne Beschwerden'], ['beschwerden', 'Abklärung konkreter Beschwerden'],
    ['verlauf', 'Verlaufskontrolle unter Medikament(en)'], ['sport', 'Sport- oder Trainingscheck'],
    ['vorwerte', 'Kontrolle bekannter Vorwerte'], ['preis', 'Nur Preisvergleich, noch keine Bestellung']] }],
    extra: `<div class="cond" id="oc_vorwerte" hidden><div class="row"><div><label class="l" for="vwDate">Datum der Vorwerte</label><input type="date" id="vwDate" name="vwDate"></div>
    <div><label class="l">Seitdem verändert?</label><div class="chips"><label class="chip"><input type="checkbox" name="vwChanged" value="1"><span>Beschwerden, Training, Supplements, Medikamente oder Wunschwerte haben sich geändert</span></label></div></div></div></div>` },
  { id: 'frame', n: 2, title: 'Rahmen', groups: [
    { name: 'fasting', label: 'Nüchtern möglich', type: 'radio', opts: [['ja', 'Ja'], ['nein', 'Nein'], ['unsicher', 'Unsicher']] },
    { name: 'budget', label: 'Budget', type: 'radio', opts: [['sparsam', 'Sparsam, bis etwa 60 €'], ['standard', 'Standard, bis etwa 120 €'], ['voll', 'Vollständig, bis etwa 180 €'], ['frei', 'Keine Grenze']] },
    { name: 'umfang', label: 'Umfang', type: 'radio', opts: [['klassiker', 'Nur Klassiker'], ['modul', 'Klassiker plus passendes Modul'], ['maximal', 'Maximale sinnvolle Liste'], ['selbst', 'Ich nenne selbst Werte']] },
    { name: 'intake', label: 'Essen und Trinken vor der Abnahme', hint: 'Zeitraum vor dem Screening, auch eine Fastenzeit. Kontext, keine Beschwerde. Mehrere möglich.', type: 'check', opts: [['gegessen', 'Normal gegessen'], ['wenigessen', 'Wenig gegessen'], ['getrunken', 'Normal getrunken'], ['wenigtrinken', 'Wenig getrunken'], ['unsicher', 'Unsicher']] },
    { name: 'sleep', label: 'Schlaf', hint: 'Kontext, keine Diagnose.', type: 'radio', opts: [['ok', 'Unauffällig'], ['schlecht', 'Zu wenig oder sehr unruhig'], ['na', 'Nicht angegeben']] },
    { name: 'output', label: 'Ausgabe', type: 'radio', opts: [['tabelle', 'Nur Tabelle'], ['erklaerung', 'Tabelle plus Erklärung'], ['druck', 'Zusätzlich Druckblock']] },
    { name: 'nobest', label: 'Nicht-bestellen-Block im Druck', hint: 'Ohne Auswahl gilt „nein“.', type: 'radio', opts: [['ja', 'Ja'], ['nein', 'Nein']] }],
    extra: `<div class="cond" id="oc_sex" hidden><p class="hint" style="margin-top:0">Für Hormone, Wechseljahre oder Schwangerschaft relevant:</p><div class="row"><div><label class="l" for="sex">Geschlecht</label><select id="sex" name="sex"><option value="">Nicht angegeben</option><option value="m">Männlich</option><option value="w">Weiblich</option><option value="d">Divers</option></select></div>
    <div><label class="l" for="age">Ungefähres Alter</label><select id="age" name="age"><option value="">Nicht angegeben</option><option>unter 30</option><option>30 bis 44</option><option>45 bis 59</option><option>60 und älter</option></select></div></div></div>` },
  { id: 'sym', n: 3, title: 'Beschwerden', hint: 'Nur Symptome, keine Ess- oder Trinkmenge. Mehrere möglich, „keine“ ist erlaubt.', groups: [{ name: 'sym', type: 'check', exclusive: 'keine', opts: [
    ['muede', 'Müdigkeit, Erschöpfung, Brain Fog'], ['kaelte', 'Kältegefühl, unerklärliche Gewichtszunahme, Haarausfall'], ['kraempfe', 'Krämpfe'], ['herz', 'Herzrasen'],
    ['magen', 'Übelkeit, Erbrechen, Durchfall, Verstopfung'], ['oberbauch', 'Starke Oberbauchschmerzen, Ausstrahlung in den Rücken'],
    ['gelb', 'Gelbfärbung, dunkler Urin ohne Trainingsbezug, heller Stuhl, Juckreiz'], ['urintrain', 'Dunkler Urin nach dem Training oder Muskelschmerz, der nicht zum Training passt'],
    ['gelenk', 'Gelenkschmerz oder bekannte Gicht'], ['muskelstatin', 'Muskelschmerz, besonders unter Cholesterin-Senker'], ['infekt', 'Infektzeichen: Fieber, Halsschmerz, anhaltender Husten'],
    ['hormonm', 'Männer: Libidoverlust, erektile Probleme'], ['hormonw', 'Frauen: Zyklusunregelmäßigkeit, Hitzewallungen, Wechseljahresbeschwerden'], ['psyche', 'Gedrückte Stimmung, Angst, innere Unruhe oder Antriebslosigkeit'], ['keine', 'Keine']] }] },
  { id: 'known', n: 4, title: 'Bekanntes', hint: 'Mehrere möglich.', groups: [{ name: 'known', type: 'check', exclusive: 'keine', opts: [
    ['diab', 'Diabetes oder Prädiabetes'], ['leber', 'Lebererkrankung oder Fettleber'], ['niere', 'Nierenerkrankung'], ['schild', 'Schilddrüsenerkrankung'], ['eisen', 'Eisenmangel oder Blutarmut'], ['gicht', 'Gicht'],
    ['herzk', 'Herz-Kreislauf-Erkrankung oder familiär frühe Herzinfarkte'], ['schwanger', 'Schwangerschaft nicht ausgeschlossen'], ['keine', 'Keine der Angaben']] }] },
  { id: 'fit', n: 5, title: 'Fitness', hint: 'Mehrere möglich, nichts vorausgewählt.', groups: [
    { name: 'fit', type: 'check', exclusive: 'nichts', opts: [['keinkraft', 'Kein Krafttraining'], ['kraft', 'Regelmäßiges Krafttraining'], ['protein', 'Hohe Proteinzufuhr'], ['kreatin', 'Kreatin'], ['veg', 'Vegetarisch oder vegan'], ['nichts', 'Nichts davon genannt']] },
    { name: 'last', label: 'Letzte harte Einheit', type: 'radio', opts: [['heute', 'Heute oder gestern'], ['23', 'Vor 2 bis 3 Tagen'], ['72', 'Mindestens etwa 72 Stunden her'], ['na', 'Nicht angegeben']] }] },
  { id: 'med', n: 6, title: 'Medikamente, Supplements, Alkohol und Nikotin', hint: 'Mehrere möglich. „Keines“ ist erlaubt, aber nicht vorausgewählt.', groups: [
    { name: 'med', label: 'Stoffwechsel und Organe', type: 'check', exclusive: 'keines', opts: [
      ['keines', 'Keines'], ['tirz', 'Tirzepatid (Mounjaro, Zepbound)'], ['glp1', 'Anderes GLP-1-Medikament (Semaglutid, Liraglutid, Dulaglutid)'], ['metformin', 'Metformin'], ['insulin', 'Insulin oder Sulfonylharnstoff'],
      ['statin', 'Statin oder anderer Cholesterin-Senker'], ['bp', 'Blutdruckmittel'], ['diur', 'Diuretikum'], ['lt4', 'Schilddrüsenhormon, Levothyroxin'], ['eisenmed', 'Eisen'], ['ppi', 'Magensäureblocker, PPI'],
      ['nsar', 'NSAR, regelmäßig Ibuprofen oder Diclofenac'], ['kortison', 'Kortison, dauerhaft'], ['allo', 'Allopurinol oder anderes Gichtmittel']] },
    { name: 'med2', label: 'Weitere', type: 'check', opts: [['psy', 'Antidepressivum, Neuroleptikum oder Phasenprophylaxe, nicht Lithium'], ['lithium', 'Lithium'], ['horm', 'Hormonelle Verhütung oder HRT']] },
    { name: 'genuss', label: 'Alkohol und Nikotin', hint: 'Nur Kontext für die Einordnung, eröffnet keine eigene Analyse.', type: 'check', exclusive: 'keines', opts: [['keines', 'Keines von beiden'], ['alk', 'Alkohol, regelmäßig oder in den letzten 2 Tagen'], ['nik', 'Nikotin (Rauchen, Dampfen, Snus)']] },
    { name: 'medfree', label: 'Sonstiges Medikament, mit Namen', type: 'text' },
    { name: 'supp', label: 'Supplements', type: 'check', exclusive: 'keines', opts: [['keines', 'Keines'], ['d3', 'Vitamin D3'], ['mg', 'Magnesium'], ['o3', 'Omega-3'], ['bk', 'B-Komplex'], ['b12', 'Vitamin B12, einzeln']] },
    { name: 'suppfree', label: 'Sonstiges Supplement, mit Namen', type: 'text' },
    { name: 'wish', label: 'Wunschwerte', hint: 'Nur was Sie hier ankreuzen, wird als Wunsch aufgenommen.', type: 'check', opts: [
      [N.LPS, 'Lipase'], [N.AMY, 'Amylase'], [N.D3, 'Vitamin D3 (25-OH)'], [N.B12, 'Vitamin B12'], [N.HOLO, 'Holotranscobalamin'], [N.FER, 'Ferritin'], [N.TSH, 'Thyreotropin (TSH)'], [N.FT3, 'freies T3'], [N.FT4, 'freies T4'],
      [N.HS, 'Harnsäure'], [N.CRP, 'CRP'], [N.COR, 'Cortisol'], [N.SE, 'Selen'], [N.ZN, 'Zink'], [N.CK, 'Creatinkinase'], [N.CYS, 'Cystatin C'], [N.TES, 'Testosteron, gesamt'], [N.O3, 'Omega-3-Index']] },
    { name: 'wishfree', label: 'Weitere Wunschwerte, frei', hint: 'Einer pro Zeile oder mit Semikolon getrennt.', type: 'textarea' }] }
];

function renderForm() {
  const f = document.getElementById('oForm');
  f.innerHTML = FORM.map(sec => {
    const groups = sec.groups.map(g => {
      let h = '';
      if (g.label) h += `<div class="sub">${g.label}${g.hint ? ` <small>· ${g.hint}</small>` : ''}</div>`;
      if (g.type === 'text') h += `<input type="text" name="${g.name}" aria-label="${g.label}" autocomplete="off">`;
      else if (g.type === 'textarea') h += `<textarea name="${g.name}" rows="2" aria-label="${g.label}"></textarea>`;
      else h += `<div class="chips" role="${g.type === 'radio' ? 'radiogroup' : 'group'}">` + g.opts.map(([v, l]) =>
        `<label class="chip ${g.type === 'radio' ? 'radio' : ''}"><input type="${g.type === 'radio' ? 'radio' : 'checkbox'}" name="${g.name}" value="${esc(v)}" ${g.exclusive ? `data-ex="${g.exclusive}"` : ''}><span>${esc(l)}</span></label>`).join('') + '</div>';
      return h;
    }).join('');
    return `<fieldset id="os_${sec.id}"><legend><span class="n">${sec.n}</span>${sec.title}</legend>${sec.hint ? `<p class="hint">${sec.hint}</p>` : ''}${groups}${sec.extra || ''}</fieldset>`;
  }).join('');
}

function wireForm() {
  const f = document.getElementById('oForm');
  f.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset && t.dataset.ex && t.type === 'checkbox') {
      const same = f.querySelectorAll(`input[name="${t.name}"]`);
      if (t.value === t.dataset.ex && t.checked) same.forEach(i => { if (i !== t) i.checked = false; });
      else if (t.checked) same.forEach(i => { if (i.value === t.dataset.ex) i.checked = false; });
    }
    if (t.name === 'fit' && (t.value === 'kraft' || t.value === 'keinkraft') && t.checked) f.querySelectorAll('input[name=fit]').forEach(i => { if (i !== t && (i.value === 'kraft' || i.value === 'keinkraft')) i.checked = false; });
    syncCond();
  });
  f.addEventListener('submit', e => { e.preventDefault(); showResult(); });
  document.getElementById('oReset').onclick = () => { f.reset(); syncCond(); window.scrollTo(0, 0); };
  document.getElementById('oBack').onclick = () => { show('oFormView'); window.scrollTo(0, 0); };
  syncCond();
}
const val = n => { const e = document.querySelector(`#oForm [name="${n}"]:checked`); return e ? e.value : ''; };
const vals = n => [...document.querySelectorAll(`#oForm [name="${n}"]:checked`)].map(e => e.value);
function syncCond() {
  document.getElementById('oc_vorwerte').hidden = !vals('goal').includes('vorwerte');
  const wish = vals('wish'), sym = vals('sym'), known = vals('known'), med2 = vals('med2');
  const wf = (document.querySelector('[name=wishfree]').value || '').toLowerCase();
  const rel = sym.includes('hormonm') || sym.includes('hormonw') || wish.includes(N.TES) || known.includes('schwanger') || med2.includes('horm') || /testosteron|hormon|psa/.test(wf);
  document.getElementById('oc_sex').hidden = !rel;
}
function show(id) { ['oFormView', 'oResultView'].forEach(x => document.getElementById(x).hidden = x !== id); }

/* ---------- Freitext-Zuordnung ---------- */
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const ALIAS = { 'b12': N.B12, 'vitamin d': N.D3, 'vitamin d3': N.D3, '25 oh': N.D3, 'tsh': N.TSH, 't3': N.FT3, 't4': N.FT4, 'ck': N.CK, 'kreatinkinase': N.CK, 'creatinkinase': N.CK, 'testosteron': N.TES,
  'shbg': N.SHBG, 'hba1c': N.HBA, 'crp': N.CRP, 'ldh': 'Lactatdehydrogenase (LDH)', 'got': N.GOT, 'gpt': N.GPT, 'ggt': N.GGT, 'gamma gt': N.GGT, 'omega 3': N.O3, 'omega 3 index': N.O3, 'blutzucker': N.GLU,
  'glucose': N.GLU, 'glukose': N.GLU, 'eisen': 'Eisen', 'kreatinin': N.KREA, 'folsaeure': N.FOL, 'folsure': N.FOL, 'folsaure': N.FOL, 'hcg': 'Choriongonadotropin (HCG)', 'apob': 'Apolipoprotein B (Apo B)', 'lp a': 'Lipoprotein (a)', 'lipoprotein a': 'Lipoprotein (a)' };
const MISSING = { 'troponin': ['Troponin', 'NT-pro-BNP (ersetzt Troponin nicht)'], 'lithium': ['Lithium (Spiegel)', null], 'lithiumspiegel': ['Lithium (Spiegel)', null], 'ck mb': ['CK-MB', N.CK], 'vitamin k': ['Vitamin K', null], 'laktat': ['Laktat', null], 'aminosaeuren': ['Aminosäurenprofil', null] };
function matchFree(raw) {
  const out = { added: [], ambiguous: [], missing: [] };
  const tryOne = (q) => {
    const nq = norm(q); if (!nq) return true;
    if (MISSING[nq]) { out.missing.push({ q, label: MISSING[nq][0], alt: MISSING[nq][1] }); return true; }
    let hit = ALL.find(x => norm(x.name) === nq);
    if (!hit && ALIAS[nq]) hit = ALL.find(x => x.name === ALIAS[nq]);
    if (hit) { out.added.push(hit.name); return true; }
    const c = ALL.filter(x => norm(x.name).includes(nq));
    if (c.length === 1) { out.added.push(c[0].name); return true; }
    if (c.length > 1) { out.ambiguous.push({ q, c: c.slice(0, 5).map(x => x.name) }); return true; }
    return false;
  };
  raw.split(/[\n;]+/).forEach(line => {
    if (!line.trim()) return;
    if (tryOne(line)) return;
    line.split(',').forEach(part => {
      if (!part.trim()) return;
      if (tryOne(part)) return;
      const toks = norm(part).split(' ').filter(t => t.length > 3);
      let best = null, bs = 0;
      ALL.forEach(x => { const nn = norm(x.name); const s = toks.filter(t => nn.includes(t.slice(0, 5))).length; if (s > bs) { bs = s; best = x.name; } });
      out.missing.push({ q: part.trim(), label: part.trim(), alt: best });
    });
  });
  return out;
}

/* ---------- Engine ---------- */
function run(s) {
  const has = (arr, id) => arr.includes(id);
  const S = s.sym, K = s.known, F = s.fit, M = [...s.med, ...s.med2], SU = s.supp;
  const items = new Map(); const notes = []; const excluded = [];
  const add = (name, why, prio = 'A', src = 'x') => {
    if (PRICE[name] == null) throw new Error(name);
    let it = items.get(name);
    if (!it) { it = { name, cents: PRICE[name], group: GROUP_OF[name] || 'Gewünschte Zusatzwerte', why: [], prio: 'B', src: new Set(), fast: FASTING.has(name), flags: [] }; items.set(name, it); }
    if (why && !it.why.includes(why)) it.why.push(why);
    if (prio === 'A') it.prio = 'A';
    it.src.add(src);
    return it;
  };
  const budget = s.budget || 'standard';
  const limit = { sparsam: 6000, standard: 12000, voll: 18000, frei: Infinity }[budget];
  const umfang = s.umfang || 'modul';
  const goals = s.goal;
  const fatigue = has(S, 'muede');
  const hasMed = k => M.includes(k);
  const glp = hasMed('tirz') || hasMed('glp1');
  let skipAll = false;

  /* Vorwerte unter 3 Monaten */
  if (goals.length === 1 && goals[0] === 'vorwerte' && s.vwDate && !s.vwChanged) {
    const days = (Date.now() - new Date(s.vwDate).getTime()) / 86400000;
    if (days >= 0 && days < 91) { skipAll = true; notes.push('Die Vorwerte sind jünger als 3 Monate und es hat sich nichts geändert. Eine Wiederholung ist nicht automatisch sinnvoll, deshalb enthält die Liste nur ausdrücklich genannte Wunschwerte.'); }
  }
  const selbst = umfang === 'selbst';
  const modules = !selbst && (umfang !== 'klassiker' || budget === 'sparsam');

  if (!skipAll) {
    /* Basis */
    if (!selbst) {
      if (budget === 'sparsam') {
        const b = 'Basis im sparsamen Budget';
        add(N.BB, b, 'A', 'base'); add(N.TSH, b, 'A', 'base'); add(N.FER, b, 'A', 'base'); add(N.GPT, b, 'A', 'base'); add(N.KREA, b, 'A', 'base'); add(N.NA, b, 'A', 'base'); add(N.K, b, 'A', 'base');
      } else {
        const b = 'Klassiker';
        add(N.BB, 'Klassiker: Blutbild', 'A', 'base'); add(N.GLU, 'Klassiker: Nüchternzucker', 'A', 'base'); add(N.LIP, 'Klassiker: Blutfette', 'A', 'base');
        add(N.LEB, 'Klassiker: Leber', 'A', 'base'); add(N.ALP, 'Klassiker: Leber, nicht im Paket enthalten', 'A', 'base'); add(N.BIL, 'Klassiker: Leber, nicht im Paket enthalten', 'A', 'base');
        add(N.KREA, 'Klassiker: Niere', 'A', 'base'); add(N.HST, 'Klassiker: Niere', 'A', 'base'); add(N.NA, 'Klassiker: Salze', 'A', 'base'); add(N.K, 'Klassiker: Salze', 'A', 'base');
        if (umfang === 'maximal') {
          add(N.HBA, 'Langzeitzucker', 'B', 'ext'); add(N.TSH, 'Schilddrüse', 'B', 'ext'); add(N.FER, 'Eisenspeicher', 'B', 'ext'); add(N.D3, 'Vitamin-D-Status', 'B', 'ext'); add(N.B12, 'Vitamin-B12-Status', 'B', 'ext');
        }
      }
    }

    /* Medikamente */
    const med = 'med';
    if (glp) {
      const w = 'Verlauf unter ' + (hasMed('tirz') ? 'Tirzepatid' : 'GLP-1-Medikament');
      [N.GLU, N.HBA, N.LIP, N.LEB, N.ALP, N.BIL, N.KREA, N.HST, N.NA, N.K].forEach(n => add(n, w, 'A', med));
      if (has(S, 'oberbauch')) { add(N.LPS, 'Starke Oberbauchschmerzen unter ' + (hasMed('tirz') ? 'Tirzepatid' : 'GLP-1'), 'A', med); add(N.AMY, 'Starke Oberbauchschmerzen unter ' + (hasMed('tirz') ? 'Tirzepatid' : 'GLP-1'), 'A', med); }
      else if (has(S, 'magen')) notes.push('Lipase und Amylase sind bei Übelkeit oder Durchfall allein nicht automatisch dabei. Bei anhaltendem Erbrechen oder Wunsch lassen sie sich ergänzen. Eine leichte Erhöhung ohne starke Schmerzen ist keine Pankreatitis.');
    }
    if (hasMed('metformin')) { add(N.KREA, 'Verlauf unter Metformin', 'A', med); add(N.B12, 'Verlauf unter Metformin', 'A', med); add(N.HBA, 'Verlauf unter Metformin', 'A', med); }
    if (hasMed('insulin')) { add(N.GLU, 'Verlauf unter Insulin oder Sulfonylharnstoff', 'A', med); add(N.HBA, 'Verlauf unter Insulin oder Sulfonylharnstoff', 'A', med); }
    if (hasMed('statin')) { add(N.LIP, 'Verlauf unter Statin', 'A', med); add(N.GPT, 'Verlauf unter Statin', 'A', med); }
    if (hasMed('bp') || hasMed('diur')) { const w = hasMed('diur') ? 'Verlauf unter Diuretikum' : 'Verlauf unter Blutdruckmittel'; add(N.KREA, w, 'A', med); add(N.NA, w, 'A', med); add(N.K, w, 'A', med); }
    if (hasMed('lt4')) { add(N.TSH, 'Verlauf unter Schilddrüsenhormon', 'A', med); if (fatigue || has(S, 'kaelte') || has(S, 'herz')) { add(N.FT3, 'Schilddrüsenhormon plus Beschwerden', 'B', med); add(N.FT4, 'Schilddrüsenhormon plus Beschwerden', 'B', med); } }
    if (hasMed('eisenmed')) { add(N.BB, 'Verlauf unter Eisen', 'A', med); add(N.FER, 'Verlauf unter Eisen', 'A', med); add(N.CRP, 'Verlauf unter Eisen, Entzündung beeinflusst Ferritin', 'A', med); }
    if (hasMed('ppi')) { add(N.B12, 'Verlauf unter Magensäureblocker', 'A', med); add(N.FER, 'Verlauf unter Magensäureblocker', 'A', med); }
    if (hasMed('nsar')) { add(N.KREA, 'Regelmäßige NSAR', 'A', med); add(N.BB, 'Regelmäßige NSAR', 'A', med); }
    if (hasMed('kortison')) { add(N.GLU, 'Dauerhaft Kortison', 'A', med); add(N.HBA, 'Dauerhaft Kortison', 'A', med); }
    if (hasMed('allo') && (has(K, 'gicht') || has(S, 'gelenk') || has(s.wish, N.HS))) add(N.HS, 'Gichtmittel plus Gicht, Gelenkschmerz oder Wunsch', 'A', med);
    if (hasMed('allo') && !(has(K, 'gicht') || has(S, 'gelenk') || has(s.wish, N.HS))) notes.push('Harnsäure ist bei Gichtmittel allein nicht automatisch dabei, nur bei Gicht, Gelenkschmerz oder Wunsch.');
    if (hasMed('lithium')) {
      add(N.KREA, 'Verlauf unter Lithium', 'A', med); add(N.TSH, 'Verlauf unter Lithium', 'A', med);
      notes.push('Ein Lithium-Spiegel steht nicht auf der Preisliste dieses Standorts, und es gibt keine gleichwertige Analyse. Er muss anderweitig bestimmt werden.');
    }
    if (hasMed('psy')) notes.push('Für Antidepressivum, Neuroleptikum oder Phasenprophylaxe gibt es keine Extra-Analyse.');
    if (hasMed('horm')) notes.push('Bei hormoneller Verhütung oder HRT wird kein großes Hormonprofil und nicht automatisch Leber oder TSH aufgenommen.');
    if (s.medfree.trim()) notes.push('Sonstiges Medikament „' + s.medfree.trim() + '“: nicht bewertet, daraus wurden keine Zusatzwerte abgeleitet.');

    /* Supplements */
    if (has(SU, 'd3')) add(N.D3, 'Vitamin-D-Spiegel unter Supplement (nicht öfter als etwa alle 3 Monate)', 'B', 'supp');
    if (has(SU, 'b12') || has(SU, 'bk')) {
      add(N.B12, 'Spiegel unter ' + (has(SU, 'bk') ? 'B-Komplex' : 'Vitamin B12'), 'B', 'supp');
      if (fatigue) add(N.FOL, 'Spiegel unter B-Supplement plus Müdigkeit', 'B', 'supp');
    }
    if (has(SU, 'mg') && !(has(S, 'kraempfe') || has(K, 'niere') || has(s.wish, N.MG))) notes.push('Serum-Magnesium wird unter Magnesium-Supplement nur bei Krämpfen, Nierenerkrankung oder Wunsch aufgenommen. Wenig gegessen allein reicht nicht.');
    if (has(SU, 'o3') && !has(s.wish, N.O3)) notes.push('Der Omega-3-Index (' + eur(PRICE[N.O3]) + ') wird nur auf ausdrücklichen Wunsch aufgenommen und ersetzt kein Lipidprofil.');
    if (s.suppfree.trim()) notes.push('Sonstiges Supplement „' + s.suppfree.trim() + '“: nicht bewertet, daraus wurden keine Zusatzwerte abgeleitet.');

    /* Symptom-Module */
    if (modules) {
      if (fatigue) {
        const w = 'Müdigkeit, Erschöpfung oder Brain Fog';
        [N.BB, N.TSH, N.FER].forEach(n => add(n, w, 'A', 'sym'));
        [N.B12, N.FOL, N.D3].forEach(n => add(n, w, 'B', 'sym'));
        add(N.CRP, w + ' (optional)', 'B', 'sym');
      }
      if (has(S, 'kaelte')) { const w = 'Kältegefühl, Gewichtszunahme oder Haarausfall'; add(N.TSH, w, 'A', 'sym'); add(N.FER, w, 'A', 'sym'); add(N.BB, w, 'A', 'sym'); }
      if (has(S, 'kraempfe')) { const w = 'Krämpfe'; add(N.MG, w, 'A', 'sym'); add(N.NA, w, 'A', 'sym'); add(N.K, w, 'A', 'sym'); }
      if (has(S, 'herz')) { const w = 'Herzrasen (keine Herzdiagnostik)'; add(N.NA, w, 'A', 'sym'); add(N.K, w, 'A', 'sym'); add(N.GLU, w, 'A', 'sym'); add(N.TSH, w, 'A', 'sym'); }
      if (has(S, 'magen')) { const w = 'Magen-Darm-Beschwerden, Flüssigkeits- und Salzverlust'; add(N.NA, w, 'A', 'sym'); add(N.K, w, 'A', 'sym'); add(N.KREA, w, 'A', 'sym'); }
      if (has(S, 'oberbauch')) { const w = 'Starke Oberbauchschmerzen'; add(N.LPS, w, 'A', 'sym'); add(N.AMY, w, 'A', 'sym'); }
      if (has(S, 'gelb')) { const w = 'Gelbfärbung, dunkler Urin, heller Stuhl oder Juckreiz'; add(N.LEB, w, 'A', 'sym'); add(N.ALP, w, 'A', 'sym'); add(N.BIL, w, 'A', 'sym'); }
      if (has(S, 'gelenk')) add(N.HS, 'Gelenkschmerz oder bekannte Gicht', 'A', 'sym');
      if (has(S, 'infekt')) { add(N.CRP, 'Infektzeichen', 'A', 'sym'); add(N.BB, 'Infektzeichen', 'A', 'sym'); }
      if (has(S, 'hormonw')) notes.push('Bei Zyklus- oder Wechseljahresbeschwerden wird kein Hormonprofil automatisch aufgenommen. Wunschwerte können Sie oben nennen.');
      if (has(S, 'hormonm')) { add(N.TES, 'Libidoverlust oder erektile Probleme, morgens abnehmen', 'B', 'sym'); add(N.SHBG, 'Nur zusammen mit Testosteron', 'B', 'sym'); }
    }
    if (has(S, 'psyche')) notes.push('Gedrückte Stimmung, Angst oder Unruhe eröffnen kein eigenes Profil und kein Cortisol.' + (fatigue ? '' : ' Die Erschöpfungs-Basiswerte werden nur bei gleichzeitiger Müdigkeit oder auf Wunsch aufgenommen.'));

    /* Bekanntes */
    if (modules || true) {
      if (has(K, 'diab')) { add(N.GLU, 'Bekannter Diabetes oder Prädiabetes', 'A', 'known'); add(N.HBA, 'Bekannter Diabetes oder Prädiabetes', 'A', 'known'); }
      if (has(K, 'leber')) { add(N.LEB, 'Bekannte Lebererkrankung', 'A', 'known'); add(N.ALP, 'Bekannte Lebererkrankung', 'A', 'known'); add(N.BIL, 'Bekannte Lebererkrankung', 'A', 'known'); }
      if (has(K, 'niere')) { ['Kreatinin', 'Harnstoff', 'Natrium', 'Kalium'].forEach(n => add(n, 'Bekannte Nierenerkrankung', 'A', 'known')); add(N.MG, 'Bekannte Nierenerkrankung', 'B', 'known'); }
      if (has(K, 'schild')) add(N.TSH, 'Bekannte Schilddrüsenerkrankung', 'A', 'known');
      if (has(K, 'eisen')) { add(N.BB, 'Bekannter Eisenmangel oder Blutarmut', 'A', 'known'); add(N.FER, 'Bekannter Eisenmangel oder Blutarmut', 'A', 'known'); add(N.CRP, 'Eisenfrage, Entzündung beeinflusst Ferritin', 'A', 'known'); }
      if (has(K, 'gicht')) add(N.HS, 'Bekannte Gicht', 'A', 'known');
      if (has(K, 'herzk')) { add(N.LIP, 'Herz-Kreislauf-Risiko', 'A', 'known'); add(N.HBA, 'Herz-Kreislauf-Risiko', 'B', 'known'); }
      if (has(K, 'schwanger')) notes.push('Schwangerschaft nicht ausgeschlossen: Es wird kein Hormonprofil aufgenommen. Auf der Liste stehen „Choriongonadotropin (HCG)“ und „Beta HCG“ (je ' + eur(PRICE['Beta HCG']) + '), nicht in der Summe.');
    }

    /* Fitness */
    const lastFresh = s.last === 'heute' || s.last === '23';
    const ckReason = has(S, 'urintrain') ? 'Dunkler Urin nach Training oder unpassender Muskelschmerz' : has(S, 'muskelstatin') ? 'Muskelschmerz unter Cholesterin-Senker' : null;
    if (ckReason) add(N.CK, ckReason, 'A', 'sym');
    else if (has(F, 'kraft') && (goals.includes('sport') || umfang === 'maximal') && budget !== 'sparsam') add(N.CK, 'Regelmäßiges Krafttraining', 'B', 'fit');
    if (has(F, 'kreatin') || has(F, 'protein')) {
      const w = has(F, 'kreatin') ? 'Kreatin' : 'Hohe Proteinzufuhr';
      add(N.KREA, 'Zusammen mit Cystatin C bei ' + w, 'A', 'fit'); add(N.CYS, w + ': zusätzlich zu Kreatinin, nicht statt Kreatinin', budget === 'sparsam' ? 'B' : 'A', 'fit');
    }
    if (has(F, 'protein')) add(N.HS, 'Hohe Proteinzufuhr', 'B', 'fit');
    if (has(F, 'veg')) { add(N.B12, 'Vegetarisch oder vegan', 'A', 'fit'); add(N.FER, 'Vegetarisch oder vegan', 'A', 'fit'); }
    if (has(s.intake, 'wenigtrinken') && !(items.has(N.NA) && items.has(N.K))) notes.push('Wenig getrunken eröffnet allein kein großes Profil. Natrium und Kalium sind ohnehin nur dabei, wenn Niere und Salze laufen.');
    if (s.last === 'na' && items.has(N.CK)) notes.push('Letzte harte Einheit nicht angegeben: Für Creatinkinase sollte sie möglichst etwa 72 Stunden zurückliegen.');
    if (selbst) notes.push('Umfang „Ich nenne selbst Werte“: Es werden nur Ihre Wunschwerte aufgenommen, keine Klassiker und keine medikamentenbezogenen Zusatzwerte.');
    if (!selbst && umfang === 'klassiker' && budget !== 'sparsam') notes.push('Umfang „Nur Klassiker“: Beschwerde-Module wurden nicht aufgenommen, nur Klassiker und medikamentenbezogene Werte.');
  }
  if (selbst) { for (const [k, it] of [...items]) { if (!it.src.has('wish')) items.delete(k); } }

  /* Wunschwerte */
  const wishNames = new Set(); const wishInfo = [];
  s.wish.forEach(n => wishNames.add(n));
  const free = matchFree(s.wishfree || '');
  free.added.forEach(n => wishNames.add(n));
  wishNames.forEach(n => {
    const it = add(n, 'Ausdrücklicher Wunsch', 'B', 'wish');
    const bits = []; if (WISH_NOTE[n]) bits.push(WISH_NOTE[n]); else if (PRICE[n] >= 2000) bits.push('vergleichsweise teuer');
    if (n === N.TES && !it.flags.includes('morgens')) it.flags.push('morgens');
    it.wishNote = bits.join('; ');
  });
  if (wishNames.has(N.TES)) { const it = add(N.SHBG, 'Nur zusammen mit Testosteron', 'B', 'sym'); }
  free.ambiguous.forEach(a => notes.push('Wunsch „' + a.q + '“ ist nicht eindeutig. Treffer auf der Liste: ' + a.c.join('; ') + '. Bitte genauen Namen nennen, nicht aufgenommen.'));
  free.missing.forEach(m => notes.push('„' + m.label + '“ steht nicht auf dieser Preisliste.' + (m.alt ? ' Nächste vorhandene Alternative: ' + m.alt + ', nicht in der Summe.' : ' Es gibt keine vergleichbare Analyse auf der Liste.')));
  if (has(S, 'herz') && !free.missing.some(m => /troponin/i.test(m.q))) { /* Troponin nur auf Wunsch */ }
  if (has(s.known, 'herzk') || has(S, 'herz')) { /* keine Zusatzhinweise */ }

  /* Duplikate */
  const merge = (keep, drop) => { const a = items.get(keep), b = items.get(drop); if (!a || !b) return; b.why.forEach(w => { if (!a.why.includes(w)) a.why.push(w); }); b.src.forEach(x => a.src.add(x)); if (b.prio === 'A') a.prio = 'A'; items.delete(drop); };
  if (items.has(N.LEB)) { [N.GPT, N.GOT, N.GGT].forEach(n => merge(N.LEB, n)); }
  if (items.has(N.B12) && items.has(N.HOLO)) {
    const hw = wishNames.has(N.HOLO), bw = wishNames.has(N.B12);
    if (hw && !bw) { merge(N.HOLO, N.B12); notes.push('Holotranscobalamin statt Vitamin B12 gewählt, beides zusammen wäre doppelt.'); }
    else { const it = items.get(N.HOLO); items.delete(N.HOLO); excluded.push({ name: N.HOLO, cents: PRICE[N.HOLO], reason: 'doppelt zu Vitamin B12, nicht beides bestellen' }); }
  }

  /* Flags */
  items.forEach(it => {
    if (it.fast && s.fasting !== 'ja') it.flags.push('eingeschränkt aussagekräftig ohne Nüchternheit');
    if (it.name === N.CK && (s.last === 'heute' || s.last === '23')) it.flags.push('erwartet erhöht, Aussage begrenzt');
    it.restricted = (it.fast && s.fasting !== 'ja') || (it.name === N.CK && (s.last === 'heute' || s.last === '23'));
  });

  /* Budget */
  let list = [...items.values()];
  const isWishOnly = it => it.src.size === 1 && it.src.has('wish');
  const keepSparsam = it => it.src.has('base') || it.src.has('med') || it.src.has('wish') || (it.src.has('sym') && it.prio === 'A') || it.src.has('known') && it.prio === 'A';
  const deferred = [];
  if (budget === 'sparsam') list = list.filter(it => { if (keepSparsam(it)) return true; deferred.push({ name: it.name, cents: it.cents, reason: it.src.has('fit') && it.name === N.CYS ? 'kann im sparsamen Budget warten' : 'im sparsamen Budget zurückgestellt' }); return false; });
  const A = list.filter(it => it.prio === 'A' && !isWishOnly(it));
  const W = list.filter(it => isWishOnly(it));
  const Bn = list.filter(it => it.prio === 'B' && !isWishOnly(it));
  let sum = 0; const main = []; let overA = false;
  A.forEach(it => { main.push(it); sum += it.cents; });
  if (sum > limit) overA = true;
  W.forEach(it => { if (sum + it.cents <= limit) { main.push(it); sum += it.cents; } else excluded.push({ name: it.name, cents: it.cents, reason: 'über Budget, nicht in der Summe' + (it.wishNote ? '. ' + cap(it.wishNote) : '') }); });
  Bn.sort((a, b) => a.cents - b.cents).forEach(it => { if (sum + it.cents <= limit) { main.push(it); sum += it.cents; } else deferred.push({ name: it.name, cents: it.cents, reason: 'über Budget zurückgestellt' }); });
  main.sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));

  /* Option B */
  const optB = main.filter(it => it.prio === 'A' && !it.restricted && !isWishOnly(it));
  const sameAsMain = optB.length === main.length;
  const reasonsB = [];
  if (main.some(it => it.fast && s.fasting !== 'ja')) reasonsB.push('ohne Nüchternheit werden Glucose (Nüchternblutzucker) und Lipidprofil verschoben');
  if (main.some(it => it.name === N.CK && it.restricted)) reasonsB.push('Creatinkinase wird bis etwa 72 Stunden nach der letzten harten Einheit verschoben');
  if (main.some(it => it.prio === 'B' && !it.restricted)) reasonsB.push('Priorität-B-Werte entfallen');
  if (main.some(it => isWishOnly(it))) reasonsB.push('Wunschwerte entfallen');

  return { main, optB: sameAsMain ? null : optB, reasonsB, excluded, deferred, notes, sum, limit, overA, budget, umfang, wishNames, isWishOnly, free, skipAll };
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Ausgabe ---------- */
function collect() {
  const g = n => val(n);
  return {
    goal: vals('goal'), vwDate: document.getElementById('vwDate').value, vwChanged: !!document.querySelector('[name=vwChanged]:checked'),
    fasting: g('fasting'), budget: g('budget'), umfang: g('umfang'), intake: vals('intake'), sleep: g('sleep'), output: g('output') || 'erklaerung', nobest: g('nobest') === 'ja',
    sex: document.getElementById('sex').value, age: document.getElementById('age').value,
    sym: vals('sym'), known: vals('known'), fit: vals('fit'), last: g('last'),
    med: vals('med'), med2: vals('med2'), medfree: document.querySelector('[name=medfree]').value || '', supp: vals('supp'), suppfree: document.querySelector('[name=suppfree]').value || '',
    genuss: vals('genuss'), wish: vals('wish'), wishfree: document.querySelector('[name=wishfree]').value || ''
  };
}
const L = {};
FORM.forEach(sec => sec.groups.forEach(g => (g.opts || []).forEach(([v, l]) => { L[g.name + ':' + v] = l; })));
const lab = (g, v) => L[g + ':' + v] || v;

function table(list, s, r, opts = {}) {
  const rows = list.map(it => `<tr class="row-i"><td class="nm" data-l="Bereich">${esc(it.group === 'Gewünschte Zusatzwerte' ? 'Zusatz' : it.group)}</td><td class="nm" data-l="Analyse">${esc(it.name)}${it.flags.map(f => `<span class="flag">${esc(cap(f))}</span>`).join('')}${it.wishNote ? `<span class="flag">${esc(cap(it.wishNote))}</span>` : ''}</td>
  <td data-l="Warum">${esc(it.why.join('; '))}</td><td class="pr" data-l="Preis">${eur(it.cents)}</td><td data-l="Nüchtern">${it.fast ? 'ja' : 'nein'}</td><td data-l="Priorität"><span class="tag ${it.prio === 'A' ? 'a' : 'bb'}">${it.prio}</span></td></tr>`).join('');
  const sum = list.reduce((a, b) => a + b.cents, 0);
  return `<table><thead><tr><th>Bereich</th><th>Name aus der Preisliste</th><th>Warum</th><th class="pr">Preis</th><th>Nüchtern</th><th>Prio</th></tr></thead><tbody>${rows}
  <tr class="sum"><td colspan="3">Summe der Analysen</td><td class="pr">${eur(sum)}</td><td colspan="2"></td></tr>
  <tr class="sum"><td colspan="3">Blutentnahme, mindestens (standortabhängig ggf. höher)</td><td class="pr">${eur(BE)}</td><td colspan="2"></td></tr>
  <tr class="sum total"><td colspan="3">Gesamt, mindestens</td><td class="pr">${eur(sum + BE)}</td><td colspan="2"></td></tr></tbody></table>`;
}
function facts(list, label) {
  const groups = [...new Set(list.map(i => i.group === 'Gewünschte Zusatzwerte' ? 'Zusatz' : i.group))];
  const has = n => list.some(i => i.name === n);
  const miss = [];
  if (!has(N.TSH)) miss.push('Schilddrüse'); if (!has(N.FER)) miss.push('Eisenspeicher'); if (!list.some(i => i.group === 'Vitamine')) miss.push('Vitamine');
  if (!has(N.GLU) && !has(N.HBA)) miss.push('Blutzucker'); if (!list.some(i => i.group === 'Leber')) miss.push('Leber'); if (!has(N.KREA)) miss.push('Niere'); if (!has(N.LIP)) miss.push('Blutfette');
  const sum = list.reduce((a, b) => a + b.cents, 0);
  return `<p class="facts"><b>Kostet:</b> ${eur(sum)} Analysen, mindestens ${eur(sum + BE)} mit Blutentnahme. <b>Klärt:</b> ${esc(groups.join(', ') || 'nichts')}. <b>Ersetzt nicht:</b> ärztliche Untersuchung und Beratung${miss.length ? '; damit nicht geprüft: ' + esc(miss.join(', ')) : ''}.</p>`;
}

function kurz(s, r) {
  const rows = [];
  rows.push(['Ziel', s.goal.length ? s.goal.map(g => lab('goal', g)).join('; ') : 'nicht angegeben']);
  const meds = [...s.med, ...s.med2].map(m => lab(m === 'psy' || m === 'lithium' || m === 'horm' ? 'med2' : 'med', m)); if (s.medfree.trim()) meds.push(s.medfree.trim());
  if (meds.length) rows.push(['Medikamente', meds.join('; ')]);
  const su = s.supp.map(m => lab('supp', m)); if (s.suppfree.trim()) su.push(s.suppfree.trim());
  if (su.length) rows.push(['Supplements', su.join('; ')]);
  const tr = [...s.fit.map(f => lab('fit', f))]; if (s.last && s.last !== 'na') tr.push('letzte harte Einheit: ' + lab('last', s.last).toLowerCase());
  if (tr.length) rows.push(['Training', tr.join('; ')]);
  if (s.intake.length) rows.push(['Essen/Trinken', s.intake.map(i => lab('intake', i)).join('; ')]);
  if (s.genuss.length) rows.push(['Alkohol/Nikotin', s.genuss.map(i => lab('genuss', i)).join('; ')]);
  if (s.sleep && s.sleep !== 'na') rows.push(['Schlaf', lab('sleep', s.sleep)]);
  if (s.sym.includes('psyche')) rows.push(['Psyche', 'genannt, eröffnet kein eigenes Profil']);
  rows.push(['Nüchtern', s.fasting ? lab('fasting', s.fasting) : 'nicht angegeben, als unsicher behandelt']);
  rows.push(['Budget', (s.budget ? lab('budget', s.budget) : 'nicht angegeben, Standard bis etwa 120 € angenommen') + (r.limit !== Infinity ? '' : '')]);
  const out = [...r.excluded.map(e => e.name + ' (' + e.reason.split('.')[0] + ')'), ...r.deferred.map(e => e.name + ' (' + e.reason + ')')];
  if (out.length) rows.push(['Bleibt draußen', out.join('; ')]);
  return `<div class="kurz"><dl>${rows.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl></div>`;
}

function explain(list, s, r) {
  const fatigue = s.sym.includes('muede');
  const by = {};
  list.forEach(it => { const g = r.isWishOnly(it) ? 'Gewünschte Zusatzwerte' : it.group; (by[g] = by[g] || []).push(it); });
  const order = ['Stoffwechsel', 'Leber', 'Pankreas', 'Niere und Salze', 'Blutbild', 'Schilddrüse', 'Eisen', 'Vitamine', 'Muskel und Training', 'Hormone', 'Gewünschte Zusatzwerte'];
  return order.filter(g => by[g]).map(g => `<div class="grp"><h4>${esc(g)}</h4><ul>${by[g].map(it => `<li><b>${esc(it.name)}</b>${it.why.length ? ': ' + esc(it.why[0]) : ''}${it.why.length > 1 ? '; ' + esc(it.why.slice(1).join('; ')) : ''}${fatigue && FATIGUE_SENT[it.name] ? ' ' + esc(FATIGUE_SENT[it.name]) : ''}</li>`).join('')}</ul></div>`).join('');
}

function causes(list, s) {
  if (!s.sym.length || (s.sym.length === 1 && s.sym[0] === 'keine')) return null;
  const has = n => list.some(i => i.name === n);
  const c = [];
  const fatigueLike = s.sym.includes('muede') || s.sym.includes('kaelte');
  if (s.sleep === 'schlecht' && fatigueLike) c.push('Zu wenig oder sehr unruhiger Schlaf kann Erschöpfung verstärken. Das zeigen Blutwerte nicht, damit nicht geprüft.');
  if (s.intake.includes('wenigessen') && fatigueLike) c.push('Wenig gegessen kann Energie und Konzentration senken. Das zeigen Blutwerte nur begrenzt.');
  if (s.intake.includes('wenigtrinken') && (fatigueLike || s.sym.includes('magen') || s.sym.includes('kraempfe'))) c.push('Zu wenig getrunken: Flüssigkeitsmangel kann schlapp machen und Krämpfe begünstigen.' + (has(N.KREA) && has(N.NA) ? ' Kreatinin, Natrium und Kalium geben dazu einen Hinweis.' : ' Damit nicht geprüft.'));
  if (fatigueLike) {
    const g = [N.FER, N.B12, N.HOLO, N.FOL, N.D3].filter(has), ng = [N.FER, N.B12, N.FOL, N.D3].filter(n => !has(n) && !(n === N.B12 && has(N.HOLO)));
    c.push('Eisen, B12, Folsäure oder Vitamin D: ' + (g.length ? 'geprüft mit ' + g.join(', ') : 'nicht geprüft') + (ng.length && g.length ? '; damit nicht geprüft: ' + ng.join(', ') : '') + '.');
    c.push('Schilddrüse: ' + (has(N.TSH) ? 'mit Thyreotropin (TSH) geprüft.' : 'damit nicht geprüft.'));
    c.push('Blutzucker oder Blutarmut: ' + ([has(N.GLU) || has(N.HBA) ? 'Blutzucker geprüft' : 'Blutzucker nicht geprüft', has(N.BB) ? 'Blutarmut über Blutbild (groß) geprüft' : 'Blutarmut nicht geprüft'].join('; ')) + '.');
  }
  const mn = [...s.med, ...s.med2].filter(m => !['keines', 'psy', 'lithium', 'horm'].includes(m));
  if (mn.length && (s.sym.includes('magen') || fatigueLike || s.sym.includes('kraempfe'))) c.push('Flüssigkeitsverlust oder Nebenwirkung eines genannten Medikaments (' + mn.map(m => lab('med', m)).join('; ') + ') kommt als Richtung in Frage. Das lässt sich nur ärztlich einordnen.');
  if ((s.fit.includes('kreatin') || s.fit.includes('protein') || s.fit.includes('kraft') || has(N.CK)) && (has(N.KREA) || has(N.CK) || has(N.HS))) c.push('Training, Kreatin oder Proteinzufuhr können Kreatinin, Harnstoff, Creatinkinase oder GOT verschieben, ohne dass eine Krankheit vorliegt.');
  if (s.sym.includes('psyche') || s.sleep === 'schlecht') c.push('Psyche oder Schlaf sind eine durch diese Blutwerte nicht belegte Richtung und damit nicht geprüft.');
  return c.slice(0, 6);
}

function prep(list, s) {
  const has = n => list.some(i => i.name === n); const p = [];
  if (has(N.GLU) || has(N.LIP)) p.push('Nüchtern mindestens 8 Stunden, Wasser erlaubt (wegen Glucose (Nüchternblutzucker) und Lipidprofil).');
  if (has(N.CK)) p.push('Creatinkinase: Die letzte harte Einheit sollte möglichst etwa 72 Stunden zurückliegen.');
  if (has(N.TES)) p.push('Testosteron, gesamt: morgens abnehmen.');
  if (s.supp.includes('bk')) p.push('Ein B-Komplex kann Biotin enthalten, das Immuntests verfälschen kann, besonders TSH. Nicht eigenmächtig absetzen.');
  if (has(N.D3) || has(N.B12) || has(N.HOLO) || has(N.FER) || has(N.MG)) p.push('Vitamin D, B12, Eisen oder Magnesium nicht am Abnahmemorgen nachnehmen, wenn der Spiegel geprüft werden soll.');
  if (s.genuss.includes('alk')) p.push('Alkohol in den letzten 1 bis 2 Tagen kann Gamma-GT und Triglyceride anheben. Bei der Einordnung mitdenken.');
  if (s.genuss.includes('nik')) p.push('Nikotin kann Leukozyten im Blutbild und das CRP leicht anheben. Bei der Einordnung mitdenken.');
  const anyMed = [...s.med, ...s.med2].some(m => m !== 'keines');
  if (anyMed) p.push('Verordnete Medikamente' + (s.med2.includes('psy') || s.med2.includes('lithium') ? ', auch Psychopharmaka und Lithium,' : '') + ' nicht eigenmächtig weglassen.');
  return p;
}

/* ---------- Druckblock ---------- */
function wrap(text, w = 40) {
  const words = text.split(' '); const lines = []; let cur = '';
  words.forEach(wd => { const t = cur ? cur + ' ' + wd : wd; if (t.length <= w) cur = t; else { if (cur) lines.push(cur); cur = '  ' + wd; } });
  if (cur) lines.push(cur); return lines;
}
function printBlock(list, s, r) {
  const need = list.some(i => i.fast);
  const out = ['LABORAUFTRAG', 'Bioscientia Labor Mittelhessen', 'Datum: TT.MM.JJJJ', '', need ? 'NUECHTERN: ja, 8 Stunden, Wasser erlaubt' : 'NUECHTERN: nein', '', 'BESTELLEN'];
  list.forEach(i => out.push(...wrap(i.name)));
  if (s.nobest) {
    const has = n => list.some(i => i.name === n); const nb = [];
    if (has(N.LEB)) nb.push('GOT, GPT, Gamma-GT einzeln');
    if (has(N.LIP)) nb.push('Cholesterin, LDL, HDL, Triglyceride einzeln');
    if (has(N.B12)) nb.push(N.HOLO); else if (has(N.HOLO)) nb.push(N.B12);
    nb.push('Blutbild (klein)');
    if (has(N.FER)) nb.push('Transferrinsättigung (Transferrin und Eisen)');
    const lines = []; nb.forEach(x => lines.push(...wrap(x)));
    out.push('', 'NICHT BESTELLEN', ...lines.slice(0, 5));
  }
  const sum = list.reduce((a, b) => a + b.cents, 0);
  out.push('', 'SUMME ANALYSEN: ' + eurPlain(sum), 'BLUTENTNAHME: mind. ' + eurPlain(BE), 'GESAMT: ' + eurPlain(sum + BE));
  return out.join('\n');
}

function showResult() {
  const s = collect(); let r;
  try { r = run(s); } catch (e) { document.getElementById('oOut').innerHTML = '<div class="notes">Fehler bei der Auswertung: ' + esc(e.message) + '</div>'; show('oResultView'); return; }
  const o = [];
  o.push('<div class="must">Diese Bestellhilfe ist eine reine Kosten- und Analyseübersicht und ersetzt keine ärztliche Beratung.</div>');
  if (s.goal.length === 1 && s.goal[0] === 'preis') o.push('<p class="hint">Nur Preisvergleich: Die Liste ist ein Vergleich, noch keine Bestellung.</p>');
  o.push(kurz(s, r));
  o.push(`<h2>${r.optB ? 'Option A: Hauptliste' : 'Liste'}</h2>`);
  if (!r.main.length) o.push('<div class="notes">Für diese Angaben ergibt sich keine Analyse.</div>');
  else {
    o.push(`<div class="opt">${table(r.main, s, r)}${facts(r.main)}</div>`);
  }
  if (r.overA) o.push(`<div class="notes">Die für Ihre Angaben nötigen Werte überschreiten das gewählte Budget (${eur(r.sum)} bei einer Grenze von ${eur(r.limit)}). Sie sind trotzdem aufgeführt.</div>`);
  if (r.optB) o.push(`<div class="opt b"><h3>Option B: kürzere Liste</h3><p class="hint">${esc(cap(r.reasonsB.join('; ')))}.</p>${r.optB.length ? table(r.optB, s, r) + facts(r.optB) : '<p>Nach diesen Abzügen bleibt nichts übrig.</p>'}</div>`);
  o.push(textfeld(r, s));
  const ex = [...r.excluded.map(e => `${e.name}, ${eur(e.cents)}: ${e.reason}`), ...r.deferred.map(e => `${e.name}, ${eur(e.cents)}: ${e.reason}`)];
  if (ex.length) o.push(`<div class="notes"><b>Nicht in der Summe</b><ul>${ex.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`);
  if (r.notes.length) o.push(`<div class="notes"><b>Hinweise zur Liste</b><ul>${r.notes.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`);
  if (s.output !== 'tabelle') {
    if (r.main.length) o.push(`<h2>Wofür die Werte stehen</h2>${explain(r.main, s, r)}`);
    const c = causes(r.main, s);
    if (c && c.length) o.push(`<h2>Ursachenübersicht</h2><div class="plain"><p class="hint">Mögliche Richtungen, keine Diagnose.</p><ul>${c.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`);
    else if (c === null) o.push('<h2>Ursachenübersicht</h2><div class="plain"><p>Keine Beschwerden angegeben, daher keine Ursachenübersicht.</p></div>');
  }
  const p = prep(r.main, s);
  if (p.length) o.push(`<h2>Vorbereitung</h2><div class="plain"><ul>${p.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`);
  if (s.output === 'druck' && r.main.length) {
    const useB = s.fasting !== 'ja' && r.optB && r.optB.length;
    const pl = useB ? r.optB : r.main;
    const txt = printBlock(pl, s, r);
    o.push(`<h2>Druckblock</h2>${useB ? '<p class="hint">Ohne Nüchternheit oder bei frischem Training enthält der Druckblock Option B.</p>' : ''}<pre class="print" id="opb">${esc(txt)}</pre>
    <div class="resbar noprint"><button class="btn ghost" id="ocp">Kopieren</button><button class="btn ghost" id="odl">Als Textdatei speichern</button></div>`);
    window.__pb = txt;
  }
  document.getElementById('oOut').innerHTML = o.join('');
  const cp = document.getElementById('ocp'), dl = document.getElementById('odl');
  if (cp) cp.onclick = async () => { try { await navigator.clipboard.writeText(window.__pb); cp.textContent = 'Kopiert'; } catch { const r = document.createRange(); r.selectNodeContents(document.getElementById('opb')); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); cp.textContent = 'Text markiert, bitte kopieren'; } setTimeout(() => cp.textContent = 'Kopieren', 2500); };
  if (dl) dl.onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([window.__pb], { type: 'text/plain;charset=utf-8' })); a.download = 'laborauftrag.txt'; a.click(); };
  show('oResultView'); window.scrollTo(0, 0);
}


/* ---------- Textfeld-Liste (nur Namen, ohne Preis) ---------- */
function textfeld(r, s) {
  const blk = (list, title) => {
    const names = list.map(i => i.name);
    if (!names.length) return '';
    return `<div class="tfbox"><h4>${title}</h4>
      <p class="hint">Einzeilig, mit Semikolon getrennt:</p>
      <pre class="print tfline" data-tf="${esc(names.join('; '))}">${esc(names.join('; '))}</pre>
      <p class="hint">Oder je Analyse eine Zeile:</p>
      <pre class="print tflines" data-tf="${esc(names.join('\n'))}">${esc(names.join('\n'))}</pre>
      <div class="resbar noprint"><button type="button" class="btn ghost" data-tfcopy="line" data-names="${esc(names.join('; '))}">Einzeilig kopieren</button><button type="button" class="btn ghost" data-tfcopy="lines" data-names="${esc(names.join('\n'))}">Zeilen kopieren</button><button type="button" class="btn primary" data-tfapply="${esc(JSON.stringify(names))}">In Checkliste übernehmen</button></div></div>`;
  };
  const useB = r.optB && r.optB.length;
  return `<h2>Textfeld Laboranforderung</h2><div class="plain"><p class="hint">Nur die Namen wie auf der Preisliste, ohne Preis. Zum Einfügen in das Textfeld der Laboranforderung auf der Webseite des Labors.</p>${blk(r.main, useB ? 'Option A: Hauptliste' : 'Liste')}${useB ? blk(r.optB, 'Option B: kürzere Liste') : ''}</div>`;
}
document.getElementById('oOut').addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.tfcopy) {
    const txt = b.dataset.names, orig = b.textContent;
    try { await navigator.clipboard.writeText(txt); b.textContent = 'Kopiert'; }
    catch { const pre = b.closest('.tfbox').querySelector(b.dataset.tfcopy === 'line' ? '.tfline' : '.tflines'); const rg = document.createRange(); rg.selectNodeContents(pre); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(rg); b.textContent = 'Markiert, bitte kopieren'; }
    setTimeout(() => b.textContent = orig, 2500);
  }
  if (b.dataset.tfapply && window.LC) {
    const miss = window.LC.apply(JSON.parse(b.dataset.tfapply));
    b.textContent = miss.length ? 'Übernommen, nicht zuordenbar: ' + miss.join('; ') : 'Übernommen, siehe Checkliste';
  }
});

document.getElementById('opd').textContent = PRICE_DATE; document.getElementById('opd2').textContent = PRICE_DATE;
renderForm(); wireForm();

})();
