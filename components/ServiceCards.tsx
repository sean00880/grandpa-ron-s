'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
    Leaf,
    Scissors,
    TreeDeciduous,
    Shovel,
    Sprout,
    Sun,
    Fence,
    Snowflake,
    ArrowRight,
    Play,
    Eye,
    Star,
    Clock,
    ChevronRight,
    Sparkles,
} from 'lucide-react'

// Service data with gallery image previews and explicit Tailwind classes
const servicesData = [
    {
        id: 'mulching',
        title: 'Mulching',
        tagline: 'Protect & Beautify',
        description: 'Premium hardwood and decorative mulch installation for healthy, beautiful beds that retain moisture and suppress weeds.',
        icon: Leaf,
        iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
        taglineColor: 'text-emerald-600 dark:text-emerald-400',
        benefitBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800/30',
        ctaColor: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300',
        overlayGradient: 'from-emerald-950/60 to-green-950/60',
        glowColor: 'group-hover:shadow-emerald-500/10',
        images: ['/img/IMG_1974.JPG', '/img/IMG_1975.JPG', '/img/IMG_1979.JPG'],
        stats: { projects: '200+', rating: 4.9 },
        featured: false,
        benefits: ['Moisture Retention', 'Weed Control', 'Curb Appeal'],
    },
    {
        id: 'lawn-care',
        title: 'Lawn Mowing',
        tagline: 'Precision Maintenance',
        description: 'Professional weekly and bi-weekly mowing with precision striping patterns that make your lawn the envy of the neighborhood.',
        icon: Scissors,
        iconBg: 'bg-gradient-to-br from-green-500 to-lime-600',
        taglineColor: 'text-green-600 dark:text-green-400',
        benefitBg: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800/30',
        ctaColor: 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300',
        overlayGradient: 'from-green-950/60 to-lime-950/60',
        glowColor: 'group-hover:shadow-green-500/10',
        images: ['/img/IMG_1960.JPG', '/img/IMG_1971.JPG', '/img/IMG_1939.JPG'],
        stats: { projects: '500+', rating: 5.0 },
        featured: true,
        benefits: ['Weekly Service', 'Edge Trimming', 'Clean-up Included'],
    },
    {
        id: 'tree-service',
        title: 'Tree Service',
        tagline: 'Safe & Professional',
        description: 'Expert tree removal, pruning, and stump grinding services. View enhancement pruning and structural maintenance.',
        icon: TreeDeciduous,
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
        taglineColor: 'text-amber-600 dark:text-amber-400',
        benefitBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800/30',
        ctaColor: 'text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300',
        overlayGradient: 'from-amber-950/60 to-orange-950/60',
        glowColor: 'group-hover:shadow-amber-500/10',
        images: ['/img/IMG_1933.JPG', '/img/IMG_1962.JPG', '/img/IMG_1964.JPG'],
        stats: { projects: '150+', rating: 4.8 },
        featured: false,
        benefits: ['Pruning', 'Removal', 'Stump Grinding'],
    },
    {
        id: 'landscaping',
        title: 'Landscaping',
        tagline: 'Transform Your Space',
        description: 'Complete landscape design and installation. From flower beds to full property transformations with stunning curb appeal.',
        icon: Shovel,
        iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-600',
        taglineColor: 'text-teal-600 dark:text-teal-400',
        benefitBg: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-100 dark:border-teal-800/30',
        ctaColor: 'text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300',
        overlayGradient: 'from-teal-950/60 to-cyan-950/60',
        glowColor: 'group-hover:shadow-teal-500/10',
        images: ['/img/IMG_1950.JPG', '/img/IMG_1958.JPG', '/img/IMG_1983.JPG'],
        stats: { projects: '300+', rating: 4.9 },
        featured: true,
        benefits: ['Design', 'Installation', 'Plant Selection'],
    },
    {
        id: 'hardscaping',
        title: 'Hardscaping',
        tagline: 'Built to Last',
        description: 'Custom patios, walkways, retaining walls, and outdoor living spaces. Expert stone and paver installation.',
        icon: Fence,
        iconBg: 'bg-gradient-to-br from-slate-500 to-zinc-600',
        taglineColor: 'text-slate-600 dark:text-slate-400',
        benefitBg: 'bg-slate-50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800/30',
        ctaColor: 'text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
        overlayGradient: 'from-slate-950/60 to-zinc-950/60',
        glowColor: 'group-hover:shadow-slate-500/10',
        images: ['/img/IMG_1941.JPG', '/img/IMG_1946.JPG', '/img/IMG_1977.JPG'],
        stats: { projects: '100+', rating: 5.0 },
        featured: true,
        benefits: ['Patios', 'Retaining Walls', 'Walkways'],
    },
    {
        id: 'seasonal',
        title: 'Seasonal Cleanup',
        tagline: 'Year-Round Care',
        description: 'Spring and fall cleanup services including leaf removal, bed preparation, and property maintenance.',
        icon: Sun,
        iconBg: 'bg-gradient-to-br from-orange-500 to-red-600',
        taglineColor: 'text-orange-600 dark:text-orange-400',
        benefitBg: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-100 dark:border-orange-800/30',
        ctaColor: 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300',
        overlayGradient: 'from-orange-950/60 to-red-950/60',
        glowColor: 'group-hover:shadow-orange-500/10',
        images: ['/img/IMG_1982.JPG', '/img/IMG_1978.JPG', '/img/IMG_1981.JPG'],
        stats: { projects: '400+', rating: 4.9 },
        featured: false,
        benefits: ['Leaf Removal', 'Bed Prep', 'Gutter Cleaning'],
    },
]

