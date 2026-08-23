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

  /* ---- Klantpaneel-knop (alleen zichtbaar na inloggen via de gate) ----- */
  if (/(?:^|;\s*)noah_in=1(?:;|$)/.test(document.cookie) && !location.pathname.endsWith("paneel.html")) {
    const paneel = document.createElement("a");
    paneel.href = "paneel.html";
    paneel.className = "paneel-float";
    paneel.setAttribute("aria-label", "Materiaal aanleveren");
    paneel.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0 4 4m-4-4L8 8M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Materiaal aanleveren</span>';
    const stijl = document.createElement("style");
    stijl.textContent = [
      ".paneel-float{position:fixed;left:1.25rem;bottom:1.25rem;z-index:60;display:flex;align-items:center;gap:.55rem;",
      "padding:.7rem 1.1rem;border-radius:999px;background:var(--surface,#fff);color:var(--green-700,#137A37);",
      "border:1.5px solid var(--green-100,#D6EEDD);box-shadow:var(--shadow,0 14px 40px rgba(20,24,26,.10));",
      "font-weight:600;font-size:.85rem;text-decoration:none;transition:transform .2s,box-shadow .2s}",
      ".paneel-float:hover{transform:translateY(-2px)}",
      ".paneel-float svg{width:18px;height:18px}",
      "@media(max-width:640px){.paneel-float span{display:none}.paneel-float{padding:.7rem}}",
    ].join("");
    document.head.append(stijl);
    document.body.append(paneel);
  }

  /* ---- Jaartal in footer ---------------------------------------------- */
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
