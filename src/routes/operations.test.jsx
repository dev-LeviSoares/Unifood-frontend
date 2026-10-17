import { fireEvent, render, screen, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { ToastProvider } from '../contexts/ToastContext';
import { AppRoutes } from './AppRoutes';
import { productService } from '../services/api/productService';
import { orderService } from '../services/api/orderService';
import { menuService } from '../services/api/menuService';

vi.mock('../services/api/productService', () => ({ productService: { listBySeller: vi.fn(), getById: vi.fn(), create: vi.fn(), update: vi.fn() } }));
vi.mock('../services/api/orderService', () => ({ orderService: { listBySeller: vi.fn(), getById: vi.fn() } }));
vi.mock('../services/api/menuService', () => ({ menuService: { listBySeller: vi.fn(), create: vi.fn() } }));
const product = { id: 'p1', name: 'Coxinha teste', stock: 2, priceInCents: 650, available: true };
const orders = [
  { id: 'o1', status: 'pending', items: [{ productId: 'p1', name: 'Coxinha teste', quantity: 1, unitPriceInCents: 650 }], totalInCents: 650 },
  { id: 'o2', status: 'completed', items: [], totalInCents: 1300 },
];
function NavigationControls() {
  const navigate = useNavigate();
  const location = useLocation();
  return <><button onClick={() => navigate(-1)}>Voltar teste</button><button onClick={() => navigate(1)}>Avançar teste</button><output data-testid="location">{location.pathname}{location.search}</output></>;
}
function open(path, role = 'seller') {
  if (role) {
    localStorage.setItem('unifood_token', 'test-token');
    localStorage.setItem('unifood_user', JSON.stringify({ id: 'seller1', name: 'Pessoa teste', role }));
  }
  return render(<MemoryRouter initialEntries={[path]}><AuthProvider><CartProvider><ToastProvider><NavigationControls /><AppRoutes /></ToastProvider></CartProvider></AuthProvider></MemoryRouter>);
}
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  productService.listBySeller.mockResolvedValue([product]);
  productService.getById.mockImplementation((id) => id === product.id ? Promise.resolve(product) : Promise.reject(new Error('404')));
  orderService.listBySeller.mockResolvedValue(orders);
  orderService.getById.mockImplementation((id) => Promise.resolve(orders.find((order) => order.id === id)));
  menuService.listBySeller.mockResolvedValue([{ id: 'm1', name: 'Manhã', start: '08:00', end: '10:00' }]);
});
afterEach(cleanup);

