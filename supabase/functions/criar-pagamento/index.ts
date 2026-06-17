// ============================================================
// PARALLEL VISION — Edge Function: criar-pagamento
// ------------------------------------------------------------
// Recebe o id do pedido, monta o link de pagamento no InfinitePay
// e devolve a URL para o site redirecionar o cliente.
//
// COMO PUBLICAR (painel web do Supabase, sem instalar nada):
//   1. Supabase → Edge Functions → Create a new function
//   2. Nome: criar-pagamento
//   3. Cole TODO este arquivo
//   4. Deploy
//   5. Variáveis (Settings → Edge Functions):
//        INFINITEPAY_HANDLE, SITE_URL, WEBHOOK_URL
//      (NÃO crie SUPABASE_URL nem SUPABASE_SERVICE_ROLE_KEY — automáticas.)
//      - SITE_URL: endereço do seu site publicado
//                  (ex: https://parallel-visionfts.github.io/site)
//      - WEBHOOK_URL: a URL da função pagamento-webhook
//                  (ex: https://SEU-PROJETO.supabase.co/functions/v1/pagamento-webhook)
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// converte "R$ 40" / "R$ 6,50" em centavos (4000 / 650)
function precoParaCentavos(txt) {
  if (!txt) return 0;
  const limpo = String(txt).replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".");
  const valor = parseFloat(limpo);
  return Math.round((isNaN(valor) ? 0 : valor) * 100);
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), {
      status: 405, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  try {
    const { pedido_id, precoPack, precoFoto, qtdFotos, evento, titulo } = await req.json();
    if (!pedido_id) {
      return new Response(JSON.stringify({ error: "pedido_id ausente" }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const handle = Deno.env.get("INFINITEPAY_HANDLE");
    const siteUrl = Deno.env.get("SITE_URL") || "";
    const webhookUrl = Deno.env.get("WEBHOOK_URL") || "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const db = createClient(supabaseUrl, serviceKey);

    // confere o pedido no banco (fonte da verdade para o valor)
    const { data: pedidos, error } = await db
      .from("pedidos").select("*").eq("id", pedido_id).limit(1);
    if (error) throw error;
    if (!pedidos || !pedidos.length) {
      return new Response(JSON.stringify({ error: "Pedido não encontrado" }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }
    const pedido = pedidos[0];

    // calcula o valor com base no tipo do pedido
    let centavos = 0;
    let descricao = "";
    if (pedido.tipo === "pack") {
      centavos = precoParaCentavos(precoPack);
      descricao = `Pack completo — ${titulo || evento}`;
    } else {
      const qtd = (pedido.fotos && pedido.fotos.length) || qtdFotos || 1;
      centavos = precoParaCentavos(precoFoto) * qtd;
      descricao = `${qtd} foto(s) — ${titulo || evento}`;
    }
    if (centavos <= 0) {
      return new Response(JSON.stringify({ error: "Valor inválido" }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // monta a requisição do checkout InfinitePay
    const corpo = {
      handle: handle,
      redirect_url: `${siteUrl}/acesso.html?evento=${encodeURIComponent(pedido.evento)}&email=${encodeURIComponent(pedido.email)}`,
      webhook_url: webhookUrl,
      order_nsu: String(pedido.id),
      customer: {
        name: pedido.nome || "Cliente",
        email: pedido.email,
      },
      items: [{ quantity: 1, price: centavos, description: descricao }],
    };

    const resp = await fetch("https://api.checkout.infinitepay.io/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    const dados = await resp.json();

    if (!dados || !dados.url) {
      return new Response(JSON.stringify({ error: "InfinitePay não retornou link", detalhe: dados }), {
        status: 502, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: dados.url }), {
      status: 200, headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
