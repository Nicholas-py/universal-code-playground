import { createServerFn, useServerFn } from "@tanstack/react-start";
import { env } from 'cloudflare:workers';
import { UniversalStoreRPC } from "../../durableobj";
import { interpretsource } from "./universal-interpreter";
import { UniversalStore } from "./universal-store";
/**
 * Thin worker wrapper around the Universal interpreter.
 *
 * The actual per-request execution is delegated to `./universal-interpreter.ts`,
 * This module only owns:
 *   - the in-memory cloud store
 *   - HTTP/RPC plumbing (createServerFn)
 *   - input validation
 */

const universalStore = new UniversalStore();

//Run universal code
export const runUniversal = createServerFn({ method: "POST" })
  .validator((input: { source: string }) => {
    if (typeof input?.source !== "string") throw new Error("source must be a string");
    if (input.source.length > 20_000) throw new Error("source too long");
    return input;
  })
  .handler(async ({ data }) => {
    await universalStore.sync();
    const { stdout, stderr } = await interpretsource(data.source, universalStore);
    await universalStore.sync();
    return { stdout, stderr};
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

export const getUniversalRaw = createServerFn({ method: "GET" })
  .handler(async () => {
    return `{full:${(env.UNIVERSAL_STORE as unknown as UniversalStoreRPC).getFull()},    master:${(env.UNIVERSAL_STORE as unknown as UniversalStoreRPC).getFull()}} `;
  })


export const getUniversal = createServerFn({ method: "GET" })
  .handler(async () => {
    const full = await (env.UNIVERSAL_STORE as unknown as UniversalStoreRPC).getFull();
    const master = await (env.UNIVERSAL_STORE as unknown as UniversalStoreRPC).getMaster();
    return { full: JSON.parse(full), master: JSON.parse(master) };
  })

export const setUniversal = createServerFn({ method: "POST" })
  .validator((json: { full: Record<string, string>, master: Record<string, string> }) => json)
  .handler(async ({ data: json }) => {
    await (env.UNIVERSAL_STORE as unknown as UniversalStoreRPC).setFull(json.full);
    await (env.UNIVERSAL_STORE as unknown as UniversalStoreRPC).setMaster(json.master);
    return true;
  })


