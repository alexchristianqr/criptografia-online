import { describe, expect, it } from 'vitest';
import {
  alterMessage,
  decryptRsa,
  encryptRsa,
  extendedEuclid,
  isPrime,
  modPow,
  parseRsaCiphertext,
  signRsa,
  validateRsaParams,
  verifyRsa,
  type RsaKeys,
} from './rsa';
import { sha256Hex } from './sha256';

const ok = (p: number, q: number, e: number): RsaKeys => {
  const r = validateRsaParams(p, q, e);
  if (!r.ok) throw new Error(r.error);
  return r.keys;
};

describe('primos y aritmética', () => {
  it('isPrime', () => {
    expect([11, 61, 53, 9973].every(isPrime)).toBe(true);
    expect([0, 1, 4, 57, 1.5].some(isPrime)).toBe(false);
  });
  it('Euclides extendido: 17·x ≡ 1 (mod 3120)', () => {
    const r = extendedEuclid(17n, 3120n);
    expect(r.gcd).toBe(1n);
    expect(
      (17n * r.x) % 3120n === 1n ||
        (((17n * r.x) % 3120n) + 3120n) % 3120n === 1n,
    ).toBe(true);
    expect(r.steps.length).toBeGreaterThan(0);
  });
  it('modPow coincide con la definición', () => {
    expect(modPow(65n, 17n, 3233n).result).toBe(2790n);
    expect(modPow(7n, 0n, 13n).result).toBe(1n);
    expect(modPow(4n, 13n, 497n).result).toBe(445n);
  });
});

describe('validateRsaParams (CA-2, CA-3, CA-9)', () => {
  it('vector 61, 53, 17', () => {
    const k = ok(61, 53, 17);
    expect([k.n, k.phi, k.d]).toEqual([3233n, 3120n, 2753n]);
  });
  it('rechaza no primos, iguales, fuera de rango y no enteros', () => {
    expect(validateRsaParams(60, 53, 17).ok).toBe(false);
    expect(validateRsaParams(61, 61, 17).ok).toBe(false);
    expect(validateRsaParams(7, 53, 5).ok).toBe(false);
    expect(validateRsaParams(10007, 53, 17).ok).toBe(false);
    expect(validateRsaParams(61.5, 53, 17).ok).toBe(false);
    expect(validateRsaParams(NaN, 53, 17).ok).toBe(false);
  });
  it('rechaza n ≤ 255', () => {
    const r = validateRsaParams(11, 13, 7);
    expect(r.ok).toBe(false);
  });
  it('rechaza e con mcd(e, φ) ≠ 1 o fuera de rango', () => {
    expect(validateRsaParams(61, 53, 6).ok).toBe(false);
    expect(validateRsaParams(61, 53, 1).ok).toBe(false);
    expect(validateRsaParams(61, 53, 3120).ok).toBe(false);
    expect(validateRsaParams(61, 53, 2.5).ok).toBe(false);
  });
  it('e·d ≡ 1 (mod φ)', () => {
    const k = ok(101, 113, 3);
    expect((k.e * k.d) % k.phi).toBe(1n);
  });
});

describe('cifrar y descifrar (CA-4, CA-5, CA-9)', () => {
  const k = ok(61, 53, 17);
  it('m=65 → c=2790 → 65', () => {
    const enc = encryptRsa('A', k.e, k.n);
    expect(enc.output).toEqual([2790n]);
    const dec = decryptRsa(enc.output, k.d, k.n);
    expect(dec.ok && dec.text).toBe('A');
  });
  it('ida y vuelta con tildes y emoji (UTF-8)', () => {
    const text = 'Hola, ¿qué tal? ñ 🔐';
    const enc = encryptRsa(text, k.e, k.n);
    const dec = decryptRsa(enc.output, k.d, k.n);
    expect(dec.ok && dec.text).toBe(text);
  });
  it('texto vacío', () => {
    expect(encryptRsa('', k.e, k.n).output).toEqual([]);
  });
  it('clave equivocada da error, no basura', () => {
    const other = ok(59, 67, 5);
    const enc = encryptRsa('HOLA', k.e, k.n);
    const values = enc.output.map((c) => c % other.n);
    const dec = decryptRsa(values, other.d, other.n);
    expect(dec.ok).toBe(false);
  });
  it('parseRsaCiphertext', () => {
    const r = parseRsaCiphertext('2790, 1 2', k.n);
    expect(r).toEqual({ ok: true, values: [2790n, 1n, 2n] });
    expect(parseRsaCiphertext('', k.n).ok).toBe(false);
    expect(parseRsaCiphertext('12 a', k.n).ok).toBe(false);
    expect(parseRsaCiphertext('1.5', k.n).ok).toBe(false);
    expect(parseRsaCiphertext('-3', k.n).ok).toBe(false);
    expect(parseRsaCiphertext('3233', k.n).ok).toBe(false);
  });
});

describe('firmar y verificar (CA-6, CA-7)', () => {
  const k = ok(61, 53, 17);
  it('firma válida y mensaje alterado inválido', async () => {
    const msg = 'Pago de 100 soles a Bob';
    const s = signRsa(await sha256Hex(msg), k.d, k.n);
    expect(verifyRsa(await sha256Hex(msg), s, k.e, k.n)).toBe(true);
    const altered = await alterMessage(msg, k.n);
    expect(altered).not.toBe(msg);
    expect(verifyRsa(await sha256Hex(altered), s, k.e, k.n)).toBe(false);
  });
  it('firma manipulada o fuera de rango es inválida', async () => {
    const h = await sha256Hex('hola');
    const s = signRsa(h, k.d, k.n);
    expect(verifyRsa(h, (s + 1n) % k.n, k.e, k.n)).toBe(false);
    expect(verifyRsa(h, s + k.n, k.e, k.n)).toBe(false);
  });
  it('firmar con la clave equivocada no verifica', async () => {
    const h = await sha256Hex('hola');
    const other = ok(59, 67, 5);
    const s = signRsa(h, other.d, k.n);
    expect(verifyRsa(h, s, k.e, k.n)).toBe(false);
  });
});
