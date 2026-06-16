import { MemoryRouter } from "react-router";

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FilterPanel from "../src/components/FilterPanel/FilterPanel";
import VerdictBadge from "../src/components/UI/VerdictBadge";
import AppRoutes from "../src/routes";
import { fetchCandidates } from "../src/services/api";
import { useCandidatesStore } from "../src/store";
import type { Candidate } from "../src/types/candidate";

jest.mock("../src/services/api");

const mockedFetchCandidates = fetchCandidates as jest.Mock;

// ─── Mock API ────────────────────────────────────────────────────────────────
jest.mock("../src/services/api", () => ({
  fetchCandidates: jest.fn().mockResolvedValue([]),
  patchCandidateStatus: jest.fn().mockResolvedValue(undefined),
}));

// ─── Mock react-hot-toast ────────────────────────────────────────────────────
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
  Toaster: () => null,
  toast: { success: jest.fn(), error: jest.fn() },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeCandidate(override: Partial<Candidate> = {}): Candidate {
  return {
    id: "test-1",
    name: "Тест Тестович",
    position: "react-middle",
    pos_label: "React — ведущий программист",
    email: "test@test.com",
    phone: "+7 000 000-00-00",
    city: "Бишкек",
    tg: "@test",
    exp: [],
    total_exp: "~2 г.",
    stack: "React, TypeScript",
    edu: "КНУ, 2020",
    verdict: "ПОДХОДИТ",
    vc: "verdict-green",
    criteria: [["ok", "React 18 — есть"]],
    summary: "Опытный разработчик.",
    questions: ["Вопрос 1?"],
    status: "new",
    createdAt: "2026-01-01T00:00:00Z",
    ...override,
  };
}

const mockCandidates: Candidate[] = [
  makeCandidate({
    id: "ivanov",
    name: "Иванов Иван",
    verdict: "ПОДХОДИТ",
    vc: "verdict-green",
    email: "ivanov@test.com",
    city: "Бишкек",
    createdAt: "2026-01-01T00:00:00Z",
  }),
  makeCandidate({
    id: "petrova",
    name: "Петрова Анна",
    verdict: "ЧАСТИЧНО",
    vc: "verdict-orange",
    email: "petrova@test.com",
    city: "Ош",
    createdAt: "2026-02-01T00:00:00Z",
  }),
  makeCandidate({
    id: "sidorov",
    name: "Сидоров Сидор",
    verdict: "НЕ ПОДХОДИТ",
    vc: "verdict-red",
    email: "sidorov@test.com",
    city: "Токмок",
    createdAt: "2026-03-01T00:00:00Z",
  }),
];

// ─── VerdictBadge unit tests ──────────────────────────────────────────────────
describe("VerdictBadge", () => {
  it("рендерит ПОДХОДИТ с зелёными стилями", () => {
    render(<VerdictBadge verdict="ПОДХОДИТ" vc="verdict-green" />);
    const badge = screen.getByText("ПОДХОДИТ");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-100", "text-green-800");
  });

  it("рендерит ЧАСТИЧНО с оранжевыми стилями", () => {
    render(<VerdictBadge verdict="ЧАСТИЧНО" vc="verdict-orange" />);
    const badge = screen.getByText("ЧАСТИЧНО");
    expect(badge).toHaveClass("bg-orange-100", "text-orange-800");
  });

  it("рендерит НЕ ПОДХОДИТ с красными стилями", () => {
    render(<VerdictBadge verdict="НЕ ПОДХОДИТ" vc="verdict-red" />);
    const badge = screen.getByText("НЕ ПОДХОДИТ");
    expect(badge).toHaveClass("bg-red-100", "text-red-800");
  });

  it("применяет маленький размер по умолчанию", () => {
    render(<VerdictBadge verdict="ПОДХОДИТ" vc="verdict-green" />);
    expect(screen.getByText("ПОДХОДИТ")).toHaveClass("text-xs");
  });

  it('применяет средний размер при size="md"', () => {
    render(<VerdictBadge verdict="ПОДХОДИТ" vc="verdict-green" size="md" />);
    expect(screen.getByText("ПОДХОДИТ")).toHaveClass("text-sm");
  });
});

