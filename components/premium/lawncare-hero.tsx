'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Phone, Sparkles, TreeDeciduous, Leaf, Flower2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { locationRegistry } from '@/services/locationRegistry'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

// Lawncare SVG wireframe elements for visual interest
const LawncareWireframe = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating leaf elements */}
        <div className="absolute top-20 left-[10%] opacity-10 dark:opacity-5 animate-pulse-slow">
            <Leaf className="w-24 h-24 text-green-600 rotate-12" strokeWidth={0.5} />
        </div>
        <div className="absolute top-40 right-[15%] opacity-10 dark:opacity-5 animate-pulse-slow" style={{ animationDelay: '1s' }}>
            <TreeDeciduous className="w-32 h-32 text-green-700 -rotate-6" strokeWidth={0.5} />
        </div>
        <div className="absolute bottom-32 left-[20%] opacity-10 dark:opacity-5 animate-pulse-slow" style={{ animationDelay: '2s' }}>
            <Flower2 className="w-20 h-20 text-green-500 rotate-45" strokeWidth={0.5} />
        </div>

        {/* Gradient orbs - Southern Haulers style */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-400/20 via-emerald-300/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-green-500/15 via-teal-400/10 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-300/5 via-emerald-400/5 to-green-300/5 blur-3xl" />
    </div>
)

