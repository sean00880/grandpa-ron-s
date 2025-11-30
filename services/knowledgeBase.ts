
/**
 * Knowledge Base Processing Service
 * 
 * This module handles the processing and structuring of markdown documents
 * into searchable chunks with rich metadata for the RAG system.
 * 
 * Features:
 * - Intelligent chunking with semantic boundaries
 * - Metadata extraction from document structure
 * - Category and service type classification
 * - Support for multiple document sources
 */

import { DocumentChunk, DocumentMetadata, ChunkingStrategy } from './ragTypes';

// Define the paths to our knowledge base documents
const KNOWLEDGE_BASE_PATHS = {
  landscaping: '/home/ubuntu/landscaping_knowledge_base.md',
  market: '/home/ubuntu/market_analysis.md',
};

/**
 * Extract metadata from a section of text based on content and structure
 */
function extractMetadata(
  content: string,
  sectionTitle: string,
  source: string,
  chunkIndex: number,
  totalChunks: number
): DocumentMetadata {
  const metadata: DocumentMetadata = {
    source,
    section: sectionTitle,
    category: 'general',
    chunkIndex,
    totalChunks,
  };

  // Categorize based on content keywords
  const lowerContent = content.toLowerCase();
  const lowerSection = sectionTitle.toLowerCase();

  // Determine category
  if (lowerSection.includes('pricing') || lowerContent.includes('cost') || lowerContent.includes('price')) {
    metadata.category = 'pricing';
  } else if (lowerSection.includes('labor') || lowerContent.includes('hourly rate') || lowerContent.includes('crew')) {
    metadata.category = 'labor';
  } else if (lowerSection.includes('material') || lowerContent.includes('mulch') || lowerContent.includes('pavers')) {
    metadata.category = 'material';
  } else if (lowerSection.includes('service') || lowerSection.includes('maintenance')) {
    metadata.category = 'service';
  } else if (lowerSection.includes('market') || lowerSection.includes('competition')) {
    metadata.category = 'market_analysis';
  }

  // Determine service type
  if (lowerContent.includes('lawn') || lowerContent.includes('mow') || lowerContent.includes('grass')) {
    metadata.serviceType = 'lawn_care';
  } else if (lowerContent.includes('patio') || lowerContent.includes('walkway') || lowerContent.includes('retaining wall')) {
    metadata.serviceType = 'hardscaping';
  } else if (lowerContent.includes('plant') || lowerContent.includes('tree') || lowerContent.includes('shrub')) {
    metadata.serviceType = 'planting';
  } else if (lowerContent.includes('design') || lowerContent.includes('landscape architect')) {
    metadata.serviceType = 'design';
  } else if (lowerContent.includes('sprinkler') || lowerContent.includes('irrigation')) {
    metadata.serviceType = 'irrigation';
  } else if (lowerContent.includes('xeriscape') || lowerContent.includes('drought')) {
    metadata.serviceType = 'xeriscaping';
  }

  // Determine pricing category
  if (lowerContent.includes('premium') || lowerContent.includes('high-end') || lowerContent.includes('luxury')) {
    metadata.pricingCategory = 'premium';
  } else if (lowerContent.includes('budget') || lowerContent.includes('basic') || lowerContent.includes('low-cost')) {
    metadata.pricingCategory = 'budget';
  } else if (lowerContent.includes('standard') || lowerContent.includes('typical') || lowerContent.includes('average')) {
    metadata.pricingCategory = 'mid-range';
  }

  // Extract region information
  const regions = ['northeast', 'southeast', 'midwest', 'west coast', 'southwest', 'pacific northwest'];
  for (const region of regions) {
    if (lowerContent.includes(region)) {
      metadata.region = region;
      break;
    }
  }
  
  // Also check for specific states
  const stateRegex = /(california|texas|florida|new york|massachusetts|arizona|colorado)/i;
  const stateMatch = content.match(stateRegex);
  if (stateMatch && !metadata.region) {
    metadata.region = stateMatch[1];
  }

  // Determine skill level for labor
  if (lowerContent.includes('skilled') || lowerContent.includes('professional') || lowerContent.includes('expert')) {
    metadata.skillLevel = 'professional';
  } else if (lowerContent.includes('unskilled') || lowerContent.includes('basic labor')) {
    metadata.skillLevel = 'basic';
  } else if (lowerContent.includes('specialist') || lowerContent.includes('licensed')) {
    metadata.skillLevel = 'specialist';
  }

  // Determine seasonal relevance
  if (lowerContent.includes('spring') || lowerContent.includes('april') || lowerContent.includes('may')) {
    metadata.season = 'spring';
  } else if (lowerContent.includes('summer') || lowerContent.includes('june') || lowerContent.includes('july')) {
    metadata.season = 'summer';
  } else if (lowerContent.includes('fall') || lowerContent.includes('autumn') || lowerContent.includes('september')) {
    metadata.season = 'fall';
  } else if (lowerContent.includes('winter') || lowerContent.includes('december') || lowerContent.includes('january')) {
    metadata.season = 'winter';
  }

  return metadata;
}

