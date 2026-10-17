import { describe, expect, it } from 'vitest';
import {
  MAX_M,
  formatKey,
  identity,
  inverse,
  isValidKey,
  normalize,
  parseKey,
  permutationDecrypt,
  permutationEncrypt,
} from './permutation';

const key = [2, 0, 3, 1]; // 3 1 4 2

describe('permutation', () => {
  it('cifra por bloques', () =>
    expect(permutationEncrypt('ABCD', key)).toBe('CADB'));
  it('ida y vuelta', () => {
    const c = permutationEncrypt('ATACARALALBA', key);
    expect(permutationDecrypt(c, key)).toBe('ATACARALALBA');
  });
  it('completa con X', () =>
    expect(normalize('hola mundo', 4)).toBe('HOLAMUNDOXXX'.slice(0, 12)));
  it('la identidad no cambia nada', () =>
    expect(permutationEncrypt('HOLA', identity(4))).toBe('HOLA'));
  it('inversa', () => expect(inverse(key)).toEqual([1, 3, 0, 2]));
  it('valida claves', () => {
    expect(isValidKey(key)).toBe(true);
    expect(isValidKey([0, 0, 1])).toBe(false);
    expect(isValidKey([0, 3])).toBe(false);
  });
});

describe('convención del laboratorio de la universidad', () => {
  const k = [1, 3, 4, 2, 0] // 2 4 5 3 1
  it('MANOS con clave 2 4 5 3 1 da AOSNM', () => expect(permutationEncrypt('MANOS', k)).toBe('AOSNM'))
  it('AOSNM se descifra a MANOS', () => expect(permutationDecrypt('AOSNM', k)).toBe('MANOS'))
})

describe('parseKey', () => {
  it('acepta espacios y comas (base 1)', () => {
    expect(parseKey('3 1 4 2')).toEqual({ ok: true, key });
    expect(parseKey(' 3,1, 4 ;2 ')).toEqual({ ok: true, key });
  });
  it('formatKey es la inversa de parseKey', () =>
    expect(formatKey(key)).toBe('3 1 4 2'));
  it('rechaza vacío', () => expect(parseKey('  ').ok).toBe(false));
  it('rechaza no numéricos', () =>
    expect(parseKey('1 a 3')).toMatchObject({
      ok: false,
      error: expect.stringContaining('«a»'),
    }));
  it('rechaza repetidos', () =>
    expect(parseKey('1 2 2')).toMatchObject({
      ok: false,
      error: expect.stringContaining('repetido'),
    }));
  it('rechaza fuera de rango', () => {
    expect(parseKey('1 2 5')).toMatchObject({
      ok: false,
      error: expect.stringContaining('fuera de rango'),
    });
    expect(parseKey('0 1 2').ok).toBe(false);
  });
  it('respeta los límites de m', () => {
    expect(parseKey('1').ok).toBe(false);
    expect(
      parseKey(Array.from({ length: MAX_M }, (_, i) => i + 1).join(' ')).ok,
    ).toBe(true);
    expect(
      parseKey(Array.from({ length: MAX_M + 1 }, (_, i) => i + 1).join(' ')).ok,
    ).toBe(false);
  });
});
