<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  alterMessage,
  decryptRsa,
  encryptRsa,
  hashToNumber,
  modPow,
  parseRsaCiphertext,
  signRsa,
  validateRsaParams,
  verifyRsa,
  type RsaMode,
} from '../../ciphers/rsa';
import { sha256Hex } from '../../ciphers/sha256';
import { useCopyResult } from '../../composables/useCopyResult';
import { example } from './content';

const pStr = ref<string>(example.p),
  qStr = ref<string>(example.q),
  eStr = ref<string>(example.e);
const text = ref<string>(example.text),
  cipherInput = ref(''),
  sigInput = ref('');
const mode = ref<RsaMode>('cifrar');
const selected = ref(0);

const num = (s: string) => (s.trim() === '' ? NaN : Number(s));
const keyResult = computed(() =>
  validateRsaParams(num(pStr.value), num(qStr.value), num(eStr.value)),
);
const keys = computed(() => (keyResult.value.ok ? keyResult.value.keys : null));

// Hash asíncrono: solo se usa si corresponde al texto actual.
const hashHex = ref(''),
  hashFor = ref<string | null>(null);
let revision = 0;
watch(
  text,
  async (t) => {
    const id = ++revision;
    const h = await sha256Hex(t);
    if (id === revision) {
      hashHex.value = h;
      hashFor.value = t;
    }
  },
  { immediate: true },
);
const hash = computed(() =>
  hashFor.value === text.value ? hashHex.value : '',
);
const hashMod = computed(() =>
  keys.value && hash.value ? hashToNumber(hash.value, keys.value.n) : null,
);

const enc = computed(() =>
  keys.value ? encryptRsa(text.value, keys.value.e, keys.value.n) : null,
);
const parsed = computed(() =>
  keys.value ? parseRsaCiphertext(cipherInput.value, keys.value.n) : null,
);
const dec = computed(() =>
  keys.value && parsed.value?.ok
    ? decryptRsa(parsed.value.values, keys.value.d, keys.value.n)
    : null,
);
const signature = computed(() =>
  keys.value && hash.value
    ? signRsa(hash.value, keys.value.d, keys.value.n)
    : null,
);
const sigValue = computed(() =>
  /^\d+$/.test(sigInput.value.trim()) ? BigInt(sigInput.value.trim()) : null,
);
const verification = computed(() => {
  if (!keys.value || !hash.value || sigValue.value === null) return null;
  const { e, n } = keys.value;
  return {
    valid: verifyRsa(hash.value, sigValue.value, e, n),
    recovered: sigValue.value < n ? modPow(sigValue.value, e, n).result : null,
  };
});

const error = computed(() => {
  if (!keyResult.value.ok) return keyResult.value.error;
  if (mode.value === 'descifrar') {
    if (parsed.value && !parsed.value.ok) return parsed.value.error;
    if (dec.value && !dec.value.ok) return dec.value.error;
  }
  if (
    mode.value === 'verificar' &&
    sigInput.value.trim() &&
    sigValue.value === null
  )
    return 'La firma debe ser un entero positivo.';
  return '';
});

const output = computed(() => {
  if (error.value) return '';
  if (mode.value === 'cifrar') return enc.value?.output.join(' ') ?? '';
  if (mode.value === 'descifrar') return dec.value?.ok ? dec.value.text : '';
  if (mode.value === 'firmar') return signature.value?.toString() ?? '';
  return '';
});
const { copyStatus, copy } = useCopyResult(output);

const blocks = computed(() => {
  if (error.value) return [];
  if (mode.value === 'cifrar')
    return enc.value?.blocks.map((b) => ({ label: b.label, shown: b.c })) ?? [];
  if (mode.value === 'descifrar' && dec.value?.ok)
    return dec.value.blocks.map((b) => ({ label: b.label, shown: b.m }));
  return [];
});

/** Cálculo modular explicado del bloque seleccionado (o de la firma/verificación). */
const trace = computed(() => {
  const k = keys.value;
  if (!k || error.value) return null;
  if (mode.value === 'cifrar') {
    const b = enc.value?.blocks[selected.value] ?? enc.value?.blocks[0];
    return (
      b && {
        title: `Cifrar «${b.label}»`,
        base: b.m,
        exp: k.e,
        expName: 'e',
        baseName: 'm',
        resultName: 'c',
        n: k.n,
      }
    );
  }
  if (mode.value === 'descifrar' && dec.value?.ok) {
    const b = dec.value.blocks[selected.value] ?? dec.value.blocks[0];
    return (
      b && {
        title: `Descifrar ${b.c}`,
        base: b.c,
        exp: k.d,
        expName: 'd',
        baseName: 'c',
        resultName: 'm',
        n: k.n,
      }
    );
  }
  if (mode.value === 'firmar' && hashMod.value !== null)
    return {
      title: 'Firmar el hash',
      base: hashMod.value,
      exp: k.d,
      expName: 'd',
      baseName: 'h′',
      resultName: 's',
      n: k.n,
    };
  if (
    mode.value === 'verificar' &&
    sigValue.value !== null &&
    sigValue.value < k.n
  )
    return {
      title: 'Recuperar el hash de la firma',
      base: sigValue.value,
      exp: k.e,
      expName: 'e',
      baseName: 's',
      resultName: 'h′',
      n: k.n,
    };
  return null;
});
const pow = computed(() =>
  trace.value ? modPow(trace.value.base, trace.value.exp, trace.value.n) : null,
);

