import { describe, expect, it } from 'vitest'
import { ALPHABETS, caesarDecrypt, caesarEncrypt, parseShift } from './caesar'

const es = ALPHABETS.es.letters
const en = ALPHABETS.en.letters

describe('caesar', () => {
  it('cifra HOLA con k=3', () => expect(caesarEncrypt('HOLA', 3, es)).toBe('KRÑD'))
  it('cifra HELLO con k=3 (en)', () => expect(caesarEncrypt('HELLO', 3, en)).toBe('KHOOR'))
  it('descifra', () => expect(caesarDecrypt('KHOOR', 3, en)).toBe('HELLO'))
  it('ida y vuelta', () => {
    const t = 'Ataque al amanecer, ¡Ñandú!'
    expect(caesarDecrypt(caesarEncrypt(t, 11, es), 11, es)).toBe(t)
  })
  it('da la vuelta al final', () => expect(caesarEncrypt('XYZ', 3, en)).toBe('ABC'))
  it('maneja Ñ en español', () => expect(caesarEncrypt('N', 1, es)).toBe('Ñ'))
  it('conserva minúsculas y signos', () => expect(caesarEncrypt('Hola, mundo!', 3, en)).toBe('Krod, pxqgr!'))
  it('k negativo y mayor que n', () => {
    expect(caesarEncrypt('A', -1, en)).toBe('Z')
    expect(caesarEncrypt('A', 29, en)).toBe('D')
  })
})

describe('parseShift', () => {
  it('acepta enteros, negativos y mayores que n', () => {
    expect(parseShift('3')).toEqual({ ok: true, value: 3 })
    expect(parseShift(' -5 ')).toEqual({ ok: true, value: -5 })
    expect(parseShift('29')).toEqual({ ok: true, value: 29 })
  })
  it('rechaza vacío, decimales y texto', () => {
    expect(parseShift('').ok).toBe(false)
    expect(parseShift('2.5').ok).toBe(false)
    expect(parseShift('abc').ok).toBe(false)
  })
  it('k = 29 en español equivale a k = 2', () => {
    expect(caesarEncrypt('HOLA', 29, es)).toBe(caesarEncrypt('HOLA', 2, es))
  })
})
