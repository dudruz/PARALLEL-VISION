# GUIA — Pagamento Automático (InfinitePay + Supabase Edge Functions)

Este guia liga o pagamento automático: cliente paga → sistema libera sozinho
→ manda o código por e-mail. Tudo pelo painel web, NADA instalado no PC.

================================================================
PASSO 1 — Adicionar colunas na tabela (SQL Editor do Supabase)
================================================================
Cole e rode:

  alter table pedidos add column if not exists codigo text;
  alter table pedidos add column if not exists pago boolean default false;
  alter table pedidos add column if not exists pago_em timestamptz;

================================================================
PASSO 2 — (não precisa fazer nada!)
================================================================
Antes este passo pedia pra pegar a Service Role Key. NÃO é mais
necessário: o Supabase injeta SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
automaticamente em toda Edge Function. O código já usa elas.
Pode pular direto para o Passo 3.

================================================================
PASSO 3 — Criar a função "pagamento-webhook"
================================================================
1. Supabase → Edge Functions → Create a new function
2. Nome EXATO: pagamento-webhook
3. Apague o conteúdo de exemplo e cole TODO o arquivo:
     supabase/functions/pagamento-webhook/index.ts
4. Clique em Deploy.
5. Vá em Settings → Edge Functions → Manage secrets e adicione:
     INFINITEPAY_HANDLE      = evmoreirar
     EMAILJS_PUBLIC_KEY      = MBlDI-XmPPtEa4aCj
     EMAILJS_PRIVATE_KEY     = (sua private key do EmailJS)
     EMAILJS_SERVICE_ID      = service_ts487i9
     EMAILJS_TEMPLATE_ID     = template_wrnfbj8
     SITE_URL                = (o endereço do seu site publicado)

   ⚠️ NÃO crie SUPABASE_URL nem SUPABASE_SERVICE_ROLE_KEY!
   O Supabase NÃO deixa criar variáveis começando com SUPABASE_
   (dá erro "Name must not start with the SUPABASE_ prefix").
   Essas duas JÁ EXISTEM automaticamente dentro de toda Edge Function.
   O código já usa elas direto — você não precisa configurar.
6. Anote a URL da função (aparece no topo):
     https://keduxajzwhazaessbgxk.supabase.co/functions/v1/pagamento-webhook

================================================================
PASSO 4 — Criar a função "criar-pagamento"
================================================================
1. Edge Functions → Create a new function
2. Nome EXATO: criar-pagamento
3. Cole TODO o arquivo:
     supabase/functions/criar-pagamento/index.ts
4. Deploy.
5. Settings → Edge Functions → secrets, adicione:
     INFINITEPAY_HANDLE      = evmoreirar
     SITE_URL                = (endereço do site publicado)
     WEBHOOK_URL             = (a URL do passo 3)

   ⚠️ NÃO crie SUPABASE_URL nem SUPABASE_SERVICE_ROLE_KEY (vêm automáticas).

================================================================
PASSO 5 — Ativar o EmailJS no servidor
================================================================
No painel do EmailJS → Account → Security:
  - Ative "Allow EmailJS API for non-browser applications"
  (sem isso, o e-mail automático do servidor é recusado)

================================================================
PASSO 6 — Testar
================================================================
1. Publique o site (GitHub Pages) — as Edge Functions precisam do SITE_URL real.
2. Faça um pedido pelo site, escolhendo fotos.
3. O site deve redirecionar para o InfinitePay.
4. Pague (use valor real baixo para teste, ou Pix).
5. Em segundos, o pedido deve virar "liberado" sozinho e o
   e-mail com o código deve chegar.

IMPORTANTE: enquanto as Edge Functions NÃO estiverem publicadas, o site
funciona no modo manual (registra o pedido e mostra link/WhatsApp). Assim
nada quebra durante a configuração.

================================================================
SEGURANÇA
================================================================
- A Service Role Key e a Private Key do EmailJS são SECRETAS:
  ficam só nas Edge Functions (nunca no config.js do site).
- O webhook confere o pagamento de forma independente (payment_check),
  então ninguém consegue forjar uma liberação.
- Troque as chaves expostas no chat antes de divulgar (você já planejou isso).
