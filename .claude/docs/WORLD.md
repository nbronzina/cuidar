# World Building — Cuidados en Red

Marco general del mundo ficticio. Referencia para mantener coherencia en todo contenido nuevo.

## Qué es Cuidados en Red

Un sistema integral de cuidados domiciliarios para personas mayores de la Ciudad de Buenos Aires, ambientado en 2032. Combina:
- **Personas cuidadoras capacitadas** (20-100 hs/mes según nivel)
- **Tecnología de apoyo** (Tita, sensores, pulsera de emergencia)
- **Red de contención profesional** (16 Nodos territoriales con equipos interdisciplinarios)
- **Red comunitaria** (Centros de Día, organizaciones, vecinos)

## Marco institucional ficticio

- **Ley de creación:** Resolución 682/MDHYHGC/25 (octubre 2025) crea el programa piloto.
- **Órgano de gobierno:** Dirección de Cuidados Horizontales (creada en 2029 dentro del GCBA).
- **Dependencia:** No se especifica ministerio actual (cambian con cada gobierno). Solo se referencia "Ministerio de Desarrollo Humano y Hábitat" en la resolución fundacional de 2025.
- **Financiamiento:** 86% coparticipación de fondos nacionales, 14% GCBA (2032).
- **Dominio:** cuidadosenred.gob.ar (ficticio, bajo .gob.ar real).

## Modelo de financiamiento y niveles

### Copago escalonado por Barthel + MEC

El copago se determina por evaluación funcional domiciliaria usando Índice de Barthel (dependencia) y Mini Examen Cognitivo (cognición):

| Nivel | Dependencia | Horas/mes | Copago jub. mínima | Copago otros ingresos |
|---|---|---|---|---|
| **0 — Universal** | Sin dependencia | Evaluación + teleasis. | Gratuito | Gratuito |
| **1 — Leve** | Barthel 80-100, MEC leve | 20-40 hs | 0% | Hasta 10% |
| **2 — Moderado** | Barthel 60-80, MEC moderado | 40-70 hs | 0% | Hasta 15% |
| **3 — Severo** | Barthel <60, MEC severo | 70-100 hs | 0% | Hasta 10% (tope reducido) |

**Regla:** Nadie paga más del 15% de su ingreso mensual. Jubilación mínima = gratuito siempre.

### Reevaluación
- Nivel 0: solo evaluación inicial
- Nivel 1: anual
- Nivel 2: cada 6 meses
- Nivel 3: cada 3 meses

## Tecnología del sistema

### Tita — Compañera conversacional de voz
- Voz natural en español rioplatense
- Dos modos: Normal (recordatorios, videollamadas, juegos, monitoreo pasivo) y Alzheimer (frases cortas, orientación, reminiscencia guiada)
- **Privacidad:** NO graba conversaciones. Análisis de patrones en tiempo real en el dispositivo. Solo métricas numéricas se guardan.
- Reportes a familiares: resúmenes ("conversó 25 minutos, ánimo estable"), nunca transcripciones.

### Sensor de cama
- Piezoeléctrico bajo colchón (sin contacto)
- Mide: frecuencia cardíaca, respiración, calidad de sueño, ocupación
- Procesamiento local; solo alertas van al sistema central
- Validación clínica: 88% sensibilidad vs polisomnografía

### Módulo de baño
- Adaptación al inodoro existente (sin obra)
- Mide: pH, gravedad específica, cetonas, vitamina C, calcio urinario
- Procesamiento local; solo alertas cuando valores salen de rango
- Cartucho: reemplazo cada 3 meses

### Pulsera de emergencia
- Resistente al agua
- GPS integrado
- Botón grande, fácil de presionar
- Batería: 7 días con alerta de carga baja
- Llamada automática: Nodo + cuidadora + contacto de emergencia

### Sensores de movimiento
- Sin cámaras (privacidad)
- WiFi o red celular
- Detectan caídas, inactividad prolongada
- Alertan automáticamente a Nodo y cuidadora

## Principios de diseño del mundo ficticio

### 1. Imperfección deliberada
Todo contenido debe incluir al menos una limitación, demora o fallo. El sistema funciona bien pero no es perfecto:
- Demoras en asignación de cuidadoras
- Listas de espera por zona
- Pagos que llegan tarde
- Tecnología que necesita ayuda para configurar
- Quejas vecinales sin resolver
- Obras demoradas

### 2. Limitaciones honestas
El sistema dice lo que NO puede hacer:
- No es cuidado 24/7
- No cubre medicamentos ni internaciones
- No reemplaza atención médica especializada
- No incluye ambulancias (salvo emergencias)
- No sirve para personas en geriátricos

### 3. Burocracia realista
Los trámites tienen fricción real:
- Formularios que piden datos redundantes
- Tiempos de espera que varían por zona
- Reprogramaciones de visitas
- Errores en datos de contacto que causan demoras
- Porcentajes de emails sin seguimiento

### 4. Testimonios con matiz
Los testimonios no son todos positivos:
- Al menos 1 de cada 3 testimonios debe incluir una queja o frustración
- Los tiempos reales se incluyen junto a los oficiales
- Se mencionan las limitaciones de cada servicio

### 5. Tecnología mundana
La filosofía tecnológica es "mundana" (no futurista):
- Sensores de $30-50 USD, no robots de USD 250.000
- Lo que funciona a escala masiva, no lo de lujo para pocos
- Misma evidencia clínica que geriátricos europeos premium pero a fracción del costo
- 70% de mayores de 70 rechazan robots → personas + tecnología simple
