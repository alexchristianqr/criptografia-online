export const example = { p: '61', q: '53', e: '17', text: 'Hola Bob' } as const;

export const theory = [
  'En la criptografía simétrica (César, Hill…) las dos personas comparten la misma clave secreta. En la asimétrica cada persona tiene un par de claves matemáticamente ligadas: una pública y una privada.',
  'Analogía: la clave pública es un candado abierto que Alicia reparte a todo el mundo; cualquiera puede cerrar una caja con él, pero solo Alicia tiene la llave (la clave privada) para abrirla.',
  'Para generar el par: elige dos primos p y q, calcula n = p·q y φ(n) = (p−1)(q−1), elige e con mcd(e, φ) = 1 y calcula d = e⁻¹ mod φ. Pública = (e, n); privada = (d, n).',
  'Cifrar: c = mᵉ mod n con la pública. Descifrar: m = cᵈ mod n con la privada. Funciona porque e·d ≡ 1 (mod φ).',
  'Seguridad: conocer n no basta para obtener d; habría que factorizar n en p·q. Con 61·53 es trivial, pero con primos de 1024 bits ningún ordenador actual puede hacerlo.',
  'Firma digital: el proceso se invierte. Alicia calcula el hash del mensaje (SHA-256) y lo eleva a su clave privada: s = hᵈ mod n. Cualquiera verifica con la pública: sᵉ mod n debe ser igual al hash del mensaje recibido.',
  'Se firma el hash y no el mensaje completo porque es mucho más corto y rápido, y porque cualquier cambio en el mensaje, aunque sea una letra, cambia el hash por completo. Así la firma garantiza integridad (nadie lo alteró) y autenticidad (solo Alicia pudo firmarlo).',
  'Aviso: este laboratorio es didáctico. Primos pequeños se rompen al instante, cifrar byte a byte es inseguro (patrones repetidos) y aquí el hash se reduce módulo n, lo que permite colisiones accidentales. RSA real usa claves de 2048 bits o más, relleno OAEP para cifrar y PSS para firmar.',
];

export const sources = [
  { title: 'Wikipedia · RSA', url: 'https://es.wikipedia.org/wiki/RSA' },
  {
    title: 'Wikipedia · Firma digital',
    url: 'https://es.wikipedia.org/wiki/Firma_digital',
  },
  {
    title: 'RFC 8017 · PKCS #1: RSA Cryptography Specifications v2.2',
    url: 'https://datatracker.ietf.org/doc/html/rfc8017',
  },
  {
    title: 'NIST · FIPS 180-4 Secure Hash Standard (SHA-256)',
    url: 'https://csrc.nist.gov/pubs/fips/180-4/upd1/final',
  },
];
