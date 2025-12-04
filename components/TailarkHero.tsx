'use client'
import { ArrowRight, Mail, SendHorizonal, Check, Leaf, TreeDeciduous, Sun } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const TailarkHero = () => {
    return (
        <section className="relative overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
                <div className="lg:flex lg:items-center lg:gap-16">
                    {/* Left Content */}
                    <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                        <Link
                            href="/quote"
                            className="mx-auto flex w-fit items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-full p-1 pr-4 lg:ml-0 hover:border-green-500/50 transition-colors group bg-white dark:bg-zinc-900">
                            <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide">New</span>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">AI-Powered Lawn Visualizer</span>
                            <span className="block h-4 w-px bg-zinc-200 dark:bg-zinc-700"></span>
                            <ArrowRight className="size-4 text-zinc-400 group-hover:text-green-600 transition-colors" />
                        </Link>

                        <h2
                            className="mt-10 text-balance text-4xl md:text-5xl xl:text-5xl text-zinc-900 dark:text-white"
                            style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}
                        >
                            See Your Dream Yard <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Before We Start</span>
                        </h2>
                        <p
                            className="mt-8 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Upload a photo of your property and our AI instantly shows you how it will look with professional landscaping. Get accurate estimates and visualize transformations in seconds.
                        </p>

                        <div>
                            <form
                                action="/quote"
                                className="mx-auto my-10 max-w-sm lg:my-12 lg:ml-0 lg:mr-auto">
                                <div className="relative grid grid-cols-[1fr_auto] items-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pr-3 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 focus-within:ring-2 focus-within:ring-green-500/50 focus-within:border-green-500">
                                    <Mail className="pointer-events-none absolute inset-y-0 left-5 my-auto size-5 text-zinc-400" />

                                    <input
                                        placeholder="Enter your email for quote"
                                        className="h-14 w-full bg-transparent pl-12 pr-2 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
                                        type="email"
                                        name="email"
                                    />

                                    <div>
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-green-600/25 hover:shadow-green-500/30"
                                            style={{ fontFamily: 'var(--font-cta)', fontWeight: 500 }}
                                        >
                                            <span className="hidden md:block uppercase tracking-wide">Get Started</span>
                                            <SendHorizonal
                                                className="relative mx-auto size-5 md:hidden"
                                                strokeWidth={2}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <ul className="space-y-3 text-left max-w-sm mx-auto lg:mx-0">
                                <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span>Instant AI visualization of your property</span>
                                </li>
                                <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span>Accurate cost estimates within 24 hours</span>
                                </li>
                                <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span>100% free, no obligation quote</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Side - Dashboard Image */}
                    <div className="relative mt-16 lg:mt-0 lg:w-1/2">
                        <div className="relative">
                            {/* Radial gradient overlay */}
                            <div className="absolute -inset-8 bg-gradient-radial from-transparent via-transparent to-white dark:to-zinc-950 to-70% z-10 pointer-events-none"></div>

                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

                            {/* Floating icons */}
                            <div className="absolute -top-2 right-8 w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl shadow-lg flex items-center justify-center animate-bounce-slow z-20">
                                <Leaf className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="absolute top-1/2 -left-4 w-10 h-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg flex items-center justify-center animate-pulse z-20">
                                <TreeDeciduous className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="absolute bottom-8 right-4 w-10 h-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg flex items-center justify-center animate-bounce-slow delay-300 z-20">
                                <Sun className="w-5 h-5 text-yellow-500" />
                            </div>

                            {/* Dashboard/Mockup Image Container */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-zinc-300/50 dark:shadow-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                                {/* Browser Chrome Mockup */}
                                <div className="bg-zinc-200 dark:bg-zinc-800 px-4 py-3 flex items-center gap-2 border-b border-zinc-300 dark:border-zinc-700">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <div className="bg-white dark:bg-zinc-700 rounded-md px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                            <span className="text-green-600">🔒</span>
                                            grandparonslawns.com/visualizer
                                        </div>
                                    </div>
                                </div>
                                {/* Main Content - Lawn Transformation Preview */}
                                <div className="relative aspect-[4/3]">
                                    <Image
                                        src="/img/lawncare3.jpg"
                                        alt="Lawn transformation visualization preview"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Overlay UI Elements */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-semibold text-zinc-900 dark:text-white">AI Analysis Complete</span>
                                                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-full">98% Match</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 text-center">
                                                <div>
                                                    <div className="text-lg font-bold text-green-600">$2,450</div>
                                                    <div className="text-xs text-zinc-500">Est. Cost</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-emerald-600">3 days</div>
                                                    <div className="text-xs text-zinc-500">Timeline</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-teal-600">A+</div>
                                                    <div className="text-xs text-zinc-500">Health Score</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decorative gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent"></div>
        </section>
    )
}
