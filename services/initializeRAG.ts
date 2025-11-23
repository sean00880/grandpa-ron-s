
/**
 * RAG System Initialization Script
 * 
 * This script loads the knowledge base documents and initializes
 * the RAG system. It should be run once at application startup.
 * 
 * Usage (Node.js environment):
 *   import { setupRAG } from './services/initializeRAG';
 *   await setupRAG();
 * 
 * For browser/client-side, the markdown files should be bundled
 * or fetched and passed to initializeRAGSystem().
 */

import * as fs from 'fs';
import * as path from 'path';
import { initializeRAGSystem } from './ragIntegration';
import { getKnowledgeBaseStats } from './knowledgeBase';

/**
 * Load markdown file from filesystem
 */
function loadMarkdownFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error loading file ${filePath}:`, error);
    throw new Error(`Failed to load knowledge base file: ${filePath}`);
  }
}

/**
 * Setup RAG system with knowledge base files
 * This is the main entry point for RAG initialization
 */
export async function setupRAG(): Promise<void> {
  console.log('\n' + '='.repeat(50));
  console.log('🌱 GreenScapes AI - RAG System Initialization');
  console.log('='.repeat(50) + '\n');

  try {
    // Define paths to knowledge base files
    const landscapingPath = path.join('/home/ubuntu', 'landscaping_knowledge_base.md');
    const marketPath = path.join('/home/ubuntu', 'market_analysis.md');

    // Load markdown files
    console.log('📖 Loading knowledge base documents...');
    const landscapingMd = loadMarkdownFile(landscapingPath);
    const marketAnalysisMd = loadMarkdownFile(marketPath);
    
    console.log(`  ✓ Loaded ${landscapingPath}`);
    console.log(`  ✓ Loaded ${marketPath}`);
    console.log(`  Total content: ${((landscapingMd.length + marketAnalysisMd.length) / 1024).toFixed(1)} KB\n`);

    // Initialize RAG system
    const ragService = await initializeRAGSystem(landscapingMd, marketAnalysisMd);

    console.log('\n📊 Knowledge Base Statistics:');
    console.log('─'.repeat(50));
    
    // Note: To get stats, we need to access the vector store
    // This is a simplified version - in production you might want to expose stats
    console.log('  RAG system is ready for queries!');
    console.log('─'.repeat(50));

    console.log('\n✅ RAG system initialization complete!\n');
    console.log('You can now use the following functions:');
    console.log('  - getRAGService() to access the service');
    console.log('  - getQuoteContext(prompt) for enhanced quotes');
    console.log('  - getEnhancedPricingItems(services) for pricing');
    console.log('  - getPropertyReportContext(analysis) for reports\n');

  } catch (error) {
    console.error('\n❌ RAG initialization failed:', error);
    throw error;
  }
}

/**
 * Test the RAG system with sample queries
 */
export async function testRAGSystem(): Promise<void> {
  console.log('\n' + '='.repeat(50));
  console.log('🧪 Testing RAG System');
  console.log('='.repeat(50) + '\n');

  try {
    const { getRAGService } = await import('./ragIntegration');
    const ragService = getRAGService();

    // Test 1: Pricing retrieval
    console.log('Test 1: Pricing Context Retrieval');
    console.log('─'.repeat(50));
    const pricingContext = await ragService.retrievePricingContext('sod installation cost');
    console.log('Query: "sod installation cost"');
    console.log(`Result: ${pricingContext.serviceName}`);
    console.log(`  Price Range: $${pricingContext.priceRange.low} - $${pricingContext.priceRange.high} per ${pricingContext.priceRange.unit}`);
    console.log(`  Factors: ${pricingContext.factors.slice(0, 3).join(', ')}`);
    console.log('✓ Test 1 passed\n');

    // Test 2: Service details
    console.log('Test 2: Service Details Retrieval');
    console.log('─'.repeat(50));
    const serviceDetails = await ragService.retrieveServiceDetails('lawn_care');
    console.log('Query: "lawn_care"');
    console.log(`Result: ${serviceDetails.name}`);
    console.log(`  Description: ${serviceDetails.description.substring(0, 100)}...`);
    console.log(`  Effort: ${serviceDetails.effortIntensity}`);
    console.log('✓ Test 2 passed\n');

    // Test 3: Material costs
    console.log('Test 3: Material Cost Retrieval');
    console.log('─'.repeat(50));
    const materialCosts = await ragService.retrieveMaterialCosts(['mulch', 'pavers']);
    console.log('Query: ["mulch", "pavers"]');
    for (const material of materialCosts) {
      console.log(`  ${material.materialName}: $${material.costPerUnit.toFixed(2)} per ${material.unit}`);
    }
    console.log('✓ Test 3 passed\n');

    // Test 4: Labor rates
    console.log('Test 4: Labor Rate Retrieval');
    console.log('─'.repeat(50));
    const laborRates = await ragService.retrieveLaborRates();
    console.log('Query: general labor rates');
    console.log(`  Range: $${laborRates.hourlyRate.low} - $${laborRates.hourlyRate.high} per hour`);
    console.log(`  Average: $${laborRates.hourlyRate.average.toFixed(2)} per hour`);
    console.log('✓ Test 4 passed\n');

    // Test 5: General retrieval
    console.log('Test 5: General Hybrid Search');
    console.log('─'.repeat(50));
    const retrievalContext = await ragService.retrieve('best practices for spring lawn care');
    console.log('Query: "best practices for spring lawn care"');
    console.log(`  Results: ${retrievalContext.totalResults}`);
    console.log(`  Time: ${retrievalContext.retrievalTime}ms`);
    console.log(`  Strategy: ${retrievalContext.strategy}`);
    console.log('✓ Test 5 passed\n');

    console.log('✅ All tests passed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  setupRAG()
    .then(() => testRAGSystem())
    .then(() => {
      console.log('\n🎉 RAG system is ready for production use!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Initialization failed:', error);
      process.exit(1);
    });
}
