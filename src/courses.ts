import type { Component } from 'vue';

type LessonModule = { default: Component };

export interface CourseModule {
  id: string;
  title: string;
  subtitle: string;
  /** Carga dinámica (memoizada). undefined = próximamente */
  load?: () => Promise<LessonModule>;
  /** Precarga el chunk sin montar la lección (hover/foco en el menú). */
  preload?: () => void;
}

/** Memoiza el import() para precargar una sola vez; si falla, permite reintentar. */
function lazy(loader: () => Promise<LessonModule>) {
  let p: Promise<LessonModule> | null = null;
  const load = () => {
    p ??= loader().catch((e) => {
      p = null;
      throw e;
    });
    return p;
  };
  return { load, preload: () => void load().catch(() => {}) };
}

export const modules: CourseModule[] = [
  {
    id: 'cesar',
    title: 'César',
    subtitle: 'Sustitución por desplazamiento',
    ...lazy(() => import('./features/caesar/CaesarPage.vue')),
  },
  { id: 'vigenere', title: 'Vigenère', subtitle: 'Sustitución polialfabética' },
  {
    id: 'permutacion',
    title: 'Permutación',
    subtitle: 'Transposición de posiciones',
    ...lazy(() => import('./features/permutation/PermutationPage.vue')),
  },
  {
    id: 'transposicion-series',
    title: 'Transposición por Series',
    subtitle: 'Recorridos por posiciones del mensaje',
    ...lazy(() => import('./features/series/SeriesPage.vue')),
  },
  {
    id: 'playfair-descifrado',
    title: 'Playfair Descifrado',
    subtitle: 'Sustitución por dígrafos y cuadrícula',
    ...lazy(() => import('./features/playfair/PlayfairPage.vue')),
  },
  {
    id: 'hill',
    title: 'Hill',
    subtitle: 'Bloques y matrices módulo 26',
    ...lazy(() => import('./features/hill/HillPage.vue')),
  },
  {
    id: 'rsa',
    title: 'RSA',
    subtitle: 'Cifrado asimétrico y firma con hash',
    ...lazy(() => import('./features/rsa/RsaPage.vue')),
  },
  { id: 'atbash', title: 'Atbash', subtitle: 'Alfabeto invertido' },
];
