import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { ToastProvider } from "../contexts/ToastContext";
import { AppRoutes } from "./AppRoutes";
import { adminSellerService } from "../services/api/adminSellerService";
import { productService } from "../services/api/productService";
import { sellerApproval } from "../utils/sellerApproval";

vi.mock("../services/api/adminSellerService", () => ({
  isApprovalDemo: () => false,
  adminSellerService: {
    list: vi.fn(),
    getById: vi.fn(),
    decide: vi.fn(),
    mine: vi.fn(),
  },
}));
vi.mock("../services/api/productService", () => ({
  productService: { listBySeller: vi.fn() },
}));
const pending = {
  id: "seller1",
  name: "Ana Silva",
  establishmentName: "Lanches da Ana",
  username: "ana",
  cpf: "111.111.111-11",
  phone: "75999999999",
  approvalStatus: "PENDING",
};
function open(path, role = "admin") {
  localStorage.setItem("unifood_token", "test-token");
  localStorage.setItem(
    "unifood_user",
    JSON.stringify({ id: "seller1", name: "Ana", role, status: "approved" }),
  );
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  adminSellerService.list.mockResolvedValue([pending]);
  adminSellerService.getById.mockResolvedValue({
    ...pending,
    password: "NEVER-RENDER-SECRET",
  });
  adminSellerService.mine.mockResolvedValue(pending);
  productService.listBySeller.mockResolvedValue([]);
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});
afterEach(cleanup);
async function review() {
  open("/admin/vendedores");
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Analisar cadastro de Lanches da Ana",
    }),
  );
  const region = screen.getByRole("region", { name: "Análise do cadastro" });
  await within(region).findByRole("button", { name: "Aprovar cadastro" });
  return region;
}
describe("Aprovação de vendedores", () => {
  it("cancelar a confirmação mantém o vendedor pendente", async () => {
    const detail = await review();
    fireEvent.click(
      within(detail).getByRole("button", { name: "Aprovar cadastro" }),
    );
    expect(screen.getByRole("dialog")).toHaveTextContent("Lanches da Ana");
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Cancelar",
      }),
    );
    expect(adminSellerService.decide).not.toHaveBeenCalled();
    expect(screen.getByText("1 cadastro(s) em análise")).toBeInTheDocument();
  });
  it("falha nos detalhes não permite aprovar usando apenas a lista", async () => {
    adminSellerService.getById.mockRejectedValueOnce(new Error("offline"));
    open("/admin/vendedores?item=seller1");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar os dados",
    );
    expect(
      screen.queryByRole("button", { name: "Aprovar cadastro" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(
      await screen.findByRole("button", { name: "Aprovar cadastro" }),
    ).toBeInTheDocument();
  });

  it("mostra a solicitação pendente com os dados e aprova", async () => {
    adminSellerService.decide.mockResolvedValue({
      ...pending,
      approvalStatus: "APPROVED",
    });
    const detail = await review();
    expect(detail).toHaveTextContent(pending.cpf);
    expect(detail).not.toHaveTextContent("NEVER-RENDER-SECRET");
    fireEvent.click(
      within(detail).getByRole("button", { name: "Aprovar cadastro" }),
    );
    fireEvent.click(
      screen.getByRole("dialog").querySelector(".approval-primary"),
    );
    expect(await screen.findByText("Cadastro aprovado.")).toBeInTheDocument();
    expect(adminSellerService.decide).toHaveBeenCalledWith(
      "seller1",
      "APPROVED",
      "",
    );
    expect(screen.getByText("0 cadastro(s) em análise")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Status do cadastro"), {
      target: { value: "APPROVED" },
    });
    expect(
      screen.getByRole("button", {
        name: "Ver cadastro de Lanches da Ana",
      }),
    ).toBeInTheDocument();
  });
  it("exige motivo para recusar e envia a justificativa", async () => {
    adminSellerService.decide.mockResolvedValue({
      ...pending,
      approvalStatus: "REJECTED",
      rejectionReason: "Dados incompletos",
    });
    const detail = await review();
    fireEvent.click(
      within(detail).getByRole("button", { name: "Recusar cadastro" }),
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Informe o motivo");
    expect(adminSellerService.decide).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Dados incompletos" },
    });
    fireEvent.click(
      within(detail).getByRole("button", { name: "Recusar cadastro" }),
    );
    fireEvent.click(
      screen.getByRole("dialog").querySelector(".approval-primary"),
    );
    expect(await screen.findByText("Cadastro recusado.")).toBeInTheDocument();
    expect(adminSellerService.decide).toHaveBeenCalledWith(
      "seller1",
      "REJECTED",
      "Dados incompletos",
    );
  });
  it("mantém pendente quando a decisão falha", async () => {
    adminSellerService.decide.mockRejectedValue(new Error("500"));
    const detail = await review();
    fireEvent.click(
      within(detail).getByRole("button", { name: "Aprovar cadastro" }),
    );
    fireEvent.click(
      screen.getByRole("dialog").querySelector(".approval-primary"),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível salvar",
    );
    expect(screen.getByText("1 cadastro(s) em análise")).toBeInTheDocument();
  });
  it("mostra erro de carregamento e permite atualizar", async () => {
    adminSellerService.list.mockRejectedValueOnce(new Error("offline"));
    open("/admin/vendedores");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar",
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Atualizar cadastros" }),
    );
    expect(
      await screen.findByRole("button", {
        name: "Analisar cadastro de Lanches da Ana",
      }),
    ).toBeInTheDocument();
  });
  it.each([
    "/vendedor/produtos/novo",
    "/vendedor/pedidos",
    "/vendedor/cardapios/novo",
  ])("bloqueia pendente no acesso direto %s", async (path) => {
    open(path, "seller");
    expect(
      await screen.findByRole("heading", { name: "Cadastro em análise" }),
    ).toBeInTheDocument();
    expect(productService.listBySeller).not.toHaveBeenCalled();
  });
  it("recebe aprovação ao retornar à aba e libera a operação", async () => {
    open("/vendedor/produtos", "seller");
    await screen.findByRole("heading", { name: "Cadastro em análise" });
    adminSellerService.mine.mockResolvedValue({
      ...pending,
      approvalStatus: "APPROVED",
    });
    fireEvent(window, new Event("focus"));
    expect(
      await screen.findByRole("heading", { name: "Produtos" }),
    ).toBeInTheDocument();
    expect(
      JSON.parse(localStorage.getItem("unifood_user")).approvalStatus,
    ).toBe("APPROVED");
  });
  it("não libera a operação se a verificação falhar, mesmo com status antigo aprovado", async () => {
    adminSellerService.mine.mockRejectedValue(new Error("offline"));
    open("/vendedor/produtos", "seller");
    expect(
      await screen.findByRole("heading", {
        name: "Não foi possível verificar sua aprovação",
      }),
    ).toBeInTheDocument();
    expect(productService.listBySeller).not.toHaveBeenCalled();
  });
  it("mostra a recusa e o motivo no painel do vendedor", async () => {
    adminSellerService.mine.mockResolvedValue({
      ...pending,
      approvalStatus: "REJECTED",
      rejectionReason: "Confira os dados",
    });
    open("/vendedor", "seller");
    expect(
      await screen.findByText("Motivo da recusa: Confira os dados"),
    ).toBeInTheDocument();
    expect(screen.getByText("Cadastro recusado")).toBeInTheDocument();
  });
  it("não interpreta loja aberta ou status desconhecido como aprovação", () => {
    expect(sellerApproval({ status: "OPEN" })).toBe("PENDING");
    expect(
      sellerApproval({ approvalStatus: "PENDING", status: "ACTIVE" }),
    ).toBe("PENDING");
    expect(sellerApproval({})).toBe("PENDING");
  });
});
