# Reporte Consolidado de Auditoría Multi-Skill — Cuidados en Red

Fecha: 2026-03-13
Skills utilizados: seo, best-practices, performance, core-web-vitals, web-design-guidelines, nielsen-heuristics-audit, ui-design-review

---

## Resumen ejecutivo

| Auditoría | Hallazgos críticos | Hallazgos altos | Hallazgos medios | Score |
|---|---|---|---|---|
| SEO | 6 | 3 | 3 | — |
| Best Practices | 3 | 4 | 5 | — |
| Performance + CWV | 4 | 3 | 5 | — |
| Web Design Guidelines | 6 | 4 | 8 | — |
| Nielsen Heuristics | 1 (sev 4) | 7 (sev 3) | 10 (sev 2) | 7/10 |
| UI Design Review | — | — | — | 76/100 |

**Total hallazgos únicos (deduplicados): ~45**

---

## Hallazgos por prioridad de implementación

### PRIORIDAD 1 — Quick Wins (esfuerzo bajo, impacto alto)

| # | Hallazgo | Skills que lo detectaron | Esfuerzo |
|---|---|---|---|
| 1 | Crear `robots.txt` y `sitemap.xml` | SEO | 15 min |
| 2 | Agregar `<link rel="canonical">` a las 11 páginas | SEO | 30 min |
| 3 | Agregar `<meta name="robots" content="index, follow">` | SEO | 15 min |
| 4 | Agregar `rel="noopener noreferrer"` faltante en 2 links | Best Practices | 5 min |
| 5 | Agregar `<link rel="preconnect">` para `images.unsplash.com` y `unpkg.com` | Performance, Web Design | 15 min |
| 6 | Agregar `&fm=webp&q=30` a URLs Unsplash (imágenes 95% tapadas por gradiente) | Performance | 30 min |
| 7 | Agregar `width` y `height` a imágenes pravatar en para-cuidadores.html | CWV (CLS) | 5 min |
| 8 | Agregar `loading="lazy"` a imágenes pravatar | Performance | 5 min |
| 9 | Agregar `defer` a script de Leaflet en nodos.html | Performance | 5 min |
| 10 | Agregar SRI (integrity) a Font Awesome y Leaflet | Best Practices | 15 min |
| 11 | Agregar `spellcheck="false"` a campos DNI, email, código postal | Web Design | 10 min |
| 12 | Eliminar font-weight 300 de URL Google Fonts (no usado) | Performance | 10 min |
| 13 | Footer links: cambiar `rgba(255,255,255,0.95)` a `#FFFFFF` | UI Design | 5 min |
| 14 | Footer h4: aumentar de 16px a 18px | UI Design, Nielsen | 5 min |
| 15 | Agregar `color-scheme: light` al html | Web Design | 5 min |
| 16 | Agregar `touch-action: manipulation` global | Web Design | 5 min |

### PRIORIDAD 2 — Mejoras SEO/Meta (esfuerzo medio, impacto alto)

| # | Hallazgo | Skills | Esfuerzo |
|---|---|---|---|
| 17 | Agregar Open Graph tags a las 11 páginas | SEO | 1 hora |
| 18 | Expandir title tags a 50-60 caracteres | SEO | 1 hora |
| 19 | Expandir meta descriptions a 150-160 caracteres | SEO | 1 hora |
| 20 | Agregar JSON-LD structured data (Organization, BreadcrumbList) | SEO | 2 horas |
| 21 | Corregir jerarquía de headings (h1→h3 sin h2 en index, h5 en para-cuidadores) | SEO | 1 hora |
| 22 | Agregar `<meta name="theme-color">` | Web Design, SEO | 5 min |

### PRIORIDAD 3 — CSS/JS Patterns (esfuerzo medio-alto, impacto medio)

