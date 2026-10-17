export const definition = {
  summary:
    'El cifrado por permutación es un cifrado de transposición: no cambia las letras, solo su orden. El mensaje se parte en bloques de m letras y dentro de cada bloque las posiciones se reordenan según una clave (una permutación de 1…m).',
  encrypt: 'la letra en la posición i pasa a la posición π(i)',
  decrypt: 'se aplica la permutación inversa π⁻¹',
  legend: 'm = tamaño del bloque, π = clave. Si faltan letras para completar el último bloque, se rellena con X.',
}

export const theory: string[] = [
  'Tipo: transposición. Las letras son las mismas, solo cambian de lugar (a diferencia de César, que sustituye).',
  'Clave: una permutación de las posiciones 1…m. Hay m! claves posibles (con m = 4 son 24; con m = 8, 40 320).',
  'Descifrar: se usa la permutación inversa; cada letra vuelve a su posición original.',
  'Relleno: si el mensaje no es múltiplo de m, se completa con letras nulas (aquí X).',
  'Fortaleza: la frecuencia de letras no cambia, así que el análisis de frecuencias no basta para romperlo.',
  'Debilidad: con bloques pequeños hay pocas claves y se puede atacar por fuerza bruta o buscando anagramas.',
  'Combinada con sustitución (p. ej. César) da cifrados de producto, la base de los cifrados modernos.',
]

export const practice = {
  text: 'ATACARALALBA',
  key: [2, 0, 3, 1],
  steps: [
    'Elige el tamaño de bloque m y la clave: aquí m = 4 y la clave es 3 1 4 2.',
    'Divide el mensaje en bloques de m letras (rellena con X si hace falta).',
    'En cada bloque, la letra de la posición i se coloca en la posición que indica la clave (1.ª → 3.ª, 2.ª → 1.ª, 3.ª → 4.ª, 4.ª → 2.ª).',
    'Une los bloques resultantes para obtener el texto cifrado.',
    'Para descifrar, usa la clave inversa (2 4 1 3) con el mismo procedimiento.',
  ],
}
