<script setup lang="ts">
import Collapsible from '../../components/ui/Collapsible.vue';
import SeriesPlayground from './SeriesPlayground.vue';
import { example, source, theory } from './content';
</script>

<template>
  <div class="space-y-4">
    <SeriesPlayground />
    <div class="space-y-2">
      <p
        class="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400"
      >
        Material de apoyo
      </p>
      <Collapsible title="Definición" icon="📖">
        <p>
          La transposición por series reorganiza las posiciones del mensaje
          completo. Cada regla genera un submensaje y la clave indica el orden
          en que se concatenan esos submensajes.
        </p>
        <p class="font-mono">C = S₁(P) ‖ S₂(P) ‖ … ‖ Restantes(P)</p>
        <p>
          Las posiciones ya tomadas se omiten de las reglas siguientes. En este
          módulo todas las letras aparecen exactamente una vez; la longitud no
          cambia.
        </p>
      </Collapsible>
      <Collapsible title="Teoría en puntos" icon="📌"
        ><ul class="list-disc space-y-2 pl-5">
          <li v-for="point in theory" :key="point">{{ point }}</li>
        </ul></Collapsible
      >
      <Collapsible title="Práctica resuelta paso a paso" icon="✍️">
        <p>
          Ejemplo de referencia: <b class="font-mono">{{ example.text }}</b> →
          <b class="break-all font-mono">{{ example.ciphertext }}</b
          >, con primos (incluye 1 · curso) → pares → restantes.
        </p>
        <p>
          La primera serie incluye el 1 según la convención del profesor. El 2
          también pertenece a esa serie y se omite después de pares. Cambia las
          reglas para comprobar cómo afecta su orden.
        </p>
        <SeriesPlayground practice />
      </Collapsible>
      <Collapsible title="Fuentes de la lección" icon="🔎">
        <p>
          <a
            :href="source.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-brand-600 underline dark:text-brand-500"
            >{{ source.title }}</a
          >
        </p>
        <p>
          Se adopta la convención del curso: incluir 1 en la primera serie,
          aunque matemáticamente no sea primo. Las posiciones ya utilizadas se
          excluyen de las series siguientes. Las listas explícitas permiten
          reproducir otras convenciones de ejercicios.
        </p>
      </Collapsible>
    </div>
  </div>
</template>
