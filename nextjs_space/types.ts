
import React from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface TransformationState {
  originalImage: string | null;
  generatedImage: string | null;
  prompt: string;
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
  isAnalyzing: boolean;
  quote: Quote | null;
  isGeneratingQuote: boolean;
}

export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PricingItem {
  id: string;
  service: string;
  unit: string;
  unitPrice: number;
  category: 'material' | 'labor' | 'service';
}

export interface QuoteLineItem {
  serviceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  items: QuoteLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  estimatedDuration: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface AuditMetric {
  name: string;
  score: number;
  status: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  details: string;
}

export interface ImprovementRecommendation {
  title: string;
  description: string;
  roi: 'High' | 'Medium' | 'Low';
  estimatedCost: string;
  impact: string;
}

export interface PropertyReport {
  overallScore: number;
  metrics: AuditMetric[];
  recommendations: ImprovementRecommendation[];
  curbAppealPrediction: string;
  summary: string;
}

// Location Types for Programmatic SEO
export interface Location {
  name: string;
  type: string;
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
  nearby_cities?: string[];
}

export interface Testimonial {
  customer: string;
  rating: number;
  quote: string;
  location?: string;
}
