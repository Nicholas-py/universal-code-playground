import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { runUniversal } from "@/lib/universal-run.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Universal — Programming but better" },
      {
        name: "description",
        content:
          "Universal is a small, customizable programming language. Try it instantly in your browser.",
      },
      { property: "og:title", content: "Universal — Programming but better" },
      {
        property: "og:description",
        content: "Write and run universal code right in your browser.",
      },
    ],
  }),
  component: Home,
});

const DEFAULT_CODE = `# Your code goes here.
# Press "Run" to execute.

print hello world
`;

type RunResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  ms: number;
};

function Home() {
  const run = useServerFn(runUniversal);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  async function handleRun() {
    setRunning(true);
    try {
      const res = await run({ data: { source: code } });
      setResult(res);
    } catch (err) {
      setResult({
        stdout: "",
        stderr: err instanceof Error ? err.message : String(err),
        exitCode: 1,
        ms: 0,
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
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            v0.1 · early preview
          </div>
          <h1 className="font-serif text-6xl leading-[1.05] tracking-tight text-foreground md:text-7xl">
            Universal<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Universal is cloud-synced — your data is literally impossible to lose. The syntax is clean, 
            with few special characters to memorize, and the
            language is 100% customizable, giving you unprecedented power over your code.
          </p>
        </section>

        <Playground
          code={code}
          onChange={setCode}
          onRun={handleRun}
          onClear={handleClear}
          running={running}
          result={result}
        />

      </main>
      <Footer />
    </div>
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
        fontWeight="500"
        fill="var(--primary)"
      >
        U
      </text>
      <line
        x1="7"
        y1="9.1"
        x2="17"
        y2="14.9"
        stroke="var(--primary)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Playground({
  code,
  onChange,
  onRun,
  onClear,
  running,
  result,
}: {
  code: string;
  onChange: (v: string) => void;
  onRun: () => void;
  onClear: () => void;
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
            onClick={onClear}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Clear output
          </button>
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
                exit {result.exitCode} · {result.ms}ms
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

function FeatureRow() {
  const features = [
    {
      title: "Readable by default",
      body: "Syntax that gets out of the way, so the program reads like the idea behind it.",
    },
    {
      title: "Runs anywhere",
      body: "A single interpreter, no build step, no toolchain to wrestle with.",
    },
    {
      title: "Tiny surface",
      body: "A focused core you can hold in your head — extend it when you need to.",
    },
  ];
  return (
    <section id="features" className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
      {features.map((f) => (
        <div key={f.title} className="bg-card p-7">
          <h3 className="font-serif text-xl tracking-tight text-foreground">{f.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
        </div>
      ))}
    </section>
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
          <span>Programming but better.</span>
        </div>
        <div>© {new Date().getFullYear()} Nicholas Waslander.</div>
      </div>
    </footer>
  );
}
