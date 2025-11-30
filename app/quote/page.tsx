'use client';

import React from 'react';
import { CheckCircle2, Clock, FileCheck, Users } from 'lucide-react';
import { QuoteRequestForm } from '@/components/QuoteRequestForm';
import { GoogleReviewsWidget } from '@/components/GoogleReviewsWidget';
import { useInView } from '@/hooks/useInView';

export default function QuotePage() {
  const { ref: heroRef, isInView: heroInView } = useInView({ threshold: 0.1 });
  const { ref: formRef, isInView: formInView } = useInView({ threshold: 0.1 });
  const { ref: trustRef, isInView: trustInView } = useInView({ threshold: 0.1 });
  const { ref: reviewsRef, isInView: reviewsInView } = useInView({ threshold: 0.1 });

  const trustIndicators = [
    {
      icon: Clock,
      title: '24-Hour Response',
      description: 'We respond to all quote requests within one business day'
    },
    {
      icon: FileCheck,
      title: 'Free Estimates',
      description: 'No obligation quotes for all services, completely free'
    },
    {
      icon: Users,
      title: 'Family-Owned',
      description: 'Serving Canal Winchester area since 2021 with pride'
    },
    {
      icon: CheckCircle2,
      title: 'Satisfaction Guaranteed',
      description: 'We stand behind our work with a 100% satisfaction guarantee'
    }
  ];

  const faqs = [
    {
      question: 'How quickly will I receive my quote?',
      answer: 'We aim to respond to all quote requests within 24 hours. For urgent requests, please call us directly at (220) 666-2520.'
    },
    {
      question: 'Is the quote really free?',
      answer: 'Yes! All estimates are completely free with no obligation. We\'ll assess your property and provide a detailed quote at no cost.'
    },
    {
      question: 'Do you serve my area?',
      answer: 'We serve Canal Winchester and all surrounding areas within a 20-mile radius, including Columbus, Pickerington, Reynoldsburg, and more.'
    },
    {
      question: 'What information do you need for a quote?',
      answer: 'We need basic information about your property size, the services you\'re interested in, and your location. Photos of your property can be helpful but aren\'t required for an initial estimate.'
    },
    {
      question: 'Are you licensed and insured?',
      answer: 'Yes, we are fully licensed and insured. We can provide proof of insurance upon request.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept cash, checks, and major credit cards for your convenience.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="pt-32 pb-20 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-green-950"
      >
        <div
          className={`container mx-auto px-4 md:px-8 text-center transition-all duration-1000 ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block py-2 px-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold uppercase tracking-wider mb-6">
            Free Quote
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Request Your <span className="text-green-600 dark:text-green-400">Free Quote</span>
          </h1>
          
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Tell us about your project and receive a detailed, no-obligation estimate within 24 hours. 
            We're committed to providing fair pricing and exceptional service.
          </p>

          <div className="flex items-center justify-center gap-8 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600" />
              <span>No Obligation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600" />
              <span>Fast Response</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600" />
              <span>Licensed & Insured</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section ref={trustRef} className="py-16 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8">
          <div
            className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 ${
              trustInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {trustIndicators?.map((indicator, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 hover:shadow-lg transition-shadow"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <indicator.icon size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">{indicator.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{indicator.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Request Form */}
      <section ref={formRef} className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 md:px-8">
          <div
            className={`max-w-4xl mx-auto transition-all duration-1000 ${
              formInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Fill Out the Form Below
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Please provide as much detail as possible so we can give you the most accurate quote.
                </p>
              </div>
              
              <QuoteRequestForm />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section ref={reviewsRef} className="py-20 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8">
          <div
            className={`transition-all duration-1000 ${
              reviewsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <GoogleReviewsWidget maxReviews={3} />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqs?.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">
                    {faq.question}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-900 dark:bg-green-950 text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prefer to Talk to Someone?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Give us a call and we'll be happy to discuss your project and provide a quote over the phone.
          </p>
          <a
            href="tel:2206662520"
            className="inline-block bg-white text-green-900 px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1"
          >
            Call (220) 666-2520
          </a>
        </div>
      </section>
    </div>
  );
}
