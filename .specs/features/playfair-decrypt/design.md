# Diseño: Playfair Descifrado

## Enfoque
Funciones puras TypeScript generan matriz, resultado y traza en una sola operación; Vue deriva toda la presentación con computed y mantiene únicamente entrada, clave, selección y estado del portapapeles. Sin dependencias nuevas ni backend.

## Investigación y decisiones
- Los apuntes de [University of Central Florida](https://www.cs.ucf.edu/~dmarino/ucf/cis3362/lectures/newlecs/Playfair.pdf) describen cuadrícula con I/J, palabra clave sin duplicados, reglas inversas y pares válidos. Es la referencia de las reglas del módulo.
- La misma referencia ilustra relleno con Q y alternativa X: el relleno depende de una convención previa. Decisión del producto: conservarlo al descifrar y explicarlo; el ejemplo usa X. Quitar X o Q automáticamente podría borrar letras auténticas.
- La normalización de tildes y Ñ es una decisión de esta interfaz, visible antes de calcular; el cuadrado clásico no admite un alfabeto español de 27 letras.
- Se usa representación HTML de la matriz y resaltados con leyenda textual. Se descarta una imagen estática porque no permite inspeccionar cualquier par introducido.
- El módulo solo descifra; no se agrega un modo de cifrado ajeno al alcance pedido.

## Archivos afectados
| Archivo | Cambio |
|---|---|
| `src/ciphers/playfair.ts` | Normalización, matriz, validación y descifrado con traza |
| `src/ciphers/playfair.test.ts` | Casos derivados de CA-2 a CA-7 |
| `src/features/playfair/PlayfairPage.vue` | Laboratorio y material de apoyo |
| `src/features/playfair/PlayfairPlayground.vue` | Controles, resultado, pares y matriz |
| `src/features/playfair/content.ts` | Definición, reglas, ejemplo y fuentes |
| `src/courses.ts` | Registro de playfair-descifrado con carga diferida |

## Modelo / tipos / API
```ts
interface Position { row: number; column: number }
interface PlayfairStep {
  input: string; output: string
  rule: 'fila' | 'columna' | 'rectangulo'
  from: [Position, Position]; to: [Position, Position]
}
type PlayfairResult =
  | { ok: true; normalized: string; square: string[][]; output: string; steps: PlayfairStep[] }
  | { ok: false; error: string }
// normalizePlayfair(text: string): string
// createPlayfairSquare(keyword: string): string[][] (valida clave)
// decryptPlayfair(text: string, keyword: string): PlayfairResult
```
La API pública devuelve errores de dominio en la unión discriminada; ninguna excepción llega a la UI. La cuadrícula pública valida la clave y documenta su error; el descifrador lo traduce al resultado de dominio.

## Riesgos
- I/J, tildes y relleno impiden prometer reversibilidad del texto original; mostrar texto preparado y explicación permanente.
- Los pares iguales se rechazan después de normalizar (incluyendo IJ → II).
- Limitar la visualización mediante desplazamiento o paginación si hay muchos pares; la traza debe seguir siendo consultable completa.

## Integración final
- Estilos de laboratorio compartidos en `src/style.css` y copia de resultado con manejo de fallos en `src/composables/useCopyResult.ts`.
- Se preserva la ampliación de práctica editable incorporada durante el desarrollo: sus cálculos usan la misma API pura que el laboratorio.
- Las tablas usan el índice de bloque como clave para admitir dígrafos o bloques repetidos.
