
/**
 * RAG Integration Utilities
 * 
 * This module provides helper functions to seamlessly integrate the RAG system
 * with existing Gemini AI calls and application logic.
 */

import { RAGService } from './ragService';
import { VectorStore } from './vectorStore';
import { initializeKnowledgeBase } from './knowledgeBase';
import { createVectorStore } from './vectorStore';
import { createRAGService } from './ragService';
import type { Quote, PricingItem } from '../types';

// Global RAG service instance (singleton pattern)
let ragServiceInstance: RAGService | null = null;
let initializationPromise: Promise<RAGService> | null = null;

/**
 * Initialize the RAG system with knowledge base documents
 * This should be called once at application startup
 * 
 * @param landscapingMd - Content of landscaping_knowledge_base.md
 * @param marketAnalysisMd - Content of market_analysis.md
 * @returns Initialized RAG service
 */
export async function initializeRAGSystem(
  landscapingMd: string,
  marketAnalysisMd: string
): Promise<RAGService> {
  // If already initializing, return the existing promise
  if (initializationPromise) {
    return initializationPromise;
  }

  // If already initialized, return the instance
  if (ragServiceInstance) {
    return ragServiceInstance;
  }

  console.log('🚀 Initializing RAG system...');

  initializationPromise = (async () => {
    try {
      // Step 1: Process knowledge base documents into chunks
      console.log('📚 Processing knowledge base documents...');
      const chunks = initializeKnowledgeBase(landscapingMd, marketAnalysisMd);
      console.log(`✓ Created ${chunks.length} document chunks`);

      // Step 2: Create vector store and generate embeddings
      console.log('🔢 Generating embeddings...');
      const vectorStore = await createVectorStore(chunks);
      console.log('✓ Vector store initialized');

      // Step 3: Create RAG service
      const ragService = createRAGService(vectorStore);
      ragServiceInstance = ragService;
      
      console.log('✅ RAG system ready!');
      return ragService;
    } catch (error) {
      console.error('❌ Failed to initialize RAG system:', error);
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Get the RAG service instance
 * Throws error if not initialized
 */
export function getRAGService(): RAGService {
  if (!ragServiceInstance) {
    throw new Error('RAG system not initialized. Call initializeRAGSystem() first.');
  }
  return ragServiceInstance;
}

/**
 * Check if RAG system is initialized
 */
export function isRAGInitialized(): boolean {
  return ragServiceInstance !== null;
}

/**
 * Enhanced quote generation with RAG context
 * Integrates with existing geminiService.ts generateQuoteEstimation
 * 
 * @param prompt - User's transformation request
 * @param ragService - Optional RAG service instance (uses global if not provided)
 * @returns Enhanced context for quote generation
 */
export async function getQuoteContext(
  prompt: string,
  ragService?: RAGService
): Promise<string> {
  const service = ragService || getRAGService();

  try {
    // Extract service types from prompt
    const serviceTypes = extractServiceTypes(prompt);
    const materials = extractMaterials(prompt);

    // Build context
    const contextParts: string[] = ['## RAG-Enhanced Pricing Context\n'];

    // Get pricing context
    const pricingContext = await service.retrievePricingContext(prompt);
    contextParts.push(`### ${pricingContext.serviceName} Pricing:`);
    contextParts.push(`- Range: $${pricingContext.priceRange.low.toFixed(2)} - $${pricingContext.priceRange.high.toFixed(2)} per ${pricingContext.priceRange.unit}`);
    if (pricingContext.priceRange.average) {
      contextParts.push(`- Average: $${pricingContext.priceRange.average.toFixed(2)}`);
    }
    contextParts.push(`- Key factors: ${pricingContext.factors.join(', ')}`);

    // Get material costs if applicable
    if (materials.length > 0) {
      const materialCosts = await service.retrieveMaterialCosts(materials);
      contextParts.push('\n### Material Costs:');
      for (const material of materialCosts) {
        contextParts.push(`- ${material.materialName}: $${material.costPerUnit.toFixed(2)} per ${material.unit}`);
      }
    }

    // Get labor rates
    const laborRates = await service.retrieveLaborRates();
    contextParts.push('\n### Labor Rates:');
    contextParts.push(`- Range: $${laborRates.hourlyRate.low} - $${laborRates.hourlyRate.high} per hour`);
    contextParts.push(`- Average: $${laborRates.hourlyRate.average.toFixed(2)} per hour`);

    return contextParts.join('\n');
  } catch (error) {
    console.error('Error getting quote context:', error);
    return ''; // Fall back to no context
  }
}

/**
 * Get enhanced pricing suggestions with RAG
 * Returns more accurate PricingItem array based on knowledge base
 */
export async function getEnhancedPricingItems(
  services: string[],
  ragService?: RAGService
): Promise<PricingItem[]> {
  const service = ragService || getRAGService();
  const pricingItems: PricingItem[] = [];

  for (const serviceName of services) {
    try {
      const pricingContext = await service.retrievePricingContext(serviceName);
      
      // Convert to PricingItem format
      const avgPrice = pricingContext.priceRange.average || 
        (pricingContext.priceRange.low + pricingContext.priceRange.high) / 2;

      pricingItems.push({
        id: serviceName.toLowerCase().replace(/\s+/g, '_'),
        service: pricingContext.serviceName,
        unit: pricingContext.priceRange.unit,
        unitPrice: avgPrice,
        category: 'service', // Could be enhanced with metadata
      });
    } catch (error) {
      console.error(`Error getting pricing for ${serviceName}:`, error);
    }
  }

  return pricingItems;
}

/**
 * Generate enhanced context for property report
 */
export async function getPropertyReportContext(
  imageAnalysis: string,
  ragService?: RAGService
): Promise<string> {
  const service = ragService || getRAGService();

  try {
    // Get relevant context based on image analysis
    const retrievalContext = await service.retrieve(imageAnalysis, {
      topK: 3,
      searchType: 'hybrid',
    });

    const contextParts: string[] = ['## Industry Best Practices & Standards:\n'];
    
    for (const result of retrievalContext.results) {
      contextParts.push(`### ${result.chunk.metadata.section}`);
      contextParts.push(result.chunk.content.substring(0, 200) + '...\n');
    }

    return contextParts.join('\n');
  } catch (error) {
    console.error('Error getting property report context:', error);
    return '';
  }
}

/**
 * Get suggestions enhanced with RAG knowledge
 */
export async function getEnhancedSuggestions(
  imageContext: string,
  ragService?: RAGService
): Promise<string[]> {
  const service = ragService || getRAGService();

  try {
    // Get relevant services from knowledge base
    const retrievalContext = await service.retrieve(
      `landscaping improvements ${imageContext}`,
      { topK: 5, searchType: 'hybrid' }
    );

    const suggestions = new Set<string>();
    
    for (const result of retrievalContext.results) {
      // Extract service names from metadata
      if (result.chunk.metadata.serviceType) {
        const serviceName = result.chunk.metadata.serviceType.replace(/_/g, ' ');
        suggestions.add(serviceName);
      }
      
      // Extract from content
      const content = result.chunk.content;
      const serviceMatch = content.match(/^([A-Z][a-z\s]+):/m);
      if (serviceMatch) {
        suggestions.add(serviceMatch[1]);
      }
    }

    return Array.from(suggestions).slice(0, 5);
  } catch (error) {
    console.error('Error getting enhanced suggestions:', error);
    return [];
  }
}

// ============================================
// Helper functions
// ============================================

/**
 * Extract service types from prompt text
 */
function extractServiceTypes(prompt: string): string[] {
  const serviceKeywords = [
    'lawn', 'grass', 'sod', 'mowing',
    'patio', 'walkway', 'pathway',
    'retaining wall', 'wall',
    'tree', 'shrub', 'plant', 'flower',
    'mulch', 'gravel', 'stone',
    'fence', 'lighting', 'irrigation', 'sprinkler',
    'design', 'landscape'
  ];

  const promptLower = prompt.toLowerCase();
  return serviceKeywords.filter(keyword => promptLower.includes(keyword));
}

/**
 * Extract material names from prompt
 */
function extractMaterials(prompt: string): string[] {
  const materials = [
    'sod', 'mulch', 'pavers', 'gravel', 'stone', 'concrete',
    'fence', 'lighting', 'seed', 'fertilizer', 'wood'
  ];

  const promptLower = prompt.toLowerCase();
  return materials.filter(material => promptLower.includes(material));
}

/**
 * Format context for Gemini prompt injection
 */
export function formatContextForPrompt(context: string): string {
  return `\n\n---\n**Knowledge Base Context:**\n${context}\n---\n`;
}

/**
 * Merge RAG pricing with legacy pricing registry
 * Useful for gradual migration
 */
/**
 * Enhance a prompt with RAG context (wrapper function for geminiService compatibility)
 */
export async function enhancePromptWithRAG(
  prompt: string,
  type: 'design' | 'pricing' | 'audit'
): Promise<string> {
  if (!isRAGInitialized()) {
    return prompt; // Fallback to original prompt if RAG not initialized
  }

  const ragService = getRAGService();
  
  try {
    if (type === 'pricing') {
      const context = await getQuoteContext(prompt);
      return `${prompt}\n\nConsider these insights: ${context.substring(0, 500)}...`;
    } else if (type === 'design') {
      const suggestions = await getEnhancedSuggestions(prompt);
      return `${prompt}\n\nProfessional recommendations: ${suggestions.join(', ')}`;
    } else {
      const context = await getPropertyReportContext(prompt);
      return `${prompt}\n\nContext: ${context.substring(0, 500)}...`;
    }
  } catch (error) {
    console.error('Error enhancing prompt with RAG:', error);
    return prompt;
  }
}

/**
 * Validate estimate with RAG (wrapper function for geminiService compatibility)
 */
export async function validateEstimateWithRAG(
  quote: Quote,
  prompt: string
): Promise<{ isValid: boolean; issues: string[]; suggestions: string[] }> {
  if (!isRAGInitialized()) {
    return { isValid: true, issues: [], suggestions: [] };
  }

  try {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Validate each item's pricing
    for (const item of quote.items) {
      const pricingData = await getRAGService().retrievePricingContext(item.description);
      
      // Check if pricing is within reasonable range
      const avgPrice = (pricingData.priceRange.low + pricingData.priceRange.high) / 2;
      const itemAvgPrice = item.total / (item.quantity || 1);
      
      if (itemAvgPrice < pricingData.priceRange.low * 0.5 || itemAvgPrice > pricingData.priceRange.high * 2) {
        issues.push(`${item.description} pricing may be outside normal range`);
        suggestions.push(`Consider ${pricingData.serviceName} at $${avgPrice.toFixed(2)} per ${pricingData.priceRange.unit}`);
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  } catch (error) {
    console.error('Error validating estimate with RAG:', error);
    return { isValid: true, issues: [], suggestions: [] };
  }
}

export async function getMergedPricingData(
  legacyPricing: PricingItem[],
  ragService?: RAGService
): Promise<PricingItem[]> {
  if (!isRAGInitialized()) {
    return legacyPricing;
  }

  const service = ragService || getRAGService();
  const enhancedPricing: PricingItem[] = [...legacyPricing];

  // Try to enhance each item with RAG data
  for (let i = 0; i < enhancedPricing.length; i++) {
    try {
      const item = enhancedPricing[i];
      const pricingContext = await service.retrievePricingContext(item.service);
      
      // Update with RAG data if available
      if (pricingContext.priceRange.average) {
        enhancedPricing[i] = {
          ...item,
          unitPrice: pricingContext.priceRange.average,
        };
      }
    } catch (error) {
      // Keep legacy pricing on error
      console.warn(`Could not enhance pricing for ${enhancedPricing[i].service}`);
    }
  }

  return enhancedPricing;
}
