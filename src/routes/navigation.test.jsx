import {
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider, useCart } from '../contexts/CartContext';
import { ToastProvider } from '../contexts/ToastContext';
import { AppRoutes } from './AppRoutes';
import { marketplaceProducts } from '../data/marketplaceMock';
import { sellerService } from '../services/api/sellerService';
import { demoOrders } from '../services/storage/demoOrders';

vi.mock('../services/api/productService', () => ({
  productService: {
    getById: vi.fn().mockRejectedValue(new Error('offline')),
    listBySeller: vi.fn().mockRejectedValue(new Error('offline')),
  },
}));
vi.mock('../services/api/sellerService', () => ({
  sellerService: {
    getById: vi.fn().mockRejectedValue(new Error('offline')),
    list: vi.fn().mockRejectedValue(new Error('offline')),
  },
}));
function Controls() {
  const navigate = useNavigate();
  const cart = useCart();
  return (
    <>
      <button onClick={() => navigate(-1)}>Voltar teste</button>
      <button onClick={() => navigate(1)}>Avançar teste</button>
      <button onClick={() => cart.addItem(marketplaceProducts[0])}>
        Adicionar teste
      </button>
      <button
        onClick={() => {
          cart.addItem(marketplaceProducts[0]);
          cart.addItem(marketplaceProducts[1]);
        }}
      >
        Adicionar dois teste
      </button>
    </>
  );
}
function open(path, authenticated = true) {
  if (authenticated) {
    localStorage.setItem('unifood_token', 'test-token');
    localStorage.setItem(
      'unifood_user',
      JSON.stringify({ id: 'student-test', name: 'Aluno', role: 'student' }),
    );
  }
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Controls />
            <AppRoutes />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
beforeEach(() => localStorage.clear());
afterEach(cleanup);
describe('Navegação do estudante', () => {
  it('conecta produto, carrinho, checkout e histórico sem perder itens ao voltar', async () => {
    open('/produto/x-burguer');
    await screen.findByRole('heading', { name: 'X-Burguer da Casa' });
    fireEvent.click(screen.getByRole('button', { name: 'Comprar agora' }));
    await screen.findByRole('heading', {
      name: 'Seu intervalo está quase pronto.',
    });
    fireEvent.click(screen.getByRole('button', { name: 'Voltar teste' }));
    await screen.findByRole('heading', { name: 'X-Burguer da Casa' });
    fireEvent.click(screen.getByRole('button', { name: 'Avançar teste' }));
    await screen.findByRole('heading', {
      name: 'Seu intervalo está quase pronto.',
    });
    expect(
      screen.getByRole('heading', { name: '1× X-Burguer da Casa' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: /Finalizar pedido ·/ }));
    await screen.findByRole('heading', {
      name: 'Só falta combinar seu intervalo.',
    });
    fireEvent.click(screen.getByRole('button', { name: /Confirmar pedido ·/ }));
    await screen.findByRole('heading', { name: 'Deu bom! Pedido confirmado.' });
    expect(demoOrders.list('student-test')).toHaveLength(1);
    expect(
      JSON.parse(localStorage.getItem('unifood_cart:student-test')).items,
    ).toHaveLength(0);
    fireEvent.click(screen.getByRole('link', { name: 'Meus pedidos' }));
    await screen.findByRole('heading', { name: 'Seus lanches, por aqui.' });
    expect(
      screen.getByRole('link', { name: 'Acompanhar pedido' }),
    ).toBeInTheDocument();
  });
  it('restaura o carrinho depois de remontar a aplicação', async () => {
    const view = open('/carrinho');
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar teste' }));
    await screen.findByRole('heading', { name: '1× X-Burguer da Casa' });
    view.unmount();
    open('/carrinho');
    expect(
      await screen.findByRole('heading', { name: '1× X-Burguer da Casa' }),
    ).toBeInTheDocument();
  });
  it('libera outro vendedor ao remover o último produto', async () => {
    open('/carrinho');
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar teste' }));
    fireEvent.click(
      await screen.findByRole('button', { name: 'Remover X-Burguer da Casa' }),
    );
    expect(
      JSON.parse(localStorage.getItem('unifood_cart:student-test')).sellerId,
    ).toBeNull();
  });
  it('preserva a pesquisa no voltar do histórico', async () => {
    open('/vendedores?view=sellers&q=Maria');
    await screen.findByRole('heading', { name: 'Cantinho da Maria' });
    fireEvent.click(screen.getByRole('link', { name: 'Ver cardápio' }));
    await screen.findByRole('heading', { name: 'Cantinho da Maria' });
    fireEvent.click(screen.getByRole('button', { name: 'Voltar teste' }));
    await waitFor(() =>
      expect(
        screen.getByRole('searchbox', {
          name: 'Pesquisar vendedores e lanches',
        }),
      ).toHaveValue('Maria'),
    );
  });
  it.each([
    '/checkout',
    '/estudante/pedidos',
    '/estudante/perfil',
    '/estudante/pedidos/inexistente',
    '/endereco-inexistente',
  ])('renderiza acesso direto a %s com conteúdo', async (path) => {
    open(path);
    expect(
      await screen.findByRole('heading', { level: 1 }),
    ).toBeInTheDocument();
  });
  it('envia visitante do carrinho ao login', async () => {
    open('/carrinho', false);
    expect(
      await screen.findByRole('heading', { name: /Bem-vindo ao Unifood/ }),
    ).toBeInTheDocument();
  });
  it('adiciona vários itens em sequência sem sobrescrever o primeiro', async () => {
    open('/carrinho');
    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar dois teste' }),
    );
    await screen.findByRole('heading', { name: '1× X-Burguer da Casa' });
    expect(
      screen.getByRole('heading', { name: '1× Coxinha de Frango' }),
    ).toBeInTheDocument();
    expect(
      JSON.parse(localStorage.getItem('unifood_cart:student-test')).items,
    ).toHaveLength(2);
  });
  it('salva favorito e permite encontrá-lo no perfil', async () => {
    open('/produto/x-burguer');
    await screen.findByRole('heading', { name: 'X-Burguer da Casa' });
    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar nos favoritos' }),
    );
    expect(
      screen.getByRole('button', { name: 'Remover dos favoritos' }),
    ).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('link', { name: 'Minha conta' }));
    await screen.findByRole('heading', { name: 'Aluno' });
    fireEvent.click(screen.getByRole('button', { name: /Favoritos Veja/ }));
    expect(
      screen.getByRole('link', { name: 'X-Burguer da Casa' }),
    ).toBeInTheDocument();
  });
  it('move pedido para histórico ao concluir as etapas de demonstração', async () => {
    const order = demoOrders.create(
      'student-test',
      {
        items: [
          {
            productId: 'x-burguer',
            name: 'X-Burguer da Casa',
            unitPriceInCents: 1490,
            quantity: 1,
          },
        ],
        totalInCents: 1490,
        sellerId: 'cantinho-da-maria',
      },
      'pix',
      '',
    );
    open(`/estudante/pedidos/${order.id}`);
    for (const label of ['Em preparo', 'Pronto para retirar', 'Retirado']) {
      fireEvent.click(
        screen.getByRole('button', { name: `Simular: ${label}` }),
      );
    }
    expect(
      screen.getByRole('heading', { name: 'Retirado. Bom apetite!' }),
    ).toBeInTheDocument();
    expect(demoOrders.get('student-test', order.id).step).toBe(3);
    fireEvent.click(screen.getByRole('link', { name: 'Meus pedidos' }));
    fireEvent.click(
      await screen.findByRole('button', { name: 'Histórico · 1' }),
    );
    expect(
      screen.getByRole('button', { name: 'Pedir novamente' }),
    ).toBeInTheDocument();
  });
  it('trata HTML recebido com status 200 como API indisponível', async () => {
    sellerService.list.mockResolvedValueOnce(
      '<html>Servidor de desenvolvimento</html>',
    );
    open('/');
    expect(
      (await screen.findAllByRole('heading', { name: 'X-Burguer da Casa' }))
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText('Você está explorando um catálogo de demonstração.'),
    ).toBeInTheDocument();
  });
  it('retorna ao checkout após editar os dados sem perder a forma de pagamento', async () => {
    open('/carrinho');
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar teste' }));
    fireEvent.click(
      await screen.findByRole('link', { name: /Finalizar pedido ·/ }),
    );
    fireEvent.click(screen.getByRole('radio', { name: /Pix Demonstração/ }));
    fireEvent.click(screen.getByRole('link', { name: 'Editar' }));
    fireEvent.change(await screen.findByRole('textbox', { name: 'Nome' }), {
      target: { value: 'Nome atualizado' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar preferências' }),
    );
    await screen.findByRole('heading', {
      name: 'Só falta combinar seu intervalo.',
    });
    expect(screen.getByText('Nome atualizado')).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /Pix Demonstração/ }),
    ).toBeChecked();
  });
  it('preserva cartão de crédito ao voltar e registra a opção no pedido', async () => {
    open('/carrinho');
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar teste' }));
    fireEvent.click(
      await screen.findByRole('link', { name: /Finalizar pedido ·/ }),
    );
    fireEvent.click(
      screen.getByRole('radio', { name: /Cartão de crédito Demonstração/ }),
    );
    fireEvent.click(screen.getByRole('link', { name: 'Editar carrinho' }));
    await screen.findByRole('heading', {
      name: 'Seu intervalo está quase pronto.',
    });
    fireEvent.click(screen.getByRole('button', { name: 'Voltar teste' }));
    await screen.findByRole('heading', {
      name: 'Só falta combinar seu intervalo.',
    });
    expect(
      screen.getByRole('radio', { name: /Cartão de crédito Demonstração/ }),
    ).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: /Confirmar pedido ·/ }));
    await screen.findByRole('heading', { name: 'Deu bom! Pedido confirmado.' });
    expect(demoOrders.list('student-test')[0].paymentMethod).toBe(
      'credit-card',
    );
    expect(
      screen.getByText(/Cartão de crédito demonstrativo · sem cobrança/),
    ).toBeInTheDocument();
  });
  it('não expõe pedidos de outra conta', () => {
    demoOrders.create(
      'other-user',
      {
        items: [{ productId: 'x', quantity: 1 }],
        totalInCents: 100,
        sellerId: 'seller',
      },
      'Dinheiro',
      '',
    );
    open('/estudante/pedidos');
    expect(screen.getByText('Você ainda não tem pedidos')).toBeInTheDocument();
  });
});
