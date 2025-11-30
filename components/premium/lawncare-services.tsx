'use client'

import { ArrowRight, Leaf, Scissors, TreeDeciduous, Shovel, Sprout, Sun, Fence, Droplets } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const services = [
    {
        icon: Leaf,
        title: 'Mulching',
        description: 'Premium hardwood and decorative mulch installation for healthy, beautiful beds.',
        featured: false,
    },
    {
        icon: Scissors,
        title: 'Lawn Mowing',
        description: 'Professional weekly and bi-weekly mowing with precision striping.',
        featured: true,
    },
    {
        icon: TreeDeciduous,
        title: 'Tree Removal',
        description: 'Safe, efficient tree removal and stump grinding services.',
        featured: false,
    },
    {
        icon: Shovel,
        title: 'Landscaping',
        description: 'Complete landscape design and installation for stunning curb appeal.',
        featured: true,
    },
    {
        icon: Sprout,
        title: 'Lawn Care',
        description: 'Fertilization, aeration, and overseeding for a lush, green lawn.',
        featured: false,
    },
    {
        icon: Sun,
        title: 'Seasonal Cleanup',
        description: 'Spring and fall cleanup including leaf removal and bed prep.',
        featured: false,
    },
    {
        icon: Fence,
        title: 'Hardscaping',
        description: 'Patios, walkways, retaining walls, and outdoor living spaces.',
        featured: true,
    },
    {
        icon: Droplets,
        title: 'Irrigation',
        description: 'Sprinkler system installation, repair, and winterization.',
        featured: false,
    },
]

export default function LawncareServices() {
    return (
        <section id="services" className="relative py-20 md:py-32 bg-white dark:bg-zinc-950 overflow-hidden">
            {/* Subtle background pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '32px 32px',
                }}
            />

            {/* Gradient accent */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-green-50/50 dark:from-green-950/20 to-transparent pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="relative z-10 mx-auto max-w-2xl text-center mb-16 md:mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="inline-block text-green-600 dark:text-green-400 text-sm font-normal tracking-widest uppercase mb-4"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        Our Services
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-balance text-zinc-900 dark:text-white tracking-tight"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-h1)',
                            fontWeight: 200,
                            lineHeight: 1.1,
                        }}
                    >
                        Complete Landscaping Solutions
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mt-4 text-zinc-600 dark:text-zinc-400 font-light"
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-body-lg)',
                            lineHeight: 1.7,
                        }}
                    >
                        From routine maintenance to complete property transformations, we deliver exceptional results.
                    </motion.p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {services.map((service, index) => {
                        const Icon = service.icon
                        const isLarge = service.featured

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                viewport={{ once: true, margin: '-50px' }}
                                className={`group relative ${isLarge ? 'md:col-span-2 md:row-span-1' : ''}`}
                            >
                                <div
                                    className={`relative h-full bg-zinc-50/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-5 md:p-6 transition-all duration-300 hover:border-green-500/30 dark:hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5 ${isLarge ? 'flex items-center gap-6' : ''}`}
                                >
                                    {/* Icon */}
                                    <div className={`flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 text-green-600 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-300 ${isLarge ? 'w-14 h-14 flex-shrink-0' : 'w-11 h-11 mb-4'}`}>
                                        <Icon className={isLarge ? 'size-7' : 'size-5'} strokeWidth={1.5} />
                                    </div>

                                    {/* Content */}
                                    <div className={isLarge ? 'flex-1' : ''}>
                                        <h3
                                            className="text-zinc-900 dark:text-white tracking-tight group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors"
                                            style={{
                                                fontFamily: 'var(--font-heading)',
                                                fontSize: isLarge ? 'var(--text-h4)' : 'var(--text-body)',
                                                fontWeight: 300,
                                            }}
                                        >
                                            {service.title}
                                        </h3>
                                        <p
                                            className="mt-2 text-zinc-500 dark:text-zinc-400 font-light leading-relaxed"
                                            style={{
                                                fontFamily: 'var(--font-body)',
                                                fontSize: 'var(--text-sm)',
                                            }}
                                        >
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Hover arrow indicator */}
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 md:mt-16"
                >
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-normal hover:text-green-700 dark:hover:text-green-300 transition-colors group"
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-body)',
                        }}
                    >
                        View All Services
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