describe('Áreas de operação', () => {
  it.each([
    ['/vendedor', 'Olá, Pessoa.'], ['/vendedor/perfil', 'Perfil do vendedor'],
    ['/vendedor/produtos', 'Produtos'], ['/vendedor/produtos/novo', 'Novo produto'],
    ['/vendedor/produtos/p1/editar', 'Editar produto'], ['/vendedor/cardapios', 'Cardápios'],
    ['/vendedor/cardapios/novo', 'Novo cardápio'], ['/vendedor/pedidos', 'Pedidos'],
    ['/vendedor/pedidos/o1', 'Pedido #o1'], ['/vendedor/historico', 'Histórico'],
  ])('abre diretamente %s', async (path, heading) => {
    open(path);
    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
  });
  it.each([['/admin', 'Olá, Pessoa.'], ['/admin/usuarios', 'Usuários'], ['/admin/vendedores', 'Vendedores'], ['/admin/produtos', 'Produtos'], ['/admin/pedidos', 'Pedidos']])('abre diretamente %s', async (path, heading) => {
    open(path, 'admin');
    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
    expect(screen.getByText(/Demonstração visual/)).toBeInTheDocument();
  });
  it('conecta o menu e os atalhos administrativos', () => {
    open('/admin', 'admin');
    fireEvent.click(screen.getAllByRole('link', { name: 'Vendedores' })[0]);
    expect(screen.getByRole('heading', { name: 'Vendedores' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Voltar teste' }));
    expect(screen.getByRole('heading', { name: 'Olá, Pessoa.' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Avançar teste' }));
    expect(screen.getByRole('heading', { name: 'Vendedores' })).toBeInTheDocument();
  });
  it('preserva busca, detalhes e voltar/avançar no admin', () => {
    open('/admin/produtos', 'admin');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Coxinha' } });
    fireEvent.click(screen.getByRole('link', { name: /Ver detalhes.*Coxinha de Frango/ }));
    expect(screen.getByRole('region', { name: 'Detalhes do registro' })).toHaveTextContent('Coxinha de Frango');
    fireEvent.click(screen.getByRole('button', { name: 'Voltar teste' }));
    expect(screen.queryByRole('region', { name: 'Detalhes do registro' })).not.toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('Coxinha');
    fireEvent.click(screen.getByRole('button', { name: 'Avançar teste' }));
    expect(screen.getByRole('region', { name: 'Detalhes do registro' })).toBeInTheDocument();
  });
  it('recupera busca e detalhe diretamente pelo endereço e limpa resultados vazios', () => {
    open('/admin/usuarios?q=inexistente&item=desconhecido', 'admin');
    expect(screen.getByRole('heading', { name: 'Registro não encontrado' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Limpar busca' }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getByRole('heading', { name: 'Estudante de exemplo' })).toBeInTheDocument();
  });
  it('preserva filtro ao abrir pedido e usar voltar/avançar', async () => {
    open('/vendedor/pedidos');
    await screen.findByText('Pedido #o1');
    fireEvent.click(screen.getByRole('tab', { name: 'Aguardando confirmação' }));
    fireEvent.click(screen.getByRole('link', { name: /Pedido #o1/ }));
    await screen.findByRole('heading', { name: 'Pedido #o1' });
    fireEvent.click(screen.getByRole('button', { name: 'Voltar teste' }));
    expect(screen.getByRole('tab', { name: 'Aguardando confirmação' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Avançar teste' }));
    await screen.findByRole('heading', { name: 'Pedido #o1' });
  });
  it('conecta histórico aos detalhes e retorna ao histórico', async () => {
    open('/vendedor/historico');
    fireEvent.click(await screen.findByRole('link', { name: /Pedido #o2/ }));
    await screen.findByRole('heading', { name: 'Pedido #o2' });
    fireEvent.click(screen.getByRole('link', { name: '← Histórico' }));
    expect(await screen.findByRole('link', { name: /Pedido #o2/ })).toBeInTheDocument();
  });
  it.each([
    ['/vendedor/produtos', productService.listBySeller, 'Não foi possível carregar seus produtos.'],
    ['/vendedor/cardapios', menuService.listBySeller, 'Não foi possível carregar os cardápios.'],
    ['/vendedor/pedidos', orderService.listBySeller, 'Não foi possível carregar os pedidos.'],
    ['/vendedor/historico', orderService.listBySeller, 'Não foi possível carregar o histórico.'],
  ])('trata HTML e permite tentar novamente em %s', async (path, method, title) => {
    method.mockResolvedValueOnce('<html>Vite</html>');
    open(path);
    expect(await screen.findByText(title)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Tentar novamente/i }));
    await waitFor(() => expect(screen.queryByText(title)).not.toBeInTheDocument());
  });
  it('não permite editar produto inexistente', async () => {
    open('/vendedor/produtos/ausente/editar');
    await screen.findByRole('heading', { name: 'Produto indisponível' });
    expect(screen.queryByRole('button', { name: 'Salvar alterações' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Voltar aos produtos' }));
    await screen.findByRole('heading', { name: 'Produtos' });
  });
  it('trata pedido inexistente sem tela vazia', async () => {
    open('/vendedor/pedidos/ausente');
    await screen.findByText('Este pedido ainda não está disponível.');
    fireEvent.click(screen.getByRole('link', { name: '← Pedidos' }));
    await screen.findByRole('heading', { name: 'Pedidos' });
  });
  it('salva novo produto e retorna para a lista', async () => {
    productService.create.mockResolvedValue({ id: 'novo' });
    open('/vendedor/produtos/novo');
    fireEvent.change(screen.getByLabelText('Nome do produto'), { target: { value: 'Suco teste' } });
    fireEvent.change(screen.getByLabelText('Preço'), { target: { value: '5.5' } });
    fireEvent.change(screen.getByLabelText('Estoque'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar produto' }));
    await screen.findByRole('heading', { name: 'Produtos' });
    expect(productService.create).toHaveBeenCalledTimes(1);
    expect(productService.create.mock.calls[0][0].get('priceInCents')).toBe('550');
  });
  it('salva edição de produto e retorna para a lista', async () => {
    productService.update.mockResolvedValue(product);
    open('/vendedor/produtos/p1/editar');
    await screen.findByRole('heading', { name: 'Editar produto' });
    fireEvent.change(screen.getByLabelText('Nome do produto'), { target: { value: 'Coxinha atualizada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));
    await screen.findByRole('heading', { name: 'Produtos' });
    expect(productService.update.mock.calls[0][0]).toBe('p1');
  });
  it('salva cardápio e retorna para a lista', async () => {
    menuService.create.mockResolvedValue({ id: 'novo' });
    open('/vendedor/cardapios/novo');
    fireEvent.change(screen.getByLabelText('Nome do cardápio'), { target: { value: 'Intervalo' } });
    fireEvent.change(screen.getByLabelText('Início'), { target: { value: '09:00' } });
    fireEvent.change(screen.getByLabelText('Fim'), { target: { value: '11:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar cardápio' }));
    await screen.findByRole('heading', { name: 'Cardápios' });
    expect(menuService.create).toHaveBeenCalledWith({ name: 'Intervalo', start: '09:00', end: '11:00', published: false });
  });
  it('mantém as permissões entre perfis', async () => {
    open('/admin/usuarios', 'seller');
    await screen.findByRole('heading', { name: 'Olá, Pessoa.' });
    expect(screen.getByTestId('location')).toHaveTextContent('/vendedor');
  });
  it('exige login no acesso direto', async () => {
    open('/vendedor/produtos', null);
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login'));
  });
});
