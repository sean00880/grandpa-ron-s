'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

// Gallery images from /public/img
const galleryImages = [
    { src: '/img/IMG_1933.JPG', alt: 'Landscaping project 1', category: 'Landscaping' },
    { src: '/img/IMG_1934.JPG', alt: 'Landscaping project 2', category: 'Landscaping' },
    { src: '/img/IMG_1936.JPG', alt: 'Lawn care project 1', category: 'Lawn Care' },
    { src: '/img/IMG_1938.JPG', alt: 'Lawn care project 2', category: 'Lawn Care' },
    { src: '/img/IMG_1939.JPG', alt: 'Tree service 1', category: 'Tree Service' },
    { src: '/img/IMG_1941.JPG', alt: 'Tree service 2', category: 'Tree Service' },
    { src: '/img/IMG_1942.JPG', alt: 'Mulching project 1', category: 'Mulching' },
    { src: '/img/IMG_1943.JPG', alt: 'Mulching project 2', category: 'Mulching' },
    { src: '/img/IMG_1944.JPG', alt: 'Landscaping project 3', category: 'Landscaping' },
    { src: '/img/IMG_1945.JPG', alt: 'Landscaping project 4', category: 'Landscaping' },
    { src: '/img/IMG_1946.JPG', alt: 'Lawn care project 3', category: 'Lawn Care' },
    { src: '/img/IMG_1949.JPG', alt: 'Lawn care project 4', category: 'Lawn Care' },
    { src: '/img/IMG_1950.JPG', alt: 'Tree service 3', category: 'Tree Service' },
    { src: '/img/IMG_1951.JPG', alt: 'Tree service 4', category: 'Tree Service' },
    { src: '/img/IMG_1955.JPG', alt: 'Mulching project 3', category: 'Mulching' },
    { src: '/img/IMG_1956.JPG', alt: 'Mulching project 4', category: 'Mulching' },
    { src: '/img/IMG_1958.JPG', alt: 'Landscaping project 5', category: 'Landscaping' },
    { src: '/img/IMG_1959.JPG', alt: 'Landscaping project 6', category: 'Landscaping' },
    { src: '/img/IMG_1960.JPG', alt: 'Lawn care project 5', category: 'Lawn Care' },
    { src: '/img/IMG_1962.JPG', alt: 'Tree service 5', category: 'Tree Service' },
    { src: '/img/IMG_1964.JPG', alt: 'Tree service 6', category: 'Tree Service' },
    { src: '/img/IMG_1965.JPG', alt: 'Mulching project 5', category: 'Mulching' },
    { src: '/img/IMG_1968.JPG', alt: 'Landscaping project 7', category: 'Landscaping' },
    { src: '/img/IMG_1971.JPG', alt: 'Lawn care project 6', category: 'Lawn Care' },
    { src: '/img/IMG_1974.JPG', alt: 'Landscaping project 8', category: 'Landscaping' },
    { src: '/img/IMG_1975.JPG', alt: 'Landscaping project 9', category: 'Landscaping' },
    { src: '/img/IMG_1977.JPG', alt: 'Tree service 7', category: 'Tree Service' },
    { src: '/img/IMG_1978.JPG', alt: 'Mulching project 6', category: 'Mulching' },
    { src: '/img/IMG_1979.JPG', alt: 'Landscaping project 10', category: 'Landscaping' },
    { src: '/img/IMG_1981.JPG', alt: 'Lawn care project 7', category: 'Lawn Care' },
    { src: '/img/IMG_1982.JPG', alt: 'Landscaping project 11', category: 'Landscaping' },
    { src: '/img/IMG_1983.JPG', alt: 'Tree service 8', category: 'Tree Service' },
    { src: '/img/IMG_1984.JPG', alt: 'Mulching project 7', category: 'Mulching' },
    { src: '/img/IMG_1985.JPG', alt: 'Landscaping project 12', category: 'Landscaping' },
    { src: '/img/IMG_1986.jpg', alt: 'Landscaping project 13', category: 'Landscaping' },
]

const categories = ['All', 'Landscaping', 'Lawn Care', 'Tree Service', 'Mulching']

export const Gallery: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState<Record<number, boolean>>({})

    const filteredImages = selectedCategory === 'All'
        ? galleryImages
        : galleryImages.filter(img => img.category === selectedCategory)

    const openLightbox = (index: number) => {
        setLightboxIndex(index)
        document.body.style.overflow = 'hidden'
    }

    const closeLightbox = () => {
        setLightboxIndex(null)
        document.body.style.overflow = 'auto'
    }

    const goToPrevious = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1)
        }
    }

    const goToNext = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex(lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1)
        }
    }

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return
            if (e.key === 'Escape') closeLightbox()
            if (e.key === 'ArrowLeft') goToPrevious()
            if (e.key === 'ArrowRight') goToNext()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [lightboxIndex])

    return (
        <section id="gallery" className="relative py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <h2
                        className="text-zinc-900 dark:text-white mb-4 tracking-tight"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-h1)',
                            fontWeight: 300,
                        }}
                    >
                        Our <span className="text-green-600 dark:text-green-500">Work</span>
                    </h2>
                    <div className="w-20 h-1 bg-green-600 mx-auto mb-6 rounded-full" />
                    <p
                        className="text-zinc-600 dark:text-zinc-400"
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-body-lg)',
                            lineHeight: 1.7,
                        }}
                    >
                        Browse through our recent projects showcasing quality craftsmanship
                        across Central Ohio properties.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                selectedCategory === category
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
                                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-green-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
                            }`}
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {filteredImages.map((image, index) => (
                        <div
                            key={image.src}
                            onClick={() => openLightbox(index)}
                            className="group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden cursor-pointer bg-zinc-200 dark:bg-zinc-800"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                                    isLoading[index] ? 'opacity-0' : 'opacity-100'
                                }`}
                                onLoadStart={() => setIsLoading(prev => ({ ...prev, [index]: true }))}
                                onLoad={() => setIsLoading(prev => ({ ...prev, [index]: false }))}
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                                <span
                                    className="text-white text-sm font-medium"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    {image.category}
                                </span>
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <ZoomIn className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            {/* Loading Skeleton */}
                            {isLoading[index] && (
                                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700" />
                            )}
                        </div>
                    ))}
                </div>

                {/* View More CTA */}
                <div className="text-center mt-12">
                    <p
                        className="text-zinc-500 dark:text-zinc-400 mb-4"
                        style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}
                    >
                        Showing {filteredImages.length} of {galleryImages.length} projects
                    </p>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Previous Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); goToPrevious() }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); goToNext() }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image */}
                    <div
                        className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={filteredImages[lightboxIndex].src}
                            alt={filteredImages[lightboxIndex].alt}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                        />
                    </div>

                    {/* Image Counter */}
                    <div
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        {lightboxIndex + 1} / {filteredImages.length}
                    </div>
                </div>
            )}
        </section>
    )
}

export default Gallery
