'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with framer-motion
const InfiniteGallery = dynamic(
  () => import('@/components/ui/InfiniteGallery'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading gallery...</div>
      </div>
    )
  }
);

export default function GalleryPage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <InfiniteGallery />
    </main>
  );
}