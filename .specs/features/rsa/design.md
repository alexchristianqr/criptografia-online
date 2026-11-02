# Diseño: RSA

## Enfoque
Funciones puras con `BigInt` en `src/ciphers/rsa.ts` (sin UI) y hash asíncrono con Web Crypto en `sha256.ts`. UI Vue con estado mínimo y resultados derivados; el hash se calcula en un `watch` con guarda de petición más reciente.

## Archivos afectados
| Archivo | Cambio |
|---|---|
| `src/ciphers/rsa.ts` / `rsa.test.ts` | Primalidad, mcd, inverso modular con pasos, modPow con traza, claves, cifrar/descifrar, firmar/verificar |
| `src/ciphers/sha256.ts` / `sha256.test.ts` | `sha256Hex` |
| `src/features/rsa/RsaPage.vue` | Lección |
| `src/features/rsa/RsaPlayground.vue` | Laboratorio, 4 modos, escena |
| `src/features/rsa/content.ts` | Teoría, práctica, fuentes |
| `src/courses.ts` | Registro `rsa` con `lazy()` |
| `.specs/README.md` | Índice |

## Modelo / tipos / API
```ts
type RsaMode = 'cifrar' | 'descifrar' | 'firmar' | 'verificar'
interface EuclidStep { a: bigint; b: bigint; q: bigint; r: bigint }
interface RsaKeys { p: bigint; q: bigint; n: bigint; phi: bigint; e: bigint; d: bigint; steps: EuclidStep[] }
type RsaKeyResult = { ok: true; keys: RsaKeys } | { ok: false; error: string }
validateRsaParams(p: number, q: number, e: number): RsaKeyResult
modPow(base: bigint, exp: bigint, mod: bigint): { result: bigint; steps: ... }
encryptRsa(text: string, e: bigint, n: bigint): { blocks: {char, m, c}[]; output: bigint[] }
parseRsaCiphertext(input: string, n: bigint): { ok: true; values: bigint[] } | { ok: false; error: string }
decryptRsa(values: bigint[], d: bigint, n: bigint): { ok: true; text: string; ... } | { ok: false; error: string }
signRsa(hashHex: string, d: bigint, n: bigint): bigint
verifyRsa(hashHex: string, s: bigint, e: bigint, n: bigint): boolean
sha256Hex(text: string): Promise<string>
```

## Decisiones y alternativas
- **Decisión:** primos 11–9973 y n > 255. **Por qué:** n debe superar cualquier byte; el rango mantiene cálculos legibles. **Alternativas:** letras A–Z (n pequeño, no soporta tildes/UTF-8).
- **Decisión:** `BigInt`. **Por qué:** exactitud sin dependencias. **Descartado:** `number` (desborda en mᵉ).
- **Decisión:** firmar h mod n. **Por qué:** n es pequeño; es la única forma de mostrar el flujo hash→firma con números manejables. Se declara en la UI.

## Riesgos
- Hash asíncrono: resultados desordenados → id de petición.
- Descifrar con clave errónea produce bytes inválidos: manejar con `TextDecoder({fatal:true})`.
- Confundir seguridad real con la demo: aviso explícito en teoría.
