import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';

const profiles = [
  { role: ROLES.STUDENT, label: 'Entrar como estudante', name: 'Estudante de teste', destination: ROUTES.STUDENT_HOME },
  { role: ROLES.SELLER, label: 'Entrar como vendedor', name: 'Vendedor de teste', destination: ROUTES.SELLER_HOME },
  { role: ROLES.ADMIN, label: 'Entrar como administrador', name: 'Administrador de teste', destination: ROUTES.ADMIN_HOME },
];

export function DevAccess() {
  const { isAuthenticated, devLogin, logout } = useAuth();
  const navigate = useNavigate();

  // A rota e a sessão de teste só existem no servidor de desenvolvimento do Vite.
  if (!import.meta.env.DEV || import.meta.env.VITE_DEV_MODE !== 'true') {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  async function enter(profile) {
    await devLogin({ role: profile.role, name: profile.name });
    navigate(profile.destination, { replace: true });
  }

  return (
    <main style={{ maxWidth: 560, margin: '48px auto', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <p style={{ color: '#E6452F', fontWeight: 700, letterSpacing: 1 }}>UNIFOOD · DESENVOLVIMENTO</p>
      <h1 style={{ marginBottom: 8 }}>Navegação de teste</h1>
      <p style={{ color: '#6B6B6B', lineHeight: 1.6 }}>
        Escolha um perfil fictício para visualizar as páginas. Esta sessão é apenas local e não autentica ninguém na API.
      </p>
      {isAuthenticated && (
        <button type="button" onClick={logout} style={buttonStyle('#6B6B6B')}>
          Encerrar sessão de teste atual
        </button>
      )}
      <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        {profiles.map((profile) => (
          <button key={profile.role} type="button" onClick={() => enter(profile)} style={buttonStyle('#FF5A3C')}>
            {profile.label}
          </button>
        ))}
      </div>
      <p style={{ marginTop: 24, fontSize: 13, color: '#6B6B6B' }}>
        Não use dados reais. A autorização e a autenticação de produção precisam ser validadas pelo backend.
      </p>
    </main>
  );
}

function buttonStyle(background) {
  return {
    width: '100%', padding: '14px 18px', border: 0, borderRadius: 10,
    background, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer',
  };
}
