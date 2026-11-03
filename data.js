window.GROUPS = [
  { id: "leber", name: "Leber & Galle", short: "Leber", why: "Entgiftung, Energiespeicherung und Eiweißsynthese. Eine gestörte Leberfunktion zeigt sich oft zuerst als diffuse Erschöpfung." },
  { id: "pankreas", name: "Bauchspeicheldrüse", short: "Pankreas", why: "Verdauungsenzyme und Insulin. Eine Funktionsstörung kann zu Nährstoffmangel und damit zu Müdigkeit führen." },
  { id: "schilddruese", name: "Schilddrüse", short: "Schilddrüse", why: "Steuert den Grundumsatz. Über- wie Unterfunktion gehören zu den klassischen organischen Ursachen von Müdigkeit." },
  { id: "vitamine", name: "Vitamine", short: "Vitamine", why: "B12 und Vitamin D beeinflussen Blutbildung, Nerven, Muskulatur und Immunsystem." },
  { id: "zucker", name: "Zuckerstoffwechsel", short: "Zucker", why: "Glukose ist der Haupt-Treibstoff des Gehirns. Schwankungen und Diabetes äußern sich häufig als Leistungsknick." },
  { id: "fett", name: "Fettstoffwechsel", short: "Fette", why: "Cholesterin ist selten Ursache von Müdigkeit, liefert aber Hinweise auf Schilddrüse, Leber und Stoffwechsellage." },
  { id: "eisen", name: "Eisenspeicher & Entzündung", short: "Eisen/CRP", why: "Eisenmangel ist eine der häufigsten Ursachen für Erschöpfung. CRP zeigt, ob eine Entzündung die Werte verfälscht oder selbst Ursache ist." },
  { id: "extra", name: "Sinnvolle Ergänzungen (optional)", short: "Optional", why: "Nicht in der Wunschliste, aber in der Praxis häufig mitbestimmt. Mit der Ärztin oder dem Arzt abstimmen." }
];

window.FASTING = {
  must: { label: "nüchtern nötig", cls: "must" },
  rec: { label: "nüchtern empfohlen", cls: "rec" },
  no: { label: "nüchtern egal", cls: "no" }
};

