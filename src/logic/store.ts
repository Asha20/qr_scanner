import produce from "immer";
import create from "zustand";

interface State {
  torch: boolean;
  scanHistory: string[];
  addScan(scan: string): void;
  setTorch(torch: boolean): void;
}

export const useStore = create<State>(set => ({
  torch: false,
  scanHistory: [],

  addScan(scan) {
    set(
      produce((state: State) => {
        state.scanHistory.push(scan);
      }),
    );
  },

  setTorch(torch) {
    set(
      produce((state: State) => {
        state.torch = torch;
      }),
    );
  },
}));
