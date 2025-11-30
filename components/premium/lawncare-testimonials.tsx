'use client'

import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
    {
        name: 'Sarah Mitchell',
        role: 'Homeowner',
        location: 'Westerville, OH',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        quote: 'Grandpa Ron\'s transformed our backyard into an absolute paradise. Their attention to detail is unmatched, and the team was so professional throughout the entire project.',
    },
    {
        name: 'Michael Thompson',
        role: 'Business Owner',
        location: 'Dublin, OH',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
        quote: 'We\'ve been using their commercial services for 5 years. The consistency and quality of their work keeps our property looking impeccable year-round.',
    },
    {
        name: 'Jennifer Davis',
        role: 'Property Manager',
        location: 'Powell, OH',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
        quote: 'Managing multiple properties means I need reliable contractors. Grandpa Ron\'s never disappoints - they\'re prompt, professional, and their pricing is always fair.',
    },
    {
        name: 'David Chen',
        role: 'Restaurant Owner',
        location: 'Columbus, OH',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        quote: 'Our restaurant patio looks amazing thanks to their landscaping work. Customers always comment on how beautiful the outdoor space is. Highly recommend!',
    },
    {
        name: 'Lisa Anderson',
        role: 'Homeowner',
        location: 'Gahanna, OH',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        quote: 'From the initial consultation to the final walkthrough, the experience was seamless. They brought our vision to life and exceeded every expectation.',
    },
]

export default function LawncareTestimonials() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const nextTestimonial = useCallback(() => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, [])

    const prevTestimonial = useCallback(() => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }, [])

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    }

    return (
        <section id="reviews" className="relative py-24 md:py-32 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden">
            {/* Decorative grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Gradient accents */}
            <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-to-br from-green-100/30 dark:from-green-900/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tl from-green-100/30 dark:from-green-900/10 to-transparent pointer-events-none" />

            <div className="relative mx-auto max-w-6xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <span
                        className="inline-block text-green-600 dark:text-green-400 text-sm font-normal tracking-widest uppercase mb-4"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        Testimonials
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
                        What Our Customers Say
                    </h2>
                    <p
                        className="mt-4 text-zinc-600 dark:text-zinc-400 font-light"
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-body-lg)',
                            lineHeight: 1.7,
                        }}
                    >
                        Real experiences from homeowners and businesses across Central Ohio.
                    </p>
                </motion.div>

                {/* Featured Testimonial Carousel */}
                <div className="relative max-w-4xl mx-auto mb-16">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500/50 transition-all shadow-lg"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500/50 transition-all shadow-lg"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Carousel Content */}
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            >
                                <div className="relative bg-white dark:bg-zinc-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl">
                                    {/* Quote Icon */}
                                    <div className="absolute -top-4 left-8 md:left-12">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                                            <Quote className="size-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Stars */}
                                    <div className="flex gap-1 mb-6 pt-2">
                                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                            <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <blockquote
                                        className="text-zinc-700 dark:text-zinc-300 mb-8 leading-relaxed"
                                        style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 'var(--text-h4)',
                                            fontWeight: 300,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        &ldquo;{testimonials[currentIndex].quote}&rdquo;
                                    </blockquote>

                                    {/* Author */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-green-500/20">
                                            <Image
                                                src={testimonials[currentIndex].image}
                                                alt={testimonials[currentIndex].name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div
                                                className="text-zinc-900 dark:text-white"
                                                style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    fontSize: 'var(--text-body-lg)',
                                                    fontWeight: 300,
                                                }}
                                            >
                                                {testimonials[currentIndex].name}
                                            </div>
                                            <div
                                                className="text-zinc-500 dark:text-zinc-400 font-light"
                                                style={{
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: 'var(--text-sm)',
                                                }}
                                            >
                                                {testimonials[currentIndex].role} · {testimonials[currentIndex].location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots Navigation */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 1 : -1)
                                    setCurrentIndex(index)
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-green-600 w-8'
                                        : 'bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* All Testimonials Grid (Mini Cards) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-3"
                >
                    {testimonials.map((testimonial, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1)
                                setCurrentIndex(index)
                            }}
                            className={`group relative p-4 rounded-xl border transition-all duration-300 text-left ${index === currentIndex
                                    ? 'bg-green-50 dark:bg-green-950/30 border-green-500/50'
                                    : 'bg-white dark:bg-zinc-800/30 border-zinc-200/50 dark:border-zinc-700/50 hover:border-green-500/30'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </div>
                            <p
                                className="text-zinc-600 dark:text-zinc-400 font-light line-clamp-2"
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                {testimonial.name}
                            </p>
                        </button>
                    ))}
                </motion.div>

                {/* Google Reviews Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <a
                        href="https://www.google.com/maps"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white dark:bg-zinc-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-zinc-200/50 dark:border-zinc-700/50 hover:border-green-500/50 transition-all shadow-lg hover:shadow-xl"
                    >
                        <svg className="size-5" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span
                            className="text-zinc-900 dark:text-white font-light"
                            style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            View all reviews on Google
                        </span>
                        <div className="flex items-center gap-1">
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            <span
                                className="text-zinc-900 dark:text-white"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontWeight: 300,
                                }}
                            >
                                4.9
                            </span>
                        </div>
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
