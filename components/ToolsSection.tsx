'use client';

import React, { useState } from 'react';
import { VirtualPlanner } from './VirtualPlanner';
import { PropertyAudit } from './PropertyAudit';
import { Wand2, Activity } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export const ToolsSection: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'visualizer' | 'audit'>('visualizer');
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="tools" className="relative py-32 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300 min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-blueprint opacity-40 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10" ref={ref}>
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-heading font-normal text-5xl md:text-6xl text-zinc-900 dark:text-white mb-6 tracking-tight">Intelligent Landscape Tools</h2>
          <p className="font-subheading text-zinc-600 dark:text-zinc-400 text-xl italic">
            Leverage our Gemini-powered suite to design your dream yard or diagnose its health.
          </p>
        </div>

        {/* Tabs */}
        <div className={`flex justify-center mb-16 transition-all duration-1000 delay-200 transform ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-white dark:bg-zinc-950 p-2 rounded-full shadow-lg shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-200 dark:border-zinc-800 inline-flex relative">
            <button
              onClick={() => setActiveTool('visualizer')}
              className={`relative z-10 px-8 py-3 rounded-full text-base font-medium flex items-center gap-2 transition-all duration-300 ${
                activeTool === 'visualizer' 
                  ? 'bg-green-600 text-white shadow-md transform scale-105' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
            >
              <Wand2 size={18} /> AI Visualizer
            </button>
            <button
              onClick={() => setActiveTool('audit')}
              className={`relative z-10 px-8 py-3 rounded-full text-base font-medium flex items-center gap-2 transition-all duration-300 ${
                activeTool === 'audit' 
                  ? 'bg-green-600 text-white shadow-md transform scale-105' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
            >
              <Activity size={18} /> Health Audit
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`transition-all duration-1000 delay-300 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {activeTool === 'visualizer' ? (
            <div className="shadow-2xl rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <VirtualPlanner />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
                 <PropertyAudit />
            </div>
          )}
        </div>
      </div>
      
      {/* Fluid Gradient Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900 dark:from-zinc-950 to-transparent pointer-events-none"></div>
    </section>
  );
};