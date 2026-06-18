import type { ReactNode } from 'react';

interface ListPageLayoutProps {
  filter: ReactNode;
  children: ReactNode;
}

export function ListPageLayout({ filter, children }: ListPageLayoutProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 bg-gray-50 pb-4">{filter}</div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden scrollbar-auto-hide">
        {children}
      </div>
    </div>
  );
}
