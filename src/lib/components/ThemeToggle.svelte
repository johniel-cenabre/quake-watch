<script lang="ts">
	import { theme } from '$lib/stores/theme';
</script>

<button
	onclick={() => theme.toggle()}
	class="p-2 md:p-2.5 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
	aria-label="Toggle theme"
	title="Toggle light/dark theme"
>
	{#key $theme}
		{#if $theme === 'light'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-4 h-4 md:w-5 md:h-5 text-gray-700 dark:text-gray-300"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-4 h-4 md:w-5 md:h-5 text-yellow-400"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="5"></circle>
				<line x1="12" y1="1" x2="12" y2="3"></line>
				<line x1="12" y1="21" x2="12" y2="23"></line>
				<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
				<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
				<line x1="1" y1="12" x2="3" y2="12"></line>
				<line x1="21" y1="12" x2="23" y2="12"></line>
				<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
				<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
			</svg>
		{/if}
	{/key}
</button>
