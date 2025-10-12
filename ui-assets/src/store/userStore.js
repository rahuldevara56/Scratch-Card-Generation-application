import { atom } from 'jotai';

export const userModalAtom = atom({ open: false, mode: 'add', userData: null });
