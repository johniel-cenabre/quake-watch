export interface Earthquake {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	magnitude: number; // Richter scale
	depth: number; // in kilometers
	category: string; // Minor, Light, Moderate, Strong, Major, Great
	lastUpdate: string;
}

export interface EarthquakeData {
	earthquakes: Earthquake[];
	timestamp: string;
}
