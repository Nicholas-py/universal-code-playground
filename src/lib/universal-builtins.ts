import { UFunctionBuiltin, ULiszt, UniversalError, UniversalObj, UNumber, UString, UFunctionLambda, UFunction } from "./universal-types";
import { Interpreter } from "./universal-interpreter";


export class UniversalBuiltins {

    public static print(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("print", interpreter);
        }
        interpreter.stdout.push(arg.tostring());
        return new UString(arg.tostring(), interpreter);
    }



    public static gettype(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("gettype", interpreter);
        }
        return new UString(arg.type, interpreter);
    }



    public static plus(arg: UniversalObj | UniversalObj[], interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("+", interpreter);
        }
        else if (arg instanceof UniversalObj) {
            let hash = UFunctionLambda.empty.hashval({ func: '+', val: arg })
            return new UFunctionLambda(hash, interpreter)
        }
        else {
            if (arg.length != 2) {
                throw new Error("Must be two arguments to plus()")
            }
            if (arg[0] instanceof UNumber && arg[1] instanceof UNumber) {
                return new UNumber((arg[0].value + arg[1].value).toString(), interpreter)
            }
            if (arg[0] instanceof ULiszt && arg[1] instanceof ULiszt) {
                return new ULiszt(ULiszt.empty.hashval(arg[0].value.concat(arg[1].value)), interpreter)
            }
            if (arg[0] instanceof ULiszt) {
                return ULiszt.from(arg[0].value.concat([arg[1]]))
            }
            if (arg[1] instanceof ULiszt) {
                console.log([arg[0]].concat(arg[1].value))
                return ULiszt.from([arg[0]].concat(arg[1].value))
            }

            return new UString(arg[0].tostring() + arg[1].tostring(), interpreter)
        }
    }




    public static minus(arg: UniversalObj | UniversalObj[], interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("-", interpreter);
        }
        else if (arg instanceof UniversalObj) {
            let hash = UFunctionLambda.empty.hashval({ func: '-', val: arg })
            return new UFunctionLambda(hash, interpreter)
        }
        else {
            if (arg.length != 2) {
                throw new Error("Must be two arguments to plus()")
            }
            if (arg[0] instanceof UNumber && arg[1] instanceof UNumber) {
                return new UNumber((arg[0].value - arg[1].value).toString(), interpreter)
            }

            let arg1length = 0
            if (arg[1] instanceof ULiszt) {
                arg1length = arg[1].value.length
            }
            else if (arg[1] instanceof UNumber) {
                arg1length = arg[1].value
            }
            else {
                arg1length = arg[1].tostring().length;
            }

            if (arg1length == 0) {
                return arg[0]
            }
            if (arg[0] instanceof UNumber) {
                return new UNumber((arg[0].value - arg1length).toString(), interpreter)
            }

            if (arg[0] instanceof ULiszt) {
                return new ULiszt(ULiszt.empty.hashval(arg[0].value.slice(0, -Math.ceil(arg1length))), interpreter)
            }

            //Possible todo - if given negative arg1length, add the last character several times

            return new UString(arg[0].tostring().slice(0, -Math.ceil(arg1length)), interpreter)
        }
    }

    public static times(arg: UniversalObj | UniversalObj[], interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("*", interpreter);
        }
        else if (arg instanceof UniversalObj) {
            let hash = UFunctionLambda.empty.hashval({ func: '*', val: arg })
            return new UFunctionLambda(hash, interpreter)
        }
        else {
            if (arg.length != 2) {
                throw new Error("Must be two arguments to plus()")
            }
            if (arg[0] instanceof UNumber && arg[1] instanceof UNumber) {
                return new UNumber((arg[0].value * arg[1].value).toString(), interpreter)
            }

            let arg1length = 0
            if (arg[1] instanceof ULiszt) {
                arg1length = arg[1].value.length
            }
            else if (arg[1] instanceof UNumber) {
                arg1length = arg[1].value
            }
            else {
                arg1length = arg[1].tostring().length;
            }

            //possible todo - for negative arg1length, reverse string

            if (arg[0] instanceof ULiszt) {
                let seq = arg[0].value
                let newseq: UniversalObj[] = []
                for (let i = 0; i < arg1length * seq.length; i++) {
                    newseq.push(seq[(i % seq.length)])
                }
                return new ULiszt(ULiszt.empty.hashval(newseq), interpreter)
            }
            else {
                let seq = arg[0].tostring()
                let newseq = ""
                for (let i = 0; i < arg1length * seq.length; i++) {
                    newseq = newseq.concat(seq[(i % seq.length)])
                }
                return new UString(newseq, interpreter)

            }
        }
    }
    public static divide(arg: UniversalObj | UniversalObj[], interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("/", interpreter);
        }
        else if (arg instanceof UniversalObj) {
            let hash = UFunctionLambda.empty.hashval({ func: '/', val: arg })
            return new UFunctionLambda(hash, interpreter)
        }
        else {
            if (arg.length != 2) {
                throw new Error("Must be two arguments to plus()")
            }
            if (arg[0] instanceof UNumber && arg[1] instanceof UNumber) {
                return new UNumber((arg[0].value / arg[1].value).toString(), interpreter)
            }

            let arg1length = 0
            if (arg[1] instanceof ULiszt) {
                arg1length = arg[1].value.length
            }
            else if (arg[1] instanceof UNumber) {
                arg1length = arg[1].value
            }
            else {
                arg1length = arg[1].tostring().length;
            }

            //possible todo - for negative arg1length, reverse string

            if (arg[0] instanceof ULiszt) {
                let seq = arg[0].value
                let newseq: UniversalObj[] = []
                for (let i = 0; i < seq.length / arg1length; i++) {
                    newseq.push(seq[(i % seq.length)])
                }
                return new ULiszt(ULiszt.empty.hashval(newseq), interpreter)
            }
            else {
                let seq = arg[0].tostring()
                let newseq = ""
                for (let i = 0; i < seq.length / arg1length; i++) {
                    newseq = newseq.concat(seq[(i % seq.length)])
                }
                return new UString(newseq, interpreter)

            }
        }
    }

    public static getval(arg: UniversalObj | UniversalObj[], interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("get", interpreter);
        }
        else if (arg instanceof UniversalObj) {
            let hash = UFunctionLambda.empty.hashval({ func: 'get', val: arg })
            return new UFunctionLambda(hash, interpreter)
        }
        else {
            if (arg.length != 2) {
                throw new Error("Must be two arguments to infix function")
            }
            if (!(arg[1] instanceof UNumber)) {
                throw new UniversalError("Must be number to get")
            }
            let val = arg[0].value[Math.floor(arg[1].value)]
            if (val === undefined) {
                throw new UniversalError("Undefined")
            }
            if (arg[0] instanceof ULiszt) {
                return val
            }
            if (arg[0] instanceof UString) {
                return new UString(val)
            }

            throw new UniversalError("Cannot get value of non-sequence")

        }
    }



    public static equals(arg: UniversalObj | UniversalObj[], interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("equals", interpreter);
        }
        else if (arg instanceof UniversalObj) {
            let hash = UFunctionLambda.empty.hashval({ func: 'equals', val: arg })
            return new UFunctionLambda(hash, interpreter)
        }
        else {
            if (arg.length != 2) {
                throw new Error("Must be two arguments to equals()")
            }
            if (UniversalBuiltins.areequal(arg[0], arg[1])) {
                return new UNumber("1");
            }
            else {
                return new UNumber("0");
            }
        }
    }

    private static areequal(a: UniversalObj, b: UniversalObj): boolean {
        if ((a instanceof UNumber) && (b instanceof UNumber )) {
            return a.value == b.value
        }

        if (a instanceof ULiszt) {
            if (!(b instanceof ULiszt)) {
                return false;
            }
            if (a.value.length != b.value.length) {
                return false;
            }
            for (let i = 0; i < a.value.length; i++) {
                if (!UniversalBuiltins.areequal(a.value[i], b.value[i])) {
                    return false
                }
            }
            return true;
        }
        return a.type == b.type && a.tostring() == b.tostring();

    }

    public static not(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("not", interpreter);
        }
        if (UniversalBuiltins.isTrue(arg)) {
            return new UNumber("0", interpreter)
        }
        else {
            return new UNumber("1", interpreter)
        }
    }

    private static isTrue(obj: UniversalObj): boolean {
        let zeros = { "str": "", "num": 0, "lzt": [] }
        if (Object.keys(zeros).includes(obj.type)) {
            if (zeros[obj.type as keyof typeof zeros] == obj.value) {
                return false;
            }
        }
        return true;
    }

    public static len(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("len", interpreter);
        }
        if (arg instanceof UString || arg instanceof ULiszt) {
            return new UNumber(arg.value.length.toString(), interpreter)
        }
        if (arg instanceof UNumber) {
            return new UNumber(Math.log10(Math.abs(arg.value)).toString())
        }
        return new UNumber(arg.tostring().length.toString())
    }

    public static if(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("if", interpreter);
        }
        if (UniversalBuiltins.isTrue(arg)) {
            return interpreter.interpret(indentedlines, "")
        }
        return new UNumber("0", interpreter);

    }

    public static while(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("while", interpreter);
        }
        let lastval = new UString("whiling", interpreter);
        for (let i = 0; i < 100; i++) {
            if (UniversalBuiltins.isTrue(arg.exec(lastval))) {
                lastval = interpreter.interpret(indentedlines, "")
            }
            else {
                return lastval
            }
        }
        return new UString("Infinite loop detected")

    }


    public static function(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        let func = new UFunction(UFunction.empty.hashval({ code: indentedlines, argname: arg.tostring() }), interpreter);
        if (arg != undefined) {
            func.setargname(arg.tostring())
        }
        return func
    }


    public static for(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("for", interpreter);
        }

        if (!(arg instanceof ULiszt)) {
            return UniversalBuiltins.plus([new UNumber('4'), arg], interpreter, indentedlines)
        }

        if (arg.value.length <= 1) {
            return new ULiszt(ULiszt.empty.hashval([new UNumber('4')].concat(arg.value)))
        }

        let lastval = new UString("four", interpreter);
        let firstval = arg.value[0]
        let indexname = arg.value[0].tostring()

        for (let i = 1; i < arg.value.length; i++) {
            interpreter.setvariable(indexname, arg.value[i])
            lastval = interpreter.interpret(indentedlines, "")
        }
        interpreter.setvariable(indexname, firstval)

        return lastval
    }

    public static range(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        let oplist: UniversalObj[] = []
        if (arg instanceof UNumber) {
            for (let i = 0; i < arg.value; i++) {
                oplist.push(new UNumber(i.toString()));
            }
        }
        else if (arg instanceof ULiszt) {
            for (let i = 0; i < arg.value.length; i++) {
                oplist.push(new ULiszt(ULiszt.empty.hashval(arg.value.slice(0, i + 1))))
            }
        }
        else if (arg instanceof UString) {
            for (let i = 0; i < arg.value.length; i++) {
                oplist.push(new UString(arg.value.slice(0, i + 1)))
            }
        }
        else {
            throw new UniversalError("Function call to range")
        }

        return new ULiszt(ULiszt.empty.hashval(oplist), interpreter)
    }

    public static lt(arg: UniversalObj | UniversalObj[], interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("<", interpreter);
        }
        else if (arg instanceof UniversalObj) {
            let hash = UFunctionLambda.empty.hashval({ func: '<', val: arg })
            return new UFunctionLambda(hash, interpreter)
        }
        else {
            if (arg.length != 2) {
                throw new Error("Must be two arguments to binary operator")
            }

            let arg1length = 0
            if (arg[1] instanceof ULiszt || arg[1] instanceof UString) {
                arg1length = arg[1].value.length
            }
            else if (arg[1] instanceof UNumber) {
                arg1length = arg[1].value
            }
            else {
                throw new UniversalError("can't do that")
            }
            let arg0length = 0
            if (arg[0] instanceof ULiszt || arg[0] instanceof UString) {
                arg1length = arg[0].value.length
            }
            else if (arg[0] instanceof UNumber) {
                arg1length = arg[0].value
            }
            else {
                throw new UniversalError("can't do that")
            }

            if (arg0length < arg1length) {
                return new UNumber("1");
            }
            else {
                return new UNumber("0");
            }
        }
    }
    public static gt(arg: UniversalObj | UniversalObj[], interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin(">", interpreter);
        }
        else if (arg instanceof UniversalObj) {
            let hash = UFunctionLambda.empty.hashval({ func: '>', val: arg })
            return new UFunctionLambda(hash, interpreter)
        }
        else {
            if (arg.length != 2) {
                throw new Error("Must be two arguments to binary operator")
            }

            let arg1length = 0
            if (arg[1] instanceof ULiszt || arg[1] instanceof UString) {
                arg1length = arg[1].value.length
            }
            else if (arg[1] instanceof UNumber) {
                arg1length = arg[1].value
            }
            else {
                throw new UniversalError("can't do that")
            }
            let arg0length = 0
            if (arg[0] instanceof ULiszt || arg[0] instanceof UString) {
                arg1length = arg[0].value.length
            }
            else if (arg[0] instanceof UNumber) {
                arg1length = arg[0].value
            }
            else {
                throw new UniversalError("can't do that")
            }

            if (arg0length > arg1length) {
                return new UNumber("1");
            }
            else {
                return new UNumber("0");
            }
        }
    }

    public static lower(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg instanceof UString) {
            return new UString(arg.value.toLowerCase(), interpreter)
        }
        if (arg instanceof ULiszt) {
            return new ULiszt(ULiszt.empty.hashval(arg.value.map((val) => { return UniversalBuiltins.lower(val, interpreter, indentedlines) })))
        }
        else {
            return arg;
        }
    }
    public static upper(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg instanceof UString) {
            return new UString(arg.value.toUpperCase(), interpreter)
        }
        if (arg instanceof ULiszt) {
            return new ULiszt(ULiszt.empty.hashval(arg.value.map((val) => { return UniversalBuiltins.upper(val, interpreter, indentedlines) })))
        }
        else {
            return arg;
        }
    }

    public static sliceleft(arg: UniversalObj | UniversalObj[], interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("sliceleft", interpreter);
        }
        else if (arg instanceof UniversalObj) {
            let hash = UFunctionLambda.empty.hashval({ func: 'sliceleft', val: arg })
            return new UFunctionLambda(hash, interpreter)
        }
        else {
            if (!((arg[0] instanceof ULiszt || arg[0] instanceof UString) && arg[1] instanceof UNumber)) {
                throw new UniversalError("slice only works on lists with numbers")
            }
            if (arg[0] instanceof ULiszt) {
                return ULiszt.from(arg[0].value.slice(0, arg[1].value))
            }
            else if (arg[0] instanceof UString) {
                return new UString(arg[0].value.slice(0, arg[1].value))
            }
            return new UString("")
        }
    }
    public static sliceright(arg: UniversalObj | UniversalObj[], interpreter: Interpreter, indentedlines: string): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("sliceright", interpreter);
        }
        else if (arg instanceof UniversalObj) {
            let hash = UFunctionLambda.empty.hashval({ func: 'sliceright', val: arg })
            return new UFunctionLambda(hash, interpreter)
        }
        else {
            if (!((arg[0] instanceof ULiszt || arg[0] instanceof UString) && arg[1] instanceof UNumber)) {
                throw new UniversalError("slice only works on lists with numbers")
            }
            if (arg[0] instanceof ULiszt) {
                return ULiszt.from(arg[0].value.slice(arg[1].value))
            }
            else if (arg[0] instanceof UString) {
                return new UString(arg[0].value.slice(arg[1].value))
            }
            return new UString("")
        }
    }
    public static str(arg: UniversalObj, interpreter: Interpreter, indentedlines: string): UniversalObj {
        return  new UString(arg.tostring())
    }
}