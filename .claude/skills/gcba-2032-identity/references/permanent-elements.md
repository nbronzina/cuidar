# Elementos permanentes — No eliminar nunca

## 1. Escudo de la Ciudad Autónoma de Buenos Aires

- **Base legal:** Ley 4.408/2012
- **Archivo:** `img/escudo-caba.svg`
- **Ubicación:** Header (40x48px) y footer (20x24px)
- **Alt text:** "Escudo de la Ciudad Autónoma de Buenos Aires"
- **Nota:** El escudo heráldico es el único símbolo oficial de la Ciudad. No confundir con el isologo "BA" que es de gestión.

## 2. Nombre constitucional

- **Base legal:** Constitución de la Ciudad Autónoma de Buenos Aires (1996)
- **Texto exacto:** "Ciudad Autónoma de Buenos Aires"
- **Ubicación:** Header (`.institutional`), footer (`.footer-legal`)
- **Nota:** NUNCA abreviar a "CABA" en contexto institucional formal. "CABA" es aceptable solo en texto corrido informal.

## 3. Dominio .gob.ar

- **Base:** Dominio oficial del gobierno argentino desde 1997
- **Uso:** Cualquier URL ficticia debe usar `.gob.ar` (nunca `.com`, `.org`, `.ar`)
- **Ejemplos:** `cuidadosenred.gob.ar`, `buenosaires.gob.ar`

## 4. Línea 147

- **Institucionalizada:** 2009
- **Características:** Gratuita, 24/7, desde fijo o celular
- **Ubicación obligatoria:** Barra de accesibilidad (todas las páginas), página de contacto, CTAs de inscripción
- **Formato:** `<a href="tel:147">147</a>` con `aria-label="Llamar al 147"`

## 5. Disclaimer de autoría

- **Clase:** `.author-disclaimer`
- **Ubicación:** Footer, después del `.footer-legal`
- **Texto:** "Proyecto de diseño especulativo · Cuidados en Red es una obra de ficción que explora futuros posibles para el cuidado de personas mayores en Buenos Aires. Aunque este sitio simula una plataforma gubernamental, es un trabajo independiente creado íntegramente por Nicolás Bronzina. Todo el contenido, concepto, diseño y código es de su autoría."
- **Nota:** NUNCA eliminar. Es la declaración de que esto es ficción.

## 6. Barra de accesibilidad

- **Clase:** `.accessibility-bar`
- **Ubicación:** Primera cosa visible en todas las páginas (antes del header)
- **Contenido:** Controles de tamaño de texto (A/A+/A++), alto contraste, enlace al 147
- **Nota:** NUNCA eliminar. Es parte del compromiso WCAG.
