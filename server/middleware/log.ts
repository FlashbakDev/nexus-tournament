import { getRequestIP, H3Event } from "h3";

// ANSI escape codes for terminal styling
const c = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
} as const;

function methodColor(method: string): string {
  switch (method) {
    case "GET":
      return c.green;
    case "POST":
      return c.blue;
    case "PUT":
    case "PATCH":
      return c.yellow;
    case "DELETE":
      return c.red;
    default:
      return c.cyan;
  }
}

function statusColor(status: number): string {
  if (status >= 500) return c.red;
  if (status >= 400) return c.yellow;
  if (status >= 300) return c.cyan;
  if (status >= 200) return c.green;
  return c.dim;
}

function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export default defineEventHandler(async (event: H3Event) => {
  const start = Date.now();
  const method = event.node.req.method ?? "GET";
  const path = event.path;

  // const user = await getAuthUser(event);
  // const userName = user?.name ?? "?";
  // const userId = user?.id ?? "?";

  event.node.res.once("finish", () => {
    const status = event.node.res.statusCode;
    const duration = Date.now() - start;
    const m = methodColor(method);
    const s = statusColor(status);
    const time = formatDuration(duration);
    const errorMessage = event.node.res.statusMessage;

    let ip = getRequestIP(event, { xForwardedFor: true }) ?? "?";
    if (ip === "::1" || ip === "::ffff:127.0.0.1") ip = "127.0.0.1";

    // ${c.yellow}${userName.slice(0, 15).padEnd(15)}${userId.slice(0, 24).padEnd(24)}${c.reset}

    console.log(
      `${c.dim}${new Date().toLocaleString()} ${time.padStart(8)}${c.reset} ${s}${status} ${c.magenta}${ip.padEnd(15)}${c.reset}  ${m}${method.padEnd(6)}${c.reset} ${c.dim}${path}${c.reset}  ${errorMessage ? ` ${errorMessage}` : ""}${c.reset}`,
    );
  });
});
