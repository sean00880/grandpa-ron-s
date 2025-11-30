# Grandpa Ron Next.js - Ecosystem Instructions

> **Last Updated**: 2025-11-22
> **Version**: 1.0.0
> **Status**: Initial Configuration
> **Ecosystem**: Grandpa Ron Next.js Application

## What is Grandpa Ron?

**Grandpa Ron** is a Next.js-based application ecosystem within the GROWSZ Biosphere. This project uses Next.js 16, React 19, and modern web technologies to deliver a high-performance web application.

### Tech Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **Database**: Prisma ORM 6.7.0
- **AI**: Google Generative AI
- **Animations**: Framer Motion
- **Forms**: EmailJS, Google reCAPTCHA
- **UI Components**: Lucide Icons, Recharts, class-variance-authority

## Directory Structure

```
grandpa-ron-nextjs/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── ...                # Other routes
├── public/                # Static assets
├── nextjs_space/          # Additional Next.js resources
├── .claude/               # MCP configuration
│   └── mcp.json          # Claude Code tools
├── .env.local            # Environment variables (not in git)
├── .env.local.example    # Environment template
├── package.json          # Dependencies
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.mjs    # PostCSS configuration
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
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
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

### Add Testing Framework (Recommended)

```bash
# Install Vitest and Testing Library
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Install Playwright for E2E testing
npm install -D @playwright/test
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

- **Biosphere Guide**: `../../CLAUDE.md`
- **Next.js Docs**: https://nextjs.org/docs
- **React 19 Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Prisma Docs**: https://www.prisma.io/docs

## Support

For GROWSZ biosphere-level questions, see the root `CLAUDE.md`.
For ecosystem-specific questions, refer to this file.

---

**Part of the GROWSZ Biosphere**
**Built with Next.js 16 + React 19 + TypeScript**
