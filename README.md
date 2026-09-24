# UniFood

Marketplace de comida conectando estudantes e vendedores (produtores/lojistas) dentro do
ambiente universitário. Três áreas de uso: **estudante** (compra), **vendedor** (gerencia
produtos, cardápio e pedidos) e **admin** (gestão geral da plataforma).

## Stack

- React + Vite
- React Router (rotas protegidas por papel: student / seller / admin)
- Context API para autenticação e carrinho
- Camada de `services/api` isolando chamadas HTTP por domínio

## Estrutura

Veja `src/` — organizado por `components` (ui / layout / domínio), `pages` (por papel),
`layouts`, `routes`, `services`, `hooks`, `contexts`, `constants`, `types` e `utils`.

Pontos de decisão de arquitetura:

- **Carrinho**: `useCart` vive dentro de `contexts/CartContext.jsx` (não existe mais
  `hooks/useCart.js` separado) para evitar duas fontes de verdade sobre o mesmo estado.
- **Constantes**: `src/constants/` é uma pasta (não mais um único `utils/constants.js`),
  dividida por domínio (`roles.js`, `orderStatus.js`, `routes.js`) para não virar um
  arquivo monolítico conforme o projeto cresce.
- **Tipos**: `src/types/` documenta os shapes de `User`, `Product` e `Order` via JSDoc
  (`@typedef`), dando autocomplete e checagem leve sem precisar migrar para TypeScript.
- **Testes**: colocados ao lado do código (`Componente.test.jsx` dentro da própria pasta
  do componente) em vez de uma pasta central `__tests__/`, para que teste e implementação
  andem juntos.

## Rodando o projeto

```bash
npm install
cp .env.example .env
npm run dev
```

## Testes

```bash
npm run test
```

## Etapa atual — Autenticação e acesso

Implementado no front-end:

- `/login` com seleção de estudante, vendedor e administrador;
- `/cadastro` para escolha do perfil;
- `/cadastro/estudante`;
- `/cadastro/vendedor`;
- `/recuperar-senha`;
- armazenamento local de token e usuário;
- logout e limpeza da sessão;
- identificação do papel pelo usuário autenticado;
- proteção de rotas com `ProtectedRoute`;
- redirecionamento para `/estudante`, `/vendedor` ou `/admin` conforme o perfil;
- retorno para a rota originalmente solicitada após login;
- camada `services/api` preparada para o backend através de `VITE_API_BASE_URL`.

> A autenticação real depende do backend. O front-end espera que `POST /auth/login` retorne `{ token, user }`.
