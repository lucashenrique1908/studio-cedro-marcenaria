import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/studio-cedro-marcenaria/",
  plugins: [
    {
      name: "normalize-vite-base-url-placeholder",
      enforce: "pre",
      transformIndexHtml(html) {
        return html.replaceAll("%VITE_BASE_URL%", "%BASE_URL%");
      },
    },
    react(),
  ],
});
