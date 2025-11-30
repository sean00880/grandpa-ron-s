'use client'

import { useEffect, useState, useRef } from 'react'
import { Award, Users, Calendar, ThumbsUp } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

const stats = [
    {
        icon: Calendar,
        value: 40,
        suffix: '+',
        label: 'Years in Business',
        description: 'Serving Central Ohio since 1985',
    },
    {
        icon: Users,
        value: 10000,
        suffix: '+',
        label: 'Projects Completed',
        description: 'Residential and commercial',
    },
    {
        icon: Award,
        value: 24,
        suffix: '',
        label: 'Cities Served',
        description: 'Across Central Ohio region',
    },
    {
        icon: ThumbsUp,
        value: 98,
        suffix: '%',
        label: 'Satisfaction Rate',
        description: 'Customer referral rate',
    },
]

// Animated counter component
function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!inView) return

        const duration = 2000 // 2 seconds
        const steps = 60
        const stepDuration = duration / steps
        const increment = value / steps

        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= value) {
                setCount(value)
                clearInterval(timer)
            } else {
                setCount(Math.floor(current))
            }
        }, stepDuration)

        return () => clearInterval(timer)
    }, [value, inView])

    // Format large numbers
    const formatNumber = (num: number) => {
        if (num >= 10000) return `${(num / 1000).toFixed(0)}K`
        if (num >= 1000) return num.toLocaleString()
        return num.toString()
    }

    return (
        <span>{formatNumber(count)}{suffix}</span>
    )
}

export default function LawncareStats() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 dark:from-green-900 dark:via-green-950 dark:to-emerald-950" />

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large gradient orb */}
                <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-green-400/20 to-transparent blur-3xl" />
                <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-400/15 to-transparent blur-3xl" />

                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-6xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
                >
                    <span
                        className="inline-block text-green-200 text-sm font-normal tracking-widest uppercase mb-4"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        Our Track Record
                    </span>
                    <h2
                        className="text-white tracking-tight"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-h1)',
                            fontWeight: 200,
                            lineHeight: 1.1,
                        }}
                    >
                        Trusted by Thousands
                    </h2>
                    <p
                        className="mt-4 text-green-100/80 font-light"
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-body-lg)',
                            lineHeight: 1.7,
                        }}
                    >
                        Numbers that speak to our commitment to excellence and customer satisfaction.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative"
                            >
                                <div className="relative text-center p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                    {/* Subtle glow on hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Icon */}
                                    <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/10 mb-5">
                                        <Icon className="size-6 text-green-200" strokeWidth={1.5} />
                                    </div>

                                    {/* Value */}
                                    <div
                                        className="relative text-white mb-2"
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: 'var(--text-display)',
                                            fontWeight: 200,
                                            lineHeight: 1,
                                        }}
                                    >
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
                                    </div>

                                    {/* Label */}
                                    <div
                                        className="relative text-white/90 mb-1"
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: 'var(--text-body)',
                                            fontWeight: 300,
                                        }}
                                    >
                                        {stat.label}
                                    </div>

                                    {/* Description */}
                                    <div
                                        className="relative text-green-200/60 font-light"
                                        style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 'var(--text-sm)',
                                        }}
                                    >
                                        {stat.description}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
