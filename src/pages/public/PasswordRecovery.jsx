import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/api/authService';
import { ROUTES } from '../../constants/routes';
import '../../styles/auth.css';

export function PasswordRecovery() {
  const [identifier, setIdentifier] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!identifier.trim()) return setError('Informe seu usuário ou CPF.');
    setLoading(true);
    try {
      await authService.requestPasswordRecovery(identifier.trim());
      setMessage('Se os dados estiverem cadastrados, as instruções de recuperação serão enviadas pelo canal definido pelo backend.');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Não foi possível solicitar a recuperação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">UniFood</div>
        <p className="auth-eyebrow">Recuperação de acesso</p>
        <h1>Recuperar senha</h1>
        <p className="auth-description">Informe seu usuário ou CPF para iniciar a recuperação.</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="recovery-identifier">Usuário ou CPF</label>
          <input id="recovery-identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" />
          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p className="form-success" role="status">{message}</p>}
          <button className="primary-button" disabled={loading}>{loading ? 'Enviando...' : 'Continuar'}</button>
        </form>
        <p className="auth-footer"><Link to={ROUTES.LOGIN}>Voltar para o login</Link></p>
      </section>
    </main>
  );
}
