export interface NavItem {
  id: string;
  /** false = lección "próximamente" */
  available: boolean;
}

export type RouteResult =
  { kind: 'ok'; id: string } | { kind: 'notfound'; raw: string };

/** Convierte el hash (#/cesar) en una ruta válida; hash vacío = inicio; id desconocido = 404. */
export function resolveRoute(
  ids: readonly string[],
  hash: string,
  defaultId: string,
): RouteResult {
  const raw = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if (!raw) return { kind: 'ok', id: defaultId };
  return ids.includes(raw)
    ? { kind: 'ok', id: raw }
    : { kind: 'notfound', raw };
}

/** Lección disponible anterior y siguiente (salta las "próximamente"). */
export function neighbors<T extends NavItem>(
  items: readonly T[],
  id: string,
): { prev: T | null; next: T | null } {
  const i = items.findIndex((m) => m.id === id);
  if (i === -1) return { prev: null, next: null };
  const prev =
    items
      .slice(0, i)
      .reverse()
      .find((m) => m.available) ?? null;
  const next = items.slice(i + 1).find((m) => m.available) ?? null;
  return { prev, next };
}
