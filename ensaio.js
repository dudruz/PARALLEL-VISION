/* ============================================================
   PARALLEL VISION — ensaio.js
   Monta a página de ensaio a partir de ?id= e liga animações.
   ============================================================ */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

function getId() {
  const p = new URLSearchParams(location.search);
  return p.get("id") || "flash";
}

function specRow(k, v) {
  return v ? `<div class="spec-item"><div class="k">${k}</div><div class="v">${v}</div></div>` : "";
}

/* SVG ornaments per layout */
function ornaments(layout) {
  if (layout === "amber") {
    // detailed botanical flowers + sun rays (golden hour florals)
    const bloom = (c) => `<svg class="orn-bloom" viewBox="0 0 120 120" fill="none">
      <g stroke="${c}" stroke-width="1.5" fill="${c}" fill-opacity="0.12">
        ${[0,60,120,180,240,300].map(a=>`<path d="M60 60 C 48 30, 72 30, 60 60" transform="rotate(${a} 60 60)"/>`).join("")}
        ${[30,90,150,210,270,330].map(a=>`<path d="M60 60 C 52 38, 68 38, 60 60" transform="rotate(${a} 60 60)" stroke-opacity="0.6"/>`).join("")}
      </g>
      <circle cx="60" cy="60" r="8" fill="${c}"/>
      <circle cx="60" cy="60" r="14" stroke="${c}" stroke-width="1" fill="none" opacity="0.5"/>
    </svg>`;
    const sprig = (c) => `<svg class="orn-sprig" viewBox="0 0 80 140" fill="none" stroke="${c}" stroke-width="1.5">
      <path d="M40 140 Q40 70 40 20" stroke-opacity="0.7"/>
      ${[30,50,70,90,110].map((y,i)=>`<path d="M40 ${y} Q${i%2?64:16} ${y-14} ${i%2?58:22} ${y-24}" stroke-opacity="0.6"/>`).join("")}
    </svg>`;
    return `
      <svg class="orn-sun" viewBox="0 0 200 200" fill="none" stroke="var(--amber)" stroke-width="1.5" opacity="0.45">
        <circle cx="100" cy="100" r="30"/>
        ${Array.from({length:32}).map((_,i)=>{const a=i*11.25*Math.PI/180;const r1=42,r2=Math.random()>0.5?62:54;return `<line x1="${(100+r1*Math.cos(a)).toFixed(1)}" y1="${(100+r1*Math.sin(a)).toFixed(1)}" x2="${(100+r2*Math.cos(a)).toFixed(1)}" y2="${(100+r2*Math.sin(a)).toFixed(1)}"/>`;}).join("")}
      </svg>
      <div class="orn orn-bloom-tl">${bloom("var(--gold)")}</div>
      <div class="orn orn-bloom-br">${bloom("var(--amber)")}</div>
      <div class="orn orn-sprig-l">${sprig("var(--gold)")}</div>
      <div class="orn orn-sprig-r">${sprig("var(--amber)")}</div>`;
  }
  if (layout === "sport") {
    return `
      <svg class="orn-court" viewBox="0 0 300 200" fill="none" stroke="#00d4ff" stroke-width="2" opacity="0.5">
        <circle cx="150" cy="200" r="70"/><line x1="80" y1="200" x2="80" y2="120"/><line x1="220" y1="200" x2="220" y2="120"/>
      </svg>
      <svg class="orn-ball" viewBox="0 0 100 100" fill="none" stroke="var(--burnt)" stroke-width="3">
        <circle cx="50" cy="50" r="40"/><path d="M50 10 V90 M10 50 H90 M22 22 Q50 50 78 78 M78 22 Q50 50 22 78"/>
      </svg>`;
  }
  if (layout === "night") {
    return `
      <svg class="orn-neon" viewBox="0 0 400 400" fill="none">
        <circle cx="200" cy="200" r="120" stroke="var(--neon)" stroke-width="1.5" opacity="0.4"/>
        <circle cx="200" cy="200" r="170" stroke="var(--amber)" stroke-width="1" opacity="0.25"/>
      </svg>`;
  }
  return "";
}

