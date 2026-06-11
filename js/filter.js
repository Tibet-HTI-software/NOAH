/* NOAH — realisaties filter */
(function () {
  "use strict";
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  const empty = document.querySelector(".projects-empty");
  const counter = document.querySelector(".projects-count");
  if (!buttons.length) return;

  const setCount = (n) => {
    if (counter) counter.textContent = `${n} realisatie${n === 1 ? "" : "s"}`;
  };
  setCount(cards.length);

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const cat = btn.dataset.filter;
      let visible = 0;
      cards.forEach((card) => {
        const match = cat === "alle" || card.dataset.category === cat;
        card.classList.toggle("is-hidden", !match);
        if (match) visible++;
      });
      setCount(visible);
      if (empty) empty.style.display = visible ? "none" : "block";
    })
  );
})();
