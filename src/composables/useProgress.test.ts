import { describe, expect, it } from 'vitest';
import { parseVisited } from './useProgress';

describe('parseVisited (CA-10)', () => {
  it('null → []', () => expect(parseVisited(null)).toEqual([]));
  it('JSON válido', () =>
    expect(parseVisited('["a","b"]')).toEqual(['a', 'b']));
  it('JSON corrupto → []', () => expect(parseVisited('{x')).toEqual([]));
  it('no-array → []', () => expect(parseVisited('{"a":1}')).toEqual([]));
  it('filtra no-strings', () =>
    expect(parseVisited('["a",1,null]')).toEqual(['a']));
});
