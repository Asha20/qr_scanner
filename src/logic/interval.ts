interface Interval {
  start(): boolean;
  stop(): boolean;
}

/** Executes the given callback every `ms` milliseconds. */
export function Interval(ms: number, callback: () => void): Interval {
  let id = -1;

  return {
    start() {
      if (id === -1) {
        id = window.setInterval(callback, ms);
        return true;
      }
      return false;
    },

    stop() {
      if (id !== -1) {
        window.clearInterval(id);
        id = -1;
        return true;
      }
      return false;
    },
  };
}
