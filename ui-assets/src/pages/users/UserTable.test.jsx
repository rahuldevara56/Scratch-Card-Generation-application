import { describe, it, expect } from "vitest";
import { createStore } from "jotai";
import {
  userModalAtom,
  userGridApiAtom,
  assignModalAtom,
  transactionDialogAtom,
} from "../../store/userStore";

describe("userStore atoms", () => {
  it("should have correct default values", () => {
    const store = createStore();

    expect(store.get(userModalAtom)).toEqual({
      open: false,
      mode: "add",
      userData: null,
    });

    expect(store.get(userGridApiAtom)).toBeNull();

    expect(store.get(assignModalAtom)).toEqual({
      open: false,
      selectedScratchCard: null,
      selectedUser: null,
    });

    expect(store.get(transactionDialogAtom)).toEqual({
      dateOfTransaction: null,
      userId: null,
      transactionAmount: null,
      open: false,
    });
  });

  it("should update userModalAtom", () => {
    const store = createStore();

    const next = {
      open: true,
      mode: "edit",
      userData: { id: "u1", firstName: "John" },
    };
    store.set(userModalAtom, next);

    expect(store.get(userModalAtom)).toEqual(next);
  });

  it("should set and get userGridApiAtom", () => {
    const store = createStore();

    const mockApi = { refreshCells: () => {}, getSelectedRows: () => [] };
    store.set(userGridApiAtom, mockApi);

    expect(store.get(userGridApiAtom)).toBe(mockApi);
  });

  it("should update assignModalAtom selection", () => {
    const store = createStore();

    const next = {
      open: true,
      selectedScratchCard: { id: "sc1", value: 100 },
      selectedUser: { id: "u1", email: "test@example.com" },
    };
    store.set(assignModalAtom, next);

    expect(store.get(assignModalAtom)).toEqual(next);
  });

  it("should functionally update transactionDialogAtom", () => {
    const store = createStore();

    const date = new Date("2024-01-01T00:00:00.000Z");
    store.set(transactionDialogAtom, (prev) => ({
      ...prev,
      open: true,
      userId: "u42",
      transactionAmount: 250,
      dateOfTransaction: date,
    }));

    const updated = store.get(transactionDialogAtom);
    expect(updated.open).toBe(true);
    expect(updated.userId).toBe("u42");
    expect(updated.transactionAmount).toBe(250);
    expect(updated.dateOfTransaction).toBeInstanceOf(Date);
    expect(updated.dateOfTransaction.toISOString()).toBe(date.toISOString());
  });

  it("should not affect other atoms when one atom is updated", () => {
    const store = createStore();

    store.set(userModalAtom, {
      open: true,
      mode: "edit",
      userData: { id: "x" },
    });

    expect(store.get(assignModalAtom)).toEqual({
      open: false,
      selectedScratchCard: null,
      selectedUser: null,
    });
    expect(store.get(transactionDialogAtom)).toEqual({
      dateOfTransaction: null,
      userId: null,
      transactionAmount: null,
      open: false,
    });
  });
});
