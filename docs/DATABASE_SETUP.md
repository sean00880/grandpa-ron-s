# Grandpa Ron - Production Database Setup (Neon PostgreSQL)

> **Quick Setup Time**: ~5 minutes
> **Cost**: $0/month (Free Tier)
> **Provider**: Neon PostgreSQL (Serverless)

## Why Neon?

Based on GROWSZ database architecture research:
- **Free Tier**: 512MB storage, sufficient for blog + quotes
- **Cold Start**: <1 second (best-in-class)
- **Prisma Native**: Full support, no workarounds
- **Connection Pooling**: Built-in PgBouncer
- **Branching**: Dev/Production branches free

See `docs/architecture/PROPRIETARY_DATABASE_STRATEGY.md` for future scaling options.

## Step 1: Create Neon Project

1. Go to [Neon Console](https://console.neon.tech/app/projects)
2. Click **New Project**
3. Configure:
   - **Name**: `grandpa-ron`
   - **Region**: `AWS US East 2 (Ohio)` (closest to Ohio/Kentucky service area)
   - **Plan**: Free
4. Click **Create Project**

## Step 2: Get Connection Strings

After creation, go to **Connection Details** tab:

1. **DATABASE_URL** (Pooled - for application):
   ```
   postgresql://[user]:[password]@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true
   ```

2. **DIRECT_URL** (Non-pooled - for Prisma migrations):
   ```
   postgresql://[user]:[password]@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

> **Important**: Copy both URLs. The pooled URL includes `?pgbouncer=true`.

## Step 3: Configure Vercel Environment Variables

### Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com) -> Your Project -> Settings -> Environment Variables
2. Add for **Production** environment:
   - `DATABASE_URL` = (pooled connection string)
   - `DIRECT_URL` = (direct connection string)

### Via Vercel CLI

```bash
cd ecosystems/grandpa-ron-nextjs

# Set production environment variables
vercel env add DATABASE_URL production
# Paste: postgresql://[user]:[password]@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true

vercel env add DIRECT_URL production
# Paste: postgresql://[user]:[password]@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Step 4: Run Prisma Migrations

```bash
cd ecosystems/grandpa-ron-nextjs

# Generate Prisma Client
npx prisma generate

# Push schema to Neon (creates tables)
npx prisma db push

# Or run migrations (creates migration history)
npx prisma migrate deploy
```

## Step 5: Seed Production Data

```bash
# Seed blog posts and sample data
npx prisma db seed
```

This creates:
- 4 SEO-optimized blog posts from `.growsz/registries/blog-content.json`
- Blog categories and tags
- Sample data for testing

## Step 6: Verify Connection

```bash
# Open Prisma Studio to inspect data
npx prisma studio
```

## Step 7: Redeploy to Vercel

```bash
# Trigger new deployment with database connected
vercel --prod
```

## Local Development

For local development, you have two options:

### Option A: Use Neon Development Branch (Recommended)

1. In Neon Console, create a `development` branch
2. Add to `.env.local`:
   ```
   DATABASE_URL="postgresql://...@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   DIRECT_URL="postgresql://...@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

### Option B: Use Local SQLite

1. Update `.env`:
   ```
   DATABASE_URL="file:./dev.db"
   ```
2. Comment out `directUrl` in `schema.prisma`
3. Change provider to `sqlite` in `schema.prisma`
4. Run `npx prisma db push`

## Schema Reference

Current Prisma models in `prisma/schema.prisma`:

| Model | Purpose | Fields |
|-------|---------|--------|
| `Quote` | Lead capture | name, email, services, leadScore, etc. |
| `ContactSubmission` | Contact form | name, email, message, status |
| `Review` | Customer reviews | authorName, rating, text |
| `BlogPost` | Blog articles | title, content, SEO fields, viewCount |
| `BlogCategory` | Blog categories | name, slug, description |
| `BlogTag` | Blog tags | name, slug |
| `BlogPostTag` | Many-to-many | postId, tagId |

## Troubleshooting

### "Connection refused" Error
- Ensure `?sslmode=require` is in connection string
- Check Neon project isn't paused (auto-pauses after 5 days inactive on free tier)

### "Prepared statement already exists" Error
- Use pooled connection (`?pgbouncer=true`) for app
- Use direct connection for migrations

### "Database does not exist" Error
- Run `npx prisma db push` to create tables
- Default database is `neondb`, not `postgres`

## Monitoring

Neon Dashboard provides:
- Query insights
- Storage usage
- Connection metrics

## Cost Scaling

| Tier | Storage | Compute | Cost |
|------|---------|---------|------|
| Free | 512 MB | 0.25 CU | $0/mo |
| Launch | 10 GB | 1 CU | $19/mo |
| Scale | 50 GB | 4 CU | $69/mo |

Grandpa Ron will stay on Free tier for foreseeable future (blog + quotes < 100MB typical).

## Next Steps

1. Create Neon project (Step 1)
2. Add env vars to Vercel (Step 3)
3. Push schema (Step 4)
4. Seed data (Step 5)
5. Redeploy (Step 7)
6. Verify blog pages work at `/blog`

---

*Part of GROWSZ Database Architecture - See `docs/architecture/PROPRIETARY_DATABASE_STRATEGY.md` for advanced patterns.*
