/* ==========================================================================
   NOAH — check op nieuwe klant-inzendingen
   Vraagt de live site (/api/overzicht) wat er in de Blob-store staat en
   vergelijkt dat met de vorige check op deze machine (.nieuw-check.json,
   staat in .gitignore). Draai dit aan het begin van elke werksessie.

   Gebruik:  node check-nieuw.mjs <toegangscode>
        of:  NOAH_CODE=<code> node check-nieuw.mjs
   (De code is de SITE_PASSCODE uit de Vercel env-vars.)
   ========================================================================== */

import { readFile, writeFile } from "node:fs/promises";

const SITE = "https://noahbouw.be";
const STATE = ".nieuw-check.json";

const code = process.argv[2] || process.env.NOAH_CODE;
if (!code) {
  console.error("Gebruik: node check-nieuw.mjs <toegangscode>   (of zet env NOAH_CODE)");
  console.error("De code vind je in Vercel -> project noah -> Settings -> Environment Variables -> SITE_PASSCODE.");
  process.exit(1);
}

const res = await fetch(`${SITE}/api/overzicht`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code }),
});
if (!res.ok) {
  const fout = (await res.json().catch(() => ({}))).error || `HTTP ${res.status}`;
  console.error(`Ophalen mislukt: ${fout}`);
  process.exit(1);
}
const { items } = await res.json();

let gezien = new Set();
try {
  gezien = new Set(JSON.parse(await readFile(STATE, "utf8")));
} catch { /* eerste keer op deze machine */ }

const nieuw = items.filter((i) => !gezien.has(i.pathname));
const fotos = nieuw.filter((i) => i.pathname.startsWith("klant/fotos/"));
const inzendingen = nieuw.filter((i) => i.pathname.startsWith("klant/inzendingen/"));

const wanneer = (i) => new Date(i.uploadedAt).toLocaleString("nl-BE", { dateStyle: "short", timeStyle: "short" });
const mb = (b) => (b / 1024 / 1024).toFixed(1) + " MB";

if (!nieuw.length) {
  console.log(`Geen nieuwe inzendingen sinds de vorige check. (totaal in opslag: ${items.length})`);
} else {
  console.log(`\n=== ${nieuw.length} NIEUWE inzending(en) van de klant ===\n`);

  if (fotos.length) {
    console.log(`FOTO'S (${fotos.length}):`);
    for (const f of fotos) {
      console.log(`  - ${f.pathname.replace("klant/fotos/", "")}  (${mb(f.size)}, ${wanneer(f)})`);
      console.log(`    ${f.url}`);
    }
    console.log("");
  }

  if (inzendingen.length) {
    console.log(`TEKSTEN & VERZOEKEN (${inzendingen.length}):`);
    for (const z of inzendingen.slice(0, 15)) {
      console.log(`  - ${z.pathname.replace("klant/inzendingen/", "")}  (${wanneer(z)})`);
      try {
        const record = await (await fetch(z.url)).json();
        for (const [k, v] of Object.entries(record)) {
          if (k === "type" || k === "ontvangen" || !v) continue;
          const tekst = String(v).replace(/\s+/g, " ");
          console.log(`      ${k}: ${tekst.length > 160 ? tekst.slice(0, 160) + "…" : tekst}`);
        }
      } catch {
        console.log(`      (inhoud niet leesbaar — open de URL zelf: ${z.url})`);
      }
    }
    console.log("");
  }

  console.log("Alles bekijken: Vercel -> project noah -> Storage -> noah-uploads");
}

await writeFile(STATE, JSON.stringify(items.map((i) => i.pathname), null, 2), "utf8");
