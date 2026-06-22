import { createServerFn } from "@tanstack/react-start";

/**
 * Placeholder runner for Universal code.
 *
 * The real interpreter lives in /universal_interpreter.py. The Cloudflare
 * Worker runtime can't execute Python directly, so for now this server fn
 * mirrors that interpreter's behavior in TS. To swap in the real one, host
 * the Python script behind an HTTP endpoint and call it with `fetch` here.
 */
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

    const lines = data.source.split("\n");
    lines.forEach((raw, i) => {
      const line = raw.trim();
      if (!line || line.startsWith("#")) return;
      if (line.startsWith("print")) {
        let rest = line.slice("print".length).trim();
        if (rest.startsWith("(") && rest.endsWith(")")) rest = rest.slice(1, -1).trim();
        if (
          (rest.startsWith('"') && rest.endsWith('"')) ||
          (rest.startsWith("'") && rest.endsWith("'"))
        ) {
          rest = rest.slice(1, -1);
        }
        stdout += rest + "\n";
      } else {
        stderr += `line ${i + 1}: unknown statement: ${raw}\n`;
        exitCode = 1;
      }
    });

    return {
      stdout,
      stderr,
      exitCode,
      ms: Date.now() - start,
    };
  });
