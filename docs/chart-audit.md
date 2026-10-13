# Auditoría del catálogo · 13/10/2026

Origen exclusivo: los tres PDF adjuntos del proyecto. La extracción utiliza coordenadas de palabras y celdas, no desplazamiento de valores en filas de texto. Se revisaron visualmente todas las páginas de tablas incluidas. `source-chart-columns.json` conserva las columnas independientes, patrones, páginas impresas/PDF, enhebrado, mínimos de ángulo y capacidades en tn.

| Documento | SHA-256 | Páginas PDF incluidas | Columnas | Capacidades no vacías |
|---|---|---|---:|---:|
| SRC 900C.pdf | 978567683a5bd929e8d4aa83c755a2dcb20108ddf0e39e853e422248123cb4c4 | 6, 7, 8 (dos páginas impresas por página PDF) | 63 | 846 |
| SRC1300T.pdf | 223e41d8b711bf26fdac1da3c657ffe3b166eece5fd2214df3ca5e0c341c48e5 | 25, 26, 27, 28, 29 | 58 | 999 |
| SCC 4500A (1).pdf | bac47105c20a680f0884d017c07690ed2fd620b4f8002ff26b9472b636080283 | 37 (H), 46 (HJ) | 20 | 422 |

Cada columna original se usa exactamente una vez. La agrupación de SRC900C fija TELE1 en 0, 50 o 100%; T2–4 y modo I/II se conservan por longitud. La de SRC1300T al 100% fija secciones 2#/3#/4#; 5#/6# permanecen expresas por longitud. No se promedian ni se seleccionan máximos entre patrones distintos con igual longitud. En SRC900C la columna 13 de una página PDF es la primera de su mitad derecha; la página impresa también se conserva.

## Controles visuales

- SRC900C p.PDF6: R3/L12,2 = 80 tn; R3/L16,55 con TELE1 0% = 28 tn y con TELE1 50% = 51 tn. P.PDF8: R6/L12,2 = 12,8 tn. En esa misma página L47 tiene mínimo 58°; los mínimos entre paréntesis se conservan por columna.
- SRC1300T p.25: R2,5/L13 = 130 tn; las tres columnas L17,3 dan 36/65/65 tn. P.28: R2,5/L13 = 90 tn con estabilizadores 50%. P.29: R6/L13 = 24 tn con vigas retraídas. P.29 nota 4 autoriza siguiente mayor en radio y pluma.
- SCC H p.37: R6/L24 = 450 tn, R10/L48 = 259 tn, R72/L84 = 10 tn. HJ p.46: R8/L48 = 226 tn. No se usan valores de HDB/HJDB como si fueran H/HJ.

## Parámetros y exclusiones

SRC900C pp.PDF3–4: masa 55 tn, CW9,5 tn, ángulo -2° a78°, gancho90tn795kg. El rango de entrada de la app conserva θ no negativo. Pictogramas: 100%7,52×7,4m; 50%7,52×5,25m; 0%7,52×3,1m.

SRC1300T pp.19–22: masa75,8tn, CW23tn, estabilizadores8,25×8,2m, ángulo -2° a80°. Gancho120tn1130kg, 90tn830kg, 55tn595kg, 8tn180kg. No se incorporan pp.33–34 por incongruencia de la unidad impresa; tampoco p.32 pick&carry ni p.31 plumín.

SCC p.10: ángulo principal30°–85°, contrapeso trasero180tn y carbody50tn en H/HJ. P.6 gancho450tn10,9tn. P.5 más de225tn requiere doble cabrestante. H78/84m y HJ largos exigen cables de suspensión y montaje conforme pp.35/44. No se infiere masa operativa de la capacidad nominal. No se incorporan FJ, LJ ni superlift porque requieren geometría y condiciones que este motor no representa.

El código valida las 2267 celdas convertidas contra el registro de columnas, unicidad de fuente/patrón, puntos de control y límites. Los cálculos se mantienen preliminares y deben cotejarse con el manual operativo de la unidad.
