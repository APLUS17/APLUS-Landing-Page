'use client';

import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  wrap,
} from "framer-motion";
import {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
  useCallback,
} from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import artworks from "@/data/artworks.json";
import { FilterBar } from "./FilterBar";
import { ViewModeToggle, type ViewMode } from "./ViewModeToggle";

// Types
type Artwork = {
  id: number;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  imageUrl: string;
  tags: string[];
  price: string;
};

type variants = "default" | "masonry" | "polaroid";

// Create Context
const GridVariantContext = createContext<variants | undefined>(undefined);

// Motion Variants
const rowVariants = {
  initial: { opacity: 0, scale: 0.3 },
  animate: () => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: Math.random() + 1.5,
      duration: 1.4,
      ease: cubicBezier(0.18, 0.71, 0.11, 1),
    },
  }),
};

// Background Animation Component
const HalftoneBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Animated halftone dots */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

// Fixed Navbar Component
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="flex justify-between items-center">
        <motion.button
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>&lt;</span>
          <span>discovery</span>
        </motion.button>
        
        <motion.button
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>collect</span>
          <span>↗</span>
        </motion.button>
      </div>
    </nav>
  );
};

// Art Card Component
const ArtCard = ({ artwork, onClick }: { artwork: Artwork; onClick: () => void }) => {
  return (
    <motion.div
      className="relative group cursor-pointer"
      whileHover={{ 
        scale: 1.05,
        rotateX: 5,
        rotateY: 5,
        z: 50
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ perspective: 1000 }}
    >
      {/* Drop shadow */}
      <div className="absolute inset-0 bg-black/20 rounded-lg blur-xl translate-y-4 group-hover:translate-y-6 transition-transform duration-300" />
      
      {/* Card content */}
      <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Card info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold text-sm mb-1">{artwork.title}</h3>
          <p className="text-white/70 text-xs">{artwork.artist}, {artwork.year}</p>
          <p className="text-white/60 text-xs mt-1">{artwork.price}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Draggable Container Component
export const DraggableContainer = ({
  className,
  children,
  variant = "masonry",
}: {
  className?: string;
  children: React.ReactNode;
  variant?: variants;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleIsDragging = () => setIsDragging(true);
  const handleIsNotDragging = () => setIsDragging(false);

  // Keyboard navigation
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (isDragging) return;
    
    const moveAmount = 100;
    switch (event.key) {
      case 'ArrowLeft':
        animate(x, x.get() + moveAmount, { duration: 0.5, ease: "easeOut" });
        break;
      case 'ArrowRight':
        animate(x, x.get() - moveAmount, { duration: 0.5, ease: "easeOut" });
        break;
      case 'ArrowUp':
        animate(y, y.get() + moveAmount, { duration: 0.5, ease: "easeOut" });
        break;
      case 'ArrowDown':
        animate(y, y.get() - moveAmount, { duration: 0.5, ease: "easeOut" });
        break;
    }
  }, [x, y, isDragging]);

  useEffect(() => {
    const container = ref.current?.getBoundingClientRect();
    if (!container) return;

    const { width, height } = container;

    const xDrag = x.on("change", (latest) => {
      const wrappedX = wrap(-(width / 2), 0, latest);
      x.set(wrappedX);
    });

    const yDrag = y.on("change", (latest) => {
      const wrappedY = wrap(-(height / 2), 0, latest);
      y.set(wrappedY);
    });

    const handleWheelScroll = (event: WheelEvent) => {
      if (!isDragging) {
        animate(y, y.get() - event.deltaY * 2.7, {
          type: "tween",
          duration: 1.2,
          ease: cubicBezier(0.18, 0.71, 0.11, 1),
        });
      }
    };

    window.addEventListener("wheel", handleWheelScroll);
    window.addEventListener("keydown", handleKeyPress);
    
    return () => {
      xDrag();
      yDrag();
      window.removeEventListener("wheel", handleWheelScroll);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [x, y, isDragging, handleKeyPress]);

  return (
    <GridVariantContext.Provider value={variant}>
      <div className="h-dvh overflow-hidden">
        <HalftoneBackground />
        <Navbar />
        <motion.div className="h-dvh overflow-hidden">
          <motion.div
            className={cn(
              "grid h-fit w-fit cursor-grab grid-cols-[repeat(2,1fr)] active:cursor-grabbing will-change-transform relative z-10",
              className,
            )}
            drag
            dragMomentum={true}
            dragTransition={{
              timeConstant: 200,
              power: 0.28,
              restDelta: 0,
              bounceStiffness: 0,
            }}
            onMouseDown={handleIsDragging}
            onMouseUp={handleIsNotDragging}
            onMouseLeave={handleIsNotDragging}
            style={{ x, y }}
            ref={ref}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </GridVariantContext.Provider>
  );
};

// Grid Item Component
export const GridItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const variant = useContext(GridVariantContext);

  const gridItemStyles = cva(
    "overflow-hidden hover:cursor-pointer w-full h-full will-change-transform",
    {
      variants: {
        variant: {
          default: "rounded-sm",
          masonry: "even:mt-[60%] rounded-sm",
          polaroid:
            "border-10 border-b-28 border-white shadow-xl even:rotate-3 odd:-rotate-2 hover:rotate-0 transition-transform ease-out duration-300 even:mt-[60%]",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    },
  );

  return (
    <motion.div
      className={cn(gridItemStyles({ variant, className }))}
      variants={rowVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

// Grid Body Component
export const GridBody = memo(
  ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const variant = useContext(GridVariantContext);

    const gridBodyStyles = cva("grid grid-cols-[repeat(6,1fr)] h-fit w-fit", {
      variants: {
        variant: {
          default: "gap-14 p-7 md:gap-28 md:p-14",
          masonry: "gap-x-14 px-7 md:gap-x-28 md:px-14",
          polaroid: "gap-x-14 px-7 md:gap-x-28 md:px-14",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    });

    return (
      <>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={cn(gridBodyStyles({ variant, className }))}
          >
            {children}
          </div>
        ))}
      </>
    );
  },
);

GridBody.displayName = "GridBody";

// Main InfiniteGallery Component
const InfiniteGallery = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  
  // UI Controls State
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(['MP4', 'MOV', 'JPG', 'PNG']);
  const [viewMode, setViewMode] = useState<ViewMode>('random');

  const handleArtworkClick = (artwork: Artwork) => {
    console.log("Opening artwork:", artwork.title);
    setSelectedArtwork(artwork);
  };

  // Placeholder: Filter artworks based on selected file types
  // In a real implementation, you would have file type data in your artworks
  const filteredArtworks = artworks.filter(artwork => {
    // For demo purposes, assume all artworks match selected types
    // In reality, you'd check artwork.fileType against selectedFileTypes
    return selectedFileTypes.length === 0 || selectedFileTypes.length > 0;
  });

  return (
    <>
      <DraggableContainer variant="masonry">
        <GridBody>
          {filteredArtworks.map((artwork) => (
            <GridItem
              key={artwork.id}
              className="relative h-54 w-36 md:h-96 md:w-64"
            >
              <ArtCard 
                artwork={artwork} 
                onClick={() => handleArtworkClick(artwork)}
              />
            </GridItem>
          ))}
        </GridBody>
      </DraggableContainer>

      {/* UI Controls - Positioned outside the draggable container */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {/* FilterBar - Bottom Left */}
        <div className="absolute bottom-6 left-6 pointer-events-auto">
          <FilterBar
            selectedTypes={selectedFileTypes}
            onTypesChange={setSelectedFileTypes}
          />
        </div>

        {/* ViewModeToggle - Bottom Right */}
        <div className="absolute bottom-6 right-6 pointer-events-auto">
          <ViewModeToggle
            currentMode={viewMode}
            onModeChange={setViewMode}
          />
        </div>
      </div>
    </>
  );
};

export default InfiniteGallery;