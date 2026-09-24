import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { productService } from '../../services/api/productService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { isNotEmpty } from '../../utils/validators';
import './seller.css';

/** "12,50" ou "12.50" digitado pelo vendedor -> 1250 (centavos), formato
 * usado no resto do app (mock, ProductDetail, Cart). */
function toPriceInCents(rawValue) {
  const normalized = String(rawValue).replace(',', '.');
  const asNumber = Number(normalized);
  if (!Number.isFinite(asNumber) || asNumber < 0) return null;
  return Math.round(asNumber * 100);
}

export function ProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const editing = Boolean(productId);

  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', available: true });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(editing);

  useEffect(() => {
    if (!editing) return;
    let active = true;
    productService
      .getById(productId)
      .then((data) => {
        if (!active || !data) return;
        setForm({
          name: data.name ?? '',
          description: data.description ?? '',
          price: data.priceInCents != null ? (data.priceInCents / 100).toFixed(2) : '',
          stock: data.stock != null ? String(data.stock) : '',
          available: data.available !== false,
        });
        if (data.imageUrl) setPhotoPreviewUrl(data.imageUrl);
      })
      .catch(() => {
        // sem backend ainda / produto não encontrado: mantém o formulário vazio
      })
      .finally(() => {
        if (active) setLoadingExisting(false);
      });
    return () => { active = false; };
  }, [editing, productId]);

  useEffect(
    () => () => {
      if (photoPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(photoPreviewUrl);
    },
    [photoPreviewUrl]
  );

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handlePhotoChange(file) {
    setPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  }

  function handlePhotoRemove() {
    if (photoPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
  }

  async function submit(event) {
    event.preventDefault();
    setError('');

    if (!isNotEmpty(form.name) || !isNotEmpty(form.price) || !isNotEmpty(form.stock)) {
      setError('Preencha nome, preço e estoque.');
      return;
    }
    const priceInCents = toPriceInCents(form.price);
    if (priceInCents === null) {
      setError('Informe um preço válido.');
      return;
    }
    const stock = Number(form.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      setError('Informe um estoque válido.');
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('sellerId', user?.id ?? '');
      payload.append('name', form.name.trim());
      payload.append('description', form.description.trim());
      payload.append('priceInCents', String(priceInCents));
      payload.append('stock', String(stock));
      payload.append('available', String(form.available));
      if (photoFile) payload.append('photo', photoFile);

      if (editing) {
        await productService.update(productId, payload);
        toast.success('Produto atualizado.');
      } else {
        await productService.create(payload);
        toast.success('Produto cadastrado.');
      }
      navigate(ROUTES.SELLER_PRODUCTS);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Não foi possível salvar o produto.');
    } finally {
      setLoading(false);
    }
  }

  if (loadingExisting) {
    return (
      <main className="seller-page">
        <div className="seller-container seller-narrow">
          <p className="seller-muted">Carregando produto...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="seller-page">
      <div className="seller-container seller-narrow">
        <header className="seller-page-header">
          <div>
            <Link className="seller-back" to={ROUTES.SELLER_PRODUCTS}>← Produtos</Link>
            <span className="seller-eyebrow">Catálogo</span>
            <h1>{editing ? 'Editar produto' : 'Novo produto'}</h1>
            <p>Informe os dados que os estudantes verão no seu cardápio.</p>
          </div>
        </header>

        <Card>
          <form className="seller-form" onSubmit={submit} noValidate>
            <Input
              label="Nome do produto"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Ex.: Coxinha de frango"
            />

            <div className="ui-field">
              <label className="ui-field__label" htmlFor="description">Descrição</label>
              <textarea
                id="description"
                className="ui-field__input"
                rows="4"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Descreva o produto de forma objetiva."
              />
            </div>

            <ImageUpload
              label="Foto do produto (opcional)"
              previewUrl={photoPreviewUrl}
              onChange={handlePhotoChange}
              onRemove={handlePhotoRemove}
            />

            <div className="seller-form-grid">
              <Input
                label="Preço"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                placeholder="0,00"
              />
              <Input
                label="Estoque"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => update('stock', e.target.value)}
                placeholder="0"
              />
            </div>

            <label className="seller-switch-row">
              <input type="checkbox" checked={form.available} onChange={(e) => update('available', e.target.checked)} />
              <span>
                <strong>Produto disponível</strong>
                <small>Desative quando não quiser receber novos pedidos desse item.</small>
              </span>
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}

            <div className="seller-form-actions">
              <Link className="ui-button ui-button--secondary" to={ROUTES.SELLER_PRODUCTS}>Cancelar</Link>
              <Button type="submit" loading={loading}>
                {editing ? 'Salvar alterações' : 'Cadastrar produto'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
