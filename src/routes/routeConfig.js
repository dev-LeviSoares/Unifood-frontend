import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';

/**
 * Mapa declarativo de "quem pode ver o quê", consumido por AppRoutes.jsx.
 * Mantém a árvore de rotas fora do JSX para ficar fácil de ler de uma vez só.
 */
export const routeConfig = {
  public: [ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER],
  protected: {
    [ROLES.STUDENT]: ROUTES.STUDENT_HOME,
    [ROLES.SELLER]: ROUTES.SELLER_DASHBOARD,
    [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
  },
};
