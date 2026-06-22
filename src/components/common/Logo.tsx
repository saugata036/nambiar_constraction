import logoIcon from '../../assets/nambiar-logo-color.svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'sidebar';
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-10 w-auto max-w-[140px]',
  hero: 'h-12 w-auto max-w-[180px]',
  sidebar: 'h-auto w-full max-w-[160px] max-h-[56px]',
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <img
      src={logoIcon}
      alt="Nambiar"
      className={`max-w-full object-contain ${sizeClasses[size]} ${className}`}
    />
  );
}
