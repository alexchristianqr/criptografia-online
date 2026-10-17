# Diseño: entrada a demanda de la permutación

## Enfoque
Añadir a `src/ciphers/permutation.ts` una función pura `parseKey(input, { min, max })` que devuelve `{ ok: true, key } | { ok: false, error }`. La UI mantiene `key` (siempre válida) como fuente de verdad y un `keyText` editable que se sincroniza en ambos sentidos.

## Archivos afectados
| Archivo | Cambio |
|---|---|
| `src/ciphers/permutation.ts` | `parseKey`, constantes `MIN_M = 2`, `MAX_M = 12`, `formatKey` |
| `src/ciphers/permutation.test.ts` | Tests de `parseKey`/`formatKey` |
| `src/features/permutation/PermutationPlayground.vue` | Input de clave, error, slider hasta 12, sincronización |
| `src/features/permutation/PermutationPage.vue` | Práctica con texto y clave editables |
| `src/features/permutation/KeyInput.vue` (nuevo) | Input de clave + validación reutilizable por laboratorio y práctica |

## API
```ts
export type ParseKeyResult = { ok: true; key: PermutationKey } | { ok: false; error: string }
export function parseKey(input: string, limits?: { min: number; max: number }): ParseKeyResult
export const formatKey = (key: PermutationKey): string // base 1, separada por espacios
```

## Decisiones
- **Convención de la clave (CA-9):** la clave indica, para cada posición de la salida, de qué posición de la entrada se toma la letra (`salida[j] = entrada[clave[j]]`). Se descartó la convención anterior (la letra i va a la posición clave[i]), que da el resultado inverso y no coincide con el laboratorio de la universidad.
- **Clave en base 1** en la UI (como ya se muestra), base 0 internamente.
- **Última clave válida se conserva** mientras el texto es inválido, para que el diagrama no parpadee ni se rompa.
- **`m` se deduce de la clave escrita**; el slider reinicia a identidad como hoy.
- **Límite 12**: el diagrama ya tiene scroll horizontal.

## Riesgos
- Diagrama ancho con m = 12 (12 × 52 px): cubierto por el scroll existente.
