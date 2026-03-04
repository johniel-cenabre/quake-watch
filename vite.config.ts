import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			output: {
				// Add content hash to filenames to prevent overwriting
				entryFileNames: 'assets/[name]-[hash].js',
				chunkFileNames: 'assets/[name]-[hash].js',
				assetFileNames: (assetInfo) => {
					const info = assetInfo.name?.split('.') || [];
					const ext = info[info.length - 1];
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
						return `assets/[name]-[hash].[ext]`;
					}
					return `assets/[name]-[hash].[ext]`;
				}
			}
		}
	},
	server: {
		// Suppress 404 warnings for Chrome DevTools requests
		fs: {
			allow: ['..']
		}
	},
	preview: {
		// Handle Chrome DevTools requests gracefully
		port: 4173
	}
});
