import { useEffect } from 'react';

const SUFFIX = ' · UniFood';

/**
 * Atualiza o <title> da aba por página. Sem isso, toda rota do app mostra
 * "UniFood" no título da aba do navegador (inclusive no histórico e nos
 * favoritos), o que é ruim tanto pra usuário navegando com várias abas
 * abertas quanto pra SEO (o title da aba é um dos sinais que o Google usa
 * pra entender do que a página trata).
 *
 * @param {string} title - sem o sufixo " · UniFood", que é adicionado aqui.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title}${SUFFIX}` : 'UniFood';
  }, [title]);
}
