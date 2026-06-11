import fs from "fs";
import path from "path";

// ── Types ──────────────────────────────────────────────────────────────────────

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
  stack?: string;
}

// ── Config ─────────────────────────────────────────────────────────────────────

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel | undefined) ??
  (process.env.NODE_ENV === "production" ? "info" : "debug");

const LOG_DIR = path.resolve(process.cwd(), "logs");

// ── File writer ────────────────────────────────────────────────────────────────

function getLogFilePath(): string {
  const date = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  return path.join(LOG_DIR, `${date}_POHub_logger.log`);
}

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function writeToFile(line: string) {
  try {
    ensureLogDir();
    fs.appendFileSync(getLogFilePath(), line + "\n", "utf8");
  } catch {
    // never let file I/O crash the app
  }
}

// ── Stack extraction ───────────────────────────────────────────────────────────

function extractStack(err: unknown): string | undefined {
  if (!(err instanceof Error)) return undefined;

  let stack = err.stack ?? `${err.name}: ${err.message}`;
  let cause = err.cause;
  let depth = 0;

  while (cause && depth < 5) {
    stack +=
      "\n\nCaused by: " +
      (cause instanceof Error
        ? (cause.stack ?? `${(cause as Error).name}: ${(cause as Error).message}`)
        : String(cause));
    cause = cause instanceof Error ? (cause as Error).cause : undefined;
    depth++;
  }

  return stack;
}

// ── Formatting ─────────────────────────────────────────────────────────────────

function formatEntry(entry: LogEntry): string {
  const header = [
    `[${entry.timestamp}]`,
    `[${entry.level.toUpperCase().padEnd(5)}]`,
    `[${entry.context}]`,
    entry.message,
  ].join(" ");

  let out = header;

  if (entry.data !== undefined) {
    try {
      const serialized = JSON.stringify(entry.data, null, 2).replace(/\n/g, "\n    ");
      out += `\n    data: ${serialized}`;
    } catch {
      out += "\n    data: [unserializable]";
    }
  }

  if (entry.stack) {
    out +=
      "\n" +
      entry.stack
        .split("\n")
        .map((l) => "    " + l)
        .join("\n");
  }

  return out;
}

// ── Emit ───────────────────────────────────────────────────────────────────────

function emit(entry: LogEntry) {
  if (LEVEL_RANK[entry.level] < LEVEL_RANK[MIN_LEVEL]) return;

  const text = formatEntry(entry);

  // console
  switch (entry.level) {
    case "debug": console.debug(text); break;
    case "info":  console.info(text);  break;
    case "warn":  console.warn(text);  break;
    case "error": console.error(text); break;
  }

  // file (server-side only)
  if (typeof window === "undefined") {
    writeToFile(text);
  }
}

// ── Core log function ──────────────────────────────────────────────────────────

function log(level: LogLevel, context: string, message: string, payload?: unknown) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
  };

  if (payload instanceof Error) {
    entry.stack = extractStack(payload);
  } else if (payload !== undefined) {
    entry.data = payload;
  }

  emit(entry);
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function createLogger(context: string) {
  return {
    debug: (message: string, data?: unknown) => log("debug", context, message, data),
    info:  (message: string, data?: unknown) => log("info",  context, message, data),
    warn:  (message: string, data?: unknown) => log("warn",  context, message, data),
    error: (message: string, err?: unknown)  => log("error", context, message, err),
  };
}

// ── Server Action wrapper ──────────────────────────────────────────────────────

type ActionFn<TArgs extends unknown[], TReturn> = (...args: TArgs) => Promise<TReturn>;

export function withLogging<TArgs extends unknown[], TReturn>(
  name: string,
  fn: ActionFn<TArgs, TReturn>
): ActionFn<TArgs, TReturn> {
  const logger = createLogger(`action:${name}`);
  return async (...args) => {
    logger.debug("called");
    try {
      const result = await fn(...args);
      logger.debug("ok");
      return result;
    } catch (err) {
      logger.error("unhandled exception", err);
      throw err;
    }
  };
}

// ── API Route wrapper ──────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

type RouteHandler = (
  req: NextRequest,
  ctx: { params: Promise<Record<string, string>> }
) => Promise<NextResponse | Response>;

export function withRouteLogging(name: string, handler: RouteHandler): RouteHandler {
  const logger = createLogger(`route:${name}`);
  return async (req, ctx) => {
    logger.debug(`${req.method} ${req.nextUrl.pathname}`);
    try {
      const res = await handler(req, ctx);
      logger.debug(`→ ${(res as Response).status}`);
      return res;
    } catch (err) {
      logger.error("unhandled exception", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}

// ── Default logger ─────────────────────────────────────────────────────────────

export const logger = createLogger("app");
