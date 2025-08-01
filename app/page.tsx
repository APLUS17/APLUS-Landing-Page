import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">A+ Art Gallery</h1>
        <p className="text-gray-300 mb-8 max-w-md">
          Experience an infinite, pan-scroll gallery with floating artwork tiles. 
          Drag, scroll, and explore our curated collection.
        </p>
        <Link 
          href="/gallery"
          className="inline-block px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors"
        >
          Enter Gallery
        </Link>
      </div>
    </main>
  )
}