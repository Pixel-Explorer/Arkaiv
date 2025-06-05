import { cn } from '../utils';

describe('cn', () => {
  test('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  test('deduplicates conflicting tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  test('handles falsy values', () => {
    expect(cn('foo', undefined, false, 'bar')).toBe('foo bar');
  });
});
