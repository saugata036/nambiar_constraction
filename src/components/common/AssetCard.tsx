import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ImageOff } from 'lucide-react';

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
  index?: number;
}

export function AssetCard({
  image,
  title,
  status = 'active',
  statusLabel,
  meta,
  onClick,
  isActive = false,
  index = 0,
}: AssetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${
        isActive ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-200'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
            <ImageOff className="h-8 w-8" />
            <span className="text-sm">No Image</span>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-medium capitalize text-white">
          {statusLabel || status}
        </span>
      </div>

      <div className="space-y-2.5 p-4">
        {meta.map((item) => (
          <div key={item.label} className="flex items-start gap-2.5">
            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="truncate text-sm font-medium text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
