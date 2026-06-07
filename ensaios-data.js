/* ============================================================
   PARALLEL VISION — ensaios-data.js
   Dados de cada ensaio dedicado. Editável livremente.
   layout: "amber" | "sport" | "night"  -> molduras/animações distintas
   ============================================================ */
window.ENSAIOS = {
  /* ---------------- OLHAR ÂMBAR ---------------- */
  ambar: {
    id: "ambar",
    num: "01",
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
      ano: "2025",
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
    num: "02",
    theme: "basquete",
    layout: "sport",
    title: "QUADRA",
    subtitle: "Esporte · movimento · cor",
    cover: "img/basq_3.jpeg",
    track: { title: "Money Trees — vibe", file: "audio/Money Trees.mp3" },
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
      ano: "2025",
    },
    gallery: [
      "img/basq_3.jpeg","img/basq_1.jpeg","img/basq_6.jpeg",
      "img/basq_2.jpeg","img/basq_4.jpeg","img/basq_5.jpeg",
    ],
  },

  /* ---------------- MIDNIGHT 6.0 ----------------*/
  midnight: {
    id: "midnight",
    num: "03",
    theme: "flash",
    layout: "night",
    title: "MIDNIGHT 6.0",
    subtitle: "Noite · flash direto · neon",
    cover: "img/IMG_2773.jpeg",
    track: { title: "OS MELHORES", file: "audio/Matuê - OS MELHORES.mp3" },
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
      ano: "2025",
    },
    gallery: [
      "img/IMG_2773.jpeg","img/IMG_2775.jpeg","img/IMG_2777.jpeg",
      "img/IMG_2886.jpeg","img/IMG_2780.jpeg","img/IMG_2887.jpeg",
    ],
  },
};
