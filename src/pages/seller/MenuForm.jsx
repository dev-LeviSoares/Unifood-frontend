import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { menuService } from '../../services/api/menuService';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { isNotEmpty } from '../../utils/validators';
import './seller.css';

export function MenuForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', start: '', end: '', published: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');

    if (!isNotEmpty(form.name) || !isNotEmpty(form.start) || !isNotEmpty(form.end)) {
      setError('Preencha nome, início e fim do cardápio.');
      return;
    }

    setLoading(true);
    try {
      // sellerId não vai mais no corpo — mesma razão do ProductForm.jsx
      await menuService.create(form);
      toast.success('Cardápio salvo.');
      navigate(ROUTES.SELLER_MENUS);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Não foi possível salvar o cardápio.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="seller-page">
      <div className="seller-container seller-narrow">
        <header className="seller-page-header">
          <div>
            <Link className="seller-back" to={ROUTES.SELLER_MENUS}>← Cardápios</Link>
            <span className="seller-eyebrow">Cardápio</span>
            <h1>Novo cardápio</h1>
            <p>Escolha um nome e o período em que este cardápio ficará disponível.</p>
          </div>
        </header>

        <Card>
          <form className="seller-form" onSubmit={submit} noValidate>
            <Input
              label="Nome do cardápio"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Ex.: Intervalo da manhã"
            />
            <div className="seller-form-grid">
              <Input label="Início" type="time" value={form.start} onChange={(e) => update('start', e.target.value)} />
              <Input label="Fim" type="time" value={form.end} onChange={(e) => update('end', e.target.value)} />
            </div>

            <div className="seller-form-info">
              <strong>Produtos</strong>
              <p>A seleção dos produtos do cardápio será feita aqui quando o catálogo estiver conectado à API.</p>
            </div>

            <label className="seller-switch-row">
              <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} />
              <span>
                <strong>Publicar ao salvar</strong>
                <small>Disponibiliza o cardápio para estudantes assim que a integração estiver ativa.</small>
              </span>
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}

            <div className="seller-form-actions">
              <Link className="ui-button ui-button--secondary" to={ROUTES.SELLER_MENUS}>Cancelar</Link>
              <Button type="submit" loading={loading}>Salvar cardápio</Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
