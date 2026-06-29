import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base path matches the GitHub Pages project URL (https://sripradha17.github.io/InteractiveQuiz/).
// If you ever move to a custom domain or org/user page, change this to "/".
export default defineConfig({
  plugins: [react()],
  base: "/InteractiveQuiz/",
});
