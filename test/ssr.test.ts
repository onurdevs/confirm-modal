// @vitest-environment node
import { expect, it } from 'vitest';
import modal from '../src/index';

it('imports and binds safely without browser globals', () => {
  expect(typeof document).toBe('undefined');
  const unbind = modal.bind();
  expect(unbind).toBeTypeOf('function');
  expect(() => unbind()).not.toThrow();
});
