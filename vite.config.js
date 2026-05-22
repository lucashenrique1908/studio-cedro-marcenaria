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
    Boolean(process.env.GITHUB_PAGES) ||
    Boolean(process.env.GITHUB_ACTIONS)
  );
}

function getBasePath({ mode }) {
  if (isVercelBuild()) {
    return "/";
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
    plugins: [react()],
    base,
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
