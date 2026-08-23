/* ==========================================================================
   NOAH — POST /api/unlock
   Controleert de toegangscode en zet bij succes twee cookies:
   - noah_access (httpOnly): het ondertekende token dat middleware.js leest
   - noah_in (leesbaar):     vlag waarmee js/main.js het paneelknopje toont
   ========================================================================== */

import { COOKIE, FLAG_COOKIE, MAX_AGE_SECONDS, createToken, safeEqual } from "../lib/auth.js";

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const passcode = process.env.SITE_PASSCODE;
    const secret = process.env.AUTH_SECRET;
    if (!passcode || !secret) {
      return Response.json({ error: "Server niet geconfigureerd" }, { status: 500 });
    }

    let supplied = "";
    try {
      supplied = String((await request.json()).code ?? "");
    } catch {
      return Response.json({ error: "Ongeldige aanvraag" }, { status: 400 });
    }

    if (!safeEqual(supplied, passcode)) {
      /* Kleine vaste vertraging maakt brute force via dit endpoint traag. */
      await new Promise((r) => setTimeout(r, 800));
      return Response.json({ error: "Onjuiste code" }, { status: 401 });
    }

    const token = await createToken(secret);
    const base = `Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax; Secure`;
    const headers = new Headers({ "Content-Type": "application/json" });
    headers.append("Set-Cookie", `${COOKIE}=${token}; ${base}; HttpOnly`);
    headers.append("Set-Cookie", `${FLAG_COOKIE}=1; ${base}`);

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  },
};
