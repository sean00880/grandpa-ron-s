'use client'

import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { LawncareLogo } from './lawncare-logo'

const menuItems = [
    { name: 'Services', href: '#services' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
    { name: 'Locations', href: '/locations' },
    { name: 'Reviews', href: '#reviews' },
]

export const LawncareHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className={cn(
                    'fixed z-50 w-full transition-all duration-300',
                    isScrolled
                        ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-sm py-2'
                        : 'bg-transparent py-4'
                )}>
                <div className="mx-auto max-w-6xl px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/"
                            aria-label="home"
                            className="flex items-center">
                            <LawncareLogo />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex lg:items-center lg:gap-8">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={cn(
                                        'text-sm font-medium transition-colors hover:text-green-600',
                                        isScrolled
                                            ? 'text-zinc-700 dark:text-zinc-300'
                                            : 'text-white/90 hover:text-white'
                                    )}>
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-3">
                            <a
                                href="tel:2206662520"
                                className={cn(
                                    'hidden md:flex items-center gap-2 text-sm font-semibold transition-colors',
                                    isScrolled
                                        ? 'text-green-600 hover:text-green-700'
                                        : 'text-white hover:text-green-300'
                                )}>
                                <Phone size={16} />
                                (220) 666-2520
                            </a>

                            <Button
                                asChild
                                size="sm"
                                className="hidden sm:inline-flex bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
                                <Link href="/quote">Get Free Quote</Link>
                            </Button>

                            {/* Mobile menu toggle */}
                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className={cn(
                                    'lg:hidden relative z-20 p-2 rounded-full transition-colors',
                                    isScrolled
                                        ? 'text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                        : 'text-white hover:bg-white/10'
                                )}>
                                {menuState ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={cn(
                        'lg:hidden fixed inset-x-0 top-0 z-10 bg-white dark:bg-zinc-950 transition-all duration-300 ease-in-out',
                        menuState
                            ? 'opacity-100 translate-y-0 pt-20 pb-8 shadow-xl'
                            : 'opacity-0 -translate-y-full pointer-events-none'
                    )}>
                    <div className="mx-auto max-w-6xl px-6 space-y-4">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={() => setMenuState(false)}
                                className="block py-3 text-lg font-medium text-zinc-900 dark:text-white hover:text-green-600 transition-colors border-b border-zinc-100 dark:border-zinc-800">
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-4 space-y-3">
                            <a
                                href="tel:2206662520"
                                className="flex items-center justify-center gap-2 py-3 text-green-600 font-semibold">
                                <Phone size={18} />
                                (220) 666-2520
                            </a>
                            <Button
                                asChild
                                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                                <Link href="/quote">Get Free Quote</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
