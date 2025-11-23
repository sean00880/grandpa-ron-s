/**
 * AGENT_REGISTRY - Grandpa Ron AI Agents
 *
 * Defines all AI agents for the lawncare services platform,
 * including customer service, provider assistance, and platform intelligence.
 */

import type { TierId } from '../core/dev-pipelines/types';
import type { FeatureKey } from './PRICING_REGISTRY';

// ============================================================================
// Agent Types
// ============================================================================

export type AgentScope = 'platform' | 'customer' | 'provider' | 'admin';

export type AgentCapability =
  | 'multi-modal'          // Image analysis, video analysis
  | 'quote-generation'     // Generate service quotes
  | 'scheduling'           // Optimize scheduling
  | 'property-analysis'    // Analyze property from images
  | 'customer-support'     // Handle customer inquiries
  | 'provider-support'     // Assist service providers
  | 'price-estimation'     // Estimate service costs
  | 'web-research'         // Research best practices
  | 'recommendations';     // Recommend services/providers

export type TaskCategory =
  | 'quote-generation'
  | 'property-analysis'
  | 'scheduling'
  | 'customer-service'
  | 'provider-onboarding'
  | 'price-optimization'
  | 'quality-check'
  | 'recommendations';

// ============================================================================
// Agent Profile Interface
// ============================================================================

export interface AgentProfile {
  id: string;
  displayName: string;
  description: string;
  scope: AgentScope;
  capabilities: AgentCapability[];
  minTier: TierId;
  requiredFeature?: FeatureKey;
  preferredModels: string[];
  systemPromptTemplate: string;
  taskCategories: TaskCategory[];
}

// ============================================================================
// Customer-Facing Agents
// ============================================================================

const QUOTE_ASSISTANT: AgentProfile = {
  id: 'quote-assistant',
  displayName: 'Quote Assistant',
  description: 'AI assistant for generating instant service quotes',
  scope: 'customer',
  capabilities: [
    'quote-generation',
    'property-analysis',
    'price-estimation',
    'multi-modal',
  ],
  minTier: 'free',
  requiredFeature: 'ai:quote-assistant',
  preferredModels: [
    'gemini-pro',
    'gpt-4o',
    'claude-3-5-sonnet',
  ],
  systemPromptTemplate: `You are a helpful lawn care quote assistant.
Analyze the customer's property and service needs to generate accurate estimates.
Consider property size, service type, frequency, and regional pricing.
Be friendly, professional, and transparent about pricing factors.`,
  taskCategories: [
    'quote-generation',
    'price-optimization',
  ],
};

const PROPERTY_ANALYZER: AgentProfile = {
  id: 'property-analyzer',
  displayName: 'Property Analyzer',
  description: 'AI for analyzing property images and estimating service needs',
  scope: 'customer',
  capabilities: [
    'multi-modal',
    'property-analysis',
    'recommendations',
  ],
  minTier: 'customer',
  requiredFeature: 'ai:property-analysis',
  preferredModels: [
    'gemini-pro-vision',
    'gpt-4-vision',
    'claude-3-5-sonnet',
  ],
  systemPromptTemplate: `You are an expert property analyst for lawn care services.
Analyze images to identify:
- Property size and lawn area
- Lawn condition and health
- Obstacles (trees, slopes, features)
- Recommended services
- Maintenance frequency
Provide detailed, actionable insights.`,
  taskCategories: [
    'property-analysis',
    'recommendations',
  ],
};

const SERVICE_RECOMMENDER: AgentProfile = {
  id: 'service-recommender',
  displayName: 'Service Recommender',
  description: 'AI for recommending optimal services and providers',
  scope: 'customer',
  capabilities: [
    'recommendations',
    'web-research',
  ],
  minTier: 'customer',
  requiredFeature: 'ai:service-recommendations',
  preferredModels: [
    'perplexity-sonar',
    'claude-3-5-sonnet',
    'gpt-4o',
  ],
  systemPromptTemplate: `You are a personalized service recommendation engine.
Based on the customer's property, location, budget, and preferences,
recommend the best service types and providers.
Consider seasonality, property condition, and customer goals.`,
  taskCategories: [
    'recommendations',
    'customer-service',
  ],
};

// ============================================================================
// Provider-Facing Agents
// ============================================================================

const SCHEDULING_OPTIMIZER: AgentProfile = {
  id: 'scheduling-optimizer',
  displayName: 'Scheduling Optimizer',
  description: 'AI for optimizing provider schedules and routes',
  scope: 'provider',
  capabilities: [
    'scheduling',
    'recommendations',
  ],
  minTier: 'provider',
  requiredFeature: 'ai:scheduling-optimization',
  preferredModels: [
    'gpt-4o',
    'claude-3-5-sonnet',
    'gemini-pro',
  ],
  systemPromptTemplate: `You are a scheduling optimization expert for service providers.
Optimize routes, minimize travel time, and maximize daily efficiency.
Consider:
- Geographic clustering
- Service duration estimates
- Traffic patterns
- Provider availability
- Customer preferences`,
  taskCategories: [
    'scheduling',
    'price-optimization',
  ],
};

