# Tareas: Transposición por Series

- [x] T1 — Revisar producto, arquitectura, módulos existentes y fuentes; redactar especificación y diseño.
- [x] T2 — Presentar propuesta y obtener aprobación antes de implementar.
- [x] T3 — Implementar normalización, tipos, parseo de posiciones y validación de parámetros y claves (CA-2, CA-3, CA-4).
- [x] T4 — Implementar reglas, criba, exclusiones y restantes con cobertura única de 1…N (CA-5, CA-6, CA-10).
- [x] T5 — Implementar descifrado y traza compartida de grupos y correspondencias (CA-7, CA-9).
- [x] T6 — Crear editor de reglas reutilizable, con controles de orden, añadir/eliminar y mensajes explicativos (CA-3, CA-4, CA-11, CA-12).
- [x] T7 — Crear laboratorio y visualización con selección accesible, modos, copia, intercambio y restauración (CA-8 a CA-12).
- [x] T8 — Crear definición, teoría, práctica editable independiente y referencias; registrar módulo (CA-1, CA-8, CA-11, CA-13).
- [x] T9 — Derivar tests: vector UPM por posiciones explícitas y vector universitario con 1 en la primera serie, solapamiento del 2, grupos vacíos, texto vacío/de una letra, Ñ Unicode, letras repetidas, listas ordenadas, reglas inválidas y parámetros no seguros (CA-2 a CA-10).
- [x] T10 — Verificar que el recorrido contiene exactamente 1…N y la salida conserva el multiconjunto de letras; probar reversibilidad para distintas longitudes, órdenes y reglas (CA-5 a CA-7).
- [x] T11 — Ejecutar npm run typecheck, npm test y npm run build; revisar en código estilos adaptables, controles de teclado y temas; comprobar edición independiente de práctica/laboratorio y renderizado SSR (CA-1, CA-9 a CA-12).
- [x] T12 — Sincronizar diseño y tareas con la implementación y actualizar el estado de la feature.

## Evidencia de validación
- `npm test`: 57 pruebas correctas en seis archivos; 14 pruebas nuevas para el algoritmo y el estado del módulo.
- Invariantes comprobadas con longitudes 0…100, diferentes reglas y ordenaciones: cobertura única de índices, conservación de frecuencias y reversibilidad.
- `npm run typecheck` y `npm run build`: correctos; módulo registrado con carga diferida.
- Renderizado SSR real de `SeriesPage`: laboratorio, práctica y trazas presentes; resultado de referencia correcto; 14 identificadores únicos y ocho etiquetas asociadas a sus controles.
- Prettier en archivos afectados y `git diff --check`: correctos.
- Revisión de teclado y estilos adaptable/claro/oscuro realizada en código. No se ha validado visualmente en un navegador.

## Ajuste solicitado por el usuario: incluir 1 en la primera serie
- [x] U1 — Registrar la convención aprobada y el vector universitario antes de cambiar código (CA-3, CA-8).
- [x] U2 — Adaptar selección, etiquetas, teoría y ejemplo inicial/restauración.
- [x] U3 — Comprobar resultado universitario en ambos sentidos, posición 1 en mensajes cortos y preservación de otras convenciones mediante listas explícitas.
- [x] U4 — Ejecutar pruebas, typecheck y build; sincronizar documentación.

Validación del ajuste: ejemplo universitario y descifrado correctos; posición 1 incluida en texto de una letra, vacío sin posiciones y solapamientos con reglas anteriores comprobados. `npm test` (57), `npm run typecheck` y `npm run build` correctos.
