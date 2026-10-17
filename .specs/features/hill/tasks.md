# Tareas: Hill

- [x] T1 — Investigar fundamentos y revisar arquitectura; redactar especificación, diseño y tareas.
- [x] T2 — Obtener aprobación explícita de esta spec antes de implementar.
- [x] T3 — Implementar normalización, validación de matrices, determinante, mcd e inversa modular por adjunta (CA-2 a CA-5).
- [x] T4 — Implementar cifrado/descifrado, relleno y trazas con vectores columna (CA-5 a CA-8).
- [x] T5 — Crear laboratorio con editor 2 × 2 / 3 × 3, modos, selección, errores, copiar, intercambio y reinicio (CA-3, CA-4, CA-8, CA-9, CA-10).
- [x] T6 — Crear material de apoyo, práctica coherente con el algoritmo y referencias; registrar curso (CA-1, CA-7, CA-10).
- [x] T7 — Tests de HELP/HIAT y ACT/POH en ambos sentidos, identidad con inversa a izquierda/derecha, determinantes negativos, singularidad, determinante no coprimo, entradas/matrices inválidas, tildes/Ñ, vacío y relleno sin eliminación automática (CA-2 a CA-7).
- [x] T8 — Ejecutar npm run typecheck y npm test; revisar en código controles de teclado, estilos adaptables y temas (CA-1, CA-8 a CA-10).
- [x] T9 — Sincronizar documentación y marcar implementada tras completar todas las tareas.
- [x] T-ED — `parseHillKey`, práctica editable y restaurar ejemplo (CA-11, CA-12)

## Validación
- `npm test`: 43 pruebas correctas en cuatro archivos (incluye las ampliaciones concurrentes de práctica editable).
- `npm run typecheck` y `npm run build`: correctos.
- Revisión estática: controles etiquetados, selección mediante botones, estilos adaptables y tema oscuro. Se corrigieron claves duplicadas en tablas de práctica con bloques repetidos y la explicación de conservación de relleno.
- Revisión visual en navegador pendiente: la herramienta de control del navegador falló al crear la pestaña («Tab … is not part of browser session»). No se afirma validación visual.
