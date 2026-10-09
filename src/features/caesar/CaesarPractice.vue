<script setup lang="ts">
import { computed } from 'vue'
import SectionCard from '../../components/ui/SectionCard.vue'
import AlphabetStrip from '../../components/ui/AlphabetStrip.vue'
import { ALPHABETS, caesarSteps } from '../../ciphers/caesar'
import { practice } from './content'

const alphabet = ALPHABETS[practice.alphabet].letters
const rows = computed(() => caesarSteps(practice.text, practice.shift, alphabet))
const result = computed(() => rows.value.map((r) => r.to).join(''))
</script>

<template>
  <SectionCard title="Práctica paso a paso" badge="3">
    <p>
      Ejemplo: cifrar <code>{{ practice.text }}</code> con <code>k = {{ practice.shift }}</code> en
      español (n = {{ alphabet.length }}).
    </p>
    <ol>
      <li v-for="s in practice.steps" :key="s">{{ s }}</li>
    </ol>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Letra</th><th>x</th><th>x + k</th><th>mod n</th><th>Resultado</th></tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i">
            <td>{{ r.from }}</td>
            <td>{{ r.fromIndex }}</td>
            <td>{{ r.fromIndex + practice.shift }}</td>
            <td>{{ r.toIndex }}</td>
            <td><strong>{{ r.to }}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="result">
      <code>{{ practice.text }}</code> → <code>{{ result }}</code>
    </p>
    <AlphabetStrip :alphabet="alphabet" :shift="practice.shift" />
  </SectionCard>
</template>

<style scoped>
ol { padding-left: 20px; }
.result { margin: 12px 0; }
</style>
