const fs = require("node:fs");
const path = require("node:path");

const dirArgIndex = process.argv.indexOf("--dir");
const outputDir = dirArgIndex >= 0 ? process.argv[dirArgIndex + 1] : "dist";
const distDir = path.join(process.cwd(), outputDir);
const indexPath = path.join(distDir, "index.html");
const assetPattern = /(?:src|href)="([^"]*\/assets\/[^"]+)"/g;
const faviconVersion = "v=4";
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/").pop() ||
  "studio-cedro-marcenaria";
const expectedBase = process.argv.includes("--pages")
  ? normalizeBasePath(process.env.VITE_BASE_PATH || `/${repositoryName}/`)
  : "/";
const isPagesBuild = expectedBase !== "/";

function normalizeBasePath(basePath) {
  if (!basePath || basePath === "/") {
    return "/";
  }

  return `/${basePath.replace(/^\/+|\/+$/g, "")}/`;
}

function collectFiles(directory, extensions) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectFiles(entryPath, extensions);
    }

    return extensions.includes(path.extname(entry.name)) ? [entryPath] : [];
  });
}

function hasExactFileName(directory, fileName) {
  return fs.existsSync(directory) && fs.readdirSync(directory).includes(fileName);
}

if (!fs.existsSync(indexPath)) {
  throw new Error("dist/index.html was not generated.");
}

if (!fs.existsSync(path.join(distDir, "404.html"))) {
  throw new Error("dist/404.html was not generated.");
}

if (fs.existsSync(path.join(distDir, "vercel.json"))) {
  throw new Error("vercel.json must stay at the project root, not inside dist.");
}

const html = fs.readFileSync(indexPath, "utf8");
const forbiddenPatterns = [
  /\/src\/main\.jsx/,
  /%BASE_URL%/,
  /%VITE_BASE_URL%/,
];

if (!fs.existsSync(path.join(distDir, ".nojekyll"))) {
  throw new Error("dist/.nojekyll was not generated for GitHub Pages compatibility.");
}

if (expectedBase === "/" && /(?:src|href)="\/studio-cedro-marcenaria\//.test(html)) {
  throw new Error("Vercel/root build references assets with the GitHub Pages base path.");
}

if (isPagesBuild && !html.includes(expectedBase)) {
  throw new Error(`GitHub Pages build does not include expected base path: ${expectedBase}`);
}

const expectedFaviconPath =
  `${expectedBase}favicon.png`;
const expectedShortcutPath =
  `${expectedBase}favicon.ico`;

if (!html.includes(`${expectedFaviconPath}?${faviconVersion}`)) {
  throw new Error(`index.html does not reference favicon with expected base: ${expectedBase}`);
}

if (!html.includes(`${expectedShortcutPath}?${faviconVersion}`)) {
  throw new Error(`index.html does not reference shortcut icon with expected base: ${expectedBase}`);
}

if (!hasExactFileName(distDir, "favicon.png")) {
  throw new Error("Build output is missing favicon.png with the exact lowercase file name.");
}

if (!hasExactFileName(distDir, "favicon.ico")) {
  throw new Error("Build output is missing favicon.ico with the exact lowercase file name.");
}

for (const pattern of forbiddenPatterns) {
  if (pattern.test(html)) {
    throw new Error(`dist/index.html contains an invalid production reference: ${pattern}`);
  }
}

const assets = [...html.matchAll(assetPattern)].map((match) => match[1]);

if (assets.length === 0) {
  throw new Error("dist/index.html does not reference any built JS/CSS assets.");
}

for (const assetUrl of assets) {
  const assetPath = assetUrl.replace(/^https?:\/\/[^/]+/, "").replace(/^\//, "");
  const assetRelativePath = assetPath.includes("/assets/")
    ? assetPath.slice(assetPath.indexOf("assets/"))
    : assetPath;
  const filePath = path.join(distDir, assetRelativePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing built asset referenced by index.html: ${assetUrl}`);
  }
}

const jsAssets = assets.filter((asset) => asset.endsWith(".js"));
const cssAssets = assets.filter((asset) => asset.endsWith(".css"));

if (jsAssets.length === 0 || cssAssets.length === 0) {
  throw new Error("dist/index.html must reference both JS and CSS build assets.");
}

const builtTextFiles = collectFiles(distDir, [".html", ".js", ".css"]);

for (const filePath of builtTextFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(process.cwd(), filePath);

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      throw new Error(`${relativePath} contains an invalid production reference: ${pattern}`);
    }
  }

  if (!isPagesBuild && /\/studio-cedro-marcenaria\/(?:docs\/)?assets\//.test(content)) {
    throw new Error(`${relativePath} contains GitHub Pages asset paths in a root build.`);
  }

  if (isPagesBuild && /["'(=]\/assets\//.test(content)) {
    throw new Error(`${relativePath} contains root asset paths in a GitHub Pages build.`);
  }
}

console.log("Production build verified.");
console.log(`HTML: ${path.relative(process.cwd(), indexPath)}`);
console.log("Assets:");
for (const asset of assets) {
  console.log(`- ${asset}`);
}