function buildEnsaio(e) {
  document.body.setAttribute("data-theme", e.theme || "");
  document.body.setAttribute("data-layout", e.layout || "");
  document.title = `${e.title} — PARALLEL VISION`;

  const specs = e.specs || {};
  const galleryHTML = (e.gallery || [])
    .map(
      (src, i) => `
      <figure class="ens-shot ens-reveal" data-i="${i}">
        <img src="${src}" alt="${e.title} — frame ${i + 1}" loading="lazy" />
        <span class="ens-shot-frame"></span>
      </figure>`
    )
    .join("");

  const bodyHTML = (e.body || []).map((p) => `<p>${p}</p>`).join("");

  $("#ensaioRoot").innerHTML = `
    <section class="ens-hero scanlines">
      <div class="ens-hero-bg" id="ensHeroBg" style="background-image:url('${e.cover}')"></div>
      <div class="ens-ornaments">${ornaments(e.layout)}</div>
      <div class="ens-hero-inner">
        <span class="ens-hero-num">${e.num}</span>
        <p class="ens-hero-sub">${e.subtitle}</p>
        <h1 class="ens-hero-title">${e.title}</h1>
        ${e.track ? `
        <div class="ens-player" id="ensPlayer">
          <button class="ens-play" id="ensPlayBtn" aria-label="Tocar música">
            <span class="ens-play-icon">▶</span>
          </button>
          <div class="ens-player-info">
            <div class="ens-eq" id="ensEq">${Array.from({length:7}).map(()=>'<span></span>').join("")}</div>
            <span class="ens-track-title">${e.track.title}</span>
          </div>
          ${e.track.file ? `<audio id="ensAudio" src="${e.track.file}" loop preload="auto"></audio>` : ""}
        </div>` : ""}
      </div>
      <span class="ens-scroll-hint">role para ver</span>
    </section>

    <div class="theme-bar"></div>

    <section class="ens-section">
      <p class="ens-intro ens-reveal">${e.intro}</p>
      <div class="ens-body ens-reveal">${bodyHTML}</div>

      <div class="ens-specs">
        <h3>Ficha técnica</h3>
        <div class="spec-grid">
          ${specRow("Câmera", specs.camera)}
          ${specRow("Lente", specs.lens)}
          ${specRow("ISO", specs.iso)}
          ${specRow("Obturador", specs.shutter)}
          ${specRow("Luz", specs.flash)}
          ${specRow("Local", specs.local)}
          ${specRow("Ano", specs.ano)}
        </div>
      </div>
    </section>

    <div class="theme-bar"></div>

    <section class="ens-gallery">
      ${galleryHTML}
    </section>
  `;

  // mobile cover swap — different hero image on small screens
  const heroBg = $("#ensHeroBg");
  if (e.coverMobile && heroBg) {
    const applyCover = () => {
      const src = window.matchMedia("(max-width: 767px)").matches ? e.coverMobile : e.cover;
      heroBg.style.backgroundImage = `url('${src}')`;
    };
    applyCover();
    window.addEventListener("resize", applyCover);
  }

  // music player — visual equalizer + optional audio (with autoplay attempt)
  const playBtn = $("#ensPlayBtn");
  if (playBtn) {
    const audio = $("#ensAudio");
    const eq = $("#ensEq");
    const icon = $(".ens-play-icon");
    const gal = () => $(".ens-gallery");
    let playing = false;

    const setPlaying = (state) => {
      playing = state;
      eq.classList.toggle("playing", playing);
      icon.textContent = playing ? "❚❚" : "▶";
      const g = gal();
      if (g) g.classList.toggle("beat", playing);
      if (audio) {
        if (playing) return audio.play();
        audio.pause();
      }
      return Promise.resolve();
    };

    playBtn.addEventListener("click", () => setPlaying(!playing).catch(() => {}));

    // Autoplay: navegadores bloqueiam som sem interação. Tentamos tocar;
    // se for bloqueado, iniciamos no PRIMEIRO gesto do usuário na página.
    if (audio) {
      audio.muted = false;
      const tryAuto = () => setPlaying(true).catch(() => {
        const startOnGesture = () => {
          setPlaying(true).catch(() => {});
          window.removeEventListener("pointerdown", startOnGesture);
          window.removeEventListener("keydown", startOnGesture);
          window.removeEventListener("scroll", startOnGesture);
        };
        window.addEventListener("pointerdown", startOnGesture, { once: true });
        window.addEventListener("keydown", startOnGesture, { once: true });
        window.addEventListener("scroll", startOnGesture, { once: true, passive: true });
      });
      setTimeout(tryAuto, 300);
    }
  }

  // lightbox wiring
  const gallery = e.gallery || [];
  let lbIndex = 0;
  const lb = $("#lightbox");
  const openLB = (i) => { lbIndex = i; $("#lbImg").src = gallery[i]; lb.classList.add("open"); if (window.__lenis) window.__lenis.stop(); };
  const closeLB = () => { lb.classList.remove("open"); if (window.__lenis) window.__lenis.start(); };
  const stepLB = (d) => { lbIndex = (lbIndex + d + gallery.length) % gallery.length; $("#lbImg").src = gallery[lbIndex]; };

  $$(".ens-shot").forEach((el) => el.addEventListener("click", () => openLB(+el.dataset.i)));
  $("#lbClose").addEventListener("click", closeLB);
  $("#lbPrev").addEventListener("click", () => stepLB(-1));
  $("#lbNext").addEventListener("click", () => stepLB(1));
  lb.addEventListener("click", (ev) => { if (ev.target.id === "lightbox") closeLB(); });
  document.addEventListener("keydown", (ev) => {
    if (!lb.classList.contains("open")) return;
    if (ev.key === "Escape") closeLB();
    if (ev.key === "ArrowLeft") stepLB(-1);
    if (ev.key === "ArrowRight") stepLB(1);
  });
}

