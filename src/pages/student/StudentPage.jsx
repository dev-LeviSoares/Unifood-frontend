import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketplaceHeader } from './marketplace/MarketplaceHeader';
import { useCart } from '../../contexts/CartContext';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import '../../styles/marketplace-design.css';

export function StudentPage({
  title,
  heading,
  subtitle,
  children,
  cartBar = false,
  narrow = false,
  action,
}) {
  useDocumentTitle(title);
  const pageRef = useRef(null);
  const cartBarRef = useRef(null);
  const footerRef = useRef(null);
  const [footerVisible, setFooterVisible] = useState(false);
  const { items, totalInCents } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const hasCartBar = cartBar && count > 0;

  useEffect(() => {
    const footer = footerRef.current;
    if (!hasCartBar || !footer) return;

    function updateVisibility() {
      const rect = footer.getBoundingClientRect();
      setFooterVisible(rect.top < window.innerHeight && rect.bottom > 0);
    }
    updateVisibility();

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(([entry]) => {
        setFooterVisible(entry.isIntersecting);
      });
      observer.observe(footer);
      return () => observer.disconnect();
    }

    // Alternativa para navegadores sem IntersectionObserver.
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, [hasCartBar]);

  // Reserva a altura real da barra, inclusive quando o texto ocupa duas linhas.
  useEffect(() => {
    const bar = cartBarRef.current;
    if (!bar) return;
    function reserveSpace() {
      pageRef.current?.style.setProperty(
        '--uf-cart-bar-height',
        `${bar.offsetHeight}px`,
      );
    }
    reserveSpace();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', reserveSpace);
      return () => window.removeEventListener('resize', reserveSpace);
    }
    const observer = new ResizeObserver(reserveSpace);
    observer.observe(bar);
    return () => observer.disconnect();
  }, [cartBar, count]);
  return (
    <div
      ref={pageRef}
      className={`marketplace-page uf-page${cartBar && count ? ' has-cart-bar' : ''}`}
    >
      <MarketplaceHeader title={title} />
      <main className={`uf-container${narrow ? ' uf-container--narrow' : ''}`}>
        {heading && (
          <div className="uf-page-heading">
            <div>
              <h1>{heading}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </main>
      <footer ref={footerRef} className="uf-footer">
        <p>Seu lanche, no seu campus.</p>
        <span>Retirada combinada com o vendedor.</span>
      </footer>
      {hasCartBar && (
        <div
          className="uf-cart-bar-wrap"
          aria-hidden={footerVisible || undefined}
          // Mantém a altura medida para a página não saltar ao ocultar a barra.
          style={{ visibility: footerVisible ? 'hidden' : undefined }}
        >
          <Link
            ref={cartBarRef}
            className="uf-cart-bar"
            to={ROUTES.CART}
            tabIndex={footerVisible ? -1 : undefined}
          >
            <b className="uf-cart-count">{count}</b>
            <span className="uf-cart-bar__total">
              <small>Total sem taxas</small>
              <strong>{formatCurrency(totalInCents)}</strong>
            </span>
            <b className="uf-cart-bar__action">
              Ver carrinho <span aria-hidden="true">→</span>
            </b>
          </Link>
        </div>
      )}
    </div>
  );
}
