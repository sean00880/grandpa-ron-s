# API Configuration Guide for Grandpa Ron Next.js

> Complete setup instructions for all external APIs and services

## Table of Contents

1. [Google Generative AI (Gemini)](#1-google-generative-ai-gemini)
2. [EmailJS](#2-emailjs)
3. [Google reCAPTCHA](#3-google-recaptcha)
4. [Prisma Database](#4-prisma-database)
5. [Vercel Deployment](#5-vercel-deployment)
6. [Optional Services](#6-optional-services)

---

## 1. Google Generative AI (Gemini)

Google's Generative AI provides powerful AI capabilities for your application.

### Step 1: Get API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Choose an existing Google Cloud project or create a new one
5. Click **"Create API key in existing project"** or **"Create API key in new project"**
6. Copy the generated API key

### Step 2: Configure Environment Variable

Add to `.env.local`:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 3: Usage Example

```typescript
// app/api/generate/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  const response = result.response;

  return Response.json({ text: response.text() });
}
```

### Pricing

- **Free Tier**: 60 requests per minute
- **Paid Tier**: Higher rate limits available

### Documentation

- [Google AI Studio](https://ai.google.dev/)
- [Gemini API Docs](https://ai.google.dev/docs)

---

## 2. EmailJS

EmailJS allows you to send emails directly from client-side JavaScript without a backend server.

### Step 1: Create Account

1. Go to [EmailJS](template_3cs9fmt)
2. Click **"Sign Up"** (free account available)
3. Verify your email address

### Step 2: Add Email Service

1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - **Outlook/Office 365**
   - **Yahoo**
   - **Custom SMTP**
4. Follow the connection instructions for your provider
5. Test the connection
6. Copy the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template

1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Design your email template with variables:

```html
Subject: New Contact Form Submission

Hello,

You have a new message from {{from_name}} ({{from_email}}):

{{message}}

Best regards,
Your Website
```

4. Save and copy the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key

1. Go to **"Account"** → **"General"**
2. Find your **Public Key** (e.g., `abcDEF123456`)

### Step 5: Configure Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xyz789
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=abcDEF123456
```

### Step 6: Usage Example

```typescript
// components/ContactForm.tsx
'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        e.currentTarget,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      alert('Message sent successfully!');
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="from_name" placeholder="Name" required />
      <input type="email" name="from_email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

### Pricing

- **Free Tier**: 200 emails/month
- **Paid Plans**: Starting at $15/month for 1,000 emails

### Documentation

- [EmailJS Documentation](https://www.emailjs.com/docs/)

---

## 3. Google reCAPTCHA

Protect your forms from spam and abuse with Google reCAPTCHA.

### Step 1: Register Site

1. Go to [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account
3. Fill in the registration form:
   - **Label**: "Grandpa Ron Contact Form" (or any name)
   - **reCAPTCHA type**: Choose one:
     - **reCAPTCHA v2** ("I'm not a robot" checkbox) - Recommended for most use cases
     - **reCAPTCHA v3** (invisible, score-based) - Better UX but requires threshold tuning
     - **reCAPTCHA Enterprise** - Advanced features, paid
   - **Domains**:
     - For development: `localhost`
     - For production: `yourdomain.com`
4. Accept the terms of service
5. Click **"Submit"**

### Step 2: Get Keys

After registration, you'll receive:
- **Site Key** (public, used in frontend)
- **Secret Key** (private, used in backend)

### Step 3: Configure Environment Variables

Add to `.env.local`:

```bash
# Public key (exposed to client)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Secret key (server-side only)
RECAPTCHA_SECRET_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 4: Installation

Already installed in `package.json`:
```bash
npm install react-google-recaptcha @types/react-google-recaptcha
```

### Step 5: Usage Example (reCAPTCHA v2)

**Frontend Component:**

```typescript
// components/ContactFormWithCaptcha.tsx
'use client';

import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export function ContactFormWithCaptcha() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      alert('Please complete the CAPTCHA');
      return;
    }

    // Verify captcha on backend
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        captchaToken,
        // ... other form data
      }),
    });

    if (response.ok) {
      alert('Form submitted!');
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        onChange={(token) => setCaptchaToken(token)}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

**Backend Verification:**

```typescript
// app/api/contact/route.ts
export async function POST(request: Request) {
  const { captchaToken } = await request.json();

  // Verify captcha with Google
  const verifyResponse = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
    }
  );

  const verifyData = await verifyResponse.json();

  if (!verifyData.success) {
    return Response.json(
      { error: 'Invalid CAPTCHA' },
      { status: 400 }
    );
  }

  // Process form submission
  return Response.json({ success: true });
}
```

### reCAPTCHA v3 Example

```typescript
// For invisible reCAPTCHA v3
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function MyForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async () => {
    if (!executeRecaptcha) return;

    const token = await executeRecaptcha('submit_form');
    // Send token to backend for verification
  };
}

// Wrap your app
<GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
  <MyForm />
</GoogleReCaptchaProvider>
```

### Pricing

- **Free**: Unlimited for most websites
- **Enterprise**: Advanced features, custom pricing

### Documentation

- [reCAPTCHA Documentation](https://developers.google.com/recaptcha/intro)
- [React reCAPTCHA Package](https://github.com/dozoisch/react-google-recaptcha)

---

## 4. Prisma Database

Prisma is a modern ORM for TypeScript/JavaScript that works with multiple databases.

### Step 1: Choose Database

Prisma supports:
- **PostgreSQL** (recommended for production)
- **MySQL**
- **SQLite** (good for development)
- **MongoDB**
- **SQL Server**
- **CockroachDB**
- **PlanetScale**

### Step 2: Set Up Database

#### Option A: PostgreSQL (Recommended)

**Local Development:**

1. Install PostgreSQL:
   - Windows: [Download installer](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. Create database:
```bash
# Start PostgreSQL
sudo service postgresql start  # Linux
brew services start postgresql  # Mac

# Create database
createdb grandpa_ron_dev
```

3. Get connection string:
```bash
postgresql://username:password@localhost:5432/grandpa_ron_dev
```

**Cloud Options:**

- **Supabase** (Free tier available):
  1. Go to [Supabase](https://supabase.com/)
  2. Create account and new project
  3. Get connection string from Settings → Database
  4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

- **Neon** (Serverless Postgres):
  1. Go to [Neon](https://neon.tech/)
  2. Create account and project
  3. Copy connection string

- **Railway** (Simple deployment):
  1. Go to [Railway](https://railway.app/)
  2. Create PostgreSQL database
  3. Copy connection string

#### Option B: SQLite (Development Only)

No setup needed! Just use:
```bash
DATABASE_URL="file:./dev.db"
```

### Step 3: Initialize Prisma

```bash
cd ecosystems/grandpa-ron-nextjs

# Create Prisma directory and schema
mkdir prisma
```

Create `prisma/schema.prisma`:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql", "sqlite", etc.
  url      = env("DATABASE_URL")
}

// Example model
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Step 4: Configure Environment Variable

Add to `.env.local`:

```bash
# PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/grandpa_ron_dev"

# Or MySQL
DATABASE_URL="mysql://username:password@localhost:3306/grandpa_ron_dev"

# Or SQLite (development)
DATABASE_URL="file:./dev.db"
```

### Step 5: Create and Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Push schema (for prototyping)
npx prisma db push
```

### Step 6: Usage in Next.js

Create `lib/prisma.ts`:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

Use in API routes:

```typescript
// app/api/users/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  return Response.json(users);
}

export async function POST(request: Request) {
  const data = await request.json();
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
    },
  });
  return Response.json(user);
}
```

### Step 7: Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Opens at http://localhost:5555

### Useful Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name <migration_name>

# Apply migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Format schema
npx prisma format

# Validate schema
npx prisma validate
```

### Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

---

## 5. Vercel Deployment

Deploy your Next.js app to Vercel for production.

### Step 1: Create Vercel Account

1. Go to [Vercel](https://vercel.com/signup)
2. Sign up with GitHub (recommended) or email

### Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 3: Login

```bash
vercel login
```

### Step 4: Deploy

```bash
cd ecosystems/grandpa-ron-nextjs

# First deployment (interactive)
vercel

# Production deployment
vercel --prod
```

### Step 5: Configure Environment Variables

**Via Vercel Dashboard:**

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable from `.env.local`:
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`
   - `DATABASE_URL`

**Via CLI:**

```bash
# Set environment variable
vercel env add GOOGLE_GENERATIVE_AI_API_KEY

# Pull environment variables
vercel env pull
```

### Step 6: Connect GitHub (Optional)

1. In Vercel dashboard, click **"Import Project"**
2. Select your GitHub repository
3. Configure:
   - **Root Directory**: `ecosystems/grandpa-ron-nextjs`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Add environment variables
5. Click **"Deploy"**

Now every push to main branch auto-deploys!

### Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Environment Variables Guide](https://vercel.com/docs/environment-variables)

---

## 6. Optional Services

### Sentry (Error Tracking)

1. Go to [Sentry](https://sentry.io/)
2. Create project (select Next.js)
3. Run wizard:
```bash
npx @sentry/wizard@latest -i nextjs
```
4. Add DSN to `.env.local`:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Stripe (Payments)

1. Go to [Stripe](https://stripe.com/)
2. Create account
3. Get API keys from Dashboard → Developers → API keys
4. Add to `.env.local`:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

### Analytics

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Quick Reference: All Environment Variables

Copy this to your `.env.local`:

```bash
# Google Generative AI
GOOGLE_GENERATIVE_AI_API_KEY=

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# Database
DATABASE_URL=

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Sentry
NEXT_PUBLIC_SENTRY_DSN=

# Optional: Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

---

## Troubleshooting

### Common Issues

**"Cannot find module '@prisma/client'"**
```bash
npx prisma generate
```

**"Invalid DATABASE_URL"**
- Check connection string format
- Ensure database is running
- Verify credentials

**"CORS error with EmailJS"**
- Verify service is active
- Check public key is correct
- Ensure domain is whitelisted in EmailJS dashboard

**"reCAPTCHA validation failed"**
- Verify secret key is correct
- Check domain is registered
- For localhost, ensure "localhost" is added to domains

### Getting Help

- **Biosphere Guide**: `../../CLAUDE.md`
- **Ecosystem Guide**: `../CLAUDE.md`
- Ask in relevant Discord/Slack channels
- Check service status pages

---

**Configuration complete!** You're ready to build amazing features. 🚀
