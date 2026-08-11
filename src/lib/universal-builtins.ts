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
      return new UString(arg[0].tostring() + arg[1].tostring(), interpreter)
    }

  }

}