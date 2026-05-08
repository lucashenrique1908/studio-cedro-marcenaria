import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = process.cwd();
const distDir = resolve(rootDir, "dist");
const rootAssetsDir = resolve(rootDir, "assets");

function copyIfExists(sourceRelativePath, targetRelativePath = sourceRelativePath) {
	const sourcePath = resolve(distDir, sourceRelativePath);
	if (!existsSync(sourcePath)) {
		return;
	}

	const targetPath = resolve(rootDir, targetRelativePath);
	cpSync(sourcePath, targetPath, { recursive: true, force: true });
}

if (existsSync(rootAssetsDir)) {
	rmSync(rootAssetsDir, { recursive: true, force: true });
}

mkdirSync(rootDir, { recursive: true });
copyIfExists("assets", "assets");
copyIfExists("favicon.svg", "favicon.svg");
copyIfExists("icons.svg", "icons.svg");
copyIfExists("404.html", "404.html");
copyIfExists("index.html", "index.prod.html");
writeFileSync(resolve(rootDir, ".nojekyll"), "");
