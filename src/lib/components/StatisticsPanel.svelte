<script lang="ts">
	import type { Earthquake } from '../types';
	import { theme } from '../stores/theme';

	let { selectedEarthquake, earthquakes, onEarthquakeSelect } = $props<{
		selectedEarthquake: Earthquake | null;
		earthquakes: Earthquake[];
		onEarthquakeSelect?: (earthquake: Earthquake) => void;
	}>();

	// Subscribe to theme changes to ensure reactivity
	let currentTheme = $derived($theme);

	// Default to first earthquake if none is selected
	$effect(() => {
		if (!selectedEarthquake && earthquakes.length > 0 && onEarthquakeSelect) {
			onEarthquakeSelect(earthquakes[0]);
		}
	});

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleString();
	}

	function getCategoryColor(category: string): string {
		if (category.includes('Minor')) return '#87CEEB';
		if (category.includes('Light')) return '#90EE90';
		if (category.includes('Moderate')) return '#FFFF00';
		if (category.includes('Strong')) return '#FFA500';
		if (category.includes('Major')) return '#FF6347';
		if (category.includes('Great')) return '#8B0000';
		return '#808080';
	}
</script>

{#key currentTheme}
<div class="bg-white dark:bg-gray-900/95 backdrop-blur-lg rounded-xl p-5 shadow-lg h-full overflow-y-auto max-w-[400px] border border-gray-200 dark:border-gray-700">
	<div class="mb-5 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
		<h2 class="m-0 mb-2.5 text-2xl text-gray-900 dark:text-gray-100">Earthquake Statistics</h2>
		<div class="text-gray-600 dark:text-gray-300 text-sm font-medium">Active Earthquakes: {earthquakes.length}</div>
	</div>

	{#if selectedEarthquake}
		<div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
			<h3 class="m-0 mb-4 text-xl" style="color: {getCategoryColor(selectedEarthquake.category)}">
				{selectedEarthquake.name}
			</h3>
			<div class="grid grid-cols-2 gap-4">
				<div class="flex flex-col">
					<label class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 font-semibold">Magnitude</label>
					<div class="text-base font-semibold text-gray-900 dark:text-gray-100">{selectedEarthquake.magnitude.toFixed(1)}</div>
				</div>
				<div class="flex flex-col">
					<label class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 font-semibold">Category</label>
					<div class="text-base font-semibold text-gray-900 dark:text-gray-100" style="color: {getCategoryColor(selectedEarthquake.category)}">
						{selectedEarthquake.category}
					</div>
				</div>
				<div class="flex flex-col">
					<label class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 font-semibold">Depth</label>
					<div class="text-base font-semibold text-gray-900 dark:text-gray-100">{selectedEarthquake.depth.toFixed(1)} km</div>
				</div>
				<div class="flex flex-col">
					<label class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 font-semibold">Position</label>
					<div class="text-base font-semibold text-gray-900 dark:text-gray-100">
						{selectedEarthquake.latitude.toFixed(2)}°N, {selectedEarthquake.longitude.toFixed(2)}°E
					</div>
				</div>
				<div class="flex flex-col col-span-2">
					<label class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 font-semibold">Last Update</label>
					<div class="text-base font-semibold text-gray-900 dark:text-gray-100">{formatDate(selectedEarthquake.lastUpdate)}</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="text-center py-10 px-5 text-gray-400 dark:text-gray-500">
			<p>Select an earthquake on the map to view detailed statistics</p>
		</div>
	{/if}

	<div class="mt-6 pt-5 border-t-2 border-gray-200 dark:border-gray-700">
		<h3 class="m-0 mb-4 text-lg text-gray-900 dark:text-gray-100">All Active Earthquakes</h3>
		<div class="flex flex-col gap-2.5">
			{#each earthquakes as earthquake}
				<div
					class="p-3 bg-gray-50 dark:bg-gray-800 rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:translate-x-1 {selectedEarthquake?.id === earthquake.id ? 'bg-blue-50 dark:bg-blue-900/30 border-l-[6px]' : 'border-l-4'}"
					style="border-left-color: {getCategoryColor(earthquake.category)}"
					onclick={() => onEarthquakeSelect?.(earthquake)}
					role="button"
					tabindex="0"
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							onEarthquakeSelect?.(earthquake);
						}
					}}
				>
					<div class="font-semibold mb-1.5 text-gray-900 dark:text-gray-100">{earthquake.name}</div>
					<div class="flex gap-2.5 text-xs text-gray-600 dark:text-gray-300">
						<span class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded">{earthquake.category}</span>
						<span class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded">M {earthquake.magnitude.toFixed(1)}</span>
						<span class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded">{earthquake.depth.toFixed(0)} km</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
{/key}