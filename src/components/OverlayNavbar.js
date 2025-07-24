'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function OverlayNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-lg shadow-xl'
          : 'bg-black/60 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center hover:scale-105 transition-transform duration-200">
            <Image
              src="/img/white.png"
              alt="Grandpa Ron's Lawn & Landscape Logo"
              width={180}
              height={60}
              className="h-14 w-auto object-contain"
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="!text-white hover:!text-emerald-300 font-medium text-base transition-all duration-200 hover:scale-105 drop-shadow-lg"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center gap-6">
            {/* Contact Info */}
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-lg">📞</span>
                <span className="font-semibold text-lg">(220) 666-2520</span>
              </div>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-lg">📍</span>
                <span className="font-medium">Canal Winchester</span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-heading font-thin text-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 cursor-pointer">
              Free Quote
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-lg border-t border-white/10 transition-all duration-300">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block !text-white hover:!text-emerald-300 font-medium text-base py-2 transition-colors duration-200 drop-shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Contact Info */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white">
                <span className="text-emerald-400">📞</span>
                <span className="font-semibold">(220) 666-2520</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-emerald-400">📍</span>
                <span>Canal Winchester</span>
              </div>
              <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-heading font-thin shadow-lg mt-4 hover:scale-95 transition-transform duration-200 cursor-pointer">
                Free Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}