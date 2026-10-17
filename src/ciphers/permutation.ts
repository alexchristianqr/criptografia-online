/** Clave de permutación (base 0): la letra en la posición i del bloque pasa a la posición key[i]. */
export type PermutationKey = number[]

export const PAD = 'X'

export const identity = (m: number): PermutationKey => Array.from({ length: m }, (_, i) => i)

export function isValidKey(key: PermutationKey): boolean {
  const m = key.length
  return m > 0 && new Set(key).size === m && key.every((k) => Number.isInteger(k) && k >= 0 && k < m)
}

/** Permutación inversa: deshace lo que hace `key`. */
export function inverse(key: PermutationKey): PermutationKey {
  const inv = new Array<number>(key.length)
  key.forEach((to, from) => (inv[to] = from))
  return inv
}

/** Deja solo letras (A-Z, Ñ) en mayúsculas y completa con X hasta un múltiplo de m. */
export function normalize(text: string, m: number): string {
  const letters = Array.from(text.toUpperCase()).filter((c) => /^[A-ZÑ]$/.test(c))
  while (letters.length % m !== 0) letters.push(PAD)
  return letters.join('')
}

export interface PermutationBlock {
  input: string[]
  output: string[]
}

/** Aplica la permutación bloque a bloque conservando el detalle de cada bloque. */
export function permuteBlocks(text: string, key: PermutationKey): PermutationBlock[] {
  const m = key.length
  const letters = Array.from(normalize(text, m))
  const blocks: PermutationBlock[] = []
  for (let b = 0; b < letters.length; b += m) {
    const input = letters.slice(b, b + m)
    const output = new Array<string>(m)
    key.forEach((to, from) => (output[to] = input[from]!))
    blocks.push({ input, output })
  }
  return blocks
}

export const permutationEncrypt = (text: string, key: PermutationKey) =>
  permuteBlocks(text, key).map((b) => b.output.join('')).join('')

export const permutationDecrypt = (text: string, key: PermutationKey) =>
  permutationEncrypt(text, inverse(key))
