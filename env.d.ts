import type { UniversalStoreRPC } from "./durableobj.d.ts";
import type { DurableObjectNamespace } from "@cloudflare/workers-types";


declare global {
	interface Env {
		UNIVERSAL_STORE: DurableObjectNamespace;
	}
}

export {}