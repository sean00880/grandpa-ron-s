import Link from 'next/link'
import { LawncareLogo } from './lawncare-logo'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

const services = [
    { title: 'Lawn Mowing', href: '/services/mowing' },
    { title: 'Landscaping', href: '/services/landscaping' },
    { title: 'Tree Removal', href: '/services/tree-removal' },
    { title: 'Mulching', href: '/services/mulching' },
    { title: 'Hardscaping', href: '/services/hardscaping' },
    { title: 'Irrigation', href: '/services/irrigation' },
]

const company = [
    { title: 'About Us', href: '/about' },
    { title: 'Our Team', href: '/team' },
    { title: 'Careers', href: '/careers' },
    { title: 'Reviews', href: '#reviews' },
    { title: 'Blog', href: '/blog' },
]

const locations = [
    { title: 'Columbus', href: '/locations/columbus' },
    { title: 'Dublin', href: '/locations/dublin' },
    { title: 'Westerville', href: '/locations/westerville' },
    { title: 'Powell', href: '/locations/powell' },
    { title: 'View All Locations', href: '/locations' },
]

const socialLinks = [
    {
        name: 'Facebook',
        href: 'https://facebook.com',
        icon: (
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" />
            </svg>
        ),
    },
    {
        name: 'Instagram',
        href: 'https://instagram.com',
        icon: (
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3" />
            </svg>
        ),
    },
    {
        name: 'YouTube',
        href: 'https://youtube.com',
        icon: (
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
            </svg>
        ),
    },
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: (
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" />
            </svg>
        ),
    },
]

export default function LawncareFooter() {
    return (
        <footer className="bg-zinc-900 dark:bg-zinc-950 pt-16 pb-8">
            <div className="mx-auto max-w-6xl px-6">
                {/* Main Footer Content */}
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 pb-12 border-b border-zinc-800">
                    {/* Company Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <LawncareLogo className="text-white [&_span]:text-white" />
                        <p className="text-zinc-400 max-w-sm">
                            Family-owned and operated since 1985. We&apos;re committed to providing
                            exceptional landscaping services with traditional values and modern techniques.
                        </p>
                        <div className="space-y-3">
                            <a
                                href="tel:2206662520"
                                className="flex items-center gap-3 text-zinc-300 hover:text-green-400 transition-colors"
                            >
                                <Phone className="size-4" />
                                <span>(220) 666-2520</span>
                            </a>
                            <a
                                href="mailto:info@grandparons.com"
                                className="flex items-center gap-3 text-zinc-300 hover:text-green-400 transition-colors"
                            >
                                <Mail className="size-4" />
                                <span>info@grandparons.com</span>
                            </a>
                            <div className="flex items-center gap-3 text-zinc-300">
                                <MapPin className="size-4" />
                                <span>Central Ohio</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-300">
                                <Clock className="size-4" />
                                <span>Mon-Sat: 7AM - 7PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Services</h3>
                        <ul className="space-y-3">
                            {services.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-zinc-400 hover:text-green-400 transition-colors text-sm"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-3">
                            {company.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-zinc-400 hover:text-green-400 transition-colors text-sm"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Locations */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Locations</h3>
                        <ul className="space-y-3">
                            {locations.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-zinc-400 hover:text-green-400 transition-colors text-sm"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.name}
                                className="text-zinc-400 hover:text-green-400 transition-colors"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>

                    {/* Copyright */}
                    <p className="text-zinc-500 text-sm text-center md:text-right">
                        © {new Date().getFullYear()} Grandpa Ron&apos;s Landscaping. All rights reserved.
                    </p>
                </div>

                {/* Legal Links */}
                <div className="mt-6 flex flex-wrap justify-center md:justify-end gap-6 text-xs text-zinc-500">
                    <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="hover:text-zinc-400 transition-colors">
                        Terms of Service
                    </Link>
                    <Link href="/accessibility" className="hover:text-zinc-400 transition-colors">
                        Accessibility
                    </Link>
                </div>
            </div>
        </footer>
    )
}
