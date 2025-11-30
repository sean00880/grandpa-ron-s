/**
 * Master Registry - Centralized data access pattern
 * Following Southern Haulers best practices for programmatic pages
 */

import { locationRegistry } from '../services/locationRegistry';
import { pricingRegistry } from '../services/pricingRegistry';
import { serviceRegistry, type Service } from './serviceRegistry';
import { projectRegistry, type Project } from './projectRegistry';
import { teamRegistry, type TeamMember } from './teamRegistry';
import { faqRegistry, type FAQ } from './faqRegistry';
import { testimonials, type Testimonial } from './testimonials';
import type { Location, PricingItem } from '../types';

// ============================================
// MASTER REGISTRY OBJECT
// ============================================

export const Registry = {
  locations: locationRegistry,
  pricing: pricingRegistry,
  services: serviceRegistry,
  projects: projectRegistry,
  team: teamRegistry,
  faqs: faqRegistry,
  testimonials,
} as const;

// ============================================
// REGISTRY STATISTICS
// ============================================

export const RegistryStats = {
  locations: {
    get total() { return locationRegistry.getAllLocations().length; },
    get highPriority() { return locationRegistry.getLocationsByPriority('high').length; },
    get totalPopulation() { return locationRegistry.getStatistics().totalPopulation; },
  },
  services: {
    get total() { return serviceRegistry.getAllServices().length; },
    get categories() { return serviceRegistry.getCategories(); },
  },
  projects: {
    get total() { return projectRegistry.getAllProjects().length; },
    get featured() { return projectRegistry.getFeaturedProjects().length; },
  },
  team: {
    get total() { return teamRegistry.getAllMembers().length; },
  },
  faqs: {
    get total() { return faqRegistry.getAllFAQs().length; },
    get categories() { return faqRegistry.getCategories(); },
  },
  testimonials: {
    get total() { return testimonials.length; },
    get averageRating() {
      return testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
    },
  },
};

// ============================================
// REGISTRY UTILITIES
// ============================================

export const RegistryUtils = {
  /**
   * Search across all registries
   */
  search(query: string): {
    locations: Location[];
    services: Service[];
    projects: Project[];
    faqs: FAQ[];
  } {
    const q = query.toLowerCase();
    return {
      locations: locationRegistry.searchLocations(query),
      services: serviceRegistry.searchServices(query),
      projects: projectRegistry.searchProjects(query),
      faqs: faqRegistry.searchFAQs(query),
    };
  },

  /**
   * Get featured content for homepage
   */
  getFeaturedContent() {
    return {
      locations: locationRegistry.getFeaturedLocations(6),
      services: serviceRegistry.getFeaturedServices(),
      projects: projectRegistry.getFeaturedProjects(),
      testimonials: testimonials.filter(t => t.rating === 5).slice(0, 3),
    };
  },

  /**
   * Get content for a specific location
   */
  getLocationContent(locationSlug: string) {
    const location = locationRegistry.getLocationBySlug(locationSlug);
    if (!location) return null;

    return {
      location,
      nearbyLocations: locationRegistry.getNearbyLocations(locationSlug, 6),
      services: serviceRegistry.getServicesForLocation(locationSlug),
      projects: projectRegistry.getProjectsByLocation(locationSlug),
      testimonials: testimonials.filter(t =>
        t.location?.toLowerCase().includes(location.name.toLowerCase())
      ),
      faqs: faqRegistry.getFAQsByLocation(locationSlug),
    };
  },

  /**
   * Get content for a specific service
   */
  getServiceContent(serviceSlug: string) {
    const service = serviceRegistry.getServiceBySlug(serviceSlug);
    if (!service) return null;

    return {
      service,
      relatedServices: serviceRegistry.getRelatedServices(serviceSlug),
      projects: projectRegistry.getProjectsByService(serviceSlug),
      faqs: faqRegistry.getFAQsByService(serviceSlug),
      pricing: pricingRegistry.find(p => p.id === service.pricingId),
    };
  },

  /**
   * Validate registry data integrity
   */
  validateRegistry(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for duplicate slugs in locations
    const locationSlugs = locationRegistry.getAllLocations().map(l => l.slug);
    const duplicateLocations = locationSlugs.filter((s, i) => locationSlugs.indexOf(s) !== i);
    if (duplicateLocations.length) {
      errors.push(`Duplicate location slugs: ${duplicateLocations.join(', ')}`);
    }

    // Check for duplicate service slugs
    const serviceSlugs = serviceRegistry.getAllServices().map(s => s.slug);
    const duplicateServices = serviceSlugs.filter((s, i) => serviceSlugs.indexOf(s) !== i);
    if (duplicateServices.length) {
      errors.push(`Duplicate service slugs: ${duplicateServices.join(', ')}`);
    }

    // Check project references
    const allLocationSlugs = new Set(locationSlugs);
    const allServiceSlugs = new Set(serviceSlugs);

    projectRegistry.getAllProjects().forEach(project => {
      if (project.locationSlug && !allLocationSlugs.has(project.locationSlug)) {
        errors.push(`Project "${project.title}" references invalid location: ${project.locationSlug}`);
      }
      if (!allServiceSlugs.has(project.serviceSlug)) {
        errors.push(`Project "${project.title}" references invalid service: ${project.serviceSlug}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Generate sitemap entries
   */
  getSitemapEntries(): Array<{ url: string; lastmod: string; priority: number }> {
    const now = new Date().toISOString().split('T')[0];
    const entries: Array<{ url: string; lastmod: string; priority: number }> = [];

    // Location pages
    locationRegistry.getAllLocations().forEach(loc => {
      entries.push({
        url: `/locations/${loc.slug}`,
        lastmod: now,
        priority: loc.priority === 'high' ? 0.9 : loc.priority === 'medium' ? 0.7 : 0.5,
      });
    });

    // Service pages
    serviceRegistry.getAllServices().forEach(svc => {
      entries.push({
        url: `/services/${svc.slug}`,
        lastmod: now,
        priority: svc.featured ? 0.9 : 0.7,
      });
    });

    return entries;
  },
};

// ============================================
// QUICK ACCESS FUNCTIONS
// ============================================

// Locations
export const getLocationBySlug = (slug: string) => locationRegistry.getLocationBySlug(slug);
export const getAllLocations = () => locationRegistry.getAllLocations();
export const getFeaturedLocations = (limit?: number) => locationRegistry.getFeaturedLocations(limit);
export const getNearbyLocations = (slug: string, limit?: number) => locationRegistry.getNearbyLocations(slug, limit);

// Services
export const getServiceBySlug = (slug: string) => serviceRegistry.getServiceBySlug(slug);
export const getAllServices = () => serviceRegistry.getAllServices();
export const getServicesByCategory = (category: string) => serviceRegistry.getServicesByCategory(category);

// Projects
export const getProjectById = (id: string) => projectRegistry.getProjectById(id);
export const getFeaturedProjects = () => projectRegistry.getFeaturedProjects();
export const getProjectsByService = (serviceSlug: string) => projectRegistry.getProjectsByService(serviceSlug);

// FAQs
export const getFAQsByCategory = (category: string) => faqRegistry.getFAQsByCategory(category);
export const getFAQsByService = (serviceSlug: string) => faqRegistry.getFAQsByService(serviceSlug);

// Team
export const getAllTeamMembers = () => teamRegistry.getAllMembers();
export const getFeaturedTeamMembers = () => teamRegistry.getFeaturedMembers();

// Export types
export type { Service, Project, TeamMember, FAQ, Location, PricingItem, Testimonial };
