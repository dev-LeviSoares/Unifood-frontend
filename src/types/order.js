/**
 * @typedef {Object} OrderItem
 * @property {string} productId
 * @property {string} name
 * @property {number} quantity
 * @property {number} unitPriceInCents
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} studentId
 * @property {string} sellerId
 * @property {OrderItem[]} items
 * @property {import('../constants/orderStatus').ORDER_STATUS[keyof import('../constants/orderStatus').ORDER_STATUS]} status
 * @property {number} totalInCents
 * @property {string} createdAt
 */

export {};
