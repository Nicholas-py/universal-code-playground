import { UniversalBuiltins } from "./universal-builtins";
import { UniversalStore } from "./universal-store";
import { UniArg, UFunctionBuiltin, ULiszt, UniversalError, UniversalObj, UNumber, UString, UFunctionLambda } from "./universal-types";

/**
 * This is the actual interpreter
 *
 * it's in TS because the Cloudflare Worker runtime can't execute Python at
 * request time.
 */

//Temporary list of builtin functions + the like
const storedefaults = {
  "hello": "str:Hello",
  "world": "str:World!",
  "true": "num:1",
  "false": "num:0",

  "print": "fub:=print",
  "+": "fub:=+",
  "-": "fub:=-",
  "*": "fub:=*",
  "/": "fub:=/",
  "get": "fub:=get",
  "type": "fub:=type",
  "equals": "fub:=equals",
  "not": "fub:=not",
  "len": "fub:=len",
  "if": "fub:=if",
}


export class Interpreter {
  stdout: string[] = []

  builtins: Record<string, Function> = {
    "print": UniversalBuiltins.print,
    "+": UniversalBuiltins.plus,
    "-": UniversalBuiltins.minus,
    "*": UniversalBuiltins.times,
    "/": UniversalBuiltins.divide,
    "equals": UniversalBuiltins.equals,
    "get": UniversalBuiltins.getval,
    "type": UniversalBuiltins.gettype,
    "not": UniversalBuiltins.not,
    "len": UniversalBuiltins.len,
    "if": UniversalBuiltins.if,

  }

  actions: string[] = ['if', 'while', 'function', 'for'];

  static types = {
    "num": UNumber,
    "str": UString,
    "fub": UFunctionBuiltin,
    "lzt": ULiszt,
    "ful": UFunctionLambda,
    "fun": UFunctionBuiltin //TODO - UFunction class
  } as const


  constructor(private source: string, private store: UniversalStore) { }

  async run() {

    Object.keys(storedefaults).forEach((key) => {
      this.store.setValue(key, storedefaults[key as keyof typeof storedefaults])
    })
    console.log('\n~~~ Run begins ~~~')
    this.interpret(this.source);

  }

  interpret(code: string, indentedlines: string = ""): UniversalObj {
    code = code.trim()
    let lines = code.split('\n');


    //Multiple lines? Run each in sequence, and return the final result (which will usually be ignored)
    if (lines.length > 1) {
      let lastval: UniversalObj = new UString("", this);

      let actionlines: { line: string, indents: string[] }[] = []
      let indentamount = 0
      lines.forEach((line) => {
        if (line.trim().length == 0) { return; }

        if (this.getindent(line) == 0) {
          actionlines.push({ line: line, indents: [] })
          indentamount = 0
        }
        else {
          if (indentamount == 0) {
            indentamount = this.getindent(line)
          }
          actionlines[actionlines.length - 1].indents.push(this.removeindent(line, indentamount))
        }
      });

      actionlines.forEach((data) => {
        lastval = this.interpret(data.line.trim(), data.indents.join('\n'));
      })

      return lastval;
    }

    if (code.length == 0) {
      return new UString("", this)
    }


    //Set value
    if (code.includes('=')) {
      const lst = code.split('=')
      if (lst.length > 2) {
        throw new UniversalError("Only 1 equals sign per line");
      }
      if (lst.length < 2) {
        throw new UniversalError("Equal sign must be preceded and followed by a value")
      }

      lst[0] = lst[0].trim();
      lst[1] = lst[1].trim();

      let key;
      if (lst[0].includes(' ')) {
        key = this.interpret(lst[0]).tostring();
      }
      else {
        key = lst[0];
      }

      let val: UniversalObj = this.interpret(lst[1])
      let valhash = val.type + ':' + val.hash();

      this.store.setValue(key, valhash);

      return val;
    }

    //Run commands
    else {
      let tokens = code.split(' ');
      let curobj: UniversalObj = this.createobj(tokens[tokens.length - 1])
      for (let i = tokens.length - 2; i >= 0; i--) {
        if (tokens[i].trim().length == 0) {
          continue;
        }
        let newobj = this.createobj(tokens[i])
        let ctype = curobj.type;
        try {
          curobj = newobj.exec(curobj, indentedlines)
          console.log(`${newobj.type} (${ctype})`, tokens.slice(i).join(' '))
        } catch {
          try {
            curobj = curobj.exec(newobj, indentedlines)
            console.log(`(${newobj.type}) ${ctype}`, tokens.slice(i).join(' '))

          } catch {
            curobj = new ULiszt(ULiszt.empty.hashval([newobj, curobj]), this)
            console.log(`[${newobj.type},${ctype}]`, tokens.slice(i).join(' '))
          }
        }
      }

      return curobj;
    }


  }

  createobj(token: string): UniversalObj {
    let storestr = this.store.getValue(token);
    //split at first instance of :
    let lst = storestr.split(/:(.*)/s)
    let type = lst[0]; let value = lst[1];


    if (value.length > 0 && value[0] == '=') {
      return new UFunctionBuiltin(value.slice(1), this)
    }

    let cls = Interpreter.types[type as keyof typeof Interpreter.types];
    return new cls(value, this)
  }


  getindent(line: string) {
    if (line.includes('\n')) {
      throw new Error("Cannot get indent of multiple lines")
    }
    return (line.length - line.trimStart().length)
  }

  removeindent(line: string, amount: number): string {
    if (line.includes('\n')) {
      throw new Error("Cannot set indent of multiple lines")
    }

    const oldindent = this.getindent(line)

    if (amount > oldindent) {
      throw new Error("Attempt to remove excessive indent")
    }

    return ' '.repeat(oldindent - amount) + line.trimStart();

  }

}



export type InterpretResult = { stdout: string; stderr: string };

function parseStringLiteral(raw: string): string | null {
  const s = raw.trim();
  if (s.length >= 2 && ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))) {
    return s.slice(1, -1);
  }
  return null;
}




export async function interpretsource(source: string, store: UniversalStore): Promise<InterpretResult> {

  const interpreter = new Interpreter(source, store);
  let err = ""
  let out = ""
  try {
    await interpreter.run();
  }
  catch (e) {
    if (e instanceof UniversalError) {
      err = e.message
    }
    else {
      throw e;
    }
  }

  out += interpreter.stdout.join('\n') + '\n'


  return { stdout: out, stderr: err }



  const locals = new Map<string, string>();
  let stdout = "";
  let stderr = "";



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
        continue;
      }
      const name = rest.slice(0, eq).trim();
      const value = parseStringLiteral(rest.slice(eq + 1));
      if (!name || value === null) {
        stderr += `line ${lineNo}: invalid save: ${raw}\n`;
        continue;
      }
      if (isUniversal) {
        // store.setValue(name, value);
      } else {
        //     locals.set(name, value);
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
        } else {
          stdout += store.getValue(rest) + "\n";
        }
      } else {
        stdout += "\n";
      }
      continue;
    }

    stderr += `line ${lineNo}: unknown statement: ${raw}\n`;
    return { stdout, stderr };

  }

  return { stdout, stderr };
}
