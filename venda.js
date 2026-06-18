/* ============================================================
   PARALLEL VISION — venda.js
   Motor do sistema de venda: pedidos, acesso de N dias, downloads.
   Usa Supabase (banco + storage) e EmailJS (e-mail automático).
   Requer: config.js carregado antes; SDKs do Supabase e EmailJS.
   ============================================================ */
(function () {
  const CFG = window.PV_CONFIG || {};
  let sb = null;

  /* ---- inicializa Supabase se as chaves existirem ---- */
  function getSupabase() {
    if (sb) return sb;
    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY) return null;
    if (typeof window.supabase === "undefined") return null;
    sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
    return sb;
  }

  /* ---- inicializa EmailJS ---- */
  function initEmail() {
    if (typeof emailjs !== "undefined" && CFG.EMAILJS_PUBLIC_KEY) {
      try { emailjs.init({ publicKey: CFG.EMAILJS_PUBLIC_KEY }); } catch (e) {}
    }
  }

  /* ============================================================
     EVENTOS — carrega do banco (tabela eventos) e mescla com os
     eventos do arquivo (ensaios-data.js) como fallback de segurança.
     Eventos do banco têm prioridade. Banco fora do ar → usa só o arquivo.
     ============================================================ */
  async function carregarEventos() {
    const doArquivo = window.ENSAIOS_LOCAIS || {}; // os do ensaios-data.js
    let doBanco = {};
    try {
      const db = getSupabase();
      if (db) {
        const { data, error } = await db
          .from("eventos")
          .select("*")
          .eq("publicado", true)
          .order("ordem", { ascending: true });
        if (!error && data) {
          for (const linha of data) {
            if (linha.dados) doBanco[linha.id] = linha.dados; // 'dados' = objeto completo
          }
        }
      }
    } catch (e) {
      console.warn("Eventos do banco indisponíveis, usando os locais.", e);
    }
    // mescla: arquivo como base, banco sobrescreve/adiciona
    const todos = { ...doArquivo, ...doBanco };
    window.ENSAIOS = todos;
    return todos;
  }

  /* ============================================================
     CLIENTE — cria um pedido de fotos
     payload: { email, nome, evento, tipo, fotos:[ids], total }
     ============================================================ */
  async function criarPedido(payload) {
    const db = getSupabase();
    if (!db) throw new Error("Sistema de venda ainda não configurado (Supabase).");
    const registro = {
      email: payload.email.trim().toLowerCase(),
      nome: payload.nome || "",
      evento: payload.evento,
      tipo: payload.tipo,           // "pack" ou "fotos"
      fotos: payload.fotos || [],   // lista de nomes/ids
      status: "pendente",
      criado_em: new Date().toISOString(),
    };
    // tenta inserir retornando a linha (precisa de policy SELECT p/ anon)
    let { data, error } = await db.from("pedidos").insert([registro]).select();
    if (error) {
      // se o erro foi por causa do SELECT (RLS), tenta inserir SEM retornar
      // e busca o pedido logo em seguida pelo email+evento mais recente
      const insertOnly = await db.from("pedidos").insert([registro]);
      if (insertOnly.error) throw insertOnly.error;
      // busca o pedido recém-criado (pode falhar se não houver SELECT p/ anon, tudo bem)
      try {
        const busca = await db
          .from("pedidos")
          .select("*")
          .eq("email", registro.email)
          .eq("evento", registro.evento)
          .order("criado_em", { ascending: false })
          .limit(1);
        data = busca.data;
      } catch (_) {
        data = null;
      }
    }
    return data && data[0] ? data[0] : registro;
  }

  /* ============================================================
     CLIENTE — verifica se o e-mail tem acesso liberado e válido
     retorna { liberado, expira_em, pedido } ou { liberado:false }
     ============================================================ */
  async function verificarAcesso(email, evento, codigo) {
    const db = getSupabase();
    if (!db) throw new Error("Sistema não configurado.");
    const e = email.trim().toLowerCase();
    const cod = (codigo || "").trim().toUpperCase();
    if (!cod) return { liberado: false, semCodigo: true };
    const { data, error } = await db
      .from("pedidos")
      .select("*")
      .eq("email", e)
      .eq("evento", evento)
      .eq("status", "liberado")
      .eq("codigo", cod)
      .order("liberado_em", { ascending: false })
      .limit(1);
    if (error) throw error;
    if (!data || !data.length) return { liberado: false };
    const pedido = data[0];
    // checa prazo
    const liberadoEm = new Date(pedido.liberado_em);
    const dias = CFG.DIAS_ACESSO || 5;
    const expira = new Date(liberadoEm.getTime() + dias * 86400000);
    if (new Date() > expira) return { liberado: false, expirado: true };
    return { liberado: true, expira_em: expira, pedido };
  }

  /* ============================================================
     CLIENTE — gera link temporário de download de uma foto/pack
     (o arquivo está no bucket privado; signed URL expira)
     ============================================================ */
  async function gerarLinkDownload(caminho) {
    const db = getSupabase();
    if (!db) throw new Error("Sistema não configurado.");
    const segundos = (CFG.LINK_EXPIRA_MIN || 10) * 60;
    const { data, error } = await db.storage
      .from(CFG.BUCKET_FOTOS || "fotos-pagas")
      .createSignedUrl(caminho, segundos);
    if (error) throw error;
    return data.signedUrl;
  }

  /* ============================================================
     DIAGNÓSTICO — lista os arquivos de uma pasta do bucket.
     Útil para descobrir o caminho/nome real das fotos.
     Use no console: await PV_VENDA.listarArquivos("baile_verao")
     ============================================================ */
  async function listarArquivos(pasta) {
    const db = getSupabase();
    if (!db) throw new Error("Sistema não configurado.");
    const { data, error } = await db.storage
      .from(CFG.BUCKET_FOTOS || "fotos-pagas")
      .list(pasta || "", { limit: 100 });
    if (error) throw error;
    return (data || []).map((f) => f.name);
  }

  /* ============================================================
     ADMIN — lista pedidos (pendentes por padrão)
     ============================================================ */
  async function listarPedidos(status) {
    const db = getSupabase();
    if (!db) throw new Error("Sistema não configurado.");
    let q = db.from("pedidos").select("*").order("criado_em", { ascending: false });
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }

  /* ---- gera um código de acesso tipo PV-A1B2-C3D4 ---- */
  function gerarCodigo() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem I,O,0,1 (confusos)
    const bloco = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `PV-${bloco()}-${bloco()}`;
  }

  /* ============================================================
     ADMIN — libera um pedido (gera/reusa código + dispara e-mail)
     ============================================================ */
  async function liberarPedido(pedido) {
    const db = getSupabase();
    if (!db) throw new Error("Sistema não configurado.");
    const email = (pedido.email || "").trim().toLowerCase();

    // código permanente por e-mail: se este e-mail já tem código, reusa
    let codigo = null;
    const { data: existentes } = await db
      .from("pedidos")
      .select("codigo")
      .eq("email", email)
      .not("codigo", "is", null)
      .limit(1);
    if (existentes && existentes.length && existentes[0].codigo) {
      codigo = existentes[0].codigo;
    } else {
      codigo = gerarCodigo();
    }

    const agora = new Date().toISOString();
    const { error } = await db
      .from("pedidos")
      .update({ status: "liberado", liberado_em: agora, codigo: codigo })
      .eq("id", pedido.id);
    if (error) throw error;
    // dispara e-mail com o código (se EmailJS configurado)
    await enviarEmailLiberado({ ...pedido, codigo });
    return { ok: true, codigo };
  }

  /* ---- ADMIN — nega um pedido ---- */
  async function negarPedido(pedido) {
    const db = getSupabase();
    if (!db) throw new Error("Sistema não configurado.");
    const { error } = await db
      .from("pedidos")
      .update({ status: "negado" })
      .eq("id", pedido.id);
    if (error) throw error;
    return true;
  }

  /* ============================================================
     E-MAIL — avisa o cliente que o acesso foi liberado
     ============================================================ */
  async function enviarEmailLiberado(pedido) {
    if (typeof emailjs === "undefined" || !CFG.EMAILJS_SERVICE_ID || !CFG.EMAILJS_TEMPLATE_ID) {
      return false; // EmailJS não configurado — admin avisa manual (WhatsApp)
    }
    const dias = CFG.DIAS_ACESSO || 5;
    const link = `${location.origin}${location.pathname.replace(/[^/]*$/, "")}acesso.html?evento=${encodeURIComponent(pedido.evento)}&email=${encodeURIComponent(pedido.email)}&codigo=${encodeURIComponent(pedido.codigo || "")}`;
    try {
      await emailjs.send(CFG.EMAILJS_SERVICE_ID, CFG.EMAILJS_TEMPLATE_ID, {
        to_email: pedido.email,
        to_name: pedido.nome || "cliente",
        evento: pedido.evento,
        dias: dias,
        codigo: pedido.codigo || "",
        link_acesso: link,
      });
      return true;
    } catch (e) {
      console.warn("Falha ao enviar e-mail:", e);
      return false;
    }
  }

  /* ---- expõe a API ---- */
  window.PV_VENDA = {
    getSupabase,
    initEmail,
    carregarEventos,
    criarPedido,
    verificarAcesso,
    gerarLinkDownload,
    listarArquivos,
    listarPedidos,
    liberarPedido,
    negarPedido,
    enviarEmailLiberado,
  };

  document.addEventListener("DOMContentLoaded", initEmail);
})();
