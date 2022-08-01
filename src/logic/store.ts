import create from "zustand";

interface Store {
  scanHistory: string[];
  addScan(scan: string): void;
}

export const useStore = create<Store>(set => ({
  scanHistory: [],
  addScan(scan: string) {
    set(state => ({ scanHistory: [...state.scanHistory, scan] }));
  },
}));
