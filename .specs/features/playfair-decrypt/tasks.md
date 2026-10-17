# Tareas: Playfair Descifrado

- [x] T1 — Investigar reglas, revisar módulos y redactar especificación, diseño y tareas.
- [x] T2 — Obtener aprobación explícita de esta spec antes de implementar.
- [x] T3 — Implementar normalización, matriz y errores (CA-2, CA-3, CA-4).
- [x] T4 — Implementar descifrado y trazas; contrastar ejemplo MONARCHY y casos de fila, columna y retorno circular (CA-5, CA-7).
- [x] T5 — Crear laboratorio, selección accesible, copiar y reiniciar (CA-6, CA-8, CA-9).
- [x] T6 — Redactar definición, teoría, práctica con pasos y fuentes; registrar módulo (CA-1, CA-8).
- [x] T7 — Tests de clave repetida/vacía, J/I, tildes/Ñ, texto vacío/impar, pares iguales, tres reglas, bordes y conservación de X (CA-2 a CA-7).
- [x] T8 — Ejecutar npm run typecheck y npm test; revisar en código controles y estilos para móvil/claro/oscuro (CA-1, CA-6, CA-8, CA-9).
- [x] T9 — Sincronizar documentación y marcar implementada únicamente tras completar las tareas.
- [x] T-ED — Práctica editable con validación y restaurar ejemplo (CA-11)

## Validación
- `npm test`: 43 pruebas correctas en cuatro archivos (incluye las ampliaciones concurrentes de práctica editable).
- `npm run typecheck` y `npm run build`: correctos.
- Revisión estática: controles etiquetados, selección mediante botones, estilos adaptables y tema oscuro. Se corrigieron claves duplicadas en tablas de práctica con bloques repetidos y la explicación de conservación de relleno.
- Revisión visual en navegador pendiente: la herramienta de control del navegador falló al crear la pestaña («Tab … is not part of browser session»). No se afirma validación visual.
