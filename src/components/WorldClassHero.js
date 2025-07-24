'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function WorldClassHero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // Static particles to avoid hydration mismatch
  const [particles, setParticles] = useState([])
  
  useEffect(() => {
    const particleArray = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
      xOffset: Math.random() * 60 - 30,
    }))
    setParticles(particleArray)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-emerald-900">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 opacity-15"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-[url('/img/hero-bg.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-zinc-900/80 to-black/95" />
      </motion.div>

      {/* Subtle Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            animate={{
              y: [0, -80, 0],
              x: [0, particle.xOffset, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"
        style={{ opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content - Refined Typography */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-6"
          >
            {/* Trust Badge - Refined */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-4 py-2"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    className="w-3 h-3 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>
              <span className="text-white font-medium text-sm">500+ Happy Clients</span>
            </motion.div>

            {/* Main Heading - Professional Sizing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-light text-white leading-[0.9] tracking-tight">
                Elevate
                <br />
                <span className="text-white/90">Your</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500">
                  Landscape
                </span>
                <br />
                <span className="text-white/90">Vision</span>
              </h1>
            </motion.div>

            {/* Enhanced Subtitle - Professional Sizing */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl lg:text-2xl text-white/80 font-sans font-light leading-relaxed max-w-xl"
            >
              Artisan landscaping craftsmanship that transforms properties into extraordinary outdoor sanctuaries in{' '}
              <span className="text-emerald-400 font-medium">Canal Winchester, Ohio</span>
            </motion.p>

            {/* Premium Service Indicators - Refined */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md"
            >
              <div className="bg-black/30 backdrop-blur-sm border border-black/20 p-3 sm:p-4 rounded-xl text-center hover:bg-black/40 transition-all duration-300">
                <div className="text-lg sm:text-xl mb-1">🎨</div>
                <div className="text-white font-heading font-medium text-xs sm:text-sm">Bespoke</div>
                <div className="text-white/70 font-sans text-xs">Design</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-black/20 p-3 sm:p-4 rounded-xl text-center hover:bg-black/40 transition-all duration-300">
                <div className="text-lg sm:text-xl mb-1">⚡</div>
                <div className="text-white font-heading font-medium text-xs sm:text-sm">Expert</div>
                <div className="text-white/70 font-sans text-xs">Consultation</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-black/20 p-3 sm:p-4 rounded-xl text-center hover:bg-black/40 transition-all duration-300">
                <div className="text-lg sm:text-xl mb-1">🌿</div>
                <div className="text-white font-heading font-medium text-xs sm:text-sm">Sustainable</div>
                <div className="text-white/70 font-sans text-xs">Practices</div>
              </div>
            </motion.div>

            {/* Professional CTA Buttons - Refined */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-heading font-thin text-base sm:text-lg shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-lg">📞</span>
                Schedule Consultation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsVideoOpen(true)}
                className="bg-black/20 backdrop-blur-sm border border-white/10 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-heading font-thin text-base sm:text-lg hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-lg">🎬</span>
                View Portfolio
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Premium Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            {/* Main Featured Image - Enhanced */}
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-2xl shadow-2xl"
              >
                <Image
                  src="/img/lawncare3.jpg"
                  alt="Premium Landscaping by Josh Reichley in Canal Winchester, Ohio"
                  width={600}
                  height={400}
                  className="w-full h-[280px] sm:h-[350px] lg:h-[400px] object-cover"
                  priority={true}
                />
                {/* Enhanced Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Premium Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white font-heading font-semibold text-xs">Premium Project</span>
                  </div>
                </motion.div>

                {/* Artisan Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 }}
                  className="absolute top-4 right-4 bg-yellow-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-xs">🎨</span>
                    <span className="text-white font-heading font-semibold text-xs">Artisan Craft</span>
                  </div>
                </motion.div>

                {/* Professional Info Card - Updated */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="absolute bottom-4 left-4 right-4"
                >
                  <div className="bg-black/50 backdrop-blur-lg border border-black/30 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-heading font-semibold text-lg">Josh Reichley</h3>
                        <p className="text-emerald-400 font-sans font-medium text-sm">Master Landscaper Since 2019</p>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-heading font-bold text-2xl">5+</div>
                        <div className="text-white/80 font-sans text-xs font-medium">Years Experience</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Premium Stats Cards - Refined */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 }}
                className="absolute -right-3 sm:-right-6 top-1/4 space-y-2 hidden md:block"
              >
                <div className="bg-black/30 backdrop-blur-lg border border-emerald-500/30 p-2.5 sm:p-3 rounded-lg shadow-lg">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-heading font-bold text-emerald-400">500+</div>
                    <div className="text-white/80 font-sans text-xs font-medium">Happy Clients</div>
                  </div>
                </div>
                <div className="bg-black/30 backdrop-blur-lg border border-emerald-500/30 p-2.5 sm:p-3 rounded-lg shadow-lg">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-heading font-bold text-emerald-400">100%</div>
                    <div className="text-white/80 font-sans text-xs font-medium">Satisfaction</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Refined Floating Elements */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-3 -left-3 bg-black/30 backdrop-blur-sm border border-emerald-500/30 p-2 rounded-lg"
            >
              <div className="text-emerald-400 font-sans text-xs font-semibold">🌱 Sustainable</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-3 -left-3 bg-black/30 backdrop-blur-sm border border-orange-500/30 p-2 rounded-lg"
            >
              <div className="text-orange-400 font-sans text-xs font-semibold">⚡ Expert Service</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Contact Bar - Refined */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 sm:mt-12 lg:mt-16 bg-black/30 backdrop-blur-lg border border-black/20 p-4 sm:p-6 rounded-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 text-white">
                <span className="text-emerald-400 text-lg">📞</span>
                <span className="font-heading font-semibold text-lg">(220) 666-2520</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/20"></div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-emerald-400 text-lg">📍</span>
                <span className="font-sans font-medium text-base">Canal Winchester</span>
              </div>
            </div>
            <div className="text-white/70 font-sans text-sm font-medium text-center md:text-right">
              Serving Canal Winchester & Columbus Area
            </div>
          </div>
        </motion.div>

        {/* Refined Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-center"
        >
          <div className="text-sm mb-2 font-sans font-medium">Explore our work</div>
          <div className="w-6 h-10 border-2 border-white/40 rounded-full mx-auto relative">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full absolute left-1/2 top-1.5 transform -translate-x-1/2"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Video Modal */}
      {isVideoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-heading font-semibold text-gray-900">Our Landscaping Portfolio</h3>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
              <p className="text-gray-600 text-lg font-sans">Portfolio showcase would go here</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}