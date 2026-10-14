# IzajeLab · v4.3.1

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

Desde v4.4.0, las tres grúas aplican el criterio conservador del proyecto: para radios intermedios exige referencia superior válida y toma la menor capacidad de los vecinos disponibles dentro de la configuración seleccionada. Desde v4.4.3, la pluma admite solo longitudes tabuladas. Conserva R/L reales y bloquea fuera de rango o referencia superior vacía. Esta elección del proyecto no se presenta como autorización del fabricante. Las estimaciones matemáticas pueden mostrarse como referencia, con el valor tabulado fuente, y nunca producen APTO.

## Selección de pluma · v4.3.0

La lista de plumas de las telescópicas reúne todas las longitudes tabuladas para los mismos estabilizadores, contrapeso, base de tabla y sector. Al ingresar una longitud exacta que necesita un único patrón distinto, se ajusta ese patrón y se muestran sus porcentajes; se borra la confirmación de unidad. Si hay varios patrones compatibles y el activo no sirve, se exige elegir, sin tomar el de mayor capacidad. Las dos posiciones deben estar cubiertas por el patrón elegido; un cambio de patrón entre extremos requiere replantear la configuración. H/HJ de la SCC permanecen montajes separados. Los intermedios siguen la política del patrón activo.

Caso cotejado SRC900C: R22/L47, estabilizadores 100%, contrapeso 9,5 tn, TELE1–4 100%, PDF6 / impresa11, columna21: capacidad 5,3 tn. Al 75%, 3,975 tn de peso suspendido antes de otras deducciones. No se modificaron capacidades ni reglas de interpolación. Las pruebas recorren el acceso a las 141 columnas y conservan el cotejo de las 2267 capacidades.

## Auditoría de funcionamiento · v4.3.0

Se corrigieron pesos de accesorios bajo eslingas omitidos en la grúa, límites del ángulo manual, radio mínimo del sitio, rechazo de la celda superior válida en SRC1300T, validación angular del cable certificado e importaciones con configuración/unidad/tipos inválidos. No se cambiaron capacidades del catálogo. Ver [comparación manual y pruebas](docs/audit-2026-10-13.md).

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


## Auditoría independiente de 50 ejemplos - origen v4.3.0, actualizada v4.4.0

Capacidades transcritas visualmente de los PDF, con cuentas independientes en toneladas usando Decimal: 17 casos SRC900C, 17 SRC1300T y 16 SCC4500A. Con el criterio v4.4.0 incluye 46 resultados numéricos y 4 casos sin capacidad verificable. Los documentos v4.3.0 conservan la auditoría histórica de 44 resultados y 6 casos bloqueados. No se modificaron las 2267 capacidades ni las 141 columnas del catálogo. Cada ejemplo se compara con el motor y recorre también el formulario en toneladas.

- Oráculos: `tests/fixtures/manual-50.json`.
- Comparación: `node tools/compare-manual-50.mjs`.
- Cuentas y condiciones: `docs/manual-50-audit.md`.
- Resultados completos: `docs/manual-50-results.json`.

Toneladas primero en carga y capacidades; kilogramos primero en gancho, aparejos, accesorios y deducciones. Todos admiten ambas unidades con conversión automática. La pantalla de eslingas comienza con “Ingresá capacidad de la eslinga”, seguida de su peso propio. Peso propio vacío = 0; carga, capacidad individual y capacidad certificada no vienen precargadas. Los análisis anteriores sin campos de unidad nuevos se interpretan como kg y se recalculan.

Cable de acero certificado: exige la capacidad del conjunto para el amarre y ángulo elegido; no exige la capacidad individual oculta que esa fórmula no utiliza. Ángulo y capacidad del conjunto se siguen validando. Selectores, criterios, nombres de materiales e informe se muestran en español; se conservan códigos de modelo, montaje, secciones y símbolos técnicos.


## Geometría independiente y campos de pesos - v4.3.1

Caso de la captura: SRC900C R15/L33,95. La longitud es tabulada; R15 está entre filas R14 y R16. En v4.3.1 no se había cotejado una regla operativa del fabricante y la capacidad quedaba sin verificar. Desde v4.4.0, la elección expresa del usuario habilita el criterio conservador del proyecto: R15/L33,95, patrón T1 0% y estabilizadores 100%, usa R16 y 6,7 tn brutas, sin promediar. La geometría se obtiene por separado: θ≈63,78° con desplazamiento de pivote cero. La pantalla completa el ángulo y conserva el radio físico 15. El resultado muestra la referencia tabulada y el criterio del proyecto. APTO sigue exigiendo las dos posiciones, geometría y eslingas compatibles y utilización hasta el 75%. No se completan radios/plumas por la estimación ni se confunde con una capacidad publicada. Una celda vacía también puede mostrar geometría sin inventar capacidad.

