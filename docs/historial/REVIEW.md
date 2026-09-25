# Analisis Completo del Proyecto CUIDAR

**Fecha:** 2026-02-17
**Proyecto:** Cuidar (Cuidados en Red) - Sistema de Ecosistemas de Cuidado CABA
**Tipo:** Prototipo diegetico - Diseno especulativo
**Autor del proyecto:** Nicolas Bronzina

---

## Resumen Ejecutivo

CUIDAR es un prototipo diegetico que simula una plataforma gubernamental de coordinacion de cuidados para personas mayores en Buenos Aires. Como artefacto de diseno especulativo, su objetivo es **aparentar ser un sitio real y funcional** para provocar reflexion y discusion.

El proyecto consta de **11 archivos HTML** y **1 archivo CSS** (911 lineas), construido con HTML/CSS/JS vanilla sin frameworks. El analisis se enfoca en tres ejes: **verosimilitud** (¿es convincente como sitio real?), **calidad de codigo** (¿es mantenible?) y **accesibilidad** (¿cumple con lo que predica?).

**Veredicto general:** El prototipo es visualmente convincente y tiene una base de accesibilidad solida. Las principales oportunidades de mejora estan en la verosimilitud de las interacciones, la mantenibilidad del codigo (duplicacion masiva de CSS), y cerrar las brechas entre la accesibilidad declarada (WCAG 2.1 AA) y la implementada.

---

## 1. ARQUITECTURA Y ESTRUCTURA

### Archivos del proyecto

| Archivo | Tamano | Lineas | Proposito |
|---------|--------|--------|-----------|
| `styles.css` | 17 KB | 911 | Hoja de estilos global |
| `index.html` | 31 KB | 805 | Pagina principal |
| `para-personas-mayores.html` | 43 KB | 896 | Informacion para personas mayores |
| `para-cuidadores.html` | 52 KB | 994 | Informacion para cuidadores |
| `el-sistema.html` | 65 KB | 1152 | Explicacion del sistema |
| `transparencia.html` | 42 KB | 977 | Datos abiertos y transparencia |
| `nodos.html` | 83 KB | 1753 | Mapa de nodos de cuidado |
| `contacto.html` | 27 KB | 642 | Informacion de contacto |
| `inscripcion.html` | 44 KB | 957 | Formulario de inscripcion |
| `elegibilidad.html` | 43 KB | 948 | Cuestionario de elegibilidad |
| `estado-tramite.html` | 36 KB | 862 | Seguimiento de tramite |

**Total:** ~520 KB, ~10,900 lineas de codigo

### Stack tecnologico

- HTML5 semantico
- CSS3 con variables CSS
- JavaScript vanilla (sin frameworks)
- Dependencias externas: Font Awesome 4.7.0, Google Fonts (Roboto), Leaflet (mapa)

---

## 2. VEROSIMILITUD - ¿ES CONVINCENTE?

Como prototipo diegetico, la pregunta central es: ¿un usuario creeria que esta interactuando con un sitio gubernamental real? En general, la respuesta es **si, con algunas grietas**.

### Lo que funciona muy bien

**VER-OK-01: Tono institucional autentico.**
El lenguaje, la estructura de la informacion y la diagramacion son consistentes con sitios de gobierno argentino. El uso de "CABA", "Gobierno de la Ciudad", la linea 147, y la terminologia de tramites es correcta.

**VER-OK-02: Friccion realista.**
Este es el mayor acierto del prototipo. Incluir listas de espera (847 personas), tiempos de espera (21 dias), testimonios mixtos y disclaimers de capacidad lo hace mucho mas creible que un sitio gubernamental idealizado. Los componentes `.friction-badge`, `.reality-check` y `.system-status` son excelentes.

**VER-OK-03: Profundidad de contenido.**
11 paginas con contenido sustancial. Cada seccion tiene informacion detallada, FAQs, datos de transparencia, presupuesto. Esto da sensacion de sitio real, no de mockup superficial.

**VER-OK-04: Interacciones funcionales client-side.**
Los formularios validan campos, el quiz de elegibilidad responde, el buscador de estado muestra resultados. Para una demostracion o presentacion, las interacciones son convincentes.

### Oportunidades para mayor verosimilitud

**VER-01: Transicion instantanea al "enviar" formularios**
**Severidad:** MEDIA

