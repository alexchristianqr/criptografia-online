export type HillMatrix = number[][];
export type HillMode = 'cifrar' | 'descifrar';
export interface HillKeyAnalysis {
  determinant: number;
  determinantMod: number;
  gcd: number;
  inverse: HillMatrix | null;
}
export interface HillBlock {
  input: string;
  inputValues: number[];
  sums: number[];
  outputValues: number[];
  output: string;
}
export type HillResult =
  | {
      ok: true;
      normalized: string;
      prepared: string;
      padding: number;
      analysis: HillKeyAnalysis;
      effectiveKey: HillMatrix;
      blocks: HillBlock[];
      output: string;
    }
  | { ok: false; error: string; analysis?: HillKeyAnalysis };
const mod = (n: number) => ((n % 26) + 26) % 26;
export function normalizeHill(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const minor = (m: HillMatrix, r: number, c: number) =>
  m.filter((_, i) => i !== r).map((row) => row.filter((_, j) => j !== c));
const determinant = (m: HillMatrix): number =>
  m.length === 1
    ? m[0][0]
    : m[0].reduce(
        (sum, value, c) =>
          sum + (-1) ** c * value * determinant(minor(m, 0, c)),
        0,
      );

/** Valida dimensiones y valores; lanza Error si la clave no es una matriz válida. */
export function analyzeHillKey(key: HillMatrix): HillKeyAnalysis {
  if (
    !Array.isArray(key) ||
    ![2, 3].includes(key.length) ||
    !key.every(
      (row) =>
        Array.isArray(row) &&
        row.length === key.length &&
        row.every(
          (n) =>
            typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 25,
        ),
    )
  ) {
    throw new Error(
      'La clave debe ser una matriz 2 × 2 o 3 × 3 con enteros entre 0 y 25. Completa todas las casillas.',
    );
  }
  const det = determinant(key),
    residue = mod(det),
    divisor = gcd(det, 26);
  const detInverse = Array.from({ length: 26 }, (_, i) => i).find(
    (i) => mod(i * residue) === 1,
  );
  const inverse =
    detInverse === undefined
      ? null
      : key.map((row, r) =>
          row.map((_, c) =>
            mod(detInverse * (-1) ** (r + c) * determinant(minor(key, c, r))),
          ),
        );
  return { determinant: det, determinantMod: residue, gcd: divisor, inverse };
}

export function transformHill(
  text: string,
  key: HillMatrix,
  mode: HillMode,
): HillResult {
  let analysis: HillKeyAnalysis;
  try {
    analysis = analyzeHillKey(key);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  if (!analysis.inverse)
    return {
      ok: false,
      analysis,
      error: `La clave no tiene inversa módulo 26: mcd(det(K), 26) = ${analysis.gcd}. Se necesita un mcd igual a 1.`,
    };
  const normalized = normalizeHill(text),
    n = key.length;
  if (mode === 'descifrar' && normalized.length % n)
    return {
      ok: false,
      analysis,
      error: `Para descifrar, la cantidad de letras debe ser múltiplo de ${n}. No se añade relleno.`,
    };
  const padding = mode === 'cifrar' ? (n - (normalized.length % n)) % n : 0;
  const prepared = normalized + 'X'.repeat(padding);
  const effectiveKey = mode === 'cifrar' ? key : analysis.inverse;
  const blocks: HillBlock[] = [];
  for (let i = 0; i < prepared.length; i += n) {
    const input = prepared.slice(i, i + n),
      inputValues = [...input].map((c) => c.charCodeAt(0) - 65);
    const sums = effectiveKey.map((row) =>
      row.reduce((sum, k, j) => sum + k * inputValues[j], 0),
    );
    const outputValues = sums.map(mod),
      output = outputValues.map((v) => String.fromCharCode(v + 65)).join('');
    blocks.push({ input, inputValues, sums, outputValues, output });
  }
  return {
    ok: true,
    normalized,
    prepared,
    padding,
    analysis,
    effectiveKey,
    blocks,
    output: blocks.map((b) => b.output).join(''),
  };
}

export type ParseHillKeyResult =
  { ok: true; key: HillMatrix } | { ok: false; error: string };

/** Interpreta una clave escrita por filas (4 números = 2 × 2, 9 = 3 × 3) con enteros de 0 a 25. */
export function parseHillKey(input: string): ParseHillKeyResult {
  const tokens = input.split(/[\s,;]+/).filter(Boolean);
  if (tokens.length === 0)
    return {
      ok: false,
      error: 'Escribe la clave por filas: 4 números (2 × 2) o 9 (3 × 3).',
    };
  const bad = tokens.find((t) => !/^\d+$/.test(t));
  if (bad !== undefined)
    return { ok: false, error: `«${bad}» no es un entero de 0 a 25.` };
  const size = Math.sqrt(tokens.length);
  if (size !== 2 && size !== 3)
    return {
      ok: false,
      error: `Hay ${tokens.length} números: se necesitan 4 (2 × 2) o 9 (3 × 3).`,
    };
  const nums = tokens.map(Number);
  const out = nums.find((n) => n > 25);
  if (out !== undefined)
    return { ok: false, error: `El ${out} está fuera de rango (0 a 25).` };
  return {
    ok: true,
    key: Array.from({ length: size }, (_, r) =>
      nums.slice(r * size, r * size + size),
    ),
  };
}
