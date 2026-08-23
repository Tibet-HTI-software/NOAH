# NOAH Isolatie & Renovatie — projectcontext

Statische klantsite (HTML/CSS/JS, geen framework) voor **NOAH BV**, het isolatie- en
renovatiebedrijf van de dayı van Tibet. Live op **https://noahbouw.be** via Vercel
(team HTI SOFTWARE, project `noah`, deployt automatisch vanaf `main`).

> LET OP: deze repo is **publiek**. Zet hier nooit de toegangscode, tokens of andere
> geheimen in — die leven uitsluitend in de Vercel env-vars.

## Stand van zaken (laatst bijgewerkt: 2026-08-23)

| Onderdeel | Status |
|---|---|
| Domein `noahbouw.be` + SSL | ✅ live (www doet 308 naar apex) |
| Bedrijfsgegevens (tel/BTW/adres/e-mail) | ✅ overal ingevuld |
| Mailbox `info@noahbouw.be` | ✅ aangemaakt (Microsoft 365 via GoDaddy) |
| Maintenance-slot | ✅ actief — site vraagt toegangscode |
| Klantpaneel `/paneel.html` | ✅ live, getest |
| Formulier-backend (contact + offerte) | ❌ nog niet — formulieren versturen nergens naartoe |
| Openingsuren / echte foto's / reviews | ❌ wachten op aanlevering klant (via het paneel) |
| Privacy- & cookiepagina's | ❌ nog te maken |

## Bedrijfsgegevens (bron: KBO, geverifieerd)

- **NOAH BV** — BTW BE 0883.247.653 · Pietje Waasstraat 31, 2070 Zwijndrecht
- Tel/WhatsApp: 0498 83 83 63 · info@noahbouw.be · Instagram @noahbvba

## DNS — niet aankomen zonder reden

DNS staat bij **GoDaddy** (nameservers blijven daar!): de Microsoft 365-mail
(MX, SPF, DMARC, SRV-records) hangt eraan. Alleen het `A @`-record wijst naar
Vercel (216.150.1.1) en `CNAME www` volgt de apex. **Nooit** overstappen op
Vercel-nameservers — dan ligt de mail plat.

## Maintenance-gate & klantpaneel

- `middleware.js` stuurt alles zonder geldig token naar `/maintenance.html`.
- `api/unlock.js` controleert de code en zet een HMAC-cookie (30 dagen geldig).
- De toegangscode staat in Vercel env-var **`SITE_PASSCODE`** (dashboard →
  project `noah` → Settings → Environment Variables). Verder: `AUTH_SECRET`
  (HMAC-sleutel) en `MAINTENANCE_MODE`.
- **Slot uitzetten bij livegang:** `MAINTENANCE_MODE` op `off` + redeploy.
- Klantpaneel `/paneel.html` (knop linksonder verschijnt na inloggen):
  foto's → Blob `klant/fotos/`, teksten & wijzigingsverzoeken → JSON in
  `klant/inzendingen/`. Bekijken: Vercel → Storage → store **`noah-uploads`**
  (public, regio fra1).

## Werkafspraken voor deze codebase

- De vier `diensten-*.html` worden **gegenereerd** door `generate-pages.mjs`.
  Pas je iets aan in die pagina's, wijzig dan óók de template in de generator,
  anders wordt het overschreven bij de volgende run. Controle: `node
  generate-pages.mjs` draaien mag géén diff opleveren.
- Lokaal bekijken: `node server.mjs` → http://localhost:5510 (middleware en
  API's draaien lokaal níet mee, alleen op Vercel).
- `premium-update.mjs`, `update-pages.mjs`, `upgrade-2.mjs` zijn oude eenmalige
  migratiescripts — niet meer draaien, alleen bijgewerkt zodat ze niets slopen.
- Er bestaat ook een map `Websites/NOAH-` (React/Vite): dat is een
  **niet-gedeployde** variant. Wijzigingen daar komen nooit live — werk hier.
