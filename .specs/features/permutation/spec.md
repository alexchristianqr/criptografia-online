# Spec: Cifrado por permutación

- **Estado:** implementada (incluye ampliación "entrada a demanda")
- **Fecha:** 2026-10-17

## Objetivo
Lección interactiva del cifrado por permutación, con laboratorio donde el usuario pueda ingresar sus propios valores para hacer pruebas.

## Implementación
- Algoritmo: `src/ciphers/permutation.ts` (+ `permutation.test.ts`)
- UI: `src/features/permutation/`

## Alcance de la ampliación: entrada a demanda
**Incluye:**
- Campo de texto para escribir la clave (laboratorio), sincronizado con las casillas, el botón aleatoria y el slider de `m`.
- `m` entre 2 y 12.
- "Práctica resuelta" con texto y clave editables y paso a paso recalculado.

**No incluye:** guardar/compartir pruebas, importar archivos, claves con letras.

## Criterios de aceptación
- **CA-1:** Cifrar y descifrar con una misma permutación es reversible.
- **CA-2:** El usuario puede escribir la clave como números separados por espacios o comas (`3 1 4 2`, `3,1,4,2`), base 1.
- **CA-3:** Si la clave escrita es una permutación válida de 1…m (2 ≤ m ≤ 12), `m`, las casillas y el diagrama se actualizan al instante.
- **CA-4:** Si no es válida (repetidos, fuera de rango, vacía, no numérica, m fuera de rango), se muestra un mensaje que dice por qué y se conserva la última clave válida para el cálculo.
- **CA-5:** Cambiar la clave por casillas, aleatoria, invertir, reiniciar o slider actualiza el campo de texto.
- **CA-6:** El slider de `m` llega a 12.
- **CA-7:** En "Práctica resuelta" el usuario edita texto y clave; la tabla, los pasos y el resultado se recalculan, con la misma validación (CA-2 a CA-4).
- **CA-8:** El análisis de la clave (parseo/validación) es una función pura con tests.

- **CA-9:** Convención de la clave (la del laboratorio de la universidad): al cifrar, la posición j del bloque cifrado toma la letra que está en la posición `clave[j]` del bloque original. Ejemplo: `MANOS` con clave `2 4 5 3 1` → `AOSNM`. Al descifrar se usa la clave inversa (`AOSNM` → `MANOS`).

- **CA-10:** Un botón «Cargar ejemplo» (laboratorio y práctica) restaura el ejemplo real de la universidad: `MANOS`, clave `2 4 5 3 1`, modo cifrar → `AOSNM`.

## Preguntas abiertas
- Ninguna.
