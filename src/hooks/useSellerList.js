import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

// Shared loading/error handling prevents HTML fallback responses from breaking lists.
export function useSellerList(loader, field) {
  const {
    user
  } = useAuth();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({
    items: [],
    loading: true,
    error: false
  });
  useEffect(() => {
    let active = true;
    setState({
      items: [],
      loading: true,
      error: false
    });
    Promise.resolve().then(() => loader(user?.id)).then(data => {
      const items = Array.isArray(data) ? data : data?.items ?? data?.[field];
      if (!Array.isArray(items) || items.some(item => !item || typeof item !== 'object' || item.id == null)) throw new Error('Lista inválida.');
      if (active) setState({
        items,
        loading: false,
        error: false
      });
    }).catch(() => {
      if (active) setState({
        items: [],
        loading: false,
        error: true
      });
    });
    return () => {
      active = false;
    };
  }, [user?.id, loader, field, attempt]);
  return {
    ...state,
    retry: () => setAttempt(value => value + 1)
  };
}
