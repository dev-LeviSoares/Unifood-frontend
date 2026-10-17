import { fireEvent, render, screen, cleanup, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StudentPage } from './StudentPage';

vi.mock('./marketplace/MarketplaceHeader', () => ({ MarketplaceHeader: () => null }));
vi.mock('../../hooks/useDocumentTitle', () => ({ useDocumentTitle: () => {} }));
const cart = vi.hoisted(() => ({ items: [{ quantity: 2 }], totalInCents: 1500 }));
vi.mock('../../contexts/CartContext', () => ({ useCart: () => cart }));
let onIntersection;
const disconnect = vi.fn();
beforeEach(() => {
  cart.items = [{ quantity: 2 }];
  disconnect.mockClear();
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback) { onIntersection = callback; }
    observe() {}
    disconnect() { disconnect(); }
  });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function open() {
  return render(<MemoryRouter><StudentPage title="Teste" cartBar><h1>Lanches</h1></StudentPage></MemoryRouter>);
}

describe('Barra do carrinho junto ao rodapé', () => {
  it('oculta ao entrar no rodapé e reaparece ao subir, preservando itens e altura', () => {
    const { container } = open();
    const link = screen.getByRole('link', { name: /Ver carrinho/ });
    expect(link).toBeVisible();
    act(() => onIntersection([{ isIntersecting: true }]));
    expect(link).not.toBeVisible();
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(container.querySelector('.uf-page')).toHaveClass('has-cart-bar');
    expect(container.querySelector('.uf-cart-count')).toHaveTextContent('2');
    act(() => onIntersection([{ isIntersecting: false }]));
    expect(link).toBeVisible();
    expect(link).not.toHaveAttribute('tabindex');
    expect(link).toHaveAttribute('href', '/carrinho');
  });
  it('desconecta o observador ao sair da página', () => {
    const { unmount } = open();
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
  it('não cria barra nem observador para carrinho vazio', () => {
    cart.items = [];
    const { container } = open();
    expect(container.querySelector('.uf-cart-bar-wrap')).not.toBeInTheDocument();
    expect(container.querySelector('.uf-page')).not.toHaveClass('has-cart-bar');
  });
  it('funciona por rolagem quando IntersectionObserver não existe', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { container, unmount } = open();
    const footer = container.querySelector('footer');
    const link = screen.getByRole('link', { name: /Ver carrinho/ });
    vi.spyOn(footer, 'getBoundingClientRect').mockReturnValue({ top: 10, bottom: 100 });
    fireEvent.scroll(window);
    expect(link).not.toBeVisible();
    vi.spyOn(footer, 'getBoundingClientRect').mockReturnValue({ top: 2000, bottom: 2100 });
    fireEvent.scroll(window);
    expect(link).toBeVisible();
    unmount();
  });
});
