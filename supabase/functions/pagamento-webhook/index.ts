// ============================================================
// PARALLEL VISION — Edge Function: pagamento-webhook
// ------------------------------------------------------------
// Recebe a notificação de pagamento do InfinitePay (webhook),
// CONFIRMA o pagamento de forma independente (payment_check),
// e libera o pedido (status=liberado, gera código, e-mail é
// disparado pelo site quando o cliente acessa — ver nota).
//
// COMO PUBLICAR (pelo painel web do Supabase, sem instalar nada):
//   1. Supabase → Edge Functions → Create a new function
//   2. Nome: pagamento-webhook
//   3. Cole TODO este arquivo no editor
//   4. Deploy
//   5. Em Settings → Edge Functions, adicione as variáveis:
//        INFINITEPAY_HANDLE, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY,
//        EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, SITE_URL
//      (NÃO crie SUPABASE_URL nem SUPABASE_SERVICE_ROLE_KEY — o Supabase
//       injeta as duas automaticamente em toda Edge Function.)
//   6. A URL pública da função vai ser algo como:
//        https://SEU-PROJETO.supabase.co/functions/v1/pagamento-webhook
//      Essa URL é o webhook_url que o site envia ao InfinitePay.
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  // só aceita POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, message: "Método não permitido" }), {
      status: 405, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    // dados que o InfinitePay envia
    const orderNsu = body.order_nsu;
    const slug = body.invoice_slug || body.slug;
    const transactionNsu = body.transaction_nsu;
    const paidAmount = body.paid_amount || body.amount;

    if (!orderNsu) {
      return new Response(JSON.stringify({ success: false, message: "order_nsu ausente" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    // conecta no Supabase com a service role (acesso total, só no servidor)
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const handle = Deno.env.get("INFINITEPAY_HANDLE");
    const db = createClient(supabaseUrl, serviceKey);

    // 1) o pedido existe? (order_nsu é o id do pedido no nosso sistema)
    const { data: pedidos, error: errBusca } = await db
      .from("pedidos")
      .select("*")
      .eq("id", orderNsu)
      .limit(1);
    if (errBusca) throw errBusca;
    if (!pedidos || !pedidos.length) {
      return new Response(JSON.stringify({ success: false, message: "Pedido não encontrado" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }
    const pedido = pedidos[0];

    // se já está liberado, responde OK (evita processar 2x)
    if (pedido.status === "liberado") {
      return new Response(JSON.stringify({ success: true, message: "já liberado" }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }

    // 2) CONFIRMA o pagamento de forma independente (anti-fraude)
    //    consulta o InfinitePay para garantir que pagou de verdade
    let pagamentoOk = false;
    try {
      const check = await fetch("https://api.checkout.infinitepay.io/payment_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: handle,
          order_nsu: String(orderNsu),
          transaction_nsu: transactionNsu,
          slug: slug,
        }),
      });
      const checkData = await check.json();
      pagamentoOk = checkData && checkData.success && checkData.paid;
    } catch (e) {
      // se a verificação falhar, não libera (segurança)
      pagamentoOk = false;
    }

    if (!pagamentoOk) {
      return new Response(JSON.stringify({ success: false, message: "Pagamento não confirmado" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    // 3) gera/reusa código de acesso (permanente por e-mail)
    const email = (pedido.email || "").trim().toLowerCase();
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
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const bloco = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      codigo = `PV-${bloco()}-${bloco()}`;
    }

    // 4) libera o pedido
    const { error: errUpd } = await db
      .from("pedidos")
      .update({
        status: "liberado",
        liberado_em: new Date().toISOString(),
        codigo: codigo,
        pago: true,
        pago_em: new Date().toISOString(),
      })
      .eq("id", pedido.id);
    if (errUpd) throw errUpd;

    // 5) envia o e-mail com o código (EmailJS via REST, com private key)
    try {
      const emailjsPublic = Deno.env.get("EMAILJS_PUBLIC_KEY");
      const emailjsPrivate = Deno.env.get("EMAILJS_PRIVATE_KEY");
      const serviceId = Deno.env.get("EMAILJS_SERVICE_ID");
      const templateId = Deno.env.get("EMAILJS_TEMPLATE_ID");
      const siteUrl = Deno.env.get("SITE_URL") || "";
      const dias = 5;
      if (emailjsPublic && serviceId && templateId) {
        const link = `${siteUrl}/acesso.html?evento=${encodeURIComponent(pedido.evento)}&email=${encodeURIComponent(pedido.email)}&codigo=${encodeURIComponent(codigo)}`;
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: emailjsPublic,
            accessToken: emailjsPrivate, // private key (modo servidor)
            template_params: {
              to_email: pedido.email,
              to_name: pedido.nome || "cliente",
              evento: pedido.evento,
              dias: dias,
              codigo: codigo,
              link_acesso: link,
            },
          }),
        });
      }
    } catch (e) {
      // se o e-mail falhar, o pedido já está liberado; cliente pode acessar pelo redirect
      console.warn("Falha ao enviar e-mail:", e);
    }

    // responde OK para o InfinitePay
    return new Response(JSON.stringify({ success: true, message: null }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: String(e) }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }
});
