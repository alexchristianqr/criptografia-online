import { describe, expect, it } from 'vitest';
import {
  analyzeHillKey,
  normalizeHill,
  parseHillKey,
  transformHill,
  type HillMatrix,
  type HillMode,
} from './hill';
const key2 = [
  [3, 3],
  [2, 5],
];
const key3 = [
  [6, 24, 1],
  [13, 16, 10],
  [20, 17, 15],
];
const mod = (n: number) => ((n % 26) + 26) % 26;
function valid(text: string, key = key2, mode: HillMode = 'cifrar') {
  const result = transformHill(text, key, mode);
  if (!result.ok) throw new Error(result.error);
  return result;
}
function multiply(a: HillMatrix, b: HillMatrix) {
  return a.map((row) =>
    b[0].map((_, c) =>
      mod(row.reduce((sum, value, i) => sum + value * b[i][c], 0)),
    ),
  );
}
describe('Hill', () => {
  it('CA-2: normaliza con Ñ → N y conserva J', () => {
    expect(normalizeHill('¡Niño, Jícama! 123')).toBe('NINOJICAMA');
  });
  it.each([[[key2, 'HELP', 'HIAT']], [[key3, 'ACT', 'POH']]])(
    'CA-5/7: coincide con un vector conocido en ambos sentidos: %j',
    (entry) => {
      const [key, plain, cipher] = entry as [HillMatrix, string, string];
      expect(valid(plain, key).output).toBe(cipher);
      expect(valid(cipher, key, 'descifrar').output).toBe(plain);
    },
  );
  it('CA-5: inversa a izquierda y derecha, incluso con determinante negativo y pivote no invertible', () => {
    for (const key of [
      key2,
      key3,
      [
        [1, 2],
        [3, 5],
      ],
      [
        [2, 1],
        [13, 1],
      ],
    ]) {
      const before = key.map((row) => [...row]);
      const inverse = analyzeHillKey(key).inverse!;
      const identity = key.map((row, r) => row.map((_, c) => Number(r === c)));
      expect(multiply(key, inverse)).toEqual(identity);
      expect(multiply(inverse, key)).toEqual(identity);
      expect(key).toEqual(before);
      expect(inverse.flat().every((n) => n >= 0 && n < 26)).toBe(true);
    }
    expect(
      analyzeHillKey([
        [1, 2],
        [3, 5],
      ]).determinant,
    ).toBe(-1);
  });
  it('CA-3: rechaza dimensiones y números inválidos desde la API', () => {
    for (const key of [
      [],
      [[1]],
      [[1, 2], [3]],
      [
        [1, NaN],
        [0, 1],
      ],
      [
        [1, Infinity],
        [0, 1],
      ],
      [
        [1, 0.5],
        [0, 1],
      ],
      [
        [1, -1],
        [0, 1],
      ],
      [
        [1, 26],
        [0, 1],
      ],
    ]) {
      expect(() => analyzeHillKey(key)).toThrow();
      expect(transformHill('HELP', key, 'cifrar').ok).toBe(false);
    }
  });
  it('CA-4: rechaza matrices singulares y determinantes no coprimos en ambos modos', () => {
    for (const key of [
      [
        [1, 2],
        [2, 4],
      ],
      [
        [2, 0],
        [0, 1],
      ],
      [
        [13, 0],
        [0, 1],
      ],
    ]) {
      expect(analyzeHillKey(key).inverse).toBeNull();
      for (const mode of ['cifrar', 'descifrar'] as const) {
        const result = transformHill('HELP', key, mode);
        expect(result.ok).toBe(false);
        expect(result).not.toHaveProperty('output');
        expect(result).not.toHaveProperty('blocks');
      }
    }
  });
  it('CA-6: añade relleno solo al cifrar y conserva las X originales al descifrar', () => {
    for (const key of [key2, key3]) {
      for (const text of ['', 'A', 'AX', 'EXX', 'HOLA', 'FINALX']) {
        const encrypted = valid(text, key);
        expect(encrypted.prepared.length % key.length).toBe(0);
        expect(valid(encrypted.output, key, 'descifrar').output).toBe(
          text + 'X'.repeat(encrypted.padding),
        );
      }
      expect(transformHill('A', key, 'descifrar').ok).toBe(false);
      expect(valid('', key, 'descifrar').blocks).toEqual([]);
    }
  });
  it('CA-8: proporciona sumas, valores y residuos exactos para explicar cada fila', () => {
    expect(valid('HELP').blocks).toEqual([
      {
        input: 'HE',
        inputValues: [7, 4],
        sums: [33, 34],
        outputValues: [7, 8],
        output: 'HI',
      },
      {
        input: 'LP',
        inputValues: [11, 15],
        sums: [78, 97],
        outputValues: [0, 19],
        output: 'AT',
      },
    ]);
    expect(valid('HIAT', key2, 'descifrar').effectiveKey).toEqual([
      [15, 17],
      [20, 9],
    ]);
  });
});

describe('parseHillKey', () => {
  it('CA-12: acepta 2 × 2 y 3 × 3 por filas, con espacios o comas', () => {
    expect(parseHillKey('3 3 2 5')).toEqual({ ok: true, key: key2 });
    expect(parseHillKey('6, 24, 1, 13, 16, 10, 20, 17, 15')).toEqual({
      ok: true,
      key: key3,
    });
  });
  it('CA-12: rechaza vacío, cantidad incorrecta, no numéricos y fuera de rango', () => {
    expect(parseHillKey('').ok).toBe(false);
    expect(parseHillKey('1 2 3').ok).toBe(false);
    expect(parseHillKey('1 2 a 4').ok).toBe(false);
    expect(parseHillKey('1 2 3 26').ok).toBe(false);
  });
  it('CA-11: la clave leída cifra HELP → HIAT', () => {
    const parsed = parseHillKey('3 3 2 5');
    if (!parsed.ok) throw new Error(parsed.error);
    expect(valid('HELP', parsed.key).output).toBe('HIAT');
  });
});
