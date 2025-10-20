import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  it("renders the app title correctly", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/SCRATCHCARD GENERATION APPLICATION/i)
    ).toBeInTheDocument();
  });

  it("renders all navigation buttons", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const buttons = [
      /users/i,
      /generate scratchcards/i,
      /assign scratchcards/i,
      /transactions/i,
    ];

    buttons.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("renders correct number of navigation buttons", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const buttons = screen.getAllByRole("link");
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });
});
