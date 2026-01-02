/**
 * LOCATION SEO REGISTRY
 * Programmatic SEO data for location-based pages
 *
 * Purpose: Generate SEO-optimized content for:
 * - Location landing pages (/locations/[slug])
 * - Location x Service pages (/locations/[slug]/[service])
 * - Schema.org structured data
 * - Sitemap generation
 * - Internal linking strategies
 */

import locationsData from '../../data/canal_winchester_locations.json';

// ============================================
// TYPES
// ============================================

export interface Location {
  name: string;
  type: 'city' | 'village' | 'township' | 'cdp';
  distance_miles: number;
  distance_category: string;
  direction: string;
  zip_codes: string[];
  population: number;
  median_income: number;
  home_ownership_rate: number;
  average_home_value: number;
  priority: 'high' | 'medium' | 'low';
  competition: 'low' | 'medium' | 'high';
  seo_keywords: string[];
  slug: string;
  meta_title: string;
  meta_description: string;
}

export interface ServiceDefinition {
  id: string;
  name: string;
  slug: string;
  category: 'lawn-care' | 'landscaping' | 'tree-services' | 'seasonal' | 'hardscape';
  shortDescription: string;
  keywords: string[];
  seasonalRelevance: ('spring' | 'summer' | 'fall' | 'winter')[];
}

export interface LocationServicePage {
  locationSlug: string;
  serviceSlug: string;
  url: string;
  title: string;
  description: string;
  h1: string;
  keywords: string[];
  schemaData: object;
  breadcrumbs: Array<{ name: string; url: string }>;
  relatedPages: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: number;
}

// ============================================
// SERVICE DEFINITIONS
// ============================================

const SERVICES: ServiceDefinition[] = [
  {
    id: 'lawn-mowing',
    name: 'Lawn Mowing',
    slug: 'lawn-mowing',
    category: 'lawn-care',
    shortDescription: 'Professional weekly lawn mowing and maintenance',
    keywords: ['lawn mowing', 'grass cutting', 'lawn maintenance', 'weekly mowing'],
    seasonalRelevance: ['spring', 'summer', 'fall']
  },
  {
    id: 'mulching',
    name: 'Mulching Services',
    slug: 'mulching',
    category: 'landscaping',
    shortDescription: 'Premium mulch installation for beds and landscaping',
    keywords: ['mulching', 'mulch installation', 'garden mulch', 'landscape mulching'],
    seasonalRelevance: ['spring', 'summer']
  },
  {
    id: 'aeration',
    name: 'Lawn Aeration',
    slug: 'lawn-aeration',
    category: 'lawn-care',
    shortDescription: 'Core aeration for healthier, greener lawns',
    keywords: ['lawn aeration', 'core aeration', 'soil aeration', 'grass aeration'],
    seasonalRelevance: ['spring', 'fall']
  },
  {
    id: 'overseeding',
    name: 'Overseeding',
    slug: 'overseeding',
    category: 'lawn-care',
    shortDescription: 'Thick, lush lawn restoration through overseeding',
    keywords: ['overseeding', 'lawn seeding', 'grass seed', 'lawn restoration'],
    seasonalRelevance: ['spring', 'fall']
  },
  {
    id: 'leaf-removal',
    name: 'Leaf Removal',
    slug: 'leaf-removal',
    category: 'seasonal',
    shortDescription: 'Complete fall leaf cleanup and removal',
    keywords: ['leaf removal', 'fall cleanup', 'leaf blowing', 'yard cleanup'],
    seasonalRelevance: ['fall']
  },
  {
    id: 'spring-cleanup',
    name: 'Spring Cleanup',
    slug: 'spring-cleanup',
    category: 'seasonal',
    shortDescription: 'Comprehensive spring yard cleanup services',
    keywords: ['spring cleanup', 'spring yard work', 'spring landscaping', 'spring maintenance'],
    seasonalRelevance: ['spring']
  },
  {
    id: 'fall-cleanup',
    name: 'Fall Cleanup',
    slug: 'fall-cleanup',
    category: 'seasonal',
    shortDescription: 'Complete fall yard cleanup and winterization',
    keywords: ['fall cleanup', 'fall yard work', 'winterization', 'fall maintenance'],
    seasonalRelevance: ['fall']
  },
  {
    id: 'hedge-trimming',
    name: 'Hedge Trimming',
    slug: 'hedge-trimming',
    category: 'landscaping',
    shortDescription: 'Professional hedge and shrub trimming',
    keywords: ['hedge trimming', 'shrub trimming', 'bush trimming', 'hedge maintenance'],
    seasonalRelevance: ['spring', 'summer', 'fall']
  },
  {
    id: 'tree-trimming',
    name: 'Tree Trimming',
    slug: 'tree-trimming',
    category: 'tree-services',
    shortDescription: 'Expert tree trimming and pruning services',
    keywords: ['tree trimming', 'tree pruning', 'tree maintenance', 'branch removal'],
    seasonalRelevance: ['spring', 'summer', 'fall', 'winter']
  },
  {
    id: 'landscape-design',
    name: 'Landscape Design',
    slug: 'landscape-design',
    category: 'landscaping',
    shortDescription: 'Custom landscape design and installation',
    keywords: ['landscape design', 'landscaping', 'yard design', 'garden design'],
    seasonalRelevance: ['spring', 'summer', 'fall']
  },
  {
    id: 'gutter-cleaning',
    name: 'Gutter Cleaning',
    slug: 'gutter-cleaning',
    category: 'seasonal',
    shortDescription: 'Professional gutter cleaning and maintenance',
    keywords: ['gutter cleaning', 'gutter maintenance', 'downspout cleaning'],
    seasonalRelevance: ['spring', 'fall']
  },
  {
    id: 'pressure-washing',
    name: 'Pressure Washing',
    slug: 'pressure-washing',
    category: 'hardscape',
    shortDescription: 'Driveway, patio, and deck pressure washing',
    keywords: ['pressure washing', 'power washing', 'driveway cleaning', 'patio cleaning'],
    seasonalRelevance: ['spring', 'summer']
  }
];

