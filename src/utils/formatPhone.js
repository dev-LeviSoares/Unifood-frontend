/**
 * Formata um telefone brasileiro (10 ou 11 dígitos) para exibição.
 * @param {string} raw
 * @returns {string}
 */
export function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return raw;
}
