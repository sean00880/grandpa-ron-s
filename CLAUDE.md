# Grandpa Ron's — WorkGun + WebDevOS Ecosystem

> **Last Updated**: 2026-03-29
> **Version**: 3.0.0
> **Status**: Production-Ready with WebDevOS Integration
> **Ecosystem**: @growsz/grandpa-ron (ecosystems/grandpa-ron-nextjs)
> **Product**: WorkGun (Business Operations) + WebDevOS (Ecosystem Builder)
> **Canonical Spec**: docs/arch/GRANDPA_RON_WEBDEVOS_INTEGRATION.md

## What is Grandpa Ron's?

**Grandpa Ron's** is the first **WorkGun** ecosystem — a field service management platform built on **WebDevOS**. It demonstrates the full GROWSZ product stack:

```
Grandpa Ron's (ecosystem — C2 consumer)
  → WorkGun (business operations platform)
    → WebDevOS (workspace development OS)
      → ArcOrc (frontend suite: LayoutSocket, SurfaceHeader, Studio shell)
      → TryLLM (agent suite: AgentOS, SPBVG, expertise systems)
      → Backend Trinity (Dbity engine + Orcbase adapter + SIWX auth)
```

## Architecture (WebDevOS v1.0)

### Frontend Suite (ArcOrc)
- **LayoutSocket**: Centralized layout for all sidebar surfaces (blog, services, dashboard)
- **SurfaceHeader**: Reusable route-specific tabs per Mission Control surface
- **Studio Shell**: AI Core + CMS + Dev Mode with dedicated layout
- **Theme**: Fully theme-aware via ShadCN CSS variables (0 hardcoded colors)

### Backend Suite (Trinity)
- **Orcbase**: All data access via `lib/orcbase.ts` — zero direct Prisma imports
- **Dbity**: Dual-adapter (Prisma local ↔ Dbity production, controlled by DBITY_MODE)
- **SIWX**: Auth ready (entitlements.ts reads workgun-entitlements.json per tier)

### Agent Suite (TryLLM)
- **WCG Core**: 12 files, ~3,500 LOC — composition graph + enforcement
- **Knowledge Feed**: Multi-model generation (38 SSOT models from model-catalog.json)
- **Workspace Context**: Business identity + preferences + rotating topics

### Mission Control (8 surfaces with SurfaceHeader)
| Surface | Tabs | Data Source |
|---------|------|-------------|
| Overview | — | Orcbase (real Prisma data) |
| Studio | Core/CMS/Pipelines/Workflows/Automations | WCGStore |
| Insights | Feed/Lead/Customer/Business/Industry | InsightsStore + Gemini |
| CRM | Pipeline/Contacts/Invoices/Automations/Activity | Orcbase |
| Operations | Schedule/Dispatch/Crews/Fleet/Timeline | workspaceContext |
| Marketing | Campaigns/SEO/Reviews/Referrals/Social | registries |
| Network | Partners/Listings/Integrations/Referrals | — |
| Commerce | Revenue/Invoices/Subscriptions/Payouts/Promos | Stripe |

### WorkGun Entitlements
Feature gating via `.growsz/registries/product/workgun-entitlements.json`:
- Free ($0): CRM pipeline, 50 contacts
- Starter ($29): + Insights, Operations, Commerce
- Professional ($79): All surfaces including Studio
- Enterprise: White-label, SSO, unlimited

### Tech Stack

- **Framework**: Next.js 16.0.7 (App Router)
- **React**: 19.2.1
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **Database**: Prisma ORM 6.7.0 (SQLite local / PostgreSQL production)
- **AI**: Google Generative AI
- **Animations**: Framer Motion
- **Forms**: EmailJS, Google reCAPTCHA
- **UI Components**: ShadCN UI, Lucide Icons, Recharts, class-variance-authority
- **Testing**: Playwright E2E

## Directory Structure

