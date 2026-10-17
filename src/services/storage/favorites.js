import { readLocalData, writeLocalData } from './localData';
const key = (userId) => `unifood_favorites:${userId}`;
export const favorites = {
  list(userId) {
    const value = readLocalData(key(userId), []);
    return Array.isArray(value)
      ? value.filter((id) => typeof id === 'string')
      : [];
  },
  toggle(userId, productId) {
    const current = this.list(userId);
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    writeLocalData(key(userId), next);
    return next;
  },
};