Cuando el usuario envia el formulario de inscripcion, la transicion entre formulario y confirmacion es instantanea. Un sitio real tendria un breve delay de carga. Simular un loading de 1-2 segundos con un spinner haria la experiencia mas creible.

```javascript
// Actual: transicion instantanea
document.getElementById('inscriptionForm').style.display = 'none';
document.getElementById('confirmationMessage').style.display = 'block';

// Mas convincente: simular procesamiento
submitBtn.disabled = true;
submitBtn.textContent = 'Procesando...';
setTimeout(() => {
    document.getElementById('inscriptionForm').style.display = 'none';
    document.getElementById('confirmationMessage').style.display = 'block';
}, 1500);
```

**VER-02: `alert()` nativo en contacto.html**
**Severidad:** MEDIA

El formulario de contacto usa `alert()` del navegador, que rompe la ilusion de sitio profesional. Deberia mostrar un mensaje inline como hace inscripcion.html.

**VER-03: Link de Politica de Privacidad apunta a `#`**
**Severidad:** BAJA

El link de Politica de Privacidad en inscripcion.html lleva a `href="#"`, lo cual hace scroll al top de la pagina. Un usuario atento notaria esto. Opciones:
- Crear una pagina simple de politica de privacidad (aumenta la verosimilitud)
- Usar `href="javascript:void(0)"` con un `onclick` que muestre un modal

**VER-04: Avatares de i.pravatar.cc**
**Severidad:** BAJA

Los avatares de testimonios vienen de `i.pravatar.cc`, un servicio de placeholder. Si el servicio cambia las imagenes o cae, los testimonios pierden coherencia. Considerar usar imagenes locales o de Unsplash con URLs fijas.

**VER-05: Anno 2032 en el footer**
**Severidad:** INFO

El footer dice "2032", consistente con el marco temporal especulativo. Esto es intencional y correcto para el worldbuilding del prototipo.

---

## 3. CALIDAD DE CODIGO

### COD-01: Duplicacion masiva de estilos inline

**Severidad:** ALTA
**Impacto:** Mantenibilidad

Este es el problema tecnico mas importante del proyecto. Cada pagina HTML contiene bloques `<style>` extensos que duplican y sobreescriben el CSS global:

| Pagina | Lineas de CSS inline estimadas |
|--------|-------------------------------|
| `inscripcion.html` | ~367 |
| `nodos.html` | ~300+ |
| `para-personas-mayores.html` | ~253 |
| `para-cuidadores.html` | ~231 |
| `el-sistema.html` | ~200+ |
| `transparencia.html` | ~200+ |
| Otros | ~250+ |

**Duplicacion total estimada: ~1,800 lineas de CSS repetido.**

**Problema concreto:** Si queres cambiar el gradiente del hero, el estilo de las cards, o el hover de los botones, tenes que tocar 11 archivos. Esto tambien hace que sea facil que se generen inconsistencias visuales entre paginas.

**Recomendacion:** Mover los estilos compartidos a `styles.css` (hero, cards, FAQ, timeline, etc.) y crear archivos CSS especificos por pagina solo para lo que sea unico (`nodos.css` para el mapa, `inscripcion.css` para el form multi-paso).

### COD-02: Estilos inline en atributos `style`

**Severidad:** MEDIA

Ademas de los bloques `<style>`, hay abundante uso de `style=""` directamente en elementos:

```html
<button type="submit" class="btn btn-lg"
    style="background: linear-gradient(135deg, var(--color-secondary), #43A047);
           color: white; padding: 18px 48px; font-size: 20px;
           box-shadow: 0 4px 16px rgba(102,187,106,0.3);">
```

Esto anula el proposito de las clases CSS definidas en `styles.css`. El boton ya tiene `.btn` y `.btn-lg` pero el inline style los sobreescribe completamente.

**Recomendacion:** Crear variantes de clase (`.btn-gradient-green`, `.hero-warm`, etc.) en vez de inline styles.

### COD-03: Numeros magicos y colores hardcodeados

**Severidad:** MEDIA

El proyecto define variables CSS en `:root` pero muchos estilos inline las ignoran:

