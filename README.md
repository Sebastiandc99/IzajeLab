# IzajeLab · v4.0.3

Herramienta en español para planificar izajes con tablas de grúas y análisis de eslingas. Aplicación estática sin dependencias, preparada para GitHub Pages y uso móvil.

**Repositorio:** https://github.com/Sebastiandc99/IzajeLab

**Aplicación:** https://sebastiandc99.github.io/IzajeLab/ (GitHub Pages).

## Verificación integrada (v3.2)

- Se verifica el lingado al seleccionarlo y ante cambios de peso, WLL, material, ángulo, geometría de eslingas, reparto o lectura del sensor.
- Sobrecarga, ángulo inválido, WLL faltante o configuración no respaldada dejan el izaje bloqueado con su razón. Se borran propuestas previas y no se consulta la tabla de grúa al pulsar Calcular.
- Solo un lingado que cumple su WLL permite calcular la grúa. El porcentaje de grúa sigue siendo un chequeo numérico preliminar.
- R/L intermedios conservan sus valores en el formulario, la geometría y el croquis; los valores de referencia de tabla y la nota del fabricante se muestran separados.
- Tablas propias: radios y plumas exactos por defecto. El criterio siguiente mayor o mínimo de vecinos exige indicar nota/página/revisión del manual. Los planes anteriores siguen siendo importables.

## Flujo visual (v3)

- No hay selector de objetivos. Peso obligatorio; radio, pluma y altura son campos opcionales.
- Los campos ingresados se conservan. Los vacíos se buscan con la tabla: radio conocido → menor pluma compatible; radio vacío → mayor radio tabulado compatible y menor pluma en ese radio.
- Si la altura se deja vacía, se propone altura disponible aproximada por geometría rígida (no es una celda de capacidad). Los campos autocompletados quedan marcados y se vuelven a buscar cuando cambia la carga.
- Antes de calcular se exige elegir lingado. Si falta, aparece “Completar tipo de lingado” con acceso al selector visual.
- Ocho dibujos táctiles: vertical, estrangulado, cesta paralela con balancín, cesta inclinada, 2 directos, 2 estrangulados, 3 ramales, 4 ramales.
- El dibujo grande reproduce el amarre elegido. El deslizador cambia el ángulo y abre/cierra los ramales. La capacidad de las eslingas se verifica automáticamente usando el WLL ingresado; una falla bloquea el cálculo general de grúa.
- Dos estrangulados: factor 0,8 aplicado al factor de 2 ramales de la tabla SpanSet. Cesta paralela requiere balancín: su peso debe estar incluido entre los aparejos.

## Acceso al ángulo (v3.1.3)

Ángulo del eslingado aparece al inicio de Lingado y ángulo, siempre visible incluso sin amarre elegido. Admite ingreso manual o medidor del teléfono. En móvil el acceso al sensor aparece primero. Medir antes de elegir un lingado conserva el ángulo y no abre el aviso de amarre al aplicar la medición. En vertical/estrangulado/cesta paralela se aclara que el ángulo medido no modifica la capacidad de esa configuración.

## Funciones heredadas

- Peso obligatorio único para todos los cálculos, sin valor de carga de ejemplo precargado.
- Búsqueda automática de los datos de radio, pluma y altura que no se ingresan.
- Radio/pluma en croquis proporcional a la misma escala, actualizado mientras se escriben los datos.
- Botón desplegable Dimensiones de la carga: largo (en el plano), ancho (profundidad) y alto opcionales, en metros. Se conservan en JSON y en el informe. Largo/alto se dibujan con la escala de radio/pluma; ancho se indica como profundidad. El lingado permanece esquemático y no determina los anclajes. H sigue siendo suelo a gancho. Estas dimensiones no alteran peso, capacidad ni búsqueda de tabla.
- Croquis de izaje a todo el ancho con mayor tamaño y extensión del dibujo para no recortar cargas grandes.
- Inclinómetro: borde largo del teléfono paralelo al ramal, lectura estable de β desde vertical y θ desde horizontal, toma de ángulo y calibración horizontal.
- Sensores solo tras pulsar Iniciar y permitir acceso si el navegador lo pide. HTTPS requerido. Sin hardware o sin lecturas válidas, no muestra cero ni permite tomar una medida.

El inclinómetro usa aceleración con gravedad del eje Y físico del teléfono y, como alternativa, orientación β del dispositivo. No usa velocidad angular como ángulo. Filtra lecturas, exige estabilidad y frescura, y redondea β tomado hacia arriba a 0,1°. La pantalla girada no cambia el borde físico que se debe apoyar. La medición es orientativa y requiere verificación sobre un dispositivo real.

## Funciones

