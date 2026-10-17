export const definition = {
  summary:
    'El cifrado por permutación es un cifrado de transposición: no cambia las letras, solo su orden. El mensaje se parte en bloques de m letras y dentro de cada bloque las posiciones se reordenan según una clave (una permutación de 1…m: la posición j del resultado toma la letra que está en la posición clave[j]).',
  encrypt: 'la posición j del resultado toma la letra de la posición π(j)',
  decrypt: 'se aplica la permutación inversa π⁻¹',
  legend:
    'm = tamaño del bloque, π = clave. Si faltan letras para completar el último bloque, se rellena con X.',
};

export const theory: string[] = [
  'Tipo: transposición. Las letras son las mismas, solo cambian de lugar (a diferencia de César, que sustituye).',
  'Clave: una permutación de las posiciones 1…m. Hay m! claves posibles (con m = 4 son 24; con m = 8, 40 320).',
  'Descifrar: se usa la permutación inversa; cada letra vuelve a su posición original.',
  'Relleno: si el mensaje no es múltiplo de m, se completa con letras nulas (aquí X).',
  'Fortaleza: la frecuencia de letras no cambia, así que el análisis de frecuencias no basta para romperlo.',
  'Debilidad: con bloques pequeños hay pocas claves y se puede atacar por fuerza bruta o buscando anagramas.',
  'Combinada con sustitución (p. ej. César) da cifrados de producto, la base de los cifrados modernos.',
];

/** Ejemplo real del laboratorio de la universidad: MANOS con clave 2 4 5 3 1 da AOSNM. */
export const labExample = {
  text: 'MANOS',
  key: [1, 3, 4, 2, 0],
  result: 'AOSNM',
};

export const practice = {
  text: 'ATACARALALBA',
  key: [2, 0, 3, 1],
};

const ordinal = (n: number) => `${n}.ª`;

/** Pasos de la práctica, calculados a partir de la clave (base 0) para que sirvan con cualquier valor. */
export function practiceSteps(key: number[], inverseKey: number[]): string[] {
  const m = key.length;
  const k = key.map((n) => n + 1).join(' ');
  const moves = key
    .map((from, j) => `${ordinal(j + 1)} ← ${ordinal(from + 1)}`)
    .join(', ');
  return [
    `Elige el tamaño de bloque m y la clave: aquí m = ${m} y la clave es ${k}.`,
    'Divide el mensaje en bloques de m letras (rellena con X si hace falta).',
    `En cada bloque, la posición j del resultado toma la letra que indica la clave (${moves}).`,
    'Une los bloques resultantes para obtener el texto cifrado.',
    `Para descifrar, usa la clave inversa (${inverseKey.map((n) => n + 1).join(' ')}) con el mismo procedimiento.`,
  ];
}
