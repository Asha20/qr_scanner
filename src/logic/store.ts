import produce from "immer";
import create from "zustand";

type UnixTime = number;

export interface ScanEntry {
  created: UnixTime;
  value: string;
}

export interface State {
  torch: boolean;
  scanHistory: ScanEntry[];
  addScan(scan: string): void;
  setTorch(torch: boolean): void;
}

export const useStore = create<State>(set => ({
  torch: false,
  scanHistory: [],

  addScan(scan) {
    set(
      produce((state: State) => {
        state.scanHistory.push({ created: Date.now(), value: scan });
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
