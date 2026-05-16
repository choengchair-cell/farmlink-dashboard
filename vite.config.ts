import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vercel: default base = "/"
// GitHub Pages Project Page: set DEPLOY_TARGET=github-pages to use "/farmlink-dashboard/"
const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? "/farmlink-dashboard/" : "/",
});
