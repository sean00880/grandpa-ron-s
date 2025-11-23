# Quick Start Guide

> Get up and running with Grandpa Ron Next.js in under 30 minutes

## 🎯 Overview

This guide will help you configure all the necessary APIs and get your development environment ready.

**Time Estimate**: 20-30 minutes
**Difficulty**: Beginner-friendly

---

## 📦 Step 1: Install Dependencies (2 minutes)

```bash
cd ecosystems/grandpa-ron-nextjs
npm install
```

---

## ⚙️ Step 2: Set Up Environment File (1 minute)

```bash
cp .env.local.example .env.local
```

Now open `.env.local` in your editor. We'll fill in the values in the next steps.

---

## 🤖 Step 3: Google Generative AI (5 minutes)

**Why?** Powers AI features in your app

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key
5. Add to `.env.local`:
   ```bash
   GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
   ```

✅ **Test it**: Run dev server and make an AI API call

---

## 📧 Step 4: EmailJS (10 minutes)

**Why?** Enables contact forms without a backend server

### 4.1 Create Account
1. Visit: https://www.emailjs.com/
2. Sign up (free account)
3. Verify email

### 4.2 Connect Email Service
1. Go to "Email Services"
2. Click "Add New Service"
3. Choose Gmail (or your preferred provider)
4. Follow connection steps
5. **Copy Service ID** → Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123
   ```

### 4.3 Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Add template content:
   ```
   Subject: New Contact from {{from_name}}

   Name: {{from_name}}
   Email: {{from_email}}
   Message: {{message}}
   ```
4. **Copy Template ID** → Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xyz789
   ```

### 4.4 Get Public Key
1. Go to "Account" → "General"
2. **Copy Public Key** → Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=abcDEF123456
   ```

✅ **Test it**: Use EmailJS test feature in dashboard

---

## 🛡️ Step 5: Google reCAPTCHA (5 minutes)

**Why?** Protects forms from spam and bots

1. Visit: https://www.google.com/recaptcha/admin/create
2. Fill in:
   - **Label**: "Grandpa Ron"
   - **Type**: reCAPTCHA v2 (checkbox)
   - **Domains**: Add `localhost`
3. Submit
4. **Copy Site Key** → Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
   ```
5. **Copy Secret Key** → Add to `.env.local`:
   ```bash
   RECAPTCHA_SECRET_KEY=6Lc...
   ```

✅ **Test it**: You'll test this when you implement a form

---

## 🗄️ Step 6: Database - Choose One (5-15 minutes)

**Why?** Store application data

### Option A: SQLite (Quickest - Development Only)

```bash
# In .env.local
DATABASE_URL="file:./dev.db"
```

Then:
```bash
# Create schema file
mkdir prisma
# Copy example schema or create your own

npx prisma generate
npx prisma db push
```

✅ **Done!** Fastest option for getting started

### Option B: PostgreSQL with Supabase (Recommended)

1. Visit: https://supabase.com/
2. Create account (free tier)
3. Create new project
4. Wait 2 minutes for provisioning
5. Go to Settings → Database
6. **Copy Connection String** (use "Connection pooling")
7. Add to `.env.local`:
   ```bash
   DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
   ```

Then:
```bash
mkdir prisma
# Create schema.prisma

npx prisma generate
npx prisma migrate dev --name init
```

✅ **Test it**: `npx prisma studio` (opens database GUI)

**Need more details?** See `API_SETUP_GUIDE.md` for other database options.

---

## 🚀 Step 7: Start Development (1 minute)

```bash
npm run dev
```

Open http://localhost:3000

**You're ready to build! 🎉**

---

## 📋 What You've Configured

- ✅ Google Generative AI - AI capabilities
- ✅ EmailJS - Contact forms
- ✅ Google reCAPTCHA - Spam protection
- ✅ Database (Prisma) - Data persistence

---

## 🧪 Quick Test Checklist

Test each integration:

```bash
# 1. Dev server starts
npm run dev  # ✓ Should open on :3000

# 2. Build succeeds
npm run build  # ✓ Should complete without errors

# 3. Database connection (if using Prisma)
npx prisma studio  # ✓ Should open on :5555
```

---

## 📚 Next Steps

### Learn the Codebase
- Read `CLAUDE.md` for detailed ecosystem guide
- Explore `app/` directory for routes and pages
- Check `package.json` for available scripts

### Start Building Features
- Implement contact form with EmailJS + reCAPTCHA
- Add AI chat interface with Google Generative AI
- Create database models with Prisma

### Deploy to Production
- Follow Vercel deployment guide in `API_SETUP_GUIDE.md`
- Add environment variables to Vercel
- Set up custom domain (optional)

---

## 🆘 Troubleshooting

### Dev server won't start
```bash
# Kill any process on port 3000
npx kill-port 3000

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Prisma errors
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes data)
npx prisma migrate reset
```

### Environment variables not working
- Restart dev server after changing `.env.local`
- Ensure variable names match exactly (case-sensitive)
- Check for typos in keys/values
- Don't wrap values in quotes unless needed

---

## 📖 Documentation References

| Document | Purpose |
|----------|---------|
| `QUICK_START.md` | This file - get started fast |
| `API_SETUP_GUIDE.md` | Detailed API configuration steps |
| `SETUP_CHECKLIST.md` | Track your setup progress |
| `CLAUDE.md` | Complete ecosystem development guide |

---

## 💡 Tips for Success

1. **Start with SQLite** for database if you want to get going fast
2. **Test each API** right after configuration
3. **Use Prisma Studio** to inspect your database (`npx prisma studio`)
4. **Check service status pages** if APIs aren't working
5. **Keep API keys secure** - never commit `.env.local` to git

---

## 🎉 You're Ready!

All set up? Start building amazing features with your new Next.js app!

**Happy coding! 🚀**

---

**Questions?** Check `API_SETUP_GUIDE.md` for detailed instructions on each service.