```
grandpa-ron-nextjs/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── dashboard/         # Dashboard with sidebar
│   ├── blog/              # Blog with sidebar
│   ├── services/          # Services with sidebar
│   ├── locations/         # Location pages
│   └── api/               # API routes
├── components/            # React components
│   ├── app-sidebar.tsx   # Main sidebar component
│   ├── nav-main.tsx      # Navigation with active state
│   └── ui/               # ShadCN UI components
├── hooks/                 # Custom React hooks
│   ├── use-breadcrumbs.ts # Dynamic breadcrumb generation
│   └── use-active-nav.ts  # Active navigation detection
├── lib/                   # Core utilities
│   ├── blog.ts           # Blog data access layer
│   └── prisma.ts         # Prisma client singleton
├── services/             # Business logic services
├── e2e/                   # Playwright E2E tests
│   ├── sidebar.spec.ts   # Sidebar tests (17 tests)
│   ├── helpers.ts        # Test utilities
│   └── README.md         # Testing documentation
├── prisma/                # Database schema
│   ├── schema.prisma     # Models: Quote, Blog, Contact
│   ├── seed.ts           # Sample data seeder
│   └── generated/        # Generated Prisma client
├── .growsz/              # GROWSZ registry & docs
│   ├── registries/       # Business registries
│   └── docs/             # Implementation docs
├── public/                # Static assets
├── .env                   # Database URL (SQLite)
├── .env.local            # Environment variables (not in git)
├── playwright.config.ts  # E2E test configuration
├── package.json          # Dependencies
└── CLAUDE.md             # This file
```

## Development Setup

### Prerequisites

- Node.js 20+
- npm (comes with Node.js)
- Git

### Installation

```bash
# Navigate to ecosystem
cd ecosystems/grandpa-ron-nextjs

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit environment variables
# Add your API keys and configuration

# Run development server
npm run dev
```

The application will be available at http://localhost:3000

### Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server

# E2E Testing (Playwright)
npm run test:e2e      # Run all E2E tests
npm run test:e2e:ui   # Interactive UI test runner
npm run test:e2e:headed # Run with visible browser
npm run test:e2e:debug  # Debug mode with inspector
npm run test:e2e:report # View last test report
```

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Google Generative AI
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key

# Database (Prisma)
DATABASE_URL=your_database_connection_string

# Add other environment variables as needed
```

**📚 Detailed Setup Instructions**: See `docs/API_SETUP_GUIDE.md` for step-by-step configuration instructions for each API service.

**✅ Setup Checklist**: Use `docs/SETUP_CHECKLIST.md` to track your progress through the setup process.

## Database (Prisma)

### Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Schema Location

Prisma schema should be created at `prisma/schema.prisma`

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel

Add all environment variables from `.env.local` to your Vercel project settings.

## AI Integration

This ecosystem uses Google Generative AI for AI capabilities:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
```

## MCP Configuration

This ecosystem has access to the following Claude Code tools (inherited from GROWSZ biosphere):

- **perplexity** - AI research with citations
- **github** - Repository operations
- **context7** - Documentation lookup
- **firecrawl** - Web scraping
- **chrome-devtools** - Browser automation
- **taskmaster** - Task management
- **sentry** - Error tracking
- **stripe** - Payment processing

See `.claude/mcp.json` for configuration.

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Prefer type inference over explicit types when obvious
- Use interfaces for object shapes
- Use type aliases for unions and complex types

### React Components

```typescript
// Prefer function components with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={cn(buttonVariants({ variant }))}>
      {label}
    </button>
  );
}
```

### Styling

- Use Tailwind CSS utility classes
- Use `clsx` or `tailwind-merge` for conditional classes
- Use `class-variance-authority` for component variants

### File Naming

- Components: PascalCase (`Button.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Pages (App Router): lowercase (`page.tsx`, `layout.tsx`)
- API routes: lowercase (`route.ts`)

## Project Architecture

### App Router Structure

