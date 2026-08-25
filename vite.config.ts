import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs are required when GitHub Pages serves the project
  // below /<repository>/ instead of from the domain root.
  base: "./",
  build: {
    sourcemap: false,
  },
});
