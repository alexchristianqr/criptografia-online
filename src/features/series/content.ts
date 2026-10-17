import type { SeriesDraft } from '../../ciphers/series';
export const example = {
  text: 'ERRAR ES HUMANO PERDONAR DIVINO',
  ciphertext: 'ERRRSAODNIAEHMNPROADVNUERIO',
};
export const exampleDrafts = (): SeriesDraft[] => [
  { kind: 'primos', value: '' },
  { kind: 'pares', value: '' },
];
export const theory = [
  'Las posiciones se numeran desde 1 sobre el mensaje completo normalizado. Los índices originales se mantienen durante todo el procedimiento.',
  'La clave es una lista ordenada de reglas. La primera regla que selecciona una posición se queda con ella; las siguientes omiten esa posición.',
  'Convención del curso: la regla de primos incluye la posición 1, seguida de 2, 3, 5, 7, …, para coincidir con los ejercicios del profesor. Matemáticamente, 1 no es primo.',
  'Cada serie matemática se recorre de menor a mayor. Una lista de posiciones explícitas sigue el orden escrito, por ejemplo 5, 1, 3.',
  'Restantes recoge automáticamente las posiciones no utilizadas, en orden ascendente. Cada letra se transmite una sola vez y no se añade relleno.',
  'Para descifrar, reconstruye el recorrido a partir de la longitud del criptograma. Divide sus letras según el tamaño efectivo de cada serie y colócalas en las posiciones originales.',
  'La transposición conserva las letras y sus frecuencias. Es una técnica histórica de aprendizaje; no protege información actual.',
];
export const source = {
  title:
    'Universidad Carlos III de Madrid · Criptografía clásica · Transposición por series',
  url: 'https://ocw.uc3m.es/pluginfile.php/3968/mod_page/content/18/slides_l4.pdf',
};
