import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { StudentPage } from '../student/StudentPage';
export function NotFound() {
  return (
    <StudentPage
      title="Página não encontrada"
      heading="Essa página saiu do cardápio."
    >
      <div className="uf-empty">
        <p>
          O endereço não existe ou foi alterado. Vamos encontrar seu próximo
          lanche?
        </p>
        <Link className="uf-button" to={ROUTES.HOME}>
          Voltar ao início
        </Link>
        <Link className="uf-text-link" to={ROUTES.SELLERS}>
          Explorar lanches
        </Link>
      </div>
    </StudentPage>
  );
}
