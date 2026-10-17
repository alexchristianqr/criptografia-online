export type SeriesRule =
  | { kind: 'primos' | 'pares' | 'impares' }
  | { kind: 'multiplos'; divisor: number }
  | { kind: 'posiciones'; positions: number[] };
export type SeriesKind = SeriesRule['kind'];
export type SeriesMode = 'cifrar' | 'descifrar';
export interface SeriesGroup {
  ruleIndex: number | null;
  label: string;
  candidates: number[];
  skipped: number[];
  positions: number[];
  text: string;
  cipherStart: number;
}
export interface SeriesStep {
  plainPosition: number;
  cipherPosition: number;
  letter: string;
  groupIndex: number;
}
export type SeriesSuccess = {
  ok: true;
  normalized: string;
  output: string;
  order: number[];
  groups: SeriesGroup[];
  steps: SeriesStep[];
};
export type SeriesError = { ok: false; error: string; ruleIndex?: number };
export type SeriesResult = SeriesSuccess | SeriesError;
export interface SeriesDraft {
  kind: SeriesKind;
  value: string;
}
export const MAX_SERIES_RULES = 8;

export function normalizeSeries(text: string): string {
  const vowels: Record<string, string> = {
    Á: 'A',
    É: 'E',
    Í: 'I',
    Ó: 'O',
    Ú: 'U',
    Ü: 'U',
  };
  return text
    .normalize('NFC')
    .toUpperCase()
    .replace(/[ÁÉÍÓÚÜ]/g, (c) => vowels[c])
    .replace(/[^A-ZÑ]/g, '');
}

export function parseSeriesPositions(
  input: string,
): { ok: true; positions: number[] } | SeriesError {
  const tokens = input.split(/[\s,]+/).filter(Boolean);
  if (!tokens.length)
    return {
      ok: false,
      error: 'Escribe al menos una posición, separada por espacios o comas.',
    };
  const positions: number[] = [],
    seen = new Set<number>();
  for (const token of tokens) {
    const n = Number(token);
    if (!/^\d+$/.test(token) || !Number.isSafeInteger(n) || n < 1)
      return {
        ok: false,
        error: `«${token}» no es una posición entera segura desde 1.`,
      };
    if (seen.has(n))
      return {
        ok: false,
        error: `La posición ${n} está repetida dentro de la lista.`,
      };
    seen.add(n);
    positions.push(n);
  }
  return { ok: true, positions };
}

export function validateSeriesKey(
  rules: SeriesRule[],
  length: number,
): { ok: true } | SeriesError {
  if (!Number.isSafeInteger(length) || length < 0)
    return {
      ok: false,
      error: 'La longitud del mensaje debe ser un entero no negativo.',
    };
  if (
    !Array.isArray(rules) ||
    rules.length < 1 ||
    rules.length > MAX_SERIES_RULES
  )
    return {
      ok: false,
      error: `La clave debe tener entre 1 y ${MAX_SERIES_RULES} reglas.`,
    };
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const fail = (error: string): SeriesError => ({
      ok: false,
      ruleIndex: i,
      error: `Serie ${i + 1}: ${error}`,
    });
    if (!rule || typeof rule !== 'object')
      return fail('la regla no es válida.');
    switch (rule.kind) {
      case 'primos':
      case 'pares':
      case 'impares':
        break;
      case 'multiplos':
        if (!Number.isSafeInteger(rule.divisor) || rule.divisor < 2)
          return fail(
            'el divisor debe ser un entero seguro mayor o igual que 2.',
          );
        break;
      case 'posiciones': {
        if (!Array.isArray(rule.positions) || !rule.positions.length)
          return fail('escribe al menos una posición.');
        const seen = new Set<number>();
        for (const position of rule.positions) {
          if (
            !Number.isSafeInteger(position) ||
            position < 1 ||
            position > length
          )
            return fail(
              `la posición ${position} no pertenece al mensaje de ${length} letras (rango 1…${length}).`,
            );
          if (seen.has(position))
            return fail(
              `la posición ${position} está repetida dentro de la lista.`,
            );
          seen.add(position);
        }
        break;
      }
      default:
        return fail('elige un tipo de serie reconocido.');
    }
  }
  return { ok: true };
}

