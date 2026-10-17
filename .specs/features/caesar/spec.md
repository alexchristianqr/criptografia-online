# Spec: Cifrado César

- **Estado:** implementada

## Objetivo
Lección interactiva del cifrado César: definición, teoría, práctica y ejemplo dinámico.

## Implementación
- Algoritmo: `src/ciphers/caesar.ts` (+ `caesar.test.ts`)
- UI: `src/features/caesar/`, rueda interactiva en `src/components/ui/CaesarWheel.vue`

## Criterios de aceptación
- **CA-1:** Cifrar y descifrar con un desplazamiento dado es reversible.
- **CA-2:** El laboratorio muestra pasos numerados y rueda interactiva.

## Ampliación: entrada a demanda
**Incluye:** campo numérico para `k` en el laboratorio; práctica resuelta con texto, `k` y alfabeto editables; botón para restaurar el ejemplo.

- **CA-3:** `k` se puede escribir en un campo numérico. Acepta enteros negativos y mayores o iguales que n; el cálculo usa `k mod n` y se muestra la equivalencia (p. ej. «k = 29 equivale a k = 2»).
- **CA-4:** El campo, el slider y los botones − / + están sincronizados en ambos sentidos; cambiar de alfabeto reduce `k` y actualiza el campo.
- **CA-5:** Si el campo está vacío o no es un entero, se muestra un mensaje y se conserva el último `k` válido.
- **CA-6:** `parseShift` es una función pura con tests.
- **CA-7:** En «Práctica resuelta» el usuario edita texto, `k` y alfabeto; la tabla y el resultado se recalculan. «Restaurar ejemplo» vuelve a `HOLA`, k = 3, español.
- **CA-8:** Ejemplo real: `HELLO` con k = 3 en inglés → `KHOOR`; k = 29 en español equivale a k = 2.

> Retro-especificación: completar `design.md` y `tasks.md` si se modifica la feature.
