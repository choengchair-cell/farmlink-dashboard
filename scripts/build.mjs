import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { build } from "vite";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

await build({
  root: projectRoot,
  configFile: false,
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(projectRoot, "src"),
    },
  },
});