| # | Hallazgo | Skills | Esfuerzo |
|---|---|---|---|
| 23 | Reemplazar `transition: all 0.3s` por propiedades específicas (~25 instancias) | Web Design | 2 horas |
| 24 | Cambiar `:focus` a `:focus-visible` en styles.css y estilos inline | Web Design, Best Practices, Nielsen | 2 horas |
| 25 | Agregar animaciones inline a `prefers-reduced-motion` (elegibilidad, inscripcion) | Web Design | 30 min |
| 26 | Form labels: aumentar de 16px a 18-19px | UI Design, Nielsen | 15 min |
| 27 | Agregar `font-variant-numeric: tabular-nums` a stat numbers | Web Design | 5 min |
| 28 | Agregar `text-wrap: balance` a headings | Web Design | 5 min |

### PRIORIDAD 4 — UX Improvements (esfuerzo medio, impacto alto para usuarios)

| # | Hallazgo | Skills | Esfuerzo |
|---|---|---|---|
| 29 | Agregar botón "Reiniciar" al quiz de elegibilidad | Nielsen (H3) | 30 min |
| 30 | Agregar estado loading/spinner en formularios al enviar | Nielsen (H1) | 1 hora |
| 31 | Agregar validación inline en formularios con `.form-error` | Nielsen (H5, H9) | 3 horas |
| 32 | Agregar `beforeunload` guard en formularios largos | Web Design | 30 min |
| 33 | Agregar "Enviar otra consulta" post-submit en contacto | Nielsen (H3) | 15 min |
| 34 | Agregar links/teléfonos a alternativas en resultado "no elegible" | Nielsen (H9) | 30 min |

### PRIORIDAD 5 — Refactoring grande (esfuerzo alto)

| # | Hallazgo | Skills | Esfuerzo |
|---|---|---|---|
| 35 | Eliminar inline `onclick` handlers (80+), migrar a addEventListener | Best Practices | 4 horas |
| 36 | Agregar CSP meta tag (requiere #35 primero) | Best Practices | 1 hora |
| 37 | Migrar 715 inline `style=""` a clases CSS | Performance, Best Practices, Nielsen | 12+ horas |
| 38 | Convertir hero background-images a `<img>` con srcset/picture/WebP | Performance, CWV | 4 horas |
| 39 | Reemplazar Font Awesome 4.7 con SVGs inline (~22 iconos) | Performance, Best Practices | 4 horas |
| 40 | Extraer CSS inline de páginas a archivos CSS cacheables | Performance | 4 horas |

---

## Hallazgos positivos (lo que está bien hecho)

- **Accesibilidad**: Skip-to-main, aria labels, roles, screen reader announcements, text resize, high contrast, localStorage, prefers-reduced-motion
- **HTML semántico**: header, nav, main, footer, section, article correctamente usados
- **Seguridad básica**: HTTPS en todos los recursos, target="_blank" con rel (28/30), autocomplete en formularios
- **Tipografía**: 19px base excelente para adultos mayores, line-height 1.6, 3 tamaños de texto
- **Branding**: Identidad institucional convincente, escudo presente, "fricción" deliberada brillante
- **Responsive**: 3 breakpoints, hamburger menu, font sizes adaptativos, sin zoom blocking
- **JS mínimo**: vanilla, sin frameworks, INP < 100ms estimado
- **Presupuesto**: Todas las páginas < 550KB (bajo el budget de 1.5MB)
- **Score UX Nielsen**: 7/10 (bueno)
- **Score UI Design**: 76/100 (profesional)

---

## Métricas estimadas pre/post optimización

| Métrica | Antes (estimado) | Después de P1+P2 | Después de todo |
|---|---|---|---|
| LCP (3G) | 3-5s | 2-3s | < 2.5s |
| CLS | 0.05-0.15 | < 0.1 | < 0.05 |
| INP | < 100ms | < 100ms | < 100ms |
| Peso por página | ~450KB | ~300KB | ~200KB |
| SEO score (Lighthouse) | ~50 | ~85 | ~95 |
| Best Practices score | ~60 | ~75 | ~90 |
