import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable = false }: CardProps) {
  const Component = hoverable ? motion.div : 'div';
  const motionProps = hoverable
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`rounded-lg border border-gray-200 bg-surface p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  );
}
