import React from 'react';

const accentStyles = {
  green: { label: 'text-phosphor/60', border: 'border-grid' },
  magenta: { label: 'text-magenta/70', border: 'border-magenta/30' },
  yellow: { label: 'text-caution/70', border: 'border-caution/30' },
} as const;

interface TerminalPanelProps {
  label: string;
  accent?: keyof typeof accentStyles;
  className?: string;
  children: React.ReactNode;
}

export default function TerminalPanel({ label, accent = 'green', className = '', children }: TerminalPanelProps) {
  const styles = accentStyles[accent];
  return (
    <div className={`relative border ${styles.border} bg-bg-panel p-6 ${className}`}>
      <span className={`absolute -top-[8px] left-4 px-2 bg-bg-panel font-mono text-[9px] tracking-[0.3em] uppercase ${styles.label}`}>
        {label}
      </span>
      {children}
    </div>
  );
}
