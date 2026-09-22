import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './seller.css';

export function ProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(productId);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', available: true });
  const [saved, setSaved] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  function submit(event) { event.preventDefault(); setSaved(true); setTimeout(() => navigate(ROUTES.SELLER_PRODUCTS), 500); }
  return <main className="seller-page"><div className="seller-container seller-narrow">
    <header className="seller-page-header"><div><Link className="seller-back" to={ROUTES.SELLER_PRODUCTS}>← Produtos</Link><span className="seller-eyebrow">Catálogo</span><h1>{editing ? 'Editar produto' : 'Novo produto'}</h1><p>Informe os dados que os estudantes verão no seu cardápio.</p></div></header>
    <form className="seller-panel seller-form" onSubmit={submit}>
      <label>Nome do produto<input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ex.: Coxinha de frango" /></label>
      <label>Descrição<textarea rows="4" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Descreva o produto de forma objetiva." /></label>
      <div className="seller-form-grid"><label>Preço<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="0,00" /></label><label>Estoque<input required type="number" min="0" step="1" value={form.stock} onChange={(e) => update('stock', e.target.value)} placeholder="0" /></label></div>
      <label className="seller-switch-row"><input type="checkbox" checked={form.available} onChange={(e) => update('available', e.target.checked)} /><span><strong>Produto disponível</strong><small>Desative quando não quiser receber novos pedidos desse item.</small></span></label>
      {saved && <div className="seller-form-success" role="status">Produto salvo. Redirecionando para o catálogo…</div>}
      <div className="seller-form-actions"><Link className="seller-secondary-button" to={ROUTES.SELLER_PRODUCTS}>Cancelar</Link><button className="seller-primary-button" type="submit">{editing ? 'Salvar alterações' : 'Cadastrar produto'}</button></div>
    </form>
  </div></main>;
}
