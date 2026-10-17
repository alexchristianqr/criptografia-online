# Spec: Playfair Descifrado

- **Estado:** implementada
- **Fecha:** 2026-10-17

## Objetivo
Añadir una lección de descifrado Playfair que permita comprender la matriz de clave y seguir cada dígrafo, con el estilo de César y Permutación.

## Alcance
**Incluye:** laboratorio reactivo de descifrado con palabra clave, cuadrícula 5 × 5, selección de dígrafos, explicación de reglas, copiar resultado, reiniciar ejemplo, definición, teoría y práctica resuelta. Integración en catálogo y navegación hash.
**No incluye:** cifrado Playfair como modo de laboratorio, recuperación automática de claves ni eliminación automática del relleno.

## Historias de usuario
- Como estudiante, quiero introducir una clave y un criptograma para ver cómo se recuperan sus letras.
- Como estudiante, quiero seleccionar un dígrafo y ver sus posiciones y la regla aplicada.
- Como estudiante, quiero distinguir el texto recuperado del mensaje original, cuyo formato y relleno son ambiguos.

## Criterios de aceptación
- **CA-1:** El catálogo ofrece «Playfair Descifrado» en `#playfair-descifrado` con carga diferida y navegación móvil existente.
- **CA-2:** La clave se convierte a mayúsculas, sin diacríticos (Ñ → N), se conservan solo A–Z y J se convierte en I. Se eliminan duplicados conservando el orden y se completa por filas con ABCDEFGHIKLMNOPQRSTUVWXYZ. Una clave sin letras genera un error explicativo.
- **CA-3:** El criptograma usa la misma normalización; se muestra el texto normalizado y se explica la fusión I/J. No se reconstruyen espacios, tildes ni Ñ.
- **CA-4:** El texto se divide en pares sin insertar separadores ni relleno. Longitud impar o un par con letras iguales produce un error visible, sin resultado parcial ni pasos obsoletos. La entrada vacía produce resultado vacío.
- **CA-5:** Misma fila desplaza una columna a la izquierda, misma columna una fila hacia arriba, con retorno circular; un rectángulo conserva filas e intercambia columnas. Cada paso conserva el orden de las letras y muestra entrada, salida, coordenadas y regla.
- **CA-6:** La cuadrícula resalta entrada y salida del par seleccionado con leyenda y explicación textual; la selección funciona con teclado y clic, y se ajusta al editar el texto o la clave.
- **CA-7:** Ejemplo inicial: clave MONARCHY, criptograma GATLMZCLRQXA, salida INSTRUMENTSX. Se conserva toda X y se explica que no se puede decidir automáticamente si era relleno o parte del mensaje; tampoco se recupera la distinción I/J.
- **CA-8:** Laboratorio primero; material de apoyo en Collapsible (definición, teoría, práctica resuelta y fuentes). Tarjetas, pasos numerados, colores de entrada/salida, diseño adaptable y tema claro/oscuro coherentes con los módulos actuales. Etiquetas asociadas a controles y errores accesibles.
- **CA-9:** Copiar copia la salida válida y comunica éxito o fallo; reiniciar restaura clave, ejemplo y selección. Copiar queda deshabilitado con error o resultado vacío.

## Preguntas abiertas
Ninguna bloqueante. Se propone un módulo dedicado a descifrado según lo solicitado.

## Ampliación: entrada a demanda en la práctica
- **CA-11:** La «Práctica resuelta» tiene palabra clave y texto cifrado editables; los pasos descriptivos, la tabla de dígrafos y el resultado se recalculan con la misma validación del laboratorio (clave sin letras, longitud impar, pares iguales). Con entrada inválida se muestra el error y ninguna tabla obsoleta. «Restaurar ejemplo» vuelve a `MONARCHY` / `GATLMZCLRQXA`.
