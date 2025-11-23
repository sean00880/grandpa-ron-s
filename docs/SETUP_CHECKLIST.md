# Setup Checklist for Grandpa Ron Next.js

Use this checklist to ensure all APIs and services are properly configured.

## 📋 Pre-Development Checklist

### Essential Setup

- [ ] **Node.js & npm installed**
  - Check: `node --version` (should be 20+)
  - Check: `npm --version`

- [ ] **Dependencies installed**
  ```bash
  cd ecosystems/grandpa-ron-nextjs
  npm install
  ```

- [ ] **Environment file created**
  ```bash
  cp .env.local.example .env.local
  ```

### API Configurations

#### 1. Google Generative AI (Required for AI features)

- [ ] Account created at [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] API key generated
- [ ] Added to `.env.local`:
  ```bash
  GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
  ```
- [ ] Tested with sample API call

**Status**: 🔴 Not Started / 🟡 In Progress / 🟢 Complete

---

#### 2. EmailJS (Required for contact forms)

- [ ] Account created at [EmailJS](https://www.emailjs.com/)
- [ ] Email service connected (Gmail/Outlook/etc.)
- [ ] Email template created
- [ ] Service ID copied
- [ ] Template ID copied
- [ ] Public key copied
- [ ] Added to `.env.local`:
  ```bash
  NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_...
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_...
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
  ```
- [ ] Test email sent successfully

**Status**: 🔴 Not Started / 🟡 In Progress / 🟢 Complete

---

#### 3. Google reCAPTCHA (Required for form protection)

- [ ] Site registered at [reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
- [ ] reCAPTCHA type selected (v2 or v3)
- [ ] Domain added (localhost for dev)
- [ ] Site key copied
- [ ] Secret key copied
- [ ] Added to `.env.local`:
  ```bash
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
  RECAPTCHA_SECRET_KEY=6Lc...
  ```
- [ ] CAPTCHA tested on form

**Status**: 🔴 Not Started / 🟡 In Progress / 🟢 Complete

---

#### 4. Database (Prisma) - Choose One

##### Option A: PostgreSQL (Recommended)

- [ ] PostgreSQL installed OR cloud database created
  - [ ] Local: PostgreSQL running
  - [ ] Supabase account created
  - [ ] Neon account created
  - [ ] Railway database created
- [ ] Database created
- [ ] Connection string obtained
- [ ] Added to `.env.local`:
  ```bash
  DATABASE_URL="postgresql://..."
  ```
- [ ] `prisma/schema.prisma` created
- [ ] Prisma Client generated: `npx prisma generate`
- [ ] Initial migration created: `npx prisma migrate dev --name init`
- [ ] Prisma Studio tested: `npx prisma studio`

##### Option B: SQLite (Development Only)

- [ ] Added to `.env.local`:
  ```bash
  DATABASE_URL="file:./dev.db"
  ```
- [ ] `prisma/schema.prisma` created
- [ ] Prisma Client generated: `npx prisma generate`
- [ ] Database pushed: `npx prisma db push`

**Status**: 🔴 Not Started / 🟡 In Progress / 🟢 Complete

---

### Optional Services

#### 5. Vercel Deployment (Optional but Recommended)

- [ ] Vercel account created
- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Logged in: `vercel login`
- [ ] Project deployed: `vercel`
- [ ] Environment variables added to Vercel
- [ ] Production deployment: `vercel --prod`
- [ ] Custom domain configured (if applicable)

**Status**: 🔴 Not Started / 🟡 In Progress / 🟢 Complete

---

#### 6. Sentry (Optional - Error Tracking)

- [ ] Sentry account created
- [ ] Project created (Next.js)
- [ ] Wizard run: `npx @sentry/wizard@latest -i nextjs`
- [ ] DSN added to `.env.local`:
  ```bash
  NEXT_PUBLIC_SENTRY_DSN=https://...
  ```
- [ ] Test error sent

**Status**: 🔴 Not Started / 🟡 In Progress / 🟢 Complete

---

#### 7. Stripe (Optional - Payments)

- [ ] Stripe account created
- [ ] API keys obtained
- [ ] Added to `.env.local`:
  ```bash
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_SECRET_KEY=sk_test_...
  ```
- [ ] Stripe package installed: `npm install stripe @stripe/stripe-js`
- [ ] Test payment processed

**Status**: 🔴 Not Started / 🟡 In Progress / 🟢 Complete

---

## 🧪 Testing Checklist

### Development Server

- [ ] Dev server starts: `npm run dev`
- [ ] App loads at http://localhost:3000
- [ ] No console errors
- [ ] Hot reload works

### API Testing

- [ ] Google AI API responds
- [ ] Email sends successfully via EmailJS
- [ ] reCAPTCHA validates
- [ ] Database queries work (if using Prisma)

### Build Testing

- [ ] Production build succeeds: `npm run build`
- [ ] Production server starts: `npm start`
- [ ] No build warnings or errors

## 📝 Final Steps

- [ ] All environment variables documented
- [ ] `.env.local` added to `.gitignore` (already done)
- [ ] Team members have access to credentials (use password manager)
- [ ] API rate limits understood
- [ ] Billing alerts set up (if using paid tiers)

## 🚀 Ready for Development

Once all essential items are checked (items 1-4), you're ready to start building features!

### Quick Start Commands

```bash
# Development
npm run dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Run tests (when added)
npm run test

# Build for production
npm run build
```

## 📚 Reference Documentation

- **Detailed API Setup**: See `API_SETUP_GUIDE.md`
- **Ecosystem Guide**: See `../CLAUDE.md`
- **Biosphere Guide**: See `../../../CLAUDE.md`

---

## 🆘 Need Help?

### Common Commands

```bash
# Restart dev server
npm run dev

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes data)
npx prisma migrate reset
```

### Getting Support

1. Check `API_SETUP_GUIDE.md` for detailed instructions
2. Review service documentation (links in API guide)
3. Check service status pages
4. Review `.env.local.example` for variable names

---

**Last Updated**: 2025-11-22
**Version**: 1.0.0
