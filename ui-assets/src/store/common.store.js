import { atom } from 'jotai';

export const userModalAtom = atom({ open: false, mode: 'add', userData: null });

export const userGridApiAtom = atom(null);

export const assignModalAtom = atom({
  open: false,
  selectedScratchCard: null, // Row data from ActionButton
  selectedUser: null,
});

export const transactionDialogAtom = atom({
  dateOfTransaction: null,
  userId: null,
  transactionAmount: null,
  open: false,
});
