import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './seller.css';

export function MenuForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', start: '', end: '', published: false });
  function update(key, value) { setForm((current) => ({ ...current, [key]: value })); }
  function submit(event) { event.preventDefault(); navigate(ROUTES.SELLER_MENUS); }
  return <main className="seller-page"><div className="seller-container seller-narrow">
    <header className="seller-page-header"><div><Link className="seller-back" to={ROUTES.SELLER_MENUS}>← Cardápios</Link><span className="seller-eyebrow">Cardápio</span><h1>Novo cardápio</h1><p>Escolha um nome e o período em que este cardápio ficará disponível.</p></div></header>
    <form className="seller-panel seller-form" onSubmit={submit}>
      <label>Nome do cardápio<input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ex.: Intervalo da manhã" /></label>
      <div className="seller-form-grid"><label>Início<input required type="time" value={form.start} onChange={(e) => update('start', e.target.value)} /></label><label>Fim<input required type="time" value={form.end} onChange={(e) => update('end', e.target.value)} /></label></div>
      <div className="seller-form-info"><strong>Produtos</strong><p>A seleção dos produtos do cardápio será feita aqui quando o catálogo estiver conectado à API.</p></div>
      <label className="seller-switch-row"><input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} /><span><strong>Publicar ao salvar</strong><small>Disponibiliza o cardápio para estudantes assim que a integração estiver ativa.</small></span></label>
      <div className="seller-form-actions"><Link className="seller-secondary-button" to={ROUTES.SELLER_MENUS}>Cancelar</Link><button className="seller-primary-button" type="submit">Salvar cardápio</button></div>
    </form>
  </div></main>;
}
