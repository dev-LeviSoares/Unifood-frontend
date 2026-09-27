import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import '../../styles/auth.css';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function Register() {
  useDocumentTitle('Criar conta');
  return (
    <main className="auth-page">
      <section className="auth-card register-choice" aria-labelledby="register-title">
        <div className="auth-brand">UniFood</div>
        <p className="auth-eyebrow">Criação de conta</p>
        <h1 id="register-title">Como você vai usar o UniFood?</h1>
        <p className="auth-description">Escolha o perfil que corresponde ao seu acesso.</p>

        <Link className="choice-card" to={ROUTES.STUDENT_REGISTER}>
          <strong>Sou estudante</strong>
          <span>Quero encontrar produtos e fazer pedidos.</span>
        </Link>
        <Link className="choice-card" to={ROUTES.SELLER_REGISTER}>
          <strong>Sou vendedor</strong>
          <span>Quero cadastrar meu estabelecimento e vender.</span>
        </Link>

        <p className="auth-footer">Já possui uma conta? <Link to={ROUTES.LOGIN}>Entrar</Link></p>
      </section>
    </main>
  );
}
