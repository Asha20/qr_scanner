type LogLevel = "log" | "info" | "warn" | "error";

function _log(level: LogLevel, ...xs: unknown[]) {
  if (import.meta.env.DEV) {
    console[level](...xs);
  }
}

export function log(...xs: unknown[]) {
  _log("log", ...xs);
}

export function info(...xs: unknown[]) {
  _log("info", ...xs);
}

export function warn(...xs: unknown[]) {
  _log("warn", ...xs);
}

export function error(...xs: unknown[]) {
  _log("error", ...xs);
}
