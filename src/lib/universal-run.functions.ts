import { createServerFn } from "@tanstack/react-start";
import { interpret, type UniversalEntry } from "./universal-interpreter";

/**
 * Thin worker wrapper around the Universal interpreter.
 *
 * The canonical language definition lives in `universal_interpreter.py`.
 * The actual per-request execution is delegated to `./universal-interpreter.ts`,
 * which is a direct port of that Python file. This module only owns:
 *   - the in-memory cloud store
 *   - HTTP/RPC plumbing (createServerFn)
 *   - input validation
 */

const universalStore = new Map<string, UniversalEntry>();

export const runUniversal = createServerFn({ method: "POST" })
  .inputValidator((input: { source: string }) => {
    if (typeof input?.source !== "string") throw new Error("source must be a string");
    if (input.source.length > 20_000) throw new Error("source too long");
    return input;
  })
  .handler(async ({ data }) => {
    const start = Date.now();
    const { stdout, stderr, exitCode } = interpret(data.source, universalStore);
    return { stdout, stderr, exitCode, ms: Date.now() - start };
  });

export const listUniversal = createServerFn({ method: "GET" }).handler(async () => {
  const entries = Array.from(universalStore.entries()).map(([name, { value, updatedAt }]) => ({
    name,
    value,
    updatedAt,
  }));
  entries.sort((a, b) => b.updatedAt - a.updatedAt);
  return { entries };
});

export const clearUniversal = createServerFn({ method: "POST" }).handler(async () => {
  universalStore.clear();
  return { ok: true };
});
