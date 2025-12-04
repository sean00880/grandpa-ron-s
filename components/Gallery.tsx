'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn, Tag } from 'lucide-react'
import { galleryImages } from '@/data/galleryData'
import { getUniqueCategories, filterImagesByCategory } from '@/data/taxonomyRegistry'

// Get unique categories from all images (with multi-category support)
const categories = ['All', 'Landscaping', 'Lawn Care', 'Tree Service', 'Mulching', 'Hardscaping']

export const Gallery: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState<Record<number, boolean>>({})

    // Multi-category filtering - images appear in ALL categories they belong to
    const filteredImages = useMemo(() => {
        if (selectedCategory === 'All') return galleryImages
        return galleryImages.filter(img =>
            img.tags.displayCategories.includes(selectedCategory)
        )
    }, [selectedCategory])

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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-4">
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {image.tags.displayCategories.slice(0, 3).map((cat) => (
                                        <span
                                            key={cat}
                                            className="px-2 py-0.5 bg-green-600/90 text-white text-xs font-medium rounded-full"
                                            style={{ fontFamily: 'var(--font-body)' }}
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                    {image.tags.displayCategories.length > 3 && (
                                        <span className="px-2 py-0.5 bg-white/30 text-white text-xs rounded-full">
                                            +{image.tags.displayCategories.length - 3}
                                        </span>
                                    )}
                                </div>
                                <div className="w-full flex items-center justify-between">
                                    <span
                                        className="text-white text-sm font-medium truncate max-w-[70%]"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {image.title || image.alt}
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <ZoomIn className="w-5 h-5 text-white" />
                                    </div>
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

                    {/* Image Info & Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        {/* Category Tags */}
                        <div className="flex flex-wrap justify-center gap-1">
                            {filteredImages[lightboxIndex].tags.displayCategories.map((cat) => (
                                <span
                                    key={cat}
                                    className="px-3 py-1 bg-green-600/90 text-white text-xs font-medium rounded-full"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                        {/* Title */}
                        {filteredImages[lightboxIndex].title && (
                            <p
                                className="text-white text-sm max-w-md text-center"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                {filteredImages[lightboxIndex].title}
                            </p>
                        )}
                        {/* Counter */}
                        <div
                            className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {lightboxIndex + 1} / {filteredImages.length}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Gallery
