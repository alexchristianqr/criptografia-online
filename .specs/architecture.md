# Arquitectura

- **Frontend:** Vue 3 (Composition API) + TypeScript 7 + Vite + Tailwind v4.
- **Despliegue:** GitHub Pages (`.github/`).
- **Tests:** Vitest sobre `src/ciphers/`.

## Estructura de `src/`
- `ciphers/` — algoritmos puros, sin dependencias de UI, con tests.
- `features/<nombre>/` — lección/laboratorio de cada cifrado.
- `components/` — componentes UI compartidos.
- `composables/` — lógica reutilizable (p. ej. tema).
- `courses.ts` — catálogo de cursos.

## Convenciones
- Lógica criptográfica separada de la UI.
- Formato con Prettier.
