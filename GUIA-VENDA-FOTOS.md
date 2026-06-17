# SISTEMA DE VENDA DE FOTOS — Guia Passo a Passo

Este guia explica como funciona o sistema de venda e o que você precisa fazer,
**na ordem**, quando decidir ativá-lo. Leia tudo uma vez antes de começar.

---

## A ideia em uma frase

O site (no GitHub Pages) mostra **previews com marca d'água** das fotos pagas.
As **fotos originais limpas** ficam guardadas no **Supabase**, e só são liberadas
para quem tem um **código de acesso** (que você dá após o pagamento).
Eventos grátis (seu portfólio) continuam normais, sem marca e sem trava.

```
Cliente → Site (GitHub, previews) → "Já comprei? Digite o código"
                                          ↓
                                  Supabase verifica o código
                                          ↓
                              Libera link temporário do pack/foto
```

---

## Por que GitHub Pages NÃO protege as fotos sozinho

GitHub Pages é hospedagem **estática**: tudo que está lá é público.
Se a foto original estiver no GitHub, qualquer um com o link baixa.
Por isso as originais **nunca** vão pro GitHub — vão pro Supabase, que sabe
quem pode baixar. O GitHub só guarda os previews (já com marca d'água).

---

## PASSO 1 — Preparar as fotos do evento pago

1. Separe as fotos originais do evento numa pasta no seu PC.
2. Gere os previews com marca d'água rodando:
   ```
   python ferramentas/marca-dagua.py  <pasta_originais>  <pasta_previews>
   ```
   Ex: `python ferramentas/marca-dagua.py originais-festa previews-festa`
3. Isso cria a pasta `previews-festa/` com as fotos marcadas e otimizadas.

Resultado: você tem **dois conjuntos** — originais limpas e previews marcados.

---

## PASSO 2 — Criar a conta no Supabase (grátis)

1. Acesse **supabase.com** e crie uma conta (pode usar Google/GitHub).
2. Clique em **New Project**. Dê um nome (ex: "parallel-vision") e uma senha forte.
3. Espere ~2 min o projeto subir.
4. Vá em **Project Settings → API** e copie dois valores:
   - **Project URL** (ex: `https://xxxx.supabase.co`)
   - **anon public key** (uma chave longa)
   > Esses dois são públicos e seguros de usar no site. NÃO use a "service_role".

Guarde esses dois valores — você vai me mandar (ou colar no site) depois.

---

## PASSO 3 — Subir as fotos originais (protegidas) no Supabase

1. No Supabase, menu lateral → **Storage** → **New bucket**.
2. Crie um bucket chamado `fotos-pagas` e deixe **Public = OFF** (privado!).
3. Entre no bucket e suba as **fotos originais limpas** do evento
   (organize em pastas por evento, ex: `festa/foto_1.jpeg`).
4. Para o pack completo, suba também um `.zip` com todas (ex: `festa/pack.zip`).

> Como é privado, ninguém acessa sem o link temporário que o sistema gera.

---

## PASSO 4 — Criar a lista de "códigos que liberam"

1. No Supabase, menu lateral → **Table Editor** → **New table**.
2. Crie uma tabela `acessos` com as colunas:
   - `codigo` (text) — o código que o cliente digita (ex: "FESTA-A1B2")
   - `evento` (text) — qual evento ele libera (ex: "festa")
   - `tipo` (text) — "pack" ou "foto"
   - `usado` (bool, default false) — opcional, pra controle
3. Ative o **RLS** (Row Level Security) — o sistema te guia nisso quando plugarmos.

Quando alguém paga, você adiciona uma linha aqui com um código novo.
Esse código é o que você manda pro cliente.

---

## PASSO 5 — Configurar o pagamento (InfinitePay)

1. No app/site do **InfinitePay**, crie um **link de pagamento** (ou cobrança Pix)
   com o valor do pack/foto.
2. Copie o link.
3. Esse link vai no campo `linkPagamento` do evento (no `ensaios-data.js`).

Fluxo do pagamento (semi-automático, simples e seguro):
- Cliente clica em "Comprar", paga pelo link do InfinitePay.
- Você recebe a confirmação do pagamento (notificação do InfinitePay).
- Você gera um código novo na tabela `acessos` e manda pro cliente (WhatsApp).
- Cliente digita o código no site e baixa.

> Mais pra frente dá pra automatizar 100% (o pagamento gera o código sozinho)
> usando uma "Edge Function" do Supabase — mas isso é um upgrade futuro,
> não precisa agora.

---

## PASSO 6 — Ativar o evento pago no site

1. Abra `ensaios-data.js`.
2. Copie o "MODELO DE EVENTO PAGO" (está comentado no fim do arquivo).
3. Preencha: título, fotos (os PREVIEWS com marca), preço e o `linkPagamento`.
4. Coloque os previews em `img/` e suba pro GitHub normalmente.

Pronto: o evento aparece no site como pago (preview com marca + botão comprar).
Os grátis continuam intactos.

---

## Resumo de onde cada coisa mora

| Coisa | Onde fica | Público? |
|-------|-----------|----------|
| Site (HTML/CSS/JS) | GitHub Pages | Sim |
| Previews com marca d'água | GitHub (img/) | Sim |
| Fotos originais limpas | Supabase Storage | Não (privado) |
| Lista de códigos | Supabase (tabela) | Não |
| Link de pagamento | InfinitePay | — |

---

## O que EU (desenvolvedor) faço quando você estiver pronto

Quando você tiver feito os Passos 2 a 5 e me passar a **URL** e a **anon key**
do Supabase, eu construo no site:
- A interface de compra (botão, preços, campo "digite seu código")
- A conexão com o Supabase (verifica o código, gera o link temporário)
- O download do pack/foto liberado
- A marca d'água já entra automática via o script do Passo 1

Você não precisa programar nada — só seguir os passos de configuração acima.

---

## Dúvidas comuns

**"Preciso pagar o Supabase?"**
Não pra começar. O plano grátis cobre bastante (1 GB de fotos, tráfego suficiente
pra começar). Se crescer muito, tem planos pagos baratos.

**"E se alguém compartilhar o código?"**
O código pode ser de uso único (campo `usado`) ou expirar. Pra clientes de
boa-fé funciona bem. Segurança total mesmo só com login por cliente (upgrade futuro).

**"Some o link temporário depois?"**
Sim. O Supabase gera links que expiram (ex: 5 min). Depois disso, não funcionam
mais — a foto volta a ficar protegida.

**"Posso usar o Google Drive em vez do Supabase?"**
Dá pra um esquema bem manual (você manda o link do Drive após o pagamento),
mas o Drive não controla "quem pode" de forma automática nem põe a foto no site.
O Supabase é o caminho profissional. O Drive serve como plano B manual.

---

# PARTE 2 — Sistema automático (já construído no site)

O site agora tem: barra de venda nos eventos pagos, painel admin (`admin.html`),
página de acesso do cliente (`acesso.html`) e e-mail automático.
Você só precisa **colar suas chaves** no arquivo `config.js`.

## A) Supabase — tabela de pedidos

Além do bucket `fotos-pagas` (Parte 1), crie a tabela **pedidos**:
Table Editor → New table → nome `pedidos`, com colunas:
- `id` (int8, identity, primary key) — já vem
- `email` (text)
- `nome` (text)
- `evento` (text)
- `tipo` (text)            // "pack" ou "fotos"
- `fotos` (jsonb)          // lista de nomes
- `status` (text)          // "pendente" / "liberado" / "negado"
- `criado_em` (timestamptz)
- `liberado_em` (timestamptz, pode ser nulo)

### RLS (segurança) da tabela pedidos
Ative o RLS e crie estas políticas (Authentication → Policies):
1. **Inserir pedido (qualquer um pode pedir):**
   - Operação: INSERT · Target roles: anon, authenticated
   - WITH CHECK: `true`
2. **Ler/atualizar (só você logado):**
   - Operação: SELECT e UPDATE · Target roles: authenticated
   - USING: `true`
> Assim o cliente só consegue CRIAR pedido; ver e liberar é só você (logado).

## B) Criar seu login de admin
Authentication → Users → Add user → crie com seu e-mail e senha.
Esse é o login que você usa no `admin.html`.

## C) EmailJS (e-mail automático grátis)
1. Crie conta em **emailjs.com** (grátis, 200 e-mails/mês).
2. **Email Services** → conecte seu Gmail (ou outro) → copie o **Service ID**.
3. **Email Templates** → New template. No corpo, use estas variáveis:
   - Para: `{{to_email}}`
   - Assunto: `Suas fotos da Parallel Vision estão liberadas!`
   - Corpo (exemplo):
     ```
     Oi {{to_name}}!
     Seu acesso às fotos do evento {{evento}} foi liberado.
     Você tem {{dias}} dias para baixar. É só acessar:
     {{link_acesso}}
     ```
   - Salve e copie o **Template ID**.
4. **Account → API Keys** → copie a **Public Key**.

## D) Colar tudo no config.js
Abra `config.js` e preencha:
```js
SUPABASE_URL: "https://xxxx.supabase.co",
SUPABASE_ANON_KEY: "sua-anon-key",
EMAILJS_PUBLIC_KEY: "sua-public-key",
EMAILJS_SERVICE_ID: "service_xxx",
EMAILJS_TEMPLATE_ID: "template_xxx",
```
Suba pro GitHub. Pronto — o sistema está no ar.

## Como usar no dia a dia
1. Cliente vê o evento pago → paga no seu link → clica "Já paguei — pedir fotos"
   → digita e-mail, escolhe pack ou avulsas.
2. Você abre `seusite.com/admin.html`, faz login, vê o pedido.
3. Confere o pagamento (InfinitePay) → clica **Liberar** (ou Negar).
4. Liberou: o cliente recebe o e-mail com o link e baixa por 5 dias.

## Importante sobre as fotos
- No `img/` do site vão os PREVIEWS com marca d'água (gerados pela ferramenta).
- No bucket `fotos-pagas` do Supabase vão as ORIGINAIS limpas, organizadas por
  evento: `blayc/foto_1.jpeg`, `blayc/pack.zip`, etc.
- O nome das fotos no pedido deve bater com o caminho no bucket.

## WhatsApp
Não há envio automático grátis de WhatsApp. Se o EmailJS não estiver configurado,
o sistema mostra seu número para o cliente te chamar, e você manda o link manual.

---

# IMPORTANTE — Como nomear as fotos no Supabase

O sistema procura as fotos originais no bucket com nomes PADRONIZADOS,
seguindo a ORDEM da galeria do evento. Para o evento `baile_verao`:

```
fotos-pagas/
  baile_verao/
    foto_1.jpeg   ← 1ª foto da galeria
    foto_2.jpeg   ← 2ª foto da galeria
    foto_3.jpeg   ← 3ª foto da galeria
    ...
    pack.zip      ← o pack completo (todas as fotos juntas)
```

REGRAS:
- A foto #N na galeria do site = `foto_N.jpeg` no bucket.
- Os números (#1, #2, ...) aparecem nas fotos do evento pago, então o
  cliente pede pelo número certo e o sistema acha a foto certa.
- Sempre use a extensão `.jpeg` (minúsculo).
- O pack completo deve se chamar exatamente `pack.zip`.
- Suba as ORIGINAIS LIMPAS aqui (sem marca d'água). Os previews COM marca
  ficam no site (pasta img/).

Se aparecer "Object not found" ao baixar: o nome do arquivo no bucket não
bate com `foto_N.jpeg`, ou está na pasta errada. Renomeie no Supabase.
