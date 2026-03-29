/**
 * Workspace Context Registry — Business identity + owner preferences
 *
 * This is the canonical workspace metadata for Grandpa Ron's ecosystem.
 * Used by Knowledge Feed, AI agents, and all workspace-aware features
 * for context-grounded content generation.
 *
 * WorkGun workspaces will have their own context registries.
 */

export interface WorkspaceContext {
  // Business identity
  business: {
    name: string;
    legalName: string;
    tagline: string;
    founded: number;
    owner: string;
    phone: string;
    email: string;
    website: string;
    address: {
      city: string;
      state: string;
      region: string;
      serviceRadius: string;
    };
    industry: string;
    specialties: string[];
  };

  // Content preferences
  contentPreferences: {
    tone: 'professional' | 'friendly' | 'authoritative' | 'casual';
    audience: string;
    avoidTopics: string[];
    emphasizeTopics: string[];
    localReferences: string[];
    competitorMentionPolicy: 'never' | 'comparative' | 'acknowledge';
    citeSources: boolean;
    includeCallToAction: boolean;
    callToActionType: string;
  };

  // Rotating topics (24h cycle — like ChatGPT Pulse but evolved)
  rotatingTopics: {
    enabled: boolean;
    slotsCount: number;
    rotationIntervalHours: number;
    topicPool: RotatingTopic[];
  };

  // CRM configuration
  crmConfig: {
    pipelineStages: PipelineStage[];
    autoFollowUpDays: Record<string, number>;
    customFields: Array<{ key: string; label: string; type: 'text' | 'number' | 'select' | 'date'; options?: string[] }>;
  };

  // Operations configuration
  operationsConfig: {
    crews: Array<{ id: string; name: string; members: string[]; specialties: string[] }>;
    schedulingRules: { minGapMinutes: number; maxDailyJobs: number; travelBufferMinutes: number };
    serviceDurations: Record<string, number>;
  };

  // Generation quality settings
  generationSettings: {
    defaultModel: string;
    preferredProvider: string;
    minWordCount: number;
    maxWordCount: number;
    includeImages: boolean;
    imageStyle: string;
    outputFormat: 'article' | 'guide' | 'faq' | 'comparison' | 'case_study';
    structuredSections: string[];
  };
}

export interface PipelineStage {
  id: string;
  label: string;
  color: string;
  autoActions?: string[];
}

export interface RotatingTopic {
  id: string;
  name: string;
  description: string;
  category: 'seasonal' | 'evergreen' | 'trending' | 'local' | 'industry';
  weight: number;
  lastUsed?: string;
}

// ---------------------------------------------------------------------------
// Grandpa Ron's Workspace Context (SSOT)
// ---------------------------------------------------------------------------