- Verificar utilización con peso bruto, radio y pluma.
- Buscar radio máximo tabulado para una pluma y carga determinadas.
- Buscar plumas compatibles con radio y altura; explorar alternativas de radio/pluma.
- Croquis de pluma/radio y filtro de altura del gancho con pivote y reserva configurables.
- Aplicar límite de proyecto de 75% o menor; deducciones separadas de masa suspendida.
- Eslingas textiles, cadena y cable de acero; directa, estrangulada, cesta y ramales.
- Ingresar ángulo desde vertical, horizontal o incluido; obtenerlo desde separación/altura o longitud.
- Analizar dos puntos con CG desplazado y mostrar tensiones/reacciones por ramal; WLL conservador con un ramal al ángulo máximo.
- Importar tablas CSV/TSV o JSON de cualquier marca/configuración; conservar fuente y revisión.
- Exportar/reabrir análisis y tablas. Informe imprimible (Guardar como PDF).
- Guardado local de tablas; cálculo offline después de la primera carga completa del sitio.

## Modelos agregados en v3.1

- SANY STC300, 30 t, pluma 33,5 m.
- SANY STC500, 50 t, pluma 43 m: modos de extensión I y II separados.
- SANY STC800, 80 t: exclusivamente variante de pluma 50 m y contrapeso 15,65 t.
- Tadano GT-600EX, 60 t / 43 m, modelo publicado por Tecmaco. Ficha de referencia EX-04 (2010), TC-4255-2; no equivale automáticamente a una unidad Tecmaco. Modos I y II, estabilizadores 6,8 m; quinta pata para 360°.

Fuentes enlazadas en `data.js` y controles de transcripción en `docs/chart-audit.md`. No se mezclan variantes con plumas/contrapesos diferentes.

## Datos iniciales y alcance

SANY STC250 (publicación 2017): pluma principal, estabilizadores completos 6,2 m, 360°, contrapeso 3,8 t. No confundir con STC250-IR2/T4/T5. Fuente: https://www.sanyglobal.com/all/d/file/p/2017-01-20/9ab5b183f46b230d01d74ab3a77eda58.pdf (página impresa 12, página PDF 7).

Grove RT540E, guía métrica Latinoamérica: exclusivamente tabla inferior SAE 85% de página 15, estabilizadores 100%, 360°, contrapeso 4,3 t. No se mezcla DIN/ISO. https://www.manitowoc.com/sites/default/files/media/divers/file/2020-01/RT540E-Product-Guide-Metric-Latin-America.pdf

Eslingas: factores de modo de SpanSet Safe Lifting Chart 87034 (07/2015): https://www.spanset.com/uploads/uk/Safe%20Lifting%20Chart%2087034.pdf

Consultas de fuentes: 11/10/2026. Los datos precargados son referencias de folletos y requieren cotejo con manual operativo de la unidad/serie. La app no aprueba maniobras ni certifica capacidad real de un equipo. No se admiten capacidades estimadas por tonelaje nominal/peso de la máquina. Las marcas sin tabla propia no generan resultados ficticios. Tecmaco se identifica como proveedor, no como fabricante de tabla.

## Criterios del motor

Utilización = (carga + gancho + aparejos + otros suspendidos) / (tabla bruta − deducciones) × 100. El criterio 75% se aplica a capacidad publicada; no vuelve a aplicar el criterio de vuelco SAE 85%.

Las columnas y filas almacenan valores exactos. SANY STC250/300/500: para R o L intermedios se usan el siguiente radio y largo mayores de la configuración seleccionada (folletos p.12, nota 6). Grove RT540E: mínimo de celdas contiguas válidas para R y/o L intermedios (p.14, nota 3), como criterio conservador. SANY STC800 y Tadano GT-600EX mantienen radios/plumas exactos porque los documentos precargados no definen una regla cotejada. La verificación no aplica interpolación lineal ni extrapolación fuera del rango; todas las celdas de los límites del intervalo deben existir. Las búsquedas devuelven máximos dentro de los radios tabulados, no un máximo continuo ni una ubicación aprobada.

Geometría rígida aproximada: R = offset + L cos(ángulo); altura punta = altura pivote + L sin(ángulo). La punta requerida incluye altura del gancho H + reserva de cabezal. H se mide desde el suelo y ya contempla el aparejo sobre la carga. Pivote, offset y reserva iniciales son datos ilustrativos ingresados por usuario. Se necesita el diagrama de alcance real para considerar flexión, cabezal, obstáculos y giro.

Tensión simétrica: T = W/(n cos β). La capacidad también se limita por factores de banda SpanSet; 4 ramales cuentan como 2 portantes por defecto y 3 solo con reparto uniforme justificado. Los resultados no incluyen pérdida por impactos, aristas, químicos, temperatura ni accesorios. Cable: WLL certificado del conjunto para el amarre/ángulo real.

## Publicar en GitHub Pages

Repositorio: `IzajeLab` en la cuenta `Sebastiandc99` (público para Pages gratuito).

1. Crear repositorio público `IzajeLab`, rama `main`.
2. Subir este proyecto incluyendo `.github/workflows/pages.yml` y `.nojekyll`.
3. En Settings → Pages → Build and deployment, elegir **GitHub Actions**.
4. El workflow verifica el motor y publica los archivos estáticos. La URL esperada al completar el despliegue es `https://sebastiandc99.github.io/IzajeLab/`. La disponibilidad depende del resultado del workflow de Pages.

Alternativa sin Actions: publicar desde rama `main`, carpeta raíz `/`. El motor no necesita compilación.

