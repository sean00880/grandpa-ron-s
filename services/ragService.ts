
/**
 * RAG Service - High-level Retrieval-Augmented Generation functions
 * 
 * This module provides the main interface for the RAG system,
 * offering specialized retrieval functions for different types of queries.
 * 
 * Features:
 * - Pricing context retrieval
 * - Service detail retrieval
 * - Material cost information
 * - Labor rate information
 * - Context-enhanced prompt generation
 */

import { VectorStore } from './vectorStore';
import {
  DocumentChunk,
  PricingContext,
  ServiceDetails,
  MaterialCostInfo,
  LaborRateInfo,
  RetrievalContext,
  SearchResult,
} from './ragTypes';

/**
 * RAG Service Class
 * Main interface for retrieval-augmented generation
 */
export class RAGService {
  private vectorStore: VectorStore;

  constructor(vectorStore: VectorStore) {
    this.vectorStore = vectorStore;
  }

  /**
   * Retrieve relevant pricing information for a query
   * 
   * @param query - Natural language pricing query (e.g., "how much does sod installation cost?")
   * @returns Structured pricing context with ranges and factors
   */
  async retrievePricingContext(query: string): Promise<PricingContext> {
    const startTime = Date.now();

    // Search with focus on pricing category
    const results = await this.vectorStore.hybridSearch(
      query,
      { semanticWeight: 0.7, keywordWeight: 0.3 },
      { category: 'pricing' }
    );

    // Extract pricing information from results
    const serviceName = this.extractServiceName(query, results);
    const priceRange = this.extractPriceRange(results);
    const factors = this.extractPricingFactors(results);
    const region = this.extractRegion(results);

    return {
      serviceName,
      priceRange,
      factors,
      region,
      sources: results.map(r => r.chunk.metadata.source),
    };
  }

  /**
   * Retrieve detailed service information
   * 
   * @param serviceType - Type of service (e.g., "lawn_care", "hardscaping")
   * @param intensity - Optional effort intensity filter
   * @returns Structured service details
   */
  async retrieveServiceDetails(
    serviceType: string,
    intensity?: 'light' | 'moderate' | 'heavy'
  ): Promise<ServiceDetails> {
    const results = await this.vectorStore.hybridSearch(
      `${serviceType} service description details`,
      { semanticWeight: 0.6, keywordWeight: 0.4 },
      { serviceType, category: 'service' }
    );

    // Extract service details
    const name = serviceType.replace(/_/g, ' ');
    const description = this.extractDescription(results);
    const effortIntensity = intensity || this.extractEffortIntensity(results);
    const estimatedDuration = this.extractDuration(results);
    const prerequisites = this.extractPrerequisites(results);
    const bestPractices = this.extractBestPractices(results);

    return {
      name,
      description,
      effortIntensity,
      estimatedDuration,
      prerequisites,
      bestPractices,
      sources: results.map(r => r.chunk.metadata.source),
    };
  }

  /**
   * Retrieve material cost information
   * 
   * @param materials - Array of material names
   * @returns Array of material cost information
   */
  async retrieveMaterialCosts(materials: string[]): Promise<MaterialCostInfo[]> {
    const costs: MaterialCostInfo[] = [];

    for (const material of materials) {
      const results = await this.vectorStore.hybridSearch(
        `${material} cost price per unit`,
        { semanticWeight: 0.6, keywordWeight: 0.4 },
        { category: 'material' }
      );

      if (results.length > 0) {
        const costInfo = this.extractMaterialCost(material, results);
        costs.push(costInfo);
      }
    }

    return costs;
  }

  /**
   * Retrieve labor rate information
   * 
   * @param region - Optional region filter
   * @param skillLevel - Optional skill level filter
   * @returns Labor rate information
   */
  async retrieveLaborRates(
    region?: string,
    skillLevel?: string
  ): Promise<LaborRateInfo> {
    const query = `labor rates hourly ${skillLevel || ''} ${region || ''}`.trim();
    
    const filters: any = { category: 'labor' };
    
    const results = await this.vectorStore.hybridSearch(
      query,
      { semanticWeight: 0.5, keywordWeight: 0.5 },
      filters
    );

    return this.extractLaborRates(results, region, skillLevel);
  }

