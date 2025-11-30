
/**
 * Type definitions for the RAG (Retrieval-Augmented Generation) system
 * These types ensure type safety across the knowledge base, vector store, and RAG service
 */

export interface DocumentMetadata {
  source: string;              // File name or source identifier
  section: string;             // Section title (e.g., "Softscaping Services")
  category: string;            // Category (e.g., "pricing", "service", "labor", "material")
  serviceType?: string;        // Service type (e.g., "lawn_care", "hardscaping", "design")
  pricingCategory?: 'budget' | 'mid-range' | 'premium';
  region?: string;             // Geographic region (e.g., "Northeast", "West Coast")
  skillLevel?: string;         // Labor skill level (e.g., "basic", "skilled", "professional")
  season?: string;             // Seasonal relevance (e.g., "spring", "summer", "year-round")
  chunkIndex: number;          // Position of chunk in original document
  totalChunks: number;         // Total chunks from this document
}

export interface DocumentChunk {
  id: string;                  // Unique identifier for the chunk
  content: string;             // The actual text content
  metadata: DocumentMetadata;  // Structured metadata for filtering
  wordCount: number;           // Number of words in chunk
  embedding?: number[];        // Vector embedding (computed lazily)
}

export interface SearchResult {
  chunk: DocumentChunk;        // The matched document chunk
  score: number;               // Similarity score (0-1, higher is better)
  matchType: 'semantic' | 'keyword' | 'hybrid';  // How the match was found
}

export interface RetrievalContext {
  query: string;               // Original query
  results: SearchResult[];     // Matching chunks
  totalResults: number;        // Total number of results
  retrievalTime: number;       // Time taken in milliseconds
  strategy: string;            // Retrieval strategy used
}

export interface PricingContext {
  serviceName: string;
  priceRange: {
    low: number;
    high: number;
    average?: number;
    unit: string;
  };
  factors: string[];           // Factors affecting price
  region?: string;
  sources: string[];           // Source chunks used
}

export interface ServiceDetails {
  name: string;
  description: string;
  effortIntensity: 'light' | 'moderate' | 'heavy';
  estimatedDuration?: string;
  prerequisites?: string[];
  bestPractices?: string[];
  sources: string[];
}

export interface MaterialCostInfo {
  materialName: string;
  costPerUnit: number;
  unit: string;
  qualityTiers?: {
    budget?: number;
    standard?: number;
    premium?: number;
  };
  sources: string[];
}

export interface LaborRateInfo {
  skillLevel: string;
  hourlyRate: {
    low: number;
    high: number;
    average: number;
  };
  region?: string;
  specializations?: string[];
  sources: string[];
}

export interface VectorStoreConfig {
  embeddingModel: string;      // Gemini model to use for embeddings
  maxChunkSize: number;        // Maximum chunk size in words
  chunkOverlap: number;        // Overlap between chunks in words
  minChunkSize: number;        // Minimum chunk size in words
  topK: number;                // Number of results to return
}

export interface ChunkingStrategy {
  type: 'semantic' | 'fixed' | 'sentence' | 'hybrid';
  targetSize: number;          // Target chunk size
  overlap: number;             // Overlap size
  respectBoundaries: boolean;  // Respect paragraph/section boundaries
}

export interface HybridSearchConfig {
  semanticWeight: number;      // Weight for semantic similarity (0-1)
  keywordWeight: number;       // Weight for keyword matching (0-1)
  minSemanticScore?: number;   // Minimum semantic score threshold
  minKeywordScore?: number;    // Minimum keyword score threshold
}
