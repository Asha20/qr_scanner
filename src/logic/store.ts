import produce from "immer";
import lodashMerge from "lodash.merge";
import create from "zustand";
import { persist } from "zustand/middleware";

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

export const useStore = create<State>()(
  persist(
    set => ({
      torch: {
        // Without the cast zustand will infer that value has type "false" for
        // whatever reason.
        value: false as boolean,
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
              state.scan.history.unshift({ created: Date.now(), value: scan });
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
    }),
    {
      name: "qr_scanner",
      version: 1,

      merge: (persistedState, currentState) => {
        return lodashMerge(currentState, persistedState);
      },

      partialize: state => ({
        scan: { history: state.scan.history },
      }),
    },
  ),
);
