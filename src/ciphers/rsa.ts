import { sha256Hex } from './sha256';

export type RsaMode = 'cifrar' | 'descifrar' | 'firmar' | 'verificar';

export interface EuclidStep {
  a: bigint;
  b: bigint;
  q: bigint;
  r: bigint;
}
export interface PowStep {
  bit: '0' | '1';
  squared: bigint;
  result: bigint;
}
export interface RsaKeys {
  p: bigint;
  q: bigint;
  n: bigint;
  phi: bigint;
  e: bigint;
  d: bigint;
  steps: EuclidStep[];
}
export type RsaKeyResult =
  { ok: true; keys: RsaKeys } | { ok: false; error: string };

export const MIN_PRIME = 11;
export const MAX_PRIME = 9973;

export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

export function gcd(a: bigint, b: bigint): bigint {
  while (b) [a, b] = [b, a % b];
  return a < 0n ? -a : a;
}

/** Euclides extendido: devuelve mcd, coeficiente x (a·x + b·y = mcd) y los pasos de división. */
export function extendedEuclid(a: bigint, b: bigint) {
  const steps: EuclidStep[] = [];
  let [oldR, r] = [a, b];
  let [oldS, s] = [1n, 0n];
  while (r !== 0n) {
    const q = oldR / r;
    steps.push({ a: oldR, b: r, q, r: oldR - q * r });
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return { gcd: oldR, x: oldS, steps };
}

/** Exponenciación modular por cuadrados sucesivos, con traza bit a bit. */
export function modPow(base: bigint, exp: bigint, mod: bigint) {
  const b = ((base % mod) + mod) % mod;
  const bits = exp.toString(2);
  const steps: PowStep[] = [];
  let result = 1n;
  for (const bit of bits as unknown as ('0' | '1')[]) {
    const squared = (result * result) % mod;
    result = bit === '1' ? (squared * b) % mod : squared;
    steps.push({ bit, squared, result });
  }
  return { result, bits, steps };
}

export function validateRsaParams(
  p: number,
  q: number,
  e: number,
): RsaKeyResult {
  const fail = (error: string): RsaKeyResult => ({ ok: false, error });
  for (const [name, v] of [
    ['p', p],
    ['q', q],
  ] as const) {
    if (!Number.isInteger(v)) return fail(`${name} debe ser un número entero.`);
    if (v < MIN_PRIME || v > MAX_PRIME)
      return fail(`${name} debe estar entre ${MIN_PRIME} y ${MAX_PRIME}.`);
    if (!isPrime(v))
      return fail(
        `${name} = ${v} no es primo: tiene divisores distintos de 1 y de sí mismo.`,
      );
  }
  if (p === q)
    return fail(
      'p y q deben ser distintos; si no, n = p² se factoriza al instante.',
    );
  const n = BigInt(p) * BigInt(q);
  if (n <= 255n)
    return fail(
      `n = ${n} es demasiado pequeño: debe ser mayor que 255 para cifrar cualquier byte.`,
    );
  const phi = BigInt(p - 1) * BigInt(q - 1);
  if (!Number.isInteger(e)) return fail('e debe ser un número entero.');
  if (e <= 1 || BigInt(e) >= phi)
    return fail(`e debe cumplir 1 < e < φ(n) = ${phi}.`);
  const g = gcd(BigInt(e), phi);
  if (g !== 1n)
    return fail(
      `e = ${e} no sirve: mcd(e, φ) = ${g}. Debe ser 1 para que exista la clave privada d.`,
    );
  const { x, steps } = extendedEuclid(BigInt(e), phi);
  const d = ((x % phi) + phi) % phi;
  return {
    ok: true,
    keys: { p: BigInt(p), q: BigInt(q), n, phi, e: BigInt(e), d, steps },
  };
}

export interface EncryptBlock {
  label: string;
  m: bigint;
  c: bigint;
}
const byteLabel = (b: number) =>
  b > 32 && b < 127
    ? String.fromCharCode(b)
    : b === 32
      ? '␣'
      : `0x${b.toString(16).toUpperCase().padStart(2, '0')}`;

/** Cifra cada byte UTF-8 con la clave pública: c = mᵉ mod n. */
export function encryptRsa(text: string, e: bigint, n: bigint) {
  const blocks: EncryptBlock[] = [...new TextEncoder().encode(text)].map(
    (b) => ({
      label: byteLabel(b),
      m: BigInt(b),
      c: modPow(BigInt(b), e, n).result,
    }),
  );
  return { blocks, output: blocks.map((b) => b.c) };
}

export type ParseCipherResult =
  { ok: true; values: bigint[] } | { ok: false; error: string };

/** Interpreta una lista de enteros 0 ≤ c < n separados por espacios, comas o punto y coma. */
export function parseRsaCiphertext(
  input: string,
  n: bigint,
): ParseCipherResult {
  const tokens = input.split(/[\s,;]+/).filter(Boolean);
  if (tokens.length === 0)
    return {
      ok: false,
      error: 'Escribe los números cifrados separados por espacios.',
    };
  const bad = tokens.find((t) => !/^\d+$/.test(t));
  if (bad !== undefined)
    return { ok: false, error: `«${bad}» no es un entero positivo.` };
  const values = tokens.map((t) => BigInt(t));
  const big = values.find((v) => v >= n);
  if (big !== undefined)
    return {
      ok: false,
      error: `El número ${big} es ≥ n = ${n}: todo bloque cifrado debe ser menor que n.`,
    };
  return { ok: true, values };
}

export interface DecryptBlock {
  c: bigint;
  m: bigint;
  label: string;
}
export type DecryptResult =
  | { ok: true; blocks: DecryptBlock[]; text: string }
  | { ok: false; error: string };

/** Descifra con la clave privada: m = cᵈ mod n; cada m debe ser un byte y el conjunto, UTF-8 válido. */
export function decryptRsa(
  values: bigint[],
  d: bigint,
  n: bigint,
): DecryptResult {
  const blocks = values.map((c) => {
    const m = modPow(c, d, n).result;
    return { c, m, label: m < 256n ? byteLabel(Number(m)) : '?' };
  });
  const wrong = {
    ok: false as const,
    error:
      'Con esta clave los números no forman un texto válido. ¿Usaste la clave privada que corresponde a la pública con la que se cifró?',
  };
  if (blocks.some((b) => b.m > 255n)) return wrong;
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(
      Uint8Array.from(blocks.map((b) => Number(b.m))),
    );
    return { ok: true, blocks, text };
  } catch {
    return wrong;
  }
}

/** Hash reducido módulo n (simplificación didáctica: n es pequeño). */
export const hashToNumber = (hashHex: string, n: bigint) =>
  BigInt('0x' + hashHex) % n;

/** Firma: s = (h mod n)ᵈ mod n, con la clave privada. */
export const signRsa = (hashHex: string, d: bigint, n: bigint) =>
  modPow(hashToNumber(hashHex, n), d, n).result;

/** Verifica: sᵉ mod n debe coincidir con h mod n. */
export const verifyRsa = (hashHex: string, s: bigint, e: bigint, n: bigint) =>
  s < n && modPow(s, e, n).result === hashToNumber(hashHex, n);

/** Cambia una letra del mensaje garantizando que su hash reducido mod n también cambie. */
export async function alterMessage(text: string, n: bigint): Promise<string> {
  const base = hashToNumber(await sha256Hex(text), n);
  const source = text || ' ';
  for (let i = 0; i < source.length; i++) {
    for (const candidate of ['x', 'y', 'z', 'X', '1']) {
      if (source[i] === candidate) continue;
      const altered = source.slice(0, i) + candidate + source.slice(i + 1);
      if (hashToNumber(await sha256Hex(altered), n) !== base) return altered;
    }
  }
  return source + '!';
}
