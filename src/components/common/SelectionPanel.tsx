import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SelectionPanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function SelectionPanel({ title, subtitle, children }: SelectionPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
    >
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  );
}
