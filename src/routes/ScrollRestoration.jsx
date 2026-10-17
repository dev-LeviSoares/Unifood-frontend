import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
const positions = new Map();
export function ScrollRestoration() {
  const { key } = useLocation();
  const navigationType = useNavigationType();
  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const target = navigationType === 'POP' ? (positions.get(key) ?? 0) : 0;
    let restoring = true;
    let observer;
    function restore() {
      window.scrollTo(0, target);
      if (Math.abs(window.scrollY - target) < 2) {
        restoring = false;
        observer?.disconnect();
      }
    }
    function remember() {
      if (!restoring) positions.set(key, window.scrollY);
    }
    function stopRestoring() {
      restoring = false;
      observer?.disconnect();
    }
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        if (restoring) restore();
      });
      observer.observe(document.body);
    }
    const frame = requestAnimationFrame(restore);
    window.addEventListener('scroll', remember, { passive: true });
    window.addEventListener('wheel', stopRestoring, { passive: true });
    window.addEventListener('touchstart', stopRestoring, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', remember);
      window.removeEventListener('wheel', stopRestoring);
      window.removeEventListener('touchstart', stopRestoring);
      window.history.scrollRestoration = previous;
    };
  }, [key, navigationType]);
  return null;
}
