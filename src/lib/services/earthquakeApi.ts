import type { EarthquakeData, Earthquake } from '../types';

// Free API endpoint - using USGS Earthquake data
// Alternative: You can use other earthquake APIs
const API_BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/';

// Fallback to mock data if API is unavailable
let useMockData = false;

export async function fetchEarthquakeData(): Promise<EarthquakeData> {
	try {
		// Try to fetch from USGS API
		const data = await fetchFromUSGS();
		if (data && data.earthquakes.length > 0) {
			// Sort earthquakes by intensity (magnitude) - highest first
			data.earthquakes = sortByIntensity(data.earthquakes);
			return data;
		}
	} catch (error) {
		console.warn('Failed to fetch from USGS API, using mock data:', error);
		useMockData = true;
	}

	// Fallback to mock data
	const mockData = generateMockData();
	mockData.earthquakes = sortByIntensity(mockData.earthquakes);
	return mockData;
}

async function fetchFromUSGS(): Promise<EarthquakeData> {
	try {
		// USGS provides recent earthquake data (last 24 hours, magnitude 2.5+)
		const response = await fetch(`${API_BASE_URL}2.5_day.geojson`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const usgsData = await response.json();
		
		// Transform USGS data to our format
		const earthquakes: Earthquake[] = [];
		
		// USGS returns GeoJSON format with features array
		if (usgsData.features && Array.isArray(usgsData.features)) {
			usgsData.features.forEach((feature: any, index: number) => {
				if (feature.geometry && feature.properties) {
					const props = feature.properties;
					const coords = feature.geometry.coordinates;
					
					earthquakes.push({
						id: feature.id || `earthquake-${index}`,
						name: props.place || `Earthquake ${index + 1}`,
						latitude: coords[1] || 0,
						longitude: coords[0] || 0,
						magnitude: props.mag || 0,
						depth: coords[2] || 0, // Depth in km
						category: getCategory(props.mag || 0),
						lastUpdate: new Date(props.time || Date.now()).toISOString()
					});
				}
			});
		}

		// Sort earthquakes by intensity (magnitude) - highest first
		const sortedEarthquakes = sortByIntensity(earthquakes);

		return {
			earthquakes: sortedEarthquakes,
			timestamp: new Date().toISOString()
		};
	} catch (error) {
		console.error('Error fetching from USGS:', error);
		throw error;
	}
}

function generateMockData(): EarthquakeData {
	// Generate mock earthquake data as fallback
	const earthquakes: Earthquake[] = [
		{
			id: 'earthquake-001',
			name: 'Earthquake Sample',
			latitude: 35.0 + Math.random() * 10,
			longitude: 120 + Math.random() * 20,
			magnitude: 4.5 + Math.random() * 2.5,
			depth: 5 + Math.random() * 30,
			category: getCategory(4.5 + Math.random() * 2.5),
			lastUpdate: new Date().toISOString()
		},
		{
			id: 'earthquake-002',
			name: 'Seismic Event Beta',
			latitude: 40.0 + Math.random() * 5,
			longitude: 140 + Math.random() * 10,
			magnitude: 3.0 + Math.random() * 2.0,
			depth: 10 + Math.random() * 20,
			category: getCategory(3.0 + Math.random() * 2.0),
			lastUpdate: new Date().toISOString()
		}
	];

	return {
		earthquakes,
		timestamp: new Date().toISOString()
	};
}

function sortByIntensity(earthquakes: Earthquake[]): Earthquake[] {
	// Sort by magnitude (intensity) in descending order (highest first)
	// For earthquakes with the same magnitude, sort by most recent first
	return [...earthquakes].sort((a, b) => {
		// Primary sort: by magnitude (descending)
		if (Math.abs(a.magnitude - b.magnitude) > 0.01) {
			return b.magnitude - a.magnitude;
		}
		// Secondary sort: by time (most recent first)
		return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
	});
}

function getCategory(magnitude: number): string {
	if (magnitude < 3.0) return 'Minor';
	if (magnitude < 4.0) return 'Light';
	if (magnitude < 5.0) return 'Moderate';
	if (magnitude < 6.0) return 'Strong';
	if (magnitude < 7.0) return 'Major';
	return 'Great';
}
