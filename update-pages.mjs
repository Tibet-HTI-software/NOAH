/* Eenmalige update: foto's, WhatsApp-knop en OG-meta op alle losse pagina's.
   Run: node update-pages.mjs                                                */
import { readFile, writeFile } from "node:fs/promises";

const WA = `  <!-- TODO: vervang 32400000000 door het echte WhatsApp-nummer -->
  <a class="wa-float" href="https://wa.me/32400000000" target="_blank" rel="noopener" aria-label="Chat met NOAH via WhatsApp">
    <svg viewBox="0 0 32 32"><path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.3c1.9 1 4 1.6 6.2 1.6 6.6 0 12-5.3 12-11.9 0-3.2-1.3-6.2-3.5-8.4C23.7 4.7 20.7 3 16 3zm0 21.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.3 1.4 1.4-4.2-.3-.4c-1.1-1.6-1.7-3.5-1.7-5.5 0-5.5 4.5-9.9 10-9.9 2.7 0 5.2 1 7 2.9 1.9 1.9 2.9 4.4 2.9 7 .1 5.4-4.4 9.9-9.9 9.9zm5.5-7.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2s-.8 1-.9 1.2c-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/></svg>
  </a>

  <script src="js/main.js"></script>`;

const og = (title, desc, path, img) => `  <!-- TODO: vervang noah-isolatie.be door het echte domein zodra gekend -->
  <link rel="canonical" href="https://noah-isolatie.be/${path}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="https://noah-isolatie.be/assets/img/${img}" />
  <meta property="og:locale" content="nl_BE" />
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml" />`;

const pages = {
  "diensten.html": {
    og: og("Onze diensten — NOAH Isolatie & Renovatie", "Isolatie, renovatie, gevelbekleding en dakwerken in regio Antwerpen.", "diensten.html", "dienst-dak.jpg"),
  },
  "realisaties.html": {
    og: og("Realisaties — NOAH Isolatie & Renovatie", "Een selectie van onze isolatie- en renovatieprojecten in regio Antwerpen.", "realisaties.html", "realisaties/after.jpg"),
  },
  "realisatie-detail.html": {
    og: og("Totaalrenovatie rijwoning — NOAH Realisaties", "Projectvoorbeeld: totaalrenovatie van een rijwoning in Antwerpen.", "realisatie-detail.html", "realisaties/slider-after.jpg"),
  },
  "contact.html": {
    og: og("Contact & offerte — NOAH Isolatie & Renovatie", "Vraag vrijblijvend advies of een offerte op maat aan.", "contact.html", "hero-new.jpg"),
  },
  "over-ons.html": {
    og: og("Over ons — NOAH Isolatie & Renovatie", "Vakmanschap met een persoonlijke aanpak in regio Antwerpen.", "over-ons.html", "over-ons.jpg"),
  },
};

const img = (src, alt) => `<div class="dienst-card__img"><img src="${src}" alt="${alt}" loading="lazy" /></div>`;