/* ---- cursor (reuse) ---- */
function initCursor() {
  if (window.matchMedia("(hover: none)").matches) return;
  const dot = $(".cursor-dot"), ring = $(".cursor-ring");
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx-3}px,${my-3}px)`; });
  (function loop(){ rx += (mx-rx)*0.18; ry += (my-ry)*0.18; ring.style.transform = `translate(${rx-19}px,${ry-19}px)`; requestAnimationFrame(loop); })();
  document.addEventListener("mouseover", (e)=>{ if(e.target.closest("a,button,[data-hover],.ens-shot")) ring.classList.add("is-hover"); });
  document.addEventListener("mouseout", ()=> ring.classList.remove("is-hover"));
}

/* ---- smooth scroll + reveals ---- */
function initMotion() {
  if (typeof gsap === "undefined") {
    // sem libs: mostra tudo
    $$(".ens-reveal").forEach((el) => el.classList.add("in"));
    return;
  }
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({ duration: 1.15, easing: (t)=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothWheel: true, touchMultiplier: 1.6 });
    window.__lenis = lenis;
    if (typeof ScrollTrigger !== "undefined") { lenis.on("scroll", () => ScrollTrigger.update()); }
    gsap.ticker.add((t)=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0);
  }
  if (typeof ScrollTrigger === "undefined") { $$(".ens-reveal").forEach((el)=>el.classList.add("in")); return; }
  gsap.registerPlugin(ScrollTrigger);

  // hero parallax
  gsap.to("#ensHeroBg", { yPercent: 25, scale: 1.12, ease: "none",
    scrollTrigger: { trigger: ".ens-hero", start: "top top", end: "bottom top", scrub: true } });

  // reveals
  $$(".ens-reveal").forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: "top 88%", onEnter: () => el.classList.add("in") });
  });
}

/* ---- boot ---- */
document.addEventListener("DOMContentLoaded", () => {
  const data = window.ENSAIOS || {};
  const e = data[getId()];
  if (!e) {
    $("#ensaioRoot").innerHTML = `<div class="ensaio-loading">Ensaio não encontrado. <a href="index.html" style="color:var(--burnt);margin-left:.5rem">Voltar</a></div>`;
    return;
  }
  buildEnsaio(e);
  try { initCursor(); } catch (err) { console.warn(err); }
  try { initMotion(); } catch (err) { console.warn(err); $$(".ens-reveal").forEach((el)=>el.classList.add("in")); }
});
