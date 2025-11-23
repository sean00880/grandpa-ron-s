# Grandpa Ron Next.js

> Part of the **GROWSZ Biosphere** - An independent ecosystem built with Next.js 16 + React 19 + TypeScript

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and configured as a GROWSZ ecosystem.

## Tech Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **Database**: Prisma ORM 6.7.0
- **AI**: Google Generative AI
- **Animations**: Framer Motion
- **UI**: Lucide Icons, Recharts

## Quick Start

### Prerequisites

- Node.js 20+
- npm (comes with Node.js)

### Installation

```bash
# Navigate to this ecosystem (if not already here)
cd ecosystems/grandpa-ron-nextjs

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your API keys
# Then start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

- Google Generative AI API key
- EmailJS credentials
- Google reCAPTCHA keys
- Database connection string
- Other API keys as needed

## Database Setup (Prisma)

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

## Project Structure

```
grandpa-ron-nextjs/
├── app/              # Next.js App Router (pages, layouts, API routes)
├── public/           # Static assets
├── .claude/          # MCP configuration for AI development tools
├── CLAUDE.md         # Ecosystem-specific development guide
└── package.json      # Dependencies
```

## Documentation

- **Ecosystem Guide**: See `CLAUDE.md` for detailed development instructions
- **GROWSZ Biosphere**: See `../../CLAUDE.md` for platform-level documentation
- **Next.js Docs**: https://nextjs.org/docs
- **React 19**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The easiest way to deploy is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Environment Variables

Add all variables from `.env.local` to your deployment platform.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

---

**Built with ❤️ as part of the GROWSZ Biosphere**
