export const example = { keyword: 'MONARCHY', text: 'GATLMZCLRQXA' };
export const rules = {
  fila: 'Misma fila: mueve cada letra una casilla a la izquierda. Desde la primera columna vuelve a la última.',
  columna:
    'Misma columna: mueve cada letra una casilla hacia arriba. Desde la primera fila vuelve a la última.',
  rectangulo:
    'Rectángulo: cada letra conserva su fila y toma la columna de la otra. Mantén el orden del par.',
};
export const theory = [
  'Playfair sustituye pares de letras (dígrafos), en lugar de letras individuales como César.',
  'Escribe primero la clave sin letras repetidas y completa por filas con el resto del alfabeto. I y J comparten casilla.',
  'Se aplica una sola regla a cada par: fila, columna o rectángulo. Para descifrar se invierten los desplazamientos del cifrado.',
  'Al descifrar no se separan letras repetidas ni se añade relleno. Un criptograma clásico tiene longitud par y sus pares contienen letras distintas.',
  'La salida recupera el texto preparado: los espacios, las tildes y la distinción entre I y J se perdieron. Una X puede ser relleno o una letra auténtica.',
  'Es un cifrado histórico educativo: las regularidades de los dígrafos permiten su criptoanálisis. No se usa para proteger información actual.',
];
export const sources = [
  {
    title: 'University of Central Florida · Playfair Cipher',
    url: 'https://www.cs.ucf.edu/~dmarino/ucf/cis3362/lectures/newlecs/Playfair.pdf',
  },
];
