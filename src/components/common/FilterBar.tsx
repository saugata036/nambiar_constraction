import { ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

interface FilterBarProps {
  searchPlaceholder?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  statusOptions?: string[];
  showFilters?: boolean;
}

const DEFAULT_STATUS_OPTIONS = ['All Status', 'Planning', 'Under Construction', 'Completed'];

export function FilterBar({
  searchPlaceholder = 'Search for assets',
  searchQuery,
  onSearchChange,
  statusFilter = 'All Status',
  onStatusFilterChange,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  showFilters = true,
}: FilterBarProps) {
  const [statusOpen, setStatusOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
        {showFilters && onStatusFilterChange && (
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex min-w-[140px] items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {statusFilter}
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            {statusOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                <div className="absolute left-0 top-full z-20 mt-1 w-full min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        onStatusFilterChange(opt);
                        setStatusOpen(false);
                      }}
                      className="flex w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>
    </div>
  );
}
