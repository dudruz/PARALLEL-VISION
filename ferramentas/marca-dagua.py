#!/usr/bin/env python3
# ============================================================
# PARALLEL VISION — Gerador de marca d'água para EVENTOS PAGOS
# ============================================================
# O que faz: pega as fotos ORIGINAIS de um evento pago e cria
# versões com marca d'água discreta (os "previews" que vão pro site).
# As originais limpas você guarda no Supabase (nunca no GitHub).
#
# COMO USAR:
#   1. Coloque as fotos originais numa pasta, ex: ./originais-evento-x/
#   2. Rode:  python ferramentas/marca-dagua.py originais-evento-x  previews-evento-x
#   3. As fotos com marca saem em ./previews-evento-x/
#   4. Suba SÓ as previews para img/ do site. As originais vão pro Supabase.
#
# Requisito:  pip install Pillow
# ============================================================

import sys, os, glob
from PIL import Image, ImageDraw, ImageFont, ImageOps

TEXTO = "PARALLEL VISION"   # texto da marca d'água
OPACIDADE = 28              # 0-255 (quanto maior, mais visível). 28 = discreto
ANGULO = 30                 # inclinação do texto
MAX_PX = 1600               # redimensiona o lado maior para isso (otimização)

def marca_dagua(src, dst):
    base = ImageOps.exif_transpose(Image.open(src)).convert("RGBA")
    # otimiza tamanho
    w, h = base.size
    m = max(w, h)
    if m > MAX_PX:
        s = MAX_PX / m
        base = base.resize((round(w*s), round(h*s)), Image.LANCZOS)
    W, H = base.size

    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    try:
        fsize = max(int(W*0.028), 18)
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", fsize)
    except Exception:
        font = ImageFont.load_default()

    step_x = int(W*0.42)
    step_y = int(H*0.30)
    for y in range(-H, H*2, step_y):
        for x in range(-W, W*2, step_x):
            draw.text((x, y), TEXTO, font=font, fill=(255, 255, 255, OPACIDADE))

    layer = layer.rotate(ANGULO, expand=False)
    out = Image.alpha_composite(base, layer).convert("RGB")
    out.save(dst, "JPEG", quality=85, optimize=True, progressive=True)

def main():
    if len(sys.argv) < 3:
        print("Uso: python marca-dagua.py <pasta_originais> <pasta_saida>")
        print("Ex:  python marca-dagua.py originais-blayc previews-blayc")
        sys.exit(1)
    src_dir, dst_dir = sys.argv[1], sys.argv[2]
    os.makedirs(dst_dir, exist_ok=True)
    fotos = []
    for ext in ("*.jpg", "*.jpeg", "*.JPG", "*.JPEG", "*.png", "*.PNG"):
        fotos += glob.glob(os.path.join(src_dir, ext))
    if not fotos:
        print(f"Nenhuma foto encontrada em {src_dir}")
        sys.exit(1)
    print(f"Processando {len(fotos)} fotos...")
    for i, f in enumerate(sorted(fotos), 1):
        nome = f"foto_{i}.jpeg"
        marca_dagua(f, os.path.join(dst_dir, nome))
        print(f"  {nome}")
    print(f"\nPronto! Previews com marca d'água em: {dst_dir}/")
    print("Lembre: suba SÓ esses previews pro site. As originais vão pro Supabase.")

if __name__ == "__main__":
    main()