const scene = computed(() => {
  const k = keys.value;
  const pub = k ? `(e, n) = (${k.e}, ${k.n})` : '(e, n)';
  const priv = k ? `(d, n) = (${k.d}, ${k.n})` : '(d, n)';
  switch (mode.value) {
    case 'cifrar':
      return [
        ['🧑‍💼', 'Bob', `Cifra con la clave pública de Alicia ${pub}.`],
        ['👩‍💻', 'Alicia', `Guarda en secreto su clave privada ${priv}.`],
        [
          '🕵️',
          'Eva',
          'Ve pasar los números cifrados, pero sin d no puede leerlos.',
        ],
      ];
    case 'descifrar':
      return [
        ['🧑‍💼', 'Bob', 'Envió los números cifrados por un canal público.'],
        ['👩‍💻', 'Alicia', `Descifra con su clave privada ${priv}.`],
        [
          '🕵️',
          'Eva',
          `Conoce la pública ${pub}, pero no puede deducir d sin factorizar n.`,
        ],
      ];
    case 'firmar':
      return [
        [
          '👩‍💻',
          'Alicia',
          `Calcula el hash y lo firma con su clave privada ${priv}.`,
        ],
        ['🧑‍💼', 'Bob', 'Recibirá mensaje + firma.'],
        [
          '🕵️',
          'Eva',
          'No puede crear una firma de Alicia sin su clave privada.',
        ],
      ];
    default:
      return [
        ['🧑‍💼', 'Bob', `Verifica con la clave pública de Alicia ${pub}.`],
        ['👩‍💻', 'Alicia', 'Su clave privada nunca sale de su equipo.'],
        [
          '🕵️',
          'Eva',
          'Si altera el mensaje, el hash cambia y la firma deja de coincidir.',
        ],
      ];
  }
});

watch([mode, text, cipherInput, pStr, qStr, eStr], () => {
  selected.value = 0;
  copyStatus.value = '';
});

const swapLabel = computed(
  () =>
    ({
      cifrar: 'Pasar a descifrar →',
      descifrar: '← Volver al texto',
      firmar: 'Pasar a verificar →',
      verificar: 'Pasar resultado',
    })[mode.value],
);
function swap() {
  if (!output.value) return;
  if (mode.value === 'cifrar') {
    cipherInput.value = output.value;
    mode.value = 'descifrar';
  } else if (mode.value === 'descifrar') {
    text.value = output.value;
    mode.value = 'cifrar';
  } else if (mode.value === 'firmar') {
    sigInput.value = output.value;
    mode.value = 'verificar';
  }
}
async function tamper() {
  if (!keys.value) return;
  text.value = await alterMessage(text.value, keys.value.n);
}
function reset() {
  pStr.value = example.p;
  qStr.value = example.q;
  eStr.value = example.e;
  text.value = example.text;
  cipherInput.value = '';
  sigInput.value = '';
  mode.value = 'cifrar';
}
const modes: { id: RsaMode; label: string }[] = [
  { id: 'cifrar', label: '🔒 Cifrar' },
  { id: 'descifrar', label: '🔓 Descifrar' },
  { id: 'firmar', label: '✍️ Firmar' },
  { id: 'verificar', label: '✅ Verificar' },
];
const keyFields = [
  { id: 'p', label: 'p (primo)', model: pStr },
  { id: 'q', label: 'q (primo)', model: qStr },
  { id: 'e', label: 'e (exponente)', model: eStr },
] as const;
</script>

