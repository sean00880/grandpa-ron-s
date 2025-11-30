'use client'

import { FileText, Calendar, CheckCircle2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const steps = [
    {
        number: '01',
        icon: FileText,
        title: 'Request a Quote',
        description: 'Fill out our simple online form or give us a call. We\'ll discuss your needs and schedule a free consultation.',
    },
    {
        number: '02',
        icon: Calendar,
        title: 'Schedule Service',
        description: 'We\'ll visit your property, provide a detailed estimate, and schedule your service at a convenient time.',
    },
    {
        number: '03',
        icon: CheckCircle2,
        title: 'Enjoy Results',
        description: 'Our expert team completes your project with precision. Sit back and enjoy your beautiful outdoor space.',
    },
]

export default function LawncareHowItWorks() {
    return (
        <section id="how-it-works" className="relative py-24 md:py-32 bg-white dark:bg-zinc-950 overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 dark:from-zinc-900/30 via-transparent to-green-50/30 dark:to-green-950/10 pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-zinc-900/10">
                            <Image
                                src="https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop"
                                alt="Professional landscaping team at work"
                                width={600}
                                height={700}
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        </div>

                        {/* Floating stat card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="absolute -bottom-6 -right-6 bg-white dark:bg-zinc-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-zinc-200/50 dark:border-zinc-700/50"
                        >
                            <div
                                className="text-green-600 dark:text-green-400"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-h2)',
                                    fontWeight: 200,
                                }}
                            >
                                40+
                            </div>
                            <div
                                className="text-zinc-600 dark:text-zinc-400 font-light"
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                Years of Excellence
                            </div>
                        </motion.div>

                        {/* Decorative element */}
                        <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 blur-2xl" />
                    </motion.div>

                    {/* Content Side */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <span
                                className="inline-block text-green-600 dark:text-green-400 text-sm font-normal tracking-widest uppercase"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                How It Works
                            </span>
                            <h2
                                className="text-zinc-900 dark:text-white tracking-tight"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-h1)',
                                    fontWeight: 200,
                                    lineHeight: 1.1,
                                }}
                            >
                                Getting started is{' '}
                                <span className="text-green-600 dark:text-green-400">simple</span>
                            </h2>
                            <p
                                className="text-zinc-600 dark:text-zinc-400 font-light"
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 'var(--text-body-lg)',
                                    lineHeight: 1.7,
                                }}
                            >
                                We&apos;ve streamlined our process to make working with us easy and stress-free.
                                From your first call to project completion, we&apos;re with you every step.
                            </p>
                        </motion.div>

                        {/* Steps */}
                        <div className="space-y-4">
                            {steps.map((step, index) => {
                                const Icon = step.icon
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="group flex gap-5 p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-green-500/30 dark:hover:border-green-500/30 transition-all duration-300"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-300">
                                                <Icon className="size-5" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="text-xs font-normal text-green-600 dark:text-green-400 uppercase tracking-widest"
                                                    style={{ fontFamily: 'var(--font-body)' }}
                                                >
                                                    Step {step.number}
                                                </span>
                                            </div>
                                            <h3
                                                className="text-zinc-900 dark:text-white"
                                                style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    fontSize: 'var(--text-body-lg)',
                                                    fontWeight: 300,
                                                }}
                                            >
                                                {step.title}
                                            </h3>
                                            <p
                                                className="text-zinc-600 dark:text-zinc-400 font-light"
                                                style={{
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: 'var(--text-sm)',
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="pt-4"
                        >
                            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-0.5 w-fit">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-8 font-normal border-0"
                                >
                                    <Link href="/quote">
                                        Get Your Free Quote
                                        <ArrowRight className="ml-2 size-4" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
