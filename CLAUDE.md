# criptografia-online

Plataforma web educativa de criptografía: cursos con lecciones interactivas (teoría, práctica y laboratorio).
Stack: Vue 3 + TypeScript + Vite + Tailwind v4. Tests con Vitest.

## Fuente de verdad: `.specs/`

La carpeta `.specs/` es la **fuente de verdad** del proyecto. Si el código y una spec discrepan, la spec manda (o se actualiza la spec primero, con acuerdo del usuario).

Usamos **Spec Driven Development (SDD)**: se documenta y especifica ANTES de codificar.

### Flujo obligatorio

1. **Leer** `.specs/README.md` y las specs relacionadas antes de tocar código.
2. **Especificar**: para toda funcionalidad nueva o cambio de comportamiento, crear/actualizar la spec en `.specs/features/<nombre>/` usando `.specs/templates/`:
   - `spec.md` — qué y por qué: objetivo, alcance, historias de usuario, criterios de aceptación.
   - `design.md` — cómo: arquitectura, archivos afectados, modelos de datos/tipos, decisiones y alternativas.
   - `tasks.md` — lista de tareas verificables, ordenadas, con referencia a criterios de aceptación.
3. **Validar**: presentar la spec al usuario y esperar aprobación antes de implementar.
4. **Implementar** siguiendo `tasks.md`, marcando tareas completadas. Los tests derivan de los criterios de aceptación.
5. **Sincronizar**: si durante la implementación cambia algo, actualizar la spec en el mismo cambio.

No se escribe código de funcionalidad sin spec aprobada. Excepciones (typos, formato, dependencias menores) no requieren spec.

### Estructura

```
.specs/
├── README.md          # Índice y reglas SDD
├── templates/         # spec.md, design.md, tasks.md
├── product.md         # Visión, público objetivo, catálogo de cursos
├── architecture.md    # Arquitectura global y convenciones técnicas
└── features/<nombre>/ # Una carpeta por funcionalidad (caesar, permutation, ...)
```

## Comandos

- `npm run dev` — servidor de desarrollo
- `npm test` — tests (Vitest)
- `npm run typecheck` — TypeScript
- `npm run format` / `format:check` — Prettier
- `npm run build` — typecheck + build (despliegue a GitHub Pages)

## Convenciones

- Algoritmos de cifrado: funciones puras en `src/ciphers/<nombre>.ts` con test `<nombre>.test.ts`.
- UI de cada lección en `src/features/<nombre>/`; componentes compartidos en `src/components/`.
- Cursos registrados en `src/courses.ts`.
- Idioma de la UI, specs y commits: español.
- Ejecutar `npm run typecheck` y `npm test` antes de dar una tarea por terminada.
