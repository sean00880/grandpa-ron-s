'use client';

import React from 'react';
import { Scissors, Shovel, Trees, Trash2, Hammer, Snowflake, Home, AlertTriangle } from 'lucide-react';
import { ServiceItem } from '../types';
import { useInView } from '../hooks/useInView';

const servicesData: ServiceItem[] = [
  {
    id: '1',
    title: 'Mulching',
    description: 'Commercial and residential mulching services to enhance your landscape.',
    icon: <Shovel size={24} className="text-green-600" />,
  },
  {
    id: '2',
    title: 'Mowing',
    description: 'Regular lawn maintenance for commercial and residential properties.',
    icon: <Scissors size={24} className="text-green-600" />,
  },
  {
    id: '3',
    title: 'Tree Removal/Pruning',
    description: 'View enhancement pruning, structural pruning, and complete tree removal.',
    icon: <Trees size={24} className="text-emerald-700" />,
  },
  {
    id: '4',
    title: 'Leaf/Junk Removal',
    description: 'Fall cleanup services and general junk removal.',
    icon: <Trash2 size={24} className="text-orange-600" />,
  },
  {
    id: '5',
    title: 'Demo/Installations',
    description: 'Demolition services and new installations for your property.',
    icon: <Hammer size={24} className="text-purple-600" />,
  },
  {
    id: '6',
    title: 'Ice & Snow Management',
    description: 'Winter services including snow removal and ice management.',
    icon: <Snowflake size={24} className="text-blue-500" />,
  },
  {
    id: '7',
    title: 'Patio/Retaining Walls',
    description: 'Paver patios and retaining wall construction.',
    icon: <Home size={24} className="text-gray-600" />,
  },
  {
    id: '8',
    title: 'Emergency Storm Damage',
    description: 'Emergency response for storm damage cleanup and repair.',
    icon: <AlertTriangle size={24} className="text-red-600" />,
  },
];

export const Services: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="services" className="relative py-32 bg-white dark:bg-zinc-950 transition-colors duration-300 min-h-screen flex items-center overflow-hidden">
      {/* Wireframe Background Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }}>
      </div>
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none bg-grid-pattern"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10" ref={ref}>
        <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2
            className="text-zinc-900 dark:text-white mb-6 tracking-tight"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-h1)',
              fontWeight: 300,
            }}
          >
            Our <span className="text-green-600 dark:text-green-500">Services</span>
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-6 rounded-full"></div>
          <p
            className="text-zinc-600 dark:text-zinc-400"
            style={{
              fontFamily: 'var(--font-subheading)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}
          >
            We are experts in commercial and residential landscaping. We collaborate closely with our customers to prioritize and deliver the highest quality work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <div 
              key={service.id}
              className={`group p-10 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-green-500/30 dark:hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-900/5 transition-all duration-500 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 shadow-sm">
                {service.icon}
              </div>
              <h3
                className="text-zinc-900 dark:text-white mb-4"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-h3)',
                  fontWeight: 500,
                }}
              >
                {service.title}
              </h3>
              <p
                className="text-zinc-600 dark:text-zinc-400"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body)',
                  lineHeight: 1.7,
                }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Fluid Gradient Transition to Next Section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-50 dark:from-zinc-900 to-transparent pointer-events-none"></div>
    </section>
  );
};