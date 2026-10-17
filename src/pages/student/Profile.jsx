import { useEffect, useRef, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { ROUTES } from '../../constants/routes';
import { favorites } from '../../services/storage/favorites';
import { marketplaceProducts } from '../../data/marketplaceMock';
import { demoOrders } from '../../services/storage/demoOrders';
import {
  readLocalData,
  writeLocalData,
} from '../../services/storage/localData';
import { StudentPage } from './StudentPage';
import { Icon } from '../../components/marketplace/Icon';

const sections = [
  {
    id: 'data',
    title: 'Meus dados',
    description: 'Nome e informações da sua conta',
    icon: 'user',
  },
  {
    id: 'campus',
    title: 'Meu campus',
    description: 'Campus Central',
    icon: 'pin',
  },
  {
    id: 'favorites',
    title: 'Favoritos',
    description: 'Veja e descubra lanches do campus',
    icon: 'heart',
  },
  {
    id: 'notifications',
    title: 'Notificações',
    description: 'Preferência dos avisos de pedido',
    icon: 'bell',
  },
  {
    id: 'help',
    title: 'Ajuda e suporte',
    description: 'Conte com a gente',
    icon: 'chat',
  },
];
export function StudentProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sectionRef = useRef(null);
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const section = params.get('section');
  useEffect(() => {
    if (!section) return;
    const frame = requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView?.({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [section]);
  const key = `unifood_profile:${user.id}`;
  const [profile, setProfile] = useState(() =>
    readLocalData(key, {
      name: user.name || '',
      campus: 'Campus Central',
      notifications: true,
    }),
  );
  function save(event) {
    event.preventDefault();
    if (!profile.name.trim()) {
      toast.error('Preencha seu nome.');
      return;
    }
    try {
      writeLocalData(key, profile);
      toast.success('Preferências salvas neste navegador.');
      if (location.state?.from === ROUTES.CHECKOUT)
        navigate(ROUTES.CHECKOUT, { replace: true });
      else setParams({});
    } catch {
      toast.error('Não foi possível salvar as preferências.');
    }
  }
  const favoriteIds = favorites.list(user.id);
  const name = profile.name || user.name || 'Estudante';
  return (
    <StudentPage title="Meu perfil" narrow>
      <section className="uf-profile-hero">
        <span className="uf-profile-avatar">
          {name
            .split(' ')
            .slice(0, 2)
            .map((word) => word[0])
            .join('')
            .toUpperCase()}
        </span>
        <h1>{name}</h1>
        {user.email && <p>{user.email}</p>}
        <span className="uf-tag">Conta de estudante</span>
      </section>
      <div className="uf-profile-stats">
        <Link to={ROUTES.STUDENT_ORDERS}>
          <strong>{demoOrders.list(user.id).length}</strong>
          <span>Pedidos na demo</span>
        </Link>
        <button onClick={() => setParams({ section: 'favorites' })}>
          <strong>{favoriteIds.length}</strong>
          <span>Favoritos</span>
        </button>
      </div>
      <section className="uf-panel uf-profile-menu">
        {sections.map((item) => (
          <button key={item.id} onClick={() => setParams({ section: item.id })}>
            <Icon name={item.icon} />
            <span>
              <strong>{item.title}</strong>
              <small>
                {item.id === 'campus' ? profile.campus : item.description}
              </small>
            </span>
            <Icon name="chevron" size={18} />
          </button>
        ))}
      </section>
      {section && (
        <section ref={sectionRef} className="uf-panel uf-profile-section">
          <div className="uf-section-heading">
            <h2>
              {sections.find((item) => item.id === section)?.title ||
                'Minha conta'}
            </h2>
            <button aria-label="Fechar seção" onClick={() => setParams({})}>
              <Icon name="close" size={18} />
            </button>
          </div>
          {section === 'data' ||
          section === 'campus' ||
          section === 'notifications' ? (
            <form onSubmit={save}>
              {section === 'data' && (
                <>
                  <label className="uf-field">
                    Nome
                    <input
                      maxLength={80}
                      value={profile.name}
                      onChange={(event) =>
                        setProfile({ ...profile, name: event.target.value })
                      }
                    />
                  </label>
                  {user.email && (
                    <p className="uf-small">E-mail da sessão: {user.email}</p>
                  )}
                </>
              )}
              {section === 'campus' && (
                <>
                  <label className="uf-field">
                    Campus
                    <select
                      value={profile.campus}
                      onChange={(event) =>
                        setProfile({ ...profile, campus: event.target.value })
                      }
                    >
                      <option>Campus Central</option>
                    </select>
                  </label>
                  <p className="uf-small">
                    O catálogo demonstrativo está disponível no Campus Central.
                  </p>
                </>
              )}
              {section === 'notifications' && (
                <>
                  <label className="uf-checkbox">
                    <input
                      type="checkbox"
                      checked={profile.notifications}
                      onChange={(event) =>
                        setProfile({
                          ...profile,
                          notifications: event.target.checked,
                        })
                      }
                    />
                    Receber avisos de pedido
                  </label>
                  <p className="uf-small">
                    Preferência salva neste navegador. Nesta demonstração,
                    avisos não são enviados.
                  </p>
                </>
              )}
              <button className="uf-button">Salvar preferências</button>
            </form>
          ) : section === 'favorites' ? (
            <>
              {favoriteIds.length ? (
                <div className="uf-favorites-list">
                  {favoriteIds.map((id) => {
                    const product = marketplaceProducts.find(
                      (item) => item.id === id,
                    );
                    return (
                      <Link key={id} to={`${ROUTES.PRODUCT}/${id}`}>
                        <img
                          src={product?.imageUrl || '/images/food/burger.webp'}
                          alt=""
                        />
                        <strong>{product?.name || 'Ver produto salvo'}</strong>
                        <Icon name="chevron" size={18} />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p>
                  Você ainda não salvou favoritos. Use o coração na página do
                  produto para guardar seu próximo lanche.
                </p>
              )}
              <Link className="uf-button" to={ROUTES.SELLERS}>
                Explorar lanches
              </Link>
            </>
          ) : (
            <div className="uf-help">
              <details open>
                <summary>Como funciona a retirada?</summary>
                <p>
                  Você escolhe um vendedor e combina com ele o ponto e o horário
                  no campus. Não há entrega.
                </p>
              </details>
              <details>
                <summary>O pagamento é real?</summary>
                <p>
                  Esta versão demonstra o fluxo. Não realiza cobranças nem envia
                  pedidos ao vendedor.
                </p>
              </details>
              <details>
                <summary>Onde ficam meus pedidos?</summary>
                <p>
                  As simulações ficam neste navegador, separadas por conta.
                  Limpar os dados do navegador remove o histórico.
                </p>
              </details>
            </div>
          )}
        </section>
      )}
      <section className="uf-seller-cta">
        <Icon name="burger" />
        <h2>Seu talento na cozinha pode virar renda.</h2>
        <p>
          Venda seus lanches para a galera do campus. A gente conecta vocês.
        </p>
        <Link
          className="uf-button uf-button--secondary"
          to={ROUTES.SELLER_REGISTER}
        >
          Quero vender no UNIFOOD
        </Link>
      </section>
      <button
        className="uf-logout"
        onClick={() => {
          logout();
          navigate(ROUTES.HOME, { replace: true });
        }}
      >
        <Icon name="logout" size={18} />
        Sair da conta
      </button>
    </StudentPage>
  );
}
