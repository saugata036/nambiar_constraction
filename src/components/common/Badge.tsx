import type { LevelStatus } from '../../types/project.types';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';

interface BadgeProps {
  status: LevelStatus | string;
  className?: string;
}

const customColors: Record<string, string> = {
  scheduled: 'bg-primary-100 text-primary-700',
  in_progress: 'bg-primary-100 text-primary-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

export function Badge({ status, className = '' }: BadgeProps) {
  const isLevelStatus = status in STATUS_COLORS;
  const colorClass = isLevelStatus
    ? STATUS_COLORS[status as LevelStatus]
    : customColors[status] || 'bg-gray-100 text-gray-700';

  const label = isLevelStatus
    ? STATUS_LABELS[status as LevelStatus]
    : status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${isLevelStatus ? colorClass : ''} ${!isLevelStatus ? colorClass : ''} ${className}`}
    >
      {label}
    </span>
  );
}
