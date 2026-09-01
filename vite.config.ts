import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  base: "/universal/",

  css: {
    transformer: "postcss"
  },
  build: {
    cssMinify: "esbuild",
  },

  resolve: {
    tsconfigPaths: true,
  },
  environments: {
    client: {
      build: {
        outDir: ".output/public/universal",
      },
    },
  },

  plugins: [cloudflare({
    viteEnvironment: {
      name: "ssr"
    },

  }),
  tanstackStart({
    server: { entry: "server" },
  }),
  viteReact(),
  tailwindcss(),

  ]
});
