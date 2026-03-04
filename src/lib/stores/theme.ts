import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

// Get initial theme from localStorage or system preference
function getInitialTheme(): Theme {
	if (!browser) return 'light';
	
	const stored = localStorage.getItem('theme') as Theme | null;
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}
	
	// Check system preference
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}
	
	return 'light';
}

// Create the theme store
export const theme = writable<Theme>(getInitialTheme());

// Subscribe to theme changes and update localStorage and document class
if (browser) {
	theme.subscribe((value) => {
		localStorage.setItem('theme', value);
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(value);
	});
	
	// Initialize on load
	const initialTheme = getInitialTheme();
	document.documentElement.classList.add(initialTheme);
	
	// Listen for system theme changes
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		// Only update if user hasn't set a preference
		if (!localStorage.getItem('theme')) {
			theme.set(e.matches ? 'dark' : 'light');
		}
	});
}
