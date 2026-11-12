import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  adminSellerService,
  isApprovalDemo,
} from "../../services/api/adminSellerService";
import { approvalLabels, sellerApproval } from "../../utils/sellerApproval";
import { SellerReview } from "./SellerReview";
import { ROUTES } from "../../constants/routes";
import "./admin.css";
import "../../styles/approval.css";

export function AdminSellers() {
  const [params, setParams] = useSearchParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await adminSellerService.list());
    } catch {
      setError("Não foi possível carregar os cadastros. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (busy) return;
    const timer = window.setInterval(load, 30000);
    window.addEventListener("focus", load);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", load);
    };
  }, [busy, load]);
  const statuses = ["PENDING", "APPROVED", "REJECTED", "BLOCKED", "ALL"];
  const status = statuses.includes(params.get("status"))
    ? params.get("status")
    : "PENDING";
  const query = params.get("q") || "";
  const selectedId = params.get("item");
  const visible = rows.filter(
    (row) =>
      (status === "ALL" || sellerApproval(row) === status) &&
      [row.name, row.establishmentName, row.username]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(query.toLocaleLowerCase("pt-BR")),
  );
  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "item") next.delete("item");
    setMessage("");
    setParams(next, { replace: key === "q" });
  }
  function saved(changed) {
    setRows((current) =>
      current.map((row) =>
        String(row.id) === String(changed.id) ? { ...row, ...changed } : row,
      ),
    );
    setMessage(
      sellerApproval(changed) === "APPROVED"
        ? "Cadastro aprovado."
        : "Cadastro recusado.",
    );
  }
  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-page-header">
          <div>
            <Link className="operations-back" to={ROUTES.ADMIN_HOME}>
              ← Visão geral
            </Link>
            <span className="admin-eyebrow">Administração</span>
            <h1>Vendedores</h1>
            <p>Confira os dados do vendedor antes de autorizar sua operação.</p>
          </div>
        </header>
        {isApprovalDemo() && (
          <p className="operations-notice">
            Demonstração visual: decisões de teste salvas apenas neste
            navegador. Nenhum cadastro real é alterado.
          </p>
        )}
        <p className="approval-notice">
          {loading
            ? "Consultando cadastros…"
            : error
              ? "Não foi possível atualizar a fila."
              : `${rows.filter((row) => sellerApproval(row) === "PENDING").length} cadastro(s) em análise`}
        </p>
        <div className="approval-toolbar">
          <label>
            Buscar vendedor
            <input
              type="search"
              value={query}
              disabled={busy}
              onChange={(event) => update("q", event.target.value)}
              placeholder="Nome, estabelecimento ou usuário"
            />
          </label>
          <label>
            Status do cadastro
            <select
              value={status}
              disabled={busy}
              onChange={(event) => update("status", event.target.value)}
            >
              <option value="PENDING">Cadastros pendentes</option>
              <option value="APPROVED">Aprovados</option>
              <option value="REJECTED">Recusados</option>
              <option value="BLOCKED">Bloqueados</option>
              <option value="ALL">Todos</option>
            </select>
          </label>
          <button
            className="approval-refresh"
            disabled={loading || busy}
            onClick={load}
          >
            Atualizar cadastros
          </button>
        </div>
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
        {selectedId && (
          <SellerReview
            key={selectedId}
            sellerId={selectedId}
            onSaved={saved}
            onBusyChange={setBusy}
            onClose={() => update("item", "")}
          />
        )}
        {loading ? (
          <p role="status">Carregando cadastros…</p>
        ) : (
          <section
            className="operations-records"
            aria-label="Cadastros de vendedores"
          >
            {visible.map((row) => (
              <article className="admin-panel" key={row.id}>
                <span className="operations-tag">
                  {approvalLabels[sellerApproval(row)]}
                </span>
                <h2>{row.establishmentName || row.name}</h2>
                <p>{row.name}</p>
                <button
                  className="approval-refresh"
                  disabled={busy}
                  onClick={() => update("item", row.id)}
                >
                  {sellerApproval(row) === "PENDING"
                    ? "Analisar cadastro de"
                    : "Ver cadastro de"}{" "}
                  {row.establishmentName || row.name}
                </button>
              </article>
            ))}
            {!visible.length && !error && (
              <div className="admin-panel operations-empty">
                <h2>Nenhum cadastro encontrado</h2>
                <p>
                  {query
                    ? "Tente outro nome ou limpe a busca."
                    : "Não há vendedores nesta situação."}
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
