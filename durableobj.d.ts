


export interface UniversalStoreRPC {

	sayHello(name: string): Promise<string>;
	getFullStore(): Promise<string>;
	setValues(vals: Record<string, string>): Promise<void>;
}