/**
 * Estados possíveis de um pedido, na ordem em que costumam ocorrer.
 * Usado por OrderStatus, OrderTimeline e pelas páginas de pedidos.
 */
export const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Aguardando confirmação',
  [ORDER_STATUS.CONFIRMED]: 'Confirmado',
  [ORDER_STATUS.PREPARING]: 'Em preparo',
  [ORDER_STATUS.READY]: 'Pronto para retirada',
  [ORDER_STATUS.COMPLETED]: 'Concluído',
  [ORDER_STATUS.CANCELLED]: 'Cancelado',
};

/** Sequência "feliz" do pedido, usada para desenhar a OrderTimeline. */
export const ORDER_STATUS_SEQUENCE = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.COMPLETED,
];
