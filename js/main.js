/* NOAH — header gedrag, mobiel menu, scroll-reveal */
(function () {
  "use strict";

  /* ---- Header: transparant boven hero -> wit bij scroll ---------------- */
  const header = document.querySelector(".header");
  const setHeaderState = () => {
    if (!header) return;
    const top = window.scrollY < 40;
    header.classList.toggle("is-top", top && header.dataset.overlay === "true");
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  /* ---- Mobiel menu ----------------------------------------------------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---- Scroll-reveal --------------------------------------------------- */
  // Automatische stagger: kinderen van grids onthullen trapsgewijs,
  // zonder dat elke kaart een handmatige data-delay nodig heeft.
  const staggerParents = document.querySelectorAll(
    ".diensten-grid, .usp-grid, .quotes, .projects-grid, .steps, .services-overview, .mini-steps"
  );
  staggerParents.forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      const el = child.classList.contains("reveal") ? child : child.querySelector(":scope > .reveal");
      if (el) el.style.transitionDelay = (i * 0.12) + "s";
    });
  });

  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.22, rootMargin: "0px 0px -5% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---- Dropdown: toggle op mobiel/touch -------------------------------- */
  document.querySelectorAll(".has-dropdown").forEach((item) => {
    const link = item.querySelector(".nav__link");
    link.addEventListener("click", (e) => {
      // op mobiel eerst openklappen; tweede tik volgt de link
      if (window.matchMedia("(max-width: 720px)").matches && !item.classList.contains("is-open")) {
        e.preventDefault();
        item.classList.add("is-open");
        link.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---- Stats: cijfers tellen op bij in beeld komen ---------------------- */
  const animateNum = (el) => {
    const m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m) return; // niet-numeriek (bv. "Antwerpen") overslaan
    const target = parseInt(m[1], 10);
    const suffix = m[2] || "";
    const dur = 1300;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const nums = document.querySelectorAll(".stat__num");
  if (nums.length && "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const nio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateNum(e.target); nio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach((el) => nio.observe(el));
  }

  /* ---- Scrollspy: subnav-link actief bij sectie in beeld ---------------- */
  const subLinks = document.querySelectorAll(".subnav a[href^='#']");
  if (subLinks.length && "IntersectionObserver" in window) {
    const map = new Map();
    subLinks.forEach((a) => {
      const sec = document.querySelector(a.hash);
      if (sec) map.set(sec, a);
    });
    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            subLinks.forEach((a) => a.classList.remove("is-active"));
            const link = map.get(e.target);
            if (link) link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    map.forEach((_, sec) => sio.observe(sec));
  }

  /* ---- Terug-naar-boven ------------------------------------------------- */
  const toTop = document.querySelector(".to-top");
  if (toTop) {
    const toggleTop = () => toTop.classList.toggle("is-visible", window.scrollY > 600);
    toggleTop();
    window.addEventListener("scroll", toggleTop, { passive: true });
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---- Jaartal in footer ---------------------------------------------- */
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