## Desarrollo y validación

Node 22+: `npm run check` y `npm test`. Sin `npm install` ni bibliotecas externas.

Para servir localmente: `python3 -m http.server 8000` dentro de este directorio. Abrir `http://localhost:8000`.

`IzajeLab-portable.html` es una versión autocontenida que se puede abrir directamente sin servidor (generada por `python3 build_portable.py`). No registra service worker. El guardado local depende de permisos del navegador; exportar JSON es la copia portable.

Las pruebas cubren el motor, los flujos y las conversiones de inclinación/escala. El sensor requiere verificación física con el teléfono de campo. Antes de operar se requiere cotejo de tablas y revisión contra la unidad real.

## Importar tabla

Matriz (m, kg; separador `;` o tabulación, sin separador de miles):

```text
radio;10;20;30
3;25000;18000;
5;18000;14000;8000
8;9000;7000;5000
```

También se admite lista con encabezado `radio;pluma;capacidad`. Los números del ejemplo son ilustrativos y no corresponden a un modelo. Identificar manual, página, revisión y condiciones antes de guardar. Solo se aceptan tablas brutas; convertir/cotejar una tabla neta antes de importar.

La tabla JSON exportada incluye booms, rows, fuente, política de radio y configuración. Nunca modificar una capacidad por inferencia a partir de un modelo similar.

## Actualizaciones

Cada cambio de archivos de producción requiere aumentar el nombre CACHE en `sw.js`. Las pestañas abiertas pueden conservar el worker anterior hasta cerrarlas/reabrirlas. Datos de tablas propias se conservan en el navegador salvo eliminación manual.

## Estimaciones matemáticas · v3.3

Al ingresar radio y pluma explícitos, si no se puede verificar la grúa con la tabla, se ofrece una estimación de referencia: lineal con dos celdas contiguas o bilineal con cuatro. Fuera del tramo se extrapola; dentro se etiqueta como interpolación. Un cartel compacto muestra el valor estimado y el tabulado más cercano con sus coordenadas. Ver datos usados muestra todas las celdas y la fuente.

La estimación **no es capacidad autorizada**: no calcula una utilización admisible, no aprueba el límite del 75%, no propone medidas ni rellena campos. Se exporta como `referenceEstimate` con `verificationEligible:false`, separado de `resultCrane:null`. La impresión de un cálculo de grúa exige resultado verificable. La falla del lingado bloquea también esta estimación.

Se mantienen los huecos internos y modos de extensión separados. Con un eje exacto se usa el tramo publicado de esa fila/columna; fuera de él solo se prolongan sus dos celdas contiguas del borde. No se estima con valores faltantes, un único punto sin pendiente o un resultado no positivo. Una proyección matemática no demuestra alcance físico ni estabilidad.

## Mosaico y dos posiciones · v4.0.3

La pantalla principal tiene cuatro bloques: carga, grúa, lingado/ángulo y posiciones. Se conservan catálogo, tablas propias, importación/exportación, sensor de teléfono y dimensiones desplegables.

Se evalúan **posición 1 inicial** y **posición 2 final**, cada una con radio de grúa R, longitud de pluma L, ángulo θ desde la horizontal y altura H opcional. El lingado comparte el peso y su ángulo β desde la vertical. R siempre fue el radio de la grúa (eje de giro al centro de la carga); no es radio de eslinga.

Cada resultado informa capacidad de tabla, capacidad disponible después de deducciones, peso suspendido y carga admisible al límite de proyecto en **tn (1 tn = 1000 kg)**. Los dos croquis conservan coordenadas propias y marcadores SVG independientes. La posición con mayor utilización gobierna el resultado conjunto. **APTO** exige ambas posiciones numéricamente compatibles y dentro del límite (máximo 75%), más lingado dentro de WLL; es un chequeo preliminar, no aprobación operativa. Una estimación matemática nunca completa estas condiciones.

Geometría rígida aproximada: R = offset de pivote + L × cos(θ). Con R y θ se obtiene L; con L y θ, R; si θ queda vacío se calcula desde R/L. Cuando se ingresan R/L/θ se verifica coherencia con tolerancia numérica 0,5°; no es tolerancia del fabricante. Se verifica el ángulo máximo de la configuración aun con H vacía. Las capacidades siempre proceden de tabla, según su criterio de intermedios; no proceden del ángulo ni del tamaño nominal.

Los campos vacíos de cada posición son propuestas independientes, marcadas como tales. No se copia la posición inicial como dato confirmado de la final. Dos extremos verificados no verifican el recorrido completo: radios y sectores intermedios, deformaciones, condiciones de obra y manual de unidad siguen siendo necesarios.

Formato de análisis `izajelab-plan-v4`: incluye ambos grupos de datos, resultados de posiciones, evaluación conjunta y flags de datos propuestos. Se siguen abriendo v1/v2/v3; la posición final ausente se vuelve a proponer desde la tabla y requiere cotejo. El PDF incluye ambas posiciones y croquis, θ de grúa, β de eslingas, capacidades en tn, fuentes y resultado conjunto.
