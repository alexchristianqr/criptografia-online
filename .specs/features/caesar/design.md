# Diseño: entrada a demanda del César

## Enfoque
`parseShift(input)` puro en `src/ciphers/caesar.ts`. `useCaesar` guarda `kText` (lo que se escribe) y `shift` (reducido mod n); el campo numérico, el slider y los botones se mantienen sincronizados. La práctica usa sus propios refs con `parseShift`.

## Archivos afectados
| Archivo | Cambio |
|---|---|
| `src/ciphers/caesar.ts` / `.test.ts` | `parseShift` y tests |
| `src/features/caesar/useCaesar.ts` | `kText`, `typeShift`, `kNote` |
| `src/features/caesar/CaesarPlayground.vue` | Campo numérico de k y nota de equivalencia |
| `src/features/caesar/CaesarPractice.vue` | Texto, k y alfabeto editables; restaurar ejemplo |

## Decisiones
- **Reducción mod n al calcular** (no al escribir) para no alterar lo que el usuario teclea.
- **Último k válido** se conserva ante entrada inválida.
