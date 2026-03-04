# 🌍 Quake Watch - Global Earthquake Monitoring App

A real-time global earthquake monitoring application built with Svelte, featuring interactive maps and live statistics.

## Features

- 🗺️ **Interactive Map View**: Real-time visualization of earthquakes on an interactive map
- 📊 **Live Statistics**: Monitor magnitude, depth, and location data for each earthquake
- 🔄 **Auto-refresh**: Automatic data updates every 5 minutes
- 📍 **Earthquake Tracking**: Historical earthquake data with location markers
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Svelte 5 + SvelteKit
- **Maps**: Leaflet (OpenStreetMap)
- **Styling**: Tailwind CSS
- **Data Source**: USGS Earthquake Hazards Program API (with fallback to mock data)
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quake-watch
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
quake-watch/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── EarthquakeMap.svelte      # Map component with Leaflet
│   │   │   └── StatisticsPanel.svelte # Statistics display
│   │   ├── services/
│   │   │   └── earthquakeApi.ts         # Earthquake data API service
│   │   └── types.ts                 # TypeScript type definitions
│   └── routes/
│       ├── +layout.svelte           # App layout
│       └── +page.svelte             # Main page
├── package.json
└── README.md
```

## Data Source

The app fetches earthquake data from:
- **Primary**: USGS Earthquake Hazards Program API (free, no API key required)
- **Fallback**: Mock data generator (if API is unavailable)

The app automatically polls for updates every 5 minutes.

## API Integration

The app uses USGS's free earthquake data API. To integrate with a different API:

1. **Update the API service**:
   - Modify `src/lib/services/earthquakeApi.ts`
   - Update the `fetchFromUSGS()` function or create a new fetch function
   - Ensure the data is transformed to match the `EarthquakeData` interface

2. **Recommended APIs**:
   - [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/) - Free, no API key
   - [EMSC (European-Mediterranean Seismological Centre)](https://www.emsc-csem.org/) - Free API available
   - [IRIS (Incorporated Research Institutions for Seismology)](https://www.iris.edu/) - Free data access

Example integration:

```typescript
export async function fetchEarthquakeData(): Promise<EarthquakeData> {
  const response = await fetch('https://api.example.com/earthquakes');
  const data = await response.json();
  // Transform API response to match EarthquakeData interface
  return transformApiData(data);
}
```

## Features in Detail

### Earthquake Visualization

- **Earthquake icons**: Custom SVG icons color-coded by magnitude category
- **Size-based markers**: Marker size reflects earthquake magnitude
- **Interactive popups**: Click markers for detailed information

### Statistics Panel

- Real-time earthquake statistics
- Magnitude classification (Minor, Light, Moderate, Strong, Major, Great)
- Magnitude and depth monitoring
- Location coordinates
- List of all active earthquakes (clickable to navigate map)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type check with svelte-check

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `build` directory to your hosting service (Vercel, Netlify, etc.)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Notes

- The app uses USGS's free API which may have rate limits
- If the API is unavailable, the app falls back to mock data
- Map tiles are provided by OpenStreetMap (free, no API key required)
- Data updates automatically every 5 minutes