window.PARAMS = [
  {
    id: "got", group: "leber", name: "GOT (AST)", alt: "Aspartat-Aminotransferase", unit: "U/l",
    ref: "Frauen ≤ 35, Männer ≤ 50 U/l", fasting: "rec", tube: "Serum", on: true,
    meaning: "Enzym in Leberzellen, aber auch in Herz- und Skelettmuskel und roten Blutkörperchen. Bei Erschöpfung zeigt es, ob Leberzellen oder Muskulatur Schaden nehmen. Eine eingeschränkte Leber entgiftet und speichert Energie schlechter.",
    high: "Fettleber, Alkohol, Virushepatitis, Medikamente (z. B. Statine), starke körperliche Belastung in den letzten 48 h, Muskelerkrankung, Hämolyse bei der Abnahme.",
    low: "Ohne klinische Bedeutung.",
    tip: "Ist GOT höher als GPT, spricht das eher für Alkohol, Muskel oder Herz als für eine reine Lebererkrankung.",
    step: "Leberwerte stets gemeinsam lesen. Wiederholung nach 2 bis 4 Wochen ohne Alkohol und Sport, wenn nur leicht erhöht.",
    bands: { F: [{le:35,l:"ok",t:"im Referenzbereich"},{le:105,l:"warn",t:"erhöht"},{le:1e9,l:"alert",t:"deutlich erhöht (über 3× Obergrenze)"}],
             M: [{le:50,l:"ok",t:"im Referenzbereich"},{le:150,l:"warn",t:"erhöht"},{le:1e9,l:"alert",t:"deutlich erhöht (über 3× Obergrenze)"}] }
  },
  {
    id: "gpt", group: "leber", name: "GPT (ALT)", alt: "Alanin-Aminotransferase", unit: "U/l",
    ref: "Frauen ≤ 35, Männer ≤ 50 U/l", fasting: "rec", tube: "Serum", on: true,
    meaning: "Leberspezifischer als GOT und damit der wichtigste Marker für eine Leberzellschädigung. Chronische Leberentzündungen und die Fettleber gehen häufig mit Müdigkeit einher, lange bevor Schmerzen auftreten.",
    high: "Nicht-alkoholische Fettlebererkrankung (MASLD), Alkohol, Hepatitis B/C, Autoimmunhepatitis, Medikamente, Nahrungsergänzung (z. B. hochdosierte Pflanzenextrakte).",
    low: "Ohne klinische Bedeutung.",
    tip: "Die häufigste Ursache einer leicht erhöhten GPT ist die Fettleber, oft zusammen mit Übergewicht oder Prädiabetes.",
    step: "Bei Erhöhung: Ultraschall Oberbauch, ggf. Hepatitis-Serologie.",
    bands: { F: [{le:35,l:"ok",t:"im Referenzbereich"},{le:105,l:"warn",t:"erhöht"},{le:1e9,l:"alert",t:"deutlich erhöht (über 3× Obergrenze)"}],
             M: [{le:50,l:"ok",t:"im Referenzbereich"},{le:150,l:"warn",t:"erhöht"},{le:1e9,l:"alert",t:"deutlich erhöht (über 3× Obergrenze)"}] }
  },
  {
    id: "ggt", group: "leber", name: "GGT", alt: "Gamma-Glutamyltransferase", unit: "U/l",
    ref: "Frauen ≤ 40, Männer ≤ 60 U/l", fasting: "rec", tube: "Serum", on: true,
    meaning: "Enzym der Gallenwege und Leberzellen. Sehr empfindlich, aber wenig spezifisch: Es steigt bei Alkohol, Medikamenten, Gallestau und Fettleber, oft früher als GOT und GPT.",
    high: "Alkohol (auch moderater, regelmäßiger Konsum), Fettleber, Gallengangs- oder Gallenblasenerkrankung, Medikamente (Antiepileptika, Paracetamol-Dauergebrauch), Diabetes.",
    low: "Ohne klinische Bedeutung.",
    tip: "Eine isolierte, leichte GGT-Erhöhung ist häufig und allein kaum aussagekräftig.",
    step: "Zusammen mit alkalischer Phosphatase (AP) und Bilirubin beurteilen, wenn ein Gallestau möglich ist.",
    bands: { F: [{le:40,l:"ok",t:"im Referenzbereich"},{le:120,l:"warn",t:"erhöht"},{le:1e9,l:"alert",t:"deutlich erhöht (über 3× Obergrenze)"}],
             M: [{le:60,l:"ok",t:"im Referenzbereich"},{le:180,l:"warn",t:"erhöht"},{le:1e9,l:"alert",t:"deutlich erhöht (über 3× Obergrenze)"}] }
  },
  {
    id: "bili", group: "leber", name: "Bilirubin gesamt", alt: "ggf. direkt/indirekt", unit: "mg/dl",
    ref: "≤ 1,2 mg/dl (≤ 21 µmol/l)", fasting: "rec", tube: "Serum, lichtgeschützt", on: true,
    meaning: "Abbauprodukt des roten Blutfarbstoffs. Erhöht bei vermehrtem Abbau roter Blutkörperchen (Hämolyse, dann Anämie und Erschöpfung), bei Leberfunktionsstörung oder bei Gallestau.",
    high: "Gilbert-Meulengracht-Syndrom (harmlos, häufig, steigt beim Fasten), Hämolyse, Hepatitis, Gallestau, Gallensteine.",
    low: "Ohne klinische Bedeutung.",
    tip: "Ist nur das indirekte Bilirubin leicht erhöht und alle anderen Leberwerte normal, steckt oft ein Gilbert-Syndrom dahinter.",
    step: "Bei Erhöhung direktes/indirektes Bilirubin, Blutbild, Retikulozyten und LDH ergänzen.",
    bands: { all: [{le:1.2,l:"ok",t:"im Referenzbereich"},{le:2.0,l:"warn",t:"leicht erhöht"},{le:1e9,l:"alert",t:"deutlich erhöht"}] }
  },
  {
    id: "lipase", group: "pankreas", name: "Lipase", alt: "Pankreas-Lipase", unit: "U/l",
    ref: "ca. ≤ 60 U/l (laborabhängig)", fasting: "rec", tube: "Serum", on: true,
    meaning: "Fettspaltendes Verdauungsenzym, fast ausschließlich aus der Bauchspeicheldrüse. Eine chronische Pankreasentzündung kann die Fettverdauung stören. Folge sind Mangel an fettlöslichen Vitaminen (A, D, E, K) und B12 sowie Gewichtsverlust und Müdigkeit.",
    high: "Akute oder chronisch-rezidivierende Pankreatitis, Niereninsuffizienz, Gallenwegserkrankung, bestimmte Medikamente.",
    low: "Im Spätstadium einer chronischen Pankreatitis möglich, aber unzuverlässig.",
    tip: "Ein normaler Lipasewert schließt eine exokrine Pankreasinsuffizienz nicht aus. Dafür ist die Stuhl-Elastase aussagekräftiger.",
    step: "Bei Fettstühlen, Oberbauchbeschwerden oder Gewichtsverlust: Stuhl-Elastase und Bildgebung besprechen.",
    bands: { all: [{le:60,l:"ok",t:"im Referenzbereich"},{le:180,l:"warn",t:"erhöht"},{le:1e9,l:"alert",t:"deutlich erhöht (über 3× Obergrenze)"}] }
  },
  {
    id: "amylase", group: "pankreas", name: "Amylase", alt: "Gesamt- oder Pankreas-Amylase", unit: "U/l",
    ref: "Gesamt ca. ≤ 100 U/l (laborabhängig)", fasting: "rec", tube: "Serum", on: true,
    meaning: "Kohlenhydratspaltendes Enzym aus Bauchspeicheldrüse und Speicheldrüsen. Weniger spezifisch als die Lipase und daher nur als Ergänzung sinnvoll. Hinweis auf Pankreas- oder Speicheldrüsenerkrankung.",
    high: "Pankreatitis, Speicheldrüsenentzündung, Niereninsuffizienz, Makroamylasämie (harmlos), Essstörungen.",
    low: "Selten relevant.",
    tip: "Bei erhöhter Gesamt-Amylase kann die Pankreas-Amylase die Herkunft klären.",
    step: "Nur zusammen mit Lipase und Klinik interpretieren.",
    bands: { all: [{le:100,l:"ok",t:"im Referenzbereich"},{le:300,l:"warn",t:"erhöht"},{le:1e9,l:"alert",t:"deutlich erhöht (über 3× Obergrenze)"}] }
  },
  {
    id: "tsh", group: "schilddruese", name: "TSH basal", alt: "Thyreotropin", unit: "mIU/l",
    ref: "ca. 0,4 bis 4,0 mIU/l (laborabhängig)", fasting: "no", tube: "Serum", on: true,
    meaning: "Steuerhormon der Hirnanhangsdrüse. Steigt bei Schilddrüsenunterfunktion (verlangsamter Stoffwechsel, Kälteempfindlichkeit, Gewichtszunahme, Antriebslosigkeit) und sinkt bei Überfunktion (Unruhe, Herzrasen, Erschöpfung durch Dauerüberlastung).",
    high: "Hashimoto-Thyreoiditis (häufigste Ursache in Deutschland), Jodmangel, Medikamente (z. B. Lithium, Amiodaron), zu niedrig dosiertes L-Thyroxin.",
    low: "Schilddrüsenüberfunktion (Morbus Basedow, Autonomie), zu hoch dosiertes L-Thyroxin, Biotin-Interferenz.",
    tip: "TSH schwankt im Tagesverlauf, deshalb möglichst immer zur gleichen Tageszeit abnehmen. Biotin kann den Test verfälschen.",
    step: "Bei Abweichung: fT4 (ggf. fT3) und TPO-Antikörper, ggf. Schilddrüsen-Ultraschall.",
    bands: { all: [{lt:0.1,l:"alert",t:"deutlich erniedrigt (supprimiert)"},{lt:0.4,l:"warn",t:"erniedrigt"},{le:4.0,l:"ok",t:"im Referenzbereich"},{le:10,l:"warn",t:"erhöht"},{le:1e9,l:"alert",t:"deutlich erhöht"}] }
  },
  {
    id: "b12", group: "vitamine", name: "Vitamin B12 (Cobalamin)", alt: "Gesamt-B12", unit: "ng/l (= pg/ml)",
    ref: "Mangel < 180, Graubereich 180 bis 350, unauffällig > 350 ng/l", fasting: "no", tube: "Serum", on: true,
    meaning: "Wird für Blutbildung, DNA-Synthese und die Isolierung der Nervenfasern benötigt. Mangel verursacht Müdigkeit, Blutarmut, Konzentrationsstörungen, Kribbeln und Gedächtnisprobleme. Das Gesamt-B12 enthält viel inaktive Form und kann trotz Mangel normal wirken.",
    high: "Supplemente, Injektionen; selten Leber- oder Blutkrankheiten.",
    low: "Vegetarische/vegane Ernährung, atrophische Gastritis (Autoimmun), Metformin, Protonenpumpenhemmer, Magen-/Darmoperation, Zöliakie, Alkohol.",
    tip: "Im Graubereich liefert Holotranscobalamin (und ggf. Methylmalonsäure) die Klärung.",
    step: "Bei Mangel Ursache klären (Magen-Antikörper, Ernährung, Medikamente), bevor substituiert wird.",
    bands: { all: [{lt:180,l:"alert",t:"Mangel wahrscheinlich"},{le:350,l:"warn",t:"Graubereich, HoloTC ergänzen"},{le:1e9,l:"ok",t:"unauffällig"}] }
  },
  {
    id: "holotc", group: "vitamine", name: "Holotranscobalamin (HoloTC)", alt: "„aktives B12“", unit: "pmol/l",
    ref: "> 50 unauffällig, 35 bis 50 Graubereich, < 35 Mangel (pmol/l)", fasting: "no", tube: "Serum", on: true,
    meaning: "Der an Transcobalamin gebundene Anteil von B12, den die Körperzellen tatsächlich aufnehmen können. Gilt als frühester Marker eines B12-Mangels, noch bevor Blutbild oder Nerven betroffen sind.",
    high: "Eingeschränkte Nierenfunktion (falsch hoch), B12-Präparate kurz vor der Abnahme.",
    low: "Beginnender oder manifester B12-Mangel (Ursachen wie bei B12).",
    tip: "Im Graubereich 35 bis 50 pmol/l empfehlen Labore die Methylmalonsäure (MMA) zur Bestätigung. Das Ergebnis kann je nach Testverfahren leicht abweichen.",
    step: "Bei Grauwert: MMA und ggf. Homocystein, Nierenfunktion (Kreatinin) beachten.",
    bands: { all: [{lt:35,l:"alert",t:"Mangel wahrscheinlich"},{le:50,l:"warn",t:"Graubereich, MMA ergänzen"},{le:1e9,l:"ok",t:"Mangel unwahrscheinlich"}] }
  },
  {
    id: "vitd", group: "vitamine", name: "25-OH-Vitamin D3", alt: "25-Hydroxy-Cholecalciferol", unit: "ng/ml",
    ref: "Mangel < 12, suboptimal 12 bis < 20, ausreichend ≥ 20 ng/ml (= 50 nmol/l)", fasting: "no", tube: "Serum", on: true,
    meaning: "Speicherform von Vitamin D, wirkt als Hormonvorstufe auf Knochen, Muskulatur und Immunsystem. Ausgeprägter Mangel führt zu Muskelschwäche und Gliederschmerzen. Ein Zusammenhang allein mit Müdigkeit ist weniger gut belegt als der mit Muskel- und Knochenbeschwerden.",
    high: "Hochdosierte Supplemente über längere Zeit.",
    low: "Wenig Sonne, im Winterhalbjahr (in Mitteleuropa reicht die UV-B-Strahlung etwa von Oktober bis März kaum für die Hautbildung), dunklere Haut, Malabsorption, Adipositas, Leber-/Nierenerkrankung.",
    tip: "Im November spiegelt der Wert noch die Sommerreserve. Der Tiefpunkt kommt meist im Februar bis März. Eine Wiederholung im Spätwinter kann sinnvoll sein.",
    step: "Bei Mangel Dosierung und Dauer ärztlich festlegen lassen, Kontrolle nach etwa 3 Monaten.",
    bands: { all: [{lt:12,l:"alert",t:"Mangel"},{lt:20,l:"warn",t:"suboptimal"},{le:60,l:"ok",t:"ausreichend"},{le:100,l:"warn",t:"hoch, Supplementierung prüfen"},{le:1e9,l:"alert",t:"zu hoch"}] }
  },
  {
    id: "glu", group: "zucker", name: "Blutzucker nüchtern", alt: "Glukose (Plasma, venös)", unit: "mg/dl",
    ref: "70 bis 99 mg/dl (3,9 bis 5,5 mmol/l)", fasting: "must", tube: "Fluorid-Plasma", on: true,
    meaning: "Momentaufnahme der Energieversorgung. Zu hoch (Diabetes, Prädiabetes) macht müde und durstig, Schwankungen mit Unterzuckerung führen zu Leistungsabfall, Heißhunger und Zittrigkeit.",
    high: "Prädiabetes/Typ-2-Diabetes, nicht eingehaltene Nüchternheit, Stress, Cortison, akuter Infekt.",
    low: "Unterzuckerung durch Medikamente, langes Fasten, seltene Hormonstörungen.",
    tip: "Nur aussagekräftig, wenn wirklich 8 bis 12 Stunden nichts gegessen wurde. Ein einzelner erhöhter Wert muss bestätigt werden.",
    step: "Bei ≥ 100 mg/dl HbA1c ansehen und ggf. oralen Glukosetoleranztest besprechen.",
    bands: { all: [{lt:70,l:"warn",t:"niedrig"},{lt:100,l:"ok",t:"im Referenzbereich"},{lt:126,l:"warn",t:"erhöhte Nüchternglukose"},{le:1e9,l:"alert",t:"im diabetischen Bereich, Bestätigung nötig"}] }
  },
  {
    id: "hba1c", group: "zucker", name: "HbA1c (Langzeitzucker)", alt: "glykiertes Hämoglobin", unit: "%",
    ref: "< 5,7 % (< 39 mmol/mol)", fasting: "no", tube: "EDTA-Blut", on: true,
    meaning: "Durchschnittlicher Blutzucker der letzten 8 bis 12 Wochen. Unabhängig von Mahlzeiten und Tagesform und damit der beste Marker, um einen schleichenden Diabetes als Ursache von Müdigkeit zu erkennen oder auszuschließen.",
    high: "Prädiabetes (5,7 bis 6,4 %), Diabetes (≥ 6,5 %), Eisenmangel (kann HbA1c leicht anheben).",
    low: "Blutarmut durch Hämolyse oder Blutverlust, kürzlich Transfusion (falsch niedrig).",
    tip: "Bei Anämie oder Eisenmangel ist das HbA1c nur eingeschränkt verwertbar, die Nüchternglukose liefert dann die Gegenprobe.",
    step: "Bei ≥ 6,5 % Bestätigung und Diabetes-Abklärung; bei 5,7 bis 6,4 % Lebensstil und Verlaufskontrolle.",
    bands: { all: [{lt:5.7,l:"ok",t:"im Referenzbereich"},{lt:6.5,l:"warn",t:"Prädiabetes-Bereich"},{le:1e9,l:"alert",t:"diabetischer Bereich, Bestätigung nötig"}] }
  },
  {
    id: "chol", group: "fett", name: "Cholesterin gesamt", alt: "optional: LDL, HDL, Triglyzeride", unit: "mg/dl",
    ref: "< 200 mg/dl (< 5,2 mmol/l)", fasting: "rec", tube: "Serum", on: true,
    meaning: "Cholesterin selbst macht nicht müde. Es ist ein Begleitmarker: Eine Schilddrüsenunterfunktion treibt es nach oben, Malabsorption, Überfunktion oder schwere Lebererkrankung senken es. Zusätzlich gehört es zur Einschätzung des Gefäßrisikos.",
    high: "Familiäre Veranlagung, Ernährung, Hypothyreose, Nierenerkrankung, Diabetes.",
    low: "Hyperthyreose, Mangelernährung, Lebererkrankung, Malabsorption.",
    tip: "Für die Beurteilung sind LDL, HDL und Triglyzeride aussagekräftiger. Triglyzeride erfordern echte Nüchternheit.",
    step: "Bei Erhöhung Gesamtrisiko mit LDL/HDL/Triglyzeriden und TSH einordnen.",
    bands: { all: [{lt:200,l:"ok",t:"im Zielbereich"},{lt:240,l:"warn",t:"grenzwertig erhöht"},{le:1e9,l:"alert",t:"erhöht"}] }
  },
  {
    id: "ferritin", group: "eisen", name: "Ferritin", alt: "Speichereisen", unit: "µg/l",
    ref: "Eisenmangel < 30; 30 bis 100 Graubereich (mit CRP bewerten)", fasting: "no", tube: "Serum", on: true,
    meaning: "Eisenspeicher des Körpers. Eisen transportiert Sauerstoff und treibt Energiestoffwechsel und Neurotransmitter an. Schon ein Speichermangel ohne Blutarmut kann Müdigkeit, Leistungsknick, Haarausfall und Restless Legs verursachen.",
    high: "Entzündung (Akutphase-Protein), Fettleber, Alkohol, Hämochromatose, Tumorerkrankungen.",
    low: "Menstruation, Schwangerschaft, vegetarische Ernährung, chronischer Blutverlust (Magen-Darm), Zöliakie, Blutspende, Leistungssport.",
    tip: "Ferritin steigt bei Entzündung. Bei erhöhtem CRP kann der Speicher trotz „normalem“ Ferritin leer sein. Dann gilt ein Grenzwert von etwa 100 µg/l.",
    step: "Ferritin 30 bis 100: Transferrinsättigung und CRP ergänzen. Bei Mangel Blutungsquelle suchen, besonders bei Männern.",
    bands: { all: [{lt:30,l:"alert",t:"Eisenmangel wahrscheinlich"},{le:100,l:"warn",t:"Graubereich, mit CRP/Transferrinsättigung bewerten"},{le:300,l:"ok",t:"im Referenzbereich"},{le:1e9,l:"warn",t:"erhöht"}] }
  },
  {
    id: "crp", group: "eisen", name: "CRP", alt: "C-reaktives Protein", unit: "mg/l",
    ref: "< 5 mg/l", fasting: "no", tube: "Serum", on: true,
    meaning: "Akutphase-Protein der Leber. Steigt bei Infektionen und Entzündungen. Entzündungsbotenstoffe (z. B. IL-6) lösen Müdigkeit und Krankheitsgefühl direkt aus. Ein erhöhtes CRP relativiert außerdem das Ferritin.",
    high: "Infekt (auch abklingender), Autoimmunerkrankung, chronisch-entzündliche Darmerkrankung, Adipositas (leicht erhöht), Rauchen, Gewebeschaden.",
    low: "Normal. Ein normales CRP schließt eine chronische Entzündung nicht völlig aus.",
    tip: "Bei Infekt in den letzten zwei Wochen verfälscht CRP das Gesamtbild. Termin lieber nach vollständiger Genesung.",
    step: "Bei Erhöhung nach 2 Wochen wiederholen, bei Persistenz BSG, Blutbild und gezielte Suche.",
    bands: { all: [{lt:5,l:"ok",t:"im Referenzbereich"},{le:10,l:"warn",t:"leicht erhöht"},{le:1e9,l:"alert",t:"deutlich erhöht"}] }
  },
  /* Optional */
  { id: "bb", group: "extra", name: "Kleines Blutbild + Differenzialblutbild", alt: "Hb, MCV, Leukozyten, Thrombozyten", fasting: "no", tube: "EDTA-Blut", on: false,
    ref: "laborabhängig",
    meaning: "Zeigt Blutarmut und ihre Art: MCV niedrig weist auf Eisenmangel, MCV hoch auf B12- oder Folsäuremangel. Wichtig zur Einordnung von Ferritin, B12 und HbA1c." },
  { id: "krea", group: "extra", name: "Kreatinin / eGFR", alt: "Nierenfunktion", fasting: "rec", tube: "Serum", on: false,
    ref: "laborabhängig",
    meaning: "Eine eingeschränkte Nierenfunktion verursacht Müdigkeit und beeinflusst HoloTC, Lipase und Amylase." },
  { id: "elyt", group: "extra", name: "Elektrolyte (Natrium, Kalium, Calcium)", alt: "", fasting: "no", tube: "Serum", on: false,
    ref: "laborabhängig",
    meaning: "Natriummangel, Kaliumstörungen und erhöhtes Calcium verursachen Schwäche und Müdigkeit." },
  { id: "tg", group: "extra", name: "Triglyzeride, HDL, LDL", alt: "komplettes Lipidprofil", fasting: "must", tube: "Serum", on: false,
    ref: "laborabhängig",
    meaning: "Ergänzt das Gesamtcholesterin. Triglyzeride sind nur nach 12 Stunden Nüchternheit verwertbar." },
  { id: "tsat", group: "extra", name: "Eisen + Transferrinsättigung", alt: "", fasting: "must", tube: "Serum", on: false,
    ref: "Transferrinsättigung < 20 % spricht für Eisenmangel",
    meaning: "Klärt Ferritin im Graubereich oder bei erhöhtem CRP. Serumeisen schwankt stark und ist nur morgens und nüchtern verwertbar." },
  { id: "ft4", group: "extra", name: "fT4 (ggf. fT3), TPO-Antikörper", alt: "bei auffälligem TSH", fasting: "no", tube: "Serum", on: false,
    ref: "laborabhängig",
    meaning: "Sinnvoll, wenn TSH außerhalb des Referenzbereichs liegt. Unterscheidet manifeste von latenter Funktionsstörung, TPO weist auf Hashimoto hin." },
  { id: "folat", group: "extra", name: "Folsäure", alt: "", fasting: "rec", tube: "Serum/EDTA", on: false,
    ref: "laborabhängig",
    meaning: "Mangel verursacht wie B12 eine Blutarmut mit großen roten Blutkörperchen und Müdigkeit." },
  { id: "ck", group: "extra", name: "CK (Kreatinkinase)", alt: "Muskelenzym", fasting: "no", tube: "Serum", on: false,
    ref: "laborabhängig",
    meaning: "Erhöht bei Muskelschaden oder Muskelerkrankung. Hilfreich bei Muskelschwäche oder erhöhter GOT. Vor der Abnahme 48 h keinen Leistungssport." },
  { id: "cortisol", group: "extra", name: "Cortisol morgens (8 Uhr)", alt: "bei Verdacht auf Nebenniereninsuffizienz", fasting: "rec", tube: "Serum", on: false,
    ref: "laborabhängig",
    meaning: "Nur bei klinischem Verdacht (Schwindel, Salzhunger, Gewichtsverlust, Hautverfärbung, Cortison-Vorbehandlung)." },
  { id: "ttg", group: "extra", name: "Zöliakie-Serologie (tTG-IgA + Gesamt-IgA)", alt: "", fasting: "no", tube: "Serum", on: false,
    ref: "laborabhängig",
    meaning: "Zöliakie ist eine häufige, oft unerkannte Ursache für Eisen-, B12- und Vitamin-D-Mangel. Unter glutenfreier Kost wird der Test unzuverlässig." }
];

