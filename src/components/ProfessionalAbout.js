'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { 
  CheckCircleIcon, 
  StarIcon, 
  ClockIcon, 
  UserGroupIcon,
  TrophyIcon,
  HeartIcon
} from '@heroicons/react/24/solid'
import { 
  Leaf, 
  Award, 
  Users, 
  Calendar, 
  MapPin, 
  Phone,
  Mail,
  Shield,
  Zap,
  Target
} from 'lucide-react'

export default function ProfessionalAbout() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    { icon: Users, label: "Happy Clients", value: "500+", color: "text-emerald-400" },
    { icon: Calendar, label: "Years Experience", value: "5+", color: "text-blue-400" },
    { icon: Award, label: "Projects Completed", value: "1000+", color: "text-yellow-400" },
    { icon: Shield, label: "Satisfaction Rate", value: "100%", color: "text-green-400" }
  ]

  const values = [
    {
      icon: Target,
      title: "Precision & Excellence",
      description: "Every project is executed with meticulous attention to detail and unwavering commitment to quality.",
      color: "emerald"
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description: "We prioritize eco-friendly solutions that enhance your landscape while protecting the environment.",
      color: "green"
    },
    {
      icon: HeartIcon,
      title: "Customer-Centric",
      description: "Building lasting relationships through exceptional service and personalized landscape solutions.",
      color: "blue"
    },
    {
      icon: Zap,
      title: "Innovation & Expertise",
      description: "Combining traditional craftsmanship with modern techniques for superior landscaping results.",
      color: "yellow"
    }
  ]

  const services = [
    "Commercial & Residential Landscaping",
    "Professional Lawn Mowing & Maintenance",
    "Premium Mulching Services",
    "Custom Paver Patios & Walkways",
    "Retaining Walls & Hardscaping",
    "Expert Tree Services & Pruning",
    "Seasonal Cleanup & Maintenance",
    "Snow & Ice Management",
    "Gutter Cleaning & Maintenance",
    "Property Enhancement Consulting"
  ]

  return (
    <section id="about" className="relative py-20 lg:py-32 bg-gradient-to-br from-zinc-900 via-black to-emerald-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/img/lawncare3.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-zinc-900/90 to-black/95" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-4 py-2 mb-6"
          >
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-heading font-medium text-sm">About Our Company</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-light text-white mb-6 leading-tight">
            Crafting{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
              Extraordinary
            </span>
            <br />
            Outdoor Spaces
          </h2>
          
          <p className="text-xl lg:text-2xl text-white/80 font-sans font-light max-w-3xl mx-auto leading-relaxed">
            Since 2019, we've been transforming properties across Canal Winchester and Columbus with 
            artisan landscaping that reflects Grandpa Ron's timeless vision and values.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Left Content - Story & Values */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {/* Founder Story */}
            <div className="bg-black/30 backdrop-blur-lg border border-white/10 p-6 lg:p-8 rounded-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold text-white">Our Foundation</h3>
                  <p className="text-emerald-400 font-sans text-sm">Built on Legacy & Excellence</p>
                </div>
              </div>
              
              <p className="text-white/90 font-sans leading-relaxed mb-4">
                Founded in 2021 by <span className="text-emerald-400 font-semibold">Joshua Reichley</span>, 
                Grandpa Ron's Lawns and Landscape embodies the vision and values of its namesake. 
                As a locally owned and operated company, we're deeply rooted in the Canal Winchester community.
              </p>
              
              <p className="text-white/80 font-sans leading-relaxed">
                Our mission extends beyond beautiful landscapes—we're building customer relationships 
                and experiences designed to last generations, just as Grandpa Ron envisioned.
              </p>
            </div>

            {/* Professional Credentials */}
            <div className="bg-black/30 backdrop-blur-lg border border-white/10 p-6 lg:p-8 rounded-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <TrophyIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold text-white">Professional Excellence</h3>
                  <p className="text-blue-400 font-sans text-sm">Certified & Experienced</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center p-4 bg-black/20 rounded-xl"
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                    <div className={`text-2xl font-heading font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-white/70 font-sans text-xs">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Content - Image & Contact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Professional Image */}
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-2xl shadow-2xl"
              >
                <Image
                  src="/img/Joshua.jpg"
                  alt="Joshua Reichley - Master Landscaper at Grandpa Ron's Lawn & Landscape"
                  width={600}
                  height={400}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                  priority
                />
                
                {/* Professional Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Professional Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.8 }}
                  className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white font-heading font-semibold text-sm">Master Landscaper</span>
                  </div>
                </motion.div>

                {/* Experience Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.0 }}
                  className="absolute top-4 right-4 bg-yellow-500/90 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4 text-white" />
                    <span className="text-white font-heading font-semibold text-sm">5+ Years</span>
                  </div>
                </motion.div>

                {/* Professional Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-4 left-4 right-4"
                >
                  <div className="bg-black/50 backdrop-blur-lg border border-white/20 p-4 rounded-xl">
                    <h3 className="text-white font-heading font-semibold text-xl mb-1">Joshua Reichley</h3>
                    <p className="text-emerald-400 font-sans font-medium text-sm mb-2">Founder & Master Landscaper</p>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>Canal Winchester, OH</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span>(220) 666-2520</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Core Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-heading font-light text-white mb-4">
              Our Core <span className="text-emerald-400">Values</span>
            </h3>
            <p className="text-lg text-white/70 font-sans max-w-2xl mx-auto">
              The principles that guide every project and client relationship
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="bg-black/30 backdrop-blur-lg border border-white/10 p-6 rounded-xl hover:bg-black/40 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 bg-${value.color}-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className={`w-6 h-6 text-${value.color}-400`} />
                </div>
                <h4 className="text-white font-heading font-semibold text-lg mb-3">{value.title}</h4>
                <p className="text-white/70 font-sans text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.0 }}
          className="bg-black/30 backdrop-blur-lg border border-white/10 p-8 lg:p-12 rounded-2xl"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl lg:text-4xl font-heading font-light text-white mb-4">
              What We <span className="text-emerald-400">Offer</span>
            </h3>
            <p className="text-lg text-white/70 font-sans max-w-3xl mx-auto">
              Comprehensive landscaping solutions for commercial and residential properties, 
              delivered with precision and care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.2 + index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-all duration-300"
              >
                <CheckCircleIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-white/90 font-sans text-sm">{service}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.4 }}
            className="text-center mt-8 pt-8 border-t border-white/10"
          >
            <p className="text-white/80 font-sans text-lg mb-6">
              Ready to transform your outdoor space? Let's collaborate to create something extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(16, 185, 129, 0)",
                    "0 0 20px rgba(16, 185, 129, 0.3)",
                    "0 0 0 rgba(16, 185, 129, 0)"
                  ]
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity },
                  scale: { duration: 0.2 },
                  y: { duration: 0.2 }
                }}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl font-heading font-thin text-lg shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 cursor-pointer relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Get Free Consultation</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Enhanced Portfolio Showcase Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.6 }}
            className="mt-12 bg-gradient-to-r from-emerald-500/10 via-green-500/5 to-emerald-500/10 backdrop-blur-lg border border-emerald-500/20 p-8 rounded-2xl"
          >
            <div className="text-center mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-flex items-center gap-3 mb-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center"
                >
                  <span className="text-emerald-400 text-lg">🎬</span>
                </motion.div>
                <h3 className="text-2xl font-heading font-light text-white">
                  Explore Our <span className="text-emerald-400">Portfolio</span>
                </h3>
              </motion.div>
              
              <p className="text-white/70 font-sans mb-6 max-w-2xl mx-auto">
                Discover the transformative power of our landscaping expertise through our curated collection
                of before-and-after showcases and client success stories.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{
                  scale: 1.08,
                  y: -3,
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(16, 185, 129, 0.4)"
                }}
                whileTap={{ scale: 0.92, rotateY: -5 }}
                animate={{
                  y: [0, -2, 0],
                  boxShadow: [
                    "0 10px 30px rgba(16, 185, 129, 0.2)",
                    "0 15px 40px rgba(16, 185, 129, 0.3)",
                    "0 10px 30px rgba(16, 185, 129, 0.2)"
                  ]
                }}
                transition={{
                  y: { duration: 2, repeat: Infinity },
                  boxShadow: { duration: 3, repeat: Infinity },
                  scale: { duration: 0.2 },
                  rotateY: { duration: 0.3 }
                }}
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-10 py-4 rounded-2xl font-heading font-thin text-lg shadow-2xl cursor-pointer relative overflow-hidden group transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
                  initial={{ x: "-200%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-300/30 to-green-300/30 opacity-0 group-hover:opacity-100"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(52, 211, 153, 0.3), rgba(34, 197, 94, 0.3))",
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(52, 211, 153, 0.3))",
                      "linear-gradient(225deg, rgba(52, 211, 153, 0.3), rgba(34, 197, 94, 0.3))",
                      "linear-gradient(315deg, rgba(34, 197, 94, 0.3), rgba(52, 211, 153, 0.3))"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.span
                  className="relative z-10 flex items-center justify-center gap-3"
                  whileHover={{
                    textShadow: "0 0 20px rgba(255, 255, 255, 0.8)"
                  }}
                >
                  <motion.span
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="text-xl"
                  >
                    🎬
                  </motion.span>
                  <motion.span
                    whileHover={{
                      scale: 1.05,
                      letterSpacing: "0.05em"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    View Portfolio Gallery
                  </motion.span>
                </motion.span>
              </motion.button>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.8 }}
                className="flex items-center gap-2 text-white/60 font-sans text-sm"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                />
                <span>50+ Featured Projects</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}