const PROVIDER_ASSISTANT: AgentProfile = {
  id: 'provider-assistant',
  displayName: 'Provider Assistant',
  description: 'AI assistant for helping providers with quotes, scheduling, and customer management',
  scope: 'provider',
  capabilities: [
    'quote-generation',
    'price-estimation',
    'customer-support',
    'provider-support',
  ],
  minTier: 'provider',
  preferredModels: [
    'claude-3-5-sonnet',
    'gpt-4o',
    'gemini-pro',
  ],
  systemPromptTemplate: `You are a business assistant for lawn care service providers.
Help with:
- Competitive pricing strategies
- Customer communication
- Business growth advice
- Service quality tips
Be practical, professional, and focused on business success.`,
  taskCategories: [
    'quote-generation',
    'provider-onboarding',
    'recommendations',
  ],
};

// ============================================================================
// Platform Intelligence Agents
// ============================================================================

const QUALITY_CHECKER: AgentProfile = {
  id: 'quality-checker',
  displayName: 'Quality Checker',
  description: 'AI for validating service quality and provider performance',
  scope: 'platform',
  capabilities: [
    'multi-modal',
    'quality-check',
    'recommendations',
  ],
  minTier: 'provider-pro',
  preferredModels: [
    'gemini-pro-vision',
    'claude-3-5-sonnet',
    'gpt-4-vision',
  ],
  systemPromptTemplate: `You are a quality assurance expert for lawn care services.
Review before/after photos, customer feedback, and service completion data.
Identify issues, verify quality standards, and suggest improvements.`,
  taskCategories: [
    'quality-check',
    'recommendations',
  ],
};

const PRICE_OPTIMIZER: AgentProfile = {
  id: 'price-optimizer',
  displayName: 'Price Optimizer',
  description: 'AI for dynamic pricing and market analysis',
  scope: 'platform',
  capabilities: [
    'price-estimation',
    'web-research',
    'recommendations',
  ],
  minTier: 'enterprise',
  requiredFeature: 'ai:price-estimation',
  preferredModels: [
    'perplexity-sonar',
    'claude-3-5-sonnet',
    'gpt-4o',
  ],
  systemPromptTemplate: `You are a pricing optimization expert for lawn care markets.
Analyze market conditions, competitor pricing, seasonal demand, and regional factors.
Recommend optimal pricing strategies for maximum competitiveness and profitability.`,
  taskCategories: [
    'price-optimization',
    'recommendations',
  ],
};

// ============================================================================
// Agent Registry Export
// ============================================================================

export const AGENT_REGISTRY: Record<string, AgentProfile> = {
  'quote-assistant': QUOTE_ASSISTANT,
  'property-analyzer': PROPERTY_ANALYZER,
  'service-recommender': SERVICE_RECOMMENDER,
  'scheduling-optimizer': SCHEDULING_OPTIMIZER,
  'provider-assistant': PROVIDER_ASSISTANT,
  'quality-checker': QUALITY_CHECKER,
  'price-optimizer': PRICE_OPTIMIZER,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get agent by ID
 */
export function getAgent(agentId: string): AgentProfile | undefined {
  return AGENT_REGISTRY[agentId];
}

/**
 * Get all agents for a tier
 */
export function getAgentsForTier(tierId: TierId): AgentProfile[] {
  const tierOrder: TierId[] = ['free', 'customer', 'provider', 'provider-pro', 'enterprise'];
  const tierIndex = tierOrder.indexOf(tierId);

  return Object.values(AGENT_REGISTRY).filter((agent) => {
    const agentTierIndex = tierOrder.indexOf(agent.minTier);
    return agentTierIndex <= tierIndex;
  });
}

/**
 * Get agents by scope
 */
export function getAgentsByScope(scope: AgentScope): AgentProfile[] {
  return Object.values(AGENT_REGISTRY).filter(
    (agent) => agent.scope === scope || agent.scope === 'platform'
  );
}

/**
 * Get agents by capability
 */
export function getAgentsByCapability(capability: AgentCapability): AgentProfile[] {
  return Object.values(AGENT_REGISTRY).filter(
    (agent) => agent.capabilities.includes(capability)
  );
}

/**
 * Check if agent is available for tier
 */
export function isAgentAvailableForTier(agentId: string, tierId: TierId): boolean {
  const agent = AGENT_REGISTRY[agentId];
  if (!agent) return false;

  const tierOrder: TierId[] = ['free', 'customer', 'provider', 'provider-pro', 'enterprise'];
  const tierIndex = tierOrder.indexOf(tierId);
  const agentTierIndex = tierOrder.indexOf(agent.minTier);

  return agentTierIndex <= tierIndex;
}
