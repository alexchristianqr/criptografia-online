export const ALPHABETS = {
  es: { label: 'Español (27 letras)', letters: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ' },
  en: { label: 'Inglés (26 letras)', letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
} as const

export type AlphabetKey = keyof typeof ALPHABETS

export interface CaesarStep {
  from: string
  fromIndex: number
  toIndex: number
  to: string
}

/** Módulo siempre positivo (el % de JS devuelve negativos). */
export const mod = (a: number, n: number): number => ((a % n) + n) % n

/** Índice de la letra en el alfabeto (ignora mayúsculas) o -1 si no pertenece. */
const indexOf = (char: string, alphabet: string): number => {
  const upper = char.toUpperCase()
  return upper.length === 1 ? alphabet.indexOf(upper) : -1
}

export function caesar(text: string, shift: number, alphabet: string): string {
  const n = alphabet.length
  return Array.from(text)
    .map((char) => {
      const i = indexOf(char, alphabet)
      if (i === -1) return char
      const out = alphabet[mod(i + shift, n)]!
      return char === char.toLowerCase() ? out.toLowerCase() : out
    })
    .join('')
}

export const caesarEncrypt = (text: string, shift: number, alphabet: string) =>
  caesar(text, shift, alphabet)

export const caesarDecrypt = (text: string, shift: number, alphabet: string) =>
  caesar(text, -shift, alphabet)

/** Traza letra por letra (solo caracteres del alfabeto) para mostrar el procedimiento. */
export function caesarSteps(text: string, shift: number, alphabet: string): CaesarStep[] {
  const n = alphabet.length
  return Array.from(text).flatMap((char) => {
    const fromIndex = indexOf(char, alphabet)
    if (fromIndex === -1) return []
    const toIndex = mod(fromIndex + shift, n)
    return [{ from: alphabet[fromIndex]!, fromIndex, toIndex, to: alphabet[toIndex]! }]
  })
}
