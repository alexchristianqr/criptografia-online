# Spec: Transposición por Series

- **Estado:** implementada
- **Fecha:** 2026-10-17

## Objetivo
Añadir una lección que enseñe a reordenar un mensaje completo mediante series de posiciones, con laboratorio interactivo y práctica editable coherentes con el curso.

## Alcance
**Incluye:** cifrar y descifrar, texto propio, clave como lista ordenada de reglas, visualización de posiciones y submensajes, selección de series y letras, normalización explícita, copiar, intercambiar entrada/salida, restaurar ejemplo, definición, teoría, práctica editable y fuentes.
Reglas disponibles: primos, pares, impares, múltiplos de k y posiciones explícitas. Una serie final automática recoge las posiciones restantes.
**No incluye:** fórmulas ejecutables, criptoanálisis, transposición por columnas, relleno ni agrupación periódica por bloques.

## Historias de usuario
- Como estudiante, quiero definir qué posiciones se leen primero para reproducir un ejercicio de clase.
- Como estudiante, quiero ver qué letras aporta cada serie y por qué una posición repetida no se transmite dos veces.
- Como estudiante, quiero descifrar reconstruyendo las posiciones originales y comprobar el procedimiento con mis datos.

## Criterios de aceptación
- **CA-1:** El catálogo ofrece «Transposición por Series» después de Permutación, con carga diferida en `#/transposicion-series`; se admite también el hash sin barra mediante el router actual.
- **CA-2:** Se trabaja con posiciones desde 1 del mensaje completo normalizado. Se convierte a mayúsculas, ÁÉÍÓÚÜ → AEIOUU y se conserva Ñ (incluyendo entrada Unicode descompuesta). Solo se conservan A–Z y Ñ; se muestra el texto normalizado y se explica la pérdida del formato original.
- **CA-3:** La clave contiene entre 1 y 8 reglas editables y ordenables con botones subir/bajar, añadir y eliminar. Se admite la regla «Primos (incluye 1 · curso)» (1, 2, 3, 5, …), siguiendo la convención solicitada por el usuario para su universidad; la UI aclara que matemáticamente 1 no es primo. También se admiten pares, impares, múltiplos de un entero seguro k ≥ 2 y listas de posiciones explícitas. Las reglas matemáticas se leen en orden ascendente; las listas explícitas respetan el orden escrito.
- **CA-4:** Las posiciones explícitas se introducen en base 1, separadas por espacios o comas. Se rechazan listas vacías, duplicados dentro de una lista, valores no enteros, no seguros, menores que 1 o mayores que la longitud normalizada. Los errores identifican regla y causa; la API pura también valida la clave.
- **CA-5:** Las reglas se evalúan sobre los índices originales, sin renumerarlos. Cada posición pertenece a la primera regla que la seleccione. Los solapamientos entre reglas se omiten con explicación y se muestran en la traza. Las posiciones no seleccionadas se incorporan automáticamente al grupo final «Restantes», en orden ascendente. Cada índice aparece exactamente una vez en el recorrido final.
- **CA-6:** Al cifrar, C[j] = P[recorrido[j] − 1]. Se concatenan los submensajes según el orden de reglas y finalmente los restantes. Se conserva la longitud normalizada y todas las letras, sin relleno. Una serie sin posiciones efectivas es válida y se muestra como vacía.
- **CA-7:** Al descifrar, se calcula el recorrido para la longitud del criptograma y se reconstruye P[recorrido[j] − 1] = C[j]. Se muestran el tamaño de cada submensaje, sus segmentos del criptograma y las posiciones donde se colocan. Con la misma clave se recupera exactamente el texto normalizado.
- **CA-8:** Ejemplo inicial y de restauración: ERRAR ES HUMANO PERDONAR DIVINO, clave primos (incluye 1 · curso) → pares → restantes, resultado ERRRSAODNIAEHMNPROADVNUERIO (agrupado: ERRRS AODNI AEHMN PROAD VNUER IO). Grupos: posiciones [1,2,3,5,7,11,13,17,19,23], [4,6,8,10,12,14,16,18,20,22,24,26] y [9,15,21,25,27]. Se explica por qué el 1 pertenece al primer grupo por convención del curso y el 2 se omite de pares.
- **CA-9:** La traza muestra por grupo regla, posiciones candidatas, solapamientos omitidos, posiciones efectivas, letras y rango ocupado en el criptograma. Seleccionar una serie o una letra resalta su correspondencia entrada/salida mediante color y explicación textual, con botones accesibles por teclado. La selección se ajusta al cambiar los datos.
- **CA-10:** Entrada vacía con una clave matemática válida produce salida vacía y grupos vacíos. Una lista explícita que no cabe en el mensaje genera el error de CA-4. Texto de una letra y grupos vacíos funcionan sin excepciones. Una clave inválida conserva internamente la última configuración y resultado válidos, pero no presenta su traza como actual: cualquier resultado conservado se rotula «Último resultado válido; no corresponde a los datos actuales». Copiar e intercambiar se deshabilitan mientras haya errores.
- **CA-11:** Laboratorio y práctica resuelta permiten editar texto y clave usando el mismo editor y la misma API, con controles independientes. Ambos ofrecen restaurar ejemplo. El laboratorio permite copiar resultado con confirmación de éxito/fallo y pasar el resultado a la entrada alternando el modo sin modificar la clave.
- **CA-12:** Laboratorio primero y material de apoyo con Collapsible: definición, teoría, práctica y fuentes. Mantener tarjetas, pasos numerados, entrada azul, salida verde, tema claro/oscuro y diseño adaptable. Tablas o secuencias extensas tienen desplazamiento local. Controles etiquetados y errores accesibles; la selección no depende de hover ni únicamente del color.
- **CA-13:** La explicación indica que las letras y sus frecuencias se conservan y que el algoritmo es educativo. Expone que el recorrido depende de la longitud completa del mensaje; no promete seguridad actual ni restaurar espacios o signos eliminados.

## Preguntas abiertas
Ninguna. El usuario solicitó explícitamente incluir 1 en la regla de primos según su profesor. Esta instrucción aprueba el ajuste de CA-3 y CA-8. Las listas explícitas permiten reproducir ejercicios con otras convenciones.
