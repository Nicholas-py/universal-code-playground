import { env } from 'cloudflare:workers';
import { UniversalStoreRPC } from "../../durableobj";

type StoreData = {
    full: Record<string, string>,
    master: Record<string, string>
}


export class UniversalStore {

    private fullstore: Record<string, string> = {}
    private masterstore: Record<string, string> = {}
    private fchanges: Record<string, string> = {}
    private mchanges: Record<string, string> = {}

    public async sync() {
        let json = { full: { ...this.fchanges }, master: { ...this.mchanges } };
        await this.setglobal(json);

        this.fchanges = {}; this.mchanges = {}

        json = await this.getglobal();

        this.fullstore = json.full;
        this.masterstore = json.master;

    }

    public getValue(varname: string): string {
        if (varname in this.fullstore) {
            return this.fullstore[varname]
        }

        let raw = this.getRawName(varname);
        if (raw in this.masterstore) {
            return this.masterstore[raw];
        }

        return 'str:' + varname;
    }

    public setValue(varname: string, value: string) {
        const raw = this.getRawName(varname);

        if (raw in this.masterstore) {
            this.fullstore[varname] = value;
            this.fchanges[varname] = value;
        }

        else {
            this.masterstore[raw] = value;
            this.mchanges[raw] = value;
            this.fullstore[varname] = value;
            this.fchanges[varname] = value;
        }
    }

    public listKeys() {
        return Object.keys(this.fullstore);
    }

    private getRawName(varname: string): string {
        if (varname.includes("=")) {
            throw new EvalError("= cannot be in variable names")
        }
        //Return numbers straight up
        if (!isNaN(parseFloat(varname))) {
            return varname;
        }

        return varname.replace(/\d+$/, "");
    }

    async setglobal(json: StoreData) {
        await (env.UNIVERSAL_STORE as unknown as UniversalStoreRPC).setFull(json.full);
        await (env.UNIVERSAL_STORE as unknown as UniversalStoreRPC).setMaster(json.master);
    }

    async getglobal(): Promise<StoreData> {
        const full = await (env.UNIVERSAL_STORE as unknown as UniversalStoreRPC).getFull();
        const master = await (env.UNIVERSAL_STORE as unknown as UniversalStoreRPC).getMaster();
        return { full: JSON.parse(full), master: JSON.parse(master) };
    }

    async reset() {
        await (env.UNIVERSAL_STORE as unknown as UniversalStoreRPC).reset()

    }

}


