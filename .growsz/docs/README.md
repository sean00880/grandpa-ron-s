# Grandpa Ron's Lawns - Documentation Hub

> **Last Updated**: 2026-01-01
> **Version**: 2.0.0 - Enhanced Business Intelligence
> **Status**: Production-Ready with Lead Scoring

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture overview |
| [INTEGRATION_PROPOSAL.md](./INTEGRATION_PROPOSAL.md) | Registry integration plan |
| [EVOLUTION_ROADMAP.md](./EVOLUTION_ROADMAP.md) | Development roadmap |
| [SEO_STRATEGY.md](./SEO_STRATEGY.md) | Programmatic SEO approach |

---

## Current State (v2.0.0)

### Implemented Features

#### 1. Business Logic Registries (`.growsz/registries/`)

| Registry | Purpose | Status |
|----------|---------|--------|
| `conversionRegistry.ts` | Lead scoring, CLV estimation | ✅ Complete |
| `promotionRegistry.ts` | Promotional offers, promo codes | ✅ Complete |
| `seasonalityRegistry.ts` | Seasonal pricing modifiers | ✅ Complete |
| `competitorRegistry.ts` | SWOT analysis, 6 competitors | ✅ Complete |
| `equipmentRegistry.ts` | Fleet tracking | ✅ Complete |
| `reviewRegistry.ts` | Customer reviews, testimonials | ✅ Complete |
| `locationSeoRegistry.ts` | Programmatic SEO generation | ✅ Complete |

#### 2. Service Layer (`services/`)

| Service | Purpose | Status |
|---------|---------|--------|
| `leadScoringService.ts` | Lead calculations with CLV | ✅ Complete |
| `pricingEngineService.ts` | Seasonal pricing adjustments | ✅ Complete |
| `promotionEngineService.ts` | Promo validation & auto-apply | ✅ Complete |
| `competitorContextService.ts` | Competition analysis | ✅ Complete |
| `socialProofService.ts` | Reviews & trust badges | ✅ Complete |
| `quoteContextService.ts` | Unified context aggregation | ✅ Complete |

#### 3. Enhanced API Routes

| Route | Enhancement | Status |
|-------|-------------|--------|
| `/api/quote` | Full lead scoring, seasonal pricing, promo validation | ✅ Complete |
| `/api/landscape` | Seasonal context injection into AI quotes | ✅ Complete |
| `/api/promo/validate` | Real-time promo code validation | ✅ Complete |

#### 4. Database Schema (`prisma/schema.prisma`)

Enhanced `Quote` model with 15+ new fields:
- Lead scoring: `leadScore`, `leadPriority`, `locationSlug`, `source`
- Engagement: `usedAIPlanner`, `usedAudit`, `pageViewCount`, `isReturnVisit`
- Pricing: `estimatedValue`, `seasonalModifier`, `promoCode`, `promoDiscount`
- Business Intel: `clvFirstYear`, `clvThreeYear`, `competitorContext`
- Follow-up: `recommendedAction`, `followUpDue`, `assignedTo`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Header    │  │   Sidebar   │  │   Main Content      │ │
│  │  Component  │  │   Layout    │  │   (Pages/Routes)    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     SERVICE LAYER                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│
│  │ LeadScoring  │ │PricingEngine │ │ PromotionEngine      ││
│  │   Service    │ │   Service    │ │    Service           ││
│  └──────────────┘ └──────────────┘ └──────────────────────┘│
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│
│  │ Competitor   │ │ SocialProof  │ │ QuoteContext         ││
│  │   Context    │ │   Service    │ │    Service           ││
│  └──────────────┘ └──────────────┘ └──────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                    REGISTRY LAYER                           │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐          │
│  │ Conversion  │ │  Promotion  │ │ Seasonality  │          │
│  │  Registry   │ │  Registry   │ │  Registry    │          │
│  └─────────────┘ └─────────────┘ └──────────────┘          │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐          │
│  │ Competitor  │ │  Equipment  │ │   Review     │          │
│  │  Registry   │ │  Registry   │ │  Registry    │          │
│  └─────────────┘ └─────────────┘ └──────────────┘          │
│  ┌─────────────────────────────────────────────┐           │
│  │           Location SEO Registry             │           │
│  └─────────────────────────────────────────────┘           │
├─────────────────────────────────────────────────────────────┤
│                    DATA LAYER                               │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │    Prisma ORM   │  │       JSON Data Files           │  │
│  │   (PostgreSQL)  │  │  (locations, services, etc.)    │  │
│  └─────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Patterns

