import { useEffect, useRef } from "react";

export function useInterval(fn: () => void, ms: number | null) {
  const cb = useRef<typeof fn>();

  useEffect(() => {
    cb.current = fn;
  });

  useEffect(() => {
    function tick() {
      if (cb.current) {
        cb.current();
      }
    }

    if (ms !== null) {
      const id = setInterval(tick, ms);
      return () => clearInterval(id);
    }
  }, [ms]);
}
