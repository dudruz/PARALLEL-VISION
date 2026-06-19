/* ============================================================
   PARALLEL VISION — ensaios-data.js
   Eventos LOCAIS (fallback). Os eventos "ao vivo" vêm do banco
   (Supabase, tabela eventos). Estes aqui são a reserva de segurança
   e os eventos originais cujas fotos estão no GitHub (pasta img/).
   layout: "amber" | "sport" | "night" | "copa"
   ============================================================ */
window.ENSAIOS_LOCAIS = {
  /* ---------------- BLAYC (Copa / Brasil) ---------------- */
  blayc: {
    id: "blayc",
    num: "01",
    theme: "copa",
    layout: "copa",
    title: "BLAYC",
    subtitle: "Copa · Brasil · festa",
    cover: "img/blayc_9.jpeg",
    coverMobile: "img/blayc_6.jpeg",
    track: { title: "Trilha brasileira", file: "audio/Marcelo%20D2-%20desabafo%20deixa%20eu%20dizer%20o%20que%20penso%20dessa%20vida%20-%20song%20lyrics%20(youtube).mp3" },
    intro:
      "A noite em que o Brasil inteiro coube numa festa. No evento Blayc, sob o tema da Copa, verde e amarelo viraram pele, festa e celebração — um registro da nossa identidade no auge da euforia.",
    body: [
      "Camisas da seleção, bandeiras nas costas, dentes de ouro e a alegria que só o brasileiro tem. A Blayc reuniu uma geração que veste a cultura com orgulho, e a gente capturou cada gesto: o brinde, o grito, o abraço, a pose.",
      "A luz da festa — neon, flash e cor — conversa com o verde-amarelo das camisas e bandeiras. É fotografia de evento com alma de ensaio: documental, vibrante e impossível de repetir. Puro Brasil.",
    ],
    specs: {
      camera: "Canon EOS Rebel T7",
      lens: "EF-S 18-55mm",
      iso: "100–200",
      shutter: "1/320 – 1/500s",
      flash: "Flash direto + luz de festa",
      local: "Evento Blayc · Belo Horizonte — MG",
      ano: "2026",
    },
    gallery: [
      "img/blayc_1.jpeg","img/blayc_9.jpeg","img/blayc_3.jpeg","img/blayc_2.jpeg",
      "img/blayc_5.jpeg","img/blayc_4.jpeg","img/blayc_6.jpeg","img/blayc_11.jpeg",
      "img/blayc_7.jpeg","img/blayc_12.jpeg","img/blayc_14.jpeg","img/blayc_8.jpeg",
      "img/blayc_16.jpeg","img/blayc_17.jpeg","img/blayc_13.jpeg","img/blayc_18.jpeg",
      "img/blayc_10.jpeg","img/blayc_15.jpeg",
    ],
  },

  /* ---------------- OLHAR ÂMBAR ---------------- */
  ambar: {
    id: "ambar",
    num: "02",
    theme: "ambar",
    layout: "amber",
    title: "OLHAR ÂMBAR",
    subtitle: "Retrato · hora dourada",
    cover: "img/ambar_10.jpeg",
    coverMobile: "img/ambar_6.jpeg",
    track: { title: "See You Again — Tyler, the Creator", file: "audio/see-you-again.mp3" },
    intro:
      "Quando o sol baixo incendeia a cidade e tudo vira mel. Um ensaio de retrato na hora dourada — pele, cabelo e olhar banhados pela última luz quente do dia.",
    body: [
      "Tudo aqui foi feito na rua, no finalzinho da tarde, perseguindo a hora dourada: aquela janela curta em que o sol rasante transforma grades de ferro, escadarias e calçadas em estúdio natural. Nenhum refletor — só a luz da cidade fazendo o trabalho de colorista.",
      "A direção foi de proximidade e confiança. Em vez de mostrar o cenário inteiro, a gente chegou perto o suficiente para que o olhar fosse o assunto. O verde da camuflada e da vegetação conversa com o âmbar da pele e do cabelo, fechando uma paleta quente que é a assinatura da série.",
    ],
    specs: {
      camera: "Canon EOS Rebel T7",
      lens: "EF-S 18-55mm",
      iso: "100–200",
      shutter: "1/320 – 1/500s",
      flash: "Luz natural (golden hour)",
      local: "Belo Horizonte — MG",
      ano: "2026",
    },
    gallery: [
      "img/ambar_10.jpeg","img/ambar_6.jpeg","img/ambar_3.jpeg","img/ambar_12.jpeg",
      "img/ambar_5.jpeg","img/ambar_13.jpeg","img/ambar_1.jpeg","img/ambar_8.jpeg",
      "img/ambar_15.jpeg","img/ambar_17.jpeg","img/ambar_19.jpeg","img/ambar_2.jpeg",
      "img/ambar_4.jpeg","img/ambar_7.jpeg","img/ambar_9.jpeg","img/ambar_11.jpeg",
      "img/ambar_14.jpeg","img/ambar_16.jpeg","img/ambar_18.jpeg","img/ambar_20.jpeg",
      "img/ambar_21.jpeg",
    ],
  },

  /* ---------------- QUADRA (basquete) ---------------- */
  basquete: {
    id: "basquete",
    num: "03",
    theme: "basquete",
    layout: "sport",
    title: "QUADRA",
    subtitle: "Esporte · movimento · cor",
    cover: "img/basq_3.jpeg",
    track: { title: "Trap instrumental — vibe", file: "audio/Money%20Trees.mp3" },
    intro:
      "Basquete de rua sob o céu aberto. Salto e estilo na quadra do bairro — um ensaio sobre energia, atitude e a cor viva do esporte que pulsa na cidade.",
    body: [
      "O desafio aqui é técnico: obturador rápido para congelar o drible e o salto, mantendo a saturação e o contraste forte que o céu azul e o concreto da quadra entregam de graça. Movimento puro, sem perder a nitidez.",
      "A estética mistura street e esporte — a regata Brooklyn, os dreads com miçangas coloridas, o tênis, a bola girando no dedo. Cada frame celebra a quadra como palco da cultura urbana, onde jogar é também se expressar.",
    ],
    specs: {
      camera: "Canon EOS Rebel T7",
      lens: "EF-S 18-55mm",
      iso: "100–200",
      shutter: "1/320 – 1/500s",
      flash: "Luz natural",
      local: "Belo Horizonte — MG",
      ano: "2026",
    },
    gallery: [
      "img/basq_3.jpeg","img/basq_1.jpeg","img/basq_6.jpeg",
      "img/basq_2.jpeg","img/basq_4.jpeg","img/basq_5.jpeg",
    ],
  },

  /* ---------------- MIDNIGHT 6.0 ----------------*/
  midnight: {
    id: "midnight",
    num: "04",
    theme: "flash",
    layout: "night",
    title: "MIDNIGHT 6.0",
    subtitle: "Noite · flash direto · neon",
    cover: "img/IMG_2773.jpeg",
    track: { title: "Night vibe", file: "audio/Matuê%20-%20OS%20MELHORES.mp3" },
    intro:
      "A cidade depois que as luzes se acendem. Flash direto, neon e a textura da noite — um ensaio sobre presença e brilho no escuro, onde cada detalhe vira fonte de luz.",
    body: [
      "À noite o flash deixa de ser opção e vira linguagem: ele recorta o sujeito da escuridão, queima o fundo e faz correntes, dentes de ouro e pérolas brilharem como neon. É a estética da câmera descartável levada ao limite do editorial.",
      "Midnight 6.0 é a evolução da primeira série noturna da Parallel Vision — mais contraste, mais cor, mais atitude. A noite urbana como cenário infinito.",
    ],
    specs: {
      camera: "Canon EOS Rebel T7",
      lens: "EF-S 18-55mm",
      iso: "100–200",
      shutter: "1/320 – 1/500s",
      flash: "Speedlite direto",
      local: "Belo Horizonte — MG",
      ano: "2026",
    },
    gallery: [
      "img/IMG_2773.jpeg","img/IMG_2775.jpeg","img/IMG_2777.jpeg",
      "img/IMG_2886.jpeg","img/IMG_2780.jpeg","img/IMG_2887.jpeg",
    ],
  },

  /* ============================================================
     MODELO DE EVENTO PAGO (copie e descomente quando for criar um)
     ------------------------------------------------------------
     Diferença para os ensaios grátis: tem o campo "venda".
     - paid: true            -> ativa o modo venda (preview com marca d'água)
     - precoPack / precoFoto -> valores mostrados
     - linkPagamento         -> seu link do InfinitePay
     - whatsapp              -> fallback de contato/combinação
     As fotos em "gallery" aqui são os PREVIEWS COM MARCA D'ÁGUA.
     As originais limpas ficam no Supabase (ver guia).
     ============================================================ */
  /*
  evento_exemplo: {
    id: "evento_exemplo",
    num: "05",
    theme: "copa",
    layout: "copa",
    title: "EVENTO X",
    subtitle: "Data · local",
    cover: "img/eventox_1.jpeg",
    intro: "Descrição curta do evento.",
    body: ["Parágrafo 1.", "Parágrafo 2."],
    specs: {
      camera: "Canon EOS Rebel T7", lens: "EF-S 18-55mm",
      iso: "100–200", shutter: "1/320 – 1/500s",
      flash: "Flash direto", local: "Local — MG", ano: "2026",
    },
    gallery: ["img/eventox_1.jpeg","img/eventox_2.jpeg"],  // PREVIEWS com marca
    venda: {
      paid: true,
      precoPack: "R$ 30",
      precoFoto: "R$ 15",
      linkPagamento: "https://invoice.infinitepay.io/SEU-LINK",
      whatsapp: "5531983440061",
    },
  },
  */

  /* ============================================================
     MODELO DE EVENTO PRIVADO (só um e-mail pode comprar/acessar)
     ------------------------------------------------------------
     Igual ao evento pago, mas com "emailPermitido" dentro de venda.
     - NÃO aparece na loja nem no dropdown de acesso (é secreto)
     - Só o e-mail autorizado consegue pedir e acessar
     - Você envia o LINK DIRETO para a pessoa:
         ensaio.html?id=fotos_eduardo
     ============================================================ */
  /*
  fotos_eduardo: {
    id: "fotos_eduardo",
    num: "P1",
    theme: "amber",
    layout: "amber",
    title: "FOTOS EDUARDO",
    subtitle: "Ensaio privado",
    cover: "img/eduardo_1.jpeg",
    intro: "Ensaio exclusivo.",
    body: ["Suas fotos."],
    specs: {
      camera: "Canon EOS Rebel T7", lens: "EF-S 18-55mm",
      iso: "100–200", shutter: "1/320 – 1/500s",
      flash: "Natural", local: "BH — MG", ano: "2026",
    },
    gallery: ["img/eduardo_1.jpeg","img/eduardo_2.jpeg"],
    venda: {
      paid: true,
      precoPack: "R$ 50",
      precoFoto: "R$ 8",
      emailPermitido: "evmoreirar@gmail.com",  // SÓ este e-mail acessa
      whatsapp: "5531983440061",
    },
  },
  */
};

