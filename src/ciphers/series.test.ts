import { describe, expect, it } from 'vitest';
import {
  normalizeSeries,
  parseSeriesDrafts,
  parseSeriesPositions,
  transformSeries,
  validateSeriesKey,
  type SeriesMode,
  type SeriesRule,
} from './series';
const key: SeriesRule[] = [{ kind: 'primos' }, { kind: 'pares' }];
function valid(text: string, rules = key, mode: SeriesMode = 'cifrar') {
  const result = transformSeries(text, rules, mode);
  if (!result.ok) throw new Error(result.error);
  return result;
}
describe('Transposición por Series', () => {
  it('CA-2: normaliza vocales y conserva Ñ en Unicode compuesto o descompuesto', () => {
    expect(normalizeSeries('¡Áéíóúü, niño! 123')).toBe('AEIOUUNIÑO');
    expect(normalizeSeries('á ñ ü'.normalize('NFD'))).toBe('AÑU');
  });
  it('CA-5/8: reproduce el vector UPM y registra solapamientos sin renumerar', () => {
    const result = valid('AHORA CIFRAMOS POR SERIES', [
      { kind: 'posiciones', positions: [2, 3, 5, 7, 11, 13, 17, 19] },
      { kind: 'pares' },
    ]);
    expect(result.output).toBe('HOAIMSSRRCFAOPREISAROE');
    expect(result.groups.map((g) => g.positions)).toEqual([
      [2, 3, 5, 7, 11, 13, 17, 19],
      [4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
      [1, 9, 15, 21],
    ]);
    expect(result.groups[0].candidates).not.toContain(1);
    expect(result.groups[1].skipped).toEqual([2]);
    expect(result.groups.map((g) => g.text)).toEqual([
      'HOAIMSSR',
      'RCFAOPREIS',
      'AROE',
    ]);
    expect(result.groups.map((g) => g.cipherStart)).toEqual([0, 8, 18]);
  });
  it('CA-3/8: coincide con la convención universitaria que incluye la posición 1', () => {
    const text = 'ERRAR ES HUMANO PERDONAR DIVINO';
    const result = valid(text);
    expect(result.output).toBe('ERRRSAODNIAEHMNPROADVNUERIO');
    expect(result.groups.map((g) => g.positions)).toEqual([
      [1, 2, 3, 5, 7, 11, 13, 17, 19, 23],
      [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26],
      [9, 15, 21, 25, 27],
    ]);
    expect(result.groups.map((g) => g.text)).toEqual([
      'ERRRSAODNI',
      'AEHMNPROADVN',
      'UERIO',
    ]);
    expect(valid(result.output, key, 'descifrar').output).toBe(
      normalizeSeries(text),
    );
    expect(valid('A').groups[0].positions).toEqual([1]);
    expect(valid('').groups[0].positions).toEqual([]);
    expect(
      valid('ABC', [{ kind: 'impares' }, { kind: 'primos' }]).groups[1].skipped,
    ).toEqual([1, 3]);
  });
  it('CA-7: descifra con segmentos de distintas longitudes y la misma traza', () => {
    const encrypted = valid('AHORA CIFRAMOS POR SERIES');
    const decrypted = valid(encrypted.output, key, 'descifrar');
    expect(decrypted.output).toBe('AHORACIFRAMOSPORSERIES');
    expect(decrypted.groups).toEqual(encrypted.groups);
    expect(decrypted.steps).toEqual(encrypted.steps);
  });
  it('CA-3/5/6: respeta el orden de listas explícitas y registra grupos vacíos', () => {
    const rules: SeriesRule[] = [
      { kind: 'posiciones', positions: [5, 1, 3] },
      { kind: 'impares' },
      { kind: 'multiplos', divisor: 3 },
    ];
    const result = valid('ABCDEF', rules);
    expect(result.output).toBe('EACFBD');
    expect(result.groups[1]).toMatchObject({
      positions: [],
      skipped: [1, 3, 5],
      text: '',
      cipherStart: 3,
    });
    expect(result.groups[2]).toMatchObject({
      positions: [6],
      skipped: [3],
      cipherStart: 3,
    });
    expect(valid(result.output, rules, 'descifrar').output).toBe('ABCDEF');
  });
  it('CA-3/5: el orden de las reglas cambia qué grupo recibe una posición', () => {
    const a = valid('ABCDEFGHIJ', key),
      b = valid('ABCDEFGHIJ', [...key].reverse());
    expect(a.output).not.toBe(b.output);
    expect(a.groups[0].positions).toContain(2);
    expect(b.groups[0].positions).toContain(2);
    expect(b.groups[1].skipped).toEqual([2]);
  });
  it('CA-6/10: no añade relleno y admite vacío, una letra y series sin coincidencias', () => {
    for (const mode of ['cifrar', 'descifrar'] as const) {
      expect(valid('', key, mode)).toMatchObject({
        normalized: '',
        output: '',
        order: [],
        steps: [],
      });
      expect(valid('Ñ', key, mode).output).toBe('Ñ');
      expect(
        valid('ABC', [{ kind: 'multiplos', divisor: 999 }], mode).output,
      ).toBe('ABC');
    }
    expect(valid('FINALX').output.length).toBe(6);
  });
  it('CA-4: interpreta posiciones en base 1 sin cambiar el orden escrito', () => {
    expect(parseSeriesPositions('5, 1 3')).toEqual({
      ok: true,
      positions: [5, 1, 3],
    });
    for (const input of [
      '',
      '1 1',
      '0',
      '-1',
      '1.5',
      'NaN',
      'Infinity',
      'a',
      '1e2',
      '9007199254740992',
    ])
      expect(parseSeriesPositions(input).ok).toBe(false);
  });
  it('CA-3/4: valida borradores sin convertir vacío a cero', () => {
    expect(parseSeriesDrafts([{ kind: 'multiplos', value: '' }], 22).ok).toBe(
      false,
    );
    expect(parseSeriesDrafts([{ kind: 'multiplos', value: '1' }], 22).ok).toBe(
      false,
    );
    expect(
      parseSeriesDrafts([{ kind: 'multiplos', value: '9007199254740992' }], 22)
        .ok,
    ).toBe(false);
    expect(
      parseSeriesDrafts([{ kind: 'posiciones', value: '3 1' }], 3),
    ).toEqual({ ok: true, rules: [{ kind: 'posiciones', positions: [3, 1] }] });
    expect(
      parseSeriesDrafts(
        [
          { kind: 'primos', value: '' },
          { kind: 'posiciones', value: '3 3' },
        ],
        3,
      ),
    ).toMatchObject({ ok: false, ruleIndex: 1 });
  });
  it('CA-4/10: rechaza claves inválidas desde el algoritmo sin resultado parcial', () => {
    const invalid: SeriesRule[][] = [
      [],
      Array.from({ length: 9 }, () => ({ kind: 'pares' })),
      [{ kind: 'multiplos', divisor: 0 }],
      [{ kind: 'multiplos', divisor: 2.5 }],
      [{ kind: 'multiplos', divisor: Infinity }],
      [{ kind: 'multiplos', divisor: Number.MAX_SAFE_INTEGER + 1 }],
      [{ kind: 'posiciones', positions: [] }],
      [{ kind: 'posiciones', positions: [0] }],
      [{ kind: 'posiciones', positions: [1, 1] }],
      [{ kind: 'posiciones', positions: [5] }],
      [{ kind: 'posiciones', positions: [NaN] }],
      [null as unknown as SeriesRule],
      [{ kind: 'desconocida' } as unknown as SeriesRule],
    ];
    for (const rules of invalid) {
      const result = transformSeries('ABCD', rules, 'cifrar');
      expect(result.ok).toBe(false);
      expect(result).not.toHaveProperty('output');
      expect(result).not.toHaveProperty('steps');
    }
    expect(valid('A', [{ kind: 'posiciones', positions: [1] }]).output).toBe(
      'A',
    );
    expect(
      transformSeries('', [{ kind: 'posiciones', positions: [1] }], 'cifrar')
        .ok,
    ).toBe(false);
    expect(validateSeriesKey(key, -1).ok).toBe(false);
  });
  it('CA-5/6/7: cobertura única, frecuencias y reversibilidad para distintas longitudes y claves', () => {
    const configs: SeriesRule[][] = [
      key,
      [...key].reverse(),
      [{ kind: 'pares' }, { kind: 'impares' }],
      [
        { kind: 'multiplos', divisor: 3 },
        { kind: 'multiplos', divisor: 2 },
        { kind: 'primos' },
      ],
      [{ kind: 'primos' }, { kind: 'primos' }],
      [{ kind: 'impares' }],
    ];
    for (let length = 0; length <= 100; length++) {
      const plain = Array.from({ length }, (_, i) => 'ABCAÑZ'[i % 6]).join('');
      const rulesForLength = length
        ? [
            ...configs,
            [
              {
                kind: 'posiciones' as const,
                positions: Array.from({ length }, (_, i) => length - i),
              },
            ],
          ]
        : configs;
      for (const rules of rulesForLength) {
        const result = valid(plain, rules);
        expect([...result.order].sort((a, b) => a - b)).toEqual(
          Array.from({ length }, (_, i) => i + 1),
        );
        expect([...result.output].sort()).toEqual([...plain].sort());
        expect(valid(result.output, rules, 'descifrar').output).toBe(plain);
        expect(result.groups.map((g) => g.text).join('')).toBe(result.output);
        result.steps.forEach((step) => {
          expect(plain[step.plainPosition - 1]).toBe(step.letter);
          expect(result.output[step.cipherPosition - 1]).toBe(step.letter);
        });
      }
    }
  });
  it('CA-5: el cálculo no modifica la clave', () => {
    const rules: SeriesRule[] = [
      { kind: 'posiciones', positions: [3, 1] },
      { kind: 'pares' },
    ];
    const before = JSON.stringify(rules);
    valid('ABCDE', rules);
    expect(JSON.stringify(rules)).toBe(before);
  });
});
