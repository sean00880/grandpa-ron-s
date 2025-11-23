'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Search, TrendingUp, Users } from 'lucide-react';
import { locations, getLocationsByDistance, getPriorityLocations } from '@/data/locations';

export default function ServiceAreasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistance, setFilterDistance] = useState<string>('all');
  
  const closeLocations = getLocationsByDistance('0-10 miles');
  const midLocations = getLocationsByDistance('10-20 miles');
  const highPriorityLocations = getPriorityLocations('high');

  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistance = filterDistance === 'all' || loc.distance_category === filterDistance;
    return matchesSearch && matchesDistance;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Service <span className="text-green-600">Areas</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
            Professional landscaping services across <strong>24 communities</strong> within 20 miles of Canal Winchester, Ohio
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-zinc-900 dark:text-white"
              />
            </div>
            <select
              value={filterDistance}
              onChange={(e) => setFilterDistance(e.target.value)}
              className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-zinc-900 dark:text-white cursor-pointer"
            >
              <option value="all">All Distances</option>
              <option value="0-10 miles">0-10 miles</option>
              <option value="10-20 miles">10-20 miles</option>
            </select>
          </div>
        </div>

        {/* Service Area Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-20 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800">
            <MapPin className="text-green-600 mb-3" size={32} />
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">24</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Locations Served</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
            <Navigation className="text-blue-600 mb-3" size={32} />
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">20mi</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Service Radius</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800">
            <Users className="text-purple-600 mb-3" size={32} />
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">1.3M+</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Residents Served</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-800">
            <TrendingUp className="text-orange-600 mb-3" size={32} />
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">5★</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Average Rating</div>
          </div>
        </div>

        {/* High Priority Locations */}
        <div className="mb-20">
          <h2 className="text-3xl font-heading font-bold mb-8 flex items-center gap-3">
            <TrendingUp className="text-green-600" size={32} />
            Featured Locations
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {highPriorityLocations.slice(0, 6).map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="group bg-white dark:bg-zinc-900 border-2 border-green-200 dark:border-green-800 hover:border-green-500 dark:hover:border-green-500 rounded-2xl p-8 transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold group-hover:text-green-600 transition-colors">
                      {location.name}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">{location.type}</p>
                  </div>
                  <MapPin className="text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" size={24} />
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Distance:</span>
                    <span className="font-semibold">{location.distance_miles} miles {location.direction}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Population:</span>
                    <span className="font-semibold">{location.population.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Competition:</span>
                    <span className={`font-semibold ${
                      location.competition === 'low' ? 'text-green-600' : 
                      location.competition === 'medium' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {location.competition}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-green-600 font-semibold group-hover:underline">
                    View Services →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Locations by Distance */}
        <div className="space-y-16">
          {/* Close Locations (0-10 miles) */}
          <div>
            <h2 className="text-3xl font-heading font-bold mb-8 flex items-center gap-3">
              <Navigation className="text-green-600" size={32} />
              Close By (0-10 miles)
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {closeLocations.map((location) => (
                <Link
                  key={location.slug}
                  href={`/locations/${location.slug}`}
                  className="group bg-zinc-50 dark:bg-zinc-900 hover:bg-green-50 dark:hover:bg-green-900/20 border border-zinc-200 dark:border-zinc-800 hover:border-green-500 rounded-xl p-6 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">
                        {location.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">{location.distance_miles} mi {location.direction}</p>
                    </div>
                    <MapPin className="text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" size={18} />
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Pop: {location.population.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Mid-Range Locations (10-20 miles) */}
          <div>
            <h2 className="text-3xl font-heading font-bold mb-8 flex items-center gap-3">
              <MapPin className="text-blue-600" size={32} />
              Extended Service Area (10-20 miles)
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {midLocations.map((location) => (
                <Link
                  key={location.slug}
                  href={`/locations/${location.slug}`}
                  className="group bg-zinc-50 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 rounded-xl p-6 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                        {location.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">{location.distance_miles} mi {location.direction}</p>
                    </div>
                    <MapPin className="text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform" size={18} />
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Pop: {location.population.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-heading font-bold mb-4">
            Don't See Your Location?
          </h2>
          <p className="text-xl mb-8 text-green-50">
            We may still serve your area! Contact us to find out.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quote"
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1"
            >
              Request a Quote
            </Link>
            <a
              href="tel:2206662520"
              className="bg-green-700 text-white hover:bg-green-800 px-8 py-4 rounded-full font-bold text-lg transition-all"
            >
              Call (220) 666-2520
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
