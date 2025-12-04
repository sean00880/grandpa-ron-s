'use client'
import { ArrowRight, Check, Leaf, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { VisualizerDemo } from './VisualizerDemo'

export const TailarkHero = () => {
  return (
    <section className="overflow-hidden bg-white dark:bg-zinc-950">
      <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-20">
        <div className="lg:flex lg:items-center lg:gap-12">
          {/* Left Side - Content */}
          <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
            {/* Badge */}
            <Link
              href="#tools"
              className="mx-auto flex w-fit items-center gap-2 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 p-1 pr-3 lg:ml-0 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            >
              <span className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-medium text-white">
                AI-Powered
              </span>
              <span className="text-sm text-green-700 dark:text-green-400">
                See Your Dream Yard First
              </span>
              <span className="block h-4 w-px bg-green-300 dark:bg-green-700"></span>
              <ArrowRight className="size-4 text-green-600" />
            </Link>

            {/* Heading */}
            <h1
              className="mt-10 text-balance text-4xl md:text-5xl xl:text-5xl text-zinc-900 dark:text-white tracking-tight"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
            >
              From Photo to Paradise{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                In Three Steps
              </span>
            </h1>

            {/* Description */}
            <p
              className="mt-8 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Upload a photo of your yard and watch our AI instantly visualize
              transformations. Get accurate quotes, material lists, and timeline
              estimates—all before we even visit.
            </p>

            {/* CTA Buttons */}
            <div className="my-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start lg:my-12">
              <Link
                href="#tools"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg shadow-green-600/25 hover:shadow-green-500/30 hover:-translate-y-0.5 group"
                style={{ fontFamily: 'var(--font-cta)', fontWeight: 500 }}
              >
                <Sparkles className="w-5 h-5" />
                <span className="uppercase tracking-wide">Try AI Visualizer</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-8 py-4 rounded-full font-medium transition-all border border-zinc-200 dark:border-zinc-700"
                style={{ fontFamily: 'var(--font-button)', fontWeight: 400 }}
              >
                <span className="uppercase tracking-wide">Get Free Quote</span>
              </Link>
            </div>

            {/* Feature List */}
            <ul className="space-y-3 text-left max-w-sm mx-auto lg:mx-0">
              {[
                'Instant AI analysis of your landscape',
                'Accurate quotes based on local pricing',
                'Professional execution within days'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side - AI Visualizer Demo (absolute positioned like PC_Gamefi) */}
        <div className="absolute inset-0 -mx-4 rounded-3xl p-3 lg:col-span-3 pointer-events-none">
          <div className="relative h-full flex items-center justify-end">
            {/* Radial gradient overlay */}
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background: 'radial-gradient(ellipse at 30% 50%, var(--color-background) 0%, transparent 60%)'
              }}
            ></div>

            {/* Demo Container - positioned on the right */}
            <div className="relative w-full max-w-2xl lg:translate-x-16 xl:translate-x-24 pointer-events-auto">
              <VisualizerDemo />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent"></div>
    </section>
  )
}
