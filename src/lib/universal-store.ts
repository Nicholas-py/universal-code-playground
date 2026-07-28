import { useServerFn } from "@tanstack/react-start";
import { getUniversal, setUniversal } from "./universal-run.functions";


export class UniversalStore {

  fullstore: Record<string, string> = {}
  masterstore: Record<string, string> = {}

  constructor(public setglobal:any,public getglobal:any) {
  }

  public async sync() {
    let json = { full: this.fullstore, master: this.masterstore };
    console.log("aaa")
    await this.setglobal({ data: json });

    json = await this.getglobal();
    this.fullstore = json.full;
    this.masterstore = json.master;

  }

  public getValue(varname: string): string {
    if (varname in this.fullstore) {
      return this.fullstore[varname]
    }

    const raw = this.getRawName(varname);
    if (raw in this.masterstore) {
      return this.masterstore[raw];
    }

    return varname;
  }

  public setValue(varname: string, value: string) {
    const raw = this.getRawName(varname);

    if (raw in this.masterstore) {
      this.fullstore[varname] = value;
    }

    else {
      this.masterstore[raw] = value;
      this.fullstore[varname] = value;
    }
  }

  public listKeys() {
    return Object.keys(this.fullstore);
  }

  getRawName(varname: string): string {
    if (varname.includes("=")) {
      throw new EvalError("= cannot be in variable names")
    }
    return varname.replace(/\d+$/, "");
  }

  getDigits(varname: string): string {
    let s2 = ""
    for (let i = varname.length - 1; i >= 0; i++) {
      if ('1234567890'.includes(varname[i])) {
        s2 += varname[i]
      }
      else {
        return s2
      }
    }
    return s2
  }

}


