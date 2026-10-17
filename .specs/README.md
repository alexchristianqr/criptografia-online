# .specs — Fuente de verdad

Aquí vive toda la documentación que define el producto. **Se escribe antes de codificar** (Spec Driven Development).

## Ciclo

`Especificar → Diseñar → Tareas → Aprobar → Implementar → Sincronizar`

| Documento | Responde | Ubicación |
|---|---|---|
| `product.md` | ¿Para quién y qué ofrecemos? | raíz |
| `architecture.md` | ¿Cómo está construido el sistema? | raíz |
| `spec.md` | ¿Qué y por qué de una feature? | `features/<nombre>/` |
| `design.md` | ¿Cómo se construirá? | `features/<nombre>/` |
| `tasks.md` | ¿Qué pasos verificables hay? | `features/<nombre>/` |

## Reglas

- Una carpeta por feature en `features/`, nombre en kebab-case.
- Estados de una spec: `borrador` → `aprobada` → `implementada`.
- Los criterios de aceptación son verificables y numerados (`CA-1`, `CA-2`...); los tests los referencian.
- Cambios de comportamiento: primero la spec, luego el código.

## Features

| Feature | Estado |
|---|---|
| [caesar](features/caesar/spec.md) | implementada |
| [permutation](features/permutation/spec.md) | borrador |
