import { describe, expect, it } from 'vitest';
import { neighbors, resolveRoute } from './navigation';

const items = [
  { id: 'a', available: true },
  { id: 'b', available: false },
  { id: 'c', available: true },
  { id: 'd', available: true },
];

describe('resolveRoute (CA-5)', () => {
  const ids = items.map((i) => i.id);
  it('hash vacío → inicio', () =>
    expect(resolveRoute(ids, '', 'a')).toEqual({ kind: 'ok', id: 'a' }));
  it('#/ → inicio', () =>
    expect(resolveRoute(ids, '#/', 'a')).toEqual({ kind: 'ok', id: 'a' }));
  it('id válido', () =>
    expect(resolveRoute(ids, '#/c', 'a')).toEqual({ kind: 'ok', id: 'c' }));
  it('barra final tolerada', () =>
    expect(resolveRoute(ids, '#/c/', 'a')).toEqual({ kind: 'ok', id: 'c' }));
  it('desconocido → 404', () =>
    expect(resolveRoute(ids, '#/xyz', 'a')).toEqual({
      kind: 'notfound',
      raw: 'xyz',
    }));
});

describe('neighbors (CA-9)', () => {
  it('primero: sin anterior', () =>
    expect(neighbors(items, 'a')).toEqual({ prev: null, next: items[2] }));
  it('salta "próximamente"', () =>
    expect(neighbors(items, 'c').prev).toBe(items[0]));
  it('último: sin siguiente', () =>
    expect(neighbors(items, 'd').next).toBeNull());
  it('desde una "próximamente"', () =>
    expect(neighbors(items, 'b')).toEqual({ prev: items[0], next: items[2] }));
  it('id desconocido', () =>
    expect(neighbors(items, 'zz')).toEqual({ prev: null, next: null }));
});
