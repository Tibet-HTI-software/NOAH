/* ==========================================================================
   NOAH — POST /api/submit
   Slaat tekst-aanleveringen en wijzigingsverzoeken van de klant op als
   JSON-bestand in Vercel Blob (map klant/inzendingen/). Geen database:
   het Blob-overzicht in het Vercel-dashboard is meteen de administratie.

   Toegang is al afgedwongen door middleware.js (401 zonder token).
   ========================================================================== */

import { put } from "@vercel/blob";

const TYPES = new Set(["teksten", "wijziging"]);
const MAX_FIELD = 8000; // ruim voldoende voor een bedrijfsverhaal

function clean(value) {
  return String(value ?? "").trim().slice(0, MAX_FIELD);
}

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Ongeldige aanvraag" }, { status: 400 });
    }

    const type = clean(body.type);
    if (!TYPES.has(type)) {
      return Response.json({ error: "Onbekend type" }, { status: 400 });
    }

    const record = { type, ontvangen: new Date().toISOString() };

    if (type === "teksten") {
      record.bedrijfsverhaal = clean(body.bedrijfsverhaal);
      record.openingsuren = clean(body.openingsuren);
      record.reviews = clean(body.reviews);
      if (!record.bedrijfsverhaal && !record.openingsuren && !record.reviews) {
        return Response.json({ error: "Vul minstens één veld in" }, { status: 400 });
      }
    } else {
      record.pagina = clean(body.pagina);
      record.bericht = clean(body.bericht);
      if (!record.bericht) {
        return Response.json({ error: "Beschrijf wat er anders moet" }, { status: 400 });
      }
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const blob = await put(
      `klant/inzendingen/${type}-${stamp}.json`,
      JSON.stringify(record, null, 2),
      { access: "public", contentType: "application/json", addRandomSuffix: true }
    );

    return Response.json({ ok: true, url: blob.url });
  },
};
