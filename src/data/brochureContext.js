const BROCHURE_CONTEXT = {
  "6-13": {
    title: "Die Geschichte der Schweiz",
    sections: [
      { pages: "6–8", heading: "Gründung der Eidgenossenschaft", content: "Im Jahr 1291 schlossen Uri, Schwyz und Unterwalden den Bundesbrief — den Gründungsakt der Schweizer Eidgenossenschaft. Die Eidgenossen kämpften für ihre Unabhängigkeit und besiegten Habsburg bei Morgarten (1315) und Sempach (1386)." },
      { pages: "9–10", heading: "Reformation und Neutralität", content: "Der Wiener Kongress 1815 anerkannte die immerwährende Neutralität der Schweiz. Seit 1815 hat die Schweiz an keinem Krieg teilgenommen. Napoleon Bonaparte schuf 1798 kurzzeitig die Helvetische Republik als Zentralstaat." },
      { pages: "11–13", heading: "Moderner Bundesstaat", content: "1848 wurde der moderne Bundesstaat gegründet mit einer liberalen Verfassung. Das Frauenstimmrecht wurde auf Bundesebene erst 1971 eingeführt. 2002 trat die Schweiz der UNO bei." }
    ]
  },
  "14-25": {
    title: "Die Politik in der Schweiz",
    sections: [
      { pages: "14–17", heading: "Bundesrat und Regierung", content: "Der Bundesrat besteht aus 7 Mitgliedern und ist die Exekutive. Er regiert nach dem Kollegialprinzip — alle Mitglieder vertreten Entscheide nach aussen gleich. Der Bundeskanzler unterstützt den Bundesrat." },
      { pages: "18–21", heading: "Parlament und Gesetzgebung", content: "Das Parlament (Bundesversammlung) besteht aus Nationalrat (200 Sitze) und Ständerat (46 Sitze). Gesetze entstehen durch das Zweikammerprinzip. Bürger können mit der Initiative neue Gesetze vorschlagen oder mit dem Referendum bestehende stoppen." },
      { pages: "22–25", heading: "Föderalismus und Kantone", content: "Die Schweiz hat 26 Kantone. Jeder Kanton hat eigene Verfassung, Parlament und Regierung. Das Ständemehr bedeutet Mehrheit der Kantone — wichtig bei Verfassungsänderungen." }
    ]
  },
  "26-39": {
    title: "Rechte, Pflichten und Sozialversicherungen",
    sections: [
      { pages: "26–31", heading: "Grundrechte und Pflichten", content: "Die Bundesverfassung garantiert Grundrechte: Meinungsfreiheit, Versammlungsfreiheit, Religionsfreiheit. Pflichten umfassen Steuerzahlen, Schulpflicht und Militärdienst (für Männer) oder Zivildienst." },
      { pages: "36–39", heading: "Sozialversicherungen", content: "Die AHV (Alters- und Hinterlassenenversicherung) ist die wichtigste Sozialversicherung. Die IV sichert bei Invalidität, die ALV bei Arbeitslosigkeit. Die Krankenkasse (KVG) ist obligatorisch für alle." }
    ]
  },
  "40-45": {
    title: "Feste, Traditionen und Kultur",
    sections: [
      { pages: "40–42", heading: "Schweizer Feste", content: "Der Nationalfeiertag ist am 1. August. Das Sechseläuten in Zürich (Böögg-Verbrennen) markiert den Frühlingsbeginn. Fasnacht wird in Basel und anderen Städten gefeiert. Das Schwingen ist ein traditioneller Schweizer Ringkampf." },
      { pages: "43–45", heading: "Kultur und Sprachen", content: "Die Schweiz hat 4 Landessprachen: Deutsch (63%), Französisch (23%), Italienisch (8%), Rätoromanisch (1%). Schweizerdeutsch (Dialekt) ist im Alltag verbreitet. William Tell ist die wichtigste Schweizer Sagengestalt." }
    ]
  },
  "46-53": {
    title: "Die Geografie der Schweiz",
    sections: [
      { pages: "46–49", heading: "Landschaften und Regionen", content: "Die Schweiz gliedert sich in Jura, Mittelland und Alpen. Der Rhein, die Rhone, der Inn und die Aare sind die wichtigsten Flüsse. Der Bodensee, Genfersee und Vierwaldstättersee sind die grössten Seen." },
      { pages: "50–53", heading: "Städte und Bevölkerung", content: "Bern ist die Bundesstadt (nicht Hauptstadt). Zürich ist die grösste Stadt. Basel, Genf und Lausanne sind weitere wichtige Städte. Die Bevölkerung beträgt ca. 8.7 Millionen. Die Schweiz grenzt an Deutschland, Frankreich, Italien, Österreich und Liechtenstein." }
    ]
  },
  "54-65": {
    title: "Der Kanton Zürich",
    sections: [
      { pages: "54–57", heading: "Politische Struktur Zürich", content: "Der Kanton Zürich hat einen Kantonsrat (180 Sitze), einen Regierungsrat (7 Mitglieder) und ein Obergericht. Die Gemeinden haben eigene Gemeinderäte." },
      { pages: "58–61", heading: "Geografie Zürich", content: "Zürich ist der bevölkerungsreichste Kanton der Schweiz. Der Zürichsee, die Limmat und die Glatt sind wichtige Gewässer. Der Üetliberg ist der Hausberg Zürichs." },
      { pages: "62–65", heading: "Kultur und Geschichte Zürichs", content: "Zürich war Zentrum der Reformation unter Ulrich Zwingli (1519). Das Schweizerische Nationalmuseum befindet sich in Zürich. Die Universität Zürich und die ETH Zürich sind weltbekannte Bildungsinstitutionen." }
    ]
  }
};

export function getBrochureContent(pages) {
  const ranges = Object.keys(BROCHURE_CONTEXT);
  const pageNum = pages[0] || 14;
  for (const range of ranges) {
    const [start, end] = range.split("-").map(Number);
    if (pageNum >= start && pageNum <= end) return BROCHURE_CONTEXT[range];
  }
  return BROCHURE_CONTEXT["14-25"];
}

export default BROCHURE_CONTEXT;
