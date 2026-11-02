# Spec: RSA — Cifrado asimétrico y firma con hash

- **Estado:** implementada
- **Fecha:** 2026-11-02

## Objetivo
Enseñar criptografía asimétrica (par de claves pública/privada) de forma comprensible: cifrar con la clave pública, descifrar con la privada y firmar el *hash* de un mensaje con la privada para verificarlo con la pública. Se usa RSA con números pequeños (reproducible a mano) y SHA-256 real.

## Alcance
**Incluye:** generación de claves paso a paso (p, q, n, φ, e, d), cifrar, descifrar, firmar, verificar, detección de mensaje alterado, escena Alicia/Bob/Eva, definición, teoría, práctica resuelta editable y fuentes.
**No incluye:** claves de tamaño real (≥2048 bits), relleno OAEP/PSS, generación aleatoria de primos grandes, certificados ni Diffie-Hellman.

## Historias de usuario
- Como estudiante, quiero ver cómo nacen una clave pública y una privada a partir de dos primos.
- Como estudiante, quiero cifrar con la pública y comprobar que solo la privada recupera el mensaje.
- Como estudiante, quiero firmar un mensaje con hash y ver que cualquier alteración invalida la firma.

## Criterios de aceptación
- **CA-1:** El catálogo ofrece «RSA» en `#rsa`, con carga diferida y navegación existente.
- **CA-2:** Se editan p, q y e (ejemplo 61, 53, 17). Se muestran n = p·q, φ(n) = (p−1)(q−1), mcd(e, φ) y d = e⁻¹ mod φ con los pasos de Euclides extendido. Se presentan la **clave pública (e, n)** («se comparte») y la **clave privada (d, n)** («se guarda»).
- **CA-3:** `validateRsaParams` exige p y q enteros, primos y distintos entre 11 y 9973, n > 255, 1 < e < φ y mcd(e, φ) = 1. Los errores explican el motivo; con entrada inválida no se muestra resultado ni traza obsoletos.
- **CA-4:** Cifrar: el texto se pasa a bytes UTF-8 y cada byte m produce c = mᵉ mod n. Se muestra la lista de números cifrados y, al seleccionar un bloque (clic/teclado), su traza: carácter, m, cálculo por cuadrados sucesivos y c.
- **CA-5:** Descifrar: lista de números separados por espacios o comas → m = cᵈ mod n → texto UTF-8. Errores visibles si hay valores no enteros, vacíos, ≥ n o bytes que no forman UTF-8 válido. Cifrar y descifrar con el par correcto devuelve el original. «Pasar resultado a entrada» alterna el modo.
- **CA-6:** Firmar: h = SHA-256(mensaje) en hexadecimal; h' = h mod n (simplificación didáctica explicada); firma s = h'ᵈ mod n.
- **CA-7:** Verificar: dados mensaje y firma, se calcula h' del mensaje y sᵉ mod n; coinciden → «Firma válida», si no → «Firma inválida». «Alterar una letra» modifica el mensaje y muestra el nuevo hash y la verificación fallida. El resultado del hash nunca es obsoleto (se descarta el cálculo asíncrono antiguo).
- **CA-8:** Una escena Alicia/Bob/Eva indica, según el modo, qué clave usa cada uno y qué viaja por el canal público.
- **CA-9:** Vectores: p=61, q=53, e=17 → n=3233, φ=3120, d=2753; m=65 → c=2790 → 65. SHA-256("abc") = `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`.
- **CA-10:** Laboratorio primero; Collapsible con definición, teoría (simétrico vs asimétrico, analogía candado/buzón, dificultad de factorizar n, por qué se firma el hash, aviso de inseguridad de claves pequeñas y cifrado por byte), práctica resuelta con texto y claves editables y «Restaurar ejemplo» (entrada a demanda), y fuentes. Entrada azul/salida verde, tema claro/oscuro, móvil, controles etiquetados y errores accesibles, coherentes con Hill.
- **CA-11:** Copiar comunica éxito/fallo; Reiniciar restaura el ejemplo.

## Preguntas abiertas
Ninguna bloqueante. La reducción h mod n es solo didáctica; RSA real firma con relleno PSS.
