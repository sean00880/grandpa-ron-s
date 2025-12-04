'use client'
import { ArrowRight, Leaf, Phone, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const TailarkSection = () => {
  return (
    <section className="relative overflow-hidden bg-transparent">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <Image
          src="/img/lawncare3.jpg"
          alt="Professional landscape transformation"
          fill
          className="object-cover"
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90 dark:from-zinc-950/90 dark:via-zinc-950/80 dark:to-zinc-950/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/50 dark:from-zinc-950/50 dark:via-transparent dark:to-zinc-950/50"></div>
      </div>

      {/* Content - Full width, dead center */}
      <div className="relative z-10 w-full px-6 py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <Link
            href="#tools"
            className="inline-flex items-center gap-2 rounded-full border border-green-200 dark:border-green-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-1 pr-3 hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors mb-10"
          >
            <span className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-medium text-white flex items-center gap-1">
              <Leaf className="size-3" />
              Local Experts
            </span>
            <span className="text-sm text-green-700 dark:text-green-400">
              Serving Newark & Beyond
            </span>
            <span className="block h-4 w-px bg-green-300 dark:bg-green-700"></span>
            <ArrowRight className="size-4 text-green-600" />
          </Link>

          {/* Heading */}
          <h2
            className="text-balance text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-zinc-900 dark:text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
          >
            Let's Build Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              Dream Outdoor Space
            </span>
          </h2>

          {/* Description */}
          <p
            className="mt-8 text-zinc-600 dark:text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            From simple lawn maintenance to complete landscape transformations,
            we bring decades of expertise and a passion for creating beautiful,
            sustainable outdoor environments.
          </p>

          {/* CTA Buttons - Dead Center */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="group inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-full font-medium transition-all shadow-lg shadow-green-600/25 hover:shadow-green-500/40 hover:-translate-y-1 hover:scale-105"
              style={{ fontFamily: 'var(--font-cta)', fontWeight: 500 }}
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="uppercase tracking-wide text-lg">Get Free Estimate</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="tel:2206662520"
              className="group inline-flex items-center justify-center gap-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-10 py-5 rounded-full font-medium transition-all border border-zinc-200 dark:border-zinc-700 hover:shadow-lg hover:-translate-y-1 hover:scale-105"
              style={{ fontFamily: 'var(--font-button)', fontWeight: 400 }}
            >
              <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="uppercase tracking-wide text-lg">(220) 666-2520</span>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap gap-8 justify-center text-sm text-zinc-600 dark:text-zinc-400">
            {[
              { label: 'Licensed & Insured', icon: '✓' },
              { label: 'Free Estimates', icon: '✓' },
              { label: 'Satisfaction Guaranteed', icon: '✓' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-green-500 font-bold text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
