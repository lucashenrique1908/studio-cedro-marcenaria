const fs = require("node:fs");
const path = require("node:path");

const files = ["index.html", "404.html"];

for (const file of files) {
  const filePath = path.join(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  const current = fs.readFileSync(filePath, "utf8");
  const next = current.replaceAll("%VITE_BASE_URL%", "%BASE_URL%");

  if (next !== current) {
    fs.writeFileSync(filePath, next);
  }
}
