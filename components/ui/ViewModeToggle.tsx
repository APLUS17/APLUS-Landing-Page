'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// View mode types
export type ViewMode = 'random' | 'grid' | 'list';

interface ViewModeOption {
  mode: ViewMode;
  icon: string;
  label: string;
  description: string;
}

const VIEW_MODES: ViewModeOption[] = [
  {
    mode: 'random',
    icon: '🟦',
    label: 'Random',
    description: 'Infinite pan view'
  },
  {
    mode: 'grid',
    icon: '🔳',
    label: 'Grid',
    description: 'Neatly arranged grid'
  },
  {
    mode: 'list',
    icon: '📄',
    label: 'List',
    description: 'Vertical list with metadata'
  }
];

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

// Individual Glass Button Component - Styled like the type button
function GlassButton({ 
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
        "px-4 py-2.5 rounded-8",
        "bg-fill-glass-secondary backdrop-blur-2xl",
        "border border-white/10",
        "text-white font-coinbase-display font-medium text-sm",
        "hover:bg-white/10 hover:border-white/20",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-white/20",
        isActive && "bg-white/10 border-white/20"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={`${option.label} - ${option.description}`}
    >
      <div className="flex items-center gap-2">
        {/* Icon */}
        <span className="text-sm leading-none">
          {option.icon}
        </span>
        
        {/* Label - hidden on mobile for space */}
        <span className={cn(
          "hidden sm:inline transition-colors",
          isActive ? "text-white" : "text-white/90"
        )}>
          {option.label}
        </span>
      </div>

      {/* Subtle gradient border effect - same as type button */}
      <div className="absolute inset-0 rounded-8 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </motion.button>
  );
}

export function ViewModeToggle({ currentMode, onModeChange, className }: ViewModeToggleProps) {
  
  const handleModeChange = (mode: ViewMode) => {
    onModeChange(mode);
    
    // Placeholder functionality - log the view mode change
    console.log(`View mode changed to: ${mode}`);
    
    // Here you would implement the actual view switching logic
    // For example:
    // - 'random': Show infinite pan gallery (current default)
    // - 'grid': Arrange artworks in a neat grid layout
    // - 'list': Show vertical list with detailed metadata
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {VIEW_MODES.map((option) => (
        <GlassButton
          key={option.mode}
          option={option}
          isActive={currentMode === option.mode}
          onClick={() => handleModeChange(option.mode)}
        />
      ))}
      
      {/* Optional: Current mode indicator for screen readers */}
      <div className="sr-only" aria-live="polite">
        Current view mode: {currentMode}
      </div>
    </div>
  );
}

// Export types for use in parent components
export type { ViewMode, ViewModeOption };