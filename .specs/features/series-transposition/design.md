# Diseño: Transposición por Series

## Enfoque
Construir una permutación global a partir de una clave de reglas ordenadas. Compartir la planificación entre cifrado y descifrado y producir una traza estructurada para la UI. Funciones puras TypeScript y componentes Vue; sin dependencias nuevas ni backend.

## Investigación
- Referencia principal: [Crypt4you · UPM, lección 7, apartado 2.3](https://www.criptored.es/crypt4you/temas/criptografiaclasica/leccion7.html). Describe series aplicadas al mensaje completo y publica un ejemplo con primos, pares y posiciones restantes. Se verificó aritméticamente su recorrido y criptograma para usarlo como vector conocido.
- Referencia complementaria: [Criptoclásicos, ficha oficial](https://www.criptored.es/software/sw_m001c.htm), que incluye transposición por series entre los sistemas educativos disponibles.
- Se detectó una inconsistencia en un [ejemplo del repositorio ESPOL](https://www.dspace.espol.edu.ec/retrieve/101135/D-CD38128.pdf): incluye la posición 1 en su grupo rotulado como primos. Por instrucción posterior del usuario, la regla del módulo incluye 1 para coincidir con su curso; se identifica esta convención en el editor y el material de apoyo.

## Decisiones y alternativas
- **Recorrido global:** el tamaño es la longitud del mensaje. El módulo Permutación existente usa bloques y relleno; su API no se reutiliza porque tiene otro contrato.
- **Solapamientos:** gana la primera regla; se registran las exclusiones. Evita duplicar letras y mantiene una permutación biyectiva.
- **Cobertura:** «Restantes» es siempre automático y final. Así no se pierden caracteres cuando las reglas no cubren todos los índices.
- **Clave propia:** reglas con tipos cerrados y parámetros validados, sin eval ni expresiones JavaScript. Se descarta un lenguaje de fórmulas para mantener la interfaz comprensible.
- **Orden:** las series matemáticas van en orden ascendente y las listas explícitas siguen el orden introducido. Estas últimas permiten ejemplos que no se expresen con las reglas predefinidas.
- **Normalización:** conservar Ñ y simplificar vocales acentuadas. La reversibilidad se garantiza respecto del texto normalizado.
- **Datos inválidos:** conservar el último resultado válido como estado independiente con rótulo explícito; bloquear acciones que lo harían pasar por resultado de los datos actuales. No modificar silenciosamente una clave explícita si cambia la longitud del texto.

## Archivos afectados
| Archivo | Cambio |
|---|---|
| `src/ciphers/series.ts` | Normalización, parseo, validación, generación de recorrido, transformación y traza |
| `src/ciphers/series.test.ts` | Vectores conocidos, reversibilidad, cobertura y errores |
| `src/features/series/SeriesPage.vue` | Material de apoyo y práctica editable independiente |
| `src/features/series/SeriesPlayground.vue` | Laboratorio, modos, resultado y acciones |
| `src/features/series/SeriesKeyEditor.vue` | Editor de reglas compartido por práctica y laboratorio |
| `src/features/series/SeriesTrace.vue` | Grupos, posiciones y correspondencia bidireccional |
| `src/features/series/content.ts` | Ejemplos, definición, teoría y fuentes |
| `src/courses.ts` | Registro con carga diferida después de Permutación |
| `src/style.css` | Solo si hace falta ampliar estilos compartidos de laboratorios |
| `.specs/README.md` | Registro y estado de la feature |

## Modelo / tipos / API
```ts
type SeriesRule =
  | { kind: 'primos' | 'pares' | 'impares' }
  | { kind: 'multiplos'; divisor: number }
  | { kind: 'posiciones'; positions: number[] }
type SeriesMode = 'cifrar' | 'descifrar'
interface SeriesGroup {
  ruleIndex: number | null // null = Restantes
  candidates: number[]
  skipped: number[]
  positions: number[]
  text: string // segmento cifrado, igual en ambos sentidos para el mismo mensaje
  cipherStart: number // desplazamiento base 0; el rango visible usa base 1
}
interface SeriesStep {
  plainPosition: number // base 1
  cipherPosition: number // base 1
  letter: string
  groupIndex: number
}
type SeriesResult =
  | { ok: true; normalized: string; output: string; order: number[];
      groups: SeriesGroup[]; steps: SeriesStep[] }
  | { ok: false; error: string; ruleIndex?: number }
// normalizeSeries(text: string): string
// parseSeriesPositions(input: string): resultado discriminado con positions o error
// validateSeriesKey(rules: SeriesRule[], length: number): resultado de validación
// transformSeries(text: string, rules: SeriesRule[], mode: SeriesMode): SeriesResult
```
La UI conserva borradores de parámetros como strings para distinguir vacío de cero. La conversión a reglas válidas ocurre antes de llamar al algoritmo; la API vuelve a validar por sí misma.

## Algoritmo
1. Normalizar el texto y obtener N.
2. Validar estructura y parámetros de reglas. Generar una criba de primos hasta N una sola vez si se necesita.
3. Recorrer reglas, seleccionar índices originales y filtrar los ya tomados mediante un conjunto; registrar candidatos y exclusiones.
4. Añadir índices restantes y concatenar el recorrido.
5. Cifrar leyendo por ese recorrido o descifrar colocando cada letra en su destino original.
6. Construir grupos y pasos con la misma planificación; los grupos vacíos no consumen letras del criptograma.

Con un máximo de ocho reglas, el recorrido y la traza tienen coste lineal respecto de N, más la criba O(N log log N). La UI limita la altura de secuencias extensas mediante desplazamiento; no trunca el cálculo ni el resultado copiado.

## Riesgos
- Confundir índice original con índice del mensaje restante: nunca renumerar tras extraer una serie.
- Descifrar grupos de longitudes distintas: segmentar con la cantidad de posiciones efectivas de cada grupo.
- Interpretar una lista explícita como conjunto ordenado ascendente: respetar su orden escrito.
- Reglas que absorben todas las letras antes de las siguientes: explicar grupos vacíos y conservarlos en la traza.
- Letras repetidas: identificar elementos por posición, no por su valor, también en las claves de renderizado.

## Detalles de implementación
- `src/features/series/useSeries.ts` crea estado independiente por instancia, convierte borradores con `parseSeriesDrafts` y conserva el último resultado y clave válidos.
- `SeriesPlayground` se reutiliza con la propiedad `practice` para mantener controles y validación coherentes sin compartir estado. Los identificadores de controles usan `useId`.
- Cada grupo incluye `label` para presentar su regla en la traza sin depender del borrador editable.

## Ajuste aprobado: convención de la universidad
- El usuario confirmó que su profesor incluye 1 en la primera serie. `kind: primos` selecciona 1 y los primos desde 2, manteniendo la criba matemática separada de la inclusión explícita de 1.
- Etiqueta y explicación identifican la convención del curso sin afirmar que 1 sea matemáticamente primo.
- El ejemplo por defecto pasa a ERRAR ES HUMANO PERDONAR DIVINO. Su resultado se documenta también en [material UC3M](https://ocw.uc3m.es/pluginfile.php/3968/mod_page/content/18/slides_l4.pdf).
- La referencia UPM anterior se sigue comprobando mediante posiciones explícitas.
