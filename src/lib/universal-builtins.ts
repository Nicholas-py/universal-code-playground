import { UniArg, UFunctionBuiltin, ULiszt, UniversalError, UniversalObj, UNumber, UString, UFunctionLambda } from "./universal-types";
import { Interpreter } from "./universal-interpreter";


export class UniversalBuiltins {

    public static print(arg: UniArg, interpreter: Interpreter): UniversalObj {
        if (arg == undefined) {
            return new UFunctionBuiltin("print", interpreter);
        }
        interpreter.stdout.push(arg.tostring());
        return new UString(arg.tostring(), interpreter);
    }



    public static plus(arg: UniArg | UniversalObj[], interpreter: Interpreter): UniversalObj {
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
                return new ULiszt(ULiszt.empty.hashval(arg[0].value.concat([arg[1].value])))
            }
            if (arg[1] instanceof ULiszt) {
                return new ULiszt(ULiszt.empty.hashval([arg[0].value].concat(arg[1].value)))
            }

            return new UString(arg[0].tostring() + arg[1].tostring(), interpreter)
        }
    }




    public static minus(arg: UniArg | UniversalObj[], interpreter: Interpreter): UniversalObj {
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
                return new UNumber((arg[0].value - arg1length).toString())
            }

            if (arg[0] instanceof ULiszt && arg[1] instanceof ULiszt) {
                return new ULiszt(ULiszt.empty.hashval(arg[0].value.slice(0, -Math.ceil(arg1length))), interpreter)
            }

            //Possible todo - if given negative arg1length, add the last character several times

            return new UString(arg[0].tostring().slice(0, -Math.ceil(arg1length)), interpreter)
        }
    }

    public static times(arg: UniArg | UniversalObj[], interpreter: Interpreter): UniversalObj {
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
    public static divide(arg: UniArg | UniversalObj[], interpreter: Interpreter): UniversalObj {
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
                for (let i = 0; i < seq.length/arg1length; i++) {
                    newseq.push(seq[(i % seq.length)])
                }
                return new ULiszt(ULiszt.empty.hashval(newseq), interpreter)
            }
            else {
                let seq = arg[0].tostring()
                let newseq = ""
                for (let i = 0; i < seq.length/arg1length; i++) {
                    newseq = newseq.concat(seq[(i % seq.length)])
                }
                return new UString(newseq, interpreter)

            }
        }
    }

}