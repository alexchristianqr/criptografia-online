# Spec: Hill

- **Estado:** implementada
- **Fecha:** 2026-10-17

## Objetivo
Enseñar cifrado y descifrado Hill mediante bloques, operaciones matriciales y aritmética modular, con un laboratorio del estilo de los módulos existentes.

## Alcance
**Incluye:** matrices editables 2 × 2 y 3 × 3, modos cifrar/descifrar, validación matemática de clave, determinante e inversa modular, alfabeto A–Z, bloques seleccionables, cálculo explicado, copiar, reiniciar, pasar resultado a entrada, definición, teoría, práctica resuelta y fuentes.
**No incluye:** matrices mayores, módulos distintos de 26, criptoanálisis automático ni recuperación del formato original.

## Historias de usuario
- Como estudiante, quiero editar una matriz y observar cómo convierte bloques de letras en números y nuevas letras.
- Como estudiante, quiero entender por qué algunas matrices no sirven como claves y cómo funciona la inversa al descifrar.
- Como estudiante, quiero recorrer cada bloque y comprobar sus multiplicaciones y residuos.

## Criterios de aceptación
- **CA-1:** El catálogo ofrece «Hill» en `#hill`, con carga diferida y navegación existente.
- **CA-2:** La entrada se convierte a mayúsculas y sin diacríticos (Ñ → N); se conservan solo A–Z y se muestra el texto normalizado. Correspondencia explícita A=0, …, Z=25; J se conserva.
- **CA-3:** La clave debe ser una matriz cuadrada de tamaño 2 o 3 con enteros entre 0 y 25. Campos vacíos, fraccionarios, no finitos o fuera del rango generan error visible, sin salida ni traza obsoleta; el algoritmo puro también valida la clave.
- **CA-4:** Se muestran det(K), su residuo módulo 26 y mcd(det(K),26). Solo se permite operar si el mcd es 1. Una matriz singular o con determinante no coprimo bloquea ambos modos con explicación; no basta comprobar det(K) ≠ 0.
- **CA-5:** Se usan vectores columna: C = K·P mod 26 y P = K⁻¹·C mod 26. Los residuos siempre están entre 0 y 25, incluso con determinante/cofactores negativos. La inversa se calcula mediante adjunta e inverso modular del determinante.
- **CA-6:** Al cifrar, se completa únicamente el último bloque con X, mostrando cuántas se añadieron. Al descifrar se exige longitud múltiplo del tamaño y no se agrega ni elimina relleno. Entrada vacía y clave válida producen salida vacía.
- **CA-7:** Matriz inicial [[3,3],[2,5]]: HELP → HIAT y HIAT → HELP. En 3 × 3, [[6,24,1],[13,16,10],[20,17,15]]: ACT → POH y POH → ACT. Cambiar tamaño carga su ejemplo válido y reinicia selección.
- **CA-8:** Un bloque seleccionado muestra letras, valores numéricos, matriz efectiva y productos/sumas/residuos de cada fila hasta las letras finales. Al descifrar se distinguen clave original e inversa. Selección con teclado y clic que se ajusta a cambios de entrada.
- **CA-9:** Cambiar modo recalcula; pasar resultado a entrada alterna modo conservando la clave y se habilita solo con salida válida no vacía. Copiar comunica éxito/fallo. Reiniciar restaura el ejemplo del tamaño actual.
- **CA-10:** Laboratorio primero y material de apoyo en Collapsible: definición, teoría, práctica resuelta y fuentes. Tarjetas, encabezado con gradiente, pasos numerados, entrada azul y salida verde, tema claro/oscuro, diseño móvil y controles etiquetados coherentes con César y Permutación. Los errores se comunican de forma accesible.

## Preguntas abiertas
Ninguna bloqueante. Se proponen tamaños 2 y 3 por su utilidad educativa y legibilidad.

## Ampliación: entrada a demanda en la práctica
- **CA-11:** La «Práctica resuelta» tiene texto y clave editables. La clave se escribe como números 0–25 por filas, separados por espacios o comas (4 números = 2×2, 9 = 3×3), validada por la función pura `parseHillKey`. Se recalculan det(K), mcd, bloques y resultado; con clave inválida o no invertible se muestra el error y ninguna tabla obsoleta. «Restaurar ejemplo» vuelve a `HELP` con `3 3 2 5`.
- **CA-12:** `parseHillKey` tiene tests: válidos 2×2 y 3×3, cantidad incorrecta, no numéricos, fuera de 0–25.
