import { MapPin } from 'lucide-react';
import { getCoordinatesForLocation } from '../../utils/map';

interface ProjectMapPreviewProps {
  location?: string;
  className?: string;
  zoom?: number;
}

function lonToTileX(lon: number, zoom: number): number {
  return ((lon + 180) / 360) * Math.pow(2, zoom);
}

function latToTileY(lat: number, zoom: number): number {
  const latRad = (lat * Math.PI) / 180;
  return (
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, zoom)
  );
}

const TILE_SIZE = 256;

export function ProjectMapPreview({ location, className = 'h-20', zoom = 13 }: ProjectMapPreviewProps) {
  const { lat, lon } = getCoordinatesForLocation(location);
  const centerTileX = Math.floor(lonToTileX(lon, zoom));
  const centerTileY = Math.floor(latToTileY(lat, zoom));
  const xFrac = lonToTileX(lon, zoom) - centerTileX;
  const yFrac = latToTileY(lat, zoom) - centerTileY;

  const pinX = TILE_SIZE + xFrac * TILE_SIZE;
  const pinY = TILE_SIZE + yFrac * TILE_SIZE;
  const gridSize = TILE_SIZE * 3;

  const tiles: { x: number; y: number; key: string }[] = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      const x = centerTileX + dx;
      const y = centerTileY + dy;
      tiles.push({ x, y, key: `${x}-${y}` });
    }
  }

  return (
    <div className={`relative w-full overflow-hidden bg-[#e8e0d8] ${className}`}>
      <div
        className="absolute"
        style={{
          width: gridSize,
          height: gridSize,
          left: `calc(50% - ${pinX}px)`,
          top: `calc(50% - ${pinY}px)`,
        }}
      >
        <div
          className="grid grid-cols-3"
          style={{ width: gridSize, height: gridSize }}
        >
          {tiles.map((tile) => (
            <img
              key={tile.key}
              src={`https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`}
              alt=""
              width={TILE_SIZE}
              height={TILE_SIZE}
              className="block"
              loading="lazy"
              draggable={false}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <MapPin className="h-5 w-5 fill-red-500 text-red-600 drop-shadow-md" />
      </div>
    </div>
  );
}
