import { createServerFn } from "@tanstack/react-start";
import { interpret, type UniversalEntry } from "./universal-interpreter";
import { env } from 'cloudflare:workers';
import { UniversalStoreRPC } from "../../durableobj";

/**
 * Thin worker wrapper around the Universal interpreter.
 *
 * The actual per-request execution is delegated to `./universal-interpreter.ts`,
 * This module only owns:
 *   - the in-memory cloud store
 *   - HTTP/RPC plumbing (createServerFn)
 *   - input validation
 */



const universalStore = new Map<string, UniversalEntry>();

//Run universal code
export const runUniversal = createServerFn({ method: "POST" })
  .inputValidator((input: { source: string }) => {
    if (typeof input?.source !== "string") throw new Error("source must be a string");
    if (input.source.length > 20_000) throw new Error("source too long");
    return input;
  })
  .handler(async ({ data }) => {
    await setUniversal({data:{"hello":"world"}})
    const start = Date.now();
    const { stdout, stderr, exitCode } = interpret(data.source, universalStore);
    return { stdout, stderr, exitCode, ms: Date.now() - start };
  });

// //Get a list of all the universal values
// export const listUniversal = createServerFn({ method: "GET" }).handler(async () => {
//   const entries = Array.from(universalStore.entries()).map(([name, { value, updatedAt }]) => ({
//     name,
//     value,
//     updatedAt,
//   }));
//   entries.sort((a, b) => b.updatedAt - a.updatedAt);
//   return { entries };
// });

// export const clearUniversal = createServerFn({ method: "POST" }).handler(async () => {
//   universalStore.clear();
//   return { ok: true };
// });

export const getUniversalRaw = createServerFn({method: "GET"})
  .handler( async () => {
    return (env.UNIVERSAL_STORE.getByName('store') as unknown as UniversalStoreRPC).getFullStore();
  })


export const getUniversal = createServerFn({method: "GET"})
  .handler( async () => {
    const result =  await (env.UNIVERSAL_STORE.getByName('store') as unknown as UniversalStoreRPC).getFullStore();
    return JSON.parse(result);
  })

export const setUniversal = createServerFn({method: "POST"})
.validator((json:Record<string, string>) => json)
  .handler( async ({data:json}) => {
    return (env.UNIVERSAL_STORE.getByName('store') as unknown as UniversalStoreRPC).setValues(json);
  })
