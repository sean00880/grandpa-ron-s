
import locationsData from '../data/canal_winchester_locations.json';
import { Location } from '../types';

/**
 * LocationRegistry - Centralized service for accessing location data
 * Provides functions to query, filter, and retrieve location information
 */

export class LocationRegistry {
  private static instance: LocationRegistry;
  private locations: Location[];

  private constructor() {
    this.locations = (locationsData as any)?.locations || [];
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): LocationRegistry {
    if (!LocationRegistry.instance) {
      LocationRegistry.instance = new LocationRegistry();
    }
    return LocationRegistry.instance;
  }

  /**
   * Get all locations
   */
  public getAllLocations(): Location[] {
    return this.locations;
  }

  /**
   * Get location by slug
   */
  public getLocationBySlug(slug: string): Location | undefined {
    return this.locations.find(loc => loc?.slug === slug);
  }

  /**
   * Get locations by distance category
   */
  public getLocationsByDistance(category: string): Location[] {
    return this.locations.filter(loc => loc?.distance_category === category) ?? [];
  }

  /**
   * Get locations by priority
   */
  public getLocationsByPriority(priority: 'high' | 'medium' | 'low'): Location[] {
    return this.locations.filter(loc => loc?.priority === priority) ?? [];
  }

  /**
   * Get nearby locations for a given location
   */
  public getNearbyLocations(slug: string, limit: number = 5): Location[] {
    const current = this.getLocationBySlug(slug);
    if (!current) return [];

    return this.locations
      .filter(loc => loc?.slug !== slug)
      .sort((a, b) => (a?.distance_miles ?? 999) - (b?.distance_miles ?? 999))
      .slice(0, limit);
  }

  /**
   * Get featured locations for homepage/megamenu
   */
  public getFeaturedLocations(limit: number = 12): Location[] {
    return this.locations
      .filter(loc => loc?.priority === 'high')
      .slice(0, limit);
  }

  /**
   * Search locations by name or city
   */
  public searchLocations(query: string): Location[] {
    const lowercaseQuery = query?.toLowerCase() ?? '';
    return this.locations.filter(loc => 
      loc?.name?.toLowerCase()?.includes(lowercaseQuery) || 
      loc?.slug?.toLowerCase()?.includes(lowercaseQuery)
    ) ?? [];
  }

  /**
   * Get location statistics
   */
  public getStatistics() {
    const total = this.locations?.length ?? 0;
    const totalPopulation = this.locations.reduce((sum, loc) => sum + (loc?.population ?? 0), 0);
    const highPriority = this.locations.filter(loc => loc?.priority === 'high')?.length ?? 0;
    const primaryArea = this.locations.filter(loc => loc?.distance_category === '0-10 miles')?.length ?? 0;

    return {
      totalLocations: total,
      totalPopulation,
      highPriorityCount: highPriority,
      primaryAreaCount: primaryArea,
      averageIncome: Math.round(
        this.locations.reduce((sum, loc) => sum + (loc?.median_income ?? 0), 0) / (total || 1)
      )
    };
  }

  /**
   * Get locations organized by distance categories
   */
  public getLocationsByCategories() {
    return {
      'Close By (0-5 miles)': this.locations.filter(loc => 
        loc?.distance_category === '0-5 miles'
      ) ?? [],
      'Extended Area (5-10 miles)': this.locations.filter(loc => 
        loc?.distance_category === '5-10 miles'
      ) ?? [],
      'Service Area (10-15 miles)': this.locations.filter(loc => 
        loc?.distance_category === '10-15 miles'
      ) ?? [],
      'Extended Service (15-20 miles)': this.locations.filter(loc => 
        loc?.distance_category === '15-20 miles'
      ) ?? []
    };
  }
}

// Export singleton instance
export const locationRegistry = LocationRegistry.getInstance();
