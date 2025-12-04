'use client';

import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { QuoteRequestForm } from '@/components/QuoteRequestForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Get in <span className="text-green-600">Touch</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Have a project in mind? We'd love to hear from you. Fill out the form below or give us a call.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <QuoteRequestForm
              compact
              title="Get a Free Quote"
              subtitle="Fill out the form below and we'll get back to you within 24 hours"
            />
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <a
                  href="tel:2206662520"
                  className="flex items-start gap-4 group hover:bg-white dark:hover:bg-zinc-800 p-4 -m-4 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Phone</p>
                    <p className="font-semibold text-lg">(220) 666-2520</p>
                  </div>
                </a>

                <a
                  href="mailto:fgreatful@gmail.com"
                  className="flex items-start gap-4 group hover:bg-white dark:hover:bg-zinc-800 p-4 -m-4 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Email</p>
                    <p className="font-semibold">fgreatful@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 -m-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Service Area</p>
                    <p className="font-semibold">Canal Winchester, OH</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">& Columbus Area</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 -m-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Response Time</p>
                    <p className="font-semibold">Within 24 Hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
              <h4 className="text-xl font-bold mb-3">Emergency Services</h4>
              <p className="text-green-50 mb-4">
                Storm damage? We offer emergency response services. Call us immediately.
              </p>
              <a
                href="tel:2206662520"
                className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:bg-green-50 transition-colors"
              >
                <Phone size={18} />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
