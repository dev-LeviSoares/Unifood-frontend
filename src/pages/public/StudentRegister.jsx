import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api/authService';
import { ROUTES } from '../../constants/routes';
import { isNotEmpty, isValidPassword, isValidPhone, onlyDigits } from '../../utils/validators';
import { AuthField } from './components/AuthField';
import '../../styles/auth.css';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function StudentRegister() {
  const navigate = useNavigate();
  useDocumentTitle('Criar conta de estudante');
  const [form, setForm] = useState({ name: '', username: '', phone: '', birthDate: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!Object.entries(form).every(([key, value]) => (key === 'confirmPassword' ? true : isNotEmpty(value)))) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!isValidPhone(form.phone)) {
      setError('Informe um telefone válido.');
      return;
    }
    if (!isValidPassword(form.password)) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await authService.registerStudent({
        name: form.name.trim(),
        username: form.username.trim(),
        // normalizado (só dígitos) antes de enviar — evita registros
        // inconsistentes no banco (uns com máscara, outros sem)
        phone: onlyDigits(form.phone),
        birthDate: form.birthDate,
        password: form.password,
      });
      setSuccess('Cadastro realizado. Você já pode entrar na plataforma.');
      setTimeout(() => navigate(ROUTES.LOGIN), 700);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Não foi possível realizar o cadastro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-wide">
        <div className="auth-brand">UniFood</div>
        <p className="auth-eyebrow">Cadastro</p>
        <h1>Criar conta de estudante</h1>
        <p className="auth-description">Preencha seus dados para criar sua conta.</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <AuthField id="name" label="Nome completo" value={form.name} onChange={(v) => update('name', v)} autoComplete="name" />
          <AuthField id="username" label="Usuário" value={form.username} onChange={(v) => update('username', v)} autoComplete="username" />
          <AuthField id="phone" label="Telefone" value={form.phone} onChange={(v) => update('phone', v)} autoComplete="tel" />
          <AuthField id="birthDate" label="Data de nascimento" type="date" value={form.birthDate} onChange={(v) => update('birthDate', v)} />
          <AuthField id="password" label="Senha" type="password" value={form.password} onChange={(v) => update('password', v)} autoComplete="new-password" />
          <AuthField id="confirmPassword" label="Confirmar senha" type="password" value={form.confirmPassword} onChange={(v) => update('confirmPassword', v)} autoComplete="new-password" />
          {error && <p className="form-error" role="alert">{error}</p>}
          {success && <p className="form-success" role="status">{success}</p>}
          <button className="primary-button" disabled={loading}>{loading ? 'Cadastrando...' : 'Criar conta'}</button>
        </form>
        <p className="auth-footer"><Link to={ROUTES.REGISTER}>Voltar</Link> · Já possui conta? <Link to={ROUTES.LOGIN}>Entrar</Link></p>
      </section>
    </main>
  );
}
