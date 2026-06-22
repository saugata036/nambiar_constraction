import phase3SiteImage from '../../assets/phase-3-construction-site.png';

/** Each phase: distinct construction-site photo + red circle work-zone marker. */
const PHASE_SITE_CONFIG: Record<
  number,
  { image: string; marker: { x: number; y: number } }
> = {
  1: {
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    marker: { x: 32, y: 40 },
  },
  2: {
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    marker: { x: 56, y: 52 },
  },
  3: {
    image: phase3SiteImage,
    marker: { x: 58, y: 42 },
  },
};

const DEFAULT_CONFIG = PHASE_SITE_CONFIG[1];

function getPhaseConfig(phaseOrder: number) {
  return PHASE_SITE_CONFIG[phaseOrder] ?? DEFAULT_CONFIG;
}

interface PhaseSitePreviewProps {
  phaseOrder: number;
  className?: string;
}

export function PhaseSitePreview({ phaseOrder, className = 'h-24' }: PhaseSitePreviewProps) {
  const { image, marker } = getPhaseConfig(phaseOrder);

  return (
    <div className={`relative w-full overflow-hidden bg-gray-200 ${className}`}>
      <img
        src={image}
        alt="Construction site"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />

      <div
        className="pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500 bg-red-500/20 shadow-[0_0_0_1px_rgba(255,255,255,0.6)]"
        style={{
          left: `${marker.x}%`,
          top: `${marker.y}%`,
          width: '22%',
        }}
      />
    </div>
  );
}
