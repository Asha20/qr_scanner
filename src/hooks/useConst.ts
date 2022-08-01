import { useEffect, useRef, useState } from "react";

type Maybe<T> = { init: false } | { init: true; value: T };

export function useConst<T>(fn: () => T): T {
  const valueRef = useRef<Maybe<T>>({ init: false });
  if (!valueRef.current.init) {
    valueRef.current = { init: true, value: fn() };
  }

  return valueRef.current.value;
}

type MaybeAsync<T> =
  | { state: "pending" }
  | { state: "resolved"; value: T }
  | { state: "rejected"; error: unknown };

export function useAsyncConst<T>(
  fn: () => Promise<T>,
  cleanup: (x: MaybeAsync<T>) => void,
) {
  const [state, setState] = useState<MaybeAsync<T>>({ state: "pending" });
  const cb = useRef(fn);
  const cleanupRef = useRef(cleanup);
  const promiseRef = useRef<Promise<void> | null>(null);
  const stateRef = useRef<MaybeAsync<T>>({ state: "pending" });

  useEffect(() => {
    const cleanup = cleanupRef.current;

    if (!promiseRef.current) {
      stateRef.current = { state: "pending" };

      promiseRef.current = cb
        .current()
        .then<MaybeAsync<T>, MaybeAsync<T>>(
          value => ({ state: "resolved", value }),
          error => ({ state: "rejected", error }),
        )
        .then(newState => {
          setState(newState);
          stateRef.current = newState;
          promiseRef.current = null;
        });
    }

    return () => cleanup(stateRef.current);
  }, [cb]);

  return {
    state: state.state,
    value: state.state === "resolved" ? state.value : undefined,
    error: state.state === "rejected" ? state.error : undefined,
  };
}
