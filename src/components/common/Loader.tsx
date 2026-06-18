import { Logo } from './Logo';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  text?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'md' as const,
  md: 'lg' as const,
  lg: 'xl' as const,
  hero: 'hero' as const,
};

export function Loader({ size = 'md', text, fullScreen = false }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <Logo size={sizeMap[size]} className="animate-pulse" />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">{content}</div>
  );
}
