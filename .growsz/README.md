# GROWSZ Platform Orchestrator - Grandpa Ron

> **Version**: 1.0.0
> **Status**: Production Configuration
> **Last Updated**: 2025-11-22
> **Purpose**: Centralized registry system for Grandpa Ron lawncare services platform

## Overview

The `.growsz/` directory contains the **centralized registry infrastructure** for the Grandpa Ron ecosystem - a proprietary GROWSZ system that substitutes direct package usage with managed, centralized configurations.

**Key Capabilities**:
- 📊 **Pricing Registry**: Tier-based feature access control
- 🤖 **Agent Registry**: AI agents for customers, providers, and platform intelligence
- 🛠️ **Stack Registry**: Technology stack definitions
- 📈 **Infrastructure Registry**: Service integrations and deployment configurations

---

## Directory Structure

```
.growsz/
├── registries/                    # Centralized registries
│   ├── PRICING_REGISTRY.ts       # Tier entitlements and feature gates
│   ├── AGENT_REGISTRY.ts         # AI agent profiles
│   ├── STACK_REGISTRY.ts         # Technology stacks
│   └── INFRA_REGISTRY.ts         # Infrastructure configuration
│
├── core/
│   └── dev-pipelines/
│       └── types.ts              # Shared type definitions
│
├── pipelines/
│   └── development/              # Development workflow templates
│
├── memory/                       # Context and session management (future)
│
└── registry/                     # Registry service implementations
```

---

## Core Registries

### 1. PRICING_REGISTRY

Defines tier-based access control for the lawncare services platform.

**Tiers**:
- `free` - Basic customer access (2 services/month, 1 property)
- `customer` - Customer Plus ($9.99/mo, 10 services/month, 5 properties)
- `provider` - Provider Basic ($29.99/mo, 50 services/month, 3 team members)
- `provider-pro` - Provider Pro ($79.99/mo, 200 services/month, 10 team members)
- `enterprise` - White-label solution ($299.99/mo, unlimited)

**Feature Categories**:
- Service access (lawn care, tree services, roofing, solar, etc.)
- Provider features (listings, analytics, instant quotes)
- Customer features (booking, AI recommendations, loyalty rewards)
- AI features (quote assistant, property analysis, scheduling optimization)
- Platform features (API access, webhooks, white-label)

**Usage**:
```typescript
import { hasFeature, getPricingForTier } from '.growsz/registries/PRICING_REGISTRY';

// Check feature access
if (hasFeature('provider', 'ai:scheduling-optimization')) {
  // Enable scheduling optimizer
}

// Get pricing
const pricing = getPricingForTier('customer');
// { monthly: 9.99, annual: 99, annualSavings: 20.88 }
```

### 2. AGENT_REGISTRY

Defines AI agents for platform intelligence.

**Agent Categories**:
- **Customer Agents**: Quote Assistant, Property Analyzer, Service Recommender
- **Provider Agents**: Scheduling Optimizer, Provider Assistant
- **Platform Agents**: Quality Checker, Price Optimizer

**Capabilities**:
- Multi-modal (image/video analysis)
- Quote generation
- Property analysis
- Scheduling optimization
- Price estimation
- Web research

**Usage**:
```typescript
import { getAgent, getAgentsForTier } from '.growsz/registries/AGENT_REGISTRY';

// Get specific agent
const quoteAgent = getAgent('quote-assistant');

// Get all agents available for tier
const providerAgents = getAgentsForTier('provider');
```

### 3. STACK_REGISTRY

Defines technology stacks and deployment configurations.

**Stacks**:
- `grandpa-ron-fullstack` - Complete Next.js 16 + React 19 + Prisma stack
- `grandpa-ron-ai` - AI/ML infrastructure (Gemini, GPT, Claude)

**Technologies**:
- Frontend: Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- Backend: Next.js API Routes, Prisma ORM, EmailJS
- Database: PostgreSQL (Supabase), Prisma Client
- AI: Google Generative AI, property analysis, scheduling optimization
- Infrastructure: Vercel, Supabase, reCAPTCHA, Vercel Analytics

**Usage**:
```typescript
import { getStack, isStackCompatibleWithEnv } from '.growsz/registries/STACK_REGISTRY';

const stack = getStack('grandpa-ron-fullstack');
const isCompatible = isStackCompatibleWithEnv('grandpa-ron-ai', 'production');
```

---

## Integration with Application Code

### Using Centralized Registries

Instead of hardcoding features or configurations, **always use the registries**:

```typescript
// ❌ WRONG: Hardcoded feature check
if (user.plan === 'pro') {
  showSchedulingOptimizer();
}

// ✅ CORRECT: Use PRICING_REGISTRY
import { hasFeature } from '.growsz/registries/PRICING_REGISTRY';

if (hasFeature(user.tierId, 'ai:scheduling-optimization')) {
  showSchedulingOptimizer();
}
```

### Feature Gating Example

```typescript
// app/api/quote/route.ts
import { hasFeature } from '@/.growsz/registries/PRICING_REGISTRY';
import { getAgent } from '@/.growsz/registries/AGENT_REGISTRY';

export async function POST(request: Request) {
  const { tierId, propertyData } = await request.json();

  // Check feature access
  if (!hasFeature(tierId, 'ai:quote-assistant')) {
    return Response.json({ error: 'Upgrade required' }, { status: 403 });
  }

  // Get AI agent
  const agent = getAgent('quote-assistant');
  const quote = await generateQuote(agent, propertyData);

  return Response.json(quote);
}
```

### AI Agent Integration

```typescript
// lib/ai/agents.ts
import { getAgent } from '@/.growsz/registries/AGENT_REGISTRY';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeProperty(imageUrl: string, tierId: TierId) {
  const agent = getAgent('property-analyzer');

  if (!agent) {
    throw new Error('Agent not found');
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: agent.preferredModels[0], // Use agent's preferred model
  });

  const result = await model.generateContent([
    agent.systemPromptTemplate,
    { inlineData: { mimeType: 'image/jpeg', data: imageUrl } },
  ]);

  return result.response.text();
}
```

---

## GROWSZ Registry Philosophy

### Centralization Benefits

1. **Single Source of Truth**: All tier entitlements, features, and AI agents defined in one place
2. **Type Safety**: TypeScript interfaces ensure correct usage
3. **Easy Updates**: Change pricing, features, or agent capabilities without touching application code
4. **Consistency**: Same registry system across all GROWSZ ecosystems
5. **Feature Flags**: Built-in support for tier-based feature access

### Registry-Driven Development

- Never hardcode tier checks → Use `PRICING_REGISTRY`
- Never hardcode AI prompts → Use `AGENT_REGISTRY`
- Never hardcode stack configs → Use `STACK_REGISTRY`
- Always extend registries when adding features

---

## Future Enhancements

### Planned Features

- **Pipeline Registry**: Development workflow automation
- **Memory System**: Context cursor and session management
- **Automation Pipelines**: Self-evolution and continuous learning
- **Response Synthesizer**: Consistent API response formatting

---

## Documentation

- **Pricing Registry**: See `registries/PRICING_REGISTRY.ts` inline documentation
- **Agent Registry**: See `registries/AGENT_REGISTRY.ts` inline documentation
- **Stack Registry**: See `registries/STACK_REGISTRY.ts` inline documentation
- **Type Definitions**: See `core/dev-pipelines/types.ts`

---

**Built with ❤️ as part of the GROWSZ Biosphere**
**Proprietary Registry System - Centralized, Type-Safe, Scalable**
