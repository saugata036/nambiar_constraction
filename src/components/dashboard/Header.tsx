import { Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-end">
      <button className="relative rounded-full border border-gray-200 bg-white p-1.5 text-gray-600 shadow-sm transition-colors hover:bg-gray-50">
        <Bell className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
          3
        </span>
      </button>
    </header>
  );
}
