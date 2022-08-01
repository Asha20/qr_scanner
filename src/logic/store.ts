import produce from "immer";
import lodashMerge from "lodash.merge";
import create from "zustand";
import { persist } from "zustand/middleware";
import { assert } from "~/util/assert";

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
    delete(created: UnixTime): void;
  };
}

export const useStore = create<State>()(
  persist(
    (set, get) => {
      function setImmer(fn: (state: State) => void) {
        set(produce(fn));
      }

      return {
        torch: {
          // Without the cast zustand will infer that value has type "false" for
          // whatever reason.
          value: false as boolean,
          set(torch) {
            setImmer(state => {
              state.torch.value = torch;
            });
          },
        },

        scan: {
          history: [],

          add(scan) {
            setImmer(state => {
              state.scan.history.unshift({
                created: Date.now(),
                value: scan,
              });
            });
          },

          clear() {
            setImmer(state => {
              state.scan.history = [];
            });
          },

          delete(created) {
            const index = get().scan.history.findIndex(
              entry => entry.created === created,
            );
            assert(index > -1);

            setImmer(state => {
              state.scan.history.splice(index, 1);
            });
          },
        },
      };
    },
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
