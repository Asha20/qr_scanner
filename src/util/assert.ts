class AssertionError extends Error {}

export function assert<T>(x: T, message = "Assertion failed"): asserts x {
  if (import.meta.env.DEV && !x) {
    throw new AssertionError(message);
  }
}
