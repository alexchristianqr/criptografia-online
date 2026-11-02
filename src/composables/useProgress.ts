import { computed, ref } from 'vue';

const KEY = 'progress:visited';

export function parseVisited(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v: unknown = JSON.parse(raw);
    return Array.isArray(v)
      ? v.filter((x): x is string => typeof x === 'string')
      : [];
  } catch {
    return [];
  }
}

function load(): string[] {
  try {
    return parseVisited(localStorage.getItem(KEY));
  } catch {
    return []; // almacenamiento no disponible
  }
}

const visited = ref<string[]>(load());

/** Progreso: lecciones visitadas, persistido de forma opcional en localStorage (CA-10). */
export function useProgress() {
  const markVisited = (id: string) => {
    if (visited.value.includes(id)) return;
    visited.value = [...visited.value, id];
    try {
      localStorage.setItem(KEY, JSON.stringify(visited.value));
    } catch {
      /* ignorar */
    }
  };
  const isVisited = (id: string) => visited.value.includes(id);
  const count = computed(() => visited.value.length);
  return { markVisited, isVisited, count };
}
