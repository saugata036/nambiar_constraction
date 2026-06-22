import towerAImage from '../../assets/tower-a.png';
import towerBImage from '../../assets/tower-b.png';
import towerCImage from '../../assets/tower-c.png';

const TOWER_IMAGES: Record<number, string> = {
  1: towerAImage,
  2: towerBImage,
  3: towerCImage,
};

const DEFAULT_TOWER_IMAGE = towerAImage;

function getTowerImage(towerOrder: number): string {
  return TOWER_IMAGES[towerOrder] ?? DEFAULT_TOWER_IMAGE;
}

interface TowerPreviewProps {
  towerOrder: number;
  className?: string;
}

export function TowerPreview({ towerOrder, className = 'h-32' }: TowerPreviewProps) {
  const image = getTowerImage(towerOrder);

  return (
    <div className={`relative w-full overflow-hidden bg-gradient-to-b from-sky-100 to-sky-50 ${className}`}>
      <img
        src={image}
        alt="Tower"
        className="h-full w-full object-contain object-top transition-transform duration-300 group-hover:scale-[1.02]"
        loading="lazy"
      />
    </div>
  );
}
