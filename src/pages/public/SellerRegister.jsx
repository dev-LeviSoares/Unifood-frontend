import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api/authService';
import { ROUTES } from '../../constants/routes';
import { isNotEmpty, isValidCpf, isValidPassword, isValidPhone, onlyDigits } from '../../utils/validators';
import { AuthField } from './components/AuthField';
import { ImageUpload } from '../../components/ui/ImageUpload';
import '../../styles/auth.css';

export function SellerRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', cpf: '', username: '', phone: '', birthDate: '', password: '', confirmPassword: '', establishmentName: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePhotoChange(file) {
    setPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  }

  function handlePhotoRemove() {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
  }

  // evita vazar a URL temporária do preview se o usuário sair da tela sem enviar
  useEffect(() => () => {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
  }, [photoPreviewUrl]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const required = ['name', 'cpf', 'username', 'phone', 'birthDate', 'password', 'confirmPassword', 'establishmentName'];
    if (!required.every((field) => isNotEmpty(form[field]))) return setError('Preencha todos os campos obrigatórios.');
    if (!isValidCpf(form.cpf)) return setError('Informe um CPF válido.');
    if (!isValidPhone(form.phone)) return setError('Informe um telefone válido.');
    if (!isValidPassword(form.password)) return setError('A senha deve ter pelo menos 8 caracteres.');
    if (form.password !== form.confirmPassword) return setError('As senhas não coincidem.');

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('name', form.name.trim());
      payload.append('cpf', onlyDigits(form.cpf));
      payload.append('username', form.username.trim());
      payload.append('phone', onlyDigits(form.phone));
      payload.append('birthDate', form.birthDate);
      payload.append('password', form.password);
      payload.append('establishmentName', form.establishmentName.trim());
      // upload de arquivo de verdade em vez de aceitar uma URL digitada pelo
      // usuário (URL livre é vetor de SSRF se o backend for buscá-la depois)
      if (photoFile) payload.append('photo', photoFile);

      await authService.registerSeller(payload);
      navigate(ROUTES.LOGIN, { replace: true, state: { sellerPending: true } });
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
        <p className="auth-eyebrow">Cadastro de vendedor</p>
        <h1>Criar conta de vendedor</h1>
        <p className="auth-description">Após o cadastro, sua conta ficará pendente de aprovação administrativa.</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <AuthField id="name" label="Nome completo *" value={form.name} onChange={(v) => update('name', v)} autoComplete="name" />
          <AuthField id="cpf" label="CPF *" value={form.cpf} onChange={(v) => update('cpf', v)} />
          <ImageUpload
            label="Foto pessoal (opcional)"
            previewUrl={photoPreviewUrl}
            onChange={handlePhotoChange}
            onRemove={handlePhotoRemove}
          />
          <AuthField id="username" label="Usuário *" value={form.username} onChange={(v) => update('username', v)} autoComplete="username" />
          <AuthField id="phone" label="Telefone *" value={form.phone} onChange={(v) => update('phone', v)} autoComplete="tel" />
          <AuthField id="birthDate" label="Data de nascimento *" type="date" value={form.birthDate} onChange={(v) => update('birthDate', v)} />
          <AuthField id="establishmentName" label="Nome do estabelecimento *" value={form.establishmentName} onChange={(v) => update('establishmentName', v)} />
          <AuthField id="password" label="Senha *" type="password" value={form.password} onChange={(v) => update('password', v)} autoComplete="new-password" />
          <AuthField id="confirmPassword" label="Confirmar senha *" type="password" value={form.confirmPassword} onChange={(v) => update('confirmPassword', v)} autoComplete="new-password" />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" disabled={loading}>{loading ? 'Cadastrando...' : 'Enviar cadastro'}</button>
        </form>
        <p className="auth-footer"><Link to={ROUTES.REGISTER}>Voltar</Link> · <Link to={ROUTES.LOGIN}>Entrar</Link></p>
      </section>
    </main>
  );
}
