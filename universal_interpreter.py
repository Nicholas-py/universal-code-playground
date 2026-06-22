"""
Placeholder interpreter for the Universal programming language.

Replace this with your real interpreter. The website expects a function
`run(source: str) -> dict` returning {"stdout": str, "stderr": str, "exit_code": int}.
"""
from __future__ import annotations

import io
import sys


def run(source: str) -> dict:
    stdout = io.StringIO()
    stderr = io.StringIO()
    exit_code = 0

    try:
        # TODO: parse + execute Universal source code here.
        # For now, naively handle a single statement form: `print "..."` or `print(...)`.
        for line_no, raw in enumerate(source.splitlines(), start=1):
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("print"):
                rest = line[len("print"):].strip()
                if rest.startswith("(") and rest.endswith(")"):
                    rest = rest[1:-1].strip()
                if (rest.startswith('"') and rest.endswith('"')) or (
                    rest.startswith("'") and rest.endswith("'")
                ):
                    rest = rest[1:-1]
                stdout.write(rest + "\n")
            else:
                stderr.write(f"line {line_no}: unknown statement: {raw}\n")
                exit_code = 1
    except Exception as exc:  # pragma: no cover
        stderr.write(f"interpreter error: {exc}\n")
        exit_code = 1

    return {
        "stdout": stdout.getvalue(),
        "stderr": stderr.getvalue(),
        "exit_code": exit_code,
    }


if __name__ == "__main__":
    src = sys.stdin.read()
    result = run(src)
    sys.stdout.write(result["stdout"])
    sys.stderr.write(result["stderr"])
    sys.exit(result["exit_code"])