window.PLAN = [
  { id: "ph1", no: 1, title: "Vorbereiten", range: "3. bis 8. November", from: [2026,11,3], to: [2026,11,8],
    goal: "Klarheit schaffen, was untersucht wird und was die Praxis dazu braucht.",
    tasks: [
      { id: "t1", text: "Symptomtagebuch starten: täglich Energie (0 bis 10), Schlafdauer, Belastung, Stimmung. Zwei Minuten abends genügen.", detail: "Das Tagebuch hilft später, Muster zu erkennen (z. B. Zusammenhang mit Schlaf, Zyklus, Belastung) und gibt der Ärztin oder dem Arzt konkrete Anhaltspunkte." },
      { id: "t2", text: "Medikamente und Nahrungsergänzung notieren (Biotin, Eisen, B12, Vitamin D, Schilddrüsenhormone, Statine, Protonenpumpenhemmer).", detail: "Einige Präparate verfälschen Messwerte oder verursachen selbst Müdigkeit. Besonders Biotin stört mehrere Immunoassays (z. B. TSH)." },
      { id: "t3", text: "Warnzeichen prüfen (Kasten oben). Bei einem Warnzeichen nicht bis zum Termin warten.", detail: "" },
      { id: "t4", text: "Termin für die Blutentnahme vereinbaren: morgens zwischen 7 und 9 Uhr, nüchtern, wenn möglich Montag bis Mittwoch.", detail: "Frühe Wochentage haben den Vorteil, dass Ergebnisse noch in derselben Woche vorliegen und Spezialwerte nicht über das Wochenende liegen bleiben." },
      { id: "t5", text: "Kosten klären: Vitamin D, Holotranscobalamin und einzelne weitere Werte sind ohne konkreten Verdacht häufig Selbstzahlerleistungen.", detail: "Ob die Kasse einen Wert übernimmt, entscheidet die medizinische Indikation. Fragen Sie in der Praxis vorher nach dem Preis (IGeL) und lassen Sie sich die Begründung für die Kassenleistung erläutern." }
    ] },
  { id: "ph2", no: 2, title: "Blutentnahme", range: "9. bis 13. November", from: [2026,11,9], to: [2026,11,13],
    goal: "Eine saubere, vergleichbare Probe: morgens, nüchtern, ohne Störfaktoren.",
    tasks: [
      { id: "t6", text: "48 Stunden vorher: kein Alkohol, kein Leistungssport. Hoch dosiertes Biotin nach Rücksprache pausieren.", detail: "Alkohol hebt GGT, GPT und Triglyzeride. Intensives Training hebt GOT, CK und CRP. Biotin (häufig in Haar- und Nagelpräparaten) kann TSH und andere Immunoassays verfälschen." },
      { id: "t7", text: "Am Vorabend leicht essen, ab etwa 20 Uhr nur noch Wasser oder ungesüßten Tee.", detail: "Nüchtern bedeutet 8 bis 12 Stunden ohne Kalorien. Mehr als 14 Stunden Fasten kann Bilirubin (Gilbert) und Triglyzeride verändern." },
      { id: "t8", text: "Morgens: Wasser trinken, nichts essen, keinen Kaffee mit Milch/Zucker, nicht rauchen. Schilddrüsentabletten erst nach der Abnahme.", detail: "Wasser ist erwünscht, weil es die Venen füllt. Alle übrigen Medikamente nur nach ärztlicher Absprache auslassen." },
      { id: "t9", text: "Mitnehmen: Versichertenkarte, ausgedruckte Wunschliste, Medikamentenliste, Frühstück für danach.", detail: "" },
      { id: "t10", text: "Bei Fieber oder Infekt der letzten zwei Wochen den Termin verschieben.", detail: "CRP und Ferritin sind bei Infekt erhöht und führen zu Fehlinterpretationen." },
      { id: "t11", text: "Abnahme erledigt. Frühstücken, genug trinken. Klären, wann und wie die Befunde verfügbar sind.", detail: "Basiswerte liegen meist nach 1 bis 2 Tagen vor, Vitamin D und HoloTC teils nach mehreren Tagen." }
    ] },
  { id: "ph3", no: 3, title: "Befund einordnen", range: "16. bis 22. November", from: [2026,11,16], to: [2026,11,22],
    goal: "Werte im Zusammenhang lesen und gezielt weiterfragen.",
    tasks: [
      { id: "t12", text: "Befund mit Referenzbereichen des Labors besorgen (Ausdruck, Portal oder Foto).", detail: "Referenzbereiche unterscheiden sich je nach Labor und Methode. Maßgeblich ist immer der Bereich auf Ihrem Befund." },
      { id: "t13", text: "Werte im Reiter „Befund-Check“ eintragen und die Hinweise notieren.", detail: "Der Befund-Check ist eine Orientierung, keine Diagnose." },
      { id: "t14", text: "Fragenliste für das Gespräch zusammenstellen (siehe Ursachen-Reiter).", detail: "" },
      { id: "t15", text: "Folgediagnostik besprechen, falls nötig: fT4/TPO, MMA, Transferrinsättigung, Blutbild, Ultraschall, Stuhl-Elastase.", detail: "" },
      { id: "t16", text: "Auch bei normalen Werten besprechen: Schlafqualität (Schlafapnoe?), Stimmung, Medikamente, Belastung.", detail: "Häufige Ursachen chronischer Müdigkeit lassen sich nicht im Blut finden." }
    ] },
  { id: "ph4", no: 4, title: "Handeln & Verlauf", range: "23. bis 30. November", from: [2026,11,23], to: [2026,11,30],
    goal: "Behandlung festlegen, Kontrollen terminieren, Entwicklung beobachten.",
    tasks: [
      { id: "t17", text: "Bei Mangel: Ursache, Präparat, Dosis und Dauer mit der Ärztin oder dem Arzt festlegen. Nicht auf Verdacht substituieren.", detail: "Eisen, B12 und Vitamin D haben unterschiedliche Ursachen und Risiken bei Überdosierung." },
      { id: "t18", text: "Kontrolltermine eintragen: Ferritin, B12/HoloTC und Vitamin D meist nach etwa 8 bis 12 Wochen (Januar/Februar 2027).", detail: "Den genauen Zeitpunkt legt die Ärztin oder der Arzt je nach Befund fest." },
      { id: "t19", text: "Tagebuch auswerten: Gibt es Muster bei Schlaf, Belastung, Tageszeit?", detail: "" },
      { id: "t20", text: "Bei unauffälligen Werten und anhaltender Müdigkeit: weiteres Vorgehen planen (Schlaflabor, psychosomatische oder Fachärztliche Abklärung).", detail: "Anhaltende Müdigkeit über 6 Monate, Belastungsintoleranz oder Verschlechterung nach Anstrengung sind Anlass für eine weiterführende Abklärung." }
    ] }
];

