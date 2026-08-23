# NOAH Isolatie & Renovatie — website

Statische website voor **NOAH Isolatie & Renovatie** (regio Antwerpen).
Specialist in isolatie, renovatie, gevelbekleding en dakwerken.

## Stack
- Pure **HTML / CSS / JavaScript** (geen build-stap nodig)
- Lettertypes: Comfortaa (titels) + Poppins (tekst) via Google Fonts
- Stijl geïnspireerd op delamo.be, met NOAH-groen (#16A34A)

## Lokaal bekijken
```bash
node server.mjs        # http://localhost:5510
```
of open `index.html` via een willekeurige statische webserver.

## Structuur
```
index.html                      Home
over-ons.html                   Over ons
diensten.html                   Diensten-overzicht
diensten-*.html                 Dienst-detailpagina's (gegenereerd)
realisaties.html                Realisaties (filterbaar)
realisatie-detail.html          Projectdetail + before/after-slider
offerte.html                    Offerte-aanvraag (3-stappen wizard)
contact.html                    Contact (gegevens, uren, kaart)
404.html                        Foutpagina
css/                            tokens · style · pages · scroll-fx
js/                             main · filter · before-after · lightbox · contact · offerte
assets/img/                     logo + foto's (tijdelijke stockbeelden)
```

## Build-helpers (Node)
- `generate-pages.mjs` — genereert de 4 dienst-detailpagina's uit data + template
- `server.mjs` — lichte lokale dev-server

## Bedrijfsgegevens
- **NOAH BV** — BTW BE 0883.247.653 (ondernemingsnummer 0883.247.653)
- Pietje Waasstraat 31, 2070 Zwijndrecht
- Tel. / WhatsApp: 0498 83 83 63 — info@noahbouw.be
- Domein: `noahbouw.be` (canonical, OG, sitemap, robots.txt)

## Nog in te vullen (TODO's, gemarkeerd in de code)
- Mailbox `info@noahbouw.be` aanmaken (Microsoft 365-tenant staat klaar, mailbox nog niet)
- Openingsuren bevestigen met NOAH
- Formulier-backend koppelen (bv. Web3Forms) voor contact + offerte
- Echte projectfoto's en klantenreviews
- Privacy- en cookiepagina's