- **Colores inline:** `#666`, `#333`, `#999`, `#43A047`, `#005A92`, `#5D4037` aparecen directamente en vez de usar `var(--color-gray)`, etc.
- **Font sizes arbitrarios:** 13px, 14px, 18px, 20px, 24px, 28px, 36px, 42px, 48px, 56px sin una escala tipografica definida.
- **Spacing sin sistema:** 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 60px, 80px.

**Recomendacion:** Ampliar las variables CSS con una escala de spacing y tipografia:

```css
:root {
    /* Escala tipografica */
    --text-sm: 0.875rem;   /* 14px */
    --text-base: 1rem;     /* 16px */
    --text-lg: 1.125rem;   /* 18px */
    --text-xl: 1.25rem;    /* 20px */
    --text-2xl: 1.5rem;    /* 24px */

    /* Escala de spacing */
    --space-1: 0.25rem;    /* 4px */
    --space-2: 0.5rem;     /* 8px */
    --space-3: 0.75rem;    /* 12px */
    --space-4: 1rem;       /* 16px */
    --space-6: 1.5rem;     /* 24px */
    --space-8: 2rem;       /* 32px */
}
```

### COD-04: Sin sistema de templates

**Severidad:** MEDIA

Header, footer, barra de accesibilidad, navegacion y scripts de accesibilidad se repiten manualmente en 11 archivos. Cambiar un link de navegacion requiere editar los 11.

**Recomendacion:** Para un proyecto estatico sin build tools, opciones simples:
- **11ty (Eleventy):** Generador de sitios estaticos con templates Nunjucks. Minima complejidad.
- **Includes con PHP:** Si se sirve en un server con PHP, un simple `<?php include 'header.php'; ?>`.
- **Script de build basico:** Un script que concatene partials de HTML.

### COD-05: Font Awesome 4.7.0 desactualizado

**Severidad:** BAJA

Se usa Font Awesome v4.7.0 (2017). La version actual es v6.x. No es critico para el prototipo, pero v6 tiene mejor accesibilidad y mas iconos.

### COD-06: Sin `.gitignore`

**Severidad:** BAJA

No hay `.gitignore`. Para un proyecto de HTML/CSS puro es menor, pero conviene tener uno basico para evitar commits accidentales de archivos de editor (.vscode, .DS_Store, etc.).

---

## 4. UI/UX - EXPERIENCIA DE USUARIO

### Lo que funciona bien

- **Diseno visual coherente:** Paleta de colores consistente, tipografia clara, jerarquia visual logica.
- **Barra de accesibilidad:** Funcional y visible. Skip link, ajuste de texto y alto contraste.
- **FAQs con `<details>/<summary>`:** Patron nativo, semantico, sin JavaScript.
- **Navegacion sticky:** La nav principal permanece visible al scrollear.
- **WhatsApp flotante:** Patron comun en sitios argentinos, refuerza la verosimilitud.
- **Responsive base:** Media queries para 991px, 767px y 576px.

### UX-01: Sin menu hamburguesa en mobile

**Severidad:** ALTA

La navegacion en mobile simplemente apila los 8+ links de navegacion verticalmente, ocupando gran parte de la pantalla visible. En un sitio gubernamental real, esto seria un problema serio de usabilidad mobile.

```css
/* Actual en styles.css:623-631 */
@media (max-width: 767px) {
    .main-nav .container {
        flex-direction: column;
        gap: 0;
    }
    .main-nav a {
        padding: 12px 16px;
        border-bottom: 1px solid #E0E0E0;
    }
}
```

**Recomendacion:** Implementar un toggle hamburguesa con CSS puro o JS minimo. Es un patron esperado en cualquier sitio moderno y su ausencia es notable.

### UX-02: Inconsistencia en componentes de boton

**Severidad:** MEDIA

