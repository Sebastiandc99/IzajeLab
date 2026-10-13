# IzajeLab · v4.2.1

Aplicación estática en español para calcular utilización de grúa y verificar lingado en dos posiciones. GitHub Pages: https://sebastiandc99.github.io/IzajeLab/.

## Catálogo del proyecto

Sólo los tres PDF entregados por el usuario el 13/10/2026. Se retiraron los modelos y tablas anteriores obtenidos de Internet. Los equipos almacenados por versiones anteriores no se agregan al catálogo; un análisis de un modelo retirado se rechaza. La edición/importación de otros equipos está deshabilitada en esta versión.

| Modelo | Capacidad nominal | Configuraciones incluidas | PDF fuente |
|---|---:|---|---|
| SANY SRC900C | 90 tn | 9: estabilizadores 100/50/0%, separadas por TELE1 0/50/100% | SRC 900C.pdf, páginas PDF 6–8; impresas 10–15 |
| SANY SRC1300T | 130 tn | 16: 14 patrones de T2/T3/T4 a 100%, una tabla 50% y otra 0% | SRC1300T.pdf, páginas 25–29 |
| SANY SCC4500A | 450 tn | 2: H y HJ, sin superlift; trasero 180 tn + carbody 50 tn | SCC 4500A (1).pdf, páginas 37 y 46 |

Se preservan 141 columnas fuente y 2267 capacidades; toneladas convertidas a kg, celdas vacías como `null`. Las longitudes repetidas de diferentes extensiones no se combinan. Cada tabla presenta porcentajes de secciones, enhebrado, ángulo mínimo y página/columna fuente. Ver [docs/chart-audit.md](docs/chart-audit.md).

Sólo se habilitan configuraciones representables por pluma principal recta. No se habilitan plumines, jib abatible, superlift, pick & carry ni tablas sobre neumáticos. SRC1300T pp.33–34 imprime `Unit: kg` con números decimales de interpretación ambigua; esas páginas no se convierten ni habilitan. Los PDF completos contienen más configuraciones que las implementadas.

SRC1300T admite siguiente radio/pluma mayor dentro del mismo patrón según p.29 nota 4. SRC900C y SCC4500A conservan medidas exactas al no disponer de una regla cotejada para intermedios. Las estimaciones matemáticas pueden mostrarse como referencia, con el valor tabulado fuente, y nunca producen APTO.

## Funcionamiento

- Mosaico: carga, grúa, lingado y posiciones. Los ítems que no verifican se marcan en rojo, con razón textual.
- El peso es obligatorio. Cada posición requiere al menos radio R, pluma L o ángulo θ. La altura sola no define una posición. Al verificar se indica qué posición falta y se abre su formulario.
- Si R está cargado, puede omitirse θ: se propone la menor pluma de la configuración que cumpla y se calcula θ. No se presume un único ángulo para un radio. Con R/L se calcula θ; con R/θ se calcula L; con L/θ se calcula R. Los campos automáticos quedan marcados y se recalculan al editar.
- θ de grúa se mide desde la horizontal del pivote. β de eslingas se mide desde la vertical. Se mantienen los ocho dibujos de lingado, ángulo manual y medición orientativa por sensores del celular.
- Lingado se verifica automáticamente. Si no cumple, se bloquea la comprobación de grúa. APTO exige ambas posiciones dentro del límite configurado (máximo 75%) y lingado dentro de WLL. Es un chequeo numérico preliminar.
- Dos croquis propios, capacidades en tn, peso bruto/deducciones y peor utilización. Dimensiones de carga opcionales desplegables. PDF de análisis y JSON de guardado/apertura conservados.
- Grúa sobre orugas representada con tren de rodaje. SCC requiere 30°–85°; SRC900C aplica mínimos de cada columna y máximo 78°; SRC1300T máximo 80°.
- Gancho por defecto al cambiar modelo: SRC900C 795 kg; SRC1300T 1130 kg (120 tn); SCC4500A 10900 kg (450 tn). Reemplazar por el gancho real. Las deducciones, enhebrado y condiciones de montaje siguen requiriendo cotejo con la unidad.

## Alcance

Geometría rígida aproximada, sin flexión: `R = offset + L × cos(θ)`. H omitida significa altura disponible estimada, no una altura mínima de obra verificada. Dos extremos no verifican el recorrido completo. El sistema no certifica condiciones de terreno, viento, montaje, cables de suspensión, doble cabrestante, puntos de izaje ni correspondencia de la unidad. En SCC, la masa operativa no se inventa a partir de las 450 tn nominales.

## Desarrollo

Sin dependencias para el sitio. `npm run check` y `npm test`. `python build_portable.py` genera la copia portable. Las tablas de `tests/fixtures` son casos exclusivos de regresión numérica, sin modelos operativos, y no se publican en Pages ni en la copia portable. Las pruebas de catálogo y los flujos con catálogo real verifican las tres tablas del proyecto.

El service worker conserva una copia offline y cambia de caché por versión. Un archivo abierto como `file:` no registra service worker.

La SCC4500A conserva una única longitud de pluma de celosía para ambos extremos: si las búsquedas independientes difieren, se busca la menor longitud común compatible. Longitudes manuales distintas o ausencia de solución común bloquean APTO con una razón explícita.
