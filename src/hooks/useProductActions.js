import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

export function useProductActions() {
  const { isAuthenticated, role } = useAuth();
  const cart = useCart();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  function add(product, quantity = 1, buyNow = false, note = '') {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }
    if (role !== ROLES.STUDENT) {
      toast.error('Entre com seu perfil de estudante para fazer pedidos.');
      return;
    }
    const result = cart.addItem({ ...product, note }, quantity);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    if (buyNow) navigate(ROUTES.CART);
    else toast.success('Pronto! Seu lanche está no carrinho.');
  }
  return { add };
}
