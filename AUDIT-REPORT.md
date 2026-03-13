# Reporte de Auditoría — Cuidados en Red

Fecha: 2026-03-13

---

## Auditoría 5: Frontend y coherencia HTML/CSS (frontend-design)

### 5.1 Diferencias en header

| Página | Diferencia encontrada | Severidad |
|---|---|---|
| elegibilidad.html | Skip link dice "Saltar al contenido principal" en vez de "Ir al contenido principal" | IMPORTANTE |
| inscripcion.html | Skip link dice "Saltar al contenido principal" en vez de "Ir al contenido principal" | IMPORTANTE |
| contacto.html | Skip link dice "Saltar al contenido principal" en vez de "Ir al contenido principal" | IMPORTANTE |
| elegibilidad.html | Accessibility bar: `<div class="container">` sin clase `clearfix` (las otras 10 tienen `class="container clearfix"`) | IMPORTANTE |
| elegibilidad.html | Accessibility bar: estructura HTML diferente — el `<i>` del icono está fuera del `<span>` en vez de dentro | IMPORTANTE |
| elegibilidad.html | Accessibility bar: aria-labels diferentes en los 4 botones ("Tamaño de texto normal" / "Aumentar tamaño de texto" / etc. vs "Texto normal" / "Texto grande" / etc.) | IMPORTANTE |
| elegibilidad.html | Logo `<a>` tiene `aria-label="Cuidados en Red - Ir a la página principal"` extra (ninguna otra página lo tiene) | MENOR |
| politica-privacidad.html | Nav toggle tiene `aria-label="Abrir menú de navegación"` adicional | MENOR |
| politica-privacidad.html | Whitespace entre skip link y accessibility bar usa `\n` simple en vez de `\n    \n    ` | MENOR |
| estado-tramite.html | Tiene 3 comentarios HTML en el header (`<!-- Header de accesibilidad -->`, etc.) que ninguna otra página tiene | MENOR |
| el-sistema.html, para-cuidadores.html, para-personas-mayores.html, transparencia.html | Nav links indentados a 12 espacios en vez de 16 | MENOR |
| contacto.html | Orden de atributos en active link: `aria-current="page" class="active"` en vez de `class="active" aria-current="page"` | MENOR |

### 5.2 Diferencias en footer

| Página | Diferencia encontrada | Severidad |
|---|---|---|
| transparencia.html | Link a presupuesto usa `href="#presupuesto"` (relativo) en vez de `href="transparencia.html#presupuesto"` como las otras 10 | MENOR |
| inscripcion.html, nodos.html | Comentario del disclaimer dice `<!-- NUEVO DISCLAIMER DE AUTORÍA -->` en vez de `<!-- DISCLAIMER DE AUTORÍA -->` | MENOR |
| transparencia.html, politica-privacidad.html | Sin comentario HTML antes del disclaimer div | MENOR |
| inscripcion.html, nodos.html | Indentación del disclaimer 4 espacios menos profunda | MENOR |
| politica-privacidad.html | Después del middot `·` no hay espacio trailing (las otras 10 lo tienen) | MENOR |
| Varias páginas | Whitespace inconsistente entre `</div>` del container y el disclaimer (líneas en blanco extra vs sin líneas) | MENOR |

**Verificaciones positivas:**
- Disclaimer de ficción: texto IDÉNTICO en las 11 páginas (normalizado)
- © 2032: NO aparece en ninguna página (fue removido correctamente)
- Footer grid 4 columnas: idéntico en las 11 páginas
- Footer-legal: idéntico en las 11 páginas
- WhatsApp float: presente en las 11 páginas

### 5.3 CSS compartido

#### CSS externo

| Página | CSS files | Orden correcto |
|---|---|---|
| 10 páginas | font-awesome 4.7.0, Google Fonts Roboto, styles.css | SÍ |
| nodos.html | font-awesome 4.7.0, Google Fonts Roboto, styles.css, **leaflet.css** | SÍ (+Leaflet esperado) |

#### Bloques `<style>` inline — Duplicaciones y contradicciones

| Hallazgo | Archivo | Severidad |
|---|---|---|
| `.stat-sublabel` color `#767676` en inline vs `#595959` en styles.css — contradicción | index.html | IMPORTANTE |
| `.breadcrumb` con `background-color: #F5F5F5` y `padding: 16px 0` vs styles.css sin background y `padding: 12px 0` | politica-privacidad.html | IMPORTANTE |
| `.form-group` con `margin-bottom: 0` vs styles.css `margin-bottom: 24px` | estado-tramite.html | IMPORTANTE |
| `.form-group input` con padding/border-radius/font-size diferentes al patrón global `.form-control` | estado-tramite.html | IMPORTANTE |
| `.contact-box` definida con estilos diferentes en dos páginas distintas | estado-tramite.html vs politica-privacidad.html | IMPORTANTE |
| `.testimonial-card.realistic` y `.stat-card.friction .stat-number` duplicadas sin cambios | index.html | MENOR |
| `.form-group` y `.form-group label` duplicadas sin cambios | contacto.html | MENOR |

