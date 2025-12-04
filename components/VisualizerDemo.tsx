'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Upload, Wand2, Loader2, Sparkles, DollarSign, Check, Camera, ArrowRight, Play, Pause } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Demo data - pre-saved AI response for the hardscaping transformation
const DEMO_DATA = {
  originalImage: '/img/mulching.jpg',
  transformedImage: '/img/lawncare3.jpg', // The "after" image
  prompt: 'Add fresh cedar mulch beds with decorative border stones and native perennial plants',
  suggestions: [
    'Add fresh cedar mulch around trees',
    'Install decorative stone border',
    'Plant native perennials for color',
    'Create curved garden bed edges'
  ],
  quote: {
    total: 2850,
    breakdown: [
      { item: 'Cedar Mulch (15 yards)', cost: 675 },
      { item: 'Border Stones', cost: 420 },
      { item: 'Native Perennials', cost: 580 },
      { item: 'Labor (2 crew, 1 day)', cost: 1175 }
    ],
    timeline: '2-3 days',
    healthScore: 'A+'
  }
}

type DemoStep = 'idle' | 'uploading' | 'analyzing' | 'typing' | 'generating' | 'complete'

export const VisualizerDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<DemoStep>('idle')
  const [typedText, setTypedText] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [showResult, setShowResult] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play the demo animation
  const startDemo = () => {
    if (isPlaying) return
    setIsPlaying(true)
    resetDemo()

    // Step 1: Upload animation
    setTimeout(() => setCurrentStep('uploading'), 500)

    // Step 2: Analyzing
    setTimeout(() => setCurrentStep('analyzing'), 2000)

    // Step 3: Show suggestions
    setTimeout(() => {
      setCurrentStep('typing')
      setShowSuggestions(true)
    }, 4000)

    // Step 4: Select a suggestion and type it
    setTimeout(() => {
      setSelectedSuggestion(0)
    }, 5000)

    // Step 5: Type the prompt
    setTimeout(() => {
      typeText(DEMO_DATA.prompt)
    }, 5500)

    // Step 6: Generate
    setTimeout(() => setCurrentStep('generating'), 8500)

    // Step 7: Show result
    setTimeout(() => {
      setCurrentStep('complete')
      setShowResult(true)
      animateSlider()
    }, 11000)

    // Reset after complete
    setTimeout(() => {
      setIsPlaying(false)
    }, 16000)
  }

  const resetDemo = () => {
    setCurrentStep('idle')
    setTypedText('')
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
    setShowResult(false)
    setSliderPosition(50)
  }

  const typeText = (text: string) => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= text.length) {
        setTypedText(text.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 35)
  }

  const animateSlider = () => {
    // Animate slider back and forth
    let direction = -1
    let pos = 50
    const interval = setInterval(() => {
      pos += direction * 2
      if (pos <= 20) direction = 1
      if (pos >= 80) direction = -1
      setSliderPosition(pos)
    }, 50)

    setTimeout(() => {
      clearInterval(interval)
      setSliderPosition(50)
    }, 4000)
  }

  // Auto-start demo when component mounts and is in view
  useEffect(() => {
    const timer = setTimeout(() => {
      startDemo()
    }, 2000)

    // Loop the demo
    const loopTimer = setInterval(() => {
      if (!isPlaying) {
        startDemo()
      }
    }, 20000)

    return () => {
      clearTimeout(timer)
      clearInterval(loopTimer)
    }
  }, [])

  return (
    <div className="relative w-full">
      {/* Browser Chrome Frame */}
      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-zinc-300/50 dark:shadow-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
        {/* Browser Header */}
        <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white dark:bg-zinc-700 rounded-md px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <span className="text-green-600">🔒</span>
              grandparonslawns.com/visualizer
            </div>
          </div>
          <button
            onClick={isPlaying ? resetDemo : startDemo}
            className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-zinc-500" />
            ) : (
              <Play className="w-4 h-4 text-zinc-500" />
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 min-h-[400px]">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-5 p-6 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800">
            {/* Upload Section */}
            <div className="mb-6">
              <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">1. Source Image</div>
              <motion.div
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                  currentStep !== 'idle' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-zinc-300 dark:border-zinc-700'
                }`}
                animate={currentStep === 'uploading' ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {currentStep === 'idle' ? (
                  <div className="flex flex-col items-center text-zinc-400 py-2">
                    <Upload className="mb-2 h-6 w-6" />
                    <span className="text-xs">Click to upload</span>
                  </div>
                ) : currentStep === 'uploading' ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-xs font-medium">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-2">
                    <Check className="h-5 w-5" />
                    <span className="text-xs font-medium">Image uploaded</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Design Instructions */}
            <div className="mb-6">
              <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">2. Design Instructions</div>
              <div className="relative">
                <textarea
                  value={typedText}
                  readOnly
                  placeholder="Describe your dream landscape..."
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm min-h-[80px] resize-none placeholder-zinc-400"
                />
                {currentStep === 'typing' && (
                  <motion.span
                    className="absolute right-3 bottom-3 w-0.5 h-4 bg-green-500"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>

              {/* AI Suggestions */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={12} className="text-purple-500" />
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                        {currentStep === 'analyzing' ? 'Analyzing terrain...' : 'AI Ideas:'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentStep === 'analyzing' ? (
                        [1, 2, 3].map(i => (
                          <div key={i} className="h-6 w-20 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded-md"></div>
                        ))
                      ) : (
                        DEMO_DATA.suggestions.map((s, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                              opacity: 1,
                              scale: selectedSuggestion === idx ? 1.05 : 1,
                              backgroundColor: selectedSuggestion === idx ? 'rgb(168 85 247)' : undefined
                            }}
                            transition={{ delay: idx * 0.1 }}
                            className={`text-[10px] px-2 py-1 rounded-md transition-colors ${
                              selectedSuggestion === idx
                                ? 'bg-purple-500 text-white'
                                : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                            }`}
                          >
                            {s}
                          </motion.button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generate Button */}
            <motion.button
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                currentStep === 'generating'
                  ? 'bg-green-600 text-white'
                  : currentStep === 'complete'
                    ? 'bg-green-500 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400'
              }`}
              animate={currentStep === 'generating' ? { scale: [1, 0.98, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 'generating' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Rendering...
                </>
              ) : currentStep === 'complete' ? (
                <>
                  <Check className="h-4 w-4" /> Complete!
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" /> Generate Design
                </>
              )}
            </motion.button>
          </div>

          {/* Right Panel - Visualization */}
          <div className="lg:col-span-7 bg-zinc-900 p-4 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 'idle' ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-zinc-500 z-10"
                >
                  <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Camera className="text-zinc-600" size={24} />
                  </div>
                  <p className="text-sm text-zinc-400">Upload a photo to begin</p>
                </motion.div>
              ) : !showResult ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full max-w-md aspect-[4/3] rounded-xl overflow-hidden z-10"
                >
                  <Image
                    src={DEMO_DATA.originalImage}
                    alt="Original landscape"
                    fill
                    className="object-cover"
                  />
                  {currentStep === 'generating' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p className="text-sm">AI is transforming your yard...</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                    Original
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full z-10"
                >
                  {/* Before/After Slider */}
                  <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-xl overflow-hidden">
                    {/* After Image (bottom layer) */}
                    <Image
                      src={DEMO_DATA.transformedImage}
                      alt="Transformed landscape"
                      fill
                      className="object-cover"
                    />

                    {/* Before Image (clipped) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <Image
                        src={DEMO_DATA.originalImage}
                        alt="Original landscape"
                        fill
                        className="object-cover"
                        style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
                      />
                    </div>

                    {/* Slider Line */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                      style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-zinc-600 rotate-180" />
                        <ArrowRight className="w-4 h-4 text-zinc-600 -ml-2" />
                      </div>
                    </div>

                    {/* Labels */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                      Before
                    </div>
                    <div className="absolute top-3 right-3 bg-green-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                      After
                    </div>
                  </div>

                  {/* Quote Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-white">Instant Quote</span>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                        {DEMO_DATA.quote.healthScore} Health Score
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-xl font-bold text-green-400">${DEMO_DATA.quote.total.toLocaleString()}</div>
                        <div className="text-[10px] text-zinc-400 uppercase">Est. Total</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-emerald-400">{DEMO_DATA.quote.timeline}</div>
                        <div className="text-[10px] text-zinc-400 uppercase">Timeline</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-teal-400">4</div>
                        <div className="text-[10px] text-zinc-400 uppercase">Items</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Demo indicator */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-zinc-400">
        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-zinc-400'}`}></div>
        <span>{isPlaying ? 'Demo playing...' : 'Click play to restart'}</span>
      </div>
    </div>
  )
}
