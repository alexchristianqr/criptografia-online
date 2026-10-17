const ALPHABET = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
const mod = (n: number) => ((n % 5) + 5) % 5;

export interface Position {
  row: number;
  column: number;
}
export interface PlayfairStep {
  input: string;
  output: string;
  rule: 'fila' | 'columna' | 'rectangulo';
  from: [Position, Position];
  to: [Position, Position];
}
export type PlayfairResult =
  | {
      ok: true;
      normalized: string;
      square: string[][];
      output: string;
      steps: PlayfairStep[];
    }
  | { ok: false; error: string };

export function normalizePlayfair(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .replace(/J/g, 'I');
}

/** Lanza Error si la clave no contiene letras. */
export function createPlayfairSquare(keyword: string): string[][] {
  const key = normalizePlayfair(keyword);
  if (!key) throw new Error('La clave debe contener al menos una letra.');
  const letters = [...new Set(key + ALPHABET)];
  return Array.from({ length: 5 }, (_, i) => letters.slice(i * 5, i * 5 + 5));
}

export function decryptPlayfair(text: string, keyword: string): PlayfairResult {
  let square: string[][];
  try {
    square = createPlayfairSquare(keyword);
  } catch {
    return { ok: false, error: 'La clave debe contener al menos una letra.' };
  }
  const normalized = normalizePlayfair(text);
  if (normalized.length % 2)
    return {
      ok: false,
      error:
        'El criptograma debe tener un número par de letras. No se añade relleno al descifrar.',
    };
  const positions = new Map<string, Position>();
  square.forEach((row, r) =>
    row.forEach((letter, c) => positions.set(letter, { row: r, column: c })),
  );
  const steps: PlayfairStep[] = [];
  for (let i = 0; i < normalized.length; i += 2) {
    const input = normalized.slice(i, i + 2);
    if (input[0] === input[1])
      return {
        ok: false,
        error: `El par ${i / 2 + 1} (${input}) contiene letras iguales y no es válido en Playfair clásico.`,
      };
    const a = positions.get(input[0])!,
      b = positions.get(input[1])!;
    const rule =
      a.row === b.row
        ? 'fila'
        : a.column === b.column
          ? 'columna'
          : 'rectangulo';
    const to: [Position, Position] =
      rule === 'fila'
        ? [
            { row: a.row, column: mod(a.column - 1) },
            { row: b.row, column: mod(b.column - 1) },
          ]
        : rule === 'columna'
          ? [
              { row: mod(a.row - 1), column: a.column },
              { row: mod(b.row - 1), column: b.column },
            ]
          : [
              { row: a.row, column: b.column },
              { row: b.row, column: a.column },
            ];
    steps.push({
      input,
      output: to.map((p) => square[p.row][p.column]).join(''),
      rule,
      from: [a, b],
      to,
    });
  }
  return {
    ok: true,
    normalized,
    square,
    steps,
    output: steps.map((s) => s.output).join(''),
  };
}
