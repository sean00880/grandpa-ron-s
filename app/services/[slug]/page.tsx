import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ChevronRight,
  Star,
  Shovel,
  Scissors,
  Trees,
  Leaf,
  Snowflake,
  Home,
  Flower2,
  Sprout
} from 'lucide-react'
import { serviceRegistry, type Service } from '@/data/serviceRegistry'
import { projectRegistry } from '@/data/projectRegistry'
import { faqRegistry } from '@/data/faqRegistry'

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  Shovel: <Shovel className="w-8 h-8" />,
  Scissors: <Scissors className="w-8 h-8" />,
  Trees: <Trees className="w-8 h-8" />,
  Leaf: <Leaf className="w-8 h-8" />,
  Snowflake: <Snowflake className="w-8 h-8" />,
  Home: <Home className="w-8 h-8" />,
  Flower2: <Flower2 className="w-8 h-8" />,
  Sprout: <Sprout className="w-8 h-8" />,
}

// Generate static params for all services
export function generateStaticParams() {
  return serviceRegistry.getStaticParams()
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = serviceRegistry.getServiceBySlug(slug)

  if (!service) {
    return {
      title: 'Service Not Found | Grandpa Ron\'s Landscaping',
    }
  }

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.seoKeywords.join(', '),
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      images: [service.heroImage],
    },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = serviceRegistry.getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const relatedServices = serviceRegistry.getRelatedServices(slug)
  const projects = projectRegistry.getProjectsByService(slug)
  const faqs = faqRegistry.getFAQsByService(slug)

  // Generate FAQ JSON-LD for SEO
  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  } : null

  // Service JSON-LD
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': service.name,
    'description': service.longDescription,
    'provider': {
      '@type': 'LocalBusiness',
      'name': "Grandpa Ron's Landscaping",
      'telephone': '(220) 666-2520',
      'areaServed': 'Central Ohio',
    },
    'offers': {
      '@type': 'Offer',
      'price': service.pricing.basePrice,
      'priceCurrency': 'USD',
    },
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* JSON-LD Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={service.heroImage}
            alt={service.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <ChevronRight size={14} />
              <span className="text-white">{service.name}</span>
            </nav>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-white">
                {iconMap[service.icon] || <Shovel className="w-8 h-8" />}
              </div>
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium capitalize">
                {service.category.replace('-', ' ')}
              </span>
            </div>

            <h1
              className="text-white mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-display)',
                fontWeight: 300,
              }}
            >
              {service.name}
            </h1>

            <p
              className="text-zinc-200 mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-lg)',
                lineHeight: 1.7,
              }}
            >
              {service.shortDescription}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/#contact"
                className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:-translate-y-1 flex items-center gap-2"
              >
                Get Free Quote <ArrowRight size={20} />
              </Link>
              <a
                href="tel:2206662520"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold transition-all flex items-center gap-2"
              >
                <Phone size={20} /> (220) 666-2520
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2
                className="text-zinc-900 dark:text-white mb-6"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-h2)',
                  fontWeight: 400,
                }}
              >
                About This Service
              </h2>
              <div
                className="text-zinc-600 dark:text-zinc-400 mb-10 whitespace-pre-line"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body)',
                  lineHeight: 1.8,
                }}
              >
                {service.longDescription}
              </div>

              {/* Features */}
              <h3
                className="text-zinc-900 dark:text-white mb-6"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-h3)',
                  fontWeight: 500,
                }}
              >
                What&apos;s Included
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {service.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span
                      className="text-zinc-700 dark:text-zinc-300"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <h3
                className="text-zinc-900 dark:text-white mb-6"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-h3)',
                  fontWeight: 500,
                }}
              >
                Benefits
              </h3>
              <div className="space-y-3 mb-12">
                {service.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span
                      className="text-zinc-600 dark:text-zinc-400"
                      style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)' }}
                    >
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Gallery */}
              {service.galleryImages.length > 0 && (
                <>
                  <h3
                    className="text-zinc-900 dark:text-white mb-6"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-h3)',
                      fontWeight: 500,
                    }}
                  >
                    Our Work
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {service.galleryImages.slice(0, 6).map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden group"
                      >
                        <Image
                          src={image}
                          alt={`${service.name} project ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Pricing Card */}
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 mb-6 sticky top-24">
                <h3
                  className="text-zinc-900 dark:text-white mb-4"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-h4)',
                    fontWeight: 500,
                  }}
                >
                  Pricing
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    ${service.pricing.basePrice.toFixed(2)}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    /{service.pricing.unit}
                  </span>
                </div>
                {service.pricing.priceRange && (
                  <p
                    className="text-zinc-600 dark:text-zinc-400 text-sm mb-6"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Typical range: {service.pricing.priceRange}
                  </p>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Lead time: {service.availability.leadTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Available in all service areas
                    </span>
                  </div>
                  {service.availability.seasonal && (
                    <div className="flex items-center gap-3 text-sm">
                      <Leaf className="w-4 h-4 text-zinc-400" />
                      <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                        Seasons: {service.availability.seasons?.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  href="/#contact"
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Get Free Quote <ArrowRight size={18} />
                </Link>
              </div>

              {/* Equipment */}
              {service.equipment.length > 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 mb-6">
                  <h4
                    className="text-zinc-900 dark:text-white mb-4"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 500,
                    }}
                  >
                    Equipment We Use
                  </h4>
                  <ul className="space-y-2">
                    {service.equipment.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-8">
            <h2
              className="text-zinc-900 dark:text-white text-center mb-12"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-h2)',
                fontWeight: 400,
              }}
            >
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group bg-white dark:bg-zinc-800 rounded-xl p-6 cursor-pointer"
                >
                  <summary
                    className="flex items-center justify-between font-semibold text-zinc-900 dark:text-white list-none"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {faq.question}
                    <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                  </summary>
                  <p
                    className="mt-4 text-zinc-600 dark:text-zinc-400"
                    style={{ fontFamily: 'var(--font-body)', lineHeight: 1.7 }}
                  >
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {projects.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8">
            <h2
              className="text-zinc-900 dark:text-white text-center mb-12"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-h2)',
                fontWeight: 400,
              }}
            >
              Recent {service.name} Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={project.afterImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-zinc-900 dark:text-white mb-2"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-lg)',
                        fontWeight: 500,
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="text-zinc-600 dark:text-zinc-400 text-sm mb-3"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <MapPin size={14} />
                      {project.locationName}
                    </div>
                    {project.testimonial && (
                      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(project.testimonial.rating)].map((_, i) => (
                            <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                          &quot;{project.testimonial.quote.slice(0, 100)}...&quot;
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">— {project.testimonial.customer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-8">
            <h2
              className="text-zinc-900 dark:text-white text-center mb-12"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-h2)',
                fontWeight: 400,
              }}
            >
              Related Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedServices.map((related) => (
                <Link
                  key={related.id}
                  href={`/services/${related.slug}`}
                  className="group bg-white dark:bg-zinc-800 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                    {iconMap[related.icon] || <Shovel className="w-7 h-7" />}
                  </div>
                  <h3
                    className="text-zinc-900 dark:text-white mb-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 500,
                    }}
                  >
                    {related.name}
                  </h3>
                  <p
                    className="text-zinc-600 dark:text-zinc-400 text-sm"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {related.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-green-900 text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2
            className="mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-h1)',
              fontWeight: 300,
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            className="text-green-100 max-w-2xl mx-auto mb-8"
            style={{
              fontFamily: 'var(--font-subheading)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}
          >
            Get a free, no-obligation quote for {service.name.toLowerCase()}.
            We serve 24 communities in Central Ohio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="bg-white text-green-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Request a Quote
            </Link>
            <a
              href="tel:2206662520"
              className="bg-green-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              Call (220) 666-2520
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
