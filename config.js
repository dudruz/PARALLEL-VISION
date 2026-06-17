/* ============================================================
   PARALLEL VISION — config.js
   COLE AQUI suas chaves. É o ÚNICO arquivo que você precisa editar
   para o sistema de venda funcionar. Tudo é chave PÚBLICA (seguro no site).
   ============================================================ */
window.PV_CONFIG = {
  /* ---- SUPABASE (Passo 2 do guia) ---- */
  // Project Settings → API
  SUPABASE_URL: "https://keduxajzwhazaessbgxk.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZHV4YWp6d2hhemFlc3NiZ3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MjEzMzcsImV4cCI6MjA5NzE5NzMzN30.ypaQQcwHpF_GrE4wQ_MHqpdTNqF8LTHgjudxZvCj7V4",

  /* ---- EMAILJS (e-mail automático grátis) ---- */
  // painel do EmailJS → as 3 infos abaixo
  EMAILJS_PUBLIC_KEY: "MBlDI-XmPPtEa4aCj",  // Account → API Keys → Public Key
  EMAILJS_SERVICE_ID: "service_ts487i9",  // Email Services → Service ID
  EMAILJS_TEMPLATE_ID: "template_wrnfbj8", // Email Templates → Template ID

  /* ---- INFINITEPAY (pagamento) ---- */
  INFINITEPAY_HANDLE: "evmoreirar",     // sua InfiniteTag (sem o $)

  /* ---- CONFIGURAÇÕES GERAIS ---- */
  DIAS_ACESSO: 5,                       // por quantos dias o acesso fica liberado
  BUCKET_FOTOS: "fotos-pagas",          // nome do bucket no Supabase Storage
  WHATSAPP: "5531983440061",            // fallback de contato
  LINK_EXPIRA_MIN: 10,                  // validade do link temporário (minutos)
};
