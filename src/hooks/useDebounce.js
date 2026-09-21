import { useEffect, useState } from 'react';

/**
 * Retorna `value` com atraso de `delayMs`, útil para inputs de busca.
 * @template T
 * @param {T} value
 * @param {number} [delayMs=300]
 * @returns {T}
 */
export function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
