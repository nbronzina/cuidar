---
name: gcba-2032-identity
description: >
  Identidad visual institucional de Cuidados en Red (GCBA 2032).
  ACTIVAR en cualquier cambio CSS, HTML, SVG, header, footer, navbar,
  creación de página nueva, o modificación de estilos, colores, tipografía,
  iconos, logos o componentes visuales. También activar cuando se discuta
  paleta de colores, accesibilidad visual o contraste.
---

# Identidad Visual — Cuidados en Red (GCBA 2032)

## Paleta de colores

| Color | Hex | Contraste | Uso |
|---|---|---|---|
| **Teal institucional** | `#1A5276` | 8,5:1 AAA | Heroes informativos, headings, header, enlaces |
| **Verde acción** | `#2E7D32` | 7,1:1 AAA | Heroes de acción, CTAs, botones primarios, stats positivos |
| **Naranja** | `#E65100` | 5,3:1 AA | Solo texto de advertencia/fricción, nunca como fondo |
| **Rojo alerta** | `#B71C1C` | 9,8:1 AAA | Alertas, emergencias, estados negativos |
| **Gris body** | `#444444` | 9,7:1 AAA | Texto de cuerpo principal |
| **Gris secundario** | `#767676` | — | Texto secundario (autores, sublabels) |
| **Fondo claro** | `#F5F5F5` | — | Secciones alternadas, fondos de tarjetas |

### Colores auxiliares (ya en styles.css como variables)
- `--color-primary`: `#1A5276`
- `--color-secondary`: `#2E7D32`
- `--color-accent`: `#E65100`
- `--color-warm`: fondo cálido para alertas

## Tipografía

- **Familia:** Roboto (Google Fonts), weights: 300, 400, 500, 700
- **Body:** 19px, `line-height: 1.6`, color `#444444`
- **Headings:** `line-height: 1.3+`, weight 700
- **Mínimo absoluto:** 14px (para notas al pie)
- **Textos para usuarios 70+:** oraciones máximo 25 palabras

## Header (todas las páginas)

```
[Escudo de la Ciudad per Ley 4.408/2012]
Ciudad Autónoma de Buenos Aires (span.institutional)
Cuidados en Red (span.program-name)
```

- Escudo: `img/escudo-caba.svg`, 40x48px
- Clase: `.header-gcba`
- Enlace a `index.html`

## Footer (todas las páginas)

1. **Grid 4 columnas:** Inscribirse | Información | Contacto | Gobierno Abierto
2. **Footer legal:** escudo (20x24px) + "Ciudad Autónoma de Buenos Aires | Diseñado siguiendo las pautas WCAG 2.1"
3. **Disclaimer de autoría:** "Proyecto de diseño especulativo · Cuidados en Red es una obra de ficción..."

## Barra de accesibilidad (todas las páginas)

```
[Accesibilidad:] [A] [A+] [A++] [Alto contraste] [147]
```

- Clase: `.accessibility-bar`
- Botones de tamaño de texto: `adjustTextSize('normal'|'large'|'xlarge')`
- Botón de alto contraste: `toggleHighContrast()`
- Enlace 147: `<a href="tel:147">`

## Navegación principal

- Máximo **6 ítems**: Inicio, Para Personas Mayores, Para Personas Cuidadoras, El Sistema, Transparencia, Contacto
- Clase: `.main-nav`
- Toggle mobile: `.nav-toggle`
- Página activa: `class="active" aria-current="page"`

## WCAG AAA

- Contraste mínimo texto/fondo: **7:1**
- Skip to main content en todas las páginas
- `aria-label` en todos los landmarks
- `aria-hidden="true"` en iconos decorativos
- `role="banner"`, `role="navigation"`, `role="contentinfo"` en header/nav/footer

## Elementos permanentes (NUNCA eliminar)

Ver detalle en `references/permanent-elements.md`:

1. **Escudo de la Ciudad** (Ley 4.408/2012) — en header y footer
2. **Nombre constitucional** "Ciudad Autónoma de Buenos Aires" (Constitución 1996)
3. **Dominio .gob.ar** en cualquier URL ficticia
4. **Línea 147** — en barra de accesibilidad, contacto, CTAs
5. **Disclaimer de autoría** — en footer
6. **Barra de accesibilidad** — en todas las páginas

## Elementos prohibidos (NUNCA agregar)

Ver detalle en `references/prohibited-elements.md`:

1. **Isologo "BA"** (partidario)
2. **Amarillo #FFD500** (asociado al PRO)
3. **Arial** (usar solo Roboto)
4. **Eslóganes de gestión** ("Ciudad Verde", "Buenos Aires Ciudad", etc.)
5. **Logos partidarios** de cualquier tipo
6. **Emojis** en contenido institucional (salvo que el usuario lo pida explícitamente)
