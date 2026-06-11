/* Upgrade-ronde 2: FAQ + premies + werkgebied (home), lightbox, foto-upload,
   skip-link, to-top. Run: node upgrade-2.mjs                                 */
import { readFile, writeFile } from "node:fs/promises";

const TOTOP = `  <button class="to-top" aria-label="Terug naar boven">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 14 6-6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>

  <!-- TODO: vervang 32400000000 door het echte WhatsApp-nummer -->`;

const plus = `<span class="plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg></span>`;

const homeFaq = [
  { q: "Hoeveel kost een isolatie- of renovatieproject?", a: "Elk project is maatwerk: de prijs hangt af van de oppervlakte, materialen en de staat van uw woning. Na een gratis plaatsbezoek ontvangt u een heldere offerte met een vaste prijsafspraak — zonder verrassingen achteraf." },
  { q: "Helpen jullie bij premie-aanvragen?", a: "Ja. Vlaanderen ondersteunt isolatie- en renovatiewerken met premies zoals Mijn VerbouwPremie. Wij bekijken welke premies voor uw project gelden en helpen u bij de aanvraag." },
  { q: "Hoe snel kunnen jullie starten?", a: "Na het plaatsbezoek krijgt u meteen een realistische planning. Voor dringende herstellingen, zoals een daklek, proberen we zo snel mogelijk ter plaatse te zijn." },
  { q: "Werken jullie met onderaannemers?", a: "Nee, alle werken worden uitgevoerd door onze eigen vaklui. Zo bewaken we de kwaliteit en heeft u steeds één vast aanspreekpunt." },
  { q: "Welke garantie krijg ik op de werken?", a: "U krijgt garantie op de uitvoering en alle afspraken staan zwart op wit in de offerte. Ook na de oplevering blijven we bereikbaar voor vragen of opvolging." },
  { q: "In welke regio zijn jullie actief?", a: "Wij werken in Antwerpen en de ruime regio errond: Brasschaat, Schoten, Kapellen, Ekeren, Merksem, Wijnegem, Wommelgem, Mortsel en omliggende gemeenten." },
];

const faqDetails = homeFaq.map((f) => `          <details>
            <summary>${f.q} ${plus}</summary>
            <p class="faq__body">${f.a}</p>
          </details>`).join("\n");

const faqSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": homeFaq.map((f) => ({
    "@type": "Question", "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
});

const PREMIES = `    <!-- ===================== PREMIES ===================== -->
    <section class="section--tight premies">
      <div class="container premies__inner reveal">
        <div class="premies__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M14.5 8.5a3.5 3.5 0 1 0 0 7M8 10.5h5M8 13.5h5" stroke-linecap="round"/></svg></div>
        <div class="premies__text">
          <h2>Wij helpen u aan uw renovatiepremie</h2>
          <p>Vlaanderen ondersteunt isolatie- en renovatiewerken met premies zoals Mijn VerbouwPremie. Wij bekijken welke premies voor uw project gelden en begeleiden u bij de aanvraag — zo haalt u het maximum uit uw budget.</p>
        </div>
        <a class="btn btn--primary" href="contact.html">Vraag premie-advies <span class="arrow">&rarr;</span></a>
      </div>
    </section>

`;

const FAQ_REGIO = `    <!-- ===================== FAQ ===================== -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal"><h2>Veelgestelde vragen</h2><p>Zit uw vraag er niet bij? Neem gerust contact op &mdash; we antwoorden binnen één werkdag.</p></div>
        <div class="faq reveal">
${faqDetails}
        </div>
      </div>
    </section>

    <!-- ===================== WERKGEBIED ===================== -->
    <section class="section--tight">
      <div class="container">
        <div class="section-head reveal"><h2>Ons werkgebied</h2><p>Actief in Antwerpen en de ruime regio errond.</p></div>
        <div class="regio-chips reveal">
          <span>Antwerpen</span><span>Brasschaat</span><span>Schoten</span><span>Kapellen</span>
          <span>Ekeren</span><span>Merksem</span><span>Deurne</span><span>Wijnegem</span>
          <span>Wommelgem</span><span>Mortsel</span><span>Edegem</span><span>Aartselaar</span>
          <span>Kontich</span><span>Stabroek</span><span>+ omliggende gemeenten</span>
        </div>
      </div>
    </section>

`;

const files = ["index.html", "over-ons.html", "diensten.html", "realisaties.html", "realisatie-detail.html", "contact.html"];

for (const file of files) {
  let html = await readFile(file, "utf8");

  // skip-link na <body>
  if (!html.includes("skip-link")) {
    html = html.replace("<body>\n", `<body>\n\n  <a class="skip-link" href="#main">Meteen naar de inhoud</a>\n`);
  }
  // main-id
  html = html.replace('<main class="page">', '<main class="page" id="main">');
  html = html.replace(/<main>(\s*)/, '<main id="main">$1');

  // to-top knop vóór de WhatsApp-knop
  if (!html.includes("to-top")) {
    html = html.replace("  <!-- TODO: vervang 32400000000 door het echte WhatsApp-nummer -->", TOTOP);
  }

  if (file === "index.html") {
    // premies vóór de vergelijkingssectie
    html = html.replace("    <!-- ===================== VERGELIJKING (buildra-stijl) ===================== -->", PREMIES + "    <!-- ===================== VERGELIJKING (buildra-stijl) ===================== -->");
    // FAQ + werkgebied vóór het CTA-blok
    html = html.replace("    <!-- ===================== CTA-BLOK ===================== -->", FAQ_REGIO + "    <!-- ===================== CTA-BLOK ===================== -->");
    // FAQPage-schema naast het LocalBusiness-schema
    html = html.replace("  <link rel=\"icon\" href=\"assets/img/favicon.svg\" type=\"image/svg+xml\" />", `  <script type="application/ld+json">${faqSchema}</script>\n  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml" />`);
  }

  if (file === "contact.html") {
    // foto-uploadveld (frontend-klaar; werkt zodra backend gekoppeld is)
    html = html.replace(`            <label class="form__consent">`, `            <div class="field">
              <label for="fotos">Foto's van uw woning (optioneel)</label>
              <input id="fotos" name="fotos" type="file" accept="image/*" multiple />
            </div>
            <label class="form__consent">`);
  }

  if (file === "realisatie-detail.html") {
    html = html.replace(`  <script src="js/before-after.js"></script>`, `  <script src="js/before-after.js"></script>\n  <script src="js/lightbox.js"></script>`);
  }

  await writeFile(file, html, "utf8");
  console.log("✓", file);
}
console.log("Klaar.");
