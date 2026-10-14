# IzajeLab 4.4.0: criterio conservador del proyecto

El usuario eligió expresamente aplicar un criterio conservador a las tres grúas y a sus 27 configuraciones. Esta regla es del proyecto y no certifica autorización del fabricante para medidas intermedias. Se conservan las fuentes PDF y las políticas anteriores en los campos originalRadiusPolicy, originalBoomPolicy y originalIntermediateSource.

Para una medida exacta se usa su celda, y una celda exacta vacía no se salta. Para radio o longitud intermedios se exige que exista capacidad en la referencia de radio y longitud superiores. Se compara esa capacidad con las restantes celdas vecinas disponibles de la misma configuración y se usa la menor. No se promedian capacidades, no se extrapola, no se mezclan patrones, estabilizadores, sectores, contrapesos o montajes H/HJ. Las celdas vecinas vacías no se inventan; si la referencia superior requerida está vacía se bloquea la verificación.

El radio y la longitud reales se conservan para la geometría y los croquis. Los límites mínimos de ángulo consideran ambas longitudes de referencia. Los resultados y el informe identifican el criterio del proyecto y la celda que gobierna la capacidad.

## Ejemplos

| Modelo/configuración | Medida real | Referencia y capacidad aplicada |
|---|---|---|
| SRC900C, estabilizadores 100%, T1 0%, 9,5 tn de contrapeso | R15/L33,95 m | R16/L33,95 m: 6,7 tn brutas |
| SRC900C, estabilizadores 100%, T1 100% | R22,5/L47 m | R24/L47 m: 4,2 tn brutas |
| SRC1300T, full-100-100-100 | R10,5/L60 m | R11/L60 m: 10,5 tn; R10 exacto sigue vacío y bloqueado |
| SCC4500A HJ | R8,5/L48 m | R8: 226 tn, menor que las 228 tn de R9 |
| SCC4500A HJ | R31/L96 m | R32/L96 m: 55,7 tn brutas |

El límite de utilización sigue siendo 75% o menor, calculado sobre la capacidad disponible después de deducciones. Se suman carga, gancho, eslingas/aparejos, otros suspendidos y accesorios bajo eslingas. APTO sigue siendo un chequeo numérico preliminar y requiere ambas posiciones, geometría y lingado compatibles.

## Validación

284 pruebas aprobadas. Los 50 ejemplos con cuentas independientes Decimal coinciden con el motor y recorren también el formulario con carga/capacidad en toneladas y accesorios en kg. Hay 46 ejemplos numéricos y 4 sin capacidad verificable. Los casos 16 y 50 cambiaron debido a la regla elegida, no por modificación de las tablas PDF. Se cotejaron las 2267 capacidades exactas, cada punto medio entre radios consecutivos y los casos de aumento local de capacidad, vacíos, extrapolación y límites de ángulo.

Comandos: `npm test`, `npm run check`, `node tools/compare-manual-50.mjs`.

## Interfaz

Carga y capacidades de eslingas inician en toneladas. Gancho, peso propio de eslingas/aparejos, otros suspendidos, accesorios bajo eslingas y deducciones inician en kg; todos permiten seleccionar toneladas o kg. El peso propio de eslingas sigue vacío, equivalente a cero. Primero aparece “Ingresá capacidad de la eslinga” (o capacidad certificada para cable de acero) y después el peso propio. La selección dice “Elegir configuración de eslingado”. Los análisis anteriores conservan las unidades que guardaron; si faltan los nuevos campos de unidad se interpretan como kg y se recalculan con el catálogo actual.
