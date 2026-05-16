import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? "/farmlink-dashboard/" : "/",
<<<<<<< HEAD
});
=======
});
>>>>>>> 7232b16 (Support Vercel and GitHub Pages base path)
