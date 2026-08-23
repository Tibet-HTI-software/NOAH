/* ==========================================================================
   NOAH — maintenance-gate (Vercel Routing Middleware)
   Elke request passeert hier. Zonder geldig token gaat alles naar
   /maintenance.html; met token werkt de site normaal. De toegangscode
   zelf staat alleen in de env-vars (SITE_PASSCODE / AUTH_SECRET), nooit
   in code die de browser bereikt.

   Uitzetten bij livegang: env-var MAINTENANCE_MODE op "off" zetten
   (of verwijderen) en redeployen — geen code-wijziging nodig.
   ========================================================================== */

import { COOKIE, readCookie, verifyToken } from "./lib/auth.js";

/* Bestanden die de maintenance-pagina zelf nodig heeft + de unlock-API. */
const OPEN_PATHS = new Set([
  "/maintenance.html",
  "/api/unlock",
  "/api/overzicht", // doet eigen passcode-controle (zie api/overzicht.js)
  "/favicon.ico",
  "/robots.txt",
  "/assets/img/favicon.svg",
  "/assets/img/logo.png",
]);

const OPEN_PREFIXES = ["/css/", "/assets/img/"];

export default async function middleware(request) {
  if (process.env.MAINTENANCE_MODE === "off") return; // site is vrijgegeven

  const url = new URL(request.url);
  const path = url.pathname;

  if (OPEN_PATHS.has(path) || OPEN_PREFIXES.some((p) => path.startsWith(p))) return;

  const token = readCookie(request.headers.get("cookie"), COOKIE);
  if (await verifyToken(token, process.env.AUTH_SECRET)) return;

  /* Paneel-API's geven zonder token een nette 401 i.p.v. een HTML-redirect. */
  if (path.startsWith("/api/")) {
    return Response.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: "/maintenance.html",
      "Cache-Control": "no-store",
      /* Zoekmachines mogen de tijdelijke afscherming niet indexeren. */
      "X-Robots-Tag": "noindex",
    },
  });
}
