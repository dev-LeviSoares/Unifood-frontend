import { useCallback, useEffect, useId, useRef, useState } from "react";
import { adminSellerService } from "../../services/api/adminSellerService";
import { approvalLabels, sellerApproval } from "../../utils/sellerApproval";

function dateLabel(value) {
  if (!value) return "Não informado";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Data não informada"
    : date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}
// Whitelist dos dados de análise: senhas/tokens nunca são renderizados.
function reviewFields(seller) {
  return [
    ["Identificador", seller.id],
    ["Responsável", seller.name],
    ["CPF", seller.cpf],
    ["Nascimento", dateLabel(seller.birthDate)],
    ["Usuário", seller.username],
    ["Telefone", seller.phone],
    ["E-mail", seller.email],
    ["Estabelecimento", seller.establishmentName],
    ["Descrição do estabelecimento", seller.description],
    ["Local de retirada", seller.pickupPoint],
    ["Data do cadastro", dateLabel(seller.createdAt)],
    ["Analisado em", dateLabel(seller.reviewedAt)],
    [
      "Analisado por",
      seller.reviewedBy?.name ||
        (typeof seller.reviewedBy === "string" ? seller.reviewedBy : ""),
    ],
    ["Motivo da recusa", seller.rejectionReason],
  ];
}
export function SellerReview({ sellerId, onSaved, onBusyChange, onClose }) {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const [decision, setDecision] = useState(null);
  const [busy, setBusy] = useState(false);
  const dialog = useRef(null);
  const pendingSave = useRef(false);
  const titleId = useId();
  const sequence = useRef(0);
  const load = useCallback(async () => {
    const request = ++sequence.current;
    setLoading(true);
    setError("");
    try {
      const data = await adminSellerService.getById(sellerId);
      if (sequence.current === request) setSeller(data);
    } catch {
      if (sequence.current === request)
        setError("Não foi possível carregar os dados deste vendedor.");
    } finally {
      if (sequence.current === request) setLoading(false);
    }
  }, [sellerId]);
  const invalidate = useCallback(() => {
    sequence.current++;
  }, []);
  useEffect(() => {
    load();
    return invalidate;
  }, [load, invalidate]);
  function requestDecision(value) {
    setError("");
    if (value === "REJECTED" && !reason.trim()) {
      setError("Informe o motivo da recusa.");
      return;
    }
    setDecision(value);
    dialog.current.showModal();
  }
  async function save() {
    if (pendingSave.current) return;
    pendingSave.current = true;
    setBusy(true);
    onBusyChange(true);
    setError("");
    try {
      const changed = await adminSellerService.decide(
        sellerId,
        decision,
        decision === "REJECTED" ? reason.trim() : "",
      );
      setSeller((current) => ({ ...current, ...changed }));
      onSaved(changed);
      setReason("");
      dialog.current.close();
    } catch {
      setError(
        "Não foi possível salvar a decisão. Atualize os dados e tente novamente.",
      );
      dialog.current.close();
    } finally {
      pendingSave.current = false;
      setBusy(false);
      onBusyChange(false);
    }
  }
  return (
    <section
      className="admin-panel approval-review"
      aria-label="Análise do cadastro"
    >
      <div className="approval-review-heading">
        <h2>Dados do vendedor</h2>
        <button className="approval-refresh" disabled={busy} onClick={onClose}>
          Fechar análise
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p role="status">Carregando dados do vendedor…</p>
      ) : seller ? (
        <>
          <h3>{seller.establishmentName || seller.name}</h3>
          <p className="operations-tag">
            {approvalLabels[sellerApproval(seller)]}
          </p>
          {seller.photoUrl ? (
            <a href={seller.photoUrl} target="_blank" rel="noreferrer">
              <img
                className="approval-photo"
                src={seller.photoUrl}
                alt={`Foto de ${seller.name}`}
              />
            </a>
          ) : (
            <p>Foto não enviada.</p>
          )}
          <dl className="approval-fields">
            {reviewFields(seller).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || "Não informado"}</dd>
              </div>
            ))}
          </dl>
          {sellerApproval(seller) === "PENDING" && (
            <>
              <label>
                Motivo da recusa (obrigatório para recusar)
                <textarea
                  value={reason}
                  maxLength={1000}
                  disabled={busy}
                  onChange={(event) => setReason(event.target.value)}
                />
              </label>
              <div className="approval-actions">
                <button
                  className="approval-primary"
                  disabled={busy}
                  onClick={() => requestDecision("APPROVED")}
                >
                  Aprovar cadastro
                </button>
                <button
                  disabled={busy}
                  onClick={() => requestDecision("REJECTED")}
                >
                  Recusar cadastro
                </button>
                <button disabled={busy} onClick={load}>
                  Atualizar dados
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <button className="approval-refresh" onClick={load}>
          Tentar novamente
        </button>
      )}
      <dialog
        className="approval-confirm"
        ref={dialog}
        aria-labelledby={titleId}
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
      >
        <h2 id={titleId}>
          {decision === "APPROVED" ? "Confirmar aprovação" : "Confirmar recusa"}
        </h2>
        <p>
          {decision === "APPROVED"
            ? `Aprovar ${seller?.establishmentName || seller?.name} e liberar a operação deste vendedor?`
            : `Recusar o cadastro de ${seller?.establishmentName || seller?.name}?`}
        </p>
        {decision === "REJECTED" && <p>Motivo: {reason}</p>}
        <div className="approval-actions">
          <button
            autoFocus
            disabled={busy}
            onClick={() => dialog.current.close()}
          >
            Cancelar
          </button>
          <button className="approval-primary" disabled={busy} onClick={save}>
            {busy
              ? "Salvando…"
              : decision === "APPROVED"
                ? "Confirmar aprovação"
                : "Confirmar recusa"}
          </button>
        </div>
      </dialog>
    </section>
  );
}
