import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Phone, ArrowRight, Star, Navigation, Home, CheckCircle } from 'lucide-react';
import { locations, getLocationBySlug, getNearbyLocations } from '@/data/locations';
import { Services } from '@/components/Services';
import { QuoteRequestForm } from '@/components/QuoteRequestForm';

const testimonials = [
  { customer: "Sarah M.", location: "Canal Winchester", quote: "The best landscaping service we've ever used! Professional, reliable, and affordable." },
  { customer: "Mike T.", location: "Pickerington", quote: "They transformed our yard into something beautiful. Highly recommend!" },
  { customer: "Jennifer L.", location: "Groveport", quote: "Outstanding service from start to finish. Will definitely use them again." }
];

// Generate static params for all locations
export function generateStaticParams() {
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    return {
      title: 'Location Not Found | Grandpa Ron\'s Landscaping',
    };
  }

  return {
    title: `Lawn Care & Landscaping in ${location.name}, OH | Grandpa Ron's`,
    description: `Professional landscaping, lawn mowing, mulching, and tree services in ${location.name}, Ohio. Family-owned, locally operated. Free estimates. Call (220) 666-2520.`,
    keywords: `landscaping ${location.name} OH, lawn care ${location.name}, lawn mowing ${location.name} Ohio, mulching services ${location.name}`,
    openGraph: {
      title: `Lawn Care & Landscaping in ${location.name}, OH | Grandpa Ron's`,
      description: `Professional landscaping services in ${location.name}, Ohio. ${location.distance_miles.toFixed(1)} miles from Canal Winchester.`,
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  const nearbyLocations = getNearbyLocations(slug, 6);

  if (!location) {
    notFound();
  }

  // JSON-LD for Local Business
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': "Grandpa Ron's Landscaping",
    'description': `Professional landscaping services in ${location.name}, Ohio`,
    'telephone': '(220) 666-2520',
    'areaServed': {
      '@type': 'City',
      'name': location.name,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': location.name,
        'addressRegion': 'OH',
        'addressCountry': 'US',
      },
    },
    'priceRange': '$$',
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/IMG_1933.JPG"
            alt={`Landscaping services in ${location.name}, OH`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/70 via-zinc-900/50 to-zinc-950"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm mb-6">
            <MapPin size={16} />
            <span>{location.distance_miles.toFixed(1)} miles from Canal Winchester</span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Lawn Care & Landscaping in<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
              {location.name}, Ohio
            </span>
          </h1>

          <p className="text-xl text-zinc-200 mb-10 max-w-3xl mx-auto">
            Professional landscaping services serving {location.name} and surrounding areas.
            Family-owned, locally operated, quality guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Get Free Quote
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

      {/* Why Choose Us for Location */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-center mb-12">
            Why {location.name} Residents Choose <span className="text-green-600">Grandpa Ron&apos;s</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                <Navigation className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Local & Close By</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Just {location.distance_miles.toFixed(1)} miles away from {location.name}.
                We provide fast, reliable service to your neighborhood.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                <Star className="text-green-600" size={28} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold mb-3">5-Star Rated</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Trusted by {location.name} homeowners. We take pride in delivering quality work that exceeds expectations.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                <Home className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Family Owned</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Founded with Grandpa Ron&apos;s values - building relationships that last generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-center mb-4">
            What <span className="text-green-600">{location.name}</span> Residents Say
          </h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
            Real reviews from real customers in the {location.name} area
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#16a34a" className="text-green-600" />
                  ))}
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  <div>
                    <p className="font-bold">{testimonial.customer}</p>
                    <p className="text-sm text-zinc-500">{testimonial?.location || location.name}</p>
                  </div>
                  <CheckCircle className="text-green-600" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Get Your Free Quote in <span className="text-green-600">{location.name}</span>
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Fill out the form below and we&apos;ll provide a detailed estimate within 24 hours
            </p>
          </div>
          <QuoteRequestForm
            compact
            defaultLocation={`${location.name}, OH`}
            title="Get Your Free Quote"
            subtitle="Fill out the form below and we'll provide a detailed estimate within 24 hours"
          />
        </div>
      </section>

      {/* Nearby Locations */}
      {nearbyLocations.length > 0 && (
        <section className="py-20 bg-white dark:bg-zinc-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-center mb-12">
              We Also Serve Nearby Communities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {nearbyLocations.map((nearby) => (
                <Link
                  key={nearby.slug}
                  href={`/locations/${nearby.slug}`}
                  className="bg-zinc-50 dark:bg-zinc-900 hover:bg-green-50 dark:hover:bg-green-900/20 p-6 rounded-xl text-center transition-all border border-zinc-100 dark:border-zinc-800 hover:border-green-500 hover:shadow-lg group"
                >
                  <MapPin className="text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" size={24} />
                  <p className="font-semibold text-sm">{nearby.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">{nearby.distance_miles.toFixed(1)} mi</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
