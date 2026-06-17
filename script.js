/* ============================================================
   PARALLEL VISION — script.js
   Vanilla JS + GSAP/ScrollTrigger + Lenis
   ============================================================ */

/* ---------- DATA ----------
   Fotos reais em img/. Título e tag são editáveis livremente. */
const works = [
  { title: "Movimento", tag: "Retrato · Cultura de rua", src: "img/IMG_2773.jpeg", cls: "w1" },
  { title: "Pérolas & Cruz", tag: "Detalhe · Joias", src: "img/IMG_2775.jpeg", cls: "w2" },
  { title: "Sorriso de Ouro", tag: "Flash direto · Atitude", src: "img/IMG_2777.jpeg", cls: "w3" },
  { title: "Verde e Amarelo", tag: "Rua · Identidade", src: "img/IMG_2692.jpeg", cls: "w4" },
  { title: "Brasil", tag: "Rua · 35mm", src: "img/IMG_2691.jpeg", cls: "w5" },
  { title: "Preto no Branco", tag: "P&B · Editorial", src: "img/IMG_2759.jpeg", cls: "w6" },
  { title: "Mãos Marcadas", tag: "Detalhe · Anéis", src: "img/IMG_2886.jpeg", cls: "w7" },
];

const stories = [
  {
    id: "blayc",
    num: "01",
    title: "BLAYC",
    sub: "Copa · Brasil · festa",
    text: "A noite em que o Brasil inteiro coube numa festa. No evento Blayc, sob o tema da Copa, verde e amarelo viraram pele, festa e celebração — puro orgulho nacional no auge da euforia.",
    src: "img/blayc_2.jpeg",
    wide: true,
  },
  {
    id: "ambar",
    num: "02",
    title: "OLHAR ÂMBAR",
    sub: "Retrato · hora dourada",
    text: "Quando o sol baixo incendeia a cidade e tudo vira mel. Um ensaio de retrato na hora dourada — pele, cabelo e olhar banhados pela última luz quente do dia.",
    src: "img/ambar_10.jpeg",
    srcMobile: "img/ambar_6.jpeg",
  },
  {
    id: "basquete",
    num: "03",
    title: "QUADRA",
    sub: "Esporte · movimento · cor",
    text: "Basquete de rua sob o céu aberto. Salto e estilo na quadra do bairro — um ensaio sobre energia, atitude e a cor viva do esporte que pulsa na cidade.",
    src: "img/basq_3.jpeg",
  },
  {
    id: "midnight",
    num: "04",
    title: "MIDNIGHT 6.0",
    sub: "Noite · flash direto · neon",
    text: "A cidade depois que as luzes se acendem. Flash direto, neon e a textura da noite — um ensaio sobre presença e brilho no escuro, onde cada detalhe vira fonte de luz.",
    src: "img/IMG_2773.jpeg",
  },
];

const feed = [
  "img/IMG_2775.jpeg",
  "img/IMG_2780.jpeg",
  "img/IMG_2887.jpeg",
  "img/IMG_3131.jpeg",
  "img/IMG_3132.jpeg",
  "img/IMG_2995.jpeg",
];

/* ---------- HELPERS ---------- */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

document.documentElement.classList.add("js-reveal");

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (REDUCED) document.documentElement.classList.remove("js-reveal");

/* ============================================================
   RENDER WORKS
   ============================================================ */
function renderWorks() {
  const grid = $("#worksGrid");
  grid.innerHTML = works
    .map(
      (w, i) => `
    <button class="work ${w.cls}" data-i="${i}">
      <img src="${w.src}" alt="${w.title}" loading="lazy" />
      <div class="shade"></div>
      <div class="tint"></div>
      <span class="num">0${i + 1}</span>
      <div class="meta">
        <p class="tag">${w.tag}</p>
        <h3 class="title">${w.title}</h3>
      </div>
    </button>`
    )
    .join("");

  $$(".work", grid).forEach((el) =>
    el.addEventListener("click", () => openLightbox(+el.dataset.i))
  );
}

/* ============================================================
   RENDER STORIES
   ============================================================ */
function renderStories() {
  const wrap = $("#storiesWrap");
  wrap.innerHTML = stories
    .map(
      (s, i) => `
    <article class="story ${i % 2 ? "flip" : ""}">
      <div class="story-media scanlines ${s.wide ? "wide" : ""}">
        <div class="inner" ${s.wide ? "" : "data-parallax"}>${
          s.srcMobile
            ? `<picture>
                 <source media="(max-width: 767px)" srcset="${s.srcMobile}" />
                 <img src="${s.src}" alt="${s.title}" loading="lazy" />
               </picture>`
            : `<img src="${s.src}" alt="${s.title}" loading="lazy" />`
        }</div>
        <div class="grad"></div>
      </div>
      <div class="story-body">
        <span class="story-num" data-numshift>${s.num}</span>
        <div class="inner-text">
          <p class="story-sub">${s.sub}</p>
          <h3 class="story-title">${s.title}</h3>
          <p class="story-text">${s.text}</p>
          <a class="story-link" href="ensaio.html?id=${s.id}" data-hover>Ver série →</a>
        </div>
      </div>
    </article>`
    )
    .join("");
}

