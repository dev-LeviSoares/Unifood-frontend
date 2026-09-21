export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isNotEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isPositivePrice(cents) {
  return Number.isInteger(cents) && cents > 0;
}
