'use client';
import Image from 'next/image';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, ChevronDown, Sun, Moon, User as UserIcon, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { locations } from '../data/locations';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = pathname;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const { user, login, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDashboard = currentPath === '/dashboard';
  const isHomePage = currentPath === '/';

  // Get featured locations for megamenu
  const featuredLocations = locations.filter(loc => loc.priority === 'high').slice(0, 12);

  const megaMenuData = {
    Services: [
      { title: 'Mulching', href: '/#services', desc: 'Commercial and residential mulching' },
      { title: 'Mowing', href: '/#services', desc: 'Regular lawn maintenance' },
      { title: 'Tree Removal/Pruning', href: '/#services', desc: 'View enhancement & structural pruning' },
      { title: 'Landscaping', href: '/#services', desc: 'Complete landscape design & installation' },
      { title: 'Lawn Treatments', href: '/#services', desc: 'Fertilization & weed control' },
      { title: 'Gutter Cleaning', href: '/#services', desc: 'Keep your gutters clear' },
      { title: 'Leaf Removal', href: '/#services', desc: 'Fall cleanup services' },
      { title: 'Snow Removal', href: '/#services', desc: 'Winter snow management' },
    ],
    Locations: featuredLocations.map(loc => ({
      title: loc?.name ?? '',
      href: `/locations/${loc?.slug ?? ''}`,
      desc: `${loc?.distance_miles?.toFixed(1) ?? '0'} miles away`
    })),
    Tools: [
      { title: 'AI Visualizer', href: '/#tools', desc: 'See your new yard instantly' },
      { title: 'Property Audit', href: '/#tools', desc: 'Get a health score for your lawn' },
      { title: 'Cost Calculator', href: '/#tools', desc: 'Estimate renovation costs' },
      { title: 'Get a Quote', href: '/quote', desc: 'Free, no-obligation estimate' },
    ],
    Company: [
      { title: 'About Us', href: '/about', desc: 'Our mission and values' },
      { title: 'Service Areas', href: '/locations', desc: 'All 24 locations we serve' },
      { title: 'Contact', href: '/contact', desc: 'Get in touch with us' },
    ]
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isDashboard || mobileMenuOpen
          ? 'bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-6'
      }`}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="cursor-pointer select-none z-50 relative"
        >
          <div className="relative" style={{ width: '190px', height: '60px' }}>
            {/* Light mode logo */}
            <Image
              src="/img/logo_light.png"
              alt="Grandpa Ron's Logo"
              fill
              className="object-contain dark:hidden"
              priority
            />
            {/* Dark mode logo */}
            <Image
              src="/img/logo_dark.png"
              alt="Grandpa Ron's Logo"
              fill
              className="object-contain hidden dark:block"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        {!isDashboard && (
          <div className="hidden md:flex items-center gap-1">
            {Object.keys(megaMenuData).map((key) => (
              <div key={key} className="relative group px-4 py-2">
                <button
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    isScrolled || activeDropdown ? 'text-zinc-600 dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-400' : 'text-white/90 hover:text-white'
                  }`}
                  onMouseEnter={() => setActiveDropdown(key)}
                  onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                >
                  {key} <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-3">
           {/* Phone Number */}
           {!isDashboard && (
             <a 
               href="tel:2206662520"
               className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                 isScrolled 
                   ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700' 
                   : 'bg-white/10 text-white hover:bg-white/20'
               }`}
             >
               <Phone size={16} />
               <span>(220) 666-2520</span>
             </a>
           )}

           {/* Get Quote Button */}
           {!isDashboard && (
             <Link 
               href="/quote"
               className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg hover:-translate-y-0.5"
             >
               Get Quote
             </Link>
           )}

           {/* Theme Toggle */}
           <button 
             onClick={toggleTheme}
             className={`p-2 rounded-full transition-colors ${
               isScrolled || isDashboard 
                 ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700' 
                 : 'bg-white/10 text-white hover:bg-white/20'
             }`}
           >
             {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
           </button>

           {user ? (
              <div className="flex items-center gap-3 ml-2">
                <Link 
                  href="/dashboard"
                  className="flex items-center gap-2 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                {isDashboard && user?.avatar && (
                   <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                       <Image src={user?.avatar ?? ''} alt="" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
                   </div>
                )}
              </div>
            ) : (
              <button 
                onClick={login}
                disabled={isLoading}
                className="ml-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Sign In'}
              </button>
            )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4 z-50">
           <button 
             onClick={toggleTheme}
             className={`p-2 rounded-full ${
               isScrolled || isDashboard || mobileMenuOpen ? 'text-zinc-800 dark:text-zinc-200' : 'text-white'
             }`}
           >
             {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
           </button>
           <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={isScrolled || isDashboard || mobileMenuOpen ? "text-zinc-900 dark:text-white" : "text-white"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mega Menu Dropdown (Desktop) */}
      {activeDropdown && !isDashboard && (
        <div 
          className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 shadow-xl py-8 animate-fade-in z-40"
          onMouseEnter={() => setActiveDropdown(activeDropdown)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="container mx-auto px-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{activeDropdown}</h3>
              {activeDropdown === 'Locations' && (
                <Link href="/locations" className="text-sm text-green-600 hover:text-green-500 font-semibold">
                  View All 24 Locations →
                </Link>
              )}
            </div>
            <div className={`grid gap-6 ${activeDropdown === 'Locations' ? 'grid-cols-4' : 'grid-cols-4'}`}>
              {megaMenuData[activeDropdown as keyof typeof megaMenuData]?.map((item: any) => (
                <Link 
                  key={item.title} 
                  href={item.href} 
                  className="group block p-3 -mx-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => setActiveDropdown(null)}
                >
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-green-600 dark:group-hover:text-green-400 mb-1">{item.title}</div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-white dark:bg-zinc-950 z-40 overflow-y-auto md:hidden">
          <div className="p-6 space-y-6">
             {Object.entries(megaMenuData).map(([category, items]) => (
               <div key={category}>
                 <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">{category}</h3>
                 <div className="space-y-3 pl-4 border-l-2 border-zinc-100 dark:border-zinc-800">
                   {items.map((item) => (
                     <Link 
                        key={item.title} 
                        href={item.href} 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                     >
                       {item.title}
                     </Link>
                   ))}
                 </div>
               </div>
             ))}
             <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                {user ? (
                   <div className="space-y-3">
                      {user?.avatar && (
                        <div className="flex items-center gap-3 mb-4">
                           <Image src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                           <div>
                              <p className="font-bold text-zinc-900 dark:text-white">{user.name}</p>
                              <p className="text-xs text-zinc-500">{user.email}</p>
                           </div>
                        </div>
                      )}
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold block text-center">Go to Dashboard</Link>
                      <button onClick={logout} className="w-full text-red-500 py-3 font-medium">Sign Out</button>
                   </div>
                ) : (
                   <button onClick={() => {login(); setMobileMenuOpen(false)}} className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-xl font-bold">Sign In</button>
                )}
             </div>
          </div>
        </div>
      )}
    </header>
  );
};