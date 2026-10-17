<script setup lang="ts">
import { computed, ref } from 'vue';
import Collapsible from '../../components/ui/Collapsible.vue';
import PlayfairPlayground from './PlayfairPlayground.vue';
import { decryptPlayfair, normalizePlayfair } from '../../ciphers/playfair';
import { example, rules, theory, sources } from './content';
const keyword = ref(example.keyword);
const text = ref(example.text);
const practice = computed(() => decryptPlayfair(text.value, keyword.value));
const pairs = computed(
  () => normalizePlayfair(text.value).match(/../g)?.join(' ') ?? '',
);
const inputCls =
  'w-full rounded-xl border-2 border-sky-300 bg-white p-2.5 font-mono text-base outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 dark:border-sky-800 dark:bg-slate-950';
const restore = () => {
  keyword.value = example.keyword;
  text.value = example.text;
};
</script>

<template>
  <div class="space-y-4">
    <PlayfairPlayground />
    <div class="space-y-2">
      <p
        class="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400"
      >
        Material de apoyo
      </p>
      <Collapsible title="Definición" icon="📖">
        <p>
          Playfair utiliza una cuadrícula de 5 × 5 construida con una palabra
          clave. Cada par de letras cifradas se transforma según sus posiciones
          en esa cuadrícula.
        </p>
        <p class="font-mono">
          misma fila → izquierda · misma columna → arriba · rectángulo →
          intercambiar columnas
        </p>
        <p>
          La clave debe ser la misma usada al cifrar. El descifrado devuelve el
          texto preparado, incluyendo su posible relleno.
        </p>
      </Collapsible>
      <Collapsible title="Teoría en puntos" icon="📌">
        <ul class="list-disc space-y-2 pl-5">
          <li v-for="point in theory" :key="point">{{ point }}</li>
        </ul>
      </Collapsible>
      <Collapsible title="Práctica resuelta paso a paso" icon="✍️">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block font-semibold">Palabra clave</span>
            <input
              v-model="keyword"
              type="text"
              spellcheck="false"
              autocomplete="off"
              :class="inputCls"
            />
          </label>
          <label class="block">
            <span class="mb-1 block font-semibold">Texto cifrado</span>
            <input
              v-model="text"
              type="text"
              spellcheck="false"
              autocomplete="off"
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
            Descifra <b class="font-mono">{{ text }}</b> con la clave
            <b class="font-mono">{{ keyword }}</b
            >.
          </p>
          <ol class="list-decimal space-y-1 pl-5">
            <li>
              Escribe la clave sin duplicados y completa la cuadrícula con las
              letras restantes, fusionando I/J.
            </li>
            <li>Divide el criptograma en pares: {{ pairs || '—' }}.</li>
            <li>Localiza cada par y aplica su regla, manteniendo el orden.</li>
            <li>
              Une los pares y conserva las letras de posible relleno: no se
              puede decidir automáticamente cuáles pertenecían al mensaje.
            </li>
          </ol>
        </template>
        <div v-if="practice.ok" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <caption class="sr-only">
              Descifrado de cada dígrafo del ejemplo
            </caption>
            <thead>
              <tr>
                <th class="p-2">Entrada</th>
                <th class="p-2">Regla</th>
                <th class="p-2">Salida</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(step, i) in practice.steps"
                :key="i"
                class="border-t border-slate-200 dark:border-slate-700"
              >
                <td class="p-2 font-mono text-sky-600 dark:text-sky-400">
                  {{ step.input }}
                </td>
                <td class="p-2">{{ rules[step.rule] }}</td>
                <td
                  class="p-2 font-mono font-bold text-emerald-600 dark:text-emerald-400"
                >
                  {{ step.output }}
                </td>
              </tr>
            </tbody>
          </table>
          <p class="mt-2 font-mono">
            {{ text }} → <strong>{{ practice.output }}</strong>
          </p>
        </div>
      </Collapsible>
      <Collapsible title="Fuentes de la lección" icon="🔎">
        <ul>
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
          Se adopta el cuadrado clásico con I/J. Las convenciones de relleno
          pueden variar; esta lección conserva las letras recuperadas.
        </p>
      </Collapsible>
    </div>
  </div>
</template>
