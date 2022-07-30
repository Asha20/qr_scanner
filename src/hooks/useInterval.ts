import { useEffect, useRef } from "react";

export function useInterval(fn: () => void, ms: number) {
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

    const id = setInterval(tick, ms);
    return () => clearInterval(id);
  }, [ms]);
}
