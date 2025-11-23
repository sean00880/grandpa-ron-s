'use client';

import React from 'react';
import { Heart, Award, Users, Target, Phone, Mail, MapPin, Star, CheckCircle } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import Link from 'next/link';

const testimonials = [
  {
    customer: "Sarah M.",
    location: "Canal Winchester",
    quote: "The best landscaping service we've ever used! Professional, reliable, and affordable."
  },
  {
    customer: "Mike T.",
    location: "Pickerington",
    quote: "They transformed our yard into something beautiful. Highly recommend!"
  },
  {
    customer: "Jennifer L.",
    location: "Groveport",
    quote: "Outstanding service from start to finish. Will definitely use them again."
  }
];

export default function AboutPage() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              About <span className="text-green-600">Grandpa Ron's</span>
            </h1>
            <p className="text-2xl text-zinc-600 dark:text-zinc-400 mb-4">
              Building Relationships That Last Generations
            </p>
            <div className="w-24 h-1 bg-green-600 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <img
                src="/images/grandpaRon.jpeg"
                alt="Grandpa Ron on his red lawn mower"
                className="w-full rounded-3xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-heading font-bold mb-6">
                Our <span className="text-green-600">Story</span>
              </h2>
              <div className="space-y-4 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                  Founded in <strong>2021</strong> by Joshua Reichley, Grandpa Ron's Lawns and Landscape LLC 
                  was built with a simple mission: to create customer experiences and relationships that last generations.
                </p>
                <p>
                  Named in honor of Grandpa Ron, our company embodies his values of hard work, integrity, 
                  and commitment to quality. Every project we undertake reflects these timeless principles.
                </p>
                <p>
                  We're not just a landscaping company – we're your neighbors, dedicated to making 
                  Canal Winchester and the surrounding communities more beautiful, one yard at a time.
                </p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  "Quality work that lasts generations."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900" ref={ref}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-center mb-16">
            Our <span className="text-green-600">Values</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className={`text-center transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="text-green-600" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Family Values</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                We treat every customer like family, building lasting relationships based on trust and respect.
              </p>
            </div>

            <div className={`text-center transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="text-blue-600" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality First</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                We never compromise on quality. Every project receives our full attention and expertise.
              </p>
            </div>

            <div className={`text-center transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="text-purple-600" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Focus</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Locally owned and operated, we're invested in making our community beautiful.
              </p>
            </div>

            <div className={`text-center transition-all duration-700 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="text-orange-600" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Reliability</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                On time, on budget, and on point. You can count on us to deliver what we promise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-center mb-16">
            Meet the <span className="text-green-600">Team</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6">
                <img
                  src="/images/grandpaRon.jpeg"
                  alt="Grandpa Ron"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-950">
                  <Star size={28} fill="white" className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Grandpa Ron</h3>
              <p className="text-green-600 dark:text-green-400 font-semibold mb-4">Founder's Inspiration</p>
              <p className="text-zinc-600 dark:text-zinc-400">
                The heart and soul behind our company values. His dedication to quality and 
                customer service inspires everything we do.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6">
                <img
                  src="/images/Joshua.jpg"
                  alt="Joshua Reichley"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-950">
                  <Award size={28} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Joshua Reichley</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">Owner & Operator</p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Founded Grandpa Ron's in 2021 with a commitment to bringing Grandpa Ron's values 
                to the landscaping industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-heading font-bold mb-6">
              <span className="text-green-600">Service Area</span>
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12">
              Proudly serving <strong>24 communities</strong> within a 20-mile radius of Canal Winchester, Ohio
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
                <MapPin className="text-green-600 mx-auto mb-4" size={40} />
                <div className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">24</div>
                <div className="text-zinc-600 dark:text-zinc-400">Cities Served</div>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
                <Users className="text-blue-600 mx-auto mb-4" size={40} />
                <div className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">1.3M+</div>
                <div className="text-zinc-600 dark:text-zinc-400">Residents</div>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
                <Award className="text-purple-600 mx-auto mb-4" size={40} />
                <div className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">5★</div>
                <div className="text-zinc-600 dark:text-zinc-400">Rating</div>
              </div>
            </div>
            <Link
              href="/service-areas"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:-translate-y-1"
            >
              View All Locations
              <MapPin size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-center mb-4">
            What Our <span className="text-green-600">Customers</span> Say
          </h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-16 max-w-2xl mx-auto">
            Real reviews from real customers across Canal Winchester and surrounding communities
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-xl transition-shadow">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="#16a34a" className="text-green-600" />
                  ))}
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">{testimonial.customer}</p>
                    <p className="text-sm text-zinc-500">{testimonial.location}</p>
                  </div>
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <img src="/images/stars.png" alt="5 star rating" className="h-12 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Trusted by hundreds of satisfied customers
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto">
            Experience the Grandpa Ron's difference. Contact us today for a free quote.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="tel:2206662520"
              className="flex items-center gap-3 bg-white text-green-600 hover:bg-green-50 px-8 py-5 rounded-full font-bold text-lg transition-all shadow-2xl hover:-translate-y-1"
            >
              <Phone size={22} />
              (220) 666-2520
            </a>
            <a
              href="mailto:fgreatful@gmail.com"
              className="flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white px-8 py-5 rounded-full font-bold text-lg transition-all"
            >
              <Mail size={22} />
              fgreatful@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
