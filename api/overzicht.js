/* ==========================================================================
   NOAH — POST /api/overzicht
   Geeft de lijst van klant-inzendingen in de Blob-store terug, zodat
   check-nieuw.mjs (of elke machine van de bouwer) kan zien of er iets
   nieuws is aangeleverd.

   Auth: dit endpoint staat in OPEN_PATHS van middleware.js en doet zijn
   eigen controle — de aanroeper moet de SITE_PASSCODE meesturen. Zo werkt
   het script ook zonder browser-cookie.
   ========================================================================== */

import { list } from "@vercel/blob";
import { safeEqual } from "../lib/auth.js";

export default {
  async fetch(request) {
    const passcode = process.env.SITE_PASSCODE;
    if (!passcode) {
      return Response.json({ error: "Server niet geconfigureerd" }, { status: 500 });
    }

    /* POST met JSON-body (check-nieuw.mjs) of GET met ?code=
       (voor clients die geen POST kunnen sturen, zoals de Claude-app). */
    let supplied = "";
    if (request.method === "GET") {
      supplied = new URL(request.url).searchParams.get("code") ?? "";
    } else if (request.method === "POST") {
      try {
        supplied = String((await request.json()).code ?? "");
      } catch {
        return Response.json({ error: "Ongeldige aanvraag" }, { status: 400 });
      }
    } else {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    if (!safeEqual(supplied, passcode)) {
      await new Promise((r) => setTimeout(r, 800));
      return Response.json({ error: "Onjuiste code" }, { status: 401 });
    }

    const { blobs } = await list({ prefix: "klant/", limit: 1000 });
    const items = blobs
      .map((b) => ({
        pathname: b.pathname,
        url: b.url,
        size: b.size,
        uploadedAt: b.uploadedAt,
      }))
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return Response.json({ items });
  },
};