Controles de masa: número y unidad en filas separadas, altura56px y fuente18–20px. En celular, los ajustes comunes de carga ocupan una sola columna y el selector de unidad de carga va debajo del número. Se conserva la conversión automática tn/kg.

## Criterio conservador del proyecto - v4.4.0

Los 50 ejemplos actualizados coinciden con el motor y con el formulario. Casos 16 y 50 pasan de sin capacidad verificable a capacidad del vecino superior (4,2 tn y 55,7 tn). Regla y alcance en `docs/project-conservative-criterion.md`; resultados actualizados en `docs/project-conservative-50-results.json`. Los ensayos recorren además cada celda exacta y cada radio medio en las 27 configuraciones, incluyendo las subidas locales de capacidad, vacíos y límites de ángulo. Los textos de selección dicen configuración de eslingado.

## Croquis y cambio de longitud tabulada - v4.4.1

Las dos posiciones usan un desplegable nativo con todas las longitudes tabuladas del montaje disponible, separado del número editable. La lista no se filtra por la longitud ya ingresada y permite cambiarla repetidamente. Los valores escritos, calculados e importados se sincronizan con el selector. Cambiar una longitud conserva los radios ingresados, invalida los resultados y elimina ángulos/alturas automáticos para recalcularlos. Se conservan los controles de compatibilidad del patrón y de montaje H/HJ.

Los dos croquis tienen más espacio vertical; el encuadre de la grúa reduce márgenes vacíos para ampliar la figura y sus cotas, conservando la escala de R/L y extendiéndose cuando las dimensiones de carga o los avisos lo requieren. El croquis de eslingado también tiene más espacio.

286 pruebas aprobadas, incluidos cambios sucesivos mediante ambos selectores, conservación del radio y renovación de geometría, sincronización manual/automática y cambios de modelo/montaje. Los 50 ejemplos independientes siguen coincidiendo.

## Croquis ampliados nuevamente - v4.4.2

Se amplía nuevamente el encuadre de las dos posiciones, reduciendo el ancho vacío habitual de 740 a 620 unidades de dibujo, con crecimiento automático para no cortar las cotas, la carga ni los avisos. El eslingado también tiene un encuadre más cercano que contempla la perspectiva de 3 y 4 ramales. Aumenta el espacio vertical en celular y escritorio.

## Longitudes de pluma exclusivamente tabuladas - v4.4.3

Las dos posiciones muestran solo el desplegable de longitudes tabuladas; se elimina la entrada numérica libre. La propuesta automática también debe pertenecer a la tabla. El radio sigue admitiendo valores intermedios y aplica la menor capacidad entre los radios vecinos con referencia superior válida. Los patrones de extensión y H/HJ siguen separados. Una longitud calculada desde radio/ángulo que no coincide con la tabla no habilita capacidad; se solicita elegir una longitud tabulada.

Antes de abrir un análisis se verifica que sus plumas pertenezcan al catálogo actual y al montaje físico correspondiente. Una longitud anterior fuera de tabla se rechaza con un mensaje y conserva el análisis que estaba abierto. El selector puede volver a quedar vacío para proponer una longitud desde la tabla. Los campos internos boom/boom2 se conservan ocultos para mantener el formato de guardado y enlazar el selector con los cálculos.

289 pruebas aprobadas. Los 50 ejemplos siguen coincidiendo: los ejemplos 28 y 29 eligen explícitamente las columnas de 30,2 m y 25,9 m que antes se usaban como referencia para longitudes libres de 29 m y 25,5 m. Las capacidades PDF permanecen intactas.

## Configuración pendiente y extensión de estabilizadores - v4.4.4

La pantalla de posiciones distingue “Extensión de estabilizadores” de “Extensión de secciones de la pluma”. El primer selector cambia la familia de tablas de apoyo (100%, 50% o retraídos), conservando el patrón T1 cuando está disponible; el segundo muestra los porcentajes de las secciones telescópicas. Los montajes H/HJ de la grúa sobre orugas conservan su selección independiente y no ofrecen estabilizadores.

Si las longitudes requieren elegir entre varios patrones compatibles, se marca en ámbar la configuración y el selector pendiente, con un mensaje explícito. Las posiciones conservan sus datos y quedan pendientes de verificación sin el rojo de falla. El plan y su análisis guardado indican PENDIENTE y no habilitan APTO. Al completar ese selector tras una verificación pendiente, se recalculan ambas posiciones automáticamente. El rojo continúa indicando incumplimientos o incompatibilidades reales.

292 pruebas aprobadas; los 50 ejemplos independientes mantienen coincidencia. Se incluyen selección pendiente en SRC900C, conservación de radios/plumas, reanudación del cálculo, exceso real de utilización, cambio 100%→50%→retraídos y separación del montaje sobre orugas.