`styles.css` define un sistema de botones coherente (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-warning`, `.btn-lg`). Sin embargo, muchos botones en las paginas usan inline styles que sobreescriben estas clases, resultando en gradientes, shadows y paddings diferentes entre paginas.

### UX-03: Formularios sin feedback de errores inline

**Severidad:** MEDIA

Los formularios dependen de la validacion nativa del navegador (tooltips de `required` y `pattern`). Esto funciona, pero un sitio gubernamental moderno mostraria mensajes de error inline debajo de cada campo, con texto en espanol y guia clara.

**Ejemplo actual:** El campo DNI con `pattern="[0-9]{7,8}"` muestra un mensaje generico del navegador cuando falla la validacion, probablemente en el idioma del SO del usuario.

### UX-04: Sin persistencia de progreso en formularios

**Severidad:** BAJA

Si el usuario navega fuera del formulario de inscripcion y vuelve, pierde todo el progreso. Dado que ya se usa `localStorage` para preferencias de accesibilidad, seria facil implementar persistencia del form. Esto tambien mejoraria la verosimilitud (los sitios gubernamentales suelen guardar borradores).

### UX-05: Sin breadcrumbs

**Severidad:** BAJA

Con 11 paginas, breadcrumbs ayudarian a orientar al usuario. Es un patron comun en sitios de gobierno.

---

## 5. ACCESIBILIDAD (A11Y)

Siendo un proyecto que se presenta como accesible y que simula un servicio para personas mayores, la accesibilidad es especialmente importante. Las bases son buenas, pero hay brechas entre lo declarado y lo implementado.

### Lo que esta bien hecho

- **Skip-to-main link** en todas las paginas (`styles.css:76-89`)
- **`<html lang="es">`** correcto en todas las paginas
- **Botones de ajuste de texto** con persistencia en `localStorage`
- **Toggle de alto contraste** funcional
- **`aria-label`** en elementos interactivos
- **`aria-current="page"`** en navegacion activa
- **HTML semantico:** `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`
- **`aria-hidden="true"`** en iconos decorativos de Font Awesome
- **Focus visible global** con outline en `styles.css:717-729`
- **Print styles** que ocultan elementos innecesarios (`styles.css:735-753`)

### A11Y-01: Declaracion de WCAG 2.1 AA sin cumplimiento total

**Severidad:** ALTA

El footer de todas las paginas declara cumplimiento "WCAG 2.1 AA". Los issues que siguen muestran que esto no se cumple completamente. Si se mantiene la declaracion, deberia resolverse cada issue listado abajo. Si no, se podria cambiar el texto a algo como "Disenado siguiendo las pautas WCAG 2.1".

### A11Y-02: Contraste insuficiente en `.stat-sublabel`

**Severidad:** ALTA
**WCAG:** 1.4.3 Contrast Minimum (Level AA) - 4.5:1 requerido para texto normal

| Elemento | Color texto | Color fondo | Ratio | Cumple AA? |
|----------|-------------|-------------|-------|------------|
| `.stat-sublabel` | `#999` | `#FFFFFF` | ~2.8:1 | **NO** |
| Footer legal text | `rgba(255,255,255,0.6)` | `#2C3E50` | ~4:1 | **LIMITE** |
| Card body text | `#666` | `#FFFFFF` | ~5.7:1 | SI |
| Footer links | `rgba(255,255,255,0.8)` | `#2C3E50` | ~6:1 | SI |
| Friction badge | `#856404` | `#FFF3CD` | ~5.5:1 | SI |

**Fix para `.stat-sublabel`:** Cambiar `color: #999` a `color: #767676` (ratio 4.5:1 exacto) o `color: #666` (ratio 5.7:1, mas holgado).

**Fix para footer legal:** Cambiar `rgba(255,255,255,0.6)` a `rgba(255,255,255,0.7)` o superior.

### A11Y-03: Radio buttons sin `<fieldset>` y `<legend>`

**Severidad:** ALTA
**WCAG:** 1.3.1 Info and Relationships (Level A)

Los grupos de radio buttons en `inscripcion.html` usan `<div role="radiogroup">` en vez de los elementos nativos:

```html
<!-- Actual -->
<div class="radio-group" role="radiogroup" aria-label="Seleccionar genero">
    <label class="radio-option">
        <input type="radio" name="genero" value="femenino" required>
        <span>Femenino</span>
    </label>

<!-- Preferido para mejor soporte de screen readers -->
<fieldset>
    <legend>Genero</legend>
    <label>
        <input type="radio" name="genero" value="femenino" required>
        Femenino
    </label>
</fieldset>
```

Nota: el `role="radiogroup"` con `aria-label` es tecnicamente valido y funciona en screen readers modernos. Pero `<fieldset>/<legend>` es el patron mas robusto y tiene mejor soporte historico.

### A11Y-04: Sin `aria-invalid` ni mensajes de error accesibles en formularios

**Severidad:** MEDIA
**WCAG:** 3.3.1 Error Identification (Level A)

Los campos de formulario no implementan feedback de errores accesible. Cuando un campo falla la validacion, los screen readers dependen del tooltip nativo del navegador, que puede ser insuficiente.

```html
<!-- Agregar a campos con validacion -->
<input type="tel" id="telefono" required aria-required="true"
       aria-invalid="false" aria-describedby="telefono-error">
<span id="telefono-error" role="alert" class="sr-only"></span>
```

### A11Y-05: Alto contraste con `filter: contrast()`

**Severidad:** MEDIA

El toggle de alto contraste usa `filter: contrast(1.5)` que aplica un filtro a toda la pagina. Esto puede:
- Distorsionar imagenes
- Crear combinaciones de color no testeadas
- Reducir legibilidad en algunos casos

**Recomendacion:** Implementar una paleta de alto contraste dedicada que se active via clase CSS en el `<body>`:

```css
body.high-contrast {
    --color-primary: #0000FF;
    --color-dark: #000000;
    --color-gray: #000000;
    --color-light-gray: #FFFFFF;
    /* etc. */
}
```

### A11Y-06: Imagenes de fondo en heroes sin alternativa textual

**Severidad:** MEDIA
**WCAG:** 1.1.1 Non-text Content (Level A)

Las secciones hero usan background images via CSS inline. Si estas imagenes son puramente decorativas (y el contenido se entiende sin ellas), esta bien. Si transmiten informacion, necesitarian un `role="img"` con `aria-label` en el contenedor.

Para las secciones hero del prototipo, las imagenes parecen ser decorativas y el texto superpuesto comunica el mensaje, asi que el impacto es bajo.

### A11Y-07: Boton flotante de WhatsApp

**Severidad:** BAJA
**WCAG:** 2.4.3 Focus Order (Level A)

El boton flotante de WhatsApp en posicion fija puede interferir con la navegacion por teclado (aparece al final del tab order, lejos del contexto visual). En pantallas chicas tambien puede tapar contenido. Considerar agregar un `aria-label="Contactar por WhatsApp"` si no lo tiene ya.

### A11Y-08: `<details>/<summary>` con markers de webkit ocultos

**Severidad:** BAJA

El CSS personaliza los markers de `<details>` para las FAQs. Esto funciona en navegadores modernos pero podria causar inconsistencias en navegadores mas viejos. Dado el publico objetivo (personas mayores que pueden usar navegadores desactualizados), vale la pena testear.

---

## 6. RENDIMIENTO

Para un prototipo diegetico que se muestra en contextos controlados (presentaciones, exhibiciones, evaluaciones), el rendimiento no es critico. Sin embargo, si se publica online:

### PERF-01: Dependencia de CDNs externos sin fallback

**Severidad:** MEDIA

El prototipo depende de 5 servicios externos:
- `cdnjs.cloudflare.com` (Font Awesome)
- `fonts.googleapis.com` (Google Fonts - Roboto)
- `images.unsplash.com` (imagenes de hero)
- `unpkg.com` (Leaflet para mapa)
- `i.pravatar.cc` (avatares de testimonios)

Si cualquiera de estos cae durante una presentacion, partes del prototipo se rompen visualmente. Considerar descargar los recursos criticos (fuentes, iconos, imagenes clave) y servirlos localmente.

### PERF-02: Sin lazy loading

**Severidad:** BAJA

Las imagenes de Unsplash en secciones hero se cargan todas al inicio. Agregar `loading="lazy"` a las que esten below-the-fold mejoraria la carga inicial.

### PERF-03: Sin minificacion

**Severidad:** BAJA

520 KB sin minificar. No es un problema para presentaciones locales, pero si se publica, la minificacion reduciria el peso ~30%.

---

## 7. ASPECTOS POSITIVOS

1. **Friccion realista como patron de diseno.** El mayor diferenciador del prototipo. Listas de espera, tiempos, testimonios mixtos, disclaimers de capacidad. Esto es un patron de diseno honesto que no se ve casi nunca en prototipos gubernamentales y que refuerza enormemente la verosimilitud.

2. **Profundidad del worldbuilding.** 11 paginas con contenido sustancial, datos de transparencia, presupuesto, 16 nodos con direcciones, FAQ detallados. La densidad de informacion convence.

3. **HTML semantico consistente.** Buen uso de `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`, `<details>/<summary>`. La estructura del documento tiene sentido.

4. **Barra de accesibilidad funcional.** Skip link, ajuste de texto con 3 niveles, alto contraste, persistencia en localStorage. Demuestra el compromiso del diseno con la accesibilidad.

5. **CSS global bien organizado.** `styles.css` tiene secciones claras con comentarios, variables CSS para la paleta, sistema de grid, componentes reutilizables (`.friction-badge`, `.reality-check`, `.system-status`).

6. **Zero dependencias de framework.** HTML/CSS/JS vanilla = carga rapida, sin build tools, facilmente desplegable en cualquier server estatico.

7. **Print styles.** Se incluyen estilos de impresion que ocultan nav, footer, WhatsApp y elementos de friccion (`styles.css:735-753`).

8. **Focus states globales.** `styles.css:717-729` define outlines de focus para todos los elementos interactivos, lo cual es fundamental para navegacion por teclado.

9. **Componentes de friccion reutilizables.** `.friction-badge`, `.reality-check`, `.system-status`, `.stat-sublabel`, `.priority-disclaimer` forman un mini design system de "honestidad institucional".

10. **Tono y lenguaje apropiados.** El copy es convincente como comunicacion gubernamental argentina: formal pero accesible, con terminologia correcta de tramites y servicios publicos.

---

## 8. RESUMEN DE HALLAZGOS POR SEVERIDAD

| Severidad | Cant. | Resumen |
|-----------|-------|---------|
| **ALTA** | 5 | Duplicacion CSS (~1,800 lineas), sin menu mobile, WCAG declarado pero no cumplido, contraste insuficiente en `.stat-sublabel`, radio buttons sin fieldset |
| **MEDIA** | 8 | Transiciones instantaneas en forms, `alert()` nativo, botones inconsistentes, alto contraste con filter(), sin fallback para CDNs, formularios sin error feedback accesible, imagenes hero sin alt |
| **BAJA** | 7 | Link de privacidad a #, avatares de CDN, sin breadcrumbs, sin persistencia de form, Font Awesome viejo, sin lazy loading, sin minificacion |
| **INFO** | 2 | Sin .gitignore, sin linter |

---

## 9. RECOMENDACIONES PRIORIZADAS

### Prioridad 1 - Impacto alto, esfuerzo medio

1. **Consolidar CSS:** Mover los ~1,800 lineas de estilos inline a `styles.css` o archivos por pagina. Esto elimina inconsistencias y hace el proyecto mantenible.

2. **Corregir contraste:** Cambiar `color: #999` en `.stat-sublabel` a `#767676` o mas oscuro. Cambiar `rgba(255,255,255,0.6)` en footer legal a `rgba(255,255,255,0.75)`.

3. **Implementar menu hamburguesa mobile:** Con 8+ links de nav, el stack vertical en mobile es un problema de usabilidad evidente.

4. **Ajustar declaracion WCAG:** Cambiar "Cumple WCAG 2.1 AA" a "Disenado siguiendo las pautas WCAG 2.1" hasta resolver todos los issues de accesibilidad, o resolver los issues.

### Prioridad 2 - Mejora de verosimilitud

5. **Simular loading en envio de formularios:** Agregar delay de 1-2 segundos con spinner antes de mostrar confirmacion.

6. **Reemplazar `alert()` en contacto.html** con mensaje inline.

7. **Descargar recursos criticos localmente:** Fuentes, iconos y al menos las imagenes hero principales, para no depender de CDNs durante presentaciones.

### Prioridad 3 - Mejora de accesibilidad

8. **Usar `<fieldset>/<legend>`** para grupos de radio buttons en inscripcion.html.

9. **Implementar alto contraste con paleta CSS** en vez de `filter: contrast(1.5)`.

10. **Agregar `aria-invalid` y mensajes de error** accesibles en campos de formulario.

### Prioridad 4 - Nice to have

11. Agregar breadcrumbs.
12. Implementar persistencia de formulario con localStorage.
13. Crear pagina de Politica de Privacidad (aumenta worldbuilding).
14. Definir escala de spacing y tipografia en variables CSS.
15. Considerar generador estatico (11ty) para eliminar duplicacion de header/footer/nav.

---

*Analisis realizado sobre el branch `claude/comprehensive-code-review-dMueP`.*
