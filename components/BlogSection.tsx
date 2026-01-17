'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
    ArrowRight,
    BookOpen,
    Calendar,
    Clock,
    Leaf,
    User,
} from 'lucide-react'

// Blog post data - using actual images from /img directory
const blogPosts = [
    {
        slug: 'spring-lawn-preparation-guide',
        title: 'Complete Spring Lawn Preparation Guide',
        excerpt: 'Get your lawn ready for the growing season with our comprehensive spring preparation checklist.',
        category: 'Seasonal Guides',
        categorySlug: 'seasonal-guides',
        date: 'March 15, 2024',
        readTime: '8 min read',
        image: '/img/grass.jpg',
        author: 'Grandpa Ron',
        featured: true,
    },
    {
        slug: 'best-grass-types-kentucky',
        title: 'Best Grass Types for Ohio Lawns',
        excerpt: 'Discover which grass varieties thrive in Ohio\'s climate and how to choose the right one for your yard.',
        category: 'Lawn Care Tips',
        categorySlug: 'lawn-care-tips',
        date: 'March 10, 2024',
        readTime: '6 min read',
        image: '/img/IMG_1960.JPG',
        author: 'Grandpa Ron',
        featured: false,
    },
    {
        slug: 'diy-garden-bed-edging',
        title: 'DIY Garden Bed Edging Ideas',
        excerpt: 'Transform your garden beds with these creative and budget-friendly edging projects you can do yourself.',
        category: 'DIY Projects',
        categorySlug: 'diy-projects',
        date: 'March 5, 2024',
        readTime: '10 min read',
        image: '/img/IMG_1974.JPG',
        author: 'Grandpa Ron',
        featured: false,
    },
    {
        slug: 'lawn-mowing-height-guide',
        title: 'The Ultimate Lawn Mowing Height Guide',
        excerpt: 'Learn the optimal mowing heights for different grass types and seasons to keep your lawn healthy.',
        category: 'Lawn Care Tips',
        categorySlug: 'lawn-care-tips',
        date: 'February 28, 2024',
        readTime: '5 min read',
        image: '/img/IMG_1971.JPG',
        author: 'Grandpa Ron',
        featured: false,
    },
]

// 3D Tilt Blog Card Component
function BlogCard({ post, index, featured = false }: { post: typeof blogPosts[0]; index: number; featured?: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    // 3D tilt effect
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set((e.clientX - centerX) / rect.width)
        y.set((e.clientY - centerY) / rect.height)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
        setIsHovered(false)
    }

    if (featured) {
        // Featured Article Card (Horizontal Layout)
        return (
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: '-50px' }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                className="group relative col-span-full"
            >
                <div className="relative h-full overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg shadow-zinc-200/50 dark:shadow-black/20 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-300/50 dark:hover:shadow-black/40 hover:border-zinc-300/80 dark:hover:border-zinc-700/80">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative h-64 md:h-full overflow-hidden">
                            <motion.div
                                className="absolute inset-0"
                                animate={{ scale: isHovered ? 1.05 : 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </motion.div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 to-emerald-950/60 opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {/* Category Badge */}
                            <div className="absolute top-6 left-6">
                                <span className="px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium shadow-lg">
                                    {post.category}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="relative p-8 md:p-10 flex flex-col justify-center">
                            <div className="mb-4">
                                <span
                                    className="text-xs font-medium tracking-wider uppercase text-green-600 dark:text-green-400"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    Featured Article
                                </span>
                                <h3
                                    className="mt-2 text-zinc-900 dark:text-white tracking-tight"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                                        fontWeight: 400,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {post.title}
                                </h3>
                            </div>

                            <p
                                className="text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-3"
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 'var(--text-body)',
                                    lineHeight: 1.7,
                                }}
                            >
                                {post.excerpt}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center gap-6 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{post.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{post.readTime}</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
                                    >
                                        Read Full Article
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    // Regular Article Card (Vertical Layout)
    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, margin: '-50px' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            className="group relative"
        >
            <div className="relative h-full overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg shadow-zinc-200/50 dark:shadow-black/20 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-300/50 dark:hover:shadow-black/40 hover:border-zinc-300/80 dark:hover:border-zinc-700/80">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                    <motion.div
                        className="absolute inset-0"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </motion.div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 to-emerald-950/60 opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-full bg-green-600 text-white text-xs font-medium shadow-lg">
                            {post.category}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="relative p-6">
                    <h3
                        className="mb-3 text-zinc-900 dark:text-white tracking-tight line-clamp-2"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-h4)',
                            fontWeight: 400,
                            lineHeight: 1.3,
                        }}
                    >
                        {post.title}
                    </h3>

                    <p
                        className="text-zinc-600 dark:text-zinc-400 mb-5 line-clamp-2"
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-sm)',
                            lineHeight: 1.6,
                        }}
                    >
                        {post.excerpt}
                    </p>

                    {/* Meta Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>

                        {/* Read More Link */}
                        <motion.div
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={`/blog/${post.slug}`}
                                className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                            >
                                Read
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// Main Blog Section
export function BlogSection() {
    const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0]
    const regularPosts = blogPosts.filter(post => !post.featured).slice(0, 3)

    return (
        <section id="blog" className="relative py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/40 via-transparent to-transparent dark:from-green-900/10" />
            <div
                className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="relative z-10 mx-auto max-w-3xl text-center mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 mb-6"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                            Latest Insights
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-zinc-900 dark:text-white tracking-tight"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: 200,
                            lineHeight: 1.1,
                        }}
                    >
                        Lawn Care Tips &{' '}
                        <span className="text-green-600 dark:text-green-400">Expert Advice</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mt-5 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-body-lg)',
                            lineHeight: 1.7,
                        }}
                    >
                        Expert tips, seasonal guides, and DIY projects to help you maintain a beautiful, healthy lawn year-round.
                    </motion.p>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                    {/* Featured Article (Full Width) */}
                    <BlogCard post={featuredPost} index={0} featured={true} />

                    {/* Regular Articles (3 columns) */}
                    {regularPosts.map((post, index) => (
                        <BlogCard key={post.slug} post={post} index={index + 1} />
                    ))}
                </div>

                {/* View All Articles CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/blog"
                        className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        <span>View All Articles</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                        Discover more lawn care tips and seasonal guides
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

export default BlogSection
