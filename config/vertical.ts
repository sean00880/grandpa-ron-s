/**
 * Vertical Configuration — Grandpa Ron's workspace config.
 *
 * This file is the ecosystem's binding to its vertical registry.
 * The SSOT is .growsz/registries/verticals/field-service.json at biosphere level.
 * This local module reads it at build time and exports typed config.
 *
 * C1/C2: This is the L4 (ecosystem) → L3 (WorkGun vertical) binding.
 * When @growsz/workgun-core is extracted, this becomes:
 *   import { loadVertical } from '@growsz/workgun-core';
 *   export const vertical = loadVertical('field-service');
 */

import type { VerticalRegistry } from '@growsz/webdevos-core/vertical';

// Read vertical config. In production, this would come from @growsz/workgun-core.
// For now, we inline the surface definitions that drive the dashboard layout.
export const vertical: VerticalRegistry = {
  id: 'field-service',
  brand: 'WorkGun',
  package: '@growsz/workgun-core',
  schemaVersion: '1.0.0',

  surfaces: {
    overview:   { label: 'Overview',   icon: 'LayoutDashboard', color: '#6366f1', tabs: [] },
    studio:     { label: 'Studio',     icon: 'Code2',           color: '#06b6d4', tabs: [
      { id: 'core', label: 'AI Core', component: 'ai-conversation' },
      { id: 'cms', label: 'CMS', component: 'wcg-editor' },
      { id: 'pipelines', label: 'Pipelines', component: 'pipeline-board' },
      { id: 'workflows', label: 'Workflows', component: 'dependency-graph' },
      { id: 'automations', label: 'Automations', component: 'automation-canvas', requiredTier: 'professional' },
    ]},
    insights:   { label: 'Insights',   icon: 'BarChart3',       color: '#22c55e', requiredTier: 'starter', tabs: [
      { id: 'feed', label: 'Knowledge Feed', component: 'knowledge-feed', color: '#22c55e' },
      { id: 'leads', label: 'Lead Insights', component: 'analytics-leads' },
      { id: 'customers', label: 'Customer Insights', component: 'analytics-customers' },
      { id: 'business', label: 'Business Intel', component: 'analytics-business' },
      { id: 'industry', label: 'Industry Trends', component: 'analytics-industry', requiredTier: 'professional' },
    ]},
    crm:        { label: 'CRM',        icon: 'Users',           color: '#8b5cf6', tabs: [
      { id: 'pipeline', label: 'Pipeline', component: 'kanban-board', color: '#8b5cf6' },
      { id: 'contacts', label: 'Contacts', component: 'contact-list' },
      { id: 'invoices', label: 'Invoices', component: 'invoice-manager' },
      { id: 'automations', label: 'Automations', component: 'automation-rules' },
      { id: 'activity', label: 'Activity', component: 'activity-timeline' },
    ]},
    operations: { label: 'Operations', icon: 'CalendarDays',    color: '#f97316', requiredTier: 'starter', tabs: [
      { id: 'schedule', label: 'Schedule', component: 'resource-scheduler', color: '#f97316' },
      { id: 'dispatch', label: 'Dispatch', component: 'resource-dispatcher' },
      { id: 'crews', label: 'Crews', component: 'resource-teams' },
      { id: 'fleet', label: 'Fleet', component: 'asset-tracker' },
      { id: 'timeline', label: 'Timeline', component: 'ops-timeline' },
    ]},
    marketing:  { label: 'Marketing',  icon: 'Megaphone',       color: '#ec4899', tabs: [
      { id: 'campaigns', label: 'Campaigns', component: 'campaign-manager', color: '#ec4899' },
      { id: 'seo', label: 'SEO', component: 'seo-dashboard' },
      { id: 'reviews', label: 'Reviews', component: 'review-manager' },
      { id: 'referrals', label: 'Referrals', component: 'referral-program' },
      { id: 'social', label: 'Social', component: 'social-presence' },
    ]},
    network:    { label: 'Network',    icon: 'Globe',           color: '#06b6d4', tabs: [
      { id: 'partners', label: 'Partners', component: 'partner-directory', color: '#06b6d4' },
      { id: 'listings', label: 'Listings', component: 'listing-manager' },
      { id: 'integrations', label: 'Integrations', component: 'integration-status' },
      { id: 'referrals', label: 'Referrals', component: 'referral-tracker' },
    ]},
    commerce:   { label: 'Commerce',   icon: 'CreditCard',      color: '#22c55e', requiredTier: 'starter', tabs: [
      { id: 'revenue', label: 'Revenue', component: 'revenue-dashboard', color: '#22c55e' },
      { id: 'invoices', label: 'Invoices', component: 'invoice-list' },
      { id: 'subscriptions', label: 'Subscriptions', component: 'subscription-manager' },
      { id: 'payouts', label: 'Payouts', component: 'payout-tracker' },
      { id: 'promos', label: 'Promos', component: 'promo-manager' },
    ]},
  },

  domain: {
    resource_type: 'crew',
    asset_type: 'vehicle',
    pipeline_noun: 'quote',
    pipeline_noun_plural: 'quotes',
    scoring_model: 'field-service-lead-v1',
    currency_label: 'Quote Value',
    client_noun: 'customer',
  },

  entitlements: {
    tiers: [
      { id: 'free', name: 'Free', price: 0, cycle: 'monthly', surfaces: ['overview', 'crm', 'marketing'], limits: { contacts: 50, ai_generations: 5, storage_mb: 100 }, isDefault: true },
      { id: 'starter', name: 'Starter', price: 29, cycle: 'monthly', surfaces: ['overview', 'crm', 'marketing', 'insights', 'operations', 'commerce'], limits: { contacts: 500, ai_generations: 50, storage_mb: 1000 } },
      { id: 'professional', name: 'Professional', price: 79, cycle: 'monthly', surfaces: ['*'], limits: { contacts: -1, ai_generations: -1, storage_mb: 10000 } },
      { id: 'enterprise', name: 'Enterprise', price: 199, cycle: 'monthly', surfaces: ['*'], limits: { contacts: -1, ai_generations: -1, storage_mb: -1 } },
    ],
  },

  onboarding: {
    industry_template: 'landscaping',
    seed_data: true,
    wizard_steps: ['business-info', 'services-catalog', 'crew-setup', 'payment-connect', 'first-quote'],
  },

  featureFlags: {
    ai_visualizer: true,
    property_audit: true,
    crew_dispatch: true,
    fleet_tracking: true,
    snow_removal: true,
    stripe_invoicing: true,
    gmail_inbox: false,
    quickbooks_sync: false,
    multi_location: false,
    white_label: false,
  },
};
