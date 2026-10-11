# IzajeLab · v2

Herramienta en español para planificar izajes con tablas de grúas y análisis de eslingas. Aplicación estática sin dependencias, preparada para GitHub Pages y uso móvil.

**Repositorio:** https://github.com/Sebastiandc99/IzajeLab

**Aplicación:** https://sebastiandc99.github.io/IzajeLab/ (GitHub Pages).

## Interfaz de campo (v2)

- Peso obligatorio único para todos los cálculos, sin valor de carga de ejemplo precargado.
- Tres objetivos: verificar porcentaje, buscar radio máximo y buscar pluma con radio/altura de gancho.
- Radio/pluma en croquis proporcional a la misma escala, actualizado mientras se escriben los datos.
- Sin largo/ancho de carga: H es suelo a gancho. Los pesos de gancho/aparejos y ajustes se despliegan solo cuando se necesitan.
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

## Datos iniciales y alcance

SANY STC250 (publicación 2017): pluma principal, estabilizadores completos 6,2 m, 360°, contrapeso 3,8 t. No confundir con STC250-IR2/T4/T5. Fuente: https://www.sanyglobal.com/all/d/file/p/2017-01-20/9ab5b183f46b230d01d74ab3a77eda58.pdf (página impresa 12, página PDF 7).

Grove RT540E, guía métrica Latinoamérica: exclusivamente tabla inferior SAE 85% de página 15, estabilizadores 100%, 360°, contrapeso 4,3 t. No se mezcla DIN/ISO. https://www.manitowoc.com/sites/default/files/media/divers/file/2020-01/RT540E-Product-Guide-Metric-Latin-America.pdf

Eslingas: factores de modo de SpanSet Safe Lifting Chart 87034 (07/2015): https://www.spanset.com/uploads/uk/Safe%20Lifting%20Chart%2087034.pdf

Consultas de fuentes: 11/10/2026. Los datos precargados son referencias de folletos y requieren cotejo con manual operativo de la unidad/serie. La app no aprueba maniobras ni certifica capacidad real de un equipo. No se admiten capacidades estimadas por tonelaje nominal/peso de la máquina. Las marcas sin tabla propia no generan resultados ficticios. Tecmaco se identifica como proveedor, no como fabricante de tabla.

## Criterios del motor

Utilización = (carga + gancho + aparejos + otros suspendidos) / (tabla bruta − deducciones) × 100. El criterio 75% se aplica a capacidad publicada; no vuelve a aplicar el criterio de vuelco SAE 85%.

Plumas en columnas exactas. SANY: radios exactos. Grove: mínimo de las dos celdas contiguas válidas para radio intermedio; no interpola ni extrapola ni atraviesa celdas vacías. Las búsquedas devuelven máximos dentro de los radios tabulados, no un máximo continuo ni una ubicación aprobada.

Geometría rígida aproximada: R = offset + L cos(ángulo); altura punta = altura pivote + L sin(ángulo). En v2 la punta requerida incluye altura del gancho H + reserva de cabezal. H se mide desde el suelo y ya contempla el aparejo sobre la carga. Pivote, offset y reserva iniciales son datos ilustrativos ingresados por usuario. Se necesita el diagrama de alcance real para considerar flexión, cabezal, obstáculos y giro.

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
