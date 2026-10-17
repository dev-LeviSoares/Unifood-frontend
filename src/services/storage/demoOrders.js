import { readLocalData, writeLocalData } from './localData';
const keyFor = (userId) => `unifood_demo_orders:${userId}`;
export const DEMO_STEPS = [
  'Pedido confirmado',
  'Em preparo',
  'Pronto para retirar',
  'Retirado',
];
export const demoOrders = {
  list(userId) {
    const orders = readLocalData(keyFor(userId), []);
    return Array.isArray(orders)
      ? orders.filter(
          (order) => order && order.id && Array.isArray(order.items),
        )
      : [];
  },
  get(userId, orderId) {
    return this.list(userId).find((order) => order.id === orderId);
  },
  create(userId, cart, paymentMethod, note, seller) {
    if (!userId || !cart.items.length)
      throw new Error('Confira a sessão e os itens do carrinho.');
    const order = {
      id: crypto.randomUUID(),
      sellerId: cart.sellerId,
      sellerName: seller?.name,
      items: cart.items.map((item) => ({ ...item })),
      totalInCents: cart.totalInCents,
      paymentMethod,
      note,
      createdAt: new Date().toISOString(),
      status: DEMO_STEPS[0],
      step: 0,
      pickupCode: String(
        crypto.getRandomValues(new Uint32Array(1))[0] % 10000,
      ).padStart(4, '0'),
      pickupPoint: seller?.pickupPoint || 'Ponto a combinar no campus',
      campus: seller?.campus || 'Campus Central',
      pickupTime: seller?.pickupTime || 'Horário a combinar',
      rating: null,
    };
    writeLocalData(keyFor(userId), [order, ...this.list(userId)]);
    return order;
  },
  update(userId, orderId, values) {
    const orders = this.list(userId);
    const current = orders.find((order) => order.id === orderId);
    if (!current) throw new Error('Pedido não encontrado.');
    const updated = { ...current, ...values };
    writeLocalData(
      keyFor(userId),
      orders.map((order) => (order.id === orderId ? updated : order)),
    );
    return updated;
  },
  advance(userId, orderId) {
    const current = this.get(userId, orderId);
    if (!current) throw new Error('Pedido não encontrado.');
    const step = Math.min((current.step ?? 0) + 1, 3);
    return this.update(userId, orderId, { step, status: DEMO_STEPS[step] });
  },
};
