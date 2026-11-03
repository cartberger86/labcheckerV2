(function(){
"use strict";
var G = window.GROUPS, P = window.PARAMS, PLAN = window.PLAN;
var byId = {}; P.forEach(function(p){ byId[p.id] = p; });
var KEY = "laborcheck-nov2026-v1";

/* ---------- state ---------- */
var state = {};
function save(){}
state.tasks = state.tasks || {};
state.prep = state.prep || {};
state.vals = state.vals || {};
state.sex = state.sex || "F";
state.meds = state.meds || {};
if (!state.sel) { state.sel = {}; P.forEach(function(p){ state.sel[p.id] = !!p.on; }); }
var ui = { fastFilter: "all", valGroup: "all", prepShow: "sel", valView: "expl", resView: "eval" };

/* ---------- helpers ---------- */
var PRICES = {};
String(window.RAW_LIST || "").split("\n").forEach(function(l){ var a = l.split("|"); if (a.length === 2) PRICES[a[0]] = parseFloat(a[1]); });
function eur(n){ return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; }
var LEB = "Leberwerte (GOT, GPT, gamma-GT)", LIPID = byId.tg.lab[0], CHOL = "Cholesterin, gesamt";
function labList(){
  var names = [], sel = state.sel;
  var liver = sel.got && sel.gpt && sel.ggt;
  P.forEach(function(p){
    if (!sel[p.id] || !p.lab) return;
    if (liver && (p.id === "got" || p.id === "gpt" || p.id === "ggt")) { if (p.id === "got") names.push(LEB); return; }
    if (p.id === "chol" && sel.tg) return;
    if (p.id === "holotc" && sel.b12) return;
    p.lab.forEach(function(n){ if (names.indexOf(n) < 0) names.push(n); });
  });
  return names;
}
window.LC = {
  list: labList,
  apply: function(names){
    var missing = [], hit = {};
    names.forEach(function(n){
      if (n === LEB) { hit.got = hit.gpt = hit.ggt = 1; return; }
      var found = P.filter(function(p){ return p.lab && p.lab.indexOf(n) > -1; });
      if (!found.length) { missing.push(n); return; }
      found.forEach(function(p){ hit[p.id] = 1; });
    });
    P.forEach(function(p){ state.sel[p.id] = !!hit[p.id]; });
    renderCheck(); renderPrepMatrix(); updateStats();
    return missing;
  }
};
function $(s, r){ return (r||document).querySelector(s); }
function $$(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function fastBadge(f){ var m = window.FASTING[f]; return '<span class="badge '+m.cls+'">'+m.label+'</span>'; }
function selected(){ return P.filter(function(p){ return state.sel[p.id]; }); }
function allTasks(){ var a=[]; PLAN.forEach(function(ph){ ph.tasks.forEach(function(t){ a.push(t); }); }); return a; }
function dateOf(a){ return new Date(a[0], a[1]-1, a[2]); }

/* ---------- header stats ---------- */
function updateStats(){
  var tasks = allTasks(), done = tasks.filter(function(t){ return state.tasks[t.id]; }).length;
  $("#statTasks").textContent = done + "/" + tasks.length;
  var sel = selected();
  $("#statParams").textContent = sel.length;
  $("#statFast").textContent = sel.filter(function(p){ return p.fasting === "must"; }).length;
}

/* ---------- tabs ---------- */
function showTab(name){
  $$(".tabs button").forEach(function(b){ b.setAttribute("aria-selected", String(b.dataset.tab === name)); });
  $$(".panel").forEach(function(p){ p.hidden = p.id !== "tab-" + name; });
  var sel = $('.tabs button[aria-selected="true"]'); if (sel && sel.scrollIntoView) sel.scrollIntoView({ inline: "center", block: "nearest" });
  window.scrollTo(0, 0);
}
document.addEventListener("click", function(e){ var g = e.target.closest("[data-goto]"); if (g) { e.preventDefault(); showTab(g.dataset.goto); } });
$(".tabs").addEventListener("click", function(e){
  var b = e.target.closest("button[data-tab]"); if (b) showTab(b.dataset.tab);
});

/* ---------- PLAN ---------- */
function phaseCurrent(ph){
  var now = new Date(); now.setHours(12,0,0,0);
  return now >= dateOf(ph.from) && now <= new Date(ph.to[0], ph.to[1]-1, ph.to[2], 23, 59);
}
function renderPlan(){
  var tasks = allTasks(), done = tasks.filter(function(t){ return state.tasks[t.id]; }).length;
  var pct = Math.round(done / tasks.length * 100);
  var h = '';
  h += '<div><h2>Vorgehensplan für November</h2><p class="lead">Vier Schritte von der Vorbereitung bis zu den Kontrollterminen. </p></div>';
  h += '<details class="warnbox" open><summary>Warnzeichen: nicht auf den Laborplan warten</summary><ul>' + window.WARN.map(function(w){ return '<li>'+esc(w)+'</li>'; }).join('') + '</ul></details>';
  h += '<div class="card"><div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:8px;font-size:var(--text-sm)"><strong>Gesamtfortschritt</strong><span id="planPct">'+done+' von '+tasks.length+' Aufgaben ('+pct+' %)</span></div><div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'" id="planBar"><i style="width:'+pct+'%"></i></div></div>';
  h += '<div class="timeline">';
  PLAN.forEach(function(ph){
    var d = ph.tasks.filter(function(t){ return state.tasks[t.id]; }).length;
    var cls = 'phase' + (d === ph.tasks.length ? ' done' : '') + (phaseCurrent(ph) ? ' current' : '');
    h += '<article class="'+cls+'" data-phase="'+ph.id+'"><div class="phase-no" aria-hidden="true">'+ph.no+'</div><div class="card">';
    h += '<div class="phase-head"><h3>'+esc(ph.title)+(phaseCurrent(ph)?' <span class="now">aktuell</span>':'')+'</h3><span class="phase-range">'+ph.range+' · <span class="pcount">'+d+'/'+ph.tasks.length+'</span></span></div>';
    h += '<p class="goal">'+esc(ph.goal)+'</p><ul class="tasks">';
    ph.tasks.forEach(function(t){
      h += '<li class="task'+(state.tasks[t.id]?' done':'')+'"><input type="checkbox" id="'+t.id+'" data-task="'+t.id+'"'+(state.tasks[t.id]?' checked':'')+'><div><label for="'+t.id+'">'+esc(t.text)+'</label>';
      if (t.detail) h += '<details><summary>Warum?</summary><p>'+esc(t.detail)+'</p></details>';
      h += '</div></li>';
    });
    h += '</ul></div></article>';
  });
  h += '</div>';
  $("#tab-plan").innerHTML = h;
}
$("#tab-plan").addEventListener("change", function(e){
  var id = e.target.dataset.task; if (!id) return;
  state.tasks[id] = e.target.checked; save();
  e.target.closest(".task").classList.toggle("done", e.target.checked);
  var tasks = allTasks(), done = tasks.filter(function(t){ return state.tasks[t.id]; }).length, pct = Math.round(done/tasks.length*100);
  $("#planPct").textContent = done + " von " + tasks.length + " Aufgaben (" + pct + " %)";
  $("#planBar > i").style.width = pct + "%"; $("#planBar").setAttribute("aria-valuenow", pct);
  PLAN.forEach(function(ph){
    var d = ph.tasks.filter(function(t){ return state.tasks[t.id]; }).length;
    var el = $('[data-phase="'+ph.id+'"]');
    el.classList.toggle("done", d === ph.tasks.length);
    $(".pcount", el).textContent = d + "/" + ph.tasks.length;
  });
  updateStats();
});

/* ---------- CHECKLIST ---------- */
function fastVerdict(){
  var sel = selected(), must = sel.filter(function(p){ return p.fasting === "must"; }), rec = sel.filter(function(p){ return p.fasting === "rec"; });
  if (!sel.length) return { t: "Keine Werte gewählt.", cls: "neutral" };
  if (must.length) return { t: "Nüchtern: ja, 8 bis 12 Stunden. Erforderlich wegen " + must.map(function(p){ return p.name; }).join(", ") + ".", cls: "must" };
  if (rec.length) return { t: "Nüchtern: empfohlen, 8 bis 12 Stunden, für vergleichbare Leber- und Pankreaswerte.", cls: "rec" };
  return { t: "Nüchtern: nicht nötig.", cls: "no" };
}
function tubes(){
  var t = {}; selected().forEach(function(p){ p.tube.split(/,|\//).forEach(function(x){ t[x.trim()] = 1; }); });
  return Object.keys(t).filter(Boolean);
}
function exportText(){
  var d = new Date(), ds = d.toLocaleDateString("de-DE");
  var L = ["Laborwunschliste bei chronischer Müdigkeit (Stand " + ds + ")", "Fragestellung: chronische Erschöpfung, Basisabklärung", ""];
  G.forEach(function(g){
    var s = P.filter(function(p){ return p.group === g.id && state.sel[p.id]; });
    if (s.length) L.push(g.name + ": " + s.map(function(p){ return p.name; }).join(", "));
  });
  L.push(""); L.push("Textfeld Laboranforderung (Namen wie auf der Preisliste):"); L.push(labList().join("; "));
  L.push(""); L.push(fastVerdict().t);
  L.push("Eingenommene Präparate/Medikamente bitte ergänzen: ______________________");
  return L.join("\n");
}
function renderCheck(){
  var h = '<div><h2>Checkliste Blutentnahme</h2><p class="lead">Die Standardauswahl entspricht Ihrer Wunschliste. Optionale Ergänzungen sind in der letzten Gruppe zuschaltbar. Die Liste können Sie kopieren oder als Textdatei mitnehmen.</p></div>';
  h += '<div class="toolbar"><div class="chips" role="group" aria-label="Filter nüchtern">';
  [["all","Alle"],["fast","nüchtern nötig/empfohlen"],["nofast","nüchtern egal"]].forEach(function(f){
    h += '<button class="chip" data-ff="'+f[0]+'" aria-pressed="'+(ui.fastFilter===f[0])+'">'+f[1]+'</button>';
  });
  h += '</div><span class="grow"></span><button class="btn" id="btnReset">Standardauswahl</button><button class="btn" id="btnNone">Alle abwählen</button></div>';
  G.forEach(function(g){
    var list = P.filter(function(p){ return p.group === g.id; });
    var vis = list.filter(function(p){ return ui.fastFilter === "all" || (ui.fastFilter === "fast" ? p.fasting !== "no" : p.fasting === "no"); });
    if (!vis.length) return;
    h += '<section class="card group" data-g="'+g.id+'"><div class="group-head"><div><h3>'+g.name+'</h3><p>'+g.why+'</p></div><span class="badge neutral gcount"></span></div><ul class="rows">';
    vis.forEach(function(p){
      h += '<li class="row"><input type="checkbox" id="c_'+p.id+'" data-sel="'+p.id+'"'+(state.sel[p.id]?' checked':'')+'><label for="c_'+p.id+'"><span class="nm">'+esc(p.name)+'</span><span class="sub">'+esc(p.alt ? p.alt+' · ' : '')+esc(p.ref)+'</span></label><div class="tags"><span class="tube">'+esc(p.tube)+'</span>'+fastBadge(p.fasting)+'</div></li>';
    });
    h += '</ul></section>';
  });
  h += '<section class="card summary" id="chkSummary"></section>';
  h += '<div class="exportbox"><div class="toolbar"><button class="btn primary" id="btnCopy">Liste kopieren</button><button class="btn" id="btnDl">Als Textdatei laden</button><span class="note" id="expMsg"></span></div><textarea id="expText" hidden readonly aria-label="Laborwunschliste"></textarea></div>';
  $("#tab-check").innerHTML = h;
  updateCheckSummary();
}
function updateCheckSummary(){
  $$("#tab-check .group").forEach(function(sec){
    var gid = sec.dataset.g, list = P.filter(function(p){ return p.group === gid; });
    $(".gcount", sec).textContent = list.filter(function(p){ return state.sel[p.id]; }).length + " von " + list.length + " gewählt";
  });
  var v = fastVerdict(), tb = tubes();
  $("#chkSummary").innerHTML = '<h3>Zusammenfassung Ihrer Auswahl</h3><div><span class="badge '+v.cls+'">'+v.t+'</span></div><p class="note">Typische Probenröhrchen (praxisabhängig): ' + (tb.length ? esc(tb.join(", ")) : 'keine') + '. Die Praxis entscheidet über Röhrchen und Menge.</p><p class="note">Hinweis zu Kosten: Vitamin D, Holotranscobalamin und optionale Ergänzungen sind ohne konkrete Indikation häufig Selbstzahlerleistungen. Bitte vorher in der Praxis nachfragen.</p>';
  var ln = labList();
  $("#chkSummary").innerHTML += '<div class="labbox"><h3>Textfeld Laboranforderung</h3><p class="note">Nur die Namen, wie auf der Preisliste, ohne Preis.</p><pre id="labLine">'+esc(ln.join("; ") || "keine Auswahl")+'</pre><div class="toolbar"><button class="btn" data-labcopy="line">Einzeilig kopieren</button><button class="btn" data-labcopy="lines">Zeilen kopieren</button><span class="note" id="labMsg"></span></div></div>';
  updateStats(); renderPrepMatrix();
}
$("#tab-check").addEventListener("change", function(e){
  var id = e.target.dataset.sel; if (!id) return;
  state.sel[id] = e.target.checked; save(); updateCheckSummary();
});
$("#tab-check").addEventListener("click", function(e){
  var t = e.target.closest("button"); if (!t) return;
  if (t.dataset.labcopy) {
    var ln = labList(), txt = t.dataset.labcopy === "line" ? ln.join("; ") : ln.join("\n");
    try { navigator.clipboard.writeText(txt).then(function(){ $("#labMsg").textContent = "Kopiert."; }, function(){ $("#labMsg").textContent = "Kopieren nicht möglich, Text markieren."; }); } catch(err){ $("#labMsg").textContent = "Kopieren nicht möglich, Text markieren."; }
    return;
  }
  if (t.dataset.ff) { ui.fastFilter = t.dataset.ff; renderCheck(); return; }
  if (t.id === "btnReset") { P.forEach(function(p){ state.sel[p.id] = !!p.on; }); save(); renderCheck(); renderPrepMatrix(); return; }
  if (t.id === "btnNone") { P.forEach(function(p){ state.sel[p.id] = false; }); save(); renderCheck(); return; }
  if (t.id === "btnCopy") {
    var txt = exportText(), ta = $("#expText"), msg = $("#expMsg");
    ta.value = txt; ta.hidden = false;
    var done = function(ok){ msg.textContent = ok ? "In die Zwischenablage kopiert." : "Automatisches Kopieren nicht möglich. Text unten markieren und manuell kopieren."; if (!ok) { ta.focus(); ta.select(); } };
    try { navigator.clipboard.writeText(txt).then(function(){ done(true); }, function(){ done(false); }); } catch(err){ done(false); }
    return;
  }
  if (t.id === "btnDl") {
    var blob = new Blob([exportText()], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "Laborwunschliste.txt";
    document.body.appendChild(a); a.click(); a.remove();
    $("#expMsg").textContent = "Datei wird geladen.";
    var ta2 = $("#expText"); ta2.value = exportText(); ta2.hidden = false;
  }
});

/* ---------- VALUES ---------- */
function renderValues(){
  var expl = ui.valView === "expl";
  var h = '<div><h2>Erklärungen</h2><p class="lead">'+(expl ? 'Was jeder Parameter misst, warum er bei Erschöpfung wichtig ist und was Abweichungen häufig bedeuten. Referenzbereiche sind Orientierungswerte.' : 'Wann ein Wert sinnvoll ist, was ihn verschiebt und was nicht doppelt bestellt werden sollte. Mit exaktem Namen und Preis aus der Preisliste von Bioscientia Labor Mittelhessen (Stand '+esc(window.PRICE_DATE||"")+'). Keine Diagnose, keine Therapieempfehlung.')+'</p></div>';
  h += '<div class="subtabs" role="group" aria-label="Ansicht"><button data-vv="expl" aria-pressed="'+expl+'">Erklärung</button><button data-vv="eval" aria-pressed="'+!expl+'">Parameterauswertung</button></div>';
  h += '<div class="chips" role="group" aria-label="Indikation">';
  h += '<button class="chip" data-vg="all" aria-pressed="'+(ui.valGroup==="all")+'">Alle</button>';
  G.forEach(function(g){ h += '<button class="chip" data-vg="'+g.id+'" aria-pressed="'+(ui.valGroup===g.id)+'">'+g.short+'</button>'; });
  h += '</div><div class="acc">';
  P.forEach(function(p){
    if (ui.valGroup !== "all" && p.group !== ui.valGroup) return;
    var g = G.filter(function(x){ return x.id === p.group; })[0];
    h += '<details id="v_'+p.id+'"><summary><span class="sum-l"><strong>'+esc(p.name)+'</strong><small>'+g.short+'</small></span>'+fastBadge(p.fasting)+'</summary><div class="detail">';
    h += '<div class="refline"><span class="badge neutral">Referenz: '+esc(p.ref)+'</span></div><dl>';
    var sc = (window.SCREEN || {})[p.id];
    if (!expl) {
      var pr = (p.lab || []).map(function(n){ return esc(n) + (PRICES[n] != null ? ' · ' + eur(PRICES[n]) : ' · nicht auf der Preisliste'); }).join('<br>');
      if (sc) {
        h += '<div><dt>Wann sinnvoll (in die Bestellung)</dt><dd>'+esc(sc.when)+'</dd></div><div><dt>Was den Wert verschiebt</dt><dd>'+esc(sc.ctx)+'</dd></div>';
        if (sc.dup) h += '<div><dt>Nicht doppelt bestellen</dt><dd>'+esc(sc.dup)+'</dd></div>';
      }
      var fw = FASTWHY[p.id] || (p.fasting === "no" ? "Mahlzeiten haben keinen relevanten Einfluss." : "Nüchtern abnehmen, damit die Werte vergleichbar sind.");
      h += '<div><dt>Essen und Fasten vor der Abnahme</dt><dd>'+window.FASTING[p.fasting].label+'. '+esc(fw)+'</dd></div>';
      h += '<div><dt>Name auf der Preisliste</dt><dd>'+(pr || 'nicht zugeordnet')+'</dd></div></dl></div></details>';
      return;
    }
    h += '<div><dt>Bedeutung bei Erschöpfung</dt><dd>'+esc(p.meaning)+'</dd></div>';
    if (p.high) h += '<div class="two"><div><dt>Erhöht, häufige Ursachen</dt><dd>'+esc(p.high)+'</dd></div><div><dt>Erniedrigt, häufige Ursachen</dt><dd>'+esc(p.low)+'</dd></div></div>';
    if (p.tip) h += '<div><dt>Gut zu wissen</dt><dd>'+esc(p.tip)+'</dd></div>';
    if (p.step) h += '<div><dt>Mögliche nächste Schritte</dt><dd>'+esc(p.step)+'</dd></div>';
    h += '</dl></div></details>';
  });
  h += '</div>';
  $("#tab-values").innerHTML = h;
}
$("#tab-values").addEventListener("click", function(e){
  var v = e.target.closest("button[data-vv]");
  if (v) { ui.valView = v.dataset.vv; renderValues(); return; }
  var b = e.target.closest("button[data-vg]"); if (!b) return;
  ui.valGroup = b.dataset.vg; renderValues();
});

/* ---------- PREP ---------- */
var FASTWHY = {
  glu: "Jede Mahlzeit hebt den Blutzucker. Nur der Nüchternwert ist Diagnosegrundlage.",
  tg: "Triglyzeride steigen nach dem Essen stark an.",
  tsat: "Serumeisen schwankt nach Mahlzeiten und Eisenpräparaten stark. Morgens abnehmen.",
  got: "Mahlzeiten können Leberenzyme leicht verändern. Nüchtern sind Werte besser vergleichbar.",
  gpt: "Mahlzeiten können Leberenzyme leicht verändern. Nüchtern sind Werte besser vergleichbar.",
  ggt: "Fettreiche Mahlzeiten und Alkohol heben die GGT. Nüchtern vergleichbarer.",
  bili: "Essen und langes Fasten verschieben den Wert leicht (Gilbert). Standardisiert nüchtern, nicht länger als 12 bis 14 Stunden.",
  lipase: "Eine fettreiche Mahlzeit kann Pankreasenzyme im Blut anheben.",
  amylase: "Mahlzeiten können den Wert leicht verändern. Nüchtern standardisiert.",
  chol: "Gesamtcholesterin ist kaum mahlzeitenabhängig. In der Praxis meist zusammen mit Triglyzeriden nüchtern.",
  krea: "Gekochtes Fleisch lässt Kreatinin kurzzeitig ansteigen.",
  folat: "Eine Mahlzeit kann den Spiegel leicht anheben.",
  cortisol: "Morgenwert um 8 Uhr nach Tagesrhythmus, ohne vorherigen Stress.",
  tsh: "Kaum mahlzeitenabhängig, aber tageszeitabhängig. Immer morgens abnehmen. Schilddrüsentablette erst danach.",
  b12: "Mahlzeit ohne relevanten Einfluss. Präparate erst nach der Abnahme einnehmen.",
  holotc: "Mahlzeit ohne relevanten Einfluss. Präparate erst nach der Abnahme einnehmen.",
  vitd: "Fettlöslich, unabhängig von der letzten Mahlzeit.",
  hba1c: "Langzeitwert über 8 bis 12 Wochen, daher unabhängig von der letzten Mahlzeit.",
  ferritin: "Speicherprotein ohne nennenswerte Mahlzeitenabhängigkeit. Kein Infekt in den letzten 2 Wochen.",
  crp: "Mahlzeitenunabhängig. Kein Infekt und kein intensives Training in den 48 Stunden davor."
};
function renderPrep(){
  var h = '<div><h2>Nüchtern und Vorbereitung</h2><p class="lead">Was zählt, ist die Auswahl aus der Checkliste. Wenn auch nur ein Wert nüchtern erfordert, kommen Sie am besten insgesamt nüchtern.</p></div>';
  h += '<div class="card" id="prepVerdict"></div>';
  h += '<div class="toolbar"><div class="chips" role="group" aria-label="Anzeige"><button class="chip" data-ps="sel" aria-pressed="'+(ui.prepShow==="sel")+'">Nur gewählte Werte</button><button class="chip" data-ps="all" aria-pressed="'+(ui.prepShow==="all")+'">Alle Werte</button></div></div>';
  h += '<div class="tablewrap"><table><thead><tr><th>Wert</th><th>Nüchtern</th><th>Warum</th></tr></thead><tbody id="prepRows"></tbody></table></div>';
  h += '<div class="legend"><span>' + fastBadge("must") + ' zwingend</span><span>' + fastBadge("rec") + ' erleichtert Vergleichbarkeit</span><span>' + fastBadge("no") + ' kein Einfluss</span></div>';
  h += '<div><h2>Vorbereitung Schritt für Schritt</h2></div><div class="card"><div class="prepgrid">';
  window.PREP.forEach(function(s, si){
    h += '<div><h3>'+esc(s.when)+'</h3><ul>';
    s.items.forEach(function(it, ii){
      var id = "pp"+si+"_"+ii;
      h += '<li class="'+(state.prep[id]?'done':'')+'"><input type="checkbox" id="'+id+'" data-prep="'+id+'"'+(state.prep[id]?' checked':'')+'><span><label for="'+id+'" style="cursor:pointer">'+esc(it)+'</label></span></li>';
    });
    h += '</ul></div>';
  });
  h += '</div></div>';
  h += '<div><h2>Medikamente und Präparate</h2><p class="lead">Wählen Sie aus, was Sie einnehmen, und erhalten Sie den passenden Hinweis. Nichts ohne Rücksprache mit der Praxis absetzen.</p></div>';
  h += '<div class="chips" role="group" aria-label="Präparate">' + window.MEDS.map(function(m){ return '<button class="chip" data-med="'+m.id+'" aria-pressed="'+(!!state.meds[m.id])+'">'+esc(m.name)+'</button>'; }).join('') + '</div>';
  h += '<div id="medAdvice" class="advice"></div>';
  $("#tab-prep").innerHTML = h;
  renderPrepMatrix(); renderMedAdvice();
}
function renderPrepMatrix(){
  var vEl = $("#prepVerdict"); if (!vEl) return;
  var v = fastVerdict();
  vEl.innerHTML = '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span class="badge '+v.cls+'" style="font-size:var(--text-sm);padding:2px 10px">'+(v.cls==="must"?"Nüchtern: ja":v.cls==="rec"?"Nüchtern: empfohlen":v.cls==="no"?"Nüchtern: nein":"Keine Auswahl")+'</span><span style="font-size:var(--text-sm)">'+esc(v.t)+'</span></div><p class="note" style="margin-top:8px">Nüchtern heißt: 8 bis 12 Stunden keine Kalorien. Wasser und ungesüßter Tee sind erlaubt. Termin zwischen 7 und 9 Uhr.</p>';
  var order = { must: 0, rec: 1, no: 2 };
  var rows = P.filter(function(p){ return ui.prepShow === "all" || state.sel[p.id]; }).sort(function(a, b){ return order[a.fasting] - order[b.fasting]; });
  $("#prepRows").innerHTML = rows.length ? rows.map(function(p){
    return '<tr><td><strong>'+esc(p.name)+'</strong></td><td>'+fastBadge(p.fasting)+'</td><td>'+esc(FASTWHY[p.id] || "Mahlzeiten haben keinen relevanten Einfluss.")+'</td></tr>';
  }).join('') : '<tr><td colspan="3">Keine Werte gewählt.</td></tr>';
}
function renderMedAdvice(){
  var on = window.MEDS.filter(function(m){ return state.meds[m.id]; });
  $("#medAdvice").innerHTML = on.length ? on.map(function(m){ return '<div><strong>'+esc(m.name)+'</strong>'+esc(m.advice)+'</div>'; }).join('') : '<span class="empty">Noch nichts ausgewählt.</span>';
}
$("#tab-prep").addEventListener("click", function(e){
  var b = e.target.closest("button"); if (!b) return;
  if (b.dataset.ps) { ui.prepShow = b.dataset.ps; $$("[data-ps]").forEach(function(x){ x.setAttribute("aria-pressed", String(x.dataset.ps === ui.prepShow)); }); renderPrepMatrix(); }
  if (b.dataset.med) { state.meds[b.dataset.med] = !state.meds[b.dataset.med]; save(); b.setAttribute("aria-pressed", String(!!state.meds[b.dataset.med])); renderMedAdvice(); }
});
$("#tab-prep").addEventListener("change", function(e){
  var id = e.target.dataset.prep; if (!id) return;
  state.prep[id] = e.target.checked; save(); e.target.closest("li").classList.toggle("done", e.target.checked);
});

/* ---------- CAUSES ---------- */
function renderCauses(){
  var h = '<div><h2>Typische Ursachen im Überblick</h2><p class="lead">Welche Laborbefunde auf welche Ursachen hinweisen. Ein Klick auf einen Wert springt zur Erklärung.</p></div><div class="acc">';
  window.CAUSES.forEach(function(c){
    h += '<details><summary><span class="sum-l"><strong>'+esc(c.name)+'</strong><small>Häufigkeit: '+esc(c.freq)+'</small></span></summary><div class="detail"><div class="pill-row">';
    c.labs.forEach(function(id){ h += '<button class="lablink" data-jump="'+id+'">'+esc(byId[id].name)+'</button>'; });
    h += '</div><dl><div><dt>Typisches Labormuster</dt><dd>'+esc(c.pattern)+'</dd></div><div><dt>Hintergrund und weitere Abklärung</dt><dd>'+esc(c.prep)+'</dd></div></dl></div></details>';
  });
  h += '</div>';
  h += '<section class="card"><h3>Wenn das Labor unauffällig ist</h3><p class="lead" style="margin-block:6px 12px">Bei chronischer Müdigkeit sind die Basiswerte oft normal. Dann rücken diese Ursachen in den Vordergrund:</p><ul class="list">' + window.NORMAL_CAUSES.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('') + '</ul></section>';
  h += '<section class="card"><h3>Fragen für das Gespräch</h3><ul class="list" style="margin-top:10px">' + window.QUESTIONS.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('') + '</ul></section>';
  $("#tab-causes").innerHTML = h;
}
$("#tab-causes").addEventListener("click", function(e){
  var b = e.target.closest("[data-jump]"); if (!b) return;
  ui.valGroup = "all"; renderValues(); showTab("values");
  var d = $("#v_" + b.dataset.jump); if (d) { d.open = true; setTimeout(function(){ d.scrollIntoView({ block: "center" }); }, 30); }
});

/* ---------- RESULT ---------- */
function bandsFor(p){ var b = p.bands; return b.all || b[state.sex]; }
function evalVal(p, v){
  var b = bandsFor(p);
  for (var i = 0; i < b.length; i++) {
    var x = b[i];
    if (x.lt !== undefined ? v < x.lt : v <= x.le) return { l: x.l, t: x.t };
  }
  return null;
}
function parseNum(s){ if (s == null) return NaN; var n = parseFloat(String(s).replace(",", ".")); return isFinite(n) ? n : NaN; }
function renderContext(){
  var h = '<div class="ctxlist">';
  (window.CONTEXT || []).forEach(function(c){ h += '<div class="card"><h3>'+esc(c.t)+'</h3><p class="vals">Betrifft: '+esc(c.v)+'</p><p>'+esc(c.x)+'</p></div>'; });
  return h + '</div><p class="note">Keine Diagnose, keine Therapieempfehlung, keine Dosis. Medikamente nie eigenmächtig absetzen.</p>';
}
function resSubtabs(){ return '<div class="subtabs" role="group" aria-label="Ansicht"><button data-rv="eval" aria-pressed="'+(ui.resView==="eval")+'">Einordnung</button><button data-rv="ctx" aria-pressed="'+(ui.resView==="ctx")+'">Kontextfaktoren</button></div>'; }
function renderResult(){
  if (ui.resView === "ctx") { $("#tab-result").innerHTML = '<div><h2>Befund-Check: Kontextfaktoren</h2><p class="lead">Was Werte verschiebt, ohne dass eine Erkrankung vorliegt, und welche Werte dadurch relevant werden.</p></div>' + resSubtabs() + renderContext(); return; }
  var h = '<div><h2>Befund-Check</h2><p class="lead">Tragen Sie Ihre Werte mit den im Feld genannten Einheiten ein. Die Einordnung nutzt die Orientierungsbereiche dieser Seite und ersetzt nicht den Referenzbereich Ihres Labors.</p></div>';
  h += resSubtabs();
  h += '<div class="toolbar"><span style="font-size:var(--text-sm)">Geschlecht und Referenz:</span><div class="seg" role="group" aria-label="Geschlecht"><button data-sex="F" aria-pressed="'+(state.sex==="F")+'">Frau</button><button data-sex="M" aria-pressed="'+(state.sex==="M")+'">Mann</button></div><span class="grow"></span><button class="btn" id="btnClearVals">Eingaben löschen</button></div>';
  h += '<div class="formgrid">';
  P.filter(function(p){ return p.bands; }).forEach(function(p){
    h += '<div class="field" data-f="'+p.id+'"><label for="r_'+p.id+'"><span class="nm">'+esc(p.name)+'</span><br><span class="un">'+esc(p.unit)+'</span></label><input id="r_'+p.id+'" data-val="'+p.id+'" inputmode="decimal" autocomplete="off" value="'+(state.vals[p.id]!=null?esc(state.vals[p.id]):'')+'"><div class="res"></div></div>';
  });
  h += '</div><section class="card summary" id="resSummary" aria-live="polite"></section>';
  $("#tab-result").innerHTML = h;
  updateResult();
}
function levelLabel(l){ return l === "ok" ? "unauffällig" : l === "warn" ? "Hinweis" : "auffällig"; }
function updateResult(){
  var vals = {}, lv = {}, entered = 0, off = 0;
  P.filter(function(p){ return p.bands; }).forEach(function(p){
    var f = $('[data-f="'+p.id+'"]'), n = parseNum(state.vals[p.id]), res = $(".res", f);
    f.classList.remove("ok", "warn", "alert");
    if (isNaN(n) || n < 0) { res.innerHTML = ""; return; }
    var r = evalVal(p, n); vals[p.id] = n; lv[p.id] = r; entered++;
    if (r.l !== "ok") off++;
    f.classList.add(r.l);
    res.innerHTML = '<span class="badge '+r.l+'">'+levelLabel(r.l)+'</span> '+esc(r.t);
  });
  var S = $("#resSummary");
  if (!entered) { S.innerHTML = '<h3>Einordnung</h3><p class="empty">Noch keine Werte eingetragen.</p>'; return; }
  var m = [];
  var is = function(id, l){ return lv[id] && lv[id].l === l; };
  var bad = function(id){ return lv[id] && lv[id].l !== "ok"; };
  // Eisen
  if (vals.ferritin != null) {
    if (vals.ferritin < 30) m.push(["alert", "Ferritin " + vals.ferritin + " µg/l: Eisenmangel wahrscheinlich. Mit Blutbild und Transferrinsättigung besprechen und die Ursache klären (Blutverlust, Ernährung, Aufnahme)."]);
    else if (vals.crp != null && vals.crp >= 5 && vals.ferritin <= 100) m.push(["warn", "Ferritin " + vals.ferritin + " µg/l bei erhöhtem CRP: Ein Eisenmangel ist nicht ausgeschlossen, weil Ferritin bei Entzündung ansteigt. Transferrinsättigung ergänzen."]);
    else if (vals.ferritin <= 100) m.push(["warn", "Ferritin im Graubereich (30 bis 100 µg/l): Bei passender Symptomatik Transferrinsättigung und Blutbild ergänzen."]);
  }
  // B12
  if (vals.holotc != null) {
    if (vals.holotc < 35) m.push(["alert", "HoloTC " + vals.holotc + " pmol/l: B12-Mangel wahrscheinlich. Ursache klären (Ernährung, Magen, Medikamente) und Behandlung ärztlich festlegen."]);
    else if (vals.holotc <= 50) m.push(["warn", "HoloTC im Graubereich: Methylmalonsäure (MMA) zur Klärung ergänzen."]);
    else if (vals.b12 != null && bad("b12")) m.push(["ok", "Gesamt-B12 niedrig oder grenzwertig, aber HoloTC unauffällig: Ein B12-Mangel ist dadurch unwahrscheinlich."]);
  } else if (vals.b12 != null && bad("b12")) {
    m.push(["warn", "Gesamt-B12 " + (is("b12","alert") ? "niedrig" : "im Graubereich") + ": Holotranscobalamin (und ggf. MMA) zur Absicherung bestimmen lassen."]);
  }
  // Schilddrüse
  if (bad("tsh")) m.push([lv.tsh.l, "TSH " + vals.tsh + " mIU/l " + lv.tsh.t + ": fT4 (ggf. fT3) und TPO-Antikörper ergänzen. Biotin als Störfaktor ausschließen."]);
  if (vals.chol != null && vals.chol >= 240 && vals.tsh != null && vals.tsh > 4) m.push(["warn", "Cholesterin und TSH erhöht: Eine Schilddrüsenunterfunktion kann den Cholesterinwert mit erhöhen. Vor einer Cholesterinbehandlung Schilddrüse klären."]);
  // Zucker
  if ((vals.glu != null && vals.glu >= 126) || (vals.hba1c != null && vals.hba1c >= 6.5)) m.push(["alert", "Zuckerwerte im diabetischen Bereich: Bestätigung durch Wiederholung und ärztliche Diabetesabklärung nötig. Ein Einzelwert reicht nicht für die Diagnose."]);
  else if ((vals.glu != null && vals.glu >= 100) || (vals.hba1c != null && vals.hba1c >= 5.7)) m.push(["warn", "Zuckerwerte im Prädiabetes-Bereich: Verlauf kontrollieren, Lebensstil besprechen. Nüchternglukose nur bei wirklich eingehaltener Nüchternheit verwertbar."]);
  if (is("glu", "warn") && vals.glu < 70) m.push(["warn", "Niedriger Nüchternblutzucker: Bei Zittern, Schwitzen oder Heißhunger mit der Ärztin oder dem Arzt besprechen."]);
  // Leber
  var liver = ["got","gpt","ggt","bili"].filter(bad);
  if (liver.length) {
    var worst = liver.some(function(id){ return lv[id].l === "alert"; });
    m.push([worst ? "alert" : "warn", "Leberwerte auffällig (" + liver.map(function(id){ return byId[id].name; }).join(", ") + "): häufige Ursachen sind Fettleber, Alkohol und Medikamente. Ultraschall und Wiederholung nach 2 bis 4 Wochen ohne Alkohol und Sport besprechen." + (is("bili","warn") && !bad("got") && !bad("gpt") && !bad("ggt") ? " Isoliert leicht erhöhtes Bilirubin passt häufig zu einem harmlosen Gilbert-Syndrom." : "")]);
  }
  // Pankreas
  var pan = ["lipase","amylase"].filter(bad);
  if (pan.length) m.push([pan.some(function(id){ return lv[id].l === "alert"; }) ? "alert" : "warn", "Pankreasenzyme erhöht (" + pan.map(function(id){ return byId[id].name; }).join(", ") + "): Bei Oberbauchschmerzen, Übelkeit oder Fettstühlen zeitnah ärztlich abklären. Starke Schmerzen sind ein Grund für sofortige Vorstellung."]);
  // Entzündung
  if (bad("crp") && !(vals.ferritin != null && vals.ferritin < 30)) m.push([lv.crp.l, "CRP " + vals.crp + " mg/l " + lv.crp.t + ": Infekt der letzten Tage ausschließen, nach 2 Wochen wiederholen. Bei Persistenz weiterführende Entzündungs- und Autoimmundiagnostik."]);
  // Vitamin D
  if (is("vitd", "alert") || is("vitd", "warn") && vals.vitd < 20) m.push([lv.vitd.l, "Vitamin D " + vals.vitd + " ng/ml (" + lv.vitd.t + "): Im November ist das noch die Sommerreserve und fällt bis Februar meist weiter ab. Substitution und Kontrolle ärztlich festlegen."]);
  else if (bad("vitd")) m.push(["warn", "Vitamin D " + lv.vitd.t + ": Bei Supplementierung Dosis prüfen."]);
  // Niere, Salze, CK, Harnsäure
  var kid = ["krea","hst","cystc"].filter(bad);
  if (kid.length) m.push([kid.some(function(id){ return lv[id].l === "alert"; }) ? "alert" : "warn", "Nierenwerte auffällig (" + kid.map(function(id){ return byId[id].name; }).join(", ") + "): Kreatinin steigt auch durch Austrocknung, Muskelmasse, Kreatin und viel Protein. Cystatin C ergänzt Kreatinin und ersetzt es nicht. Mit Wiederholung bei normaler Trinkmenge und ärztlich einordnen."]);
  var sal = ["na","k","mg"].filter(bad);
  if (sal.length) m.push([sal.some(function(id){ return lv[id].l === "alert"; }) ? "alert" : "warn", "Salzwerte auffällig (" + sal.map(function(id){ return byId[id].name; }).join(", ") + "): Flüssigkeitsmangel, Durchfall, Erbrechen und Blutdruckmittel verschieben sie. Bei deutlicher Abweichung oder Herzrasen zeitnah ärztlich klären. Eine hämolytische Probe täuscht ein hohes Kalium vor."]);
  if (bad("ck")) m.push([lv.ck.l, "Creatinkinase erhöht: Nach harter Einheit innerhalb von etwa 72 Stunden erwartet, die Aussage ist dann begrenzt. Kein Hinweis auf eine Muskelkrankheit allein durch diesen Wert. Bei Erhöhung ohne Training, mit Schmerzen oder dunklem Urin ärztlich abklären."]);
  if (bad("hs")) m.push([lv.hs.l, "Harnsäure erhöht: häufig durch Protein, Alkohol, Fruktose, Übergewicht oder Diuretika. Bei Gelenkschmerz ärztlich einordnen."]);
  if (bad("alp") && !bad("ggt")) m.push([lv.alp.l, "Alkalische Phosphatase erhöht ohne erhöhte Gamma-GT: Dann kommt eher Knochen als Leber in Betracht. Ärztlich einordnen."]);
  if (!m.length) m.push(["ok", "Alle eingetragenen Werte liegen im Orientierungsbereich. Bei weiterhin bestehender Müdigkeit rücken Ursachen jenseits der Basiswerte in den Vordergrund: Schlaf (Schlafapnoe), Stimmung, Medikamente, Post-Infekt-Syndrom, Belastung. Fehlende Werte ergänzen."]);
  var order = { alert: 0, warn: 1, ok: 2 };
  m.sort(function(a, b){ return order[a[0]] - order[b[0]]; });
  S.innerHTML = '<h3>Einordnung: ' + off + ' von ' + entered + ' eingetragenen Werten mit Hinweis</h3><ul style="list-style:none;padding:0;display:grid;gap:10px">' + m.map(function(x){ return '<li style="display:grid;grid-template-columns:auto 1fr;gap:10px;font-size:var(--text-sm)"><span class="badge '+x[0]+'" style="height:fit-content">'+levelLabel(x[0])+'</span><span>'+esc(x[1])+'</span></li>'; }).join('') + '</ul><p class="note">Diese Hinweise sind Gesprächsgrundlage für die Praxis. Behandlung und Diagnose legt die Ärztin oder der Arzt fest.</p>';
}
$("#tab-result").addEventListener("input", function(e){
  var id = e.target.dataset.val; if (!id) return;
  state.vals[id] = e.target.value; save(); updateResult();
});
$("#tab-result").addEventListener("click", function(e){
  var b = e.target.closest("button"); if (!b) return;
  if (b.dataset.rv) { ui.resView = b.dataset.rv; renderResult(); return; }
  if (b.dataset.sex) { state.sex = b.dataset.sex; save(); $$("[data-sex]").forEach(function(x){ x.setAttribute("aria-pressed", String(x.dataset.sex === state.sex)); }); updateResult(); }
  if (b.id === "btnClearVals") { state.vals = {}; save(); renderResult(); }
});

/* ---------- init ---------- */
if (!window.LC.list) window.LC.list = labList;
renderPlan(); renderCheck(); renderValues(); renderPrep(); renderCauses(); renderResult(); updateStats();
})();
