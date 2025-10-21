import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect } from "vitest";
import GenerateScratchCards from "./GenerateScratchCards";
import * as api from "./utils/postScratchcards";
import { toast } from "react-hot-toast";

vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("./utils/postScratchcards", () => ({
  postScratchcards: vi.fn(),
}));

describe("GenerateScratchCards Component", () => {
  const queryClient = new QueryClient();

  const renderWithClient = (ui) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  it("renders the title and input field", () => {
    renderWithClient(<GenerateScratchCards />);
    expect(screen.getByText(/Generate Scratchcards/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Number of Scratchcards/i)
    ).toBeInTheDocument();
  });

  it("calls postScratchcards with correct data when Submit is clicked", async () => {
    const mockResponse = { data: { count: 5 } };
    api.postScratchcards.mockResolvedValueOnce(mockResponse);

    renderWithClient(<GenerateScratchCards />);

    const input = screen.getByLabelText(/Number of Scratchcards/i);
    const button = screen.getByRole("button", { name: /Submit/i });

    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.postScratchcards).toHaveBeenCalledWith(
        expect.objectContaining({ numberOfScratchCards: 5 }),
        expect.anything()
      );
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("shows an error toast if API fails", async () => {
    api.postScratchcards.mockRejectedValueOnce({
      response: { data: { message: "Failed to create scratchcards" } },
    });

    renderWithClient(<GenerateScratchCards />);

    const button = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to create scratchcards");
    });
  });
});
