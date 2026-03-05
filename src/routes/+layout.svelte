<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Initialize theme on mount
	onMount(() => {
		if (browser) {
			// Ensure theme is applied
			theme.subscribe((currentTheme) => {
				document.documentElement.classList.toggle('dark', currentTheme === 'dark');
			})();
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

{@render children()}
