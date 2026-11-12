import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { sellerApproval, approvalLabels } from "../utils/sellerApproval";
import { ROUTES } from "../constants/routes";

export function SellerApprovalGate({ children }) {
  const { user, refreshApproval } = useAuth();
  const { pathname } = useLocation();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(false);
  async function check() {
    setChecking(true);
    try {
      await refreshApproval();
      setError(false);
    } catch {
      setError(true);
    } finally {
      setChecking(false);
    }
  }
  useEffect(() => {
    let active = true;
    const sync = async () => {
      try {
        await refreshApproval();
        if (active) setError(false);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setChecking(false);
      }
    };
    setChecking(true);
    sync();
    const interval = window.setInterval(sync, 30000);
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("unifood:approval-changed", sync);
    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("unifood:approval-changed", sync);
    };
  }, [refreshApproval]);
  const personal = [ROUTES.SELLER_HOME, ROUTES.SELLER_PROFILE].includes(
    pathname,
  );
  if (personal)
    return (
      <>
        {error && (
          <p className="approval-notice" role="alert">
            Não foi possível atualizar a situação do cadastro.{" "}
            <button onClick={check}>Tentar novamente</button>
          </p>
        )}
        {children}
      </>
    );
  if (checking) return <p role="status">Verificando aprovação do cadastro…</p>;
  if (error || sellerApproval(user) !== "APPROVED")
    return (
      <main className="seller-page">
        <div className="seller-container">
          <section className="admin-panel">
            <h1>
              {error
                ? "Não foi possível verificar sua aprovação"
                : approvalLabels[sellerApproval(user)]}
            </h1>
            <p>
              {error
                ? "Tente novamente para acessar a operação."
                : "Somente vendedores aprovados podem publicar produtos, gerenciar cardápios e operar pedidos."}
            </p>
            {user?.rejectionReason && <p>Motivo: {user.rejectionReason}</p>}
            <div className="approval-actions">
              <button onClick={check}>Atualizar situação</button>
              <Link to={ROUTES.SELLER_HOME}>Voltar ao painel</Link>
              <Link to={ROUTES.SELLER_PROFILE}>Ver meu perfil</Link>
            </div>
          </section>
        </div>
      </main>
    );
  return children;
}