export const workspaceContext: WorkspaceContext = {
  business: {
    name: "Grandpa Ron's Lawns & Landscape",
    legalName: "Grandpa Ron's Lawns and Landscape LLC",
    tagline: "Quality work that lasts generations",
    founded: 2021,
    owner: "Ron",
    phone: "(220) 666-2520",
    email: "fgreatful@gmail.com",
    website: "https://grandparonslawns.com",
    address: {
      city: "Canal Winchester",
      state: "Ohio",
      region: "Central Ohio / Columbus Metro",
      serviceRadius: "30 miles from Canal Winchester",
    },
    industry: "Landscaping & Lawn Care",
    specialties: [
      "Mulching", "Lawn Mowing", "Tree Trimming & Pruning",
      "Landscaping Design", "Leaf Removal", "Snow & Ice Management",
      "Hardscaping (Patios & Retaining Walls)", "Overseeding & Lawn Renovation",
    ],
  },

  contentPreferences: {
    tone: 'friendly',
    audience: 'Homeowners in Columbus, Ohio metro area',
    avoidTopics: ['competitor pricing specifics', 'DIY chemical applications without safety warnings'],
    emphasizeTopics: [
      'Ohio-specific climate considerations',
      'Central Ohio soil types (clay-heavy)',
      'Seasonal timing for Ohio lawns',
      'Local regulations and HOA compliance',
    ],
    localReferences: [
      'Canal Winchester', 'Columbus', 'Pickerington', 'Lancaster',
      'Groveport', 'Reynoldsburg', 'Westerville', 'Dublin',
      'Ohio State University turf research', 'OSU Extension Office',
    ],
    competitorMentionPolicy: 'never',
    citeSources: true,
    includeCallToAction: true,
    callToActionType: 'Schedule a free consultation',
  },

  crmConfig: {
    pipelineStages: [
      { id: 'new', label: 'New Lead', color: '#3b82f6', autoActions: ['send_welcome_email'] },
      { id: 'contacted', label: 'Contacted', color: '#8b5cf6' },
      { id: 'quoted', label: 'Quoted', color: '#f59e0b', autoActions: ['schedule_follow_up'] },
      { id: 'negotiating', label: 'Negotiating', color: '#f97316' },
      { id: 'won', label: 'Won', color: '#22c55e', autoActions: ['create_invoice', 'schedule_job'] },
      { id: 'lost', label: 'Lost', color: '#ef4444' },
    ],
    autoFollowUpDays: { hot: 1, warm: 2, standard: 5, low: 14 },
    customFields: [
      { key: 'propertySize', label: 'Property Size', type: 'select', options: ['small', 'medium', 'large', 'commercial'] },
      { key: 'lotType', label: 'Lot Type', type: 'select', options: ['residential', 'commercial', 'hoa', 'municipal'] },
      { key: 'preferredDay', label: 'Preferred Day', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
      { key: 'gateCode', label: 'Gate Code', type: 'text' },
      { key: 'estimatedAcreage', label: 'Est. Acreage', type: 'number' },
    ],
  },

  operationsConfig: {
    crews: [
      { id: 'crew-a', name: 'Crew Alpha', members: ['Ron', 'Mike'], specialties: ['mowing', 'mulching', 'leaf-removal'] },
      { id: 'crew-b', name: 'Crew Beta', members: ['James', 'Carlos'], specialties: ['landscaping', 'hardscaping', 'tree-trimming'] },
    ],
    schedulingRules: { minGapMinutes: 30, maxDailyJobs: 8, travelBufferMinutes: 15 },
    serviceDurations: {
      'lawn-mowing': 45, 'mulching': 120, 'tree-trimming': 180,
      'landscaping': 240, 'leaf-removal': 90, 'snow-removal': 60,
      'hardscaping': 480, 'overseeding': 120,
    },
  },

  rotatingTopics: {
    enabled: true,
    slotsCount: 2,
    rotationIntervalHours: 24,
    topicPool: [
      // Seasonal (rotate based on month)
      { id: 'rt-spring-prep', name: 'Spring Lawn Preparation', description: 'Getting your Ohio lawn ready after winter dormancy', category: 'seasonal', weight: 10 },
      { id: 'rt-summer-heat', name: 'Summer Heat Stress Management', description: 'Protecting lawns during Ohio\'s hot, humid summers', category: 'seasonal', weight: 8 },
      { id: 'rt-fall-cleanup', name: 'Fall Leaf Management', description: 'Leaf removal timing and mulching-in-place benefits', category: 'seasonal', weight: 10 },
      { id: 'rt-winter-snow', name: 'Winter Snow & Ice Safety', description: 'Snow removal best practices for Ohio winters', category: 'seasonal', weight: 8 },

      // Evergreen
      { id: 'rt-soil-health', name: 'Ohio Soil Health', description: 'Understanding Central Ohio\'s clay-heavy soils', category: 'evergreen', weight: 7 },
      { id: 'rt-watering', name: 'Smart Watering Practices', description: 'Irrigation efficiency for Ohio\'s variable rainfall', category: 'evergreen', weight: 6 },
      { id: 'rt-mowing-height', name: 'Mowing Height by Grass Type', description: 'Optimal cutting heights for Kentucky Bluegrass, Tall Fescue, Perennial Rye', category: 'evergreen', weight: 7 },
      { id: 'rt-curb-appeal', name: 'Curb Appeal Upgrades', description: 'Landscaping improvements that increase property value', category: 'evergreen', weight: 9 },

      // Local
      { id: 'rt-ohio-regulations', name: 'Ohio Landscaping Regulations', description: 'Local permits, HOA rules, and environmental considerations', category: 'local', weight: 5 },
      { id: 'rt-native-plants', name: 'Native Ohio Plants', description: 'Low-maintenance native plants for Central Ohio landscapes', category: 'local', weight: 6 },

      // Industry
      { id: 'rt-tech-tools', name: 'Lawn Care Technology', description: 'Smart irrigation, robotic mowers, and AI-powered lawn analysis', category: 'industry', weight: 4 },
      { id: 'rt-sustainability', name: 'Sustainable Landscaping', description: 'Eco-friendly practices, organic alternatives, water conservation', category: 'industry', weight: 5 },
    ],
  },

  generationSettings: {
    defaultModel: 'gemini-2.5-flash',
    preferredProvider: 'google',
    minWordCount: 400,
    maxWordCount: 1200,
    includeImages: true,
    imageStyle: 'professional landscaping photography',
    outputFormat: 'article',
    structuredSections: ['title', 'summary', 'body', 'whyItMatters', 'suggestedActions', 'localTip', 'seasonalNote'],
  },
};

// ---------------------------------------------------------------------------
// Rotating Topic Selector (deterministic 24h rotation)
// ---------------------------------------------------------------------------

export function getRotatingTopics(date: Date = new Date()): RotatingTopic[] {
  const { rotatingTopics } = workspaceContext;
  if (!rotatingTopics.enabled) return [];

  const pool = [...rotatingTopics.topicPool];
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const month = date.getMonth();

  // Weight seasonal topics by current month
  const seasonalBoost: Record<string, number[]> = {
    'seasonal': [],
  };

  pool.forEach(t => {
    if (t.category === 'seasonal') {
      // Spring: Mar-May, Summer: Jun-Aug, Fall: Sep-Nov, Winter: Dec-Feb
      if (t.id.includes('spring') && month >= 2 && month <= 4) t.weight *= 3;
      else if (t.id.includes('summer') && month >= 5 && month <= 7) t.weight *= 3;
      else if (t.id.includes('fall') && month >= 8 && month <= 10) t.weight *= 3;
      else if (t.id.includes('winter') && (month >= 11 || month <= 1)) t.weight *= 3;
    }
  });

  // Sort by weight descending, then use day-of-year as deterministic offset
  pool.sort((a, b) => b.weight - a.weight);

  const offset = dayOfYear % Math.max(pool.length - rotatingTopics.slotsCount, 1);
  return pool.slice(offset, offset + rotatingTopics.slotsCount);
}

// ---------------------------------------------------------------------------
// Build Enhanced Prompt (workspace-aware)
// ---------------------------------------------------------------------------

export function buildEnhancedPrompt(topicName: string, topicDescription: string): string {
  const { business, contentPreferences, generationSettings } = workspaceContext;
  const rotatingTopics = getRotatingTopics();

  return `You are a ${contentPreferences.tone} landscaping industry expert writing for ${business.name} (${business.legalName}), a professional lawn care company in ${business.address.city}, ${business.address.state}.

BUSINESS CONTEXT:
- Founded: ${business.founded}
- Service area: ${business.address.region} (${business.address.serviceRadius})
- Specialties: ${business.specialties.join(', ')}
- Phone: ${business.phone}
- Website: ${business.website}

AUDIENCE: ${contentPreferences.audience}

LOCAL CONTEXT:
- Reference these areas when relevant: ${contentPreferences.localReferences.join(', ')}
- Ohio-specific: ${contentPreferences.emphasizeTopics.join('; ')}

CONTENT RULES:
- Tone: ${contentPreferences.tone}
- ${contentPreferences.competitorMentionPolicy === 'never' ? 'Do NOT mention competitors by name.' : ''}
- ${contentPreferences.citeSources ? 'Cite sources where possible (OSU Extension, local research).' : ''}
- Word count: ${generationSettings.minWordCount}-${generationSettings.maxWordCount} words
- ${contentPreferences.includeCallToAction ? `End with CTA: "${contentPreferences.callToActionType}"` : ''}

TODAY'S ROTATING TOPICS (for context): ${rotatingTopics.map(t => t.name).join(', ')}

---

TOPIC: ${topicName}
DESCRIPTION: ${topicDescription}

Write a knowledge article with these EXACT fields as JSON:
{
  "title": "An engaging, specific title about ${topicName}",
  "summary": "A 2-3 sentence summary highlighting the key insight",
  "body": "A detailed article with practical advice specific to ${business.address.region}. Include actionable tips. Reference local conditions (clay soil, variable rainfall, hot summers, cold winters). ${generationSettings.minWordCount}-${generationSettings.maxWordCount} words.",
  "whyItMatters": "A compelling explanation of why this matters to ${business.address.city} area homeowners",
  "suggestedActions": ["Specific action 1", "Specific action 2", "Specific action 3"],
  "localTip": "A tip specific to ${business.address.region} that shows local expertise",
  "seasonalNote": "Current seasonal relevance for Ohio (month: ${new Date().toLocaleString('en-US', { month: 'long' })})"
}

Return ONLY valid JSON. No markdown wrapping.`;
}
