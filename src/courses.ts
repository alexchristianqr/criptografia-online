import { defineAsyncComponent, type Component } from 'vue';

export interface CourseModule {
  id: string;
  title: string;
  subtitle: string;
  /** undefined = próximamente */
  component?: Component;
}

export const modules: CourseModule[] = [
  {
    id: 'cesar',
    title: 'César',
    subtitle: 'Sustitución por desplazamiento',
    component: defineAsyncComponent(
      () => import('./features/caesar/CaesarPage.vue'),
    ),
  },
  { id: 'vigenere', title: 'Vigenère', subtitle: 'Sustitución polialfabética' },
  {
    id: 'permutacion',
    title: 'Permutación',
    subtitle: 'Transposición de posiciones',
    component: defineAsyncComponent(
      () => import('./features/permutation/PermutationPage.vue'),
    ),
  },
  {
    id: 'transposicion-series',
    title: 'Transposición por Series',
    subtitle: 'Recorridos por posiciones del mensaje',
    component: defineAsyncComponent(
      () => import('./features/series/SeriesPage.vue'),
    ),
  },
  {
    id: 'playfair-descifrado',
    title: 'Playfair Descifrado',
    subtitle: 'Sustitución por dígrafos y cuadrícula',
    component: defineAsyncComponent(
      () => import('./features/playfair/PlayfairPage.vue'),
    ),
  },
  {
    id: 'hill',
    title: 'Hill',
    subtitle: 'Bloques y matrices módulo 26',
    component: defineAsyncComponent(
      () => import('./features/hill/HillPage.vue'),
    ),
  },
  { id: 'atbash', title: 'Atbash', subtitle: 'Alfabeto invertido' },
];
