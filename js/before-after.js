/* NOAH — before/after slider (vanilla, clip-path) */
(function () {
  "use strict";
  document.querySelectorAll("[data-ba]").forEach((ba) => {
    const before = ba.querySelector(".ba__before");
    const handle = ba.querySelector(".ba__handle");
    let dragging = false;

    const set = (pct) => {
      pct = Math.max(0, Math.min(100, pct));
      before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + "%";
      ba.setAttribute("aria-valuenow", Math.round(pct));
      ba.setAttribute("aria-valuetext", `${Math.round(pct)}% van de voor-situatie zichtbaar`);
    };
    const fromEvent = (clientX) => {
      const r = ba.getBoundingClientRect();
      set(((clientX - r.left) / r.width) * 100);
    };

    ba.addEventListener("pointerdown", (e) => {
      dragging = true;
      ba.setPointerCapture(e.pointerId);
      fromEvent(e.clientX);
    });
    ba.addEventListener("pointermove", (e) => { if (dragging) fromEvent(e.clientX); });
    ba.addEventListener("pointerup", () => { dragging = false; });
    ba.addEventListener("pointercancel", () => { dragging = false; });

    // toetsenbord-toegankelijk
    ba.setAttribute("tabindex", "0");
    ba.setAttribute("role", "slider");
    ba.setAttribute("aria-valuemin", "0");
    ba.setAttribute("aria-valuemax", "100");
    ba.setAttribute("aria-label", "Vergelijk voor en na");
    let cur = 50;
    ba.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { cur = Math.max(0, cur - 4); set(cur); e.preventDefault(); }
      if (e.key === "ArrowRight") { cur = Math.min(100, cur + 4); set(cur); e.preventDefault(); }
    });

    set(50);
  });
})();
