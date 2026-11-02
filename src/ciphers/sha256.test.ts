import { describe, expect, it } from 'vitest';
import { sha256Hex } from './sha256';

describe('sha256Hex', () => {
  it('CA-9: vector conocido de "abc"', async () => {
    expect(await sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });
  it('texto vacío', async () => {
    expect(await sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
  it('un cambio mínimo altera el hash', async () => {
    expect(await sha256Hex('hola')).not.toBe(await sha256Hex('holA'));
  });
});
