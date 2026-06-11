/* NOAH — offerte-wizard (3 stappen).
   LET OP: statische site verstuurt zelf geen mail. Koppel later een backend
   (bv. Web3Forms): zet het 'action'-attribuut op het formulier en de
   demo-afhandeling hieronder vervalt vanzelf. */
(function () {
  "use strict";
  const form = document.querySelector("#offerte-form");
  if (!form) return;

  const steps = [...form.querySelectorAll(".wizard__step")];
  const dots = [...document.querySelectorAll(".wsteps__item")];
  let cur = 0;

  const show = (i) => {
    steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
    dots.forEach((d, k) => {
      d.classList.toggle("is-active", k === i);
      d.classList.toggle("is-done", k < i);
    });
    cur = i;
    const top = form.getBoundingClientRect().top + window.scrollY - 130;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const validStep = (i) => {
    for (const f of steps[i].querySelectorAll("input, select, textarea")) {
      if (!f.checkValidity()) { f.reportValidity(); return false; }
    }
    return true;
  };

  form.addEventListener("click", (e) => {
    const next = e.target.closest("[data-next]");
    const prev = e.target.closest("[data-prev]");
    if (next) { e.preventDefault(); if (validStep(cur)) show(cur + 1); }
    if (prev) { e.preventDefault(); show(cur - 1); }
  });

  /* foto-upload: toon aantal gekozen bestanden in de drop-zone */
  const fileInput = form.querySelector('input[type="file"]');
  const fileCount = form.querySelector(".file-count");
  if (fileInput && fileCount) {
    fileInput.addEventListener("change", () => {
      const n = fileInput.files.length;
      fileCount.textContent = n ? `${n} foto${n === 1 ? "" : "'s"} geselecteerd` : "";
    });
  }

  form.addEventListener("submit", (e) => {
    if (!form.getAttribute("action")) {
      e.preventDefault();
      if (!validStep(cur)) return;
      // NB: zolang er geen backend (action) gekoppeld is, wordt de aanvraag
      // niet verstuurd — de melding hieronder is de nette demo-bevestiging.
      const st = form.querySelector(".form__status");
      if (st) {
        st.textContent = "Bedankt! Uw offerteaanvraag is goed ontvangen. We nemen binnen één werkdag contact met u op.";
        st.classList.add("is-visible");
      }
    }
  });
})();