```
app/
├── (marketing)/       # Marketing pages group
│   ├── page.tsx      # Home page
│   └── about/        # About page
├── (app)/            # Application pages group
│   └── dashboard/    # Dashboard
├── api/              # API routes
│   └── route.ts      # API endpoint
└── layout.tsx        # Root layout
```

### Component Organization

```
app/
├── components/       # Reusable components
│   ├── ui/          # Base UI components
│   └── features/    # Feature-specific components
└── lib/             # Utilities and helpers
    ├── utils.ts     # Common utilities
    └── api.ts       # API helpers
```

## Integration Guide

### EmailJS Setup

1. Create account at https://www.emailjs.com/
2. Create email service
3. Create email template
4. Add credentials to `.env.local`

### Google reCAPTCHA Setup

1. Create site at https://www.google.com/recaptcha/admin
2. Choose reCAPTCHA v2 or v3
3. Add site key and secret to `.env.local`

### Prisma Database Setup

1. Choose your database (PostgreSQL, MySQL, SQLite, etc.)
2. Create `prisma/schema.prisma`
3. Define your models
4. Run `npx prisma migrate dev`

## Testing

### E2E Testing with Playwright

Playwright is already configured. Run tests:

```bash
# Run all tests (headless)
npm run test:e2e

# Interactive UI mode - best for development
npm run test:e2e:ui

# Debug mode with Playwright Inspector
npm run test:e2e:debug
```

**Test Coverage:**
- Sidebar desktop functionality (17 tests)
- Mobile sidebar (Sheet) behavior
- Navigation and routing
- Active state management
- Location registry integration
- Accessibility (ARIA, keyboard navigation)

See `e2e/README.md` for comprehensive documentation.

### Unit Testing (Optional)

```bash
# Install Vitest and Testing Library
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

## Performance Optimization

- Use Next.js Image component for images
- Implement code splitting with dynamic imports
- Use React.memo() for expensive components
- Leverage Next.js caching strategies
- Monitor Core Web Vitals

## Security Best Practices

- Never commit `.env.local` to git
- Validate all user inputs
- Use environment variables for sensitive data
- Implement rate limiting for API routes
- Keep dependencies updated

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000
```

**Prisma Client out of sync:**
```bash
npx prisma generate
```

**Type errors after dependency update:**
```bash
rm -rf node_modules
npm install
```

## Documentation

### Internal Documentation
- **Biosphere Guide**: `../../CLAUDE.md`
- **Sidebar Implementation**: `.growsz/docs/SIDEBAR_IMPLEMENTATION.md`
- **E2E Testing Guide**: `e2e/README.md`
- **Navigation Hooks**: `hooks/README.md`

### External References
- **Next.js Docs**: https://nextjs.org/docs
- **React 19 Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **ShadCN UI**: https://ui.shadcn.com/docs
- **Playwright**: https://playwright.dev/docs

## Key Features (v2.0)

### ShadCN Sidebar System
- Icon-collapsible mode with cookie persistence
- Dynamic location items from locationSeoRegistry
- Active state highlighting based on current route
- Mobile-responsive Sheet-based navigation

### Navigation Hooks
- `useBreadcrumbs()` - Dynamic breadcrumb generation with SEO schema
- `useActiveNav()` - Route-based active state detection

### Blog System
- Prisma models: BlogPost, BlogCategory, BlogTag
- Data access layer with typed queries
- View count tracking, search functionality

### Lead Scoring (Quote API)
- Composite scoring (0-100)
- Seasonal pricing adjustments
- Competitor context capture
- CLV estimation

## Support

For GROWSZ biosphere-level questions, see the root `CLAUDE.md`.
For ecosystem-specific questions, refer to this file.

---

**Part of the GROWSZ Biosphere**
**Built with Next.js 16 + React 19 + TypeScript + Playwright**
**Last Updated: 2026-01-01 | Version 2.0.0**
