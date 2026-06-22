"""
Reference interpreter for the Universal programming language.

This file is the canonical implementation of Universal's semantics. The
website's worker (src/lib/universal-run.functions.ts) runs on Cloudflare
Workers and cannot execute Python at request time, so it ships a small
TypeScript port of the dispatcher below. Whenever you change semantics,
change them HERE FIRST, then mirror into the TS port.

Language (demo):
    # comment
    print "hello"                    -> writes hello
    print name                       -> looks up `name` (locals, then universal)
    save name = "value"              -> local to this run
    save universal name = "value"    -> cloud-synced, shared across all users
    list universal                   -> dump the cloud-synced store

`run(source, universal_store)` returns:
    {"stdout": str, "stderr": str, "exit_code": int}

`universal_store` is a dict-like { name: {"value": str, "updated_at": int} }
mutated in place so the caller (TS worker or Python CLI) owns persistence.
"""
from __future__ import annotations

import io
import json
import sys
import time
from typing import MutableMapping, TypedDict


class UniversalEntry(TypedDict):
    value: str
    updated_at: int


Store = MutableMapping[str, UniversalEntry]


def _parse_string_literal(raw: str) -> str | None:
    s = raw.strip()
    if len(s) >= 2 and ((s[0] == '"' and s[-1] == '"') or (s[0] == "'" and s[-1] == "'")):
        return s[1:-1]
    return None


def _now_ms() -> int:
    return int(time.time() * 1000)


def run(source: str, universal_store: Store | None = None) -> dict:
    if universal_store is None:
        universal_store = {}

    stdout = io.StringIO()
    stderr = io.StringIO()
    exit_code = 0
    locals_: dict[str, str] = {}

    for i, raw in enumerate(source.split("\n")):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        line_no = i + 1

        # list universal
        if line == "list universal":
            if not universal_store:
                stdout.write("(cloud store is empty)\n")
            else:
                for name, entry in universal_store.items():
                    stdout.write(f'{name} = "{entry["value"]}"\n')
            continue

        # save [universal] name = "value"
        if line.startswith("save "):
            rest = line[len("save "):].strip()
            is_universal = rest.startswith("universal ")
            if is_universal:
                rest = rest[len("universal "):].strip()
            eq = rest.find("=")
            if eq == -1:
                stderr.write(f"line {line_no}: save needs '=': {raw}\n")
                exit_code = 1
                continue
            name = rest[:eq].strip()
            value = _parse_string_literal(rest[eq + 1:])
            if not name or value is None:
                stderr.write(f"line {line_no}: invalid save: {raw}\n")
                exit_code = 1
                continue
            if is_universal:
                universal_store[name] = {"value": value, "updated_at": _now_ms()}
            else:
                locals_[name] = value
            continue

        # print ...
        if line.startswith("print"):
            rest = line[len("print"):].strip()
            if rest.startswith("(") and rest.endswith(")"):
                rest = rest[1:-1].strip()
            literal = _parse_string_literal(rest)
            if literal is not None:
                stdout.write(literal + "\n")
            elif rest:
                if rest in locals_:
                    stdout.write(locals_[rest] + "\n")
                elif rest in universal_store:
                    stdout.write(universal_store[rest]["value"] + "\n")
                else:
                    stderr.write(f"line {line_no}: undefined name: {rest}\n")
                    exit_code = 1
            else:
                stdout.write("\n")
            continue

        stderr.write(f"line {line_no}: unknown statement: {raw}\n")
        exit_code = 1

    return {
        "stdout": stdout.getvalue(),
        "stderr": stderr.getvalue(),
        "exit_code": exit_code,
    }


if __name__ == "__main__":
    # CLI: pipe source on stdin; optional JSON universal store via $UNIVERSAL_STORE.
    src = sys.stdin.read()
    store_raw = sys.argv[1] if len(sys.argv) > 1 else "{}"
    store: Store = json.loads(store_raw)
    result = run(src, store)
    sys.stdout.write(result["stdout"])
    sys.stderr.write(result["stderr"])
    sys.exit(result["exit_code"])