#### Atributos `style="..."` inline

| Página | Cantidad de `style=""` | Severidad |
|---|---|---|
| el-sistema.html | **254** | CRÍTICO |
| para-cuidadores.html | **138** | CRÍTICO |
| para-personas-mayores.html | **110** | CRÍTICO |
| elegibilidad.html | 43 | IMPORTANTE |
| inscripcion.html | 40 | IMPORTANTE |
| transparencia.html | 39 | IMPORTANTE |
| contacto.html | 35 | IMPORTANTE |
| estado-tramite.html | 34 | IMPORTANTE |
| nodos.html | 17 | MENOR |
| index.html | 3 | MENOR |
| politica-privacidad.html | 2 | MENOR |

Hallazgo principal: el-sistema.html, para-cuidadores.html y para-personas-mayores.html tienen más CSS inline que en styles.css. Un bloque completo en contacto.html (~30 líneas) está construido enteramente con inline styles. Esto impide que el modo alto contraste funcione correctamente.

#### Clases huérfanas (25 en styles.css)

Clases definidas en CSS pero nunca usadas en HTML: `.accessibility-controls`, `.alert-success`, `.badge-primary`, `.badge-success`, `.badge-warning`, `.card-body`, `.card-header`, `.card-title`, `.fade-in`, **`.form-control`**, **`.form-error`**, `.mb-0` a `.mb-4`, `.mt-0` a `.mt-3`, `.pull-left`, `.pull-right`, `.sr-only`, `.step-time`, `.wait-time`.

Nota: `.form-control` y `.form-error` son especialmente relevantes — los formularios definen sus propios estilos inline en vez de usar estas clases existentes. **IMPORTANTE**

#### `!important`

Solo 2 declaraciones en `@media (prefers-reduced-motion: reduce)`. Ambas son necesarias y correctas.

#### Media queries — Breakpoint inconsistente

| Hallazgo | Severidad |
|---|---|
| **estado-tramite.html usa `max-width: 768px`** mientras todas las demás páginas y styles.css usan `max-width: 767px`. Diferencia de 1px.** | CRÍTICO |
| transparencia.html no tiene ningún media query inline pese a tener componentes complejos | IMPORTANTE |

### 5.4 HTML semántico

#### `<main>` — 6 páginas sin cierre `</main>`

| Hallazgo | Páginas | Severidad |
|---|---|---|
| `<main>` abierto pero nunca cerrado — footer, WhatsApp float y disclaimer quedan semánticamente dentro de `<main>` | el-sistema, estado-tramite, inscripcion, nodos, para-cuidadores, para-personas-mayores | CRÍTICO |
| Las 5 restantes cierran `</main>` correctamente | index, contacto, elegibilidad, politica-privacidad, transparencia | OK |

#### Breadcrumb inconsistente

| Hallazgo | Severidad |
|---|---|
| En 9 páginas el breadcrumb está ANTES de `<main>`; en politica-privacidad.html está DENTRO de `<main>` | IMPORTANTE |
| politica-privacidad.html usa `aria-label="Migas de pan"` mientras las otras 9 usan `aria-label="Ubicación"` | MENOR |
| politica-privacidad.html tiene breadcrumb `Inicio > Inscripción > Política de Privacidad` — ruta de navegación cuestionable (privacidad no es subpágina de inscripción) | IMPORTANTE |

#### Secciones sin heading directo

7 instancias menores de `<section>` sin `<h2>` como hijo directo (headings están en divs internos). — MENOR

#### IDs duplicados

Ninguna página tiene IDs duplicados. — OK

#### ARIA landmarks

Consistentes en las 11 páginas (role=complementary, banner, navigation, contentinfo, 4 nav con aria-label en footer). — OK

### 5.5 Links internos

| Tipo | Página | Hallazgo | Severidad |
|---|---|---|---|
| Ancla cross-page | index.html | `href="el-sistema.html#costos"` — el ID destino es `costos-titulo`, no `costos` | CRÍTICO |
| Ancla cross-page | inscripcion.html | `href="contacto.html#nodos-titulo"` — no existe `id="nodos-titulo"` en contacto.html | CRÍTICO |
| Placeholder | contacto.html | 3 enlaces de redes sociales usan `href="#"` | MENOR |
| Placeholder | transparencia.html | 4 botones de descarga usan `href="#"` | MENOR |
| Nav links | Todas (11) | Los 6 items del menú son idénticos en texto y destinos | OK |
| Tel links | Todas | `href="tel:147"` consistente en todas | OK |
| WhatsApp | Todas (11) | `href="https://wa.me/5491112345678"` consistente, con `target="_blank"` y `rel="noopener noreferrer"` | OK |
| Cross-page | Todas | Todos los archivos .html referenciados existen | OK |

