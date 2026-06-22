import { createServerFn } from "@tanstack/react-start";

/**
 * Demo interpreter for Universal.
 *
 * Supports:
 *   print "hello"             // string literal
 *   print name                // variable lookup (local first, then universal)
 *   save name = "value"       // local to this run
 *   save universal name = "value"   // cloud-synced, shared across ALL users
 *   list universal            // dump the cloud-synced store
 *
 * The "universal" store is an in-memory Map on the server. It persists
 * across runs and is shared across every visitor hitting the same worker
 * instance — enough to demo the cloud-sync idea.
 */

type UniversalEntry = { value: string; updatedAt: number };
const universalStore = new Map<string, UniversalEntry>();

function parseValue(raw: string): string | null {
  const s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return null;
}

export const runUniversal = createServerFn({ method: "POST" })
  .inputValidator((input: { source: string }) => {
    if (typeof input?.source !== "string") throw new Error("source must be a string");
    if (input.source.length > 20_000) throw new Error("source too long");
    return input;
  })
  .handler(async ({ data }) => {
    const start = Date.now();
    let stdout = "";
    let stderr = "";
    let exitCode = 0;
    const locals = new Map<string, string>();

    const lines = data.source.split("\n");
    lines.forEach((raw, i) => {
      const line = raw.trim();
      if (!line || line.startsWith("#")) return;

      // list universal
      if (line === "list universal") {
        if (universalStore.size === 0) {
          stdout += "(cloud store is empty)\n";
        } else {
          for (const [k, v] of universalStore) stdout += `${k} = "${v.value}"\n`;
        }
        return;
      }

      // save [universal] name = "value"
      if (line.startsWith("save ")) {
        let rest = line.slice("save ".length).trim();
        const isUniversal = rest.startsWith("universal ");
        if (isUniversal) rest = rest.slice("universal ".length).trim();
        const eq = rest.indexOf("=");
        if (eq === -1) {
          stderr += `line ${i + 1}: save needs '=': ${raw}\n`;
          exitCode = 1;
          return;
        }
        const name = rest.slice(0, eq).trim();
        const value = parseValue(rest.slice(eq + 1));
        if (!name || value === null) {
          stderr += `line ${i + 1}: invalid save: ${raw}\n`;
          exitCode = 1;
          return;
        }
        if (isUniversal) {
          universalStore.set(name, { value, updatedAt: Date.now() });
        } else {
          locals.set(name, value);
        }
        return;
      }

      // print ...
      if (line.startsWith("print")) {
        let rest = line.slice("print".length).trim();
        if (rest.startsWith("(") && rest.endsWith(")")) rest = rest.slice(1, -1).trim();
        const literal = parseValue(rest);
        if (literal !== null) {
          stdout += literal + "\n";
        } else if (rest) {
          // variable lookup: locals first, then universal
          if (locals.has(rest)) {
            stdout += locals.get(rest)! + "\n";
          } else if (universalStore.has(rest)) {
            stdout += universalStore.get(rest)!.value + "\n";
          } else {
            stderr += `line ${i + 1}: undefined name: ${rest}\n`;
            exitCode = 1;
          }
        } else {
          stdout += "\n";
        }
        return;
      }

      stderr += `line ${i + 1}: unknown statement: ${raw}\n`;
      exitCode = 1;
    });

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
