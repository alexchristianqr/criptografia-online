import { describe, expect, it } from 'vitest';
import {
  createPlayfairSquare,
  decryptPlayfair,
  normalizePlayfair,
} from './playfair';

function valid(text: string, keyword = 'MONARCHY') {
  const result = decryptPlayfair(text, keyword);
  if (!result.ok) throw new Error(result.error);
  return result;
}
describe('Playfair Descifrado', () => {
  it('CA-2/3: normaliza tildes, Ñ e I/J y construye un cuadrado sin duplicados', () => {
    expect(normalizePlayfair('¡Niño, Jícama! 123')).toBe('NINOIICAMA');
    expect(createPlayfairSquare('mónárchy MONARCHY')).toEqual([
      ['M', 'O', 'N', 'A', 'R'],
      ['C', 'H', 'Y', 'B', 'D'],
      ['E', 'F', 'G', 'I', 'K'],
      ['L', 'P', 'Q', 'S', 'T'],
      ['U', 'V', 'W', 'X', 'Z'],
    ]);
    expect(createPlayfairSquare('JIG').flat().slice(0, 2)).toEqual(['I', 'G']);
    expect(new Set(createPlayfairSquare('JIG').flat()).size).toBe(25);
  });
  it('CA-2/4: rechaza claves sin letras, longitudes impares y pares iguales tras normalizar', () => {
    expect(() => createPlayfairSquare('123')).toThrow();
    for (const [text, key] of [
      ['AB', '123'],
      ['ABC', 'KEY'],
      ['AA', 'KEY'],
      ['IJ', 'KEY'],
      ['GATLAA', 'MONARCHY'],
    ]) {
      const result = decryptPlayfair(text, key);
      expect(result.ok).toBe(false);
      expect(result).not.toHaveProperty('output');
      expect(result).not.toHaveProperty('steps');
    }
  });
  it('CA-4: acepta texto vacío sin generar pares', () => {
    expect(valid(' 123!').output).toBe('');
    expect(valid('').steps).toEqual([]);
  });
  it('CA-5: aplica fila, columna y rectángulo conservando el orden', () => {
    expect(valid('OR').steps[0]).toMatchObject({ rule: 'fila', output: 'MA' });
    expect(valid('CE').steps[0]).toMatchObject({
      rule: 'columna',
      output: 'MC',
    });
    expect(valid('GA').steps[0]).toMatchObject({
      rule: 'rectangulo',
      output: 'IN',
      from: [
        { row: 2, column: 2 },
        { row: 0, column: 3 },
      ],
      to: [
        { row: 2, column: 3 },
        { row: 0, column: 2 },
      ],
    });
  });
  it('CA-5: retorna circularmente desde primera columna o fila', () => {
    expect(valid('MO').output).toBe('RM');
    expect(valid('MC').output).toBe('UM');
  });
  it('CA-7: recupera el ejemplo completo sin eliminar la X', () => {
    const result = valid('ga tl mz cl rq xa');
    expect(result.normalized).toBe('GATLMZCLRQXA');
    expect(result.output).toBe('INSTRUMENTSX');
    expect(result.steps).toHaveLength(6);
    expect(result.steps.map((step) => step.output).join('')).toBe(
      result.output,
    );
  });
});
