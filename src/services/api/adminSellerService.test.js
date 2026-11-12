import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./api";
import { adminSellerService } from "./adminSellerService";

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("unifood_token", "real-token");
});
afterEach(() => vi.restoreAllMocks());
describe("Contrato da API administrativa", () => {
  it("consulta os dados individuais para análise", async () => {
    const seller = {
      id: "s1",
      name: "Nome completo",
      cpf: "00000000000",
      approvalStatus: "PENDING",
    };
    const get = vi.spyOn(api, "get").mockResolvedValue({ data: { seller } });
    expect(await adminSellerService.getById("s1")).toEqual(seller);
    expect(get).toHaveBeenCalledWith("/admin/sellers/s1");
  });
  it("não aceita os dados de outro vendedor na análise", async () => {
    vi.spyOn(api, "get").mockResolvedValue({
      data: { id: "outro", approvalStatus: "PENDING" },
    });
    await expect(adminSellerService.getById("s1")).rejects.toThrow(
      "Resposta de vendedor inválida",
    );
  });

  it("carrega solicitações reais em vez dos estabelecimentos de demonstração", async () => {
    const rows = [{ id: "s1", approvalStatus: "PENDING" }];
    const get = vi
      .spyOn(api, "get")
      .mockResolvedValue({ data: { sellers: rows } });
    expect(await adminSellerService.list()).toEqual(rows);
    expect(get).toHaveBeenCalledWith("/admin/sellers");
  });
  it("não substitui falha de API por uma fila fictícia", async () => {
    vi.spyOn(api, "get").mockRejectedValue(new Error("offline"));
    await expect(adminSellerService.list()).rejects.toThrow("offline");
  });
  it("rejeita HTML de servidor sem backend", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: "<html>Vite</html>" });
    await expect(adminSellerService.list()).rejects.toThrow(
      "Resposta de vendedores inválida",
    );
  });
  it("envia decisão e motivo para o vendedor selecionado", async () => {
    const row = { id: "seller/1", approvalStatus: "REJECTED" };
    const patch = vi
      .spyOn(api, "patch")
      .mockResolvedValue({ data: { seller: row } });
    expect(
      await adminSellerService.decide(
        "seller/1",
        "REJECTED",
        "Dados incompletos",
      ),
    ).toEqual(row);
    expect(patch).toHaveBeenCalledWith("/admin/sellers/seller%2F1/approval", {
      approvalStatus: "REJECTED",
      reason: "Dados incompletos",
    });
  });
  it("não aceita resposta inválida como decisão salva", async () => {
    vi.spyOn(api, "patch").mockResolvedValue({ data: "<html>Vite</html>" });
    await expect(adminSellerService.decide("s1", "APPROVED")).rejects.toThrow(
      "Resposta de aprovação inválida",
    );
  });
  it("consulta a situação atual da conta autenticada", async () => {
    const seller = { id: "s1", approvalStatus: "APPROVED" };
    const get = vi.spyOn(api, "get").mockResolvedValue({ data: seller });
    expect(await adminSellerService.mine({ id: "s1" })).toEqual(seller);
    expect(get).toHaveBeenCalledWith("/sellers/me");
  });
});
