import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { sellerService } from '../../../services/api/sellerService';
import { marketplaceSellers } from '../../../data/marketplaceMock';
import { ROUTES } from '../../../constants/routes';
import { MarketplaceHeader } from './MarketplaceHeader';
import './marketplace.css';

export function Marketplace() {
  const [query, setQuery] = useState('');
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSellers() {
      setLoading(true);
      setError('');
      try {
        const data = await sellerService.list({ status: 'APPROVED' });
        const result = Array.isArray(data) ? data : data?.items ?? data?.sellers ?? [];
        const approved = result.filter((seller) => !seller.status || seller.status === 'APPROVED' || seller.status === 'ACTIVE');
        if (active) setSellers(approved);
      } catch {
        if (active) {
          setSellers(marketplaceSellers);
          setError('Não foi possível conectar ao servidor. Exibindo o cardápio de demonstração.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSellers();
    return () => { active = false; };
  }, []);

  const filteredSellers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return sellers;
    return sellers.filter((seller) =>
      [seller.name, seller.description, seller.category, seller.campus]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [query, sellers]);

  return (
    <div className="marketplace-page">
      <MarketplaceHeader />
      <main className="marketplace-container">
        <section className="marketplace-hero">
          <div>
            <span className="marketplace-eyebrow">🎓 Seu intervalo começa aqui</span>
            <h1>O que você vai comer entre uma aula e outra?</h1>
            <p>Encontre vendedores da sua universidade, escolha seu lanche e deixe o pedido encaminhado para a retirada.</p>
          </div>
          <div className="marketplace-hero__note">
            <strong>Sem perder tempo na fila.</strong>
            <span>Escolha primeiro. Retire quando estiver pronto.</span>
          </div>
        </section>

        <section className="marketplace-search" aria-label="Pesquisar vendedores">
          <Input
            label="Pesquisar vendedores"
            placeholder="Ex.: lanches, café, Cantinho da Maria..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </section>

        {error && <div className="marketplace-alert" role="status">{error}</div>}

        <section className="marketplace-section" aria-labelledby="sellers-title">
          <div className="marketplace-section__heading">
            <div>
              <span className="marketplace-section__kicker">Perto de você</span>
              <h2 id="sellers-title">Quem está servindo hoje</h2>
            </div>
            {!loading && <span className="marketplace-section__count">{filteredSellers.length} opções</span>}
          </div>

          {loading ? (
            <div className="marketplace-grid" aria-label="Carregando vendedores">
              {[1, 2, 3].map((item) => <div className="seller-card seller-card--skeleton" key={item} />)}
            </div>
          ) : filteredSellers.length > 0 ? (
            <div className="marketplace-grid">
              {filteredSellers.map((seller) => (
                <article className="seller-card" key={seller.id}>
                  <div className="seller-card__visual">
                    <div className="seller-card__initials" aria-hidden="true">{seller.name?.slice(0, 2).toUpperCase()}</div>
                    {seller.status === 'OPEN' ? <Badge tone="success">Pedidos disponíveis</Badge> : <Badge tone="neutral">Fechado agora</Badge>}
                  </div>
                  <div className="seller-card__body">
                    <div className="seller-card__meta">{seller.category || 'Lanches'} · {seller.campus || 'Sua universidade'}</div>
                    <h3>{seller.name}</h3>
                    <p>{seller.description}</p>
                    <span className="seller-card__pickup">{seller.pickupTime}</span>
                  </div>
                  <Link className="seller-card__link" to={`${ROUTES.SELLERS}/${seller.id}`}>
                    <Button variant="secondary" fullWidth>Ver cardápio</Button>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="marketplace-empty">
              <span aria-hidden="true">🔎</span>
              <h3>Nenhum vendedor encontrado</h3>
              <p>Tente buscar pelo nome do vendedor ou pelo tipo de lanche.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
