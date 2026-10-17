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

> Retro-especificación: completar `design.md` y `tasks.md` si se modifica la feature.
