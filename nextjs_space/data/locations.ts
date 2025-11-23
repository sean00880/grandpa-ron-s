
import { Location } from '../types';
import locationsData from './canal_winchester_locations.json';

export const locations: Location[] = (locationsData as any)?.locations || [];

export const getLocationBySlug = (slug: string): Location | undefined => {
  return locations.find(loc => loc.slug === slug);
};

export const getLocationsByDistance = (category: string): Location[] => {
  return locations.filter(loc => loc.distance_category === category);
};

export const getNearbyLocations = (currentSlug: string, limit: number = 5): Location[] => {
  const current = getLocationBySlug(currentSlug);
  if (!current) return [];
  
  return locations
    .filter(loc => loc.slug !== currentSlug)
    .sort((a, b) => a.distance_miles - b.distance_miles)
    .slice(0, limit);
};

export const getPriorityLocations = (priority: 'high' | 'medium' | 'low'): Location[] => {
  return locations.filter(loc => loc.priority === priority);
};
