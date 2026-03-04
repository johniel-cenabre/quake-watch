import { readdir, copyFile, mkdir, rm } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';

const buildDir = resolve(process.cwd(), 'build');
const rootDir = process.cwd();

async function moveBuildFiles() {
	try {
		// Check if build directory exists
		if (!existsSync(buildDir)) {
			// With adapter-static pages: '' and assets: '', files might already be in root
			// Check if index.html exists in root (indicates files are already there)
			const indexHtml = join(rootDir, 'index.html');
			if (existsSync(indexHtml)) {
				console.log('Build files are already in the root directory.');
				console.log('Files with unique identifiers (content hashes) have been generated.');
				return;
			}
			console.log('Build directory not found. Run "npm run build" first.');
			return;
		}

		console.log('Moving build files to root...');

		// Read all files in build directory
		const files = await readdir(buildDir, { withFileTypes: true });

		for (const file of files) {
			const sourcePath = join(buildDir, file.name);
			const destPath = join(rootDir, file.name);

			// Skip if destination already exists (to prevent overwriting)
			if (existsSync(destPath)) {
				console.log(`Skipping ${file.name} (already exists in root)`);
				continue;
			}

			if (file.isDirectory()) {
				// For directories, we need to recursively copy
				await copyDirectory(sourcePath, destPath);
			} else {
				// For files, copy directly
				await copyFile(sourcePath, destPath);
			}
		}

		console.log('Build files moved to root successfully!');
		console.log('Note: The build/ directory still exists. You can delete it if needed.');
	} catch (error) {
		console.error('Error moving build files:', error);
		process.exit(1);
	}
}

async function copyDirectory(source, dest) {
	// Create destination directory if it doesn't exist
	try {
		await mkdir(dest, { recursive: true });
	} catch (e) {
		// Directory might already exist
	}

	const entries = await readdir(source, { withFileTypes: true });

	for (const entry of entries) {
		const sourcePath = join(source, entry.name);
		const destPath = join(dest, entry.name);

		if (entry.isDirectory()) {
			await copyDirectory(sourcePath, destPath);
		} else {
			await copyFile(sourcePath, destPath);
		}
	}
}

moveBuildFiles();
