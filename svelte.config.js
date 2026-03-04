import adapterAuto from '@sveltejs/adapter-auto';
import adapterStatic from '@sveltejs/adapter-static';

// Use adapter-static for builds, adapter-auto for dev
const isBuild = process.env.NODE_ENV === 'production' || process.argv.includes('build');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: isBuild 
			? adapterStatic({
				// Output pages and assets to root of build directory
				pages: '',
				assets: '',
				fallback: undefined,
				precompress: false,
				strict: true
			})
			: adapterAuto(),
		// Ensure all routes are prerendered
		prerender: {
			entries: ['*'],
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404 errors for favicon and other assets during prerender
				if (path.includes('favicon') || path.includes('.svg') || path.includes('.ico')) {
					console.warn(`Skipping missing asset during prerender: ${path}`);
					return;
				}
				// For other errors, throw to fail the build
				throw new Error(`${message} (${path})`);
			}
		},
		// Set app directory for build output
		appDir: '_app'
	}
};

export default config;
