/**
 * WorkGun Configuration — Grandpa Ron's landscaping-specific data.
 *
 * This file provides the ecosystem-specific data that @growsz/workgun-core
 * algorithms need. The engines are data-agnostic; this config injects
 * landscaping service tiers, Ohio location tiers, and seasonal patterns.
 *
 * C1/C2: This is L4 (ecosystem data) fed into L3 (WorkGun engines).
 * A plumbing company would have different tiers, locations, and seasons
 * but use the SAME engines from @growsz/workgun-core.
 */

import type { ScoringConfig } from '@growsz/workgun-core/scoring';
import type { SeasonalModifier } from '@growsz/workgun-core/pricing';
import type { PipelineStage, FollowUpRules, OperationsConfig } from '@growsz/workgun-core/operations';

// ---------------------------------------------------------------------------
// Lead Scoring Config (landscaping-specific tiers)
// ---------------------------------------------------------------------------

export const scoringConfig: ScoringConfig = {
  serviceTiers: [
    { serviceId: 'lawn-mowing', avgTicketValue: 75, profitMargin: 0.6, laborIntensity: 'low', repeatPotential: 'recurring', upsellPotential: 0.3 },
    { serviceId: 'mulching', avgTicketValue: 350, profitMargin: 0.55, laborIntensity: 'medium', repeatPotential: 'seasonal', upsellPotential: 0.5 },
    { serviceId: 'landscaping', avgTicketValue: 1500, profitMargin: 0.45, laborIntensity: 'high', repeatPotential: 'one-time', upsellPotential: 0.7 },
    { serviceId: 'hardscaping', avgTicketValue: 3500, profitMargin: 0.4, laborIntensity: 'high', repeatPotential: 'one-time', upsellPotential: 0.8 },
    { serviceId: 'tree-trimming', avgTicketValue: 450, profitMargin: 0.5, laborIntensity: 'high', repeatPotential: 'seasonal', upsellPotential: 0.4 },
    { serviceId: 'leaf-removal', avgTicketValue: 200, profitMargin: 0.55, laborIntensity: 'medium', repeatPotential: 'seasonal', upsellPotential: 0.3 },
    { serviceId: 'snow-removal', avgTicketValue: 150, profitMargin: 0.6, laborIntensity: 'medium', repeatPotential: 'seasonal', upsellPotential: 0.2 },
    { serviceId: 'overseeding', avgTicketValue: 300, profitMargin: 0.5, laborIntensity: 'low', repeatPotential: 'seasonal', upsellPotential: 0.6 },
  ],
  locationTiers: [
    { slug: 'new-albany', tier: 'premium', valueMultiplier: 1.8, competitionLevel: 'high', priorityRank: 1 },
    { slug: 'dublin', tier: 'premium', valueMultiplier: 1.7, competitionLevel: 'high', priorityRank: 2 },
    { slug: 'upper-arlington', tier: 'high', valueMultiplier: 1.5, competitionLevel: 'medium', priorityRank: 3 },
    { slug: 'westerville', tier: 'high', valueMultiplier: 1.4, competitionLevel: 'medium', priorityRank: 4 },
    { slug: 'pickerington', tier: 'standard', valueMultiplier: 1.2, competitionLevel: 'low', priorityRank: 5 },
    { slug: 'canal-winchester', tier: 'standard', valueMultiplier: 1.1, competitionLevel: 'low', priorityRank: 6 },
    { slug: 'columbus', tier: 'standard', valueMultiplier: 1.0, competitionLevel: 'high', priorityRank: 7 },
    { slug: 'lancaster', tier: 'developing', valueMultiplier: 0.9, competitionLevel: 'low', priorityRank: 8 },
  ],
  benchmarks: [
    { source: 'organic', expectedConversionRate: 0.08, avgTimeToClose: 7, avgDealValue: 450, qualityScore: 70 },
    { source: 'google-ads', expectedConversionRate: 0.05, avgTimeToClose: 5, avgDealValue: 600, qualityScore: 65 },
    { source: 'referral', expectedConversionRate: 0.15, avgTimeToClose: 3, avgDealValue: 800, qualityScore: 90 },
    { source: 'nextdoor', expectedConversionRate: 0.10, avgTimeToClose: 4, avgDealValue: 350, qualityScore: 75 },
    { source: 'direct', expectedConversionRate: 0.06, avgTimeToClose: 10, avgDealValue: 300, qualityScore: 50 },
  ],
};

