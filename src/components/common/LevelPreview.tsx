import levelFloor2Image from '../../assets/level-floor-2.png';

/** Building floor / interior images for level cards. */
const LEVEL_FLOOR_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
  2: levelFloor2Image,
  3: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
};

const DEFAULT_FLOOR_IMAGE = levelFloor2Image;

function getLevelFloorImage(levelOrder: number): string {
  return LEVEL_FLOOR_IMAGES[levelOrder] ?? DEFAULT_FLOOR_IMAGE;
}

interface LevelPreviewProps {
  levelOrder: number;
  className?: string;
}

export function LevelPreview({ levelOrder, className = 'h-24' }: LevelPreviewProps) {
  const image = getLevelFloorImage(levelOrder);

  return (
    <div className={`relative w-full overflow-hidden bg-gray-100 ${className}`}>
      <img
        src={image}
        alt="Building floor"
        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}
