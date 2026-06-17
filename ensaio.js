/* ============================================================
   PARALLEL VISION — ensaio.js
   Monta a página de ensaio a partir de ?id= e liga animações.
   ============================================================ */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// troca .jpeg/.jpg por .webp (versão otimizada)
function webp(src) {
  return src.replace(/\.(jpe?g|png)$/i, ".webp");
}
// monta <picture> com WebP + fallback original
function pic(src, alt, cls, extra) {
  return `<picture>
    <source srcset="${webp(src)}" type="image/webp" />
    <img src="${src}" alt="${alt || ""}" ${cls ? `class="${cls}"` : ""} loading="lazy" ${extra || ""} />
  </picture>`;
}

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
  if (layout === "copa") {
    // bandeirinhas do Brasil (bunting) no topo + confete verde/amarelo
    const flag = (x, delay) => `
      <div class="bunting-flag" style="left:${x}%; animation-delay:${delay}s">
        <svg viewBox="0 0 40 50"><polygon points="0,0 40,0 20,42" fill="#009b3a"/>
          <polygon points="6,0 34,0 20,30" fill="#ffdf00"/><circle cx="20" cy="12" r="6" fill="#002776"/></svg>
      </div>`;
    const flags = Array.from({ length: 11 }).map((_, i) => flag(i * 9 + 2, (i % 4) * 0.25)).join("");
    const confetti = Array.from({ length: 18 }).map(() => {
      const colors = ["#009b3a", "#ffdf00", "#002776"];
      const c = colors[Math.floor(Math.random() * 3)];
      const x = (Math.random() * 100).toFixed(0);
      const d = (Math.random() * 5).toFixed(1);
      const dur = (4 + Math.random() * 4).toFixed(1);
      return `<span class="confetti" style="left:${x}%; background:${c}; animation-delay:${d}s; animation-duration:${dur}s"></span>`;
    }).join("");
    return `
      <div class="bunting">${flags}</div>
      <div class="confetti-field">${confetti}</div>`;
  }
  return "";
}