// ============================================
// REGISTRY CLASS
// ============================================

class LocationSeoRegistry {
  private static instance: LocationSeoRegistry;
  private locations: Location[];
  private services: ServiceDefinition[];
  private baseUrl: string = 'https://grandparonslawns.com';

  private constructor() {
    this.locations = (locationsData as any)?.locations || [];
    this.services = SERVICES;
  }

  public static getInstance(): LocationSeoRegistry {
    if (!LocationSeoRegistry.instance) {
      LocationSeoRegistry.instance = new LocationSeoRegistry();
    }
    return LocationSeoRegistry.instance;
  }

  // ============================================
  // LOCATION METHODS
  // ============================================

  public getAllLocations(): Location[] {
    return this.locations;
  }

  public getLocationBySlug(slug: string): Location | undefined {
    return this.locations.find(loc => loc.slug === slug);
  }

  public getHighPriorityLocations(): Location[] {
    return this.locations.filter(loc => loc.priority === 'high');
  }

  public getLocationsByCompetition(level: 'low' | 'medium' | 'high'): Location[] {
    return this.locations.filter(loc => loc.competition === level);
  }

  // ============================================
  // SERVICE METHODS
  // ============================================

  public getAllServices(): ServiceDefinition[] {
    return this.services;
  }

  public getServiceBySlug(slug: string): ServiceDefinition | undefined {
    return this.services.find(s => s.slug === slug);
  }

  public getServicesByCategory(category: ServiceDefinition['category']): ServiceDefinition[] {
    return this.services.filter(s => s.category === category);
  }

  public getSeasonalServices(season: 'spring' | 'summer' | 'fall' | 'winter'): ServiceDefinition[] {
    return this.services.filter(s => s.seasonalRelevance.includes(season));
  }

  // ============================================
  // PROGRAMMATIC SEO PAGE GENERATION
  // ============================================

  /**
   * Generate SEO data for a location x service page
   */
  public generateLocationServicePage(
    locationSlug: string,
    serviceSlug: string
  ): LocationServicePage | null {
    const location = this.getLocationBySlug(locationSlug);
    const service = this.getServiceBySlug(serviceSlug);

    if (!location || !service) return null;

    const url = `${this.baseUrl}/locations/${locationSlug}/${serviceSlug}`;

    // Generate dynamic title
    const title = `${service.name} in ${location.name}, OH | Grandpa Ron's Lawns`;

    // Generate dynamic description
    const description = `Professional ${service.name.toLowerCase()} services in ${location.name}, Ohio. ${service.shortDescription}. Serving ${location.name} and surrounding areas. Call for a free quote!`;

    // Generate H1
    const h1 = `${service.name} Services in ${location.name}, Ohio`;

    // Combine keywords
    const keywords = [
      ...service.keywords.map(k => `${k} ${location.name} OH`),
      ...location.seo_keywords.filter(k => k.toLowerCase().includes(service.slug.replace('-', ' ')))
    ];

    // Generate Schema.org data
    const schemaData = this.generateLocalBusinessSchema(location, service);

    // Generate breadcrumbs
    const breadcrumbs = [
      { name: 'Home', url: this.baseUrl },
      { name: 'Locations', url: `${this.baseUrl}/locations` },
      { name: location.name, url: `${this.baseUrl}/locations/${locationSlug}` },
      { name: service.name, url }
    ];

    // Find related pages
    const relatedPages = this.getRelatedPages(location, service);

    // Generate FAQs
    const faqs = this.generateFAQs(location, service);

    return {
      locationSlug,
      serviceSlug,
      url,
      title,
      description,
      h1,
      keywords,
      schemaData,
      breadcrumbs,
      relatedPages,
      faqs
    };
  }

