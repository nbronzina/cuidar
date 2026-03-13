---
name: accessibility-audit
description: >
  Auditoría de accesibilidad WCAG 2.2 AAA para Cuidados en Red.
  ACTIVAR cuando se necesite verificar accesibilidad de cualquier página HTML,
  cuando se agreguen elementos interactivos, formularios, imágenes, o cuando
  se modifique estructura de navegación, colores o tipografía.
  Basado en charlesjones-dev/claude-code-plugins-dev (accessibility-audit skill).
---

# Auditoría de Accesibilidad — Cuidados en Red

## Contexto del proyecto

- **Sitio:** HTML/CSS/JS vanilla estático, 11 páginas
- **Audiencia principal:** personas mayores de 70 años y sus familiares
- **Estándar objetivo:** WCAG 2.2 Nivel AAA
- **Contraste mínimo:** 7:1 para texto normal, 4.5:1 para texto grande (18pt+ o 14pt+ bold)
- **Touch targets:** mínimo 44x44 CSS pixels
- **Tipografía base:** Roboto 19px (nunca menor a 16px)

## 8 áreas de auditoría

### 1. HTML semántico y estructura del documento
- Jerarquía de encabezados h1-h6 sin saltar niveles
- Exactamente un h1 por página
- Elementos semánticos (nav, main, footer, article, section) en vez de divs genéricos
- Regiones landmark únicas y correctamente etiquetadas
- Orden del DOM = orden visual/lógico de lectura

### 2. Implementación ARIA
- Roles válidos que coincidan con el propósito del elemento
- Estados y propiedades apropiados (aria-expanded, aria-checked, aria-selected)
- Roles de landmark (banner, navigation, main, complementary, contentinfo)
- Regiones live para contenido dinámico (aria-live, aria-atomic)
- Labels y descripciones (aria-label, aria-labelledby, aria-describedby)
- **Regla #1 de ARIA:** No usar ARIA si existe un elemento HTML semántico nativo

### 3. Navegación por teclado y gestión de foco
- Todos los elementos interactivos alcanzables vía teclado (tab, enter, space, flechas)
- Orden de tabulación lógico; sin trampas de teclado
- Indicadores de foco visibles con contraste suficiente (3:1 mínimo)
- Skip navigation links para saltar contenido repetitivo
- Gestión de foco en modales (atrapar foco, devolver al cerrar)
- ESC cierra modales y cancela operaciones
- **WCAG 2.2:** SC 2.4.11 Foco no oscurecido (AA), SC 2.4.13 Apariencia de foco (AAA)

### 4. Contraste de color y accesibilidad visual
- Texto normal: mínimo 7:1 (AAA) — el proyecto ya apunta a esto
- Texto grande: mínimo 4.5:1 (AAA)
- Componentes UI y objetos gráficos: mínimo 3:1
- Información NO transmitida solo por color (SC 1.4.1)
- Diferenciación suficiente para daltonismo (rojo-verde especialmente)
- **Paleta del proyecto:** teal #1A5276, verde #2E7D32, naranja #E65100, fondo #F5F5F0

### 5. Formularios y accesibilidad de inputs
- Cada input tiene nombre accesible (label explícito, aria-label, o aria-labelledby)
- Fieldset/legend para controles agrupados
- Campos requeridos indicados de múltiples formas (no solo asterisco o color)
- Identificación y sugerencia de errores (SC 3.3.1, 3.3.3)
- Mensajes de error accesibles (aria-describedby, aria-invalid, role="alert")
- Atributos autocomplete para datos del usuario (SC 1.3.5)
- **WCAG 2.2:** SC 3.3.7 Entrada redundante (A), SC 3.3.8 Autenticación accesible (AA)

### 6. Texto alternativo
- Imágenes informativas: alt descriptivo del contenido/función
- Imágenes decorativas: alt="" (NO atributo alt ausente)
- Imágenes complejas: descripción extendida (aria-describedby)
- Botones con iconos: nombre accesible (aria-label o texto oculto visualmente)
- SVG: title element, role="img", aria-label
- Iconos Font Awesome: aria-hidden="true" (ya es práctica del proyecto)

### 7. Componentes interactivos
- Nombres accesibles para todos los elementos interactivos
- Roles semánticos correctos (button para acciones, a para navegación)
- Modales: focus trap, ESC cierra, aria-modal="true", foco retorna al cerrar
- Tooltips: descartables, hovereables, persistentes
- **WCAG 2.2:** SC 3.2.6 Ayuda consistente (A) — mecanismos de ayuda en mismo orden relativo

### 8. Accesibilidad responsiva y móvil
- Touch targets: mínimo 44x44 CSS pixels (SC 2.5.5 AAA)
- Sin scroll horizontal a 320px de ancho (SC 1.4.10)
- Texto ampliable a 200% sin pérdida de funcionalidad (SC 1.4.4)
- Reflow a 400% sin scroll horizontal (SC 1.4.10)
- Orientación no bloqueada (SC 1.3.4)
- Gestos táctiles con alternativas de teclado (SC 2.5.1)
- **WCAG 2.2:** SC 2.5.7 Movimientos de arrastre (AA), SC 2.5.8 Tamaño de target mínimo (AA)

## Checklist específico del proyecto

Además de WCAG, verificar estos requisitos propios de Cuidados en Red:

- [ ] ¿Barra de accesibilidad presente en todas las páginas?
- [ ] ¿Controles de tamaño de texto funcionan correctamente?
- [ ] ¿Alto contraste funciona sin romper la identidad visual?
- [ ] ¿Skip link "Ir al contenido principal" presente y funcional?
- [ ] ¿lang="es-AR" en el elemento html?
- [ ] ¿Escudo de la Ciudad tiene alt text apropiado?
- [ ] ¿Línea 147 tiene link tel: accesible?
- [ ] ¿Formularios usan labels visibles (no solo placeholders)?
- [ ] ¿Tablas de datos tienen caption y scope en th?
- [ ] ¿Navegación principal tiene aria-label descriptivo?

## Severidad de hallazgos

- **CRÍTICO:** Impide el acceso. Imágenes sin alt en contenido, inputs sin label, elementos no alcanzables por teclado.
- **ALTO:** Perjudica significativamente. Contraste insuficiente, sin indicadores de foco, jerarquía de encabezados rota, ARIA incorrecto, sin skip navigation.
- **MEDIO:** Reduce efectividad. Indicadores de foco subóptimos, texto de enlace no descriptivo, errores semánticos menores.
- **BAJO:** Oportunidades de mejora. Atributos lang faltantes, mejoras AAA, buenas prácticas.

## Formato del reporte

Guardar en: `docs/accessibility/YYYY-MM-DD-accessibility-audit.md`

Incluir:
1. Resumen ejecutivo con score y % de cumplimiento
2. Hallazgos por severidad con rutas exactas de archivo y número de línea
3. Código actual vs. código corregido para cada hallazgo
4. Matriz de cumplimiento WCAG 2.2 AAA
5. Roadmap de remediación priorizado

## Origen

Adaptado de: `charlesjones-dev/claude-code-plugins-dev` → plugin `ai-accessibility` → skill `accessibility-audit`
Licencia del original: verificar en el repositorio fuente.
