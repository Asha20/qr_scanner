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

export function useAsyncConst<T>(fn: () => Promise<T>): MaybeAsync<T> {
  const [state, setState] = useState<MaybeAsync<T>>({ state: "pending" });
  const cb = useRef(fn);

  useEffect(() => {
    cb.current()
      .then(value => {
        setState({ state: "resolved", value });
      })
      .catch(error => {
        setState({ state: "rejected", error });
      });
  }, [cb]);

  return state;
}