// ─── FilterPanel unit tests ───────────────────────────────────────────────────
describe("FilterPanel", () => {
  const defaultProps = {
    verdict: "Все" as const,
    sortField: "createdAt" as const,
    sortDirection: "desc" as const,
    onVerdictChange: jest.fn(),
    onSortFieldChange: jest.fn(),
    onSortDirectionChange: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("рендерит все кнопки фильтрации по вердикту", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Все" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ПОДХОДИТ" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ЧАСТИЧНО" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "НЕ ПОДХОДИТ" })
    ).toBeInTheDocument();
  });

  it('активная кнопка фильтра помечена aria-pressed="true"', () => {
    render(<FilterPanel {...defaultProps} verdict="ПОДХОДИТ" />);
    const activeBtn = screen.getByRole("button", { name: "ПОДХОДИТ" });
    expect(activeBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("вызывает onVerdictChange при клике на фильтр", async () => {
    render(<FilterPanel {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "ПОДХОДИТ" }));
    expect(defaultProps.onVerdictChange).toHaveBeenCalledWith("ПОДХОДИТ");
  });

  it("вызывает onSortDirectionChange при клике на кнопку сортировки", async () => {
    render(<FilterPanel {...defaultProps} />);
    const dirBtn = screen.getByRole("button", { name: "По возрастанию" });
    await userEvent.click(dirBtn);
    expect(defaultProps.onSortDirectionChange).toHaveBeenCalledWith("asc");
  });
});

// ─── Integration: список → детальная страница ─────────────────────────────────
describe("Интеграция: список кандидатов → детальная страница", () => {
  beforeEach(() => {
    mockedFetchCandidates.mockResolvedValue(mockCandidates);
    useCandidatesStore.setState({
      candidates: [],
      loading: false,
      error: null,
      updatingStatusId: null,
    });
  });

  function renderApp(initialPath = "/candidates") {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRoutes />
      </MemoryRouter>
    );
  }

  it("отображает список кандидатов после загрузки", async () => {
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("Иванов Иван")).toBeInTheDocument();
    });

    expect(screen.getByText("Петрова Анна")).toBeInTheDocument();
    expect(screen.getByText("Сидоров Сидор")).toBeInTheDocument();
  });

  it("показывает сообщение об отсутствии кандидатов при пустом списке", async () => {
    mockedFetchCandidates.mockResolvedValue([]);
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("Кандидаты не найдены")).toBeInTheDocument();
    });
  });

  it("показывает ошибку загрузки", async () => {
    mockedFetchCandidates.mockRejectedValue(new Error("Сетевая ошибка"));
    renderApp();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("фильтрует кандидатов по вердикту через кнопку", async () => {
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("Иванов Иван")).toBeInTheDocument();
    });

    // Кликаем фильтр ПОДХОДИТ
    await userEvent.click(screen.getByRole("button", { name: "ПОДХОДИТ" }));

    // Только ПОДХОДИТ должен остаться
    expect(screen.getByText("Иванов Иван")).toBeInTheDocument();
    expect(screen.queryByText("Петрова Анна")).not.toBeInTheDocument();
    expect(screen.queryByText("Сидоров Сидор")).not.toBeInTheDocument();
  });

  it("переходит на детальную страницу при клике по карточке", async () => {
    renderApp();

    await waitFor(() => {
      expect(screen.getByText("Иванов Иван")).toBeInTheDocument();
    });

    // Нажимаем на карточку кандидата
    const card = screen.getByRole("link", { name: /Кандидат Иванов Иван/ });
    await userEvent.click(card);

    // Должна открыться детальная страница
    await waitFor(() => {
      expect(screen.getByText("ivanov@test.com")).toBeInTheDocument();
    });

    // Есть кнопка "Назад к списку"
    expect(
      screen.getByRole("link", { name: /Назад к списку/ })
    ).toBeInTheDocument();
  });

  it("показывает 404 при несуществующем кандидате", async () => {
    // Загружаем кандидатов, но открываем несуществующий ID
    useCandidatesStore.setState({
      candidates: mockCandidates,
      loading: false,
      error: null,
      updatingStatusId: null,
    });
    renderApp("/candidate/nonexistent-id");

    await waitFor(() => {
      expect(screen.getByText(/404/)).toBeInTheDocument();
    });
  });
});
