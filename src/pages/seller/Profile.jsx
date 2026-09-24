import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import './seller.css';

const fields = [
  ['Nome completo', 'name'],
  ['Usuário', 'username'],
  ['Nome do estabelecimento', 'establishmentName'],
  ['Telefone', 'phone'],
  ['CPF', 'cpf'],
  ['Data de nascimento', 'birthDate'],
];

export function Profile() {
  const { user } = useAuth();
  return (
    <main className="seller-page">
      <div className="seller-container seller-narrow">
        <header className="seller-page-header">
          <div>
            <span className="seller-eyebrow">Minha conta</span>
            <h1>Perfil do vendedor</h1>
            <p>Confira os dados usados no seu cadastro e as informações do estabelecimento.</p>
          </div>
        </header>
        <Card>
          <div className="seller-profile-head">
            <div className="seller-avatar">{(user?.name || 'V').charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.establishmentName || 'Seu estabelecimento'}</strong>
              <span>@{user?.username || 'vendedor'}</span>
            </div>
          </div>
          <div className="seller-profile-grid">
            {fields.map(([label, key]) => (
              <div className="seller-field" key={key}>
                <span>{label}</span>
                <strong>{user?.[key] || '—'}</strong>
              </div>
            ))}
          </div>
          <div className="seller-private-note">
            <strong>Privacidade</strong>
            <p>Dados pessoais como CPF, telefone e data de nascimento são privados e não aparecem para estudantes no marketplace.</p>
          </div>
        </Card>
      </div>
    </main>
  );
}
