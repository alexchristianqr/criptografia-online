# Diseño: Hill

## Enfoque
Algoritmo puro sobre matrices pequeñas de enteros y traza por bloque. UI Vue con estado mínimo y resultados derivados. Reutilizar Collapsible y los tokens Tailwind existentes, sin nuevas dependencias.

## Investigación y decisiones
- [University of Rhode Island](https://www.cs.uri.edu/cryptography/classical-ciphers/hill/article.html) describe bloques, clave invertible módulo 26 y descifrado mediante su inversa.
- [Emory University](https://math.oxford.emory.edu/site/math125/hillCipher/) desarrolla aritmética modular e inverso multiplicativo del determinante. Se adopta esa explicación para enseñar por qué una matriz real invertible puede fallar módulo 26.
- [Stony Brook University](https://www.math.stonybrook.edu/~scott/papers/MSTP/crypto/8Hill_Cipher.html) presenta bloques como vectores y multiplicación matricial. Se fija convención de vectores columna para evitar resultados transpuestos entre explicaciones y laboratorio.
- Elecciones de producto: módulo 26, A=0, normalización explícita de Ñ/tildes, relleno X solo al cifrar y conservación al descifrar. No se promete recuperar espacios ni distinguir X originales del relleno.
- Inversa por adjunta para 2 × 2 y 3 × 3. Se descarta Gauss-Jordan ingenuo módulo 26: no todo pivote no nulo tiene inverso en este anillo.
- Tamaños pequeños y entradas 0–25 mantienen cálculos exactos con number; la API también valida dimensiones y números.

## Archivos afectados
| Archivo | Cambio |
|---|---|
| `src/ciphers/hill.ts` | Validación, determinante, inversa modular, cifrado y descifrado con traza |
| `src/ciphers/hill.test.ts` | Vectores conocidos, inversas, errores y bloques |
| `src/features/hill/HillPage.vue` | Lección y práctica |
| `src/features/hill/HillPlayground.vue` | Editor de matriz, modos y cálculo por bloque |
| `src/features/hill/content.ts` | Teoría, ejemplos y fuentes |
| `src/courses.ts` | Registro de hill con carga diferida |

## Modelo / tipos / API
```ts
type HillMatrix = number[][]
type HillMode = 'cifrar' | 'descifrar'
interface HillBlock {
  input: string; inputValues: number[]
  sums: number[]; outputValues: number[]; output: string
}
interface HillKeyAnalysis {
  determinant: number; determinantMod: number; gcd: number
  inverse: HillMatrix | null
}
type HillResult =
  | { ok: true; normalized: string; prepared: string; padding: number;
      analysis: HillKeyAnalysis; effectiveKey: HillMatrix;
      blocks: HillBlock[]; output: string }
  | { ok: false; error: string; analysis?: HillKeyAnalysis }
// normalizeHill(text: string): string
// analyzeHillKey(key: HillMatrix): HillKeyAnalysis (valida forma y valores)
// transformHill(text: string, key: HillMatrix, mode: HillMode): HillResult
```
El editor preserva campos vacíos como datos inválidos; no los convierte silenciosamente a cero. El cálculo público traduce errores de validación a la unión de resultado. La traza contiene sumas y residuos; los productos se muestran usando la matriz efectiva y el vector de entrada.

## Riesgos
- Un determinante distinto de cero no garantiza inversa módulo 26: caso inválido [[2,0],[0,1]] debe explicarse.
- La adjunta transpone cofactores: verificar K·K⁻¹ e inversa·K contra identidad en ambos tamaños.
- Cambiar matriz, modo o texto invalida selección y mensajes de copia previos; derivar resultado completo y ajustar selección.
- Mantener editor y tablas legibles en móvil con desplazamiento horizontal local si hace falta.

## Integración final
- Estilos de laboratorio compartidos en `src/style.css` y copia de resultado con manejo de fallos en `src/composables/useCopyResult.ts`.
- Se preserva la ampliación de práctica editable incorporada durante el desarrollo: sus cálculos usan la misma API pura que el laboratorio.
- Las tablas usan el índice de bloque como clave para admitir dígrafos o bloques repetidos.
- `parseHillKey(input)` interpreta claves 2 × 2 y 3 × 3 por filas para la práctica editable; la clave se valida antes de calcular.
