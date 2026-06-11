/* NOAH — eenvoudige lightbox voor galerijfoto's */
(function () {
  "use strict";
  const imgs = document.querySelectorAll(".gallery img, [data-lightbox] img");
  if (!imgs.length) return;

  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-label", "Foto op groot formaat");
  lb.innerHTML =
    '<button class="lightbox__close" aria-label="Sluiten">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg>' +
    "</button><img alt=\"\" />";
  document.body.appendChild(lb);
  const pic = lb.querySelector("img");

  const open = (src, alt) => {
    pic.src = src;
    pic.alt = alt || "";
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  imgs.forEach((img) => img.addEventListener("click", () => open(img.src, img.alt)));
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.closest(".lightbox__close")) close();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
