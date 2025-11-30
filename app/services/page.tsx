'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Phone,
  Shovel,
  Scissors,
  Trees,
  Flower2,
  Leaf,
  Snowflake,
  Home,
  Sprout,
  Filter,
  Star,
  Clock,
  MapPin
} from 'lucide-react';
import { serviceRegistry, Service } from '@/data/serviceRegistry';

// Map icon names to components
const iconMap: Record<string, React.ElementType> = {
  Shovel,
  Scissors,
  Trees,
  Flower2,
  Leaf,
  Snowflake,
  Home,
  Sprout,
};

// Category labels and colors
const categoryConfig: Record<Service['category'], { label: string; color: string; bgColor: string }> = {
  'lawn-care': { label: 'Lawn Care', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  'landscaping': { label: 'Landscaping', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  'tree-services': { label: 'Tree Services', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  'seasonal': { label: 'Seasonal', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  'hardscaping': { label: 'Hardscaping', color: 'text-stone-600', bgColor: 'bg-stone-100 dark:bg-stone-900/30' },
  'specialty': { label: 'Specialty', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
};

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<Service['category'] | 'all'>('all');
  const allServices = serviceRegistry.getAllServices();
  const categories = serviceRegistry.getCategories();

  const filteredServices = activeCategory === 'all'
    ? allServices
    : serviceRegistry.getServicesByCategory(activeCategory);

  const featuredServices = serviceRegistry.getFeaturedServices();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/IMG_1933.JPG"
            alt="Professional landscaping services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 via-zinc-900/60 to-zinc-950"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm mb-6">
            <Flower2 size={16} />
            <span>Full-Service Landscaping Company</span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">Services</span>
          </h1>

          <p className="text-xl text-zinc-200 mb-8 max-w-3xl mx-auto">
            From weekly lawn maintenance to complete landscape transformations,
            we offer comprehensive services to keep your property looking its best year-round.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#services"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Browse Services
              <ArrowRight size={20} />
            </a>
            <a
              href="tel:2206662520"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              (220) 666-2520
            </a>
          </div>
        </div>
      </section>

      {/* Featured Services Banner */}
      <section className="py-12 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-white">
            <div className="flex items-center gap-2">
              <Star size={20} fill="currentColor" />
              <span className="font-semibold">24+ Locations Served</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span className="font-semibold">Free Estimates</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span className="font-semibold">Locally Owned</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section id="services" className="py-12 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Filter size={20} className="text-zinc-500" />
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Filter by category:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-green-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              All Services ({allServices.length})
            </button>

            {categories.map((category) => {
              const config = categoryConfig[category];
              const count = serviceRegistry.getServicesByCategory(category).length;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    activeCategory === category
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-green-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const IconComponent = iconMap[service.icon] || Flower2;
              const categoryStyle = categoryConfig[service.category];

              return (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:border-green-500 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.heroImage}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent"></div>

                    {/* Category Badge */}
                    <div className={`absolute top-4 left-4 ${categoryStyle.bgColor} ${categoryStyle.color} px-3 py-1 rounded-full text-xs font-semibold`}>
                      {categoryStyle.label}
                    </div>

                    {/* Featured Badge */}
                    {service.featured && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 ${categoryStyle.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={categoryStyle.color} size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-green-600 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {service.pricing.priceRange || `From $${service.pricing.basePrice}`}
                        </p>
                      </div>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                      {service.shortDescription}
                    </p>

                    {/* Availability */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Clock size={14} />
                        <span>{service.availability.leadTime}</span>
                      </div>

                      <span className="text-green-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Learn More
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Ready to Transform Your Property?
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Contact us today for a free estimate. We serve 24 cities throughout Central Ohio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-green-600 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Get Free Quote
              <ArrowRight size={20} />
            </Link>
            <a
              href="tel:2206662520"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              (220) 666-2520
            </a>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Serving <span className="text-green-600">24 Communities</span> in Central Ohio
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            From Canal Winchester to Columbus and everywhere in between, we bring professional
            landscaping services to your neighborhood.
          </p>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-6 py-3 rounded-full font-semibold border border-zinc-200 dark:border-zinc-700 hover:border-green-500 transition-all"
          >
            <MapPin size={18} />
            View All Service Areas
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
