// Leitura tolerante a dados antigos ou JSON inválido. Gravações falham de forma explícita.
export function readLocalData(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function writeLocalData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
