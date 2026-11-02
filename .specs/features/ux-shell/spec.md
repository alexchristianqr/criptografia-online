# Spec: ux-shell (carga dinámica y mejoras UX/UI del shell)

- **Estado:** implementada
- **Fecha:** 2026-11-02

## Objetivo
Cada lección se carga bajo demanda (`defineAsyncComponent`) pero hoy el usuario no ve ningún estado mientras llega el chunk, ni si falla. Además el shell (cabecera, sidebar, ruteo por hash) carece de accesibilidad y orientación básicas. Se busca una experiencia fluida, accesible y pulida.

## Alcance
**Incluye:**
1. Estados de carga dinámica: skeleton de la lección, barra de progreso superior, error con "Reintentar", timeout.
2. Transición suave entre lecciones (respeta `prefers-reduced-motion`).
3. Navegación: enlaces reales (`<a href="#/id">`), precarga de chunk al pasar el ratón/foco, botones "Anterior / Siguiente" al final de cada lección, ruta desconocida → pantalla 404 con vuelta al inicio.
4. Accesibilidad: *skip link*, foco al `<h1>` tras navegar, `document.title` por lección, cierre del menú móvil con `Esc` y bloqueo de scroll del fondo, `aria-live` para el cambio de lección.
5. Progreso: marca de "visitada" por lección (localStorage) y contador en el sidebar.
6. Scroll al inicio al cambiar de lección; tema inicial según `prefers-color-scheme` sin parpadeo (si no estaba ya).
7. Metadatos: `<meta description>`, `theme-color`, `<noscript>`.

**No incluye:** vue-router, i18n, cuentas de usuario, cambios en algoritmos (`src/ciphers/`) ni en el contenido de las lecciones.

## Historias de usuario
- Como estudiante con conexión lenta, quiero ver que la lección está cargando para no pensar que la web se colgó.
- Como estudiante, quiero reintentar si la carga falla sin recargar toda la página.
- Como usuario de teclado o lector de pantalla, quiero saltar al contenido y que el foco/anuncio me oriente al cambiar de lección.
- Como estudiante, quiero ir a la lección siguiente y ver cuáles ya visité.

## Criterios de aceptación
- **CA-1:** Dado que el chunk de una lección tarda más de 150 ms, cuando navego a ella, entonces veo un skeleton y la barra de progreso superior; si carga antes, no hay parpadeo.
- **CA-2:** Dado que el chunk falla o supera 15 s, entonces veo un mensaje de error con botón "Reintentar" que vuelve a pedir el chunk sin recargar la página.
- **CA-3:** Cambiar de lección dispara una transición de fade; con `prefers-reduced-motion` no hay animación.
- **CA-4:** Los ítems del sidebar son `<a href="#/id">`; el ítem activo tiene `aria-current="page"`; hover/foco precarga el chunk una sola vez.
- **CA-5:** Una ruta `#/xyz` inexistente muestra 404 con enlace al inicio (no cae silenciosamente a César).
- **CA-6:** Tras navegar, el foco queda en el `<h1>`, `document.title` es "<Lección> · Criptografía Online" y el scroll vuelve arriba.
- **CA-7:** Existe un *skip link* visible al enfocarlo que lleva a `#contenido`.
- **CA-8:** Con el menú móvil abierto, `Esc` lo cierra, el fondo no hace scroll y el foco vuelve al botón del menú.
- **CA-9:** Al final de cada lección hay "← Anterior / Siguiente →" (omitiendo extremos); las lecciones "próximamente" se saltan.
- **CA-10:** Las lecciones visitadas muestran ✓ en el sidebar y hay un contador "N/M"; persiste tras recargar y la app funciona si localStorage no está disponible.
- **CA-11:** Los helpers puros (`nextPrev`, parseo de ruta, progreso) tienen tests Vitest.

## Preguntas abiertas
- ¿Incluir "marcar como completada" manual en vez de solo "visitada"? (por defecto: visitada automática).
