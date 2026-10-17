import { defineAsyncComponent, type Component } from 'vue'

export interface CourseModule {
  id: string
  title: string
  subtitle: string
  /** undefined = próximamente */
  component?: Component
}

export const modules: CourseModule[] = [
  {
    id: 'cesar',
    title: 'César',
    subtitle: 'Sustitución por desplazamiento',
    component: defineAsyncComponent(() => import('./features/caesar/CaesarPage.vue')),
  },
  { id: 'vigenere', title: 'Vigenère', subtitle: 'Sustitución polialfabética' },
  {
    id: 'permutacion',
    title: 'Permutación',
    subtitle: 'Transposición de posiciones',
    component: defineAsyncComponent(() => import('./features/permutation/PermutationPage.vue')),
  },
  { id: 'atbash', title: 'Atbash', subtitle: 'Alfabeto invertido' },
]
