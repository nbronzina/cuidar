# Cuidados en Red

Prototipo diegético de diseño especulativo: simula la plataforma del Gobierno de la Ciudad de Buenos Aires para el cuidado domiciliario de personas mayores en 2032. Es una obra de ficción de Nicolás Bronzina; no es un servicio real.

Sitio publicado: https://nbronzina.github.io/cuidar/

## Estructura

- `*.html` — las páginas del sitio (HTML, CSS y JS sin frameworks ni compilación).
- `partials/` — cabecera y pie compartidos; se copian a las páginas con `node tools/sincronizar.js`.
- `styles.css`, `css/` — estilos compartidos, de cada página y utilidades.
- `js/` — scripts (sin JavaScript en línea: la CSP es estricta).
- `datos/` — archivos descargables de Transparencia (datos ficticios, ver `datos/LEEME.txt`).
- `.claude/docs/` — fuente de verdad del mundo ficticio.
- `docs/historial/` — revisiones anteriores (desactualizadas).

## Desarrollo

```sh
npm ci
npm test            # sincronización + lint de HTML + pruebas de Playwright y axe
npm run sincronizar # después de editar partials/
npm run servidor    # sitio local en http://localhost:8765
```

Las convenciones de trabajo están en `CLAUDE.md`.

## Licencia

Todo el contenido, concepto, diseño y código es de autoría de Nicolás Bronzina.
