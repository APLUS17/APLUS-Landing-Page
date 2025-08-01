'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// File type options
const FILE_TYPES = ['MP4', 'MOV', 'JPG', 'PNG'] as const;
type FileType = typeof FILE_TYPES[number];

interface FilterBarProps {
  selectedTypes: FileType[];
  onTypesChange: (types: FileType[]) => void;
  className?: string;
}

export function FilterBar({ selectedTypes, onTypesChange, className }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle file type selection
  const toggleType = (type: FileType) => {
    const newSelection = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    onTypesChange(newSelection);
    
    // Log for placeholder functionality
    console.log('Selected file types:', newSelection);
  };

  // Select all types
  const selectAll = () => {
    onTypesChange([...FILE_TYPES]);
  };

  // Clear all selections
  const clearAll = () => {
    onTypesChange([]);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Filter Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative overflow-hidden",
          "px-4 py-2.5 rounded-8",
          "bg-fill-glass-secondary backdrop-blur-2xl",
          "border border-white/10",
          "text-white font-coinbase-display font-medium text-sm",
          "hover:bg-white/10 hover:border-white/20",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-white/20",
          isOpen && "bg-white/10 border-white/20"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <span>type</span>
          {selectedTypes.length > 0 && (
            <div className="flex items-center justify-center w-5 h-5 bg-white/20 rounded-full">
              <span className="text-xs font-ibm-plex-mono">{selectedTypes.length}</span>
            </div>
          )}
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-white/70"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>

        {/* Subtle gradient border effect */}
        <div className="absolute inset-0 rounded-8 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute bottom-full mb-2 left-0 z-50",
              "min-w-[180px] p-2",
              "bg-fill-glass-secondary backdrop-blur-2xl",
              "border border-white/10 rounded-12",
              "shadow-2xl shadow-black/50"
            )}
          >
            {/* Header with actions */}
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-white/70 font-coinbase-display text-xs font-medium uppercase tracking-wider">
                File Types
              </span>
              <div className="flex gap-1">
                <button
                  onClick={selectAll}
                  className="text-xs text-white/50 hover:text-white/80 transition-colors font-ibm-plex-mono"
                >
                  all
                </button>
                <span className="text-white/30">|</span>
                <button
                  onClick={clearAll}
                  className="text-xs text-white/50 hover:text-white/80 transition-colors font-ibm-plex-mono"
                >
                  none
                </button>
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="space-y-1">
              {FILE_TYPES.map((type) => (
                <motion.label
                  key={type}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 rounded-8",
                    "hover:bg-white/5 cursor-pointer",
                    "transition-colors duration-150"
                  )}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Custom Checkbox */}
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "w-4 h-4 rounded border-2 transition-all duration-200",
                        selectedTypes.includes(type)
                          ? "bg-white border-white"
                          : "border-white/30 hover:border-white/50"
                      )}
                    >
                      {selectedTypes.includes(type) && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="text-black"
                        >
                          <path
                            d="M12 5L6.5 10.5L4 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      )}
                    </div>
                  </div>

                  {/* Type Label */}
                  <span className="text-white font-doto text-sm font-medium">
                    {type}
                  </span>

                  {/* File extension badge */}
                  <div className="ml-auto">
                    <div className="px-2 py-0.5 bg-white/10 rounded text-xs font-ibm-plex-mono text-white/60">
                      .{type.toLowerCase()}
                    </div>
                  </div>
                </motion.label>
              ))}
            </div>

            {/* Footer */}
            {selectedTypes.length > 0 && (
              <div className="mt-3 pt-2 border-t border-white/10">
                <div className="text-xs text-white/50 font-ibm-plex-mono text-center">
                  {selectedTypes.length} type{selectedTypes.length !== 1 ? 's' : ''} selected
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}