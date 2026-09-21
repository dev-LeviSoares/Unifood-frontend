/**
 * Papéis de usuário reconhecidos pela aplicação.
 * Usado por ProtectedRoute e pelos layouts para decidir o que renderizar.
 */
export const ROLES = Object.freeze({
  STUDENT: 'student',
  SELLER: 'seller',
  ADMIN: 'admin',
});

export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Estudante',
  [ROLES.SELLER]: 'Vendedor',
  [ROLES.ADMIN]: 'Administrador',
};
