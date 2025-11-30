'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play, ChevronDown, MapPin, ChevronUp, Search } from 'lucide-react';
import { locationRegistry } from '../services/locationRegistry';

export const Hero: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const locationCategories = locationRegistry?.getLocationsByCategories() ?? {};
  const allLocations = locationRegistry?.getAllLocations() ?? [];

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window?.scrollY ?? 0);
    };
    window?.addEventListener('scroll', handleScroll);
    return () => window?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLocationSelect = (slug: string) => {
    if (slug) {
      router.push(`/locations/${slug}`);
      setIsLocationExpanded(false);
    }
  };

  const filteredLocations = searchQuery
    ? allLocations?.filter(loc =>
        loc?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase() ?? '')
      ) ?? []
    : allLocations;

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${offset * 0.5}px)` }}
      >
        <img
          src="https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=2070&auto=format&fit=crop"
          alt="Modern landscape architecture"
          className="w-full h-full object-cover scale-110 animate-slow-pan opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 via-zinc-900/30 to-zinc-950"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center" style={{ transform: `translateY(${offset * 0.2}px)` }}>
        <span className="inline-block py-1.5 px-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium uppercase tracking-widest mb-8 animate-fade-in shadow-2xl">
           Serving 24 Cities in Central Ohio
        </span>
        
        <h1
          className="mb-8 leading-none text-white tracking-tight animate-fade-in-up shadow-black drop-shadow-lg"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-display)',
            fontWeight: 300,
          }}
        >
          Professional <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
            Landscaping Services
          </span>
        </h1>

        <p
          className="text-zinc-200 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-100 drop-shadow-md"
          style={{
            fontFamily: 'var(--font-subheading)',
            fontSize: 'var(--text-body-lg)',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}
        >
          Creating customer experiences and relationships that last generations.
          Quality landscaping with traditional values and modern technology.
        </p>

        {/* Expandable Location Selector */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up delay-150">
          {!isLocationExpanded ? (
            <button
              onClick={() => setIsLocationExpanded(true)}
              className="w-full max-w-md mx-auto bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-2 border-white/20 rounded-full px-6 py-4 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-2xl flex items-center justify-between"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
            >
              <div className="flex items-center gap-3">
                <MapPin className="text-green-600" size={20} />
                <span>Select Your Location</span>
              </div>
              <ChevronDown size={20} className="text-zinc-400" />
            </button>
          ) : (
            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 max-h-[400px] overflow-hidden">
              {/* Header with Search */}
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-zinc-900 dark:text-white"
                  style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 600 }}
                >
                  Choose Your City
                </h3>
                <button
                  onClick={() => setIsLocationExpanded(false)}
                  className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  <ChevronUp size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value ?? '')}
                  placeholder="Search cities..."
                  className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Locations Grid */}
              <div className="overflow-y-auto max-h-[250px] pr-2 space-y-1">
                {searchQuery ? (
                  // Show filtered results
                  filteredLocations?.map((loc) => (
                    <button
                      key={loc?.slug}
                      onClick={() => handleLocationSelect(loc?.slug ?? '')}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 flex items-center justify-between group"
                    >
                      <span className="font-medium">{loc?.name}</span>
                      <span className="text-sm text-zinc-500 group-hover:text-green-600">
                        {loc?.distance_miles?.toFixed(1)} mi
                      </span>
                    </button>
                  ))
                ) : (
                  // Show categorized locations
                  Object.entries(locationCategories)?.map(([category, locs]) => (
                    locs?.length > 0 && (
                      <div key={category} className="mb-4">
                        <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-4 py-2">
                          {category}
                        </h4>
                        <div className="space-y-1">
                          {(locs as any[])?.map((loc) => (
                            <button
                              key={loc?.slug}
                              onClick={() => handleLocationSelect(loc?.slug ?? '')}
                              className="w-full text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 flex items-center justify-between group"
                            >
                              <span className="font-medium">{loc?.name}</span>
                              <span className="text-sm text-zinc-500 group-hover:text-green-600">
                                {loc?.distance_miles?.toFixed(1)} mi
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  ))
                )}
              </div>

              {/* View All Link */}
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => router.push('/locations')}
                  className="w-full text-center text-green-600 hover:text-green-500 font-semibold text-sm transition-colors"
                >
                  View All 24 Locations →
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up delay-200">
          <a
            href="/quote"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:shadow-[0_0_30px_rgba(22,163,74,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2 group"
          >
            Request a Quote
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="tel:2206662520"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
          >
            <Play size={18} fill="currentColor" /> (220) 666-2520
          </a>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow opacity-70 hover:opacity-100 transition-opacity cursor-pointer z-20">
        <span className="text-[10px] uppercase tracking-widest text-white/70">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
        <ChevronDown className="text-white" size={20} />
      </div>
      
      {/* Fluid Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent z-10"></div>
    </section>
  );
};