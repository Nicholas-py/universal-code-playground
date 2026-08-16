import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import {
  runUniversal,
  getUniversal,
  setUniversal,
} from "@/lib/universal-run.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Universal — Programming, but better" },
      {
        name: "description",
        content:
          "Universal is a small, customizable programming language. Try it instantly in your browser.",
      },
      { property: "og:title", content: "Universal — Programming, but better" },
      {
        property: "og:description",
        content: "Write and run universal code right in your browser.",
      },
    ],
  }),
  component: Home,
});

const DEFAULT_CODE = `print hello world`;

type RunResult = {
  stdout: string;
  stderr: string;
};


function Home() {
  const run = useServerFn(runUniversal);
  const getuni = useServerFn(getUniversal);
  const setuni = useServerFn(setUniversal);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [localVariables, setLocalVariables] = useState<Map<string, string>>(new Map<string, string>());
  const [displayVariables, setDisplayVariables] = useState<string[]>([]);



  const refreshCloud = useCallback(async () => {
    try {
      const res = await getuni();

      let localrecord:Map<string, string> = new Map<string, string>()
      Object.keys(res.full).forEach((key) => {
        localrecord.set(key, res.full[key])
      })
      console.log(localrecord)
      setLocalVariables(localrecord);
    } catch (e) {

    }
    //Temporary - set display variables to shuffled version of real ones
    setDisplayVariables(Array.from(localVariables.keys()).map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value))

  }, [getuni]);

  useEffect(() => {
    refreshCloud();
    const id = setInterval(refreshCloud, 4000);
    return () => clearInterval(id);
  }, [refreshCloud]);

  async function handleRun() {
    setRunning(true);
    try {
      const res = await run({ data: { source: code } });
      setResult(res);
      refreshCloud();
    } catch (err) {
      setResult({
        stdout: "",
        stderr: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setRunning(false);
    }
  }

  function handleClear() {
    setResult(null);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:pt-20">
        <section className="mb-12 max-w-3xl">
          <h1 className="font-serif text-6xl leading-[1.05] tracking-tight text-foreground md:text-7xl">
            Universal<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Be part of a revolution in programming, with Universal. With intuitive syntax,
            cloud-synced data and 100% customizability, Universal gives you unprecendented power over
            your code, while dramatically enhancing usability.
          </p>
        </section>

        <Playground
          code={code}
          onChange={setCode}
          onRun={handleRun}
          running={running}
          result={result}
        />

        <CloudPanel entries={displayVariables} onRefresh={refreshCloud} localVariables={localVariables} />

      </main>
      <Footer />
    </div>
  );
}

function CloudPanel({
  entries,
  onRefresh,
  localVariables
}: {
  entries: string[];
  onRefresh: () => void;
  localVariables: Map<string, string>
}) {

  return (
    <section
      className="mt-8 overflow-hidden rounded-2xl border border-border bg-card"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          <span className="font-mono">cloud · universal store</span>
          <span className="ml-2">shared across every visitor</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Refresh
          </button>
        </div>
      </div>
      <div className="px-4 py-4">
        {entries.length == 0 ? (
          <p className="font-mono text-sm text-muted-foreground">
            Error - store is empty.
          </p>
        ) : (
            (<ul className="divide-y divide-border">
              {entries
                //take first 3 keys
                .slice(0, 3)
                .map((e) => (
                  <li key={e} className="flex items-baseline justify-between gap-4 py-2 font-mono text-sm">
                    <span className="text-foreground">
                      <span className="text-primary">{e}</span> = "{localVariables.get(e)}"
                    </span>
                  </li>
                ))}
            </ul>)
        )}
      </div>
    </section>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-serif text-lg font-medium tracking-tight">Universal</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a className="transition-colors hover:text-foreground" href="#playground">
            Playground
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="https://github.com/Nicholas-py/universal-code-playground"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>

          <a
            className="transition-colors hover:text-foreground"
            href="https://github.com/Nicholas-py/universal-code-playground"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
        <a
          href="#playground"
          className="inline-flex items-center rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          Try it
        </a>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <text
        x="12"
        y="17.5"
        textAnchor="middle"
        fontFamily="ui-serif, Georgia, 'Times New Roman', serif"
        fontSize="17"
        fontWeight="1000"
        fill="var(--primary)"
      >
        U
      </text>
      <line
        x1="6"
        y1="14.9"
        x2="19"
        y2="10.5"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Playground({
  code,
  onChange,
  onRun,
  running,
  result,
}: {
  code: string;
  onChange: (v: string) => void;
  onRun: () => void;
  running: boolean;
  result: RunResult | null;
}) {
  return (
    <section
      id="playground"
      className="overflow-hidden rounded-2xl border border-border bg-card"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 12c4-3 6-3 9 0s5 3 9 0" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="ml-1 font-mono">main.uni</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <PlayIcon />
            {running ? "Running…" : "Run"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b border-border md:border-b-0 md:border-r">
          <div className="flex">
            <Gutter lines={code.split("\n").length} />
            <textarea
              value={code}
              onChange={(e) => onChange(e.target.value)}
              spellCheck={false}
              className="font-mono w-full resize-none bg-transparent px-3 py-4 text-sm leading-6 text-foreground outline-none"
              style={{ minHeight: 360 }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const t = e.currentTarget;
                  const s = t.selectionStart;
                  const en = t.selectionEnd;
                  const next = code.slice(0, s) + "  " + code.slice(en);
                  onChange(next);
                  requestAnimationFrame(() => {
                    t.selectionStart = t.selectionEnd = s + 2;
                  });
                }
              }}
            />
          </div>
        </div>

        <div className="flex flex-col bg-secondary/30">
          <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs text-muted-foreground">
            <span className="font-mono uppercase tracking-wider">Output</span>
            {result && (
              <span className="font-mono">
              </span>
            )}
          </div>
          <pre
            className="font-mono flex-1 overflow-auto whitespace-pre-wrap px-4 py-4 text-sm leading-6"
            style={{ minHeight: 360 }}
          >
            {!result && (
              <span className="text-muted-foreground">
                Press <span className="text-foreground">Run</span> to see output here.
              </span>
            )}
            {result?.stdout && <span className="text-foreground">{result.stdout}</span>}
            {result?.stderr && (
              <span className="text-destructive">{result.stderr}</span>
            )}
          </pre>
        </div>
      </div>
    </section>
  );
}

function Gutter({ lines }: { lines: number }) {
  return (
    <div
      aria-hidden
      className="font-mono select-none border-r border-border bg-secondary/30 px-3 py-4 text-right text-sm leading-6 text-muted-foreground/70"
      style={{ minWidth: 44 }}
    >
      {Array.from({ length: Math.max(lines, 1) }).map((_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M3 1.5v9l8-4.5L3 1.5z" />
    </svg>
  );
}


function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-serif">Universal</span>
          <span>·</span>
          <span>Programming, but better.</span>
        </div>
        <div>© {new Date().getFullYear()} Nicholas Waslander.</div>
      </div>
    </footer>
  );
}
