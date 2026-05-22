import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function normalizeBasePath(path) {
  if (!path || path === "/") {
    return "/";
  }

  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

function getRepositoryName() {
  return process.env.GITHUB_REPOSITORY?.split("/").pop() || "studio-cedro-marcenaria";
}

function isVercelBuild() {
  return Boolean(process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_URL);
}

function isGitHubPagesBuild(mode) {
  return (
    mode === "github-pages" ||
    mode === "docs" ||
    process.env.DEPLOY_TARGET === "github-pages" ||
    process.env.VITE_DEPLOY_TARGET === "github-pages" ||
    Boolean(process.env.GITHUB_PAGES)
  );
}

function getBasePath({ mode }) {
  if (mode === "vercel" || process.env.DEPLOY_TARGET === "vercel" || isVercelBuild()) {
    return "/";
  }

  if (mode === "docs") {
    return normalizeBasePath(`${getRepositoryName()}/docs`);
  }

  if (process.env.VITE_BASE_PATH) {
    return normalizeBasePath(process.env.VITE_BASE_PATH);
  }

  if (isGitHubPagesBuild(mode)) {
    return normalizeBasePath(getRepositoryName());
  }

  return "/";
}

export default defineConfig(({ mode }) => {
  const base = getBasePath({ mode });

  return {
    plugins: [
      react(),
      {
        name: "studio-favicon-paths",
        transformIndexHtml: {
          order: "pre",
          handler(html) {
            return {
              html: html
                .replace(/href="\.\/docs\/favicon\.png\?v=5"/g, `href="${base}favicon.png?v=5"`)
                .replace(/href="\.\/docs\/favicon\.ico\?v=5"/g, `href="${base}favicon.ico?v=5"`),
              tags: [
                {
                  tag: "script",
                  attrs: { type: "module", src: "/src/main.jsx" },
                  injectTo: "body",
                },
              ],
            };
          },
        },
      },
    ],
    base,
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
