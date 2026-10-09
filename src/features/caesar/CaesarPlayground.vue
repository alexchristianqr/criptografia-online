<script setup lang="ts">
import { ref } from 'vue'
import SectionCard from '../../components/ui/SectionCard.vue'
import AlphabetStrip from '../../components/ui/AlphabetStrip.vue'
import { ALPHABETS } from '../../ciphers/caesar'
import { useCaesar } from './useCaesar'

const { text, shift, mode, alphabetKey, alphabet, output, steps, setShift, swap } = useCaesar()

const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* portapapeles no disponible */
  }
}
</script>

<template>
  <SectionCard title="Ejemplo interactivo" badge="4">
    <div class="controls">
      <div class="modes" role="group" aria-label="Modo">
        <button :class="{ active: mode === 'cifrar' }" @click="mode = 'cifrar'">Cifrar</button>
        <button :class="{ active: mode === 'descifrar' }" @click="mode = 'descifrar'">Descifrar</button>
      </div>
      <label>
        Alfabeto
        <select v-model="alphabetKey">
          <option v-for="(a, key) in ALPHABETS" :key="key" :value="key">{{ a.label }}</option>
        </select>
      </label>
    </div>

    <label>
      Clave k = {{ shift }}
      <span class="shift">
        <input type="range" min="0" :max="alphabet.length - 1" :value="shift" @input="setShift(+($event.target as HTMLInputElement).value)" />
        <input type="number" min="0" :max="alphabet.length - 1" :value="shift" @input="setShift(+($event.target as HTMLInputElement).value)" />
      </span>
    </label>

    <label>
      Entrada ({{ mode === 'cifrar' ? 'texto plano' : 'texto cifrado' }})
      <textarea v-model="text" rows="3" spellcheck="false" />
    </label>

    <label>
      Salida ({{ mode === 'cifrar' ? 'texto cifrado' : 'texto plano' }})
      <textarea :value="output" rows="3" readonly />
    </label>

    <div class="actions">
      <button @click="copy">{{ copied ? '¡Copiado!' : 'Copiar salida' }}</button>
      <button @click="swap">⇄ Usar salida como entrada</button>
    </div>

    <h3>Correspondencia de letras</h3>
    <AlphabetStrip :alphabet="alphabet" :shift="mode === 'cifrar' ? shift : -shift" />

    <template v-if="steps.length">
      <h3>Traza (primeras 10 letras)</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Letra</th><th>x</th><th>x {{ mode === 'cifrar' ? '+' : '−' }} k</th><th>Resultado</th></tr></thead>
          <tbody>
            <tr v-for="(s, i) in steps.slice(0, 10)" :key="i">
              <td>{{ s.from }}</td><td>{{ s.fromIndex }}</td>
              <td>{{ mode === 'cifrar' ? s.fromIndex + shift : s.fromIndex - shift }}</td>
              <td><strong>{{ s.to }}</strong> ({{ s.toIndex }})</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </SectionCard>
</template>

<style scoped>
.controls { display: flex; flex-wrap: wrap; gap: 16px; align-items: end; margin-bottom: 12px; }
.modes { display: flex; gap: 6px; }
.shift { display: flex; gap: 12px; align-items: center; }
.shift input[type='range'] { flex: 1; padding: 0; }
.shift input[type='number'] { width: 5em; }
label { margin-bottom: 12px; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
</style>
