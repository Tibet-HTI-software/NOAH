/* NOAH — vult de projectdetailpagina op basis van ?p=<slug> uit projects-data.js
   en bouwt de "Andere realisaties"-sectie. */
(function () {
  "use strict";
  const data = window.NOAH_PROJECTS || {};
  const slugs = Object.keys(data);
  if (!slugs.length) return;

  const params = new URLSearchParams(window.location.search);
  const slug = data[params.get("p")] ? params.get("p") : "totaalrenovatie-antwerpen";
  const p = data[slug];

  /* ---- kop & meta ------------------------------------------------------ */
  document.title = `${p.titel} ${p.accent}, ${p.gemeente} — NOAH Realisaties`;
  const set = (sel, fn) => { const el = document.querySelector(sel); if (el) fn(el); };

  set("#p-eyebrow", (el) => (el.textContent = `${p.cat} · ${p.gemeente}`));
  set("#p-title", (el) => (el.innerHTML = `${p.titel} <span class="accent">${p.accent}</span>`));
  set("#p-lead", (el) => (el.textContent = p.lead));

  /* ---- before / after --------------------------------------------------- */
  set(".ba__after", (el) => { el.src = p.after; el.alt = "Situatie na de werken"; });
  set(".ba__before", (el) => { el.src = p.before; el.alt = "Situatie voor de werken"; });

  /* ---- probleem / aanpak / resultaat ------------------------------------ */
  ["probleem", "aanpak", "resultaat"].forEach((k) => {
    set(`#p-${k}`, (el) => (el.textContent = p[k]));
  });

  /* ---- feiten ------------------------------------------------------------ */
  set("#p-facts", (el) => {
    el.innerHTML = Object.entries(p.facts)
      .map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`)
      .join("");
  });

  /* ---- galerij ------------------------------------------------------------ */
  set("#p-gallery", (el) => {
    el.innerHTML = p.gallery
      .map((src, i) => `<img src="${src}" alt="${(p.alts && p.alts[i]) || "Projectfoto"}" loading="lazy" />`)
      .join("");
  });

  /* ---- gerelateerde realisaties ------------------------------------------ */
  set("#p-related", (el) => {
    const pin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
    el.innerHTML = slugs
      .filter((s) => s !== slug)
      .slice(0, 3)
      .map((s) => {
        const r = data[s];
        return `<a class="project-card" href="realisatie-detail.html?p=${s}">
            <div class="project-card__media"><span class="project-card__cat">${r.cat}</span><img src="${r.after}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover" /></div>
            <div class="project-card__body"><h3 class="project-card__title">${r.titel} ${r.accent}</h3><p class="project-card__meta">${pin} ${r.gemeente}</p><span class="project-card__cta">Bekijk project <span class="arrow">&rarr;</span></span></div>
          </a>`;
      })
      .join("");
  });
})();
