import produce from "immer";
import create from "zustand";

type UnixTime = number;

export interface ScanEntry {
  created: UnixTime;
  value: string;
}

export interface State {
  torch: {
    value: boolean;
    set(torch: boolean): void;
  };

  scan: {
    history: ScanEntry[];
    add(scan: string): void;
    clear(): void;
  };
}

export const useStore = create<State>(set => ({
  torch: {
    value: false,
    set(torch) {
      set(
        produce((state: State) => {
          state.torch.value = torch;
        }),
      );
    },
  },

  scan: {
    history: [],

    add(scan) {
      set(
        produce((state: State) => {
          state.scan.history.push({ created: Date.now(), value: scan });
        }),
      );
    },

    clear() {
      set(
        produce((state: State) => {
          state.scan.history = [];
        }),
      );
    },
  },
}));
