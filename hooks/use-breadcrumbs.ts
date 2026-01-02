'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Custom hook for generating dynamic breadcrumbs based on the current route
 *
 * @returns Array of breadcrumb items with label and href
 *
 * @example
 * const breadcrumbs = useBreadcrumbs();
 * // On /blog/spring-lawn-guide returns:
 * // [
 * //   { label: 'Home', href: '/' },
 * //   { label: 'Blog', href: '/blog' },
 * //   { label: 'Spring Lawn Guide', href: '/blog/spring-lawn-guide' }
 * // ]
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Always start with Home
    const crumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    // Return just Home for root path
    if (pathname === '/') {
      return crumbs;
    }

    // Split pathname into segments and filter out empty strings
    const segments = pathname.split('/').filter(Boolean);

    // Build breadcrumbs progressively
    segments.forEach((segment, index) => {
      // Build the href by joining all segments up to current index
      const href = '/' + segments.slice(0, index + 1).join('/');

      // Generate human-readable label from segment
      const label = formatSegmentLabel(segment, index > 0 ? segments[index - 1] : null);

      crumbs.push({ label, href });
    });

    return crumbs;
  }, [pathname]);

  return breadcrumbs;
}

/**
 * Formats a URL segment into a human-readable label
 * Handles special cases like location codes, dynamic routes, and kebab-case
 *
 * @param segment - The URL segment to format
 * @param parentSegment - The parent segment for context (optional)
 * @returns Formatted label string
 */
function formatSegmentLabel(segment: string, parentSegment: string | null): string {
  // Handle dynamic route parameters (e.g., [slug], [id])
  if (segment.startsWith('[') && segment.endsWith(']')) {
    return 'Details';
  }

  // Special case mappings for specific routes
  const specialCases: Record<string, string> = {
    'dashboard': 'Dashboard',
    'blog': 'Blog',
    'services': 'Services',
    'locations': 'Locations',
    'about': 'About',
    'contact': 'Contact',
    'testimonials': 'Testimonials',
    'faq': 'FAQ',
    'pricing': 'Pricing',
    'gallery': 'Gallery',
  };

  // Check if segment has a special case mapping
  if (specialCases[segment.toLowerCase()]) {
    return specialCases[segment.toLowerCase()];
  }

  // Handle location codes (e.g., louisville-ky -> Louisville, KY)
  if (parentSegment === 'locations') {
    return formatLocationLabel(segment);
  }

  // Handle service slugs (e.g., lawn-mowing -> Lawn Mowing)
  if (parentSegment === 'services') {
    return formatServiceLabel(segment);
  }

  // Handle blog post slugs (e.g., spring-lawn-guide -> Spring Lawn Guide)
  if (parentSegment === 'blog') {
    return formatBlogPostLabel(segment);
  }

  // Default: Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Formats location slugs into proper city/state format
 * @param segment - Location slug (e.g., "louisville-ky")
 * @returns Formatted location (e.g., "Louisville, KY")
 */
function formatLocationLabel(segment: string): string {
  const parts = segment.split('-');

  // Handle city-state format (e.g., louisville-ky)
  if (parts.length >= 2) {
    const possibleState = parts[parts.length - 1].toUpperCase();

    // Check if last part looks like a state code (2 letters)
    if (possibleState.length === 2) {
      const city = parts
        .slice(0, -1)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      return `${city}, ${possibleState}`;
    }
  }

  // Default to title case if not recognizable location format
  return parts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Formats service slugs with proper capitalization
 * @param segment - Service slug (e.g., "lawn-mowing")
 * @returns Formatted service name (e.g., "Lawn Mowing")
 */
function formatServiceLabel(segment: string): string {
  const serviceLabels: Record<string, string> = {
    'lawn-mowing': 'Lawn Mowing',
    'lawn-care': 'Lawn Care',
    'tree-trimming': 'Tree Trimming',
    'landscaping': 'Landscaping',
    'snow-removal': 'Snow Removal',
    'fertilization': 'Fertilization',
    'aeration': 'Aeration',
    'mulching': 'Mulching',
    'hedge-trimming': 'Hedge Trimming',
    'leaf-removal': 'Leaf Removal',
  };

  return serviceLabels[segment.toLowerCase()] || segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Formats blog post slugs into readable titles
 * @param segment - Blog post slug (e.g., "spring-lawn-guide")
 * @returns Formatted title (e.g., "Spring Lawn Guide")
 */
function formatBlogPostLabel(segment: string): string {
  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => {
      // Capitalize common acronyms
      const upperWord = word.toUpperCase();
      if (['DIY', 'FAQ', 'HOA', 'LAWN', 'KY', 'USA'].includes(upperWord)) {
        return upperWord;
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Hook variant that returns breadcrumbs excluding the current page
 * Useful for navigation breadcrumbs where you don't want to link to current page
 *
 * @returns Array of breadcrumb items excluding the last item
 */
export function useBreadcrumbsWithoutCurrent(): BreadcrumbItem[] {
  const breadcrumbs = useBreadcrumbs();
  return breadcrumbs.slice(0, -1);
}

/**
 * Hook variant that returns structured breadcrumb data for JSON-LD schema
 * Useful for SEO and rich snippets
 *
 * @returns BreadcrumbList schema.org object
 */
export function useBreadcrumbSchema() {
  const breadcrumbs = useBreadcrumbs();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.label,
      'item': `${baseUrl}${crumb.href}`
    }))
  };
}
