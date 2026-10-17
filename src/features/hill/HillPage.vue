<script setup lang="ts">
import Collapsible from '../../components/ui/Collapsible.vue';
import HillPlayground from './HillPlayground.vue';
import { ref, computed } from 'vue';
import { parseHillKey, transformHill } from '../../ciphers/hill';
import { examples, theory, sources } from './content';
const example = examples[2];
const exampleKey = example.key.flat().join(' ');
const text = ref<string>(example.text);
const keyText = ref(exampleKey);
const parsedKey = computed(() => parseHillKey(keyText.value));
const practice = computed(() =>
  parsedKey.value.ok
    ? transformHill(text.value, parsedKey.value.key, 'cifrar')
    : { ok: false as const, error: parsedKey.value.error },
);
const matrixLabel = computed(() =>
  parsedKey.value.ok
    ? '[' + parsedKey.value.key.map((r) => `[${r.join(', ')}]`).join(', ') + ']'
    : '',
);
const inputCls =
  'w-full rounded-xl border-2 border-sky-300 bg-white p-2.5 font-mono text-base outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 dark:border-sky-800 dark:bg-slate-950';
const restore = () => {
  text.value = example.text;
  keyText.value = exampleKey;
};
</script>

<template>
  <div class="space-y-4">
    <HillPlayground />
    <div class="space-y-2">
      <p
        class="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400"
      >
        Material de apoyo
      </p>
      <Collapsible title="Definición" icon="📖">
        <p>
          El cifrado Hill transforma bloques de letras mediante una matriz
          clave. Cada letra se representa por un número de 0 a 25; las
          operaciones se realizan módulo 26.
        </p>
        <p class="font-mono">C = K · P mod 26<br />P = K⁻¹ · C mod 26</p>
        <p>
          K es una matriz invertible módulo 26; P y C son vectores columna de
          texto plano y cifrado. Para claves 2 × 2 se usan pares, y para 3 × 3,
          ternas.
        </p>
      </Collapsible>
      <Collapsible title="Teoría en puntos" icon="📌"
        ><ul class="list-disc space-y-2 pl-5">
          <li v-for="point in theory" :key="point">{{ point }}</li>
        </ul></Collapsible
      >
      <Collapsible title="Práctica resuelta paso a paso" icon="✍️">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block font-semibold">Texto a cifrar</span>
            <input
              v-model="text"
              type="text"
              spellcheck="false"
              :class="inputCls"
            />
          </label>
          <label class="block">
            <span class="mb-1 block font-semibold"
              >Clave K
              <span class="text-sm font-normal text-slate-500"
                >(por filas, 0–25: 4 números = 2 × 2, 9 = 3 × 3)</span
              ></span
            >
            <input
              v-model="keyText"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              spellcheck="false"
              :aria-invalid="!parsedKey.ok"
              :class="inputCls"
            />
          </label>
        </div>
        <button
          class="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          @click="restore"
        >
          ↺ Restaurar ejemplo
        </button>
        <p
          v-if="!practice.ok"
          class="text-sm text-rose-600 dark:text-rose-400"
          role="alert"
        >
          {{ practice.error }}
        </p>
        <template v-else>
          <p>
            Cifra <b class="font-mono">{{ text }}</b> con
            <code>K = {{ matrixLabel }}</code
            >.
          </p>
          <ol class="list-decimal space-y-2 pl-5">
            <li>
              Comprueba la clave: det(K) =
              {{ practice.analysis.determinant }} (≡
              {{ practice.analysis.determinantMod }} mod 26). Como mcd({{
                practice.analysis.determinantMod
              }}, 26) = {{ practice.analysis.gcd }}, tiene inversa.
            </li>
            <li>
              Normaliza el texto a
              <b class="font-mono">{{ practice.normalized }}</b> y divídelo en
              bloques de {{ practice.effectiveKey.length }}.
              <template v-if="practice.padding > 0"
                >Se añaden {{ practice.padding }} X de relleno.</template
              ><template v-else>No hace falta relleno.</template>
            </li>
            <li>
              Convierte cada bloque en un vector columna con A = 0, …, Z = 25.
            </li>
            <li>
              Multiplica cada fila de K por el vector y toma el residuo módulo
              26.
            </li>
          </ol>
        </template>
        <div v-if="practice.ok" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <caption class="sr-only">
              Operaciones de los bloques del ejemplo Hill
            </caption>
            <thead>
              <tr>
                <th class="p-2">Bloque</th>
                <th class="p-2">Sumas → residuos</th>
                <th class="p-2">Salida</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(block, i) in practice.blocks"
                :key="i"
                class="border-t border-slate-200 font-mono dark:border-slate-700"
              >
                <td class="p-2 text-sky-700 dark:text-sky-300">
                  {{ block.input }}
                </td>
                <td class="p-2">
                  [{{ block.sums.join(', ') }}] → [{{
                    block.outputValues.join(', ')
                  }}]
                </td>
                <td
                  class="p-2 font-bold text-emerald-700 dark:text-emerald-300"
                >
                  {{ block.output }}
                </td>
              </tr>
            </tbody>
          </table>
          <p class="mt-2 font-mono">
            {{ text }} → <b>{{ practice.output }}</b>
          </p>
        </div>
        <p v-if="practice.ok && practice.analysis.inverse">
          Para descifrar usa K⁻¹ = [{{
            practice.analysis.inverse
              .map((r) => `[${r.join(', ')}]`)
              .join(', ')
          }}] (módulo 26). Multiplicar cada bloque del resultado por K⁻¹
          devuelve el texto preparado, incluyendo las X de relleno si se
          añadieron.
        </p>
        <p>Prueba también el ejemplo 3 × 3 del laboratorio: ACT → POH.</p>
      </Collapsible>
      <Collapsible title="Fuentes de la lección" icon="🔎"
        ><ul class="space-y-1">
          <li v-for="source in sources" :key="source.url">
            <a
              :href="source.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-brand-600 underline dark:text-brand-500"
              >{{ source.title }}</a
            >
          </li>
        </ul>
        <p>
          Convenciones del laboratorio: vectores columna, A=0, módulo 26 y
          relleno X solo al cifrar.
        </p></Collapsible
      >
    </div>
  </div>
</template>
