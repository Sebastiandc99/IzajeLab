# Ampliación de tablas · 11/10/2026

Todas las capacidades son kg; celdas vacías permanecen null. Las matrices almacenan radios/longitudes exactos. Ver criterios de intermedios más abajo. Tablas de folleto para planificación, no equivalencia de revisión/serie de unidad.

| Equipo | Documento de fabricante | Página | Condiciones | Controles (R / L / kg) |
|---|---|---|---|---|
| SANY STC300, 33,5 m | 2dd9718ee3a8f8f04aa72d55debe82a0.pdf | 12, PDF 7 | 5,3 × 6,2 m; giro según folleto; contrapeso 2,8 t según p.7 | 3 / 10,65 / 30000; 5,5 / 18,3 / 13350; 30 / 33,5 / 550 |
| SANY STC500, 43 m | 33af5290b3a5b71c498561d49d057238.pdf | 12, PDF 7 | 6 × 7,2 m; 360°; 3,5 t; modos I y II separados | 3 / 11,5 / 50000; 10 / 19,38 / 10900 I y 12000 II; 34 / 39 / 400 solo II |
| SANY STC800, 50 m | 59cfc693dd2c4520049372e41102bb1f.pdf | 09, PDF 5 | 8 × 6,43 m; 360°; 15,65 t | 3 / 12,96 / 80000; 28 / 45,56 / 4650; 40 / 50 / 1500 |
| Tadano GT-600EX, TC-4255-2 | doc_tadano_GT-600EX-1-00101_datasheet_metric_GEN_en.pdf | 9; notas 14 | 6,8 m; 4,37 t; 360° exige quinta pata; I y II separados | 3 / 11 / 60000; 10 / 19 / 11600 I y 14700 II; 36 / 39 / 600 solo II |

Las tablas SANY 500/800 y Tadano se extrajeron por columnas del PDF y se cotejaron visualmente. STC300 se transcribió de imagen de la tabla. SANY 800 y Tadano: multiplicación de toneladas por 1000. Sin plumín, sin tablas de estabilizadores parciales ni sobre neumáticos.

La referencia de Tecmaco se basa en su publicación de Tadano GT 600 EX, unidad TAD095 de 2017: https://tecmaco.com.ar/producto/gt-600-ex-3/?from=ventas. No prueba que esa unidad use la ficha EX-04 de octubre 2010. Se muestra como referencia y se exige cotejar con la unidad real.

Los enlaces completos, páginas y revisiones se encuentran en data.js y en Mis equipos de la app. Para STC300 el folleto mezcla texto de sectores en sus prerrequisitos: cotejar el sector autorizado antes de operar. Los pesos de gancho/aparejos se ingresan explícitamente y la capacidad nominal jamás se usa para estimar una celda.

## Medidas intermedias · v3.2

SANY STC250/STC300/STC500: p.12 nota 6 manda usar el siguiente radio/pluma mayor cuando la medida queda entre dos valores. Se exige que las celdas vecinas que delimitan el intervalo estén habilitadas; no se cruza una celda vacía ni se cambia el modo de extensión. Grove RT540E p.14 nota 3: carga menor del siguiente radio/largo mayor. La app conserva el mínimo entre los vecinos válidos como límite adicional conservador.

SANY STC800 de 50 m y Tadano GT-600EX EX-04: los documentos precargados no establecen una regla cotejada para R/L intermedios; continúan exigiendo valores exactos. No se infiere una política del fabricante desde otra variante/modelo.

No se usa promedio lineal, interpolación bilineal ni prolongación de la curva fuera del dominio. El resultado informa coordenadas ingresadas, valores fuente usados, capacidad, criterio y nota de origen.
