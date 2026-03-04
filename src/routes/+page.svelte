<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import EarthquakeMap from '$lib/components/EarthquakeMap.svelte';
	import StatisticsPanel from '$lib/components/StatisticsPanel.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { fetchEarthquakeData } from '$lib/services/earthquakeApi';
	import type { Earthquake, EarthquakeData } from '$lib/types';

	let earthquakeData: EarthquakeData = {
		earthquakes: [],
		timestamp: new Date().toISOString()
	};
	let selectedEarthquake: Earthquake | null = null;
	let connectionStatus = 'Loading...';
	let pollingInterval: ReturnType<typeof setInterval> | null = null;

	onMount(() => {
		if (!browser) return;

		// Initial data fetch
		loadEarthquakeData();

		// Start polling for updates every 5 minutes
		startPolling();
	});

	onDestroy(() => {
		if (browser && pollingInterval) {
			clearInterval(pollingInterval);
		}
	});

	async function loadEarthquakeData() {
		try {
			connectionStatus = 'Loading...';
			const data = await fetchEarthquakeData();
			earthquakeData = data;
			connectionStatus = 'Connected';
		} catch (error) {
			console.error('Error loading earthquake data:', error);
			connectionStatus = 'Error loading data';
		}
	}

	function startPolling() {
		if (!browser) return;

		// Poll every 5 minutes for updates
		if (pollingInterval) clearInterval(pollingInterval);
		pollingInterval = setInterval(() => {
			loadEarthquakeData();
		}, 300000); // 5 minutes
	}

	function handleEarthquakeSelect(earthquake: Earthquake) {
		selectedEarthquake = earthquake;
	}
</script>

<svelte:head>
	<title>Quake Watch - Global Earthquake Monitor</title>
	<meta name="description" content="Real-time global earthquake monitoring" />
</svelte:head>

<div class="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
	<header class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg px-4 sm:px-6 md:px-8 py-4 shadow-md flex justify-between items-center z-[1000] border-b border-gray-200 dark:border-gray-700">
		<div>
			<h1 class="m-0 text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 bg-clip-text text-transparent">🌍 Quake Watch</h1>
			<p class="mt-1.5 mb-0 text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm">Global Earthquake Monitoring System</p>
		</div>
		<div class="flex items-center gap-3">
			<div class="w-2.5 h-2.5 rounded-full {connectionStatus === 'Connected' ? 'bg-green-500' : connectionStatus === 'Loading...' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 animate-pulse'}"></div>
			<span class="text-xs text-gray-600 dark:text-gray-400 font-medium">{connectionStatus}</span>
			<ThemeToggle />
		</div>
	</header>

	<main class="flex-1 flex overflow-hidden gap-5 p-5 max-lg:flex-col">
		<div class="flex-1 rounded-xl overflow-hidden shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
			<EarthquakeMap
				earthquakes={earthquakeData.earthquakes}
				onEarthquakeSelect={handleEarthquakeSelect}
				focusEarthquake={selectedEarthquake}
			/>
		</div>
		<aside class="w-[400px] flex flex-col max-lg:w-full max-lg:max-h-[300px]">
			<StatisticsPanel
				selectedEarthquake={selectedEarthquake}
				earthquakes={earthquakeData.earthquakes}
				onEarthquakeSelect={handleEarthquakeSelect}
			/>
		</aside>
	</main>

	<footer class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg py-2.5 px-8 text-center text-xs text-gray-600 dark:text-gray-400 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-gray-200 dark:border-gray-700">
		<p class="my-0.5">Last updated: {new Date(earthquakeData.timestamp).toLocaleString()}</p>
		<p class="my-0.5">Data source: USGS Earthquake Hazards Program | Map: OpenStreetMap</p>
	</footer>
</div>
