const TOKEN_KEY = 'unifood_token';
const USER_KEY = 'unifood_user';

/**
 * ⚠️ DÍVIDA TÉCNICA DE SEGURANÇA — DEPENDE DO BACKEND
 * ----------------------------------------------------
 * O token fica em localStorage, que é legível por qualquer script que rode
 * na página (ex: uma dependência comprometida, ou um XSS futuro). O ideal é
 * o backend setar o token num cookie httpOnly + Secure + SameSite=Strict,
 * que o JavaScript nunca consegue ler — aí este arquivo nem precisaria
 * existir, o browser cuidaria de enviar o cookie sozinho em cada request.
 *
 * Isso não dá pra resolver só no front: precisa que o backend Node
 * implemente o login devolvendo Set-Cookie em vez de um token no corpo da
 * resposta, e que `services/api/api.js` passe a usar `withCredentials: true`
 * (removendo o header Authorization manual). Até essa mudança ser feita no
 * backend, localStorage fica como está — mas é importante que quem for
 * implementar a API já saiba que essa troca está pendente.
 */

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getToken() {
  return getStoredToken();
}

export function getStoredUser() {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
