<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { theme } from '$lib/stores/theme';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();

	// Initialize theme on mount
	onMount(() => {
		if (browser) {
			// Apply initial theme class
			const currentTheme = $theme;
			document.documentElement.classList.remove('light', 'dark');
			document.documentElement.classList.add(currentTheme);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

{@render children()}
