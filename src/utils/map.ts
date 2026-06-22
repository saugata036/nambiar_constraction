export interface MapCoordinates {
  lat: number;
  lon: number;
}

export const CITY_COORDINATES: Record<string, MapCoordinates> = {
  Bangalore: { lat: 12.9716, lon: 77.5946 },
  Mumbai: { lat: 19.076, lon: 72.8777 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Delhi: { lat: 28.6139, lon: 77.209 },
  Hyderabad: { lat: 17.385, lon: 78.4867 },
};

const DEFAULT_COORDINATES: MapCoordinates = { lat: 20.5937, lon: 78.9629 };

export function getCoordinatesForLocation(location?: string): MapCoordinates {
  if (!location) return DEFAULT_COORDINATES;
  return CITY_COORDINATES[location] ?? DEFAULT_COORDINATES;
}

export function getOpenStreetMapStaticUrl(
  lat: number,
  lon: number,
  width = 400,
  height = 200,
  zoom = 13
): string {
  const params = new URLSearchParams({
    center: `${lat},${lon}`,
    zoom: String(zoom),
    size: `${width}x${height}`,
    maptype: 'mapnik',
    markers: `${lat},${lon},red-pushpin`,
  });

  return `https://staticmap.openstreetmap.de/staticmap.php?${params.toString()}`;
}

export function getProjectMapImageUrl(location?: string, width = 400, height = 160): string {
  const { lat, lon } = getCoordinatesForLocation(location);
  return getOpenStreetMapStaticUrl(lat, lon, width, height);
}
