/* Erweiterung: Preislisten-Namen, zusätzliche Parameter, Screening-Regeln, Kontextfaktoren */
(function () {
  var P = window.PARAMS, G = window.GROUPS;
  var LAB = {
    got: ["GOT (ASAT)"], gpt: ["GPT (ALAT)"], ggt: ["Gamma-GT"], bili: ["Bilirubin (gesamt)"], lipase: ["Lipase"], amylase: ["Amylase"],
    tsh: ["Thyreotropin (TSH)"], b12: ["Vitamin B12"], holotc: ["Holotranscobalamin"], vitd: ["Vitamin D3 (25-OH)"], glu: ["Glucose (Nüchternblutzucker)"],
    hba1c: ["HbA1c"], chol: ["Cholesterin, gesamt"], ferritin: ["Ferritin"], crp: ["CRP"]
  };
  P.forEach(function (p) { if (LAB[p.id]) p.lab = LAB[p.id]; });

  /* Gruppe Niere */
  var i = G.map(function (g) { return g.id; }).indexOf("fett") + 1;
  G.splice(i, 0, { id: "niere", name: "Niere, Salze & Harnsäure", short: "Niere", why: "Nierenfunktion, Flüssigkeits- und Salzhaushalt. Austrocknung und gestörte Salze machen schlapp, Muskelmasse, Kreatin und Eiweißzufuhr verschieben einzelne Werte, ohne dass eine Krankheit vorliegt." });
  G.splice(G.length - 1, 0, { id: "muskel", name: "Muskel, Hormone & Sonstiges", short: "Muskel/Hormone", why: "Werte, die nur bei passender Frage sinnvoll sind: Muskelbelastung, Hormone, Spezialfragen." });

  function byId(id) { return P.filter(function (p) { return p.id === id; })[0]; }
  function drop(id) { var k = P.indexOf(byId(id)); if (k > -1) P.splice(k, 1); }
  function ins(afterId, obj) { var k = P.indexOf(byId(afterId)); P.splice(k + 1, 0, obj); }
  function patch(id, o) { var p = byId(id); for (var k in o) p[k] = o[k]; }

  /* Optional-Parameter präzisieren (Namen wie auf der Preisliste) */
  patch("bb", { name: "Blutbild (groß)", alt: "Hb, MCV, Leukozyten, Thrombozyten, Differenzierung", lab: ["Blutbild (groß)"], group: "eisen",
    high: "Infekt, Dehydrierung, Rauchen, Blutbildungsstörung.", low: "Blutarmut (Eisen-, B12-, Folsäuremangel, Blutverlust, chronische Erkrankung).",
    tip: "MCV niedrig weist eher auf Eisenmangel, MCV hoch eher auf B12- oder Folsäuremangel. Auf der Liste gibt es „Blutbild (klein)“ und „Blutbild (groß)“, nicht beides bestellen.",
    step: "Bei Blutarmut Ferritin, B12 oder HoloTC und Ursache ärztlich klären." });
  patch("tg", { name: "Lipidprofil (Cholesterin, LDL, HDL, Triglyceride)", alt: "Paket, enthält Gesamtcholesterin", lab: ["Lipidprofil (Cholesterin, LDL, HDL, Triglyceride)"], group: "fett",
    high: "Fettreiche Mahlzeit vor der Abnahme, Übergewicht, Prädiabetes, Alkohol, Schilddrüsenunterfunktion, Medikamente.", low: "Meist ohne Bedeutung.",
    tip: "Kostet auf der Liste dasselbe wie die vier Einzelwerte, deshalb als Paket bestellen und nicht zusätzlich Einzelwerte oder Cholesterin gesamt.",
    step: "Bei hohen Werten Gesamtrisiko ärztlich einordnen." });
  patch("tsat", { alt: "in der Bestellhilfe nicht automatisch", lab: ["Transferrinsättigung (Transferrin und Eisen)"] });
  patch("folat", { lab: ["Folsäure"], group: "vitamine",
    high: "Supplement, Mahlzeit, Hämolyse der Probe.", low: "Einseitige Ernährung, Alkohol, Malabsorption (z. B. Zöliakie), Medikamente.",
    tip: "Nur bei Müdigkeit oder ausdrücklichem Wunsch sinnvoll. Ein normaler Serumwert schließt einen funktionellen Mangel nicht sicher aus.",
    ref: "Mangel < 3 ng/ml, Graubereich 3 bis 4,5 ng/ml (laborabhängig)",
    bands: { all: [{ lt: 3, l: "alert", t: "niedrig" }, { lt: 4.5, l: "warn", t: "Graubereich" }, { le: 1e9, l: "ok", t: "im Referenzbereich" }] },
    unit: "ng/ml" });
  patch("cortisol", { lab: ["Cortisol"], group: "muskel" });
  patch("ttg", { lab: ["Transglutaminase-AK (IgA)", "IgA gesamt"], group: "muskel" });
  patch("ck", { name: "Creatinkinase", alt: "Muskelenzym", lab: ["Creatinkinase"], group: "muskel", unit: "U/l",
    ref: "Frauen ≤ 170, Männer ≤ 190 U/l (stark training- und laborabhängig)",
    meaning: "Zeigt Muskelbelastung oder Muskelschaden. Sie ist nicht die Ursache von Alltagsmüdigkeit.",
    high: "Harte Einheit in den letzten etwa 72 Stunden (erwartet), Muskelschmerz unter Cholesterin-Senker, Verletzung, Injektionen, Muskelerkrankung.", low: "Ohne klinische Bedeutung.",
    tip: "Liegt die letzte harte Einheit unter etwa 72 Stunden zurück, ist ein erhöhter Wert erwartet und die Aussage begrenzt. Das ist keine Muskelkrankheit.",
    step: "Bei Erhöhung ohne Training und mit Beschwerden oder dunklem Urin ärztlich abklären.",
    bands: { F: [{ le: 170, l: "ok", t: "im Referenzbereich" }, { le: 510, l: "warn", t: "erhöht (nach Training erwartbar)" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }], M: [{ le: 190, l: "ok", t: "im Referenzbereich" }, { le: 570, l: "warn", t: "erhöht (nach Training erwartbar)" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }] } });

  /* elyt → Natrium, Kalium; Kreatinin neu */
  drop("elyt");
  patch("krea", { name: "Kreatinin", alt: "Nierenfunktion (Muskelmasse-abhängig)", lab: ["Kreatinin"], group: "niere", unit: "mg/dl",
    ref: "Frauen etwa 0,5 bis 0,9, Männer etwa 0,7 bis 1,2 mg/dl (methoden- und laborabhängig)", on: false,
    meaning: "Abbauprodukt des Muskels, über die Niere ausgeschieden. Bei Austrocknung steigt es, bei viel Muskelmasse, Kreatin und hoher Proteinzufuhr ebenfalls, ohne dass die Niere geschädigt ist.",
    high: "Austrocknung, viel Muskelmasse, Kreatin, gekochtes Fleisch, NSAR, Blutdruckmittel, Diuretika, Lithium, Nierenerkrankung.", low: "Geringe Muskelmasse, Schwangerschaft.",
    tip: "Nicht streichen, nur weil Cystatin C dazukommt. Cystatin C ergänzt Kreatinin, es ersetzt es nicht.",
    step: "Bei Auffälligkeit mit Cystatin C und Urinbefund ärztlich einordnen.",
    bands: { F: [{ lt: 0.5, l: "warn", t: "niedrig (geringe Muskelmasse möglich)" }, { le: 0.9, l: "ok", t: "im Orientierungsbereich" }, { le: 1.3, l: "warn", t: "erhöht" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }], M: [{ lt: 0.7, l: "warn", t: "niedrig (geringe Muskelmasse möglich)" }, { le: 1.2, l: "ok", t: "im Orientierungsbereich" }, { le: 1.6, l: "warn", t: "erhöht" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }] } });
  var NEW = [
    { id: "hst", group: "niere", name: "Harnstoff", alt: "Eiweißabbau, Flüssigkeitshaushalt", unit: "mg/dl", ref: "etwa 17 bis 50 mg/dl", fasting: "rec", tube: "Serum", on: false, lab: ["Harnstoff"],
      meaning: "Endprodukt des Eiweißabbaus. Steigt bei Austrocknung, hoher Proteinzufuhr und eingeschränkter Nierenfunktion.",
      high: "Hohe Proteinzufuhr, Flüssigkeitsmangel, Nierenerkrankung, Kortison, Blutung im Magen-Darm-Trakt.", low: "Wenig Eiweiß, Überwässerung, Lebererkrankung.",
      tip: "Allein ist ein erhöhter Harnstoff bei viel Protein kein Nierenschaden.", step: "Zusammen mit Kreatinin lesen.",
      bands: { all: [{ lt: 15, l: "warn", t: "niedrig" }, { le: 50, l: "ok", t: "im Orientierungsbereich" }, { le: 80, l: "warn", t: "erhöht" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }] } },
    { id: "na", group: "niere", name: "Natrium", alt: "Salzhaushalt", unit: "mmol/l", ref: "135 bis 145 mmol/l", fasting: "no", tube: "Serum", on: false, lab: ["Natrium"],
      meaning: "Wichtigstes Salz außerhalb der Zellen. Austrocknung, Erbrechen, Durchfall, Diuretika oder starkes Trinken verschieben es und machen schlapp.",
      high: "Flüssigkeitsmangel.", low: "Diuretika, Erbrechen, Durchfall, sehr viel Trinken, hormonelle Ursachen, Medikamente.",
      tip: "Bei wenig getrunken nicht streichen, wenn Niere und Salze ohnehin laufen. Daraus allein kein großes Profil machen.", step: "Bei deutlicher Abweichung ärztlich zeitnah klären.",
      bands: { all: [{ lt: 130, l: "alert", t: "deutlich niedrig" }, { lt: 135, l: "warn", t: "niedrig" }, { le: 145, l: "ok", t: "im Referenzbereich" }, { le: 150, l: "warn", t: "erhöht" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }] } },
    { id: "k", group: "niere", name: "Kalium", alt: "Salzhaushalt, Herz- und Muskelfunktion", unit: "mmol/l", ref: "3,5 bis 5,1 mmol/l", fasting: "no", tube: "Serum", on: false, lab: ["Kalium"],
      meaning: "Wichtig für Muskel- und Herzfunktion. Abweichungen können Schwäche, Krämpfe und Herzrasen begleiten.",
      high: "Nierenerkrankung, bestimmte Blutdruckmittel, Hämolyse der Probe, Faustpumpen beim Stauen.", low: "Diuretika, Durchfall, Erbrechen, Abführmittel.",
      tip: "Eine hämolytische Probe täuscht ein zu hohes Kalium vor.", step: "Bei deutlicher Abweichung oder Herzrasen ärztlich zeitnah klären.",
      bands: { all: [{ lt: 3.0, l: "alert", t: "deutlich niedrig" }, { lt: 3.5, l: "warn", t: "niedrig" }, { le: 5.1, l: "ok", t: "im Referenzbereich" }, { le: 5.5, l: "warn", t: "erhöht" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }] } },
    { id: "cystc", group: "niere", name: "Cystatin C", alt: "Nierenfunktion, unabhängiger von Muskelmasse", unit: "mg/l", ref: "etwa 0,6 bis 1,0 mg/l", fasting: "no", tube: "Serum", on: false, lab: ["Cystatin C"],
      meaning: "Nierenmarker, der weniger von Muskelmasse und Kreatin abhängt als Kreatinin. Hilfreich, wenn Kreatinin schwer deutbar ist.",
      high: "Eingeschränkte Nierenfunktion, Entzündung, Rauchen, Schilddrüsenfunktionsstörung, hoch dosiertes Kortison.", low: "Ohne Bedeutung.",
      tip: "Immer zusätzlich zu Kreatinin, nie statt Kreatinin.", step: "Bei Auffälligkeit ärztlich zusammen mit Kreatinin und Urinbefund einordnen.",
      bands: { all: [{ le: 1.0, l: "ok", t: "im Orientierungsbereich" }, { le: 1.3, l: "warn", t: "erhöht" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }] } },
    { id: "hs", group: "niere", name: "Harnsäure", alt: "Purinstoffwechsel", unit: "mg/dl", ref: "Frauen < 6,0, Männer < 7,0 mg/dl", fasting: "no", tube: "Serum", on: false, lab: ["Harnsäure"],
      meaning: "Abbauprodukt der Purine. Erhöhte Werte sind mit Gicht und Nierensteinen verknüpft, mit Müdigkeit nur indirekt.",
      high: "Hohe Proteinzufuhr, Alkohol, Fruktose, Übergewicht, Diuretika, Nierenerkrankung, Gicht.", low: "Gichtmittel (Allopurinol), seltene Ursachen.",
      tip: "Nur bei hoher Proteinzufuhr, Gelenkschmerz, Gicht, Gichtmittel oder Wunsch bestellen.", step: "Bei Gelenkbeschwerden ärztlich einordnen.",
      bands: { F: [{ le: 6.0, l: "ok", t: "im Orientierungsbereich" }, { le: 7.5, l: "warn", t: "erhöht" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }], M: [{ le: 7.0, l: "ok", t: "im Orientierungsbereich" }, { le: 8.5, l: "warn", t: "erhöht" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }] } },
    { id: "mg", group: "niere", name: "Magnesium", alt: "Serum-Magnesium", unit: "mmol/l", ref: "0,75 bis 1,05 mmol/l", fasting: "no", tube: "Serum", on: false, lab: ["Magnesium"],
      meaning: "Beteiligt an Muskel- und Nervenfunktion. Ein niedriger Wert kann Krämpfe begleiten.",
      high: "Nierenerkrankung, Magnesiumpräparate kurz vor der Abnahme.", low: "Durchfall, Diuretika, PPI, Alkohol, Diabetes.",
      tip: "Ein Normalwert im Serum schließt einen Mangel nicht aus, weil fast alles Magnesium in den Zellen liegt. Wenig gegessen allein ist kein Grund.", step: "Bei Krämpfen und Auffälligkeit ärztlich einordnen.",
      bands: { all: [{ lt: 0.6, l: "alert", t: "deutlich niedrig" }, { lt: 0.75, l: "warn", t: "niedrig" }, { le: 1.05, l: "ok", t: "im Referenzbereich" }, { le: 1e9, l: "warn", t: "erhöht" }] } },
    { id: "alp", group: "leber", name: "Alkalische Phosphatase", alt: "Gallenwege, Knochen", unit: "U/l", ref: "Frauen etwa 35 bis 105, Männer etwa 40 bis 130 U/l", fasting: "rec", tube: "Serum", on: false, lab: ["Alkalische Phosphatase"],
      meaning: "Enzym der Gallenwege und des Knochens. Gehört zum klassischen Leberblock, ist aber nicht im Paket „Leberwerte (GOT, GPT, gamma-GT)“ enthalten.",
      high: "Gallestau, Lebererkrankung, Knochenumbau, Wachstum, Schwangerschaft.", low: "Selten, z. B. Zink- oder Magnesiummangel.",
      tip: "Zusammen mit Gamma-GT und Bilirubin lesen, um Leber und Knochen zu trennen.", step: "Bei Erhöhung mit Gamma-GT ärztlich weiter abklären.",
      bands: { F: [{ le: 105, l: "ok", t: "im Orientierungsbereich" }, { le: 315, l: "warn", t: "erhöht" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }], M: [{ le: 130, l: "ok", t: "im Orientierungsbereich" }, { le: 390, l: "warn", t: "erhöht" }, { le: 1e9, l: "alert", t: "deutlich erhöht" }] } },
    { id: "ft3", group: "schilddruese", name: "freies T3", alt: "nur bei Beschwerden oder Wunsch", unit: "", ref: "laborabhängig", fasting: "no", tube: "Serum", on: false, lab: ["freies T3"],
      meaning: "Aktives Schilddrüsenhormon. Ergänzt TSH, wenn Beschwerden bestehen oder TSH auffällt." },
    { id: "testo", group: "muskel", name: "Testosteron, gesamt", alt: "morgens abnehmen", unit: "", ref: "laborabhängig, alters- und geschlechtsabhängig", fasting: "no", tube: "Serum", on: false, lab: ["Testosteron, gesamt"],
      meaning: "Nur bei Libidoverlust, erektilen Problemen oder ausdrücklichem Wunsch. Nicht wegen Krafttraining und nicht wegen Stimmung. Schwankt im Tagesverlauf, deshalb morgens." }
  ];
  /* Reihenfolge: Niere-Blöcke nach Fette, ALP nach Bilirubin, fT3 vor ft4 */
  ins("bili", NEW[6]);
  ["mg", "hs", "cystc", "k", "na", "hst"].forEach(function (id) { var o = NEW.filter(function (x) { return x.id === id; })[0]; ins("crp", o); });
  // Reihenfolge der Niere-Gruppe innerhalb der Liste ist unkritisch, Gruppierung erfolgt über group.
  ins("ft4", NEW[7]); ins("ck", NEW[8]);
  patch("ft4", { name: "freies T4", alt: "nur bei Beschwerden oder auffälligem TSH", lab: ["freies T4"], group: "schilddruese", unit: "",
    meaning: "Freies Schilddrüsenhormon. Sinnvoll bei Beschwerden oder auffälligem TSH, nicht als Antikörperprofil. Antikörper wie TPO-AK entscheidet die Ärztin oder der Arzt." });
  // Kreatinin auch Ursachen c9
  window.CAUSES.forEach(function (c) { if (c.id === "c9") c.labs = ["krea", "na", "k", "bb"]; });

  /* Parameterauswertung (Screening-Regeln je Parameter) */
  window.SCREEN = {
    got: { when: "Teil des Leberblocks. Nicht allein bestellen und den Block nicht auf GOT verkürzen.", ctx: "GOT steigt nach Training mit. Einen isolierten GOT-Anstieg nach harter Einheit nicht als Lebersignal lesen.", dup: "Nicht einzeln, wenn „Leberwerte (GOT, GPT, gamma-GT)“ bestellt wird." },
    gpt: { when: "Leberblock, unter Statin als Verlaufswert. Unter Statin reicht bei sparsamem Budget GPT (ALAT) allein.", ctx: "Fettleber ist die häufigste Ursache einer leichten Erhöhung. Alkohol und Medikamente mitdenken.", dup: "Nicht einzeln, wenn „Leberwerte (GOT, GPT, gamma-GT)“ bestellt wird." },
    ggt: { when: "Leberblock.", ctx: "Sehr empfindlich, wenig spezifisch. Eine isolierte leichte Erhöhung allein kaum aussagekräftig.", dup: "Nicht einzeln, wenn „Leberwerte (GOT, GPT, gamma-GT)“ bestellt wird." },
    bili: { when: "Zusätzlich zum Paket „Leberwerte (GOT, GPT, gamma-GT)“, denn es ist dort nicht enthalten. Bilirubin direkt oder GLDH nur mit eigener Begründung.", ctx: "Isoliert leicht erhöht passt oft zu einem harmlosen Gilbert-Syndrom. Langes Fasten verschiebt den Wert.", dup: "Nur „Bilirubin (gesamt)“, nicht zusätzlich direkt." },
    alp: { when: "Zusätzlich zum Paket „Leberwerte (GOT, GPT, gamma-GT)“, denn es ist dort nicht enthalten.", ctx: "Zusammen mit Gamma-GT und Bilirubin lesen, um Leber und Knochen zu trennen.", dup: "Wird nicht durch das Paket abgedeckt." },
    lipase: { when: "Nur bei starken Oberbauchschmerzen mit Rückenausstrahlung, bei anhaltendem Erbrechen oder auf ausdrücklichen Wunsch. Unter Tirzepatid oder anderem GLP-1-Medikament nicht routinemäßig.", ctx: "Eine leichte Erhöhung ohne starke Schmerzen ist keine Pankreatitis. Eine eingeschränkte Nierenfunktion kann die Werte anheben.", dup: "Lipase und Amylase nur gemeinsam sinnvoll, wenn die Frage es hergibt." },
    amylase: { when: "Wie Lipase: nur bei passendem Schmerz, anhaltendem Erbrechen oder Wunsch.", ctx: "Weniger spezifisch als Lipase, kann auch aus den Speicheldrüsen stammen.", dup: "" },
    tsh: { when: "Bei Müdigkeit, Kältegefühl, Gewichtszunahme, Haarausfall, Herzrasen, bekannter Schilddrüsenerkrankung, unter Levothyroxin oder Lithium.", ctx: "Biotin kann TSH verfälschen. Morgens abnehmen, Levothyroxin erst nach der Abnahme.", dup: "Freies T3 und freies T4 nur bei Beschwerden oder Wunsch, kein Antikörperprofil." },
    ft4: { when: "Nur bei Beschwerden oder Wunsch, nicht automatisch.", ctx: "Sinnvoll vor allem bei auffälligem TSH.", dup: "" },
    ft3: { when: "Nur bei Beschwerden oder Wunsch, nicht automatisch.", ctx: "Ergänzt TSH und freies T4.", dup: "" },
    b12: { when: "Bei Müdigkeit, vegetarischer oder veganer Ernährung, unter Metformin oder Magensäureblocker, bei B12-Supplement.", ctx: "Ein normaler Serumwert schließt einen funktionellen Mangel nicht sicher aus. Unter Supplement zeigt der Wert die Versorgung unter Einnahme. Präparat nicht am Abnahmemorgen nachnehmen.", dup: "Nicht zusammen mit Holotranscobalamin bestellen." },
    holotc: { when: "Nur statt Vitamin B12, nicht zusätzlich.", ctx: "Teurer als Vitamin B12. Zeigt das aktive B12.", dup: "Nicht zusammen mit Vitamin B12 bestellen." },
    folat: { when: "Nur bei Müdigkeit oder Wunsch.", ctx: "Enthält ein B-Komplex Biotin, können Immuntests verfälscht werden. Nicht eigenmächtig absetzen.", dup: "" },
    vitd: { when: "Bei Müdigkeit oder Vitamin-D-Supplement. Nicht öfter als etwa alle 3 Monate.", ctx: "Unter Supplement zeigt der Wert die Versorgung unter Einnahme. Präparat nicht am Abnahmemorgen nachnehmen.", dup: "" },
    glu: { when: "Bei Diabetes oder Prädiabetes, unter Kortison, Insulin oder Sulfonylharnstoff, Tirzepatid oder anderem GLP-1-Medikament, Herzrasen und im Klassiker-Block.", ctx: "Nur nüchtern aussagekräftig. Ohne Nüchternheit als eingeschränkt kennzeichnen oder verschieben.", dup: "" },
    hba1c: { when: "Bei Diabetes, Übergewicht, Kortison, GLP-1, Metformin oder Insulin und Sulfonylharnstoff.", ctx: "Langzeitwert ohne Nüchternheit. Bei Blutarmut, Eisenmangel oder B12-Mangel kann er verschoben sein.", dup: "" },
    chol: { when: "Nur als Einzelwert, wenn wirklich nur Gesamtcholesterin gewünscht ist.", ctx: "Nicht zusätzlich zum Lipidprofil.", dup: "Nicht Einzelwerte plus „Lipidprofil (Cholesterin, LDL, HDL, Triglyceride)“." },
    tg: { when: "Als Paket bei Herz-Kreislauf-Risiko, Statin, Tirzepatid oder anderem GLP-1-Medikament und im Klassiker-Block.", ctx: "Nüchtern abnehmen. Ohne Nüchternheit eingeschränkt aussagekräftig. Das Paket kostet dasselbe wie die vier Einzelwerte und wird nur der einfacheren Bestellung wegen gewählt.", dup: "Nicht Einzelwerte plus Lipidprofil." },
    ferritin: { when: "Bei Müdigkeit, Haarausfall, vegetarischer oder veganer Ernährung, unter Eisen oder Magensäureblocker, bei Eisenmangel.", ctx: "Ferritin steigt bei Entzündung. Deshalb bei Eisenfrage CRP dazu.", dup: "" },
    crp: { when: "Bei Infektzeichen, Entzündung, Eisenfrage oder Wunsch.", ctx: "Hängt vom Infektstatus und von harter Belastung der letzten 48 Stunden ab.", dup: "" },
    bb: { when: "Im Klassiker-Block, bei Müdigkeit, Eisenfrage, Infekt, unter Eisen oder NSAR.", ctx: "Immer „Blutbild (groß)“. Nicht zusätzlich „Blutbild (klein)“.", dup: "Nicht kleines und großes Blutbild." },
    krea: { when: "Im Klassiker-Block und unter Metformin, Blutdruckmittel, Diuretikum, NSAR, Lithium, GLP-1.", ctx: "Steigt auch durch Muskelmasse, Kreatin und gekochtes Fleisch. Nicht streichen, nur weil Cystatin C dazukommt.", dup: "" },
    hst: { when: "Im Klassiker-Block und unter Tirzepatid oder anderem GLP-1-Medikament.", ctx: "Steigt durch Protein mit. Allein kein Nierenschaden.", dup: "" },
    na: { when: "Im Klassiker-Block, unter Blutdruckmittel, Diuretikum, GLP-1, bei Krämpfen und Herzrasen.", ctx: "Bei wenig getrunken nicht streichen, wenn Niere und Salze ohnehin laufen. Daraus allein kein großes Profil.", dup: "" },
    k: { when: "Wie Natrium.", ctx: "Hämolyse und Faustpumpen verfälschen den Wert.", dup: "" },
    cystc: { when: "Bei Kreatin, viel Muskelmasse, hoher Proteinzufuhr oder schwer deutbarem Kreatinin. Im sparsamen Budget kann er warten.", ctx: "Zusätzlich zu Kreatinin, nicht statt Kreatinin.", dup: "" },
    hs: { when: "Nur bei hoher Proteinzufuhr, Gelenkschmerz, Gicht, Gichtmittel oder Wunsch.", ctx: "Unter Gichtmittel Kreatinin nicht streichen, wenn die Niere ohnehin läuft.", dup: "" },
    mg: { when: "Nur bei Krämpfen, Nierenerkrankung oder Wunsch. Wenig gegessen allein reicht nicht.", ctx: "Ein Normalwert schließt einen Mangel nicht aus. Präparat nicht am Abnahmemorgen nachnehmen.", dup: "" },
    ck: { when: "Nur bei Krafttraining, Muskelschmerz (besonders unter Cholesterin-Senker) oder dunklem Urin nach dem Training.", ctx: "Liegt die letzte harte Einheit unter etwa 72 Stunden, als „erwartet erhöht, Aussage begrenzt“ lesen oder die Abnahme verschieben. Nicht als Muskelkrankheit werten.", dup: "" },
    cortisol: { when: "Nicht als Stress- oder Übertrainingsnachweis und nicht bei Psyche. Nur auf ausdrücklichen Wunsch oder bei ärztlichem Verdacht.", ctx: "Ohne feste Uhrzeit wenig aussagekräftig. Kein Tagesprofil.", dup: "" },
    tsat: { when: "Nicht automatisch. Nur bei Ferritin im Graubereich auf ärztlichen Rat.", ctx: "Serumeisen schwankt stark, nur morgens und nüchtern verwertbar.", dup: "" },
    ttg: { when: "Nur bei konkretem Verdacht, ärztlich abstimmen.", ctx: "Unter glutenfreier Kost unzuverlässig.", dup: "" },
    testo: { when: "Nur bei Libidoverlust, erektilen Problemen oder Wunsch, morgens, Priorität B. Nicht wegen Krafttraining und nicht wegen Psyche. SHBG nur zusammen mit Testosteron und nur, wenn es auf der Preisliste steht.", ctx: "Tageszeit und Schlaf beeinflussen den Wert.", dup: "" }
  };

  /* Kontextfaktoren */
  window.CONTEXT = [
    { t: "Kreatin, viel Muskelmasse, hohe Proteinzufuhr", v: "Kreatinin, Cystatin C, Harnstoff, Harnsäure", x: "Kreatinin steigt ohne Nierenschaden, Harnstoff steigt durch Protein mit. Cystatin C zusätzlich zu Kreatinin bestimmen, nicht statt Kreatinin. Ein einzelner erhöhter Wert ist allein kein Nierenschaden." },
    { t: "Krafttraining und letzte harte Einheit", v: "Creatinkinase, GOT, CRP", x: "Unter etwa 72 Stunden nach einer harten Einheit sind Creatinkinase und GOT erwartet erhöht, die Aussage ist begrenzt. Den Leberblock nicht auf GOT verkürzen." },
    { t: "Wenig getrunken", v: "Kreatinin, Harnstoff, Natrium, Kalium", x: "Die Werte konzentrieren sich bei Flüssigkeitsmangel. Natrium und Kalium nicht streichen, wenn Niere und Salze ohnehin laufen. Daraus allein kein großes Profil." },
    { t: "Wenig gegessen", v: "Glucose, Lipide, Magnesium", x: "Wenig gegessen allein ist kein Grund für Serum-Magnesium. Nüchternwerte sind ohnehin nüchtern gedacht." },
    { t: "Nicht nüchtern", v: "Glucose (Nüchternblutzucker), Lipidprofil", x: "Eingeschränkt aussagekräftig. HbA1c, Leber, Niere, Blutbild, TSH, Ferritin, B12, Vitamin D, Creatinkinase und Cystatin C gehen ohne Nüchternheit." },
    { t: "Tageszeit", v: "Testosteron, TSH, Cortisol, Serumeisen", x: "Testosteron und TSH morgens. Cortisol ohne feste Uhrzeit ist wenig aussagekräftig und kein Nachweis für Stress oder Übertraining." },
    { t: "Biotin, B-Komplex", v: "TSH und andere Immuntests", x: "Biotin kann Immuntests verfälschen, besonders TSH. Nicht eigenmächtig absetzen, der Praxis mitteilen." },
    { t: "Tirzepatid oder anderes GLP-1-Medikament", v: "Glucose, HbA1c, Lipidprofil, Leber, Alkalische Phosphatase, Bilirubin, Kreatinin, Harnstoff, Natrium, Kalium", x: "Lipase und Amylase nur bei starken Oberbauchschmerzen, anhaltendem Erbrechen oder Wunsch. Eine leichte Erhöhung ohne starke Schmerzen ist keine Pankreatitis." },
    { t: "Metformin", v: "Kreatinin, Vitamin B12, HbA1c", x: "Langzeitgebrauch kann B12 senken. Vitamin B12 oder Holotranscobalamin, nicht beides." },
    { t: "Insulin oder Sulfonylharnstoff", v: "Glucose, HbA1c", x: "Nüchternwert nur bei eingehaltener Nüchternheit verwertbar." },
    { t: "Statin oder anderer Cholesterin-Senker", v: "Lipidprofil, GPT, Creatinkinase", x: "Creatinkinase nur bei Muskelschmerz. Nicht absetzen, die Ärztin oder der Arzt sollte es wissen." },
    { t: "Blutdruckmittel, Diuretikum", v: "Kreatinin, Natrium, Kalium", x: "Diuretika können Natrium und Kalium senken." },
    { t: "Levothyroxin", v: "TSH", x: "Freies T3 und freies T4 nur bei Beschwerden oder Wunsch. Tablette erst nach der Abnahme." },
    { t: "Eisenpräparat", v: "Blutbild (groß), Ferritin, CRP", x: "Eisen nicht am Abnahmemorgen nachnehmen, wenn der Spiegel geprüft werden soll." },
    { t: "Magensäureblocker (PPI)", v: "Vitamin B12, Ferritin", x: "Holotranscobalamin nur statt Vitamin B12." },
    { t: "NSAR, regelmäßig Ibuprofen oder Diclofenac", v: "Kreatinin, Blutbild (groß)", x: "Nierenfunktion und Blutarmut im Blick behalten." },
    { t: "Kortison, dauerhaft", v: "Glucose, HbA1c", x: "Glucose und HbA1c nicht streichen. Kein Cortisol-Tagesprofil." },
    { t: "Allopurinol oder anderes Gichtmittel", v: "Harnsäure, Kreatinin", x: "Harnsäure nur bei Gicht, Gelenkschmerz oder Wunsch. Kreatinin nicht streichen, wenn die Niere ohnehin läuft." },
    { t: "Antidepressivum, Neuroleptikum, Phasenprophylaxe (nicht Lithium)", v: "keine Extra-Analyse", x: "Weder Cortisol noch großes Hormonprofil. Schlaf und Stimmung sind eine durch diese Blutwerte nicht belegte Richtung." },
    { t: "Lithium", v: "Kreatinin, Thyreotropin (TSH)", x: "Nicht streichen. Ein Lithium-Spiegel steht nicht auf der Preisliste von Bioscientia Labor Mittelhessen und muss anderweitig bestimmt werden." },
    { t: "Hormonelle Verhütung oder HRT", v: "kein automatisches Hormonprofil", x: "Auch nicht automatisch Leber oder TSH." },
    { t: "Vegetarisch oder vegan", v: "Vitamin B12, Ferritin", x: "Beide sind in der Bestellhilfe dann fest enthalten." },
    { t: "Supplements", v: "Vitamin D3 (25-OH), Vitamin B12, Magnesium, Omega-3-Index", x: "Vitamin D nicht öfter als etwa alle 3 Monate. Omega-3-Index ist teuer, nur auf Wunsch, Priorität B und ersetzt kein Lipidprofil. Spiegel nicht am Abnahmemorgen nachnehmen." },
    { t: "Zu wenig oder sehr unruhiger Schlaf", v: "keine direkte Blutgröße", x: "Eine mögliche Richtung bei Erschöpfung, durch diese Blutwerte nicht belegt und damit nicht geprüft." }
  ];
})();
