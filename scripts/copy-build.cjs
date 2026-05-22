const fs = require("node:fs");
const path = require("node:path");

const [fromArg, toArg] = process.argv.slice(2);

if (!fromArg || !toArg) {
  throw new Error("Usage: node scripts/copy-build.cjs <from> <to>");
}

const root = process.cwd();
const source = path.resolve(root, fromArg);
const target = path.resolve(root, toArg);

function assertInsideWorkspace(directory) {
  const relative = path.relative(root, directory);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside the project: ${directory}`);
  }
}

function copyDirectory(from, to) {
  fs.mkdirSync(to, { recursive: true });

  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const sourcePath = path.join(from, entry.name);
    const targetPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
  }
}

if (!fs.existsSync(source)) {
  throw new Error(`Build directory does not exist: ${source}`);
}

assertInsideWorkspace(target);
fs.rmSync(target, { recursive: true, force: true });
copyDirectory(source, target);

console.log(`Copied ${path.relative(root, source)} to ${path.relative(root, target)}.`);