  /**
   * Enhance a base prompt with relevant context from the knowledge base
   * 
   * @param basePrompt - The original prompt
   * @param context - Context object with search parameters
   * @returns Enhanced prompt with injected knowledge
   */
  async enhancePromptWithContext(
    basePrompt: string,
    context: {
      query?: string;
      serviceType?: string;
      includesPricing?: boolean;
      includesMaterials?: boolean;
      region?: string;
    }
  ): Promise<string> {
    const contextParts: string[] = [basePrompt];

    // Determine what context to retrieve based on parameters
    if (context.includesPricing) {
      const pricingQuery = context.query || context.serviceType || 'general pricing';
      const pricingContext = await this.retrievePricingContext(pricingQuery);
      
      contextParts.push('\n## Pricing Context:');
      contextParts.push(`Service: ${pricingContext.serviceName}`);
      contextParts.push(`Price Range: $${pricingContext.priceRange.low} - $${pricingContext.priceRange.high} per ${pricingContext.priceRange.unit}`);
      if (pricingContext.priceRange.average) {
        contextParts.push(`Average: $${pricingContext.priceRange.average}`);
      }
      contextParts.push(`Factors: ${pricingContext.factors.join(', ')}`);
    }

    if (context.serviceType) {
      const serviceDetails = await this.retrieveServiceDetails(context.serviceType);
      
      contextParts.push('\n## Service Details:');
      contextParts.push(`Description: ${serviceDetails.description}`);
      contextParts.push(`Effort Intensity: ${serviceDetails.effortIntensity}`);
      if (serviceDetails.estimatedDuration) {
        contextParts.push(`Duration: ${serviceDetails.estimatedDuration}`);
      }
    }

    if (context.includesMaterials && context.query) {
      // Extract material names from query (simple approach)
      const materials = this.extractMaterialsFromQuery(context.query);
      if (materials.length > 0) {
        const materialCosts = await this.retrieveMaterialCosts(materials);
        
        contextParts.push('\n## Material Costs:');
        for (const material of materialCosts) {
          contextParts.push(`- ${material.materialName}: $${material.costPerUnit} per ${material.unit}`);
        }
      }
    }

    // Add general relevant context
    if (context.query) {
      const generalResults = await this.vectorStore.hybridSearch(context.query, { 
        semanticWeight: 0.7, 
        keywordWeight: 0.3 
      });
      
      if (generalResults.length > 0) {
        contextParts.push('\n## Additional Context:');
        const topChunks = generalResults.slice(0, 2);
        for (const result of topChunks) {
          contextParts.push(`\n${result.chunk.content.substring(0, 300)}...`);
        }
      }
    }

    return contextParts.join('\n');
  }

  /**
   * General retrieval function for any query
   */
  async retrieve(
    query: string,
    options: {
      topK?: number;
      filters?: { category?: string; serviceType?: string };
      searchType?: 'semantic' | 'keyword' | 'hybrid';
    } = {}
  ): Promise<RetrievalContext> {
    const startTime = Date.now();
    const searchType = options.searchType || 'hybrid';

    let results: SearchResult[];

    switch (searchType) {
      case 'semantic':
        results = await this.vectorStore.semanticSearch(query, options.topK, options.filters);
        break;
      case 'keyword':
        results = this.vectorStore.keywordSearch(query, options.topK, options.filters);
        break;
      case 'hybrid':
      default:
        results = await this.vectorStore.hybridSearch(query, {}, options.filters);
        break;
    }

    const retrievalTime = Date.now() - startTime;

    return {
      query,
      results,
      totalResults: results.length,
      retrievalTime,
      strategy: searchType,
    };
  }

  // ============================================
  // Private helper methods for extraction
  // ============================================