/**
 * Parse markdown document and extract sections with their content
 */
function parseMarkdownSections(markdown: string): Array<{ title: string; content: string; level: number }> {
  const sections: Array<{ title: string; content: string; level: number }> = [];
  const lines = markdown.split('\n');
  
  let currentSection = { title: 'Introduction', content: '', level: 0 };
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check if line is a header
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headerMatch) {
      // Save previous section if it has content
      if (currentContent.length > 0) {
        currentSection.content = currentContent.join('\n').trim();
        if (currentSection.content.length > 0) {
          sections.push({ ...currentSection });
        }
      }
      
      // Start new section
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      currentSection = { title, content: '', level };
      currentContent = [];
    } else {
      // Add line to current section
      currentContent.push(line);
    }
  }

  // Add the last section
  if (currentContent.length > 0) {
    currentSection.content = currentContent.join('\n').trim();
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }
  }

  return sections;
}

/**
 * Smart chunking that respects semantic boundaries
 * Uses a hybrid approach: respects sections but breaks large sections intelligently
 */
function chunkContent(
  content: string,
  strategy: ChunkingStrategy
): string[] {
  const { targetSize, overlap, respectBoundaries } = strategy;
  
  // If content is small enough, return as single chunk
  const wordCount = content.split(/\s+/).length;
  if (wordCount <= targetSize) {
    return [content];
  }

  const chunks: string[] = [];
  
  if (respectBoundaries) {
    // Try to split by paragraphs first
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    
    let currentChunk: string[] = [];
    let currentWordCount = 0;

    for (const paragraph of paragraphs) {
      const paragraphWords = paragraph.split(/\s+/).length;
      
      // If paragraph alone is too large, split it further
      if (paragraphWords > targetSize * 1.5) {
        // Save current chunk if any
        if (currentChunk.length > 0) {
          chunks.push(currentChunk.join('\n\n').trim());
          currentChunk = [];
          currentWordCount = 0;
        }
        
        // Split large paragraph by sentences
        const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
        let sentenceChunk: string[] = [];
        let sentenceWordCount = 0;
        
        for (const sentence of sentences) {
          const sentenceWords = sentence.split(/\s+/).length;
          if (sentenceWordCount + sentenceWords > targetSize && sentenceChunk.length > 0) {
            chunks.push(sentenceChunk.join(' ').trim());
            sentenceChunk = [sentence];
            sentenceWordCount = sentenceWords;
          } else {
            sentenceChunk.push(sentence);
            sentenceWordCount += sentenceWords;
          }
        }
        
        if (sentenceChunk.length > 0) {
          chunks.push(sentenceChunk.join(' ').trim());
        }
      } else if (currentWordCount + paragraphWords > targetSize && currentChunk.length > 0) {
        // Current chunk is full, save it
        chunks.push(currentChunk.join('\n\n').trim());
        
        // Start new chunk with overlap if needed
        if (overlap > 0 && currentChunk.length > 0) {
          const lastParagraph = currentChunk[currentChunk.length - 1];
          currentChunk = [lastParagraph, paragraph];
          currentWordCount = lastParagraph.split(/\s+/).length + paragraphWords;
        } else {
          currentChunk = [paragraph];
          currentWordCount = paragraphWords;
        }
      } else {
        // Add to current chunk
        currentChunk.push(paragraph);
        currentWordCount += paragraphWords;
      }
    }

    // Add remaining chunk
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n\n').trim());
    }
  } else {
    // Fixed-size chunking with word overlap
    const words = content.split(/\s+/);
    let i = 0;
    
    while (i < words.length) {
      const chunkWords = words.slice(i, i + targetSize);
      chunks.push(chunkWords.join(' '));
      i += targetSize - overlap;
    }
  }

  return chunks.filter(chunk => chunk.trim().length > 0);
}

/**
 * Process a markdown document into structured chunks
 */
export function processDocument(
  markdown: string,
  source: string,
  chunkingStrategy: ChunkingStrategy = {
    type: 'hybrid',
    targetSize: 300,
    overlap: 50,
    respectBoundaries: true,
  }
): DocumentChunk[] {
  const sections = parseMarkdownSections(markdown);
  const allChunks: DocumentChunk[] = [];
  let globalChunkIndex = 0;

  for (const section of sections) {
    // Skip very small sections (less than 50 words)
    const sectionWordCount = section.content.split(/\s+/).length;
    if (sectionWordCount < 50) {
      continue;
    }

    // Chunk the section content
    const contentChunks = chunkContent(section.content, chunkingStrategy);
    
    for (let i = 0; i < contentChunks.length; i++) {
      const chunkContent = contentChunks[i];
      const wordCount = chunkContent.split(/\s+/).length;
      
      // Skip very small chunks
      if (wordCount < 30) {
        continue;
      }

      const metadata = extractMetadata(
        chunkContent,
        section.title,
        source,
        globalChunkIndex,
        contentChunks.length
      );

      const chunk: DocumentChunk = {
        id: `${source}_${globalChunkIndex}`,
        content: chunkContent,
        metadata,
        wordCount,
      };

      allChunks.push(chunk);
      globalChunkIndex++;
    }
  }

  // Update total chunks count
  allChunks.forEach(chunk => {
    chunk.metadata.totalChunks = allChunks.length;
  });

  return allChunks;
}

