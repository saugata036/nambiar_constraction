import { ChevronRight } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';

export function Breadcrumb() {
  const { breadcrumbs } = useNavigation();

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500">
      {breadcrumbs.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="h-3 w-3 text-gray-400" />}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="transition-colors hover:text-gray-900"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-medium text-gray-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
