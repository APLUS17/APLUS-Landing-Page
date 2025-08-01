# A+ Art Gallery - Infinite Discovery

A Next.js art portfolio site inspired by Base's discovery page, featuring an infinite pan-scroll gallery with floating artwork tiles.

## ✨ Features

- **Infinite Drag & Scroll**: Pan in any direction with smooth framer-motion animations
- **3D Art Cards**: Drop-shadowed cards with subtle 3D hover effects
- **Halftone Background**: Animated dark background with subtle dot patterns
- **Fixed Navigation**: Clean navbar with discovery and collect buttons
- **Keyboard Navigation**: Use arrow keys to nudge the canvas
- **Responsive Design**: Optimized for all screen sizes
- **TypeScript**: Fully typed for better development experience

## 🎮 Controls

- **Mouse**: Drag to pan around the gallery
- **Scroll**: Wheel to move vertically
- **Keyboard**: Arrow keys to nudge the canvas
- **Click**: Tap art cards to view details (placeholder)

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to see the landing page
4. Navigate to [http://localhost:3000/gallery](http://localhost:3000/gallery) for the main gallery experience

## 🖼️ Artwork Data

The gallery uses dummy artwork data from `data/artworks.json`. Each artwork includes:
- Title, artist, year, medium, dimensions
- High-quality Unsplash images
- Tags and pricing information
- Descriptions for future modal implementations

## 🏗️ Project Structure

```
├── app/
│   ├── gallery/page.tsx        # Main gallery page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/
│   └── ui/
│       └── InfiniteGallery.tsx # Main gallery component
├── data/
│   └── artworks.json          # Artwork data
├── lib/
│   └── utils.ts               # Utility functions
└── package.json
```

## 🎨 Components

### InfiniteGallery
- Main component with drag functionality
- Includes background animation and navigation
- Keyboard controls and responsive behavior

### ArtCard
- Individual artwork display
- 3D hover effects with drop shadows
- Click handlers for future modal integration

### HalftoneBackground
- Animated background with floating dots
- Subtle grid overlay
- Gradient background

### Navbar
- Fixed navigation with glassmorphism effect
- Discovery and collect buttons
- Responsive design

## 🔧 Built With

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Class Variance Authority** - Component variants

## 🚧 Future Enhancements

- Modal for artwork details
- Search and filtering
- User collections
- Artwork purchasing flow
- Social sharing
- Performance optimizations for larger datasets