### 1. Registry Pattern (Singleton)
```typescript
// Registries hold business logic and data
class ConversionRegistry {
  private static instance: ConversionRegistry;
  public static getInstance(): ConversionRegistry { ... }
}
export const conversionRegistry = ConversionRegistry.getInstance();
```

### 2. Service Layer Pattern
```typescript
// Services consume registries, expose functions
import { conversionRegistry } from '@/.growsz/registries';

export function calculateLeadScore(input: LeadScoringInput): EnhancedLeadScore {
  const baseScore = conversionRegistry.calculateLeadScore(...);
  // Apply business logic transformations
  return enhancedScore;
}
```

### 3. Layout Socket Pattern (Sidebar)
```typescript
// Layout composition with sidebar context
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <main>{children}</main>
  </SidebarInset>
</SidebarProvider>
```

---

## Data Flow: Quote Submission

```
User submits quote form
        │
        ▼
┌───────────────────────────────────────┐
│         /api/quote (POST)             │
│  1. Validate input                    │
│  2. Determine location from address   │
│  3. generateQuoteContext()            │
│     ├── calculateLeadScore()          │
│     ├── getSeasonalContext()          │
│     ├── findApplicablePromotions()    │
│     ├── getCompetitorAnalysis()       │
│     └── getQuoteSocialProof()         │
│  4. validatePromoCode() if provided   │
│  5. Calculate follow-up date          │
│  6. Save to Prisma database           │
│  7. Return enhanced response          │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│         Enhanced Response             │
│  - quoteId                            │
│  - leadScore & priority               │
│  - seasonal context                   │
│  - applicable promotions              │
│  - social proof data                  │
│  - follow-up timeline                 │
└───────────────────────────────────────┘
```

---

## File Structure

```
grandpa-ron-nextjs/
├── .growsz/
│   ├── docs/                    # Documentation (you are here)
│   │   ├── README.md            # This file
│   │   ├── ARCHITECTURE.md      # System architecture
│   │   ├── EVOLUTION_ROADMAP.md # Development roadmap
│   │   └── SEO_STRATEGY.md      # SEO implementation
│   └── registries/              # Business logic registries
│       ├── conversionRegistry.ts
│       ├── promotionRegistry.ts
│       ├── seasonalityRegistry.ts
│       ├── competitorRegistry.ts
│       ├── equipmentRegistry.ts
│       ├── reviewRegistry.ts
│       ├── locationSeoRegistry.ts
│       └── index.ts
├── app/
│   ├── api/
│   │   ├── quote/route.ts       # Enhanced quote API
│   │   ├── landscape/route.ts   # AI quote generation
│   │   └── promo/validate/route.ts
│   ├── (marketing)/             # Marketing pages
│   ├── (app)/                   # Application pages
│   ├── blog/                    # Blog system
│   ├── locations/               # Programmatic SEO pages
│   └── layout.tsx               # Root layout
├── components/
│   ├── ui/                      # Base UI components
│   │   └── sidebar.tsx          # ShadCN sidebar
│   ├── layout/                  # Layout components
│   │   ├── app-sidebar.tsx
│   │   └── sidebar-provider.tsx
│   └── ...
├── services/                    # Service layer
│   ├── leadScoringService.ts
│   ├── pricingEngineService.ts
│   ├── promotionEngineService.ts
│   ├── competitorContextService.ts
│   ├── socialProofService.ts
│   ├── quoteContextService.ts
│   └── index.ts
├── data/                        # Static data files
│   └── canal_winchester_locations.json
├── prisma/
│   └── schema.prisma            # Enhanced database schema
└── types/                       # TypeScript definitions
```

---

## Next Steps

See [EVOLUTION_ROADMAP.md](./EVOLUTION_ROADMAP.md) for the complete development roadmap.

**Immediate priorities:**
1. ⏳ Run Prisma migration for schema changes
2. 🔧 Install ShadCN sidebar component
3. 📄 Create programmatic SEO page templates
4. 📝 Build blog system with sidebar

---

*Part of the GROWSZ Biosphere - Grandpa Ron's Ecosystem*