  /**
   * Generate all location x service page combinations
   */
  public generateAllLocationServicePages(): LocationServicePage[] {
    const pages: LocationServicePage[] = [];

    for (const location of this.locations) {
      for (const service of this.services) {
        const page = this.generateLocationServicePage(location.slug, service.slug);
        if (page) pages.push(page);
      }
    }

    return pages;
  }

  /**
   * Generate high-priority pages only (for initial focus)
   */
  public generatePriorityPages(): LocationServicePage[] {
    const highPriorityLocations = this.getHighPriorityLocations();
    const pages: LocationServicePage[] = [];

    for (const location of highPriorityLocations) {
      for (const service of this.services) {
        const page = this.generateLocationServicePage(location.slug, service.slug);
        if (page) pages.push(page);
      }
    }

    return pages;
  }

  // ============================================
  // SCHEMA.ORG GENERATION
  // ============================================

  public generateLocalBusinessSchema(location: Location, service?: ServiceDefinition): object {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${this.baseUrl}/#organization`,
      name: "Grandpa Ron's Lawns and Landscape LLC",
      description: `Professional lawn care and landscaping services serving ${location.name}, Ohio`,
      url: this.baseUrl,
      telephone: '+1-614-555-0123', // Replace with actual
      email: 'info@grandparonslawns.com',
      priceRange: '$$',
      areaServed: {
        '@type': 'City',
        name: location.name,
        addressRegion: 'OH',
        postalCode: location.zip_codes[0]
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Canal Winchester',
        addressRegion: 'OH',
        postalCode: '43110',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 39.8428,
        longitude: -82.8099
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '127'
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '07:00',
          closes: '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '08:00',
          closes: '14:00'
        }
      ]
    };

    if (service) {
      return {
        ...baseSchema,
        '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${service.name} Services`,
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: service.name,
                description: service.shortDescription,
                areaServed: {
                  '@type': 'City',
                  name: location.name
                }
              }
            }
          ]
        }
      };
    }

    return baseSchema;
  }

  public generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    };
  }

  public generateFAQSchema(faqs: Array<{ question: string; answer: string }>): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  // ============================================
  // SITEMAP GENERATION
  // ============================================

  public generateSitemapEntries(): SitemapEntry[] {
    const entries: SitemapEntry[] = [];
    const now = new Date().toISOString().split('T')[0];

    // Homepage
    entries.push({
      loc: this.baseUrl,
      lastmod: now,
      changefreq: 'weekly',
      priority: 1.0
    });

    // Location hub
    entries.push({
      loc: `${this.baseUrl}/locations`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9
    });

    // Individual location pages
    for (const location of this.locations) {
      const priority = location.priority === 'high' ? 0.8 : location.priority === 'medium' ? 0.7 : 0.6;

      entries.push({
        loc: `${this.baseUrl}/locations/${location.slug}`,
        lastmod: now,
        changefreq: 'weekly',
        priority
      });

      // Location x Service pages
      for (const service of this.services) {
        entries.push({
          loc: `${this.baseUrl}/locations/${location.slug}/${service.slug}`,
          lastmod: now,
          changefreq: 'monthly',
          priority: priority - 0.1
        });
      }
    }

    // Service hub pages
    for (const service of this.services) {
      entries.push({
        loc: `${this.baseUrl}/services/${service.slug}`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.8
      });
    }

    // Blog
    entries.push({
      loc: `${this.baseUrl}/blog`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.7
    });

    return entries;
  }

  public generateSitemapXML(): string {
    const entries = this.generateSitemapEntries();

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const entry of entries) {
      xml += '  <url>\n';
      xml += `    <loc>${entry.loc}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    xml += '</urlset>';
    return xml;
  }

  // ============================================
  // INTERNAL LINKING
  // ============================================

  public getRelatedPages(location: Location, service: ServiceDefinition): string[] {
    const related: string[] = [];

    // Same service, nearby locations
    const nearbyLocations = this.locations
      .filter(l => l.slug !== location.slug && l.distance_category === location.distance_category)
      .slice(0, 3);

    for (const nearby of nearbyLocations) {
      related.push(`/locations/${nearby.slug}/${service.slug}`);
    }

    // Same location, related services
    const relatedServices = this.services
      .filter(s => s.slug !== service.slug && s.category === service.category)
      .slice(0, 3);

    for (const relService of relatedServices) {
      related.push(`/locations/${location.slug}/${relService.slug}`);
    }

    return related;
  }

  public getInternalLinkingStrategy(locationSlug: string): {
    siblingLocations: Location[];
    parentHub: string;
    childPages: string[];
    crossLinks: string[];
  } {
    const location = this.getLocationBySlug(locationSlug);
    if (!location) {
      return {
        siblingLocations: [],
        parentHub: '/locations',
        childPages: [],
        crossLinks: []
      };
    }

    // Sibling locations (same distance category)
    const siblingLocations = this.locations
      .filter(l => l.slug !== locationSlug && l.distance_category === location.distance_category)
      .slice(0, 6);

    // Child pages (all services for this location)
    const childPages = this.services.map(s => `/locations/${locationSlug}/${s.slug}`);

    // Cross-links to high-value pages
    const crossLinks = this.getHighPriorityLocations()
      .filter(l => l.slug !== locationSlug)
      .slice(0, 4)
      .map(l => `/locations/${l.slug}`);

    return {
      siblingLocations,
      parentHub: '/locations',
      childPages,
      crossLinks
    };
  }

  // ============================================
  // FAQ GENERATION
  // ============================================

  private generateFAQs(location: Location, service: ServiceDefinition): Array<{ question: string; answer: string }> {
    return [
      {
        question: `How much does ${service.name.toLowerCase()} cost in ${location.name}?`,
        answer: `${service.name} costs in ${location.name} vary based on property size and specific needs. Contact us for a free, no-obligation quote tailored to your property.`
      },
      {
        question: `Do you offer ${service.name.toLowerCase()} services near ${location.name}?`,
        answer: `Yes! Grandpa Ron's serves ${location.name} and all surrounding areas within ${location.distance_category.replace(' miles', '')} miles. We've been serving the Columbus metro area for over 15 years.`
      },
      {
        question: `How often should I schedule ${service.name.toLowerCase()}?`,
        answer: `For optimal results in ${location.name}'s climate, we typically recommend ${this.getFrequencyRecommendation(service)}. However, we'll assess your specific property and provide customized recommendations.`
      },
      {
        question: `What makes Grandpa Ron's the best choice for ${service.name.toLowerCase()} in ${location.name}?`,
        answer: `With over 15 years of experience serving ${location.name} and a 4.9-star rating from 127+ reviews, we offer reliable, professional service with a satisfaction guarantee. We're locally owned and know the specific needs of Ohio lawns.`
      },
      {
        question: `Do you offer free estimates for ${service.name.toLowerCase()} in ${location.name}?`,
        answer: `Absolutely! We offer free, no-obligation estimates for all our services in ${location.name}. Call us or fill out our online quote form to get started.`
      }
    ];
  }

  private getFrequencyRecommendation(service: ServiceDefinition): string {
    const recommendations: Record<string, string> = {
      'lawn-mowing': 'weekly mowing during the growing season (April-October)',
      'mulching': 'annual mulching in spring, with a fall refresh if needed',
      'aeration': 'once or twice per year, ideally in spring and/or fall',
      'overseeding': 'annually in fall for best results',
      'leaf-removal': 'weekly during peak fall season (October-November)',
      'spring-cleanup': 'once per year in early spring (March-April)',
      'fall-cleanup': 'once per year in late fall (November)',
      'hedge-trimming': '2-3 times per year during the growing season',
      'tree-trimming': 'annually or as needed based on growth',
      'landscape-design': 'as needed for new installations or renovations',
      'gutter-cleaning': 'twice per year, in spring and fall',
      'pressure-washing': 'annually for driveways and patios'
    };

    return recommendations[service.slug] || 'based on your property\'s specific needs';
  }

  // ============================================
  // STATISTICS
  // ============================================

  public getRegistryStats(): {
    totalLocations: number;
    totalServices: number;
    totalProgrammaticPages: number;
    highPriorityLocations: number;
    lowCompetitionLocations: number;
  } {
    return {
      totalLocations: this.locations.length,
      totalServices: this.services.length,
      totalProgrammaticPages: this.locations.length * this.services.length,
      highPriorityLocations: this.getHighPriorityLocations().length,
      lowCompetitionLocations: this.getLocationsByCompetition('low').length
    };
  }
}

// Export singleton
export const locationSeoRegistry = LocationSeoRegistry.getInstance();

// Export types
export type { Location as SeoLocation, ServiceDefinition, LocationServicePage, SitemapEntry };
