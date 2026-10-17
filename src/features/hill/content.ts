export const examples = {
  2: {
    key: [
      [3, 3],
      [2, 5],
    ],
    text: 'HELP',
    ciphertext: 'HIAT',
  },
  3: {
    key: [
      [6, 24, 1],
      [13, 16, 10],
      [20, 17, 15],
    ],
    text: 'ACT',
    ciphertext: 'POH',
  },
} as const;
export const theory = [
  'Hill es una sustitución por bloques basada en álgebra lineal: varias letras contribuyen a cada letra de salida.',
  'Usamos 26 letras y la correspondencia A=0, B=1, …, Z=25. El bloque se escribe como vector columna.',
  'Para cifrar, multiplica cada fila de K por el vector de entrada y reduce cada suma módulo 26.',
  'Para descifrar, aplica K⁻¹ módulo 26. Una matriz tiene inversa modular si y solo si mcd(det(K), 26) = 1; que el determinante no sea cero es insuficiente.',
  'La inversa se obtiene con K⁻¹ = det(K)⁻¹ · adj(K) mod 26. La adjunta es la transpuesta de la matriz de cofactores.',
  'Solo se añaden X al cifrar un último bloque incompleto. Al descifrar se conservan, porque podrían pertenecer al mensaje original.',
  'Es un cifrado educativo e histórico. Su linealidad permite ataques con texto conocido; no es adecuado para proteger datos actuales.',
];
export const sources = [
  {
    title: 'University of Rhode Island · Hill Cipher',
    url: 'https://www.cs.uri.edu/cryptography/classical-ciphers/hill/article.html',
  },
  {
    title: 'Emory University · The Hill Cipher',
    url: 'https://math.oxford.emory.edu/site/math125/hillCipher/',
  },
  {
    title: 'Stony Brook University · The Hill Cipher',
    url: 'https://www.math.stonybrook.edu/~scott/papers/MSTP/crypto/8Hill_Cipher.html',
  },
];
