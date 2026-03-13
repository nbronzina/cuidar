---
name: diegetic-guardian
description: >
  Guardián de coherencia del mundo ficticio de Cuidados en Red.
  ACTIVAR al añadir cualquier contenido nuevo al sitio, incluyendo:
  texto, datos, números, personajes, instituciones, fechas, testimonios,
  estadísticas, nombres propios, referencias temporales, costos, o cualquier
  información que forme parte del mundo ficticio. También activar cuando se
  modifique contenido existente que incluya datos del mundo.
---

# Guardián Diegético — Cuidados en Red

## Protocolo de verificación

Antes de escribir CUALQUIER contenido nuevo, seguir este checklist:

### 1. Números y estadísticas
- **ANTES** de escribir cualquier número → leer `.claude/docs/DATA-TRUTH.md`
- ¿El número ya existe en DATA-TRUTH.md?
  - **Sí** → usarlo exactamente como está (incluido formato de miles/decimales)
  - **No** → NO inventar → insertar `<!-- TODO: verificar dato [descripción] -->` o proponer el número al usuario para aprobación
- Si se aprueba un número nuevo → **agregarlo a DATA-TRUTH.md PRIMERO**, antes de usarlo en el HTML

### 2. Instituciones
- **ANTES** de nombrar cualquier institución → leer `.claude/docs/INSTITUTIONS.md`
- ¿La institución está en la lista de "Usar siempre"?
  - **Sí** → usarla con el nombre exacto
  - **No** → ¿Está en la lista de "NO usar NUNCA"?
    - **Sí** → NO usarla, buscar la alternativa correcta
    - **No está en ninguna lista** → consultar al usuario antes de agregarla

### 3. Fechas y cronología
- **ANTES** de crear cualquier referencia temporal → leer `.claude/docs/TIMELINE-2025-2032.md`
- ¿La fecha/evento ya existe en TIMELINE?
  - **Sí** → usarlo exactamente
  - **No** → proponer al usuario, marcar como [FICTICIO] o [REAL], agregar a TIMELINE primero
- **Rango válido:** 2025-2032. No referenciar eventos ficticios fuera de este rango.

### 4. Personajes
- **ANTES** de crear o mencionar un personaje → leer `.claude/docs/PERSONAS.md`
- ¿El personaje ya existe?
  - **Sí** → usar nombre, edad, barrio y rol exactos
  - **No** → proponer al usuario con formato: nombre, edad, barrio, rol, página donde aparecerá
  - Si se aprueba → **agregarlo a PERSONAS.md PRIMERO**
- **Formato de testimonios:** Nombre + inicial apellido + edad + barrio

### 5. Verificación cruzada con realidad
- ¿El contenido contradice hechos reales verificables?
  - Ejemplo: si dice "PAMI fue creado en 2030" → INCORRECTO (PAMI existe desde 1971)
  - Los datos [REAL] en DATA-TRUTH son anclas verificables: no modificarlos
  - Los datos [FICTICIO] pueden ajustarse pero deben ser internamente coherentes

## Regla de imperfección deliberada

**Todo contenido nuevo debe incluir al menos una de estas formas de fricción:**

- Una limitación del servicio ("no incluye...", "no aplica si...")
- Una demora o tiempo de espera realista ("puede tardar...", "en horarios pico...")
- Un porcentaje de fallo ("8% de falsas alarmas", "22% sin seguimiento")
- Un matiz en un testimonio ("no fue instantáneo, pero...")
- Una excepción o caso borde ("en zona norte la espera es mayor")

**¿Por qué?** El mundo ficticio es creíble porque NO es perfecto. Un sistema gubernamental sin fallos no sería realista.

## Formato para datos faltantes

Cuando un dato del mundo ficticio es necesario pero no existe en los docs:

```html
<!-- TODO: [descripción del dato faltante] -->
```

Ejemplos:
- `<!-- TODO: definir nombre del Nodo en Villa Crespo -->`
- `<!-- TODO: porcentaje de cobertura en Comuna 8 -->`
- `<!-- TODO: nombre del personaje beneficiario en Boedo -->`

## Checklist rápido antes de cada commit

- [ ] ¿Todos los números están en DATA-TRUTH.md?
- [ ] ¿Todas las instituciones están en INSTITUTIONS.md?
- [ ] ¿Todas las fechas están en TIMELINE-2025-2032.md?
- [ ] ¿Todos los personajes están en PERSONAS.md?
- [ ] ¿El contenido incluye al menos una imperfección?
- [ ] ¿Contradice algún hecho real verificable?
- [ ] ¿Usa la terminología correcta? (ver skill rioplatense-voice)
- [ ] ¿Usa la identidad visual correcta? (ver skill gcba-2032-identity)
