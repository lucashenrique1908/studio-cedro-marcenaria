const fs = require("node:fs");
const path = require("node:path");

const distDir = path.join(process.cwd(), "dist");
const requiredFiles = ["index.html", "404.html"];
const forbiddenPatterns = [
  /%VITE_BASE_URL%/,
  /%BASE_URL%/,
  /src\/main\.jsx/,
  /["']\/src\//,
  /["']main\.jsx/,
];

for (const file of requiredFiles) {
  const filePath = path.join(distDir, file);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${file} in dist.`);
  }

  const html = fs.readFileSync(filePath, "utf8");

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(html)) {
      throw new Error(`${file} still contains an unbuilt asset reference: ${pattern}`);
    }
  }

  if (!html.includes("/studio-cedro-marcenaria/assets/")) {
    throw new Error(`${file} does not reference built assets with the GitHub Pages base path.`);
  }
}

console.log("GitHub Pages build verified.");
