import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  adminSellerService,
  isApprovalDemo,
} from "../../services/api/adminSellerService";
import { sellerApproval } from "../../utils/sellerApproval";
import { ROUTES } from "../../constants/routes";
import "../../styles/approval.css";

export function PendingSellerNotice() {
  const [count, setCount] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    async function update() {
      try {
        const rows = await adminSellerService.list();
        if (active) {
          setCount(
            rows.filter((row) => sellerApproval(row) === "PENDING").length,
          );
          setFailed(false);
        }
      } catch {
        if (active) setFailed(true);
      }
    }
    update();
    const timer = window.setInterval(update, 30000);
    window.addEventListener("focus", update);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, []);
  return (
    <section className="admin-panel" aria-label="Aprovação de vendedores">
      <span className="admin-eyebrow">
        {isApprovalDemo()
          ? "Cadastros de demonstração"
          : "Cadastros de vendedores"}
      </span>
      <h2>Cadastros pendentes</h2>
      <p aria-live="polite">
        {failed
          ? "Não foi possível consultar os cadastros. Acesse a fila para tentar novamente."
          : count === null
            ? "Consultando solicitações…"
            : `${count} cadastro(s) aguardando sua análise.`}
      </p>
      <Link
        className="admin-outline-action"
        to={`${ROUTES.ADMIN_SELLERS}?status=PENDING`}
      >
        Analisar cadastros pendentes →
      </Link>
    </section>
  );
}
