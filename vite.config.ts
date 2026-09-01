// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  base: "/universal/",

  //For some reason, doesn't load CSS without this. Is not actually an error (I think)
  // nitro: {
  //   baseURL: "/universal",
  //   preset: "cloudflare-module",
  //   cloudflare: {
  //     deployConfig: false,
  //   },
  // },
  // build: {
  //   outDir: "/universal/assets/"
  // },
  css: {
    transformer: "postcss"
  },
  build: {
    cssMinify: "esbuild",
  },

  resolve: {
    tsconfigPaths: true,
  },

  plugins: [cloudflare({
    viteEnvironment: {
      name: "ssr"
    }
  }),
  tanstackStart({
    server: { entry: "server" },
  }),
  viteReact(),
  tailwindcss(),

  ]
});
