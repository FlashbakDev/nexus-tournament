const c = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
} as const;

function formatPayload(payload: unknown): string {
  if (payload === undefined) {
    return "";
  }
  try {
    const json = JSON.stringify(payload);
    return json.length > 200 ? `${json.slice(0, 200)}…` : json;
  } catch {
    return String(payload);
  }
}

function prefix(): string {
  return `${c.dim}${new Date().toLocaleString()}${c.reset}`;
}

export function logSocketReceive(
  event: string,
  socketId: string,
  payload?: unknown,
): void {
  const data = formatPayload(payload);
  console.log(
    `${prefix()} ${c.cyan}← RECV${c.reset} ${c.magenta}${event.padEnd(22)}${c.reset} ${c.dim}socket=${socketId}${c.reset}${data ? ` ${c.dim}${data}${c.reset}` : ""}`,
  );
}

export function logSocketEmit(
  event: string,
  room: string,
  payload?: unknown,
): void {
  const data = formatPayload(payload);
  console.log(
    `${prefix()} ${c.green}→ EMIT${c.reset} ${c.magenta}${event.padEnd(22)}${c.reset} ${c.dim}room=${room}${c.reset}${data ? ` ${c.dim}${data}${c.reset}` : ""}`,
  );
}

export function logSocketConnection(
  action: "connect" | "disconnect",
  socketId: string,
): void {
  const label = action === "connect" ? c.green + "CONNECT" : c.yellow + "DISCONNECT";
  console.log(
    `${prefix()} ${label}${c.reset} ${c.dim}socket=${socketId}${c.reset}`,
  );
}
