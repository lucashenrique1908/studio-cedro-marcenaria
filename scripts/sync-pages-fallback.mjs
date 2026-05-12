import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const rootDir = process.cwd();
const distDir = resolve(rootDir, "dist");
const rootAssetsDir = resolve(rootDir, "assets");
const docsDir = resolve(rootDir, "docs");
const preservedAssetFolders = ["cozinha", "Quartos", "DesignsEspeciais"];
const preservedAssetsBackupDir = mkdtempSync(resolve(tmpdir(), "studio-assets-"));

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

for (const folderName of preservedAssetFolders) {
	const sourcePath = resolve(docsDir, "assets", folderName);
	if (existsSync(sourcePath)) {
		cpSync(sourcePath, resolve(preservedAssetsBackupDir, folderName), {
			recursive: true,
			force: true,
		});
	}
}

if (existsSync(docsDir)) {
	rmSync(docsDir, { recursive: true, force: true });
}

mkdirSync(rootDir, { recursive: true });
copyIfExists("assets", "assets");
copyIfExists("favicon.svg", "favicon.svg");
copyIfExists("icons.svg", "icons.svg");
copyIfExists("404.html", "404.html");
copyIfExists("index.html", "index.prod.html");
writeFileSync(resolve(rootDir, ".nojekyll"), "");

cpSync(distDir, docsDir, { recursive: true, force: true });

for (const folderName of preservedAssetFolders) {
	const backupPath = resolve(preservedAssetsBackupDir, folderName);
	if (existsSync(backupPath)) {
		cpSync(backupPath, resolve(docsDir, "assets", folderName), {
			recursive: true,
			force: true,
		});
	}
}

rmSync(preservedAssetsBackupDir, { recursive: true, force: true });