// ---------------------------------------------------------------------------
// Seasonal Pricing (Ohio climate patterns)
// ---------------------------------------------------------------------------

export const seasonalModifiers: SeasonalModifier[] = [
  // Mowing: peak spring/summer, off-season winter
  { serviceId: 'lawn-mowing', month: 3, modifier: 1.1 },
  { serviceId: 'lawn-mowing', month: 4, modifier: 1.2 },
  { serviceId: 'lawn-mowing', month: 5, modifier: 1.15 },
  { serviceId: 'lawn-mowing', month: 6, modifier: 1.0 },
  { serviceId: 'lawn-mowing', month: 7, modifier: 1.0 },
  { serviceId: 'lawn-mowing', month: 11, modifier: 0.8 },
  { serviceId: 'lawn-mowing', month: 12, modifier: 0.7 },

  // Mulching: spring peak
  { serviceId: 'mulching', month: 3, modifier: 1.2 },
  { serviceId: 'mulching', month: 4, modifier: 1.3 },
  { serviceId: 'mulching', month: 5, modifier: 1.1 },

  // Snow removal: winter peak
  { serviceId: 'snow-removal', month: 11, modifier: 1.1 },
  { serviceId: 'snow-removal', month: 12, modifier: 1.3 },
  { serviceId: 'snow-removal', month: 1, modifier: 1.3 },
  { serviceId: 'snow-removal', month: 2, modifier: 1.2 },

  // Leaf removal: fall peak
  { serviceId: 'leaf-removal', month: 9, modifier: 1.1 },
  { serviceId: 'leaf-removal', month: 10, modifier: 1.3 },
  { serviceId: 'leaf-removal', month: 11, modifier: 1.2 },
];

// ---------------------------------------------------------------------------
// Pipeline + Operations Config
// ---------------------------------------------------------------------------

export const pipelineStages: PipelineStage[] = [
  { id: 'new', label: 'New Lead', color: '#3b82f6', autoActions: ['send_welcome_email'] },
  { id: 'contacted', label: 'Contacted', color: '#8b5cf6' },
  { id: 'quoted', label: 'Quoted', color: '#f59e0b', autoActions: ['schedule_follow_up'] },
  { id: 'negotiating', label: 'Negotiating', color: '#f97316' },
  { id: 'won', label: 'Won', color: '#22c55e', autoActions: ['create_invoice', 'schedule_job'] },
  { id: 'lost', label: 'Lost', color: '#ef4444' },
];

export const followUpRules: FollowUpRules = {
  hot: 1,
  warm: 2,
  standard: 5,
  low: 14,
};

export const operationsConfig: OperationsConfig = {
  teams: [
    { id: 'crew-a', name: 'Crew Alpha', members: ['Ron', 'Mike'], specialties: ['mowing', 'mulching', 'leaf-removal'], active: true },
    { id: 'crew-b', name: 'Crew Beta', members: ['James', 'Carlos'], specialties: ['landscaping', 'hardscaping', 'tree-trimming'], active: true },
  ],
  schedulingRules: { minGapMinutes: 30, maxDailyJobs: 8, travelBufferMinutes: 15 },
  serviceDurations: [
    { serviceId: 'lawn-mowing', durationMinutes: 45 },
    { serviceId: 'mulching', durationMinutes: 120 },
    { serviceId: 'tree-trimming', durationMinutes: 180 },
    { serviceId: 'landscaping', durationMinutes: 240 },
    { serviceId: 'leaf-removal', durationMinutes: 90 },
    { serviceId: 'snow-removal', durationMinutes: 60 },
    { serviceId: 'hardscaping', durationMinutes: 480 },
    { serviceId: 'overseeding', durationMinutes: 120 },
  ],
};