/* ============================================================
   RENDER FOOTER FEED
   ============================================================ */
function renderFeed() {
  $("#feed").innerHTML = feed
    .map(
      (src) => `
    <a href="https://www.instagram.com/parallel_visionfts" target="_blank" rel="noreferrer">
      <img src="${src}" alt="feed" loading="lazy" />
    </a>`
    )
    .join("");
  $("#copy").textContent = `© ${new Date().getFullYear()} Parallel Vision — Todos os direitos reservados`;
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
let lbIndex = 0;
function openLightbox(i) {
  lbIndex = i;
  updateLightbox();
  $("#lightbox").classList.add("open");
  // flash de obturador
  const flash = $("#lbFlash");
  if (flash) {
    flash.classList.remove("fire");
    void flash.offsetWidth; // reinicia animação
    flash.classList.add("fire");
  }
  if (window.__lenis) window.__lenis.stop();
}
function closeLightbox() {
  $("#lightbox").classList.remove("open");
  if (window.__lenis) window.__lenis.start();
}
function updateLightbox() {
  const w = works[lbIndex];
  $("#lbImg").src = w.src;
  $("#lbImg").alt = w.title;
  $("#lbTitle").textContent = w.title;
  $("#lbTag").textContent = w.tag;
}
function lbStep(d) {
  lbIndex = (lbIndex + d + works.length) % works.length;
  updateLightbox();
}

/* ============================================================
   MENU
   ============================================================ */
function initMenu() {
  const toggle = $("#menuToggle");
  const menu = $("#overlay-menu");
  const label = $(".mt-label", toggle);

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    label.textContent = open ? "Fechar" : "Menu";
  };

  toggle.addEventListener("click", () =>
    setOpen(!menu.classList.contains("open"))
  );

  $$("[data-scroll]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-scroll");
      setOpen(false);
      setTimeout(() => scrollToId(target), 250);
    })
  );
}

function scrollToId(id) {
  const el = $(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/* ============================================================
   HERO SLIDESHOW + PARALLAX
   ============================================================ */
function initHero() {
  const slides = $$(".hero-slide");
  const idxEl = $("#heroIdx");
  let cur = 0;
  setInterval(() => {
    slides[cur].classList.remove("active");
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add("active");
    idxEl.textContent = "0" + (cur + 1);
  }, 4200);
}

/* ============================================================
   CURSOR
   ============================================================ */
function initCursor() {
  if (window.matchMedia("(hover: none)").matches) return;
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
  });
  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  document.addEventListener("mouseover", (e) => {
    const overShoot = e.target.closest(".work, .ens-shot, .hero-slide, #hero");
    const overLink = e.target.closest("a,button,[data-hover]");
    if (overShoot) {
      ring.classList.add("shoot");
      ring.classList.remove("is-hover");
    } else if (overLink) {
      ring.classList.add("is-hover");
      ring.classList.remove("shoot");
    }
  });
  document.addEventListener("mouseout", () => {
    ring.classList.remove("is-hover");
    ring.classList.remove("shoot");
  });
}

/* ============================================================
   LENIS + GSAP
   ============================================================ */
