import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { transactionDialogAtom } from "../../store/userStore";
import TransactionsTable from "./TransactionsTable";
import {
  fetchTransactions,
  fetchFilteredTransactions,
} from "./utils/FetchTransactions";

vi.mock("ag-grid-react", () => ({
  AgGridReact: ({ rowData = [] }) => (
    <div data-testid="grid-rows">
      {rowData.map((row, i) => (
        <div key={i} data-testid="row">
          {JSON.stringify(row)}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("./TransactionsButtons", () => ({
  default: () => <div data-testid="transactions-buttons" />,
}));

vi.mock("./utils/FetchTransactions", () => ({
  fetchTransactions: vi.fn(),
  fetchFilteredTransactions: vi.fn(),
  postTransaction: vi.fn(),
  fetchUserById: vi.fn(),
}));

const renderWithProviders = (ui, { atomState } = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const Wrapper = ({ children }) => (
    <JotaiProvider
      initialValues={atomState ? [[transactionDialogAtom, atomState]] : []}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </JotaiProvider>
  );

  return render(ui, { wrapper: Wrapper });
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe("TransactionsTable", () => {
  it("loads all transactions when no filters are set", async () => {
    fetchTransactions.mockResolvedValueOnce([
      {
        transactionAmount: 10,
        dateOfTransaction: "2024-01-01T00:00:00Z",
        fullName: "Alice",
      },
      {
        transactionAmount: 20,
        dateOfTransaction: "2024-01-02T00:00:00Z",
        fullName: "Bob",
      },
    ]);

    renderWithProviders(<TransactionsTable />);

    expect(await screen.findByText("Transactions")).toBeInTheDocument();
    expect(screen.getByText("Transaction History")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchTransactions).toHaveBeenCalledTimes(1);
      expect(fetchFilteredTransactions).not.toHaveBeenCalled();
    });

    const rows = await screen.findAllByTestId("row");
    expect(rows).toHaveLength(2);
  });
});
