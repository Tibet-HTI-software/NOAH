/* Premium-pass: Comfortaa/Poppins, dropdown-nav, lichte footer, delamo-hero.
   Run: node premium-update.mjs                                              */
import { readFile, writeFile } from "node:fs/promises";

const FONTS_OLD = `https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap`;
const FONTS_NEW = `https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap`;

const nav = (current) => {
  const cur = (k) => (current === k ? ' aria-current="page"' : "");
  return `<nav class="nav" aria-label="Hoofdnavigatie">
        <a class="nav__link" href="index.html"${cur("home")}>Home</a>
        <a class="nav__link" href="over-ons.html"${cur("over")}>Over ons</a>
        <div class="nav__item has-dropdown">
          <a class="nav__link" href="diensten.html"${cur("diensten")} aria-expanded="false">Diensten
            <svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <div class="dropdown">
            <a class="dropdown__item" href="diensten-isolatie.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 9h18M3 14h18M5 5h14M5 19h14" stroke-linecap="round"/></svg></span><span><strong>Isolatie</strong><small>Spouwmuur, dak, vloer &amp; na-isolatie</small></span></a>
            <a class="dropdown__item" href="diensten-renovatie.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span><strong>Renovatie</strong><small>Totaalrenovatie &amp; binnenafwerking</small></span></a>
            <a class="dropdown__item" href="diensten-gevelbekleding.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h16v16H4zM4 9h16M4 14h16M9 4v5M14 9v5M9 14v6" stroke-linejoin="round"/></svg></span><span><strong>Gevelbekleding</strong><small>Crepi, steenstrips &amp; reiniging</small></span></a>
            <a class="dropdown__item" href="diensten-dakwerken.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12 12 4l10 8M5 10v10h14V10" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span><strong>Dakwerken</strong><small>Pannen, EPDM &amp; dakgoten</small></span></a>
            <a class="dropdown__all" href="diensten.html">Alle diensten <span class="arrow">&rarr;</span></a>
          </div>
        </div>
        <a class="nav__link" href="realisaties.html"${cur("realisaties")}>Realisaties</a>
        <a class="nav__link" href="contact.html"${cur("contact")}>Contact</a>
      </nav>`;
};

const FOOTER = `<footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <a class="footer__wordmark" href="index.html">noah<span>.</span></a>
          <p class="footer__tag">Wij helpen uw woning vooruit met vakkundige isolatie, renovatie, gevel- en dakwerken in regio Antwerpen.</p>
        </div>
        <div class="footer__col"><h4>Diensten</h4><ul><li><a href="diensten-isolatie.html">Isolatie</a></li><li><a href="diensten-renovatie.html">Renovatie</a></li><li><a href="diensten-gevelbekleding.html">Gevelbekleding</a></li><li><a href="diensten-dakwerken.html">Dakwerken</a></li></ul></div>
        <div class="footer__col"><h4>Contact</h4><ul><li><a href="mailto:info@noah.be">info@noah.be</a></li><li><span class="todo">Tel: +32 (TODO)</span></li><li><span>Antwerpen, Belgi&euml;</span></li><li><a href="https://www.instagram.com/noahbvba/" target="_blank" rel="noopener">@noahbvba</a></li></ul></div>
        <div class="footer__col"><h4>Volg ons</h4><div class="socials"><a href="https://www.instagram.com/noahbvba/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a><a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2 0-3 1-3 3v2H8v3h3v6h3v-6h2.5l.5-3H14v-1.5c0-.5.3-1 1-1z"/></svg></a></div></div>
      </div>
      <div class="footer__bottom">
        <nav><a href="index.html">Home</a><a href="over-ons.html">Over ons</a><a href="diensten.html">Diensten</a><a href="realisaties.html">Realisaties</a><a href="contact.html">Contact</a></nav>
        <span>Antwerpen, Belgi&euml; &mdash; <span class="todo">BTW BE0&hellip; (TODO)</span></span>
      </div>
      <div class="footer__legal">
        <span>&copy; <span data-year>2026</span> NOAH Isolatie &amp; Renovatie &mdash; alle rechten voorbehouden</span>
        <!-- TODO: echte privacy- en cookiepagina's aanmaken -->
        <nav><a href="#">Privacy</a><a href="#">Cookies</a></nav>
      </div>
    </div>
  </footer>`;

const pages = {
  "index.html": "home",
  "over-ons.html": "over",
  "diensten.html": "diensten",
  "realisaties.html": "realisaties",
  "realisatie-detail.html": "realisaties",
  "contact.html": "contact",
};

for (const [file, current] of Object.entries(pages)) {
  let html = await readFile(file, "utf8");

  html = html.replace(FONTS_OLD, FONTS_NEW);
  html = html.replace(/<nav class="nav" aria-label="Hoofdnavigatie">[\s\S]*?<\/nav>/, nav(current));
  html = html.replace(/<footer class="footer">[\s\S]*?<\/footer>/, FOOTER);

  // Gigantisch merk op de CTA-foto (delamo-stijl)
  html = html.replace(
    /(<section class="cta-banner">\s*<div class="cta-banner__bg">[\s\S]*?<\/div>)/,
    `$1\n      <div class="cta-banner__brand" aria-hidden="true">noah<span>.</span></div>`
  );

  // Hero in delamo-layout (alleen homepage)
  if (file === "index.html") {
    html = html.replace(
      /<h1 class="hero__title">[\s\S]*?<div class="hero__actions">[\s\S]*?<\/div>/,
      `<div class="hero__row">
          <h1 class="hero__wordmark">noah<span class="dot">.</span><span class="sr-only"> &mdash; isolatie &amp; renovatie in Antwerpen</span></h1>
          <p class="hero__lead">Wij helpen uw woning vooruit met vakkundige isolatie, duurzame renovatie en stijlvolle gevel- en dakwerken in regio Antwerpen.</p>
          <div class="hero__actions">
            <a class="btn btn--ghost-light" href="contact.html">Contact <span class="arrow">&rarr;</span></a>
            <a class="btn btn--primary" href="contact.html">Offerte aanvragen <span class="arrow">&rarr;</span></a>
          </div>
        </div>`
    );
  }

  await writeFile(file, html, "utf8");
  console.log("✓", file);
}
console.log("Klaar.");