window.WARN = [
  "Brustschmerz, Luftnot, Ohnmacht oder Herzrasen in Ruhe",
  "Schwarzer oder blutiger Stuhl, Bluterbrechen",
  "Ungewollter Gewichtsverlust (mehr als 5 % in 6 Monaten), Nachtschweiß oder anhaltendes Fieber",
  "Gelbfärbung von Haut oder Augen, starke Oberbauchschmerzen",
  "Anhaltende Niedergeschlagenheit, Hoffnungslosigkeit oder Suizidgedanken (sofort Hilfe: 116 117, Telefonseelsorge 0800 111 0 111, Notruf 112)"
];

window.MEDS = [
  { id: "biotin", name: "Biotin (Haar/Nagel)", advice: "Bei hoher Dosierung (häufig 5 bis 10 mg) vor der Abnahme mindestens 3 Tage pausieren, nach Rücksprache. Biotin kann TSH, Vitamin D, B12, Ferritin und andere Immunoassays verfälschen." },
  { id: "thyrox", name: "L-Thyroxin", advice: "Am Abnahmetag erst nach der Blutentnahme einnehmen. Sonst kann fT4 vorübergehend zu hoch gemessen werden." },
  { id: "eisen", name: "Eisenpräparat", advice: "Mindestens 24 bis 48 Stunden vor der Abnahme nicht einnehmen, sonst steigen Serumeisen und Transferrinsättigung. Ferritin ändert sich kaum, ein Ausgangswert ohne Präparat ist aber aussagekräftiger. Nicht eigenmächtig absetzen." },
  { id: "b12", name: "B12-Präparat", advice: "Am Abnahmetag nicht einnehmen und der Praxis mitteilen. Unter Substitution sind B12 und HoloTC erhöht und sagen nichts über den Ausgangsstatus aus." },
  { id: "vitd", name: "Vitamin-D-Präparat", advice: "Weiter einnehmen, aber der Praxis mitteilen. Der Wert zeigt dann die Versorgung unter Einnahme, nicht den Ausgangsstatus." },
  { id: "statin", name: "Statin", advice: "Nicht absetzen. Statine können GOT/GPT und CK leicht erhöhen und selbst Muskelbeschwerden machen. Die Ärztin oder der Arzt sollte das wissen." },
  { id: "ppi", name: "Säureblocker (PPI)", advice: "Nicht absetzen. Langzeiteinnahme kann B12- und Eisenaufnahme senken, relevant für die Interpretation." },
  { id: "metformin", name: "Metformin", advice: "Nicht absetzen. Langzeitgebrauch kann zu B12-Mangel führen. Wichtig für die Interpretation von B12/HoloTC." }
];

