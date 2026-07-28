


export interface UniversalStoreRPC {

	getFull(): Promise<string>;
	getMaster(): Promise<string>;
	setFull(vals: Record<string, string>): Promise<void>;
	setMaster(vals: Record<string, string>): Promise<void>;
	reset(): Promise<void>;
}