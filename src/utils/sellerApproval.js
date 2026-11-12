export function sellerApproval(seller) {
  const status = String(
    seller?.approvalStatus ?? seller?.status ?? "PENDING",
  ).toUpperCase();
  return ["APPROVED", "ACTIVE"].includes(status)
    ? "APPROVED"
    : ["REJECTED", "BLOCKED"].includes(status)
      ? status
      : "PENDING";
}
export const approvalLabels = {
  PENDING: "Cadastro em análise",
  APPROVED: "Aprovado",
  REJECTED: "Cadastro recusado",
  BLOCKED: "Conta bloqueada",
};