### 5.6 Meta tags

| Página | Title | Description | Viewport | OG | Favicon |
|---|---|---|---|---|---|
| index.html | Cuidados en Red \| Sistema de Cuidados... - GCBA | ✓ Única | ✓ Correcto | NO | NO |
| el-sistema.html | Cómo Funciona el Sistema \| Cuidados en Red | ✓ Única | ✓ | NO | NO |
| elegibilidad.html | ¿Es para mí? - Test de Elegibilidad \| Cuidados en Red | ✓ Única | ✓ | NO | NO |
| inscripcion.html | Inscripción \| Cuidados en Red | ✓ Única | ✓ | NO | NO |
| estado-tramite.html | Estado de mi Solicitud \| Cuidados en Red | ✓ Única | ✓ | NO | NO |
| nodos.html | Nodos en tu Barrio \| Cuidados en Red | ✓ Única | ✓ | NO | NO |
| para-cuidadores.html | Para Personas Cuidadoras \| Cuidados en Red | ✓ Única | ✓ | NO | NO |
| para-personas-mayores.html | Para Personas Mayores \| Cuidados en Red | ✓ Única | ✓ | NO | NO |
| contacto.html | Contacto \| Cuidados en Red | ✓ Única | ✓ | NO | NO |
| transparencia.html | Transparencia y Datos Abiertos \| Cuidados en Red | ✓ Única | ✓ | NO | NO |
| politica-privacidad.html | Política de Privacidad \| Cuidados en Red | ✓ Única | ✓ | NO | NO |

| Hallazgo | Severidad |
|---|---|
| **Open Graph tags ausentes en las 11 páginas** — previews de WhatsApp/redes sociales serán genéricas | IMPORTANTE |
| **Favicon ausente en las 11 páginas** — navegadores generan 404 al buscar /favicon.ico | IMPORTANTE |
| Ausencia de `<meta name="theme-color">` | MENOR |
| Ausencia de `<meta name="robots">` | MENOR |

### 5.7 JavaScript

#### Scripts por página

| Página | Scripts externos | JS inline (líneas) | Leaflet | console.log |
|---|---|---|---|---|
| index.html | 0 | 41 | NO | NO |
| el-sistema.html | 0 | 41 | NO | NO |
| elegibilidad.html | 0 | 217 | NO | NO |
| inscripcion.html | 0 | 116 | NO | NO |
| estado-tramite.html | 0 | 64 | NO | NO |
| nodos.html | 1 (Leaflet) | 122 | SÍ | console.error (defensivo) |
| para-cuidadores.html | 0 | 41 | NO | NO |
| para-personas-mayores.html | 0 | 41 | NO | NO |
| contacto.html | 0 | 47 | NO | NO |
| transparencia.html | 0 | 53 | NO | NO |
| politica-privacidad.html | 0 | 41 | NO | NO |

#### Hallazgos

| Hallazgo | Severidad |
|---|---|
| **JS de accesibilidad duplicado en las 11 páginas** (~34 líneas idénticas: `adjustTextSize()`, `toggleHighContrast()`, `announceToScreenReader()`, listener de `load`). Cualquier corrección requiere editar 11 archivos. Debería estar en un archivo externo compartido. | CRÍTICO |
| Uso de `window.addEventListener('load')` en vez de `DOMContentLoaded` — la restauración de preferencias de accesibilidad espera a que carguen todas las imágenes Unsplash. Flash visible sin preferencias del usuario en conexiones lentas. | IMPORTANTE |
| Script de Leaflet en nodos.html sin `defer` ni `async` | IMPORTANTE |
| Inline event handlers (`onclick`) en las 11 páginas — incompatible con CSP estrictas | IMPORTANTE |
| Formularios simulan envío client-side con `setTimeout` — coherente con prototipo especulativo | MENOR |

### 5.8 Performance

#### Imágenes

| Página | Imagen | width/height | alt | loading | Formato |
|---|---|---|---|---|---|
| Todas (x11) | escudo-caba.svg (header) | 40x48 | ✓ | — | SVG |
| Todas (x11) | escudo-caba.svg (footer) | 20x24 | ✓ | — | SVG |
| para-cuidadores.html | pravatar.cc/80?img=44 | **NO** | ✓ | **NO** | JPG |
| para-cuidadores.html | pravatar.cc/80?img=47 | **NO** | ✓ | **NO** | JPG |
| para-cuidadores.html | pravatar.cc/80?img=12 | **NO** | ✓ | **NO** | JPG |

