import { createServerFn, useServerFn } from "@tanstack/react-start";
import { env } from 'cloudflare:workers';
import { UniversalStoreRPC } from "../../durableobj";
import { interpretsource } from "./universal-interpreter";
import { UniversalStore } from "./universal-store";

const universalStore = new UniversalStore();

export const runUniversal = createServerFn({ method: "POST" })
  .validator((input: { source: string }) => {
    if (typeof input?.source !== "string") throw new Error("source must be a string");
    return input;
  })
  .handler(async ({ data }) => {
    await universalStore.sync();
    const { stdout, stderr } = await interpretsource(data.source, universalStore);
    await universalStore.sync();
    return { stdout, stderr};
  });



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


