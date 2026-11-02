# Diseño: ux-shell

## Arquitectura
- `src/components/ui/LessonSkeleton.vue` — placeholder animado (`animate-pulse`, `motion-reduce:animate-none`).
- `src/components/ui/LessonError.vue` — error + botón Reintentar (emite `retry`).
- `src/components/ui/RouteProgress.vue` — barra fina superior, visible mientras hay carga pendiente.
- `src/components/ui/NotFound.vue` — 404.
- `src/components/layout/LessonPager.vue` — Anterior/Siguiente.
- `src/composables/useProgress.ts` — `Set` de ids visitados, persistido en localStorage con try/catch.
- `src/lib/navigation.ts` (puro, con test) — `neighbors(modules, id)`, `resolveRoute(modules, hash)`.
- `src/courses.ts` — helper `lazyLesson(loader)` que envuelve `defineAsyncComponent({ loader, loadingComponent: LessonSkeleton, delay: 150, errorComponent: LessonError, timeout: 15000 })` y expone `preload()` en cada módulo (loader memoizado).
- `App.vue` — `<Transition mode="out-in">`, `<main id="contenido" tabindex="-1">`, skip link, foco/título/scroll en `watch(current)`, `aria-live="polite"`.
- `AppSidebar.vue` — `<a>` en lugar de `<button>`, `@mouseenter/@focus` → `preload`, ✓ y contador, `Esc` y scroll-lock.
- `index.html` — meta description, theme-color, noscript.

## Decisiones
- **Sin vue-router:** el hash actual basta; se evita dependencia nueva.
- **Skeleton con `delay: 150`** (built-in de `defineAsyncComponent`) para evitar parpadeo en cargas rápidas.
- **Reintento:** `errorComponent` recibe `retry`-prop vía `onError(error, retry, fail, attempts)`; se usa un `key` para remontar.
- **Progreso en localStorage**, nunca bloqueante.

## Alternativas descartadas
- Spinner global bloqueante (peor percepción de velocidad que un skeleton).
- Librería de transiciones/UI (peso innecesario).
