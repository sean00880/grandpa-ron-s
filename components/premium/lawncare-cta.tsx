'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Phone, Clock, MapPin, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LawncareCTA() {
    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Full-width gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900" />

            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-green-600/15 via-teal-500/10 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="relative mx-auto max-w-6xl px-6">
                {/* Glass-morphism card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
                >
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10" />

                    {/* Content */}
                    <div className="relative px-8 py-16 md:px-16 md:py-20">
                        <div className="text-center max-w-3xl mx-auto">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="inline-block text-green-400 text-sm font-normal tracking-widest uppercase mb-6"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Ready to Transform Your Property?
                            </motion.span>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="text-white tracking-tight mb-6"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-h1)',
                                    fontWeight: 200,
                                    lineHeight: 1.1,
                                }}
                            >
                                Get Your Free Quote Today
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="text-zinc-400 font-light mb-10"
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 'var(--text-body-lg)',
                                    lineHeight: 1.7,
                                }}
                            >
                                Join thousands of satisfied customers across Central Ohio.
                                Request a free, no-obligation quote and let us bring your vision to life.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                            >
                                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-0.5">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl px-8 font-normal shadow-lg shadow-green-500/25 border-0"
                                    >
                                        <Link href="/quote">
                                            <span>Request Free Quote</span>
                                            <ArrowRight className="ml-2 size-4" />
                                        </Link>
                                    </Button>
                                </div>

                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="rounded-xl px-8 border-white/20 text-white hover:bg-white/10 font-normal backdrop-blur-sm"
                                >
                                    <a href="tel:2206662520">
                                        <Phone className="mr-2 size-4" />
                                        <span>(220) 666-2520</span>
                                    </a>
                                </Button>
                            </motion.div>

                            {/* Info Cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto"
                            >
                                {[
                                    { icon: Clock, text: 'Mon-Sat: 7AM - 7PM' },
                                    { icon: MapPin, text: '24 Cities in Central Ohio' },
                                    { icon: CheckCircle, text: 'Free Estimates' },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm"
                                    >
                                        <item.icon className="size-4 text-green-400" strokeWidth={1.5} />
                                        <span
                                            className="text-zinc-300 font-light"
                                            style={{
                                                fontFamily: 'var(--font-body)',
                                                fontSize: 'var(--text-sm)',
                                            }}
                                        >
                                            {item.text}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mt-8 text-zinc-500 font-light"
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                    }}
                >
                    Family-owned & operated since 1985 • Serving generations of Central Ohio families
                </motion.p>
            </div>
        </section>
    )
}
