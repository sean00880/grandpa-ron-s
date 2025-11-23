'use client';

import React from 'react';
import { Camera, Sparkles, Hammer, ArrowRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export const HowItWorks: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const steps = [
    {
      icon: <Camera className="text-white" size={28} />,
      title: "1. Snap & Upload",
      desc: "Take a photo of your yard. Our system analyzes terrain, sunlight, and soil conditions instantly."
    },
    {
      icon: <Sparkles className="text-white" size={28} />,
      title: "2. AI Design & Quote",
      desc: "Visualize new designs and get an instant, itemized quote based on local material costs."
    },
    {
      icon: <Hammer className="text-white" size={28} />,
      title: "3. Expert Execution",
      desc: "Approve the plan and our professional crew brings the vision to life within days."
    }
  ];

  return (
    <section className="relative py-32 bg-zinc-900 dark:bg-zinc-950 text-white border-y border-zinc-800 min-h-screen flex items-center overflow-hidden">
       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
       <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-zinc-50 dark:from-zinc-900 to-transparent z-10 opacity-5"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-20" ref={ref}>
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className={`transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <h2 className="font-heading font-normal text-5xl md:text-6xl mb-8 tracking-tight leading-tight">
              From Photo to Paradise <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">In Three Steps</span>
            </h2>
            <p className="font-subheading text-zinc-400 text-xl mb-12 italic max-w-lg">
              We've streamlined the traditional landscaping process, removing the weeks of back-and-forth communication and estimation.
            </p>

            <div className="space-y-12">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`flex gap-8 group transition-all duration-700 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${i * 200 + 500}ms` }}
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-green-500/50 group-hover:bg-zinc-800 transition-colors">
                    {step.icon}
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold border-2 border-zinc-900">
                      {i + 1}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-heading text-2xl mb-2 text-white group-hover:text-green-400 transition-colors">{step.title}</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-12 flex items-center gap-2 text-green-400 hover:text-green-300 font-bold tracking-wide uppercase text-sm group">
              Start your journey <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>

          <div className={`relative hidden md:block transition-all duration-1000 delay-300 transform ${isInView ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-20 scale-95'}`}>
             <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full animate-pulse"></div>
             <div className="relative z-10 p-4 bg-zinc-800/50 rounded-3xl border border-zinc-700 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"
                  alt="Landscaping in progress"
                  className="rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 w-full object-cover"
                />

                {/* Floating badges */}
                <div className="absolute -top-6 -right-6 bg-zinc-900 border border-zinc-700 p-4 rounded-xl shadow-xl animate-bounce-slow">
                   <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Status</span>
                   </div>
                   <p className="font-heading text-lg">On Schedule</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Fluid Gradient Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-50 dark:from-zinc-900 to-transparent pointer-events-none"></div>
    </section>
  );
};
