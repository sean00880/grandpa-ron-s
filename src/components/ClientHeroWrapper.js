'use client'

import dynamic from 'next/dynamic'

const HyperrealisticLandscape3DHero = dynamic(
  () => import('./HyperrealisticLandscape3DHero'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen bg-gradient-to-br from-black via-zinc-900 to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-emerald-400 font-heading text-lg">Loading Hyperrealistic Landscape...</p>
        </div>
      </div>
    )
  }
)

export default function ClientHeroWrapper() {
  return <HyperrealisticLandscape3DHero />
}