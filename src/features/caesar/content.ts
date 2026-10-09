export const definition = {
  summary:
    'El cifrado César es un cifrado por sustitución monoalfabética: cada letra del mensaje se reemplaza por la que está k posiciones más adelante en el alfabeto. El número k es la clave.',
  encrypt: 'E(x) = (x + k) mod n',
  decrypt: 'D(x) = (x − k) mod n',
  legend: 'x = posición de la letra (A = 0), k = desplazamiento (clave), n = tamaño del alfabeto.',
}

export const theory: string[] = [
  'Origen: atribuido a Julio César, que lo usaba con k = 3 para sus mensajes militares.',
  'Tipo: sustitución monoalfabética; la misma letra siempre se cifra igual.',
  'Clave: un único número k. Hay solo n − 1 claves útiles (25 en inglés, 26 en español).',
  'Descifrar: se aplica el desplazamiento inverso (−k).',
  'ROT13 es el caso k = 13 en alfabeto inglés: cifrar dos veces devuelve el texto original.',
  'Debilidad 1: fuerza bruta; basta probar todas las claves posibles.',
  'Debilidad 2: análisis de frecuencias; la letra más común del texto cifrado suele corresponder a «E» o «A».',
  'Hoy no es seguro, pero es la base para entender cifrados como Vigenère.',
]

export const practice = {
  text: 'HOLA',
  shift: 3,
  alphabet: 'es' as const,
  steps: [
    'Escribe el alfabeto y numera las letras desde 0 (A = 0, B = 1…).',
    'Reemplaza cada letra por su número x.',
    'Suma la clave: x + k.',
    'Si el resultado llega a n o más, resta n (aplica mod n).',
    'Convierte el número resultante de nuevo en letra.',
  ],
}
