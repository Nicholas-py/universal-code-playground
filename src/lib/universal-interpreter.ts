import { UniversalStore } from "./universal-store";


/**
 * This is the actual interpreter
 *
 * it's in TS because the Cloudflare Worker runtime can't execute Python at
 * request time.
 */


export type InterpretResult = { stdout: string; stderr: string; exitCode: number };

function parseStringLiteral(raw: string): string | null {
  const s = raw.trim();
  if (s.length >= 2 && ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))) {
    return s.slice(1, -1);
  }
  return null;
}

export async function interpret(source: string, store: UniversalStore): Promise<InterpretResult> {
  let stdout = "";
  let stderr = "";
  let exitCode = 0;
  const locals = new Map<string, string>();
  await store.sync();

  const lines = source.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const lineNo = i + 1;

    // list universal
    if (line === "list universal") {
      const keys = store.listKeys();
      if (keys.length === 0) {
        stdout += "(cloud store is empty)\n";
      }
      else {
        for (const k of keys) {
          stdout += `${k}\n`;
        }
      }
      continue;
    }

    // save [universal] name = "value"
    if (line.startsWith("save ")) {
      let rest = line.slice("save ".length).trim();
      const isUniversal = rest.startsWith("universal ");
      if (isUniversal) rest = rest.slice("universal ".length).trim();
      const eq = rest.indexOf("=");
      if (eq === -1) {
        stderr += `line ${lineNo}: save needs '=': ${raw}\n`;
        exitCode = 2;
        continue;
      }
      const name = rest.slice(0, eq).trim();
      const value = parseStringLiteral(rest.slice(eq + 1));
      if (!name || value === null) {
        stderr += `line ${lineNo}: invalid save: ${raw}\n`;
        exitCode = 3;
        continue;
      }
      if (isUniversal) {
        store.setValue(name, value);
      } else {
        locals.set(name, value);
      }
      continue;
    }

    // print ...
    if (line.startsWith("print")) {
      let rest = line.slice("print".length).trim();
      if (rest.startsWith("(") && rest.endsWith(")")) rest = rest.slice(1, -1).trim();
      const literal = parseStringLiteral(rest);
      if (literal !== null) {
        stdout += literal + "\n";
      } else if (rest) {
        if (locals.has(rest)) {
          stdout += locals.get(rest)! + "\n";
        } else  {
        stdout += store.getValue(rest) + "\n";}
      } else {
        stdout += "\n";
      }
      continue;
    }

    stderr += `line ${lineNo}: unknown statement: ${raw}\n`;
    exitCode = 4;
    return { stdout, stderr, exitCode };

  }

  return { stdout, stderr, exitCode };
}
