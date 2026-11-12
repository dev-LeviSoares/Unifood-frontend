import { api } from "./api";
import { getStoredToken } from "../storage/storage";

const KEY = "unifood_demo_seller_applications";
export function isApprovalDemo() {
  return (
    import.meta.env.DEV &&
    import.meta.env.VITE_DEV_MODE === "true" &&
    getStoredToken()?.startsWith("unifood-dev-session:")
  );
}
function demoRows() {
  const stored = localStorage.getItem(KEY);
  if (stored) return JSON.parse(stored);
  return [
    {
      id: "dev-seller",
      name: "Vendedor de teste",
      establishmentName: "Estabelecimento de teste",
      username: "vendedor.demo",
      phone: "(00) 00000-0000",
      cpf: "000.000.000-00 (fictício)",
      birthDate: "2000-01-01",
      createdAt: "2026-10-19",
      approvalStatus: "PENDING",
    },
  ];
}
function record(data) {
  const seller = data?.seller ?? data;
  if (
    !seller ||
    typeof seller !== "object" ||
    !seller.id ||
    !seller.approvalStatus
  )
    throw new Error("Resposta de aprovação inválida.");
  return seller;
}
export const adminSellerService = {
  async list() {
    if (isApprovalDemo()) return demoRows();
    const { data } = await api.get("/admin/sellers");
    const rows = Array.isArray(data) ? data : (data?.items ?? data?.sellers);
    if (!Array.isArray(rows))
      throw new Error("Resposta de vendedores inválida.");
    return rows;
  },
  async getById(id) {
    if (isApprovalDemo()) {
      const seller = demoRows().find((row) => String(row.id) === String(id));
      if (!seller) throw new Error("Vendedor não encontrado.");
      return seller;
    }
    const { data } = await api.get(`/admin/sellers/${encodeURIComponent(id)}`);
    const seller = record(data);
    if (String(seller.id) !== String(id))
      throw new Error("Resposta de vendedor inválida.");
    return seller;
  },
  async decide(id, approvalStatus, reason = "") {
    if (!["APPROVED", "REJECTED"].includes(approvalStatus))
      throw new Error("Decisão inválida.");
    if (isApprovalDemo()) {
      const rows = demoRows();
      const index = rows.findIndex((row) => row.id === id);
      if (index < 0 || rows[index].approvalStatus !== "PENDING")
        throw new Error("O cadastro não está mais pendente. Atualize a lista.");
      rows[index] = { ...rows[index], approvalStatus, rejectionReason: reason };
      localStorage.setItem(KEY, JSON.stringify(rows));
      window.dispatchEvent(new Event("unifood:approval-changed"));
      return rows[index];
    }
    const { data } = await api.patch(
      `/admin/sellers/${encodeURIComponent(id)}/approval`,
      { approvalStatus, reason },
    );
    const changed = record(data);
    if (
      String(changed.id) !== String(id) ||
      changed.approvalStatus !== approvalStatus
    )
      throw new Error("A API não confirmou a decisão solicitada.");
    return changed;
  },
  async mine(user) {
    if (isApprovalDemo())
      return (
        demoRows().find((row) => row.id === user.id) ?? {
          approvalStatus: "PENDING",
        }
      );
    const { data } = await api.get("/sellers/me");
    return record(data);
  },
};