window.PREP = [
  { when: "48 Stunden vorher", items: [
    "Kein Alkohol (beeinflusst GGT, GPT, Triglyzeride)",
    "Kein intensives Training oder Leistungssport (beeinflusst GOT, CK, CRP)",
    "Hoch dosiertes Biotin nach Rücksprache pausieren"] },
  { when: "Am Vorabend", items: [
    "Leichte Abendmahlzeit, wenig Fett und Zucker",
    "Ab etwa 20 Uhr nur Wasser oder ungesüßter Tee",
    "Ausreichend schlafen, früh ins Bett"] },
  { when: "Am Morgen", items: [
    "8 bis 12 Stunden nüchtern, 7 bis 9 Uhr Abnahme",
    "Ein bis zwei Gläser Wasser trinken",
    "Kein Kaffee, kein Kaugummi, kein Rauchen, keine Süßigkeiten",
    "Schilddrüsentabletten und B12-/Eisenpräparate erst nach der Abnahme"] },
  { when: "In der Praxis", items: [
    "Einnahme von Medikamenten und Präparaten mitteilen",
    "Beim Stauen Faust nicht kräftig pumpen (kann Kalium und Laktat verfälschen)",
    "Bei Schwindel früh Bescheid sagen und liegend abnehmen lassen"] },
  { when: "Danach", items: [
    "Frühstücken und viel trinken",
    "Befundzugang und Besprechungstermin klären",
    "Werte nur mit Referenzbereichen des eigenen Labors vergleichen"] }
];

