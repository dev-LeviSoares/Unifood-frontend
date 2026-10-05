import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import { isNotEmpty } from '../../utils/validators';
import '../../styles/auth.css';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const profiles = [
  { value: ROLES.STUDENT, label: 'Estudante' },
  { value: ROLES.SELLER, label: 'Vendedor' },
];

export function Login() {
  useDocumentTitle('Entrar');
  const { isAuthenticated, role, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(ROLES.STUDENT);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // puramente visual (mostrar/ocultar senha) — não faz parte da lógica de auth
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={getHomeByRole(role)} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!isNotEmpty(identifier) || !isNotEmpty(password)) {
      setError('Preencha todos os campos.');
      return;
    }

    try {
      const user = await login({
        profile,
        identifier: identifier.trim(),
        password,
      });
      const destination = location.state?.from?.pathname || getHomeByRole(user.role);
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          'Não foi possível entrar. Verifique seus dados.'
      );
    }
  }

  return (
    <main className="login-page">
      <div className="login-wrapper">
        <div className="login-topbar">
          <span className="login-brand-mark" aria-hidden="true">
            <img
              src="/images/categories/unifood-logo.webp"
              alt="Unifood"
              className="unifood-logo"
            />
          </span>
          <span className="login-brand-name">UNIFOOD</span>
        </div>

        <div className="login-hero">
          <p className="login-hero-title">Seu lanche entre uma aula e outra.</p>
          <p className="login-hero-subtitle">
            Peça antes e retire direto com o vendedor na sua universidade.
          </p>
        </div>

        <section className="login-card" aria-labelledby="login-title">
          <p className="login-eyebrow">Acesse sua conta</p>
          <h1 id="login-title" className="login-title">
            Bem-vindo ao Unifood <span aria-hidden="true"></span>
          </h1>
          <p className="login-subtitle">Entre para fazer seus pedidos na sua universidade.</p>

          <div className="login-tabs" role="tablist" aria-label="Tipo de acesso">
            {profiles.map((item) => (
              <button
                key={item.value}
                type="button"
                className={profile === item.value ? 'login-tab is-active' : 'login-tab'}
                onClick={() => setProfile(item.value)}
                role="tab"
                aria-selected={profile === item.value}
              >
                {item.label}
              </button>
            ))}
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="identifier">{profile === ROLES.ADMIN ? 'CPF' : 'Usuário'}</label>
              <input
                id="identifier"
                className="login-input"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
                placeholder={profile === ROLES.ADMIN ? 'Seu CPF' : 'Seu e-mail ou usuário'}
              />
            </div>

            <div className="login-field">
              <div className="login-field-header">
                <label htmlFor="password">Senha</label>
                <Link className="login-forgot-link" to={ROUTES.PASSWORD_RECOVERY}>
                  Esqueci minha senha
                </Link>
              </div>
              <div className="login-input-wrapper">
                <input
                  id="password"
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="login-eye-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : (
                <>
                  Entrar <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <p className="login-footer-link">
            Ainda não possui uma conta? <Link to={ROUTES.REGISTER}>Criar conta</Link>
          </p>
        </section>

        <p className="login-legal">
          Ao entrar, você concorda com os Termos de Uso e a Política de Privacidade.
        </p>
      </div>
    </main>
  );
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M6.6 6.7C4.6 8 3.1 9.8 2 12c1.6 3.6 5.2 7 10 7 1.7 0 3.2-.4 4.6-1.1M9.9 4.2A10.4 10.4 0 0112 4c4.8 0 8.4 3.4 10 7-0.6 1.3-1.4 2.5-2.4 3.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12c1.6-3.6 5.2-7 10-7s8.4 3.4 10 7c-1.6 3.6-5.2 7-10 7s-8.4-3.4-10-7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function getHomeByRole(userRole) {
  if (userRole === ROLES.SELLER) return ROUTES.SELLER_HOME;
  if (userRole === ROLES.ADMIN) return ROUTES.ADMIN_HOME;
  return ROUTES.STUDENT_HOME;
}
