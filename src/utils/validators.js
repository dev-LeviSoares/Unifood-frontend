export function isNotEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Política mínima: 8+ caracteres. Comprimento pesa mais que complexidade artificial (NIST 800-63B). */
export function isValidPassword(value) {
  return typeof value === 'string' && value.length >= 8;
}

/** Remove tudo que não for dígito — usar antes de exibir/enviar. */
export function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

export function isValidPhone(value) {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
}

/**
 * Validação real de CPF (dígitos verificadores), não só contagem de caracteres.
 * Rejeita sequências repetidas (00000000000, 11111111111, ...), que passam
 * na fórmula mas nunca são CPFs válidos.
 */
export function isValidCpf(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigit = (base) => {
    let sum = 0;
    let weight = base.length + 1;
    for (const digit of base) {
      sum += Number(digit) * weight;
      weight -= 1;
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const base = cpf.slice(0, 9);
  const digit1 = calcDigit(base);
  const digit2 = calcDigit(base + digit1);

  return cpf === base + String(digit1) + String(digit2);
}