/**
 * Load and process all knowledge base documents
 */
export async function loadKnowledgeBase(): Promise<DocumentChunk[]> {
  const allChunks: DocumentChunk[] = [];

  try {
    // In a Node.js environment, we'd use fs.readFileSync
    // For browser/client-side, documents would need to be fetched or bundled
    
    // This is a placeholder - in production, you'd load these files appropriately
    // For now, we'll note that this should be called server-side or with bundled content
    
    console.log('Knowledge base loading from:', KNOWLEDGE_BASE_PATHS);
    
    // Note: In a real implementation, you would:
    // const landscapingMd = await fetch('/knowledge-base/landscaping_knowledge_base.md').then(r => r.text());
    // const marketMd = await fetch('/knowledge-base/market_analysis.md').then(r => r.text());
    
    // For this implementation, the documents should be loaded by the server or bundled
    // and passed to the processDocument function
    
    return allChunks;
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    throw new Error(`Failed to load knowledge base: ${error}`);
  }
}

/**
 * Initialize knowledge base with pre-loaded markdown content
 * This function should be called with the actual markdown content
 */
export function initializeKnowledgeBase(
  landscapingMarkdown: string,
  marketAnalysisMarkdown: string,
  chunkingStrategy?: ChunkingStrategy
): DocumentChunk[] {
  console.log('Processing landscaping knowledge base...');
  const landscapingChunks = processDocument(
    landscapingMarkdown,
    'landscaping_knowledge_base',
    chunkingStrategy
  );
  
  console.log('Processing market analysis...');
  const marketChunks = processDocument(
    marketAnalysisMarkdown,
    'market_analysis',
    chunkingStrategy
  );

  const allChunks = [...landscapingChunks, ...marketChunks];
  
  console.log(`Knowledge base initialized with ${allChunks.length} chunks`);
  console.log(`  - Landscaping: ${landscapingChunks.length} chunks`);
  console.log(`  - Market: ${marketChunks.length} chunks`);
  
  return allChunks;
}

/**
 * Filter chunks by metadata criteria
 */
export function filterChunks(
  chunks: DocumentChunk[],
  filters: {
    category?: string;
    serviceType?: string;
    pricingCategory?: 'budget' | 'mid-range' | 'premium';
    region?: string;
    season?: string;
  }
): DocumentChunk[] {
  return chunks.filter(chunk => {
    if (filters.category && chunk.metadata.category !== filters.category) {
      return false;
    }
    if (filters.serviceType && chunk.metadata.serviceType !== filters.serviceType) {
      return false;
    }
    if (filters.pricingCategory && chunk.metadata.pricingCategory !== filters.pricingCategory) {
      return false;
    }
    if (filters.region && chunk.metadata.region !== filters.region) {
      return false;
    }
    if (filters.season && chunk.metadata.season !== filters.season) {
      return false;
    }
    return true;
  });
}

/**
 * Get statistics about the knowledge base
 */
export function getKnowledgeBaseStats(chunks: DocumentChunk[]): {
  totalChunks: number;
  totalWords: number;
  categoryCounts: Record<string, number>;
  serviceTypeCounts: Record<string, number>;
  sourceDistribution: Record<string, number>;
} {
  const stats = {
    totalChunks: chunks.length,
    totalWords: chunks.reduce((sum, chunk) => sum + chunk.wordCount, 0),
    categoryCounts: {} as Record<string, number>,
    serviceTypeCounts: {} as Record<string, number>,
    sourceDistribution: {} as Record<string, number>,
  };

  for (const chunk of chunks) {
    // Count categories
    stats.categoryCounts[chunk.metadata.category] = 
      (stats.categoryCounts[chunk.metadata.category] || 0) + 1;
    
    // Count service types
    if (chunk.metadata.serviceType) {
      stats.serviceTypeCounts[chunk.metadata.serviceType] = 
        (stats.serviceTypeCounts[chunk.metadata.serviceType] || 0) + 1;
    }
    
    // Count sources
    stats.sourceDistribution[chunk.metadata.source] = 
      (stats.sourceDistribution[chunk.metadata.source] || 0) + 1;
  }

  return stats;
}
