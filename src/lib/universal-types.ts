import { debug } from "console";
import { Interpreter } from "./universal-interpreter";


export class UniversalError extends Error { }

export type UniArg = UniversalObj | undefined

export abstract class UniversalObj {
    public readonly type: string = "bae"
    public value: any

    constructor(inp: string, protected interpreter?: Interpreter) {
        this.value = this.parse(inp);
    }

    public abstract tostring(): string;
    public abstract exec(arg: UniArg, indentedlines?:string): UniversalObj;

    public abstract hashval(inp: any): string;
    public hash(): string {
        return this.hashval(this.value);
    }
    public abstract parse(arg: string): any;

}

export class UNumber extends UniversalObj {
    public readonly type: string = "num"
    declare public value: number;

    public tostring(): string {
        return this.value.toString();
    }
    public hashval(inp: number): string {
        return inp.toString();
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
    declare public value: string;

    public tostring(): string {
        return this.value;
    }

    public exec(arg: UniArg): UniversalObj {
        if (arg !== undefined) {
            throw new UniversalError("Cannot execute string with value");
        }
        return this;
    }

    public hashval(inp: string): string {
        return inp
    }

    public parse(arg: string): string {
        return arg;
    }
}


export class ULiszt extends UniversalObj {
    public static empty: ULiszt = new ULiszt('')

    public readonly type: string = "lzt"
    declare public value: UniversalObj[];

    public tostring(): string {
        return this.value.map((obj) => { return obj.tostring() }).join(' ')
    }
    public hashval(inp: UniversalObj[]): string {
        let st = ""
        inp.forEach((obj) => {
            let ohash = obj.hash().replace(/,/g, ',,');
            st += obj.type + ':' + ohash + ',';
        })

        return st.slice(0, st.length - 1);
    }


    public exec(arg: UniArg): UniversalObj {
        if (arg === undefined) {
            return this;
        }
        if (arg instanceof UFunctionLambda) {
            throw new UniversalError("liszt + lambda function error")
        }

        let hash = this.hashval([arg].concat(this.value))
        return new ULiszt(hash);
    }


    parse(arg: string): UniversalObj[] {
        if (arg == '') {
            return [];
        }

        let subhashes = arg.split(/(?<!,),(?!,)/)
        let toreturn: UniversalObj[] = []

        subhashes.forEach((hash) => {
            if (hash == '') {
                return
            }
            let type = hash.slice(0, 3);
            let rest = hash.slice(4).replace(/,,/g, ',');
            let cls = Interpreter.types[type as keyof typeof Interpreter.types];
            toreturn.push(new cls(rest, this.interpreter))
        })
        return toreturn;
    }
}

export class UFunctionBuiltin extends UniversalObj {
    public readonly type: string = "fub"
    declare public value: string;

    public tostring(): string {
        return this.value;
    }

    public exec(arg: UniArg, indentedlines=""): UniversalObj {
        if (this.interpreter!.actions.includes(this.value)) {
            return this.interpreter!.builtins[this.value](arg, this.interpreter, indentedlines);
        }
        return this.interpreter!.builtins[this.value](arg, this.interpreter);
    }

    public hashval(inp: string): string {
        return inp;
    }

    public parse(arg: string): string {
        return arg;
    }
}


export class UFunctionLambda extends UniversalObj {
    public readonly type: string = "ful"
    declare public value: { func: string, val: UniversalObj };

    public static empty = new UFunctionLambda('')

    public tostring(): string {
        return `${this.value.func} ${this.value.val.tostring()}`;
    }

    public exec(arg: UniArg): UniversalObj {
        if (arg == undefined) {
            return this;
        }
        return this.interpreter!.builtins[this.value.func]([arg, this.value.val])
    }

    public hashval(inp: { func: string, val: UniversalObj }): string {
        let valhash = inp.val.hash().replace(/,/g, ',,');
        return `${inp.func},${inp.val.type}:${valhash}`;
    }

    public parse(arg: string): { func: string, val: UniversalObj } {
        if (arg == '') {
            return {func: '', val:new UString('')}
        }

        let lst = arg.split(/(?<!,),(?!,)/)
        if (lst.length != 2) {
            throw Error("lambda function hash incorrect")
        }

        let func = lst[0]
        let hash = lst[1]
        let type = hash.slice(0, 3);
        let rest = hash.slice(4).replace(/,,/g, ',');
        let cls = Interpreter.types[type as keyof typeof Interpreter.types];
        let obj = (new cls(rest, this.interpreter))

        return {func:func, val:obj};
    }
}
