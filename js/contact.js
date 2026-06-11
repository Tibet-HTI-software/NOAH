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
      // NB: zolang er geen backend (action) gekoppeld is, wordt de mail niet
      // verstuurd — de melding hieronder is de nette demo-bevestiging.
      if (status) {
        status.textContent = "Bedankt voor uw bericht! We antwoorden binnen één werkdag.";
        status.classList.add("is-visible");
      }
      form.reset();
      status?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
})();
