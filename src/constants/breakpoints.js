/**
 * Espelha os breakpoints do Design System v0.1. Como custom properties do
 * CSS não podem ser usadas dentro de @media, os arquivos .css de cada
 * componente repetem esses valores literalmente — este arquivo é a
 * referência para quem for escrever media queries novas ou breakpoints
 * usados em JS (ex: hooks de matchMedia).
 */
export const BREAKPOINTS = Object.freeze({
  MOBILE_MAX: 639,
  TABLET_MIN: 640,
  TABLET_MAX: 1023,
  DESKTOP_MIN: 1024,
});
