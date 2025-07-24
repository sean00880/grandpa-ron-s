'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

// Animated Lawncare Elements
const AnimatedGrassBlades = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-full"
          style={{
            left: `${(i * 2) % 100}%`,
            height: `${20 + Math.random() * 30}px`,
          }}
          animate={{
            scaleY: [1, 1.1, 1],
            rotate: [0, Math.random() * 4 - 2, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

const AnimatedLawnMower = () => {
  return (
    <motion.div
      className="absolute bottom-8 left-0 w-16 h-8"
      animate={{
        x: ['0%', '100vw'],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="relative w-full h-full">
        {/* Mower Body */}
        <div className="absolute bottom-0 left-0 w-12 h-6 bg-gradient-to-r from-red-600 to-red-500 rounded-lg shadow-lg" />
        {/* Wheels */}
        <motion.div
          className="absolute bottom-0 left-1 w-3 h-3 bg-gray-800 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 right-1 w-3 h-3 bg-gray-800 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Handle */}
        <div className="absolute bottom-4 left-6 w-1 h-8 bg-gray-600 rounded-t-full" />
        {/* Grass Particles */}
        <motion.div
          className="absolute bottom-6 left-2 w-2 h-2"
          animate={{
            y: [0, -10, 0],
            x: [0, -5, 0],
            opacity: [1, 0.5, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          <div className="w-1 h-1 bg-emerald-400 rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  )
}

const AnimatedFlowers = () => {
  const flowers = [
    { x: 10, delay: 0, color: 'from-pink-400 to-pink-600' },
    { x: 25, delay: 1, color: 'from-yellow-400 to-yellow-600' },
    { x: 40, delay: 2, color: 'from-purple-400 to-purple-600' },
    { x: 60, delay: 0.5, color: 'from-red-400 to-red-600' },
    { x: 80, delay: 1.5, color: 'from-blue-400 to-blue-600' },
  ]

  return (
    <>
      {flowers.map((flower, i) => (
        <motion.div
          key={i}
          className="absolute bottom-8"
          style={{ left: `${flower.x}%` }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: flower.delay, duration: 1 }}
        >
          <motion.div
            className={`w-4 h-4 bg-gradient-to-br ${flower.color} rounded-full relative`}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: flower.delay,
            }}
          >
            {/* Petals */}
            {[...Array(6)].map((_, j) => (
              <div
                key={j}
                className={`absolute w-2 h-2 bg-gradient-to-br ${flower.color} rounded-full`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${j * 60}deg) translateY(-6px)`,
                }}
              />
            ))}
            {/* Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-300 rounded-full" />
          </motion.div>
          {/* Stem */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-green-500" />
        </motion.div>
      ))}
    </>
  )
}

const AnimatedButterflies = () => {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            x: [0, 100, 200, 300, 200, 100, 0],
            y: [50, 30, 60, 40, 70, 35, 50],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            delay: i * 3,
          }}
          style={{
            left: `${20 + i * 30}%`,
            bottom: `${60 + i * 20}px`,
          }}
        >
          <motion.div
            className="relative w-4 h-3"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {/* Wings */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full transform -rotate-12" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full transform rotate-12" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full transform -rotate-12" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full transform rotate-12" />
            {/* Body */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-gray-800 rounded-full" />
          </motion.div>
        </motion.div>
      ))}
    </>
  )
}

export default function ModernFooter() {
  const [hoveredSection, setHoveredSection] = useState(null)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Lawn Mowing", href: "/services/mowing" },
        { name: "Mulching", href: "/services/mulching" },
        { name: "Tree Services", href: "/services/tree-removal-and-pruning" },
        { name: "Patio Installation", href: "/services/patio" },
        { name: "Snow Removal", href: "/services/ice-and-snow-management" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/team" },
        { name: "Testimonials", href: "/testimonials" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Contact", href: "/contact" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Free Estimate", href: "/estimate" },
        { name: "Maintenance Tips", href: "/tips" },
        { name: "Seasonal Guide", href: "/seasonal" },
        { name: "FAQ", href: "/faq" },
        { name: "Blog", href: "/blog" },
      ]
    }
  ]

  return (
    <footer 
      ref={containerRef}
      className="relative bg-gradient-to-br from-black via-zinc-900 to-emerald-900 overflow-hidden"
    >
      {/* Animated Lawncare Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedGrassBlades />
        <AnimatedLawnMower />
        <AnimatedFlowers />
        <AnimatedButterflies />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Image
                  src="/img/white.png"
                  alt="Grandpa Ron's Landscaping Logo"
                  width={300}
                  height={120}
                  className="h-auto"
                  style={{ objectFit: 'contain' }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-lg"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl text-white/80 leading-relaxed max-w-lg"
              >
                Transforming Canal Winchester properties into extraordinary outdoor sanctuaries with professional landscaping excellence since 2019.
              </motion.p>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="space-y-4"
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 text-white/90 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-emerald-500/30">
                    <FaPhone className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold">(220) 666-2520</p>
                    <p className="text-sm text-white/60">24/7 Emergency Service</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 text-white/90 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-emerald-500/30">
                    <FaEnvelope className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold">fgreatful@gmail.com</p>
                    <p className="text-sm text-white/60">Get Your Free Estimate</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 text-white/90 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-emerald-500/30">
                    <FaMapMarkerAlt className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Canal Winchester, OH</p>
                    <p className="text-sm text-white/60">Serving Columbus Area</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-black/40 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3), rgba(16, 185, 129, 0.1))',
                backdropFilter: 'blur(25px)'
              }}
            >
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10">
                <motion.h3
                  className="text-3xl font-heading font-bold text-white mb-4"
                  style={{ textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}
                >
                  Ready to Transform Your Landscape?
                </motion.h3>

                <motion.p
                  className="text-white/80 text-lg mb-8 leading-relaxed"
                >
                  Join hundreds of satisfied homeowners who trust us with their outdoor spaces. Get your free consultation today!
                </motion.p>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/contact">
                    <motion.button
                      className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-heading font-semibold text-lg shadow-2xl relative overflow-hidden group"
                      whileHover={{
                        boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)"
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
                        initial={{ x: "-200%" }}
                        whileHover={{ x: "200%" }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <FaPhone />
                        Get Free Estimate Now
                        <motion.svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </motion.svg>
                      </span>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Links Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredSection(index)}
                onHoverEnd={() => setHoveredSection(null)}
                className="space-y-6"
              >
                <motion.h4
                  className="text-2xl font-heading font-bold text-white relative"
                  style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.3)' }}
                >
                  {section.title}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400"
                    initial={{ width: 0 }}
                    animate={{ width: hoveredSection === index ? '100%' : '30%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.h4>

                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index * 0.1) + (linkIndex * 0.05), duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <Link href={link.href}>
                        <motion.span
                          whileHover={{ x: 5, color: '#10b981' }}
                          className="text-white/70 hover:text-emerald-400 transition-all duration-300 cursor-pointer flex items-center gap-2 group"
                        >
                          <motion.div
                            className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100"
                            whileHover={{ scale: 1.5 }}
                          />
                          {link.name}
                        </motion.span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Social Media & Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Social Media */}
              <div className="flex items-center gap-4">
                <span className="text-white/60 font-medium">Follow Us:</span>
                {[
                  { icon: FaFacebookF, href: "https://www.facebook.com/", color: "hover:text-blue-400" },
                  { icon: FaInstagram, href: "https://www.instagram.com/", color: "hover:text-pink-400" },
                  { icon: FaTwitter, href: "https://www.twitter.com/", color: "hover:text-blue-300" },
                  { icon: FaLinkedinIn, href: "https://www.linkedin.com/", color: "hover:text-blue-500" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-white/70 ${social.color} transition-all duration-300 border border-white/20 hover:border-emerald-400/50`}
                  >
                    <social.icon className="text-lg" />
                  </motion.a>
                ))}
              </div>

              {/* Copyright */}
              <div className="text-center md:text-right">
                <p className="text-white/60 text-sm mb-2">
                  © 2024 GRANDPA RON'S LAWN AND LANDSCAPE, LLC. ALL RIGHTS RESERVED
                </p>
                <motion.a
                  href="https://www.sitedominion.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="text-emerald-400/80 hover:text-emerald-400 text-xs transition-colors"
                >
                  Website Developed by: Site Dominion LLC
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}