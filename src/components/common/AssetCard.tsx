import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ImageOff } from 'lucide-react';
import { ProjectMapPreview } from './ProjectMapPreview';
import { PhaseSitePreview } from './PhaseSitePreview';
import { TowerPreview } from './TowerPreview';
import { LevelPreview } from './LevelPreview';

export interface AssetCardMeta {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface AssetCardProps {
  image?: string;
  title: string;
  status?: string;
  statusLabel?: string;
  meta: AssetCardMeta[];
  onClick?: () => void;
  isActive?: boolean;
  isDimmed?: boolean;
  index?: number;
  mapLocation?: string;
  phaseOrder?: number;
  towerOrder?: number;
  levelOrder?: number;
}

export function AssetCard({
  image,
  title,
  status = 'active',
  statusLabel,
  meta,
  onClick,
  isActive = false,
  isDimmed = false,
  index = 0,
  mapLocation,
  phaseOrder,
  towerOrder,
  levelOrder,
}: AssetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: isDimmed ? 0.45 : 1,
        y: 0,
        scale: isActive ? 1.01 : 1,
      }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
        isActive
          ? 'border-primary-500 opacity-100 ring-2 ring-primary-500/30'
          : isDimmed
            ? 'border-gray-200 saturate-[0.65]'
            : 'border-gray-200'
      }`}
    >
      <div className="relative overflow-hidden bg-gray-100">
        {phaseOrder != null ? (
          <PhaseSitePreview phaseOrder={phaseOrder} className="h-24" />
        ) : towerOrder != null ? (
          <TowerPreview towerOrder={towerOrder} className="h-32" />
        ) : levelOrder != null ? (
          <LevelPreview levelOrder={levelOrder} className="h-24" />
        ) : mapLocation ? (
          <ProjectMapPreview location={mapLocation} className="h-24" />
        ) : image ? (
          <img
            src={image}
            alt={title}
            className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-24 flex-col items-center justify-center gap-1 text-gray-400">
            <ImageOff className="h-5 w-5" />
            <span className="text-[10px]">No Image</span>
          </div>
        )}
        <span className="absolute right-1.5 top-1.5 rounded-full bg-black/80 px-1.5 py-0.5 text-[9px] font-medium capitalize text-white">
          {statusLabel || status}
        </span>
      </div>

      <div className="space-y-1 p-2">
        <h3 className="truncate text-xs font-semibold text-gray-900">{title}</h3>
        <div className="flex flex-wrap gap-x-2.5 gap-y-0.5">
          {meta.slice(0, 2).map((item) => (
            <div key={item.label} className="flex min-w-0 items-center gap-1" title={`${item.label}: ${item.value}`}>
              <item.icon className="h-3 w-3 shrink-0 text-gray-400" />
              <span className="truncate text-[10px] text-gray-600">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
