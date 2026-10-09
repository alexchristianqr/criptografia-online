<script setup lang="ts">
import { computed } from 'vue'

// Rueda de dos anillos: el exterior es la entrada, el interior (que gira k posiciones) es la salida.
const props = defineProps<{ alphabet: string; shift: number; highlight?: string[]; active?: string | null }>()

const letters = computed(() => Array.from(props.alphabet))
const step = computed(() => 360 / letters.value.length)
const rotation = computed(() => -props.shift * step.value)
const isOn = (l: string) => props.highlight?.includes(l)

const SIZE = 340
const C = SIZE / 2
const R_OUT = 142
const R_IN = 100
const pos = (i: number, r: number) => {
  const a = (i * step.value * Math.PI) / 180
  return { x: C + r * Math.sin(a), y: C - r * Math.cos(a) }
}
</script>

<template>
  <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" class="mx-auto w-full max-w-sm select-none" role="img" aria-label="Rueda de cifrado César">
    <!-- anillos -->
    <circle :cx="C" :cy="C" :r="R_OUT + 17" class="fill-sky-50 stroke-sky-300 dark:fill-sky-950/60 dark:stroke-sky-700" />
    <circle :cx="C" :cy="C" :r="R_OUT - 17" class="fill-white stroke-sky-300 dark:fill-slate-900 dark:stroke-sky-700" />
    <circle :cx="C" :cy="C" :r="R_IN + 17" class="fill-emerald-50 stroke-emerald-300 dark:fill-emerald-950/60 dark:stroke-emerald-700" />
    <circle :cx="C" :cy="C" :r="R_IN - 17" class="fill-white stroke-emerald-300 dark:fill-slate-900 dark:stroke-emerald-700" />

    <!-- anillo exterior: entrada -->
    <g font-family="ui-monospace, Menlo, monospace" font-size="13" text-anchor="middle" dominant-baseline="central">
      <g v-for="(l, i) in letters" :key="'o' + l" :transform="`translate(${pos(i, R_OUT).x} ${pos(i, R_OUT).y})`">
        <circle
          v-if="isOn(l)"
          r="11"
          :class="active === l ? 'fill-amber-400' : 'fill-sky-500'"
        />
        <text :class="isOn(l) ? 'fill-white font-bold' : 'fill-sky-800 dark:fill-sky-200'">{{ l }}</text>
      </g>

      <!-- anillo interior: salida, rota con la clave -->
      <g class="transition-transform duration-500 ease-out" :style="{ transform: `rotate(${rotation}deg)`, transformOrigin: `${C}px ${C}px` }">
        <g v-for="(l, j) in letters" :key="'i' + l" :transform="`translate(${pos(j, R_IN).x} ${pos(j, R_IN).y})`">
          <text
            class="fill-emerald-800 transition-transform duration-500 ease-out dark:fill-emerald-200"
            font-size="12"
            :style="{ transform: `rotate(${-rotation}deg)`, transformBox: 'fill-box', transformOrigin: 'center' }"
          >{{ l }}</text>
        </g>
      </g>
    </g>

    <!-- centro -->
    <text :x="C" :y="C - 10" text-anchor="middle" class="fill-slate-500 text-[11px] dark:fill-slate-400">clave</text>
    <text :x="C" :y="C + 16" text-anchor="middle" class="fill-amber-500 font-mono text-3xl font-bold">
      {{ shift >= 0 ? '+' : '−' }}{{ Math.abs(shift) }}
    </text>

    <!-- marcador de alineación -->
    <path :d="`M ${C - 6} 2 L ${C + 6} 2 L ${C} 12 Z`" class="fill-amber-500" />
  </svg>
</template>
