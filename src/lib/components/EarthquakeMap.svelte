<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { Map } from 'leaflet';
	import type { Earthquake } from '../types';

	let { earthquakes, onEarthquakeSelect, focusEarthquake } = $props<{
		earthquakes: Earthquake[];
		onEarthquakeSelect?: (earthquake: Earthquake) => void;
		focusEarthquake?: Earthquake | null;
	}>();

	let mapContainer: HTMLDivElement;
	let map: Map | null = null;
	let markers: any[] = [];
	let earthquakeMarkerMap = new globalThis.Map<string, any>(); // Map earthquake ID to marker
	let L: any = null;
	let mapReady = $state(false);

	onMount(async () => {
		if (!browser) return;

		try {
			// Dynamically import Leaflet only in the browser
			const leaflet = await import('leaflet');
			L = leaflet.default;

			// Wait for container to be ready
			if (!mapContainer) {
				console.warn('Map container not ready');
				return;
			}

			// Initialize map
			map = L.map(mapContainer).setView([20, 140], 3);

			// Add tile layer (OpenStreetMap - free, no API key needed)
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
				maxZoom: 19
			}).addTo(map);

			// Wait for map to be fully ready
			if (map) {
				map.whenReady(() => {
					mapReady = true;
					// Small delay to ensure map is fully rendered
					setTimeout(() => {
						updateMap();
					}, 100);
				});
			}
		} catch (error) {
			console.error('Error initializing map:', error);
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});

	function updateMap() {
		if (!map || !L || !mapReady) return;
		if (!earthquakes || earthquakes.length === 0) return;

		// Store map reference to avoid null checks
		const currentMap = map;
		if (!currentMap) return;

		try {
			// Clear existing markers
			markers.forEach(marker => {
				try {
					currentMap.removeLayer(marker);
				} catch (e) {
					// Marker might already be removed
					console.warn('Error removing marker:', e);
				}
			});

			markers = [];
			earthquakeMarkerMap.clear();

			// Add earthquake markers
			earthquakes.forEach((earthquake: Earthquake) => {
				// Validate earthquake data
				if (!earthquake || 
					typeof earthquake.latitude !== 'number' || 
					typeof earthquake.longitude !== 'number' ||
					isNaN(earthquake.latitude) || 
					isNaN(earthquake.longitude)) {
					console.warn('Invalid earthquake data:', earthquake);
					return;
				}
			// Create custom earthquake icon based on magnitude
			const iconColor = getCategoryColor(earthquake.category);
			const iconSize = Math.max(20, Math.min(60, earthquake.magnitude * 8)); // Size based on magnitude
			const icon = L.divIcon({
				className: 'earthquake-marker',
				html: `
					<div class="relative flex items-center justify-center" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
						<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
							<circle cx="20" cy="20" r="18" 
								fill="${iconColor}" 
								stroke="white" 
								stroke-width="2"/>
						</svg>
						<div class="absolute inset-0 flex items-center justify-center text-white font-bold text-xs pointer-events-none">
							${earthquake.magnitude.toFixed(1)}
						</div>
					</div>
				`,
				iconSize: [iconSize, iconSize],
				iconAnchor: [iconSize / 2, iconSize / 2]
			});

			// Format date in English locale
			const formattedDate = new Date(earthquake.lastUpdate).toLocaleString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: true
			});

				try {
					const marker = L.marker([earthquake.latitude, earthquake.longitude], { icon })
						.addTo(currentMap)
						.bindPopup(`
							<div class="min-w-[200px] dark:text-gray-100">
								<h3 class="m-0 mb-2.5" style="color: ${iconColor};">${earthquake.name || 'Earthquake Event'}</h3>
								<p class="my-1.5 dark:text-gray-300"><strong>Magnitude:</strong> ${earthquake.magnitude.toFixed(1)}</p>
								<p class="my-1.5 dark:text-gray-300"><strong>Category:</strong> ${earthquake.category}</p>
								<p class="my-1.5 dark:text-gray-300"><strong>Depth:</strong> ${earthquake.depth.toFixed(1)} km</p>
								<p class="my-1.5 dark:text-gray-300"><strong>Location:</strong> ${earthquake.latitude.toFixed(2)}°N, ${earthquake.longitude.toFixed(2)}°E</p>
								<p class="my-1.5 text-sm text-gray-600 dark:text-gray-400">Last update: ${formattedDate}</p>
							</div>
						`);

					// Add click handler to select earthquake
					marker.on('click', () => {
						if (onEarthquakeSelect) {
							onEarthquakeSelect(earthquake);
						}
					});

					markers.push(marker);
					// Store mapping for quick lookup
					earthquakeMarkerMap.set(earthquake.id, marker);
				} catch (error) {
					console.error('Error creating marker for earthquake:', earthquake.id, error);
				}
			});

			// Invalidate map size to ensure markers are visible
			setTimeout(() => {
				if (currentMap) {
					currentMap.invalidateSize();
				}
			}, 50);
		} catch (error) {
			console.error('Error updating map:', error);
		}
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

	// Update map when data changes
	$effect(() => {
		// Only update if map is ready
		if (mapReady && map && L) {
			updateMap();
		}
	});

	// Pan to focused earthquake when it changes
	$effect(() => {
		if (focusEarthquake && map && L) {
			const targetLat = focusEarthquake.latitude;
			const targetLng = focusEarthquake.longitude;
			
			// Use flyTo for smooth animation that ensures centering
			map.flyTo([targetLat, targetLng], 8, {
				animate: true,
				duration: 1.0
			});
			
			// Find the marker using the earthquake ID for reliable lookup
			const marker = earthquakeMarkerMap.get(focusEarthquake.id);
			
			// Wait for animation to complete, then ensure it's centered and open popup
			setTimeout(() => {
				if (map) {
					// Double-check that the view is centered on the earthquake
					const currentCenter = map.getCenter();
					const latDiff = Math.abs(currentCenter.lat - targetLat);
					const lngDiff = Math.abs(currentCenter.lng - targetLng);
					
					// If not centered (within 0.01 degrees), pan to center it
					if (latDiff > 0.01 || lngDiff > 0.01) {
						map.setView([targetLat, targetLng], map.getZoom(), {
							animate: false
						});
					}
					
					// Open popup if marker exists
					if (marker) {
						marker.openPopup();
					}
				}
			}, 1200);
		}
	});
</script>

<div bind:this={mapContainer} class="w-full h-full z-0"></div>
