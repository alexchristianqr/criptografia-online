/** Clave de permutación (base 0): la posición j del bloque cifrado toma la letra de la posición key[j] del bloque original. */
export type PermutationKey = number[];

export const PAD = 'X';
export const MIN_M = 2;
export const MAX_M = 12;

export const identity = (m: number): PermutationKey =>
  Array.from({ length: m }, (_, i) => i);

export function isValidKey(key: PermutationKey): boolean {
  const m = key.length;
  return (
    m > 0 &&
    new Set(key).size === m &&
    key.every((k) => Number.isInteger(k) && k >= 0 && k < m)
  );
}

/** Permutación inversa: deshace lo que hace `key`. */
export function inverse(key: PermutationKey): PermutationKey {
  const inv = new Array<number>(key.length);
  key.forEach((to, from) => (inv[to] = from));
  return inv;
}

/** Deja solo letras (A-Z, Ñ) en mayúsculas y completa con X hasta un múltiplo de m. */
export function normalize(text: string, m: number): string {
  const letters = Array.from(text.toUpperCase()).filter((c) =>
    /^[A-ZÑ]$/.test(c),
  );
  while (letters.length % m !== 0) letters.push(PAD);
  return letters.join('');
}

export interface PermutationBlock {
  input: string[];
  output: string[];
}

/** Aplica la permutación bloque a bloque conservando el detalle de cada bloque. */
export function permuteBlocks(
  text: string,
  key: PermutationKey,
): PermutationBlock[] {
  const m = key.length;
  const letters = Array.from(normalize(text, m));
  const blocks: PermutationBlock[] = [];
  for (let b = 0; b < letters.length; b += m) {
    const input = letters.slice(b, b + m);
    const output = new Array<string>(m);
    key.forEach((from, to) => (output[to] = input[from]!));
    blocks.push({ input, output });
  }
  return blocks;
}

export const permutationEncrypt = (text: string, key: PermutationKey) =>
  permuteBlocks(text, key)
    .map((b) => b.output.join(''))
    .join('');

export const permutationDecrypt = (text: string, key: PermutationKey) =>
  permutationEncrypt(text, inverse(key));

/** Clave en base 1 separada por espacios, como la ve el usuario. */
export const formatKey = (key: PermutationKey) =>
  key.map((k) => k + 1).join(' ');

export type ParseKeyResult =
  { ok: true; key: PermutationKey } | { ok: false; error: string };

/** Interpreta una clave escrita en base 1 ("3 1 4 2" o "3,1,4,2") y valida que sea una permutación de 1…m. */
export function parseKey(
  input: string,
  limits = { min: MIN_M, max: MAX_M },
): ParseKeyResult {
  const tokens = input.split(/[\s,;]+/).filter(Boolean);
  if (tokens.length === 0)
    return {
      ok: false,
      error: 'Escribe la clave: números separados por espacios o comas.',
    };
  const bad = tokens.find((t) => !/^\d+$/.test(t));
  if (bad !== undefined)
    return { ok: false, error: `«${bad}» no es un número entero positivo.` };
  const m = tokens.length;
  if (m < limits.min || m > limits.max)
    return {
      ok: false,
      error: `La clave debe tener entre ${limits.min} y ${limits.max} números (tiene ${m}).`,
    };
  const nums = tokens.map(Number);
  const out = nums.find((n) => n < 1 || n > m);
  if (out !== undefined)
    return {
      ok: false,
      error: `El ${out} está fuera de rango: con ${m} números solo valen 1 a ${m}.`,
    };
  const dup = nums.find((n, i) => nums.indexOf(n) !== i);
  if (dup !== undefined)
    return {
      ok: false,
      error: `El ${dup} está repetido: cada número de 1 a ${m} debe aparecer una sola vez.`,
    };
  return { ok: true, key: nums.map((n) => n - 1) };
}