  private extractServiceName(query: string, results: SearchResult[]): string {
    // Try to extract service name from query or results
    const queryLower = query.toLowerCase();
    
    const serviceKeywords = [
      'sod', 'lawn', 'mowing', 'patio', 'walkway', 'retaining wall',
      'irrigation', 'sprinkler', 'tree', 'shrub', 'mulch', 'design'
    ];
    
    for (const keyword of serviceKeywords) {
      if (queryLower.includes(keyword)) {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }
    
    // Try to extract from results
    if (results.length > 0 && results[0].chunk.metadata.serviceType) {
      return results[0].chunk.metadata.serviceType.replace(/_/g, ' ');
    }
    
    return 'General Landscaping';
  }

  private extractPriceRange(results: SearchResult[]): PricingContext['priceRange'] {
    const prices: number[] = [];
    let unit = 'service';
    
    for (const result of results) {
      const content = result.chunk.content;
      
      // Extract prices using regex (e.g., $1,234 or $12.34)
      const priceMatches = content.match(/\$[\d,]+(?:\.\d{2})?/g);
      if (priceMatches) {
        for (const match of priceMatches) {
          const price = parseFloat(match.replace(/[$,]/g, ''));
          if (!isNaN(price) && price > 0 && price < 1000000) {
            prices.push(price);
          }
        }
      }
      
      // Extract unit
      const unitMatches = content.match(/per (sq ft|square foot|linear ft|hour|acre|tree|plant|cu yard)/i);
      if (unitMatches) {
        unit = unitMatches[1];
      }
    }
    
    if (prices.length === 0) {
      return { low: 0, high: 0, unit: 'service' };
    }
    
    prices.sort((a, b) => a - b);
    const low = prices[0];
    const high = prices[prices.length - 1];
    const average = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    return { low, high, average, unit };
  }

  private extractPricingFactors(results: SearchResult[]): string[] {
    const factors = new Set<string>();
    const factorKeywords = [
      'size', 'complexity', 'material quality', 'labor', 'region', 'location',
      'season', 'accessibility', 'slope', 'soil condition', 'design complexity'
    ];
    
    for (const result of results) {
      const contentLower = result.chunk.content.toLowerCase();
      for (const keyword of factorKeywords) {
        if (contentLower.includes(keyword)) {
          factors.add(keyword);
        }
      }
    }
    
    return Array.from(factors).slice(0, 5);
  }

  private extractRegion(results: SearchResult[]): string | undefined {
    for (const result of results) {
      if (result.chunk.metadata.region) {
        return result.chunk.metadata.region;
      }
    }
    return undefined;
  }

  private extractDescription(results: SearchResult[]): string {
    if (results.length === 0) {
      return 'No description available';
    }
    
    // Use the first chunk's content as description, truncated
    const content = results[0].chunk.content;
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
    return sentences.slice(0, 2).join(' ').trim();
  }

  private extractEffortIntensity(results: SearchResult[]): 'light' | 'moderate' | 'heavy' {
    for (const result of results) {
      const content = result.chunk.content.toLowerCase();
      if (content.includes('heavy') || content.includes('extensive') || content.includes('complex')) {
        return 'heavy';
      }
      if (content.includes('moderate') || content.includes('standard')) {
        return 'moderate';
      }
      if (content.includes('light') || content.includes('simple') || content.includes('basic')) {
        return 'light';
      }
    }
    return 'moderate';
  }

  private extractDuration(results: SearchResult[]): string | undefined {
    for (const result of results) {
      const content = result.chunk.content;
      const durationMatch = content.match(/(\d+[-to]+\d+)\s*(hours?|days?|weeks?)/i);
      if (durationMatch) {
        return durationMatch[0];
      }
    }
    return undefined;
  }

  private extractPrerequisites(results: SearchResult[]): string[] {
    const prerequisites: string[] = [];
    const keywords = ['requires', 'needs', 'must have', 'prerequisite'];
    
    for (const result of results) {
      const content = result.chunk.content;
      for (const keyword of keywords) {
        if (content.toLowerCase().includes(keyword)) {
          // Extract sentence containing the keyword
          const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
          for (const sentence of sentences) {
            if (sentence.toLowerCase().includes(keyword)) {
              prerequisites.push(sentence.trim());
              break;
            }
          }
        }
      }
    }
    
    return prerequisites.slice(0, 3);
  }

  private extractBestPractices(results: SearchResult[]): string[] {
    const practices: string[] = [];
    const keywords = ['best practice', 'recommended', 'should', 'tip', 'important'];
    
    for (const result of results) {
      const content = result.chunk.content;
      for (const keyword of keywords) {
        if (content.toLowerCase().includes(keyword)) {
          const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
          for (const sentence of sentences) {
            if (sentence.toLowerCase().includes(keyword)) {
              practices.push(sentence.trim());
              break;
            }
          }
        }
      }
    }
    
    return practices.slice(0, 3);
  }

  private extractMaterialCost(material: string, results: SearchResult[]): MaterialCostInfo {
    const priceRange = this.extractPriceRange(results);
    
    return {
      materialName: material,
      costPerUnit: priceRange.average || (priceRange.low + priceRange.high) / 2,
      unit: priceRange.unit,
      qualityTiers: {
        budget: priceRange.low,
        standard: priceRange.average,
        premium: priceRange.high,
      },
      sources: results.map(r => r.chunk.metadata.source),
    };
  }

  private extractLaborRates(
    results: SearchResult[],
    region?: string,
    skillLevel?: string
  ): LaborRateInfo {
    const rates: number[] = [];
    
    for (const result of results) {
      const content = result.chunk.content;
      const rateMatches = content.match(/\$(\d+)(?:-\$?(\d+))?\s*(?:per\s+)?(?:hour|hr)/gi);
      
      if (rateMatches) {
        for (const match of rateMatches) {
          const numbers = match.match(/\d+/g);
          if (numbers) {
            rates.push(...numbers.map(n => parseInt(n)));
          }
        }
      }
    }
    
    rates.sort((a, b) => a - b);
    
    const low = rates.length > 0 ? rates[0] : 25;
    const high = rates.length > 0 ? rates[rates.length - 1] : 75;
    const average = rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 50;
    
    return {
      skillLevel: skillLevel || 'general',
      hourlyRate: { low, high, average },
      region,
      specializations: [],
      sources: results.map(r => r.chunk.metadata.source),
    };
  }

  private extractMaterialsFromQuery(query: string): string[] {
    const materials = [
      'sod', 'mulch', 'pavers', 'gravel', 'stone', 'concrete',
      'fence', 'lighting', 'irrigation', 'seed', 'fertilizer'
    ];
    
    const queryLower = query.toLowerCase();
    return materials.filter(m => queryLower.includes(m));
  }
}

/**
 * Create a RAG service instance
 */
export function createRAGService(vectorStore: VectorStore): RAGService {
  return new RAGService(vectorStore);
}