function buildEnsaio(e) {
  document.body.setAttribute("data-theme", e.theme || "");
  document.body.setAttribute("data-layout", e.layout || "");
  document.title = `${e.title} — PARALLEL VISION`;

  const specs = e.specs || {};
  const ehPago = e.venda && e.venda.paid;
  const wmHTML = ehPago
    ? `<span class="wm-text">${Array.from({ length: 60 }, () => "<span>PARALLEL VISION</span>").join("")}</span>`
    : "";
  const galleryHTML = (e.gallery || [])
    .map(
      (src, i) => `
      <figure class="ens-shot ens-reveal" data-i="${i}">
        ${pic(src, `${e.title} — frame ${i + 1}`)}
        <span class="ens-shot-frame"></span>
        ${wmHTML}
        ${ehPago ? `<span class="ens-shot-num">#${i + 1}</span>` : ""}
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

    ${e.venda && e.venda.paid ? `
    <section class="ens-venda" id="ensVenda">
      <div class="venda-card">
        <span class="venda-tag">Evento pago</span>
        <h3>Quer as fotos sem marca d'água?</h3>
        <p class="venda-precos">
          Pack completo <strong>${e.venda.precoPack || ""}</strong>
          ${e.venda.precoFoto ? ` · Foto avulsa <strong>${e.venda.precoFoto}</strong>` : ""}
        </p>
        <p class="venda-info">Pague pelo link, depois é só pedir aqui com seu e-mail. Liberamos o acesso por ${(window.PV_CONFIG||{}).DIAS_ACESSO || 5} dias.</p>
        <div class="venda-actions">
          ${e.venda.linkPagamento ? `<a class="venda-btn pay" href="${e.venda.linkPagamento}" target="_blank" rel="noreferrer">Pagar agora</a>` : ""}
          <button class="venda-btn ask" id="btnPedir">Já paguei — pedir fotos</button>
          <a class="venda-btn ghost" href="acesso.html?evento=${e.id}" >Já tenho acesso</a>
        </div>
      </div>
    </section>` : ""}

    <section class="ens-gallery${ehPago ? " ens-gallery-paga" : ""}">
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

  // fluxo de PEDIDO (evento pago) — abre modal com miniaturas
  const btnPedir = $("#btnPedir");
  if (btnPedir) {
    btnPedir.addEventListener("click", () => abrirModalPedido(e));
  }

  // lightbox wiring
  const gallery = e.gallery || [];
  const ehPagoLB = e.venda && e.venda.paid;
  let lbIndex = 0;
  const lb = $("#lightbox");
  // monta a marca d'água do lightbox (densa) se for pago
  const lbWm = $("#lbWatermark");
  if (ehPagoLB && lbWm) {
    lbWm.innerHTML = Array.from({ length: 80 }, () => "<span>PARALLEL VISION</span>").join("");
    lbWm.style.display = "flex";
  }
  const openLB = (i) => { lbIndex = i; setLbImg(gallery[i]); lb.classList.add("open"); if (window.__lenis) window.__lenis.stop(); };
  const closeLB = () => { lb.classList.remove("open"); if (window.__lenis) window.__lenis.start(); };
  const stepLB = (d) => { lbIndex = (lbIndex + d + gallery.length) % gallery.length; setLbImg(gallery[lbIndex]); };
  // usa webp no lightbox (com fallback automático do navegador via onerror)
  function setLbImg(src) {
    const img = $("#lbImg");
    img.onerror = () => { img.onerror = null; img.src = src; }; // fallback p/ original
    img.src = webp(src);
  }

  $$(".ens-shot").forEach((el) => el.addEventListener("click", () => openLB(+el.dataset.i)));
  $("#lbClose").addEventListener("click", closeLB);
  $("#lbPrev").addEventListener("click", () => stepLB(-1));
  $("#lbNext").addEventListener("click", () => stepLB(1));
  lb.addEventListener("click", (ev) => { if (ev.target.id === "lightbox") closeLB(); });

  // em eventos pagos: dificulta salvar (clique direito) nas fotos
  if (ehPagoLB) {
    const bloquear = (ev) => { ev.preventDefault(); return false; };
    $$(".ens-shot img").forEach((img) => img.addEventListener("contextmenu", bloquear));
    const lbImg = $("#lbImg");
    if (lbImg) lbImg.addEventListener("contextmenu", bloquear);
  }
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

/* ============================================================
   MODAL DE PEDIDO — seleção de fotos com miniatura + digitar
   ============================================================ */
function abrirModalPedido(e) {
  const $ = (s) => document.querySelector(s);
  // remove modal anterior se existir
  const antigo = document.getElementById("pedidoModal");
  if (antigo) antigo.remove();

  const galeria = e.gallery || [];
  const precoPack = (e.venda && e.venda.precoPack) || "";
  const precoFoto = (e.venda && e.venda.precoFoto) || "";
  const wpp = (window.PV_CONFIG || {}).WHATSAPP || "";

  const thumbs = galeria.map((src, i) => `
    <button type="button" class="pm-thumb" data-n="${i + 1}">
      ${pic(src, `Foto ${i + 1}`)}
      <span class="pm-thumb-num">#${i + 1}</span>
      <span class="pm-thumb-check">✓</span>
    </button>`).join("");

  const modal = document.createElement("div");
  modal.id = "pedidoModal";
  modal.className = "pm-overlay";
  modal.setAttribute("data-lenis-prevent", "");
  modal.innerHTML = `
    <div class="pm-box">
      <button class="pm-close" id="pmClose" aria-label="Fechar">×</button>
      <h3 class="pm-title">Pedir fotos — ${e.title}</h3>

      <div class="pm-tipo">
        <button type="button" class="pm-tipo-btn active" data-tipo="fotos">Fotos avulsas ${precoFoto ? `(${precoFoto} cada)` : ""}</button>
        <button type="button" class="pm-tipo-btn" data-tipo="pack">Pack completo ${precoPack ? `(${precoPack})` : ""}</button>
      </div>

      <div id="pmFotosArea">
        <p class="pm-hint">Clique nas fotos que você quer, ou digite os números abaixo.</p>
        <div class="pm-grid">${thumbs}</div>
        <div class="pm-field">
          <label>Números das fotos (separados por vírgula)</label>
          <input type="text" id="pmNums" placeholder="ex: 1, 4, 7" />
        </div>
      </div>

      <div id="pmPackMsg" class="pm-pack-msg" style="display:none">
        Você está pedindo o <strong>pack completo</strong> (todas as ${galeria.length} fotos).
      </div>

      <div class="pm-field">
        <label>Seu nome</label>
        <input type="text" id="pmNome" placeholder="Seu nome" />
      </div>
      <div class="pm-field">
        <label>Seu e-mail (onde você recebe o acesso)</label>
        <input type="email" id="pmEmail" placeholder="seu@email.com" />
      </div>

      <div id="pmMsg"></div>
      <button class="pm-enviar" id="pmEnviar">Enviar pedido</button>
      <p class="pm-obs">Depois de confirmarmos o pagamento, você recebe um código de acesso por e-mail.</p>
    </div>`;
  document.body.appendChild(modal);
  if (window.__lenis) window.__lenis.stop();

  let tipo = "fotos";
  const selecionadas = new Set();

  const sincronizarNums = () => {
    $("#pmNums").value = [...selecionadas].sort((a, b) => a - b).join(", ");
  };
  const sincronizarThumbs = () => {
    modal.querySelectorAll(".pm-thumb").forEach((t) => {
      const n = +t.dataset.n;
      t.classList.toggle("sel", selecionadas.has(n));
    });
  };

  // clicar nas miniaturas
  modal.querySelectorAll(".pm-thumb").forEach((t) => {
    t.addEventListener("click", () => {
      const n = +t.dataset.n;
      if (selecionadas.has(n)) selecionadas.delete(n); else selecionadas.add(n);
      sincronizarThumbs(); sincronizarNums();
    });
  });

  // digitar números reflete nas miniaturas
  $("#pmNums").addEventListener("input", () => {
    selecionadas.clear();
    $("#pmNums").value.split(",").forEach((x) => {
      const n = parseInt(x.trim().replace(/\D/g, ""), 10);
      if (n >= 1 && n <= galeria.length) selecionadas.add(n);
    });
    sincronizarThumbs();
  });

  // alternar tipo (fotos / pack)
  modal.querySelectorAll(".pm-tipo-btn").forEach((b) => {
    b.addEventListener("click", () => {
      modal.querySelectorAll(".pm-tipo-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      tipo = b.dataset.tipo;
      $("#pmFotosArea").style.display = tipo === "fotos" ? "block" : "none";
      $("#pmPackMsg").style.display = tipo === "pack" ? "block" : "none";
    });
  });

  // fechar
  const fechar = () => { modal.remove(); if (window.__lenis) window.__lenis.start(); };
  $("#pmClose").addEventListener("click", fechar);
  modal.addEventListener("click", (ev) => { if (ev.target === modal) fechar(); });

  // enviar
  $("#pmEnviar").addEventListener("click", async () => {
    const email = $("#pmEmail").value.trim();
    const nome = $("#pmNome").value.trim();
    $("#pmMsg").innerHTML = "";
    if (!email) { $("#pmMsg").innerHTML = `<div class="pm-err">Digite seu e-mail.</div>`; return; }
    // evento privado: só o(s) e-mail(s) permitido(s) pode(m) pedir
    if (e.venda && (e.venda.emailPermitido || e.venda.emailsPermitidos)) {
      const lista = e.venda.emailsPermitidos || [e.venda.emailPermitido];
      const permitidos = lista.map((x) => String(x).toLowerCase().trim());
      if (!permitidos.includes(email.toLowerCase())) {
        $("#pmMsg").innerHTML = `<div class="pm-err">Este é um evento privado. Use o e-mail autorizado para acessar.</div>`;
        return;
      }
    }
    let fotos = [];
    if (tipo === "fotos") {
      fotos = [...selecionadas].sort((a, b) => a - b).map(String);
      if (!fotos.length) { $("#pmMsg").innerHTML = `<div class="pm-err">Escolha pelo menos uma foto (clique ou digite os números).</div>`; return; }
    }
    const btn = $("#pmEnviar");
    btn.disabled = true; btn.textContent = "Processando…";
    try {
      const pedido = await window.PV_VENDA.criarPedido({ email, nome, evento: e.id, tipo, fotos });

      // tenta gerar o link de pagamento automático (Edge Function)
      const cfg = window.PV_CONFIG || {};
      const supaUrl = cfg.SUPABASE_URL || "";
      let linkPagamento = null;
      if (supaUrl && pedido && pedido.id) {
        try {
          const resp = await fetch(`${supaUrl}/functions/v1/criar-pagamento`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${cfg.SUPABASE_ANON_KEY || ""}`,
            },
            body: JSON.stringify({
              pedido_id: pedido.id,
              precoPack: e.venda.precoPack,
              precoFoto: e.venda.precoFoto,
              qtdFotos: fotos.length,
              evento: e.id,
              titulo: e.title,
            }),
          });
          const dados = await resp.json();
          if (dados && dados.url) linkPagamento = dados.url;
        } catch (errPag) {
          linkPagamento = null; // função não publicada ainda → modo manual
        }
      }

      if (linkPagamento) {
        // pagamento automático: redireciona pro InfinitePay
        modal.querySelector(".pm-box").innerHTML = `
          <div class="pm-sucesso">
            <div class="pm-sucesso-ic">→</div>
            <h3>Redirecionando para o pagamento…</h3>
            <p>Você será levado para a tela de pagamento segura. Após pagar, recebe o código por e-mail automaticamente.</p>
          </div>`;
        setTimeout(() => { window.location.href = linkPagamento; }, 1500);
      } else {
        // modo manual (link fixo ou WhatsApp): mantém o fluxo antigo
        const linkFixo = e.venda.linkPagamento && !e.venda.linkPagamento.includes("SEU-LINK") ? e.venda.linkPagamento : null;
        modal.querySelector(".pm-box").innerHTML = `
          <button class="pm-close" id="pmClose2">×</button>
          <div class="pm-sucesso">
            <div class="pm-sucesso-ic">✓</div>
            <h3>Pedido registrado!</h3>
            ${linkFixo
              ? `<p>Finalize o pagamento no link abaixo. Depois é só aguardar o código de acesso por e-mail.</p>
                 <a href="${linkFixo}" target="_blank" class="pm-enviar" style="display:inline-block;text-decoration:none;margin-top:1rem">Pagar agora</a>`
              : `<p>Assim que confirmarmos o pagamento, você recebe um <strong>código de acesso</strong> no e-mail <strong>${email}</strong>.</p>`}
            <p class="pm-obs">Dúvidas? Chame no WhatsApp ${wpp}.</p>
          </div>`;
        const c2 = modal.querySelector("#pmClose2");
        if (c2) c2.addEventListener("click", fechar);
      }
    } catch (err) {
      btn.disabled = false; btn.textContent = "Enviar pedido";
      $("#pmMsg").innerHTML = `<div class="pm-err">Não foi possível enviar: ${err.message}${wpp ? `<br/>Chame no WhatsApp: ${wpp}` : ""}</div>`;
    }
  });
}
