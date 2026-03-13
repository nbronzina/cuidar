# Cuidados en Red — Prototipo Diegético de Diseño de Ficción

## Qué es este proyecto

Esto es un **prototipo diegético de diseño de ficción**, NO un sitio real del gobierno. Simula una plataforma del Gobierno de la Ciudad de Buenos Aires en 2032 para cuidado domiciliario de personas mayores. Todo el contenido, datos, instituciones y personajes forman un mundo ficticio que debe ser internamente coherente.

Autor: **Nicolás Bronzina**. Todo el contenido, concepto, diseño y código es de su autoría.

## Stack técnico

- HTML/CSS/JS vanilla, sin frameworks
- GitHub Pages, rama `main`
- 11 páginas con header/footer compartido — cualquier cambio estructural se replica en todas
- Tipografía: Roboto via Google Fonts
- Iconos: Font Awesome 4.7
- Mapa: Leaflet (solo en nodos.html)

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
