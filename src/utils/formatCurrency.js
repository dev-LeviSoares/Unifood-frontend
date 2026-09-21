/**
 * Formata um valor em centavos para BRL (ex: 1590 -> "R$ 15,90").
 * @param {number} cents
 * @returns {string}
 */
export function formatCurrency(cents) {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
