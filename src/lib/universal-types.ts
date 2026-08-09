import { Interpreter } from "./universal-interpreter";


export class UniversalError extends Error { }

export type UniArg = UniversalObj | undefined

export abstract class UniversalObj {
  public readonly type: string = "bae"
  protected value: any

  constructor(inp: string, protected interpreter?: Interpreter) {
    this.value = this.parse(inp);
  }

  public abstract tostring(): string;
  public abstract exec(arg: UniArg): UniversalObj;

  public abstract hash(): string;
  public abstract parse(arg: string): any;

}

export class UNumber extends UniversalObj {
  public readonly type: string = "num"
  declare protected value: number;

  public tostring(): string {
    return this.value.toString();
  }
  public hash(): string {
    return this.value.toString();
  }
  public exec(arg: UniArg): UniversalObj {
    if (arg !== undefined) {
      throw new UniversalError("Cannot execute number with value");
    }
    return this;
  }
  parse(arg: string): number {
    return parseFloat(arg);
  }
}

export class UString extends UniversalObj {
  public readonly type: string = "str"
  declare protected value: string;

  public tostring(): string {
    return this.value;
  }

  public exec(arg: UniArg): UniversalObj {
    if (arg !== undefined) {
      throw new UniversalError("Cannot execute string with value");
    }
    return this;
  }

  public hash(): string {
    return this.value.toString();
  }

  public parse(arg: string): string {
    return arg;
  }
}

export class UFunctionBuiltin extends UniversalObj {
  public readonly type: string = "fub"
  declare protected value: Function;

  public tostring(): string {
    return this.value.name;
  }

  public exec(arg: UniArg): UniversalObj {
    return this.value(arg, this.interpreter);
  }

  public hash(): string {
    return this.value.name;
  }

  public parse(arg: string): Function {
    return this.interpreter!.builtins[arg];
  }
}

export class ULiszt extends UniversalObj {

  public readonly type: string = "lzt"
  declare protected value: UniversalObj[];

  public tostring(): string {
    return this.value.map((obj) => { obj.tostring() }).join(' ')
  }
  public hash(): string {
    let st = ""

    this.value.forEach((obj) => {
      let ohash = obj.hash().replace(',', ',,');
      st += obj.type + ':' + ohash + ',';
    })

    return st;
  }
  public exec(arg: UniArg): UniversalObj {
    if (arg === undefined) {
      return this;
    }
    return new ULiszt(this.hash()+','+arg.hash());
  }
  parse(arg: string): number {
    let subhashes = arg.split('(?<!:):(?!:)')
    let toreturn = []
    subhashes.forEach((hash) => {
      let type = hash.slice(0, 3);
      let rest = hash.slice(4).replace(',,',',');
      let cls = Interpreter.types[type as keyof typeof Interpreter.types];
      toreturn.push(new cls(rest, this.interpreter))
    })
    return parseFloat(arg);
  }
}

