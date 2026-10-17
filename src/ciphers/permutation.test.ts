import { describe, expect, it } from 'vitest'
import { identity, inverse, isValidKey, normalize, permutationDecrypt, permutationEncrypt } from './permutation'

const key = [2, 0, 3, 1] // 3 1 4 2

describe('permutation', () => {
  it('cifra por bloques', () => expect(permutationEncrypt('ABCD', key)).toBe('BDAC'))
  it('ida y vuelta', () => {
    const c = permutationEncrypt('ATACARALALBA', key)
    expect(permutationDecrypt(c, key)).toBe('ATACARALALBA')
  })
  it('completa con X', () => expect(normalize('hola mundo', 4)).toBe('HOLAMUNDOXXX'.slice(0, 12)))
  it('la identidad no cambia nada', () => expect(permutationEncrypt('HOLA', identity(4))).toBe('HOLA'))
  it('inversa', () => expect(inverse(key)).toEqual([1, 3, 0, 2]))
  it('valida claves', () => {
    expect(isValidKey(key)).toBe(true)
    expect(isValidKey([0, 0, 1])).toBe(false)
    expect(isValidKey([0, 3])).toBe(false)
  })
})