| Hallazgo | Severidad |
|---|---|
| 10 de 11 páginas cargan imágenes Unsplash de 1600px como CSS background sin responsive ni fallback local | CRÍTICO |
| No hay `<link rel="preconnect">` para ninguno de los 4+ orígenes CDN (fonts.googleapis.com, fonts.gstatic.com, cdnjs.cloudflare.com, images.unsplash.com) | CRÍTICO |
| 3 imágenes en para-cuidadores.html sin width/height — causan layout shift (CLS) | IMPORTANTE |
| Ninguna imagen usa `loading="lazy"` | IMPORTANTE |
| CSS de Font Awesome y Google Fonts es render-blocking sin carga diferida | IMPORTANTE |

### 5.9 Responsive

#### Viewport

Las 11 páginas tienen `width=device-width, initial-scale=1.0` correcto. Ninguna bloquea el zoom (`user-scalable=no` ausente). — OK

#### Menú hamburguesa

Las 11 páginas tienen nav-toggle correcto con onclick, aria-expanded y nav-links id. — OK

#### Formularios móvil

| Hallazgo | Páginas | Severidad |
|---|---|---|
| Campo DNI usa `type="text"` sin `inputmode="numeric"` — no muestra teclado numérico en móvil para personas mayores | inscripcion.html, estado-tramite.html | IMPORTANTE |
| Campo número de domicilio usa `type="text"` sin `inputmode="numeric"` | inscripcion.html | MENOR |

#### Heroes sin responsive

| Hallazgo | Severidad |
|---|---|
| **transparencia.html hero no tiene media queries inline** — título de 48px y lead de 24px no se reducen en mobile. Los estilos inline tienen mayor especificidad que las reglas globales de styles.css. | CRÍTICO |

#### Media queries

Breakpoints globales en styles.css: 991px, 767px, 576px + print + prefers-reduced-motion. Consistentes en 10 de 11 páginas. estado-tramite.html usa 768px en vez de 767px (diferencia de 1px) — reportado en 5.3.

---

## Resumen consolidado

### Hallazgos CRÍTICOS (9)

1. **6 páginas sin cierre `</main>`** — footer queda dentro de main semánticamente
2. **Ancla rota `el-sistema.html#costos`** — el ID es `costos-titulo`
3. **Ancla rota `contacto.html#nodos-titulo`** — no existe
4. **Breakpoint inconsistente** — estado-tramite.html usa 768px vs 767px
5. **254 inline style attrs en el-sistema.html** (138 en para-cuidadores, 110 en para-personas-mayores)
6. **JS de accesibilidad duplicado en 11 páginas** — sin archivo compartido
7. **Hero de transparencia.html sin media queries** — 48px en mobile
8. **Sin preconnect** para 4+ CDN origins
9. **10 páginas cargan imágenes Unsplash 1600px** sin responsive ni fallback

### Hallazgos IMPORTANTES (18)

1. Skip link inconsistente (3 páginas dicen "Saltar" vs "Ir")
2. elegibilidad.html tiene accessibility bar con estructura HTML diferente y aria-labels distintos
3. `.stat-sublabel` color contradictorio entre inline y styles.css
4. `.breadcrumb` contradictoria en politica-privacidad.html
5. `.form-group` contradictoria en estado-tramite.html
6. `.contact-box` con 2 definiciones diferentes
7. `.form-control` y `.form-error` definidas pero nunca usadas
8. transparencia.html sin media queries para sus componentes
9. Breadcrumb de politica-privacidad con ruta incorrecta (Inscripción > Privacidad)
10. Open Graph tags ausentes en las 11 páginas
11. Favicon ausente en las 11 páginas
12. `window.addEventListener('load')` en vez de `DOMContentLoaded`
13. Leaflet sin `defer`
14. Inline `onclick` handlers en 11 páginas (incompatible con CSP)
15. 3 imágenes sin width/height (layout shift)
16. Sin `loading="lazy"` en ninguna imagen
17. CSS render-blocking (Font Awesome, Google Fonts)
18. Campo DNI sin `inputmode="numeric"` en 2 formularios

### Hallazgos MENORES (21)

1-8. Whitespace/indentación/comentarios inconsistentes en header (8 instancias)
9-15. Whitespace/indentación/comentarios inconsistentes en footer (7 instancias)
16. Breadcrumb aria-label inconsistente ("Ubicación" vs "Migas de pan")
17. 25 clases CSS huérfanas en styles.css
18. 7 enlaces `href="#"` placeholder (redes sociales, descargas)
19. `<meta name="theme-color">` ausente
20. Heroes con padding en px fijos
21. Secciones sin heading directo (7 instancias menores)
