# PARALLEL VISION

Site portfólio de **fotografia urbana e de rua** da dupla **Japa & Gelado**, de Belo Horizonte — MG.
Estética cinematográfica, paleta quente analógica, ensaios dedicados com música e galeria.

---

## 🎬 Sobre o projeto

Single-page imersiva (HTML/CSS/JS puro, sem build) com páginas de ensaio dedicadas.
Foco em impacto visual, experiência mobile e captação de clientes via WhatsApp.

**Seções da home:** Hero · Trabalhos · Ensaios · Sobre · Contato
**Páginas de ensaio:** Olhar Âmbar · Quadra (basquete) · Midnight 2.0

---

## 🚀 Como rodar

Não precisa instalar nada. Duas formas:

**A) Simples:** dê duplo-clique em `index.html` — abre no navegador.

**B) Recomendada (evita bloqueios do navegador):** rode um servidor local.
Com Python instalado, dentro da pasta do projeto:

```bash
python -m http.server 5500
```

Depois abra `http://localhost:5500`.
(Ou use a extensão **Live Server** do VS Code.)

> A opção B é melhor porque alguns recursos (áudio, fontes) podem ser bloqueados
> quando o arquivo é aberto direto do disco (`file://`).

---

## 📁 Estrutura dos arquivos

```
parallel-vision-html/
├── index.html          Página principal (home)
├── ensaio.html         Página de ensaio (carrega o conteúdo por ?id=)
├── style.css           Estilos da home + tokens visuais (cores, fontes)
├── ensaio.css          Estilos das páginas de ensaio
├── script.js           Lógica da home (hero, galeria, menu, contato)
├── ensaio.js           Lógica do ensaio (galeria, player, autoplay)
├── ensaios-data.js     ⭐ CONTEÚDO DOS ENSAIOS (edite aqui)
├── robots.txt          SEO — orientação para buscadores
├── sitemap.xml         SEO — mapa do site
├── TROCAR-IMAGENS.txt  Guia rápido de como trocar fotos/áudio
├── img/                Todas as fotos (otimizadas)
└── audio/              Faixas dos ensaios
```

---

## 🛠️ Tecnologias

- **HTML / CSS / JavaScript** puro (sem framework, sem build)
- **GSAP + ScrollTrigger** — animações e parallax (via CDN)
- **Lenis** — rolagem suave (via CDN)
- **Google Fonts** — Anton, Bebas Neue, Space Grotesk

> As bibliotecas vêm por CDN, então é preciso internet na primeira visita.
> O site foi feito para continuar funcionando mesmo se o CDN falhar (sem as animações extras).

---

## ✏️ Como editar o conteúdo

### Trocar fotos
As fotos ficam em `img/`. Para trocar, substitua o arquivo mantendo o nome,
ou edite os caminhos em `script.js` (home) e `ensaios-data.js` (ensaios).
Detalhes no `TROCAR-IMAGENS.txt`.

> **Dica:** otimize fotos grandes (de celular têm 5–40 MB) para ~1600px antes de subir.
> As atuais já foram reduzidas (de ~295 MB para ~6 MB) sem perda visível.

### Editar um ensaio
Tudo fica em **`ensaios-data.js`**. Cada ensaio tem:

```js
ambar: {
  num: "01",
  title: "OLHAR ÂMBAR",
  subtitle: "Retrato · hora dourada",
  cover: "img/ambar_10.jpeg",         // capa (desktop)
  coverMobile: "img/ambar_6.jpeg",    // capa diferente no mobile (opcional)
  track: { title: "...", file: "audio/see-you-again.mp3" },  // música
  intro: "...",                       // frase grande de abertura
  body: ["parágrafo 1", "parágrafo 2"],
  specs: { camera: "...", lens: "...", iso: "...", ... },  // ficha técnica
  gallery: ["img/foto1.jpeg", "img/foto2.jpeg", ...],
  layout: "amber",   // amber | sport | night (muda molduras/enfeites)
}
```

### Música nos ensaios
1. Coloque o arquivo em `audio/` (ex: `audio/basquete.mp3`)
2. Em `ensaios-data.js`, preencha o campo `file`:
   ```js
   track: { title: "Nome da faixa", file: "audio/basquete.mp3" }
   ```
3. O **autoplay** já está ativo: a música tenta tocar ao abrir o ensaio.
   Se o navegador bloquear (iPhone/Safari/Chrome), ela começa no primeiro
   toque/clique/scroll do visitante. (Os navegadores proíbem som 100% automático.)

### Contato (WhatsApp)
O número está em **`31 98344-0061`**. O botão e o formulário abrem o WhatsApp
com a mensagem montada. Para mudar o número, procure `5531983440061`
em `index.html` e `script.js`.

---

## 🔍 SEO

Já incluído:
- Meta tags (título, descrição, keywords focadas em "fotógrafo BH / fotografia de rua")
- Open Graph + Twitter Card (preview ao compartilhar)
- Dados estruturados JSON-LD (Google reconhece como negócio de fotografia em BH)
- Tags geográficas de Belo Horizonte
- `robots.txt` e `sitemap.xml`

> **Antes de publicar:** troque `parallelvision.com.br` pelo domínio real em
> `index.html`, `sitemap.xml` e `robots.txt`.

---

## 🌐 Publicar online (grátis)

A forma mais simples:

1. Acesse **app.netlify.com/drop**
2. Arraste a pasta `parallel-vision-html` inteira
3. Pronto — o site fica no ar com um link

Alternativas: **GitHub Pages**, **Vercel**, **Cloudflare Pages**.

---

## ⚠️ Avisos importantes

- **Direitos autorais de música:** usar faixas de artistas conhecidos
  (ex: Tyler, the Creator) com autoplay num site público aumenta o risco de
  notificação de copyright ou remoção pela hospedagem. Para publicar com
  segurança, prefira música própria, de produtor parceiro, ou royalty-free.
- **Nomes de arquivo:** em servidores (Netlify, GitHub Pages) maiúsculas e
  minúsculas importam. `Foto.JPG` ≠ `foto.jpg`. Mantenha os nomes exatos.

---

## 📇 Contato

- **Instagram:** [@parallel_visionfts](https://www.instagram.com/parallel_visionfts)
- **WhatsApp:** +55 31 98344-0061
- **Belo Horizonte — MG**

---

*Parallel Vision — fotografia de rua, cultura e movimento.*
