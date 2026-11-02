<script setup lang="ts">
import Collapsible from '../../components/ui/Collapsible.vue';
import RsaPlayground from './RsaPlayground.vue';
import { computed, ref } from 'vue';
import { decryptRsa, encryptRsa, validateRsaParams } from '../../ciphers/rsa';
import { example, theory, sources } from './content';

const p = ref<string>(example.p),
  q = ref<string>(example.q),
  e = ref<string>(example.e),
  text = ref<string>(example.text);
const num = (s: string) => (s.trim() === '' ? NaN : Number(s));
const keyResult = computed(() =>
  validateRsaParams(num(p.value), num(q.value), num(e.value)),
);
const practice = computed(() => {
  if (!keyResult.value.ok) return null;
  const { keys } = keyResult.value;
  const enc = encryptRsa(text.value, keys.e, keys.n);
  const dec = decryptRsa(enc.output, keys.d, keys.n);
  return { keys, enc, dec };
});
const fields = [
  { label: 'p (primo)', model: p },
  { label: 'q (primo)', model: q },
  { label: 'e', model: e },
] as const;
const inputCls =
  'w-full rounded-xl border-2 border-sky-300 bg-white p-2.5 font-mono text-base outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 dark:border-sky-800 dark:bg-slate-950';
const restore = () => {
  p.value = example.p;
  q.value = example.q;
  e.value = example.e;
  text.value = example.text;
};
</script>

<template>
  <div class="space-y-4">
    <RsaPlayground />
    <div class="space-y-2">
      <p
        class="px-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
      >
        Material de apoyo
      </p>
      <Collapsible title="Definición" icon="📖">
        <p>
          RSA es un cifrado <b>asimétrico</b>: usa un par de claves, una
          <b>pública</b> (se puede compartir) y una <b>privada</b> (se guarda).
          Lo que se cifra con una solo se abre con la otra.
        </p>
        <p class="font-mono">
          Cifrar: c = mᵉ mod n<br />Descifrar: m = cᵈ mod n<br />Firmar: s =
          hash(m)ᵈ mod n<br />Verificar: sᵉ mod n = hash(m)
        </p>
        <p>
          Cifrar protege la <b>confidencialidad</b>; firmar con hash demuestra
          <b>integridad y autoría</b>.
        </p>
      </Collapsible>
      <Collapsible title="Teoría en puntos" icon="📌"
        ><ul class="list-disc space-y-2 pl-5">
          <li v-for="point in theory" :key="point">{{ point }}</li>
        </ul></Collapsible
      >
      <Collapsible title="Práctica resuelta paso a paso" icon="✍️">
        <div class="grid gap-3 sm:grid-cols-4">
          <label v-for="f in fields" :key="f.label" class="block">
            <span class="mb-1 block font-semibold">{{ f.label }}</span>
            <input
              v-model="f.model.value"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              :aria-invalid="!keyResult.ok"
              :class="inputCls"
            />
          </label>
          <label class="block">
            <span class="mb-1 block font-semibold">Texto</span>
            <input
              v-model="text"
              type="text"
              spellcheck="false"
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
          v-if="!keyResult.ok"
          class="text-sm text-rose-700 dark:text-rose-400"
          role="alert"
        >
          {{ keyResult.error }}
        </p>
        <template v-else-if="practice">
          <ol class="list-decimal space-y-2 pl-5">
            <li>
              n = p · q = {{ practice.keys.p }} · {{ practice.keys.q }} =
              <b>{{ practice.keys.n }}</b
              >.
            </li>
            <li>
              φ(n) = (p−1)(q−1) = <b>{{ practice.keys.phi }}</b
              >.
            </li>
            <li>e = {{ practice.keys.e }} es válido porque mcd(e, φ) = 1.</li>
            <li>
              d = e⁻¹ mod φ = <b>{{ practice.keys.d }}</b> (comprobación:
              {{ practice.keys.e }} · {{ practice.keys.d }} mod
              {{ practice.keys.phi }} =
              {{ (practice.keys.e * practice.keys.d) % practice.keys.phi }}).
            </li>
            <li>
              Clave pública ({{ practice.keys.e }}, {{ practice.keys.n }});
              clave privada ({{ practice.keys.d }}, {{ practice.keys.n }}).
            </li>
            <li>
              Cada carácter se convierte en su byte m y se cifra con la pública;
              después se descifra con la privada.
            </li>
          </ol>
          <div v-if="practice.enc.blocks.length" class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <caption class="sr-only">
                Cifrado y descifrado por bloque
              </caption>
              <thead>
                <tr>
                  <th class="p-2">Carácter</th>
                  <th class="p-2">m</th>
                  <th class="p-2">c = mᵉ mod n</th>
                  <th class="p-2">cᵈ mod n</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(b, i) in practice.enc.blocks"
                  :key="i"
                  class="border-t border-slate-200 font-mono dark:border-slate-700"
                >
                  <td class="p-2 text-sky-700 dark:text-sky-300">
                    {{ b.label }}
                  </td>
                  <td class="p-2">{{ b.m }}</td>
                  <td
                    class="p-2 font-bold text-emerald-700 dark:text-emerald-300"
                  >
                    {{ b.c }}
                  </td>
                  <td class="p-2">
                    {{ practice.dec.ok ? practice.dec.blocks[i].m : '?' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="font-mono">
            {{ text }} → <b>{{ practice.enc.output.join(' ') }}</b>
          </p>
        </template>
        <p>
          Prueba el modo «Firmar» del laboratorio y luego «Verificar» con
          «Alterar una letra».
        </p>
      </Collapsible>
      <Collapsible title="Fuentes de la lección" icon="🔎"
        ><ul class="space-y-1">
          <li v-for="source in sources" :key="source.url">
            <a
              :href="source.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-brand-600 underline dark:text-indigo-400"
              >{{ source.title }}</a
            >
          </li>
        </ul></Collapsible
      >
    </div>
  </div>
</template>