/** Convierte los campos editables sin convertir un parámetro vacío en cero. */
export function parseSeriesDrafts(
  drafts: SeriesDraft[],
  length: number,
): { ok: true; rules: SeriesRule[] } | SeriesError {
  const rules: SeriesRule[] = [];
  for (let i = 0; i < drafts.length; i++) {
    const draft = drafts[i];
    if (draft.kind === 'posiciones') {
      const parsed = parseSeriesPositions(draft.value);
      if (!parsed.ok)
        return {
          ...parsed,
          error: `Serie ${i + 1}: ${parsed.error}`,
          ruleIndex: i,
        };
      rules.push({ kind: 'posiciones', positions: parsed.positions });
    } else if (draft.kind === 'multiplos') {
      if (!/^\d+$/.test(draft.value.trim()))
        return {
          ok: false,
          error: `Serie ${i + 1}: escribe un divisor entero mayor o igual que 2.`,
          ruleIndex: i,
        };
      rules.push({ kind: 'multiplos', divisor: Number(draft.value) });
    } else rules.push({ kind: draft.kind });
  }
  const validation = validateSeriesKey(rules, length);
  return validation.ok ? { ok: true, rules } : validation;
}

export function seriesRuleLabel(rule: SeriesRule): string {
  switch (rule.kind) {
    case 'primos':
      return 'Primos (incluye 1 · curso)';
    case 'pares':
      return 'Pares';
    case 'impares':
      return 'Impares';
    case 'multiplos':
      return `Múltiplos de ${rule.divisor}`;
    case 'posiciones':
      return 'Posiciones explícitas';
  }
}

export function transformSeries(
  text: string,
  rules: SeriesRule[],
  mode: SeriesMode,
): SeriesResult {
  if (mode !== 'cifrar' && mode !== 'descifrar')
    return { ok: false, error: 'Elige cifrar o descifrar.' };
  const normalized = normalizeSeries(text),
    length = normalized.length;
  const validation = validateSeriesKey(rules, length);
  if (!validation.ok) return validation;
  const indices = Array.from({ length }, (_, i) => i + 1);
  const prime = new Uint8Array(length + 1);
  if (rules.some((rule) => rule.kind === 'primos')) {
    prime.fill(1, 2);
    for (let p = 2; p * p <= length; p++)
      if (prime[p])
        for (let multiple = p * p; multiple <= length; multiple += p)
          prime[multiple] = 0;
  }
  const used = new Set<number>(),
    groups: SeriesGroup[] = [],
    order: number[] = [];
  function addGroup(
    candidates: number[],
    ruleIndex: number | null,
    label: string,
  ) {
    const positions: number[] = [],
      skipped: number[] = [];
    for (const position of candidates) {
      if (used.has(position)) skipped.push(position);
      else {
        used.add(position);
        positions.push(position);
      }
    }
    groups.push({
      ruleIndex,
      label,
      candidates,
      skipped,
      positions,
      text: '',
      cipherStart: order.length,
    });
    for (const position of positions) order.push(position);
  }
  rules.forEach((rule, i) => {
    const candidates =
      rule.kind === 'posiciones'
        ? [...rule.positions]
        : indices.filter((position) => {
            switch (rule.kind) {
              case 'primos':
                // Convención del curso: incluir también la posición 1.
                return position === 1 || Boolean(prime[position]);
              case 'pares':
                return position % 2 === 0;
              case 'impares':
                return position % 2 !== 0;
              case 'multiplos':
                return position % rule.divisor === 0;
            }
          });
    addGroup(candidates, i, seriesRuleLabel(rule));
  });
  addGroup(
    indices.filter((i) => !used.has(i)),
    null,
    'Restantes',
  );
  const outputLetters = new Array<string>(length),
    steps: SeriesStep[] = [];
  groups.forEach((group, groupIndex) => {
    const segment: string[] = [];
    group.positions.forEach((plainPosition, i) => {
      const cipherIndex = group.cipherStart + i;
      const letter =
        normalized[mode === 'cifrar' ? plainPosition - 1 : cipherIndex];
      outputLetters[mode === 'cifrar' ? cipherIndex : plainPosition - 1] =
        letter;
      segment.push(letter);
      steps.push({
        plainPosition,
        cipherPosition: cipherIndex + 1,
        letter,
        groupIndex,
      });
    });
    group.text = segment.join('');
  });
  return {
    ok: true,
    normalized,
    output: outputLetters.join(''),
    order,
    groups,
    steps,
  };
}
