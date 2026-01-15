'use client';
import Image from 'next/image';

import React from 'react';
import Link from 'next/link';
import { Sprout, Instagram, Facebook, Twitter, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 py-20 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-8">
              <div className="relative" style={{ width: '180px', height: '56px' }}>
                {/* Light mode logo */}
                <Image
                  src="/img/logo_light.png"
                  alt="Grandpa Ron's Logo"
                  fill
                  className="object-contain dark:hidden"
                />
                {/* Dark mode logo */}
                <Image
                  src="/img/logo_dark.png"
                  alt="Grandpa Ron's Logo"
                  fill
                  className="object-contain hidden dark:block"
                />
              </div>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8 text-lg leading-relaxed">
              Our goal is to create a customer experience and relationship that lasts generations. Founded in 2021 with Grandpa Ron's vision and values in mind.
            </p>
            <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white transition-all transform hover:scale-110"><Instagram size={20} /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all transform hover:scale-110"><Facebook size={20} /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all transform hover:scale-110"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-zinc-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-4 text-zinc-500 dark:text-zinc-400">
              <li><Link href="/#services" className="hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-green-600 transition-all"></span> Services</Link></li>
              <li><Link href="/about" className="hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-green-600 transition-all"></span> About Us</Link></li>
              <li><Link href="/locations" className="hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-green-600 transition-all"></span> Service Areas</Link></li>
              <li><Link href="/contact" className="hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-green-600 transition-all"></span> Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-zinc-900 dark:text-white">Contact</h4>
            <ul className="space-y-4 text-zinc-500 dark:text-zinc-400">
              <li className="font-medium text-zinc-900 dark:text-white">(220) 666-2520</li>
              <li>fgreatful@gmail.com</li>
              <li>Canal Winchester, OH<br/>Columbus, Ohio Area</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-zinc-400 dark:text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} Grandpa Ron's Lawns and Landscape LLC. All rights reserved.
          </div>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-green-600 transition-colors"
          >
            Back to Top <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};