// Location Grid Component for SEO-optimized display
const LocationGrid = ({ onLocationSelect }: { onLocationSelect: (slug: string) => void }) => {
    const locationCategories = locationRegistry?.getLocationsByCategories() ?? {}

    return (
        <div className="w-full">
            {Object.entries(locationCategories).map(([category, locs]) => (
                locs && (locs as any[]).length > 0 && (
                    <div key={category} className="mb-6">
                        <h3 className="text-xs font-medium tracking-widest uppercase text-zinc-500 dark:text-zinc-400 mb-3 px-1">
                            {category}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {(locs as any[]).map((loc) => (
                                <button
                                    key={loc?.slug}
                                    onClick={() => onLocationSelect(loc?.slug ?? '')}
                                    className="group relative px-3 py-2.5 rounded-xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 hover:border-green-500/50 dark:hover:border-green-500/50 hover:bg-green-50/50 dark:hover:bg-green-950/30 transition-all duration-300 text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-green-600 dark:text-green-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-sm font-normal text-zinc-700 dark:text-zinc-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">
                                            {loc?.name}
                                        </span>
                                    </div>
                                    <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )
            ))}
        </div>
    )
}

export default function LawncareHero() {
    const router = useRouter()

    const handleLocationSelect = (slug: string) => {
        if (slug) {
            router.push(`/locations/${slug}`)
        }
    }

    return (
        <main className="overflow-hidden relative">
            {/* Wireframe decorations */}
            <LawncareWireframe />

            <section className="relative min-h-[90vh] flex flex-col">
                <div className="relative pt-16 md:pt-24 flex-1">
                    {/* Subtle grid pattern background */}
                    <div
                        className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.02]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />

                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center">
                            {/* Badge */}
                            <AnimatedGroup variants={transitionVariants}>
                                <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-green-200/50 dark:border-green-800/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-1.5 pl-4 shadow-sm">
                                    <span className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm font-normal tracking-wide">
                                        <Sparkles className="w-4 h-4" />
                                        Serving 24 Cities in Central Ohio
                                    </span>
                                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                                        Since 1985
                                    </span>
                                </div>
                            </AnimatedGroup>

                            {/* Main Heading - Elegant light typography */}
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="mx-auto mt-10 max-w-5xl text-balance font-light tracking-tight"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-display)',
                                    fontWeight: 200,
                                    lineHeight: 1.1,
                                }}
                            >
                                Professional Landscaping That Transforms Your Property
                            </TextEffect>

                            <TextEffect
                                per="line"
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                delay={0.5}
                                as="p"
                                className="mx-auto mt-6 max-w-2xl text-balance text-zinc-600 dark:text-zinc-400 font-light"
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 'var(--text-body-lg)',
                                    lineHeight: 1.7,
                                }}
                            >
                                Creating customer experiences and relationships that last generations. Quality landscaping with traditional values and modern excellence.
                            </TextEffect>

                            {/* CTA Buttons */}
                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}
                                className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-0.5">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="rounded-xl px-8 text-base font-normal bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-600/20 border-0">
                                        <Link href="/quote">
                                            <span className="text-nowrap">Request Free Quote</span>
                                            <ArrowRight className="ml-2 size-4" />
                                        </Link>
                                    </Button>
                                </div>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="rounded-xl px-8 border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm font-normal hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                    <a href="tel:2206662520">
                                        <Phone className="mr-2 size-4" />
                                        <span className="text-nowrap">(220) 666-2520</span>
                                    </a>
                                </Button>
                            </AnimatedGroup>
                        </div>

                        {/* Location Grid Section */}
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.02,
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                            className="mt-16 md:mt-20">
                            <div className="relative">
                                {/* Section Header */}
                                <div className="text-center mb-8">
                                    <h2
                                        className="text-zinc-900 dark:text-white font-light tracking-tight"
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: 'var(--text-h3)',
                                            fontWeight: 300,
                                        }}
                                    >
                                        Select Your Service Area
                                    </h2>
                                    <p
                                        className="mt-2 text-zinc-500 dark:text-zinc-400 font-light"
                                        style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 'var(--text-sm)',
                                        }}
                                    >
                                        Click your city for local pricing and availability
                                    </p>
                                </div>

                                {/* Glass-morphism container */}
                                <div className="relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-zinc-200/50 dark:border-zinc-700/30 p-6 md:p-8 shadow-xl shadow-zinc-900/5">
                                    <LocationGrid onLocationSelect={handleLocationSelect} />

                                    {/* View All Link */}
                                    <div className="mt-6 pt-6 border-t border-zinc-200/50 dark:border-zinc-700/30 text-center">
                                        <Link
                                            href="/locations"
                                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 font-normal text-sm transition-colors group"
                                        >
                                            View All 24 Locations
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>

                    {/* Featured Project Showcase */}
                    <AnimatedGroup
                        variants={{
                            container: {
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05,
                                        delayChildren: 1.2,
                                    },
                                },
                            },
                            ...transitionVariants,
                        }}>
                        <div className="relative mt-16 md:mt-24 px-4">
                            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-zinc-900/10">
                                <Image
                                    className="w-full h-auto"
                                    src="https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=2832&auto=format&fit=crop"
                                    alt="Beautiful landscaped property"
                                    width={1400}
                                    height={600}
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                                        <div className="text-white">
                                            <p
                                                className="text-sm font-normal opacity-70 uppercase tracking-wider"
                                                style={{ fontFamily: 'var(--font-body)' }}
                                            >
                                                Featured Project
                                            </p>
                                            <p
                                                className="mt-1 font-light"
                                                style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    fontSize: 'var(--text-h4)',
                                                    fontWeight: 300,
                                                }}
                                            >
                                                Westerville Residence - Complete Transformation
                                            </p>
                                        </div>
                                        <Link
                                            href="/portfolio"
                                            className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-white text-sm font-normal hover:bg-white/20 transition-colors border border-white/20"
                                        >
                                            View Portfolio
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedGroup>
                </div>
            </section>

            {/* Trust Section */}
            <section className="bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm py-12 md:py-16 border-t border-zinc-200/50 dark:border-zinc-800/50">
                <div className="mx-auto max-w-6xl px-6">
                    <p
                        className="text-center text-zinc-500 dark:text-zinc-400 mb-8 font-light tracking-wide"
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        Trusted by homeowners and businesses across Central Ohio
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        {[
                            { name: 'BBB Accredited', rating: 'A+' },
                            { name: 'Google Reviews', rating: '4.9★' },
                            { name: 'Years in Business', rating: '40+' },
                            { name: 'Projects Completed', rating: '10K+' },
                        ].map((item, index) => (
                            <div key={index} className="text-center group">
                                <div
                                    className="font-light text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: 'var(--text-h3)',
                                        fontWeight: 200,
                                    }}
                                >
                                    {item.rating}
                                </div>
                                <div
                                    className="mt-1 text-zinc-500 dark:text-zinc-400 font-light"
                                    style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: 'var(--text-sm)',
                                    }}
                                >
                                    {item.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
