'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Grid2X2, LayoutGrid, List } from 'lucide-react';

// View mode types
export type ViewMode = 'random' | 'grid' | 'list';

interface ViewModeOption {
  mode: ViewMode;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const VIEW_MODES: ViewModeOption[] = [
  {
    mode: 'random',
    icon: <Grid2X2 size={16} />,
    label: 'Random',
    description: 'Infinite pan view'
  },
  {
    mode: 'grid',
    icon: <LayoutGrid size={16} />,
    label: 'Grid',
    description: 'Neatly arranged grid'
  },
  {
    mode: 'list',
    icon: <List size={16} />,
    label: 'List',
    description: 'Vertical list with metadata'
  }
];

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

// Individual Circular Glass Button
function CircularGlassButton({ 
  option, 
  isActive, 
  onClick 
}: { 
  option: ViewModeOption; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden",
        "h-10 w-10 rounded-full",
        "backdrop-blur-2xl",
        "border border-white/10",
        "flex items-center justify-center",
        "text-white/70 hover:text-white",
        "hover:bg-white/10 hover:border-white/20",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-white/20",
        isActive 
          ? "bg-white/10 border-white/20 text-white" 
          : "bg-[rgba(43,43,43,0.8)]"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`${option.label} - ${option.description}`}
    >
      {option.icon}

      {/* Active glow effect */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-full bg-white/5 shadow-lg shadow-white/10"
        />
      )}

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </motion.button>
  );
}

export function ViewModeToggle({ currentMode, onModeChange, className }: ViewModeToggleProps) {
  
  const handleModeChange = (mode: ViewMode) => {
    onModeChange(mode);
    console.log(`View mode changed to: ${mode}`);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {VIEW_MODES.map((option) => (
        <CircularGlassButton
          key={option.mode}
          option={option}
          isActive={currentMode === option.mode}
          onClick={() => handleModeChange(option.mode)}
        />
      ))}
      
      {/* Screen reader support */}
      <div className="sr-only" aria-live="polite">
        Current view mode: {currentMode}
      </div>
    </div>
  );
}

// Export types for use in parent components
export type { ViewMode, ViewModeOption };