window.CAUSES = [
  { id: "c1", name: "Eisenmangel", freq: "sehr häufig", labs: ["ferritin","crp"], pattern: "Ferritin niedrig (< 30 µg/l), bei Entzündung bis 100 µg/l möglich. Blutbild: MCV niedrig, später Hb niedrig. Transferrinsättigung < 20 %.", prep: "Menstruation, Ernährung, Magen-Darm-Blutung, Zöliakie ausschließen." },
  { id: "c2", name: "Vitamin-B12-Mangel", freq: "häufig", labs: ["b12","holotc"], pattern: "HoloTC < 35 pmol/l, B12 niedrig oder im Graubereich, MMA erhöht, MCV oft hoch.", prep: "Ernährung (vegan), Metformin, PPI, autoimmune Gastritis (Intrinsic-Factor-AK)." },
  { id: "c3", name: "Schilddrüsenfunktionsstörung", freq: "häufig", labs: ["tsh","chol"], pattern: "TSH hoch (Unterfunktion) oder niedrig (Überfunktion), Cholesterin kann mitreagieren. Ergänzend fT4, TPO-AK.", prep: "Hashimoto, Jodmangel, Medikamente, zu hoch dosiertes L-Thyroxin." },
  { id: "c4", name: "Prädiabetes / Diabetes", freq: "häufig", labs: ["glu","hba1c"], pattern: "Nüchternglukose ≥ 100 mg/dl, HbA1c ≥ 5,7 %. Oft Durst, häufiges Wasserlassen, Heißhunger.", prep: "Familiäre Belastung, Übergewicht, Bewegungsmangel." },
  { id: "c5", name: "Lebererkrankung (Fettleber, Alkohol, Hepatitis)", freq: "häufig", labs: ["got","gpt","ggt","bili"], pattern: "GPT/GGT erhöht, GOT mitbeteiligt, Bilirubin bei Fortschreiten erhöht. Oft vergesellschaftet mit Prädiabetes und erhöhten Triglyzeriden.", prep: "Ultraschall, Alkoholanamnese, Hepatitis-Serologie, Medikamentenliste." },
  { id: "c6", name: "Pankreas: chronische Entzündung oder exokrine Insuffizienz", freq: "selten", labs: ["lipase","amylase"], pattern: "Lipase/Amylase erhöht oder normal. Fettstühle, Oberbauchschmerz, Gewichtsverlust. Mangel an fettlöslichen Vitaminen und B12.", prep: "Stuhl-Elastase, Bildgebung. Auf Alkohol und Gallenwege achten." },
  { id: "c7", name: "Chronische Entzündung / Infekt / Autoimmunerkrankung", freq: "mittel", labs: ["crp","ferritin"], pattern: "CRP erhöht, Ferritin erhöht oder „falsch normal“, ggf. BSG erhöht, Anämie bei chronischer Erkrankung.", prep: "Infekt ausheilen lassen und wiederholen. Bei Persistenz Autoimmun- und Darmdiagnostik." },
  { id: "c8", name: "Vitamin-D-Mangel (Winterhalbjahr)", freq: "häufig", labs: ["vitd"], pattern: "25-OH-Vitamin D < 12 ng/ml (Mangel) bzw. < 20 ng/ml (suboptimal). Muskel- und Knochenschmerzen.", prep: "Im November noch Sommerreserve, Tiefpunkt Februar/März. Malabsorption bedenken." },
  { id: "c9", name: "Nieren- oder Blutbildveränderung", freq: "mittel", labs: [], pattern: "Kreatinin/eGFR, Elektrolyte, Blutbild auffällig. Gehört zur Basisabklärung, deshalb als Ergänzung vorgeschlagen.", prep: "Im Reiter Checkliste unter „Sinnvolle Ergänzungen“ auswählbar." }
];

