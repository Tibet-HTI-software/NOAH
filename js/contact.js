/* NOAH — contactformulier (frontend).
   LET OP: een statische site kan zelf geen mail versturen. Koppel dit later
   aan een backend (bv. Formspree of Web3Forms): vul het 'action'-attribuut
   van het formulier in en verwijder de demo-afhandeling hieronder. */
(function () {
  "use strict";
  const form = document.querySelector("#contact-form");
  const status = document.querySelector(".form__status");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    // Demo-modus: nog geen backend gekoppeld -> toon bevestiging lokaal.
    if (!form.getAttribute("action")) {
      e.preventDefault();
      if (status) {
        status.textContent = "Bedankt! Uw aanvraag is genoteerd. (Demo — koppel nog een backend om de mail effectief te versturen.)";
        status.classList.add("is-visible");
      }
      form.reset();
      status?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
})();
