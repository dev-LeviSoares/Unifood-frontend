import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './seller.css';

export function Products() {
  return (
    <main className="seller-page"><div className="seller-container">
      <header className="seller-page-header"><div><span className="seller-eyebrow">Catálogo</span><h1>Produtos</h1><p>Gerencie os itens que aparecem no seu cardápio.</p></div><Link className="seller-primary-button" to={ROUTES.SELLER_PRODUCT_NEW}>Novo produto</Link></header>
      <section className="seller-panel seller-empty-panel"><div className="seller-empty-icon">+</div><h2>Nenhum produto cadastrado</h2><p>Comece adicionando os produtos que os estudantes poderão encontrar no seu estabelecimento.</p><Link className="seller-primary-button" to={ROUTES.SELLER_PRODUCT_NEW}>Cadastrar produto</Link></section>
    </div></main>
  );
}