// 3D Tilt Card Component
function ServiceCard({ service, index }: { service: typeof servicesData[0]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)
    const [activeImage, setActiveImage] = useState(0)

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

    const Icon = service.icon

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
            className={`group relative ${service.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
        >
            <div className="relative h-full overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg shadow-zinc-200/50 dark:shadow-black/20 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-300/50 dark:hover:shadow-black/40 hover:border-zinc-300/80 dark:hover:border-zinc-700/80">
                {/* Image Carousel Section */}
                <div className="relative h-52 overflow-hidden">
                    {/* Main Image */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image
                            src={service.images[activeImage]}
                            alt={service.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </motion.div>

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.overlayGradient} opacity-60`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Featured Badge */}
                    {service.featured && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-sm shadow-lg"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs font-medium text-zinc-800 dark:text-white">Popular</span>
                        </motion.div>
                    )}

                    {/* Image Navigation Dots */}
                    <div className="absolute bottom-4 left-4 flex gap-1.5">
                        {service.images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    activeImage === i
                                        ? 'bg-white w-6'
                                        : 'bg-white/50 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>

                    {/* View Gallery Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                        className="absolute bottom-4 right-4"
                    >
                        <Link
                            href={`/#gallery`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-sm text-xs font-medium text-zinc-800 dark:text-white shadow-lg hover:bg-white dark:hover:bg-black transition-colors"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            View Work
                        </Link>
                    </motion.div>

                    {/* Service Icon - Floating */}
                    <motion.div
                        animate={{
                            y: isHovered ? -8 : 0,
                            scale: isHovered ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className={`absolute -bottom-6 left-6 w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-zinc-900`}
                        style={{ transform: 'translateZ(30px)' }}
                    >
                        <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="relative pt-10 pb-6 px-6">
                    {/* Title & Tagline */}
                    <div className="mb-4">
                        <span
                            className={`text-xs font-medium tracking-wider uppercase ${service.taglineColor}`}
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {service.tagline}
                        </span>
                        <h3
                            className="mt-1 text-zinc-900 dark:text-white tracking-tight"
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-h3)',
                                fontWeight: 400,
                            }}
                        >
                            {service.title}
                        </h3>
                    </div>

                    {/* Description */}
                    <p
                        className="text-zinc-600 dark:text-zinc-400 mb-5 line-clamp-2"
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-sm)',
                            lineHeight: 1.7,
                        }}
                    >
                        {service.description}
                    </p>

                    {/* Benefits Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        {service.benefits.map((benefit, i) => (
                            <span
                                key={i}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${service.benefitBg}`}
                            >
                                {benefit}
                            </span>
                        ))}
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between pt-5 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-zinc-400" />
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">{service.stats.projects} Projects</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-medium text-zinc-800 dark:text-white">{service.stats.rating}</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <motion.div
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/quote"
                                className={`flex items-center gap-1 text-sm font-medium transition-colors ${service.ctaColor}`}
                            >
                                Get Quote
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// Main Services Section
export function ServiceCards() {
    return (
        <section id="services" className="relative py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
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
                        <Sprout className="w-4 h-4" />
                        <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                            Professional Services
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
                        Complete Landscaping{' '}
                        <span className="text-green-600 dark:text-green-400">Solutions</span>
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
                        From routine maintenance to complete property transformations, we deliver exceptional results backed by years of experience and hundreds of satisfied customers.
                    </motion.p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {servicesData.map((service, index) => (
                        <ServiceCard key={service.id} service={service} index={index} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <Link
                        href="/quote"
                        className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        <span>Get Your Free Quote</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                        No obligation • Free estimates • Same-day response
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

export default ServiceCards