window.NORMAL_CAUSES = [
  "Schlafmangel, schlechte Schlafqualität, Schichtarbeit",
  "Schlafapnoe (Schnarchen, Atemaussetzer, Tagesschläfrigkeit): Epworth-Skala und ggf. Schlaflabor",
  "Depression, Angst, Burnout, chronischer Stress (PHQ-2/PHQ-9 beim Arzt)",
  "Medikamente (z. B. Betablocker, Antihistaminika, Antidepressiva, Opioide)",
  "Alkohol, Nikotin, Koffeinkonsum, Bewegungsmangel",
  "Post-Infekt-Syndrom, Long COVID, ME/CFS (Verschlechterung nach Belastung als Leitsymptom)",
  "Herz- und Lungenerkrankungen, Asthma, Allergien",
  "Nahrungsmittelunverträglichkeiten, Zöliakie, Essstörungen"
];

window.QUESTIONS = [
  "Welche Werte sind auffällig und was bedeutet das für meine Müdigkeit?",
  "Sollen auffällige Werte wiederholt oder ergänzt werden (z. B. fT4, MMA, Transferrinsättigung)?",
  "Welche Ursache liegt hinter einem Mangel und muss sie abgeklärt werden?",
  "Brauche ich ein Präparat, in welcher Dosis und wie lange?",
  "Wann soll kontrolliert werden?",
  "Was kommt in Frage, wenn die Werte unauffällig sind (Schlaf, Stimmung, Medikamente)?"
];
