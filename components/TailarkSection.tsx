'use client'
import { ArrowRight, Leaf, Phone, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const TailarkSection = () => {
  return (
    <section className="overflow-hidden bg-transparent">
      <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-32">
        {/* Left Side - Image (absolute positioned) */}
        <div className="absolute inset-0 -mx-4 rounded-3xl p-3">
          <div className="relative h-full flex items-center">
            {/* Radial gradient overlay - fades from right to blend with content */}
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background: 'radial-gradient(ellipse at 70% 50%, var(--color-background) 0%, transparent 70%)'
              }}
            ></div>

            {/* Image Container - positioned on the left */}
            <div className="relative w-full max-w-2xl -translate-x-16 lg:-translate-x-24">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/img/lawncare3.jpg"
                  alt="Professional landscape transformation"
                  fill
                  className="object-cover"
                />
                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/80 dark:to-zinc-950/80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Content (centered text) */}
        <div className="lg:flex lg:items-center lg:justify-end lg:gap-12">
          <div className="relative z-10 mx-auto max-w-xl text-center lg:mr-0 lg:w-1/2">
            {/* Badge */}
            <Link
              href="#tools"
              className="mx-auto flex w-fit items-center gap-2 rounded-full border border-green-200 dark:border-green-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-1 pr-3 hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors"
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
              className="mt-10 text-balance text-4xl md:text-5xl xl:text-5xl text-zinc-900 dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
            >
              Let's Build Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                Dream Outdoor Space
              </span>
            </h2>

            {/* Description */}
            <p
              className="mt-8 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              From simple lawn maintenance to complete landscape transformations,
              we bring decades of expertise and a passion for creating beautiful,
              sustainable outdoor environments.
            </p>

            {/* CTA Buttons - Centered */}
            <div className="my-10 flex flex-col sm:flex-row gap-4 justify-center lg:my-12">
              <Link
                href="/quote"
                className="group inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg shadow-green-600/25 hover:shadow-green-500/40 hover:-translate-y-0.5 hover:scale-105"
                style={{ fontFamily: 'var(--font-cta)', fontWeight: 500 }}
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="uppercase tracking-wide">Get Free Estimate</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:2206662520"
                className="group inline-flex items-center justify-center gap-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-8 py-4 rounded-full font-medium transition-all border border-zinc-200 dark:border-zinc-700 hover:shadow-lg hover:-translate-y-0.5"
                style={{ fontFamily: 'var(--font-button)', fontWeight: 400 }}
              >
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="uppercase tracking-wide">(220) 666-2520</span>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 justify-center text-sm text-zinc-500 dark:text-zinc-400">
              {[
                { label: 'Licensed & Insured', icon: '✓' },
                { label: 'Free Estimates', icon: '✓' },
                { label: 'Satisfaction Guaranteed', icon: '✓' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