<template>
  <section class="cipher-lab" aria-labelledby="rsa-title">
    <div
      class="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-4 text-white sm:px-6"
    >
      <div>
        <h2 id="rsa-title" class="text-xl font-semibold">
          🧪 Laboratorio de RSA
        </h2>
        <p class="text-sm text-white/90">
          Un par de claves: la pública cifra y verifica, la privada descifra y
          firma.
        </p>
      </div>
      <div
        class="inline-flex flex-wrap rounded-lg bg-black/20 p-1"
        role="group"
        aria-label="Modo de RSA"
      >
        <button
          v-for="m in modes"
          :key="m.id"
          class="rounded-md px-3 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-white"
          :class="
            mode === m.id
              ? 'bg-white text-indigo-800 shadow'
              : 'hover:bg-white/10'
          "
          :aria-pressed="mode === m.id"
          @click="mode = m.id"
        >
          {{ m.label }}
        </button>
      </div>
    </div>

    <ul
      class="grid gap-2 border-b border-slate-200 p-4 text-sm sm:grid-cols-3 sm:p-6 dark:border-slate-800"
      aria-label="Quién usa qué clave"
    >
      <li
        v-for="[icon, who, what] in scene"
        :key="who"
        class="flex gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700"
      >
        <span class="text-2xl" aria-hidden="true">{{ icon }}</span>
        <span
          ><b>{{ who }}</b
          ><br />{{ what }}</span
        >
      </li>
    </ul>

    <div class="grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <div class="space-y-4">
        <div
          class="space-y-3 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-500/10"
        >
          <p class="lab-label">
            <span class="lab-number bg-violet-700">1</span> Genera las claves de
            Alicia
          </p>
          <div class="grid grid-cols-3 gap-2">
            <label v-for="f in keyFields" :key="f.id" class="block text-sm">
              <span class="mb-1 block font-medium">{{ f.label }}</span>
              <input
                v-model="f.model.value"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                :aria-invalid="!keyResult.ok"
                class="lab-field p-2 text-center"
              />
            </label>
          </div>
          <p v-if="!keyResult.ok" class="lab-error" role="alert">
            {{ keyResult.error }}
          </p>
          <template v-else-if="keys">
            <ol class="space-y-1 font-mono text-sm">
              <li>
                n = p · q = {{ keys.p }} · {{ keys.q }} = <b>{{ keys.n }}</b>
              </li>
              <li>
                φ(n) = (p−1)(q−1) = {{ keys.p - 1n }} · {{ keys.q - 1n }} =
                <b>{{ keys.phi }}</b>
              </li>
              <li>mcd(e, φ) = 1 ✔ (e = {{ keys.e }})</li>
              <li>
                d = e⁻¹ mod φ = <b>{{ keys.d }}</b>
                <span class="text-slate-600 dark:text-slate-400"
                  >({{ keys.e }} · {{ keys.d }} mod {{ keys.phi }} =
                  {{ (keys.e * keys.d) % keys.phi }})</span
                >
              </li>
            </ol>
            <details class="text-sm">
              <summary class="cursor-pointer font-medium">
                Ver Euclides extendido (cómo se halla d)
              </summary>
              <ul class="mt-1 space-y-0.5 font-mono">
                <li v-for="(s, i) in keys.steps" :key="i">
                  {{ s.a }} = {{ s.q }} · {{ s.b }} + {{ s.r }}
                </li>
              </ul>
            </details>
            <div class="grid gap-2 sm:grid-cols-2">
              <div
                class="rounded-lg border-2 border-emerald-400 bg-white p-3 dark:bg-slate-950"
              >
                <p
                  class="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300"
                >
                  🔓 Clave pública · se comparte
                </p>
                <p class="font-mono">(e, n) = ({{ keys.e }}, {{ keys.n }})</p>
              </div>
              <div
                class="rounded-lg border-2 border-rose-400 bg-white p-3 dark:bg-slate-950"
              >
                <p
                  class="text-xs font-bold uppercase text-rose-700 dark:text-rose-300"
                >
                  🔑 Clave privada · se guarda
                </p>
                <p class="font-mono">(d, n) = ({{ keys.d }}, {{ keys.n }})</p>
              </div>
            </div>
          </template>
        </div>

        <div
          class="space-y-3 rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-500/10"
        >
          <p class="lab-label">
            <span class="lab-number bg-sky-700">2</span>
            {{ mode === 'descifrar' ? 'Números cifrados' : 'Mensaje' }}
          </p>
          <label v-if="mode === 'descifrar'" class="block">
            <span class="sr-only">Números cifrados separados por espacios</span>
            <textarea
              v-model="cipherInput"
              rows="3"
              spellcheck="false"
              placeholder="Ej.: 2790 1234 …"
              :aria-invalid="!!error"
              class="lab-field"
            ></textarea>
          </label>
          <label v-else class="block">
            <span class="sr-only">Mensaje</span>
            <textarea
              v-model="text"
              rows="3"
              spellcheck="false"
              class="lab-field"
            ></textarea>
          </label>
          <label v-if="mode === 'verificar'" class="block text-sm">
            <span class="mb-1 block font-medium">Firma recibida (número)</span>
            <input
              v-model="sigInput"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              class="lab-field"
            />
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-if="mode === 'verificar'"
              class="lab-button"
              :disabled="!keys"
              @click="tamper"
            >
              🕵️ Alterar una letra
            </button>
            <button class="lab-button" @click="reset">
              ↺ Reiniciar ejemplo
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div
          class="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-500/10"
        >
          <p class="lab-label">
            <span class="lab-number bg-emerald-700">3</span> Resultado
          </p>
          <p v-if="error && keyResult.ok" class="lab-error" role="alert">
            {{ error }}
          </p>
          <template v-if="mode === 'firmar' || mode === 'verificar'">
            <div class="space-y-1 text-sm">
              <p class="font-medium">SHA-256 del mensaje</p>
              <p class="break-all font-mono text-xs" aria-live="polite">
                {{ hash || '…' }}
              </p>
              <p v-if="hashMod !== null && keys" class="font-mono">
                h′ = hash mod n = {{ hashMod }}
                <span
                  class="font-sans text-xs text-slate-600 dark:text-slate-400"
                  >(simplificación didáctica: n es pequeño)</span
                >
              </p>
            </div>
          </template>
          <div
            v-if="mode === 'verificar' && verification && !error"
            aria-live="polite"
          >
            <p class="font-mono text-sm">
              sᵉ mod n = {{ verification.recovered ?? '—' }} · h′ =
              {{ hashMod }}
            </p>
            <p
              class="mt-1 rounded-lg p-3 font-semibold"
              :class="
                verification.valid
                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200'
                  : 'bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-200'
              "
            >
              {{
                verification.valid
                  ? '✔ Firma válida: el mensaje es íntegro y lo firmó el dueño de la clave privada.'
                  : '✘ Firma inválida: el mensaje fue alterado o la firma no corresponde a esta clave.'
              }}
            </p>
          </div>
          <p
            v-else-if="mode === 'verificar' && !error"
            class="text-sm text-slate-600 dark:text-slate-400"
          >
            Escribe la firma (puedes generarla en «Firmar» y pasarla aquí).
          </p>
          <template v-if="mode !== 'verificar'">
            <p
              class="min-h-12 break-all rounded-xl border-2 border-emerald-400 bg-white p-3 font-mono dark:bg-slate-950"
              aria-live="polite"
            >
              {{ output || '—' }}
            </p>
            <div class="flex flex-wrap items-center gap-2">
              <button class="lab-button" :disabled="!output" @click="copy">
                📋 Copiar
              </button>
              <button
                v-if="mode !== 'verificar'"
                class="lab-button"
                :disabled="!output"
                @click="swap"
              >
                {{ swapLabel }}
              </button>
              <span class="text-sm" role="status">{{ copyStatus }}</span>
            </div>
          </template>
        </div>

        <div
          v-if="blocks.length"
          class="space-y-2 rounded-xl border border-slate-200 p-4 dark:border-slate-700"
        >
          <p class="text-sm font-semibold">
            Elige un bloque para ver su cálculo
          </p>
          <div class="flex max-h-40 flex-wrap gap-2 overflow-auto">
            <button
              v-for="(b, i) in blocks"
              :key="i"
              class="lab-block"
              :aria-pressed="selected === i"
              :aria-label="`Bloque ${i + 1}: ${b.label} → ${b.shown}`"
              @click="selected = i"
            >
              {{ b.label }}<br />{{ b.shown }}
            </button>
          </div>
        </div>

        <div
          v-if="trace && pow"
          class="space-y-2 rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700"
        >
          <p class="font-semibold">{{ trace.title }}</p>
          <p class="font-mono">
            {{ trace.resultName }} = {{ trace.baseName }}^{{
              trace.expName
            }}
            mod n = {{ trace.base }}^{{ trace.exp }} mod {{ trace.n }} =
            <b>{{ pow.result }}</b>
          </p>
          <p>
            Exponente en binario: <code>{{ pow.bits }}</code
            >. Para cada bit se eleva al cuadrado y, si el bit es 1, se
            multiplica por {{ trace.base }}:
          </p>
          <div class="overflow-x-auto">
            <table class="w-full text-left font-mono text-xs">
              <caption class="sr-only">
                Exponenciación modular por cuadrados sucesivos
              </caption>
              <thead>
                <tr>
                  <th class="p-1">Bit</th>
                  <th class="p-1">Cuadrado mod n</th>
                  <th class="p-1">Resultado</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(s, i) in pow.steps"
                  :key="i"
                  class="border-t border-slate-200 dark:border-slate-700"
                >
                  <td class="p-1">{{ s.bit }}</td>
                  <td class="p-1">{{ s.squared }}</td>
                  <td class="p-1">{{ s.result }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
