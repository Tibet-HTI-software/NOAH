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

  form.addEventListener("submit", (e) => {
    if (!form.getAttribute("action")) {
      e.preventDefault();
      if (!validStep(cur)) return;
      const st = form.querySelector(".form__status");
      if (st) {
        st.textContent = "Bedankt! Uw offerteaanvraag is goed genoteerd. We nemen snel contact met u op. (Demo — koppel nog een backend om de aanvraag effectief te versturen.)";
        st.classList.add("is-visible");
      }
    }
  });
})();