for (const [file, cfg] of Object.entries(pages)) {
  let html = await readFile(file, "utf8");

  // OG meta i.p.v. kale favicon-regel
  html = html.replace(`  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml" />`, cfg.og);

  // WhatsApp-knop vóór main.js (eenmalig)
  if (!html.includes("wa-float")) {
    html = html.replace(`  <script src="js/main.js"></script>`, WA);
  }

  // --- diensten.html: 4 kaartfoto's --------------------------------------
  if (file === "diensten.html") {
    html = html
      .replace(/<div class="dienst-card__img dienst-card__img--ph ph-1">[\s\S]*?<\/div>/, img("assets/img/dienst-isolatie.jpg", "Vakman plaatst isolatiemateriaal"))
      .replace(/<div class="dienst-card__img dienst-card__img--ph ph-2">[\s\S]*?<\/div>/, img("assets/img/dienst-renovatie.jpg", "Woning in renovatie"))
      .replace(/<div class="dienst-card__img dienst-card__img--ph ph-3">[\s\S]*?<\/div>/, img("assets/img/dienst-gevel.jpg", "Pleisterwerk op gevel"))
      .replace(/<div class="dienst-card__img dienst-card__img--ph ph-4">[\s\S]*?<\/div>/, img("assets/img/dienst-dak.jpg", "Dakwerkers leggen pannen"));
  }

  // --- realisaties.html: 9 projectfoto's (op volgorde) --------------------
  if (file === "realisaties.html") {
    const fotos = [
      "realisaties/r5.jpg",       // 1 spouwmuurisolatie
      "realisaties/r6.jpg",       // 2 totaalrenovatie
      "realisaties/r3.jpg",       // 3 crepi
      "dienst-dak.jpg",           // 4 dakrenovatie leien
      "dienst-isolatie.jpg",      // 5 sarking-isolatie
      "realisaties/r7.jpg",       // 6 zolderinrichting
      "realisaties/r4.jpg",       // 7 steenstrips
      "realisaties/r8.jpg",       // 8 dakvernieuwing
      "realisaties/r2.jpg",       // 9 buitenrenovatie
    ];
    let i = 0;
    html = html.replace(/<div class="ph ph-\d">Foto volgt<\/div>/g, () =>
      `<img src="assets/img/${fotos[i++]}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover" />`);
    // titels afstemmen op de gebruikte beelden
    html = html.replace("Plat dak met EPDM-bedekking", "Volledige dakvernieuwing");
    html = html.replace("Vloerisolatie via de kruipruimte", "Buitenrenovatie met nieuw schrijnwerk");
    html = html.replace(`<a class="project-card reveal" data-delay="2" href="realisatie-detail.html" data-category="isolatie">
            <div class="project-card__media"><span class="project-card__cat">Isolatie</span><img src="assets/img/realisaties/r2.jpg"`,
      `<a class="project-card reveal" data-delay="2" href="realisatie-detail.html" data-category="renovatie">
            <div class="project-card__media"><span class="project-card__cat">Renovatie</span><img src="assets/img/realisaties/r2.jpg"`);
  }

  // --- realisatie-detail.html: slider + galerij ---------------------------
  if (file === "realisatie-detail.html") {
    html = html
      .replace(`<div class="ba__img ba__after ba__ph ba__ph--after">Na — foto volgt</div>`,
        `<img class="ba__img ba__after" src="assets/img/realisaties/slider-after.jpg" alt="Interieur na de renovatie" />`)
      .replace(`<div class="ba__before ba__img ba__ph ba__ph--before">Voor — foto volgt</div>`,
        `<img class="ba__before ba__img" src="assets/img/realisaties/slider-before.jpg" alt="Interieur voor de renovatie" />`);
    const gal = ["realisaties/slider-before.jpg", "realisaties/r1.jpg", "realisaties/r6.jpg", "realisaties/r7.jpg", "realisaties/before.jpg", "realisaties/slider-after.jpg"];
    let g = 0;
    html = html.replace(/<div class="ph ph-\d">Foto volgt<\/div>/g, () =>
      `<img src="assets/img/${gal[g++]}" alt="Projectfoto" loading="lazy" />`);
  }

  // --- over-ons.html: teamfoto boven de stats -----------------------------
  if (file === "over-ons.html") {
    html = html
      .replace(`<div class="stats reveal" data-delay="1">
          <div class="stat"><div class="stat__num">15+</div>`,
        `<div class="reveal" data-delay="1">
          <img src="assets/img/over-ons.jpg" alt="NOAH vakman begroet een klant op de werf" loading="lazy" style="border-radius:var(--radius-lg);margin-bottom:1.25rem;box-shadow:var(--shadow)" />
          <div class="stats">
          <div class="stat"><div class="stat__num">15+</div>`)
      .replace(`<div class="stat"><div class="stat__num">10 jaar</div><div class="stat__label">garantie</div></div>
        </div>`,
        `<div class="stat"><div class="stat__num">10 jaar</div><div class="stat__label">garantie</div></div>
          </div>
        </div>`);
  }

  await writeFile(file, html, "utf8");
  console.log("✓", file);
}
console.log("Klaar.");
