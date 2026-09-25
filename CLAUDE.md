# Cuidados en Red — Prototipo Diegético de Diseño de Ficción

## Qué es este proyecto

Esto es un **prototipo diegético de diseño de ficción**, NO un sitio real del gobierno. Simula una plataforma del Gobierno de la Ciudad de Buenos Aires en 2032 para cuidado domiciliario de personas mayores. Todo el contenido, datos, instituciones y personajes forman un mundo ficticio que debe ser internamente coherente.

Autor: **Nicolás Bronzina**. Todo el contenido, concepto, diseño y código es de su autoría.

## Stack técnico

- HTML/CSS/JS vanilla, sin frameworks
- GitHub Pages, rama `main` (https://nbronzina.github.io/cuidar/); `_config.yml` excluye documentos y herramientas de la publicación
- Tipografía: Roboto via Google Fonts
- Iconos: Font Awesome 4.7
- Mapa: Leaflet (solo en nodos.html)

### Cómo se trabaja
- **Cabecera y pie**: se editan solo en `partials/cabecera.html` y `partials/pie.html`, y se copian a las 11 páginas con `node tools/sincronizar.js`. Nunca editar a mano lo que está entre los marcadores `<!-- inicio:cabecera -->` / `<!-- inicio:pie -->`.
- **JavaScript**: todo en `js/` (compartidos: `accessibility.js`, `forms.js`, `mundo.js`; uno por página cuando hace falta). Sin `<script>` en línea ni atributos `on*=`: la CSP es `script-src 'self'`. Para mostrar u ocultar, usar el atributo `hidden` o clases, no estilos que pisen utilidades.
- **Fecha del mundo**: `js/mundo.js` traslada la fecha del visitante a 2032. Para fechas relativas usar `data-mundo-fecha="-3"`, `data-mundo-dia`, `data-mundo-mes`, `data-mundo-trimestre`, `data-mundo-hora`.
- **CSS**: `styles.css` (componentes compartidos) → `css/<página>.css` (estilos propios de cada página) → `css/utilidades.css` (clases `u-*` generadas al migrar los antiguos `style=""`, con `!important`). Prohibido `style=""` y `<style>` en el HTML: la CSP es `style-src 'self'` y el lint (`no-inline-style`) lo controla. Para estilos nuevos, usar los componentes de `styles.css` (`.lista-icono`, `.marca--*`, `.texto-cuerpo`, `.lista-advertencia-*`, `.faq-*`, `.seccion-gris`, `.lista-simple`, `.documento-*`) antes que sumar utilidades.
- **Regresión visual (local)**: `node tools/regresion-visual.js <url-antes> <url-después>` compara las páginas en 3 viewports píxel por píxel (levantar la versión anterior con `git worktree` y `node tools/servidor.js <puerto>`).
- **Tamaños**: `font-size` siempre en `rem` (la barra A/A+/A++ escala `<html>`).
- **Colores de texto**: usar los tokens (`--color-accent-text`, `--color-secondary-text`, grises `#444`/`#505050`); todo texto debe pasar 7:1.
- **Pruebas**: `npm test` (sincronización + lint de HTML + Playwright y axe) verifica en escritorio, tableta y móvil, incluido el contraste de texto sobre degradados que axe no mide: WCAG 2.2 AA y contraste 7:1, CSP, scroll horizontal a 320/390 px con A++, barra de accesibilidad y los flujos de elegibilidad, inscripción, estado de trámite, contacto y Nodos. Corre en GitHub Actions en cada push.

## Páginas del sitio

1. `index.html` — Inicio
2. `el-sistema.html` — Cómo funciona el sistema
3. `para-personas-mayores.html` — Para personas mayores
4. `para-cuidadores.html` — Para personas cuidadoras
5. `transparencia.html` — Transparencia y datos abiertos
6. `contacto.html` — Contacto
7. `inscripcion.html` — Inscripción
8. `nodos.html` — Nodos en tu barrio
9. `elegibilidad.html` — Test de elegibilidad
10. `estado-tramite.html` — Estado de trámite
11. `politica-privacidad.html` — Política de privacidad

## Reglas globales

### Idioma y terminología
- Español rioplatense formal-institucional (vos, no tú)
- "Persona mayor" en sitio público; "adulto mayor" solo en docs técnicos; NUNCA "anciano/viejo/abuelo"
- "Persona cuidadora" en sitio público; "cuidadora" en docs técnicos
- Ver skill `rioplatense-voice` para glosario completo

### Coherencia del mundo ficticio
- Ante un dato faltante del mundo ficticio: insertar `<!-- TODO: [descripción] -->`, NO inventar
- Todo número nuevo debe agregarse primero a `.claude/docs/DATA-TRUTH.md`
- Todo personaje nuevo debe agregarse primero a `.claude/docs/PERSONAS.md`
- Todo contenido nuevo debe incluir al menos una limitación, demora o fallo (imperfección deliberada)

### Identidad visual
- NUNCA usar isologo "BA" ni color amarillo #FFD500
- NUNCA eliminar el escudo de la Ciudad (Ley 4.408/2012), la línea 147, ni el nombre constitucional
- Ver skill `gcba-2032-identity` para paleta completa y reglas

### Accesibilidad
- WCAG AAA: contraste mínimo 7:1
- Barra de accesibilidad (A/A+/A++ + 147) en todas las páginas

## Fuentes de verdad del mundo ficticio

- `.claude/docs/DATA-TRUTH.md` — Todos los números (reales y ficticios)
- `.claude/docs/INSTITUTIONS.md` — Instituciones correctas e incorrectas
- `.claude/docs/TIMELINE-2025-2032.md` — Cronología del mundo ficticio
- `.claude/docs/PERSONAS.md` — Personajes ficticios del sitio
- `.claude/docs/WORLD.md` — Marco general del mundo ficticio

## Skills del proyecto

### Skills propios
- `.claude/skills/gcba-2032-identity/` — Identidad visual institucional
- `.claude/skills/rioplatense-voice/` — Voz institucional rioplatense
- `.claude/skills/diegetic-guardian/` — Guardián de coherencia del mundo ficticio
- `.claude/skills/accessibility-audit/` — Auditoría WCAG 2.2 AAA

### Skills comunitarios
- `.claude/skills/web-quality-audit/` — Auditoría integral Lighthouse-style (addyosmani)
- `.claude/skills/performance/` — Optimización de performance y budgets (addyosmani)
- `.claude/skills/core-web-vitals/` — LCP, INP, CLS (addyosmani)
- `.claude/skills/seo/` — SEO técnico y on-page (addyosmani)
- `.claude/skills/best-practices/` — Seguridad, CSP, HTML semántico (addyosmani)
- `.claude/skills/web-design-guidelines/` — 100+ reglas UI compliance (vercel-labs)
- `.claude/skills/nielsen-heuristics-audit/` — 10 heurísticas de usabilidad (mastepanoski)
- `.claude/skills/ui-design-review/` — Evaluación visual integral con scoring (mastepanoski)