function initSmoothAndAnimations() {
  if (typeof gsap === "undefined") return;
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;
    lenis.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  if (typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero parallax + fade out
  gsap.to("#heroBg", {
    yPercent: 30, scale: 1.18, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to("#heroContent", {
    yPercent: -120, opacity: 0, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
  });

  // Section heads
  $$(".sec-head h2").forEach((el) => {
    gsap.from(el, {
      yPercent: 60, opacity: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  // Works fade-up stagger
  // Works reveal é feito pelo "curtain" (clip-path) — ver initCurtainReveal.
  // Não usar gsap.from(y/opacity) aqui para não conflitar com o tilt 3D (transform).

  // Story media parallax
  $$("[data-parallax]").forEach((el) => {
    gsap.fromTo(el, { yPercent: -12 }, {
      yPercent: 12, ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
  // Story number drift
  $$("[data-numshift]").forEach((el) => {
    gsap.fromTo(el, { xPercent: 8 }, {
      xPercent: -8, ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // Line reveals (hero title, about head)
  $$(".line-inner").forEach((el) => {
    gsap.to(el, {
      yPercent: 0, duration: 1, ease: "power4.out",
      scrollTrigger: { trigger: el, start: "top 92%" },
    });
  });

  // Generic reveal
  $$(".reveal").forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: "top 88%",
      onEnter: () => el.classList.add("in"),
    });
  });
}

/* ============================================================
   FORM
   ============================================================ */
function initForm() {
  const form = $("#contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const label = $("#submitLabel");
    label.textContent = "Mensagem enviada ✓";
    form.reset();
    setTimeout(() => (label.textContent = "Enviar mensagem"), 3500);
  });
}

/* ============================================================
   LOADER
   ============================================================ */
/* ============================================================
   HERO REVEAL — independent of the loader so the logo ALWAYS shows
   ============================================================ */
function revealHeroLogo() {
  const lines = $$(".hero-content .line-inner");
  const finish = () => {
    document.documentElement.classList.remove("js-reveal");
    if (window.gsap) gsap.set(lines, { clearProps: "transform" });
    else lines.forEach((l) => (l.style.transform = "none"));
  };
  if (window.gsap && !REDUCED) {
    gsap.to(lines, {
      yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.12,
      onComplete: finish,
    });
  } else {
    finish();
  }
}

/* ============================================================
   LOADER — purely visual cover; never gates the logo
   ============================================================ */
function initLoader() {
  const fill = $(".loader-fill");
  const pctEl = $(".loader-pct");
  const loader = $("#loader");
  let done = false;
  const hide = () => {
    if (done) return;
    done = true;
    loader.classList.add("done");
  };
  const safety = setTimeout(hide, 4000);
  let v = 0;
  const t = setInterval(() => {
    v += Math.random() * 9 + 3;
    if (v >= 100) {
      v = 100;
      clearInterval(t);
      clearTimeout(safety);
      setTimeout(hide, 500);
    }
    fill.style.width = v + "%";
    pctEl.textContent = Math.floor(v);
  }, 90);
}

/* ============================================================
   CAMERA FLASH — only fire while the hero is on screen
   ============================================================ */
function initCameraFlash() {
  const flash = $(".camera-flash");
  const hero = $("#hero");
  if (!flash || !hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          flash.classList.toggle("armed", e.isIntersecting)
        );
      },
      { threshold: 0.35 }
    );
    io.observe(hero);
  } else {
    flash.classList.add("armed");
  }
}

/* ============================================================
   EFEITOS PREMIUM — progress, whatsapp float, tilt, curtain
   ============================================================ */
function initScrollProgress() {
  const bar = $("#scrollProgress");
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  if (window.__lenis) window.__lenis.on("scroll", update);
  update();
}

function initWhatsFloat() {
  const wa = $("#waFloat");
  const hero = $("#hero");
  if (!wa || !hero) return;
  // aparece depois que o hero sai da tela
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => wa.classList.toggle("show", !e.isIntersecting)),
      { threshold: 0.2 }
    );
    io.observe(hero);
  } else {
    wa.classList.add("show");
  }
}

function initTilt() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  $$(".work").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${px * 7}deg) rotateX(${-py * 7}deg) scale(1.02)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

function initCurtainReveal() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    $$(".work").forEach((el) => el.classList.add("curtain"));
    return;
  }
  $$(".work").forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      onEnter: () => setTimeout(() => el.classList.add("curtain"), (i % 3) * 90),
    });
  });
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const safe = (fn) => { try { fn(); } catch (e) { console.warn("[PV]", e); } };

  safe(renderWorks);
  safe(renderStories);
  safe(renderFeed);
  safe(initCursor);
  safe(initMenu);
  safe(initHero);
  safe(initCameraFlash);
  safe(initForm);
  safe(initSmoothAndAnimations);
  safe(initScrollProgress);
  safe(initWhatsFloat);
  safe(initTilt);
  safe(initCurtainReveal);

  // lightbox events
  safe(() => {
    $("#lbClose").addEventListener("click", closeLightbox);
    $("#lbPrev").addEventListener("click", () => lbStep(-1));
    $("#lbNext").addEventListener("click", () => lbStep(1));
    $("#lightbox").addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!$("#lightbox").classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbStep(-1);
      if (e.key === "ArrowRight") lbStep(1);
    });
  });

  safe(initLoader);

  // Reveal the logo on next frame (independent of loader & libs).
  requestAnimationFrame(() => setTimeout(revealHeroLogo, 300));
  // Absolute fallback: never leave the logo hidden.
  setTimeout(() => {
    if (document.documentElement.classList.contains("js-reveal")) revealHeroLogo();
  }, 2500);
});
