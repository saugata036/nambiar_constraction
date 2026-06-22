import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-full overflow-y-auto items-center justify-center bg-white p-3">
      {children}
    </div>
  );
}
