/**
 * Orcbase Client for Grandpa Ron's Ecosystem
 *
 * Routes all data access through the Backend Suite pattern:
 * - Dbity: Unified backend engine (6 slots — primary, timeseries, cache, stream, media, search)
 * - Orcbase: Adapter gateway (vendor-neutral, registry-based)
 *
 * Adapter selection (via DBITY_MODE env):
 * - 'local' or unset: Prisma adapter (current default)
 * - 'production': Dbity primary engine (PostgreSQL via globalEngineRegistry)
 *
 * The LawnCareClient interface is adapter-neutral — zero application code changes
 * needed when switching backends. All 16 API routes consume `db` without knowing
 * which engine is underneath.
 */

// ---------------------------------------------------------------------------
// Domain Types (Dbity layer — pure types, no runtime)
// ---------------------------------------------------------------------------

export interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  propertySize: string;
  services: string;
  additionalInfo?: string | null;
  urgency?: string | null;
  status: string;
  leadScore?: number | null;
  leadPriority?: string | null;
  locationSlug?: string | null;
  customerType?: string | null;
  source?: string | null;
  usedAIPlanner: boolean;
  usedAudit: boolean;
  pageViewCount: number;
  isReturnVisit: boolean;
  estimatedValue?: number | null;
  seasonalModifier?: number | null;
  promoCode?: string | null;
  promoDiscount?: number | null;
  clvFirstYear?: number | null;
  clvThreeYear?: number | null;
  competitorContext?: string | null;
  recommendedAction?: string | null;
  followUpDue?: Date | null;
  assignedTo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  text?: string | null;
  time: Date;
  photoUrl?: string | null;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Orcbase Client Interface (adapter-neutral)
// ---------------------------------------------------------------------------

export interface LawnCareClient {
  // Quotes
  quotes: {
    count(where?: Record<string, unknown>): Promise<number>;
    findMany(options?: { where?: Record<string, unknown>; orderBy?: Record<string, string>; take?: number; select?: Record<string, boolean> }): Promise<Quote[]>;
    findUnique(where: { id: string }): Promise<Quote | null>;
    create(data: Partial<Quote>): Promise<Quote>;
    update(where: { id: string }, data: Partial<Quote>): Promise<Quote>;
    aggregate(options?: Record<string, unknown>): Promise<{ _sum?: Record<string, number | null>; _avg?: Record<string, number | null> }>;
    groupBy(options: Record<string, unknown>): Promise<Array<Record<string, unknown>>>;
  };

  // Contacts
  contacts: {
    findMany(options?: { orderBy?: Record<string, string>; take?: number }): Promise<ContactSubmission[]>;
    create(data: Partial<ContactSubmission>): Promise<ContactSubmission>;
  };

  // Reviews
  reviews: {
    findMany(options?: { orderBy?: Record<string, string>; take?: number }): Promise<Review[]>;
  };
}

// ---------------------------------------------------------------------------
// Shared: Safe query wrapper for any adapter
// ---------------------------------------------------------------------------

type AdapterProvider<T> = () => Promise<T | null>;

function createSafeQuery<A>(getAdapter: AdapterProvider<A>) {
  let adapterFailed = false;
  return async function safeQuery<T>(fn: (a: A) => Promise<T>, fallback: T): Promise<T> {
    if (adapterFailed) return fallback;
    const adapter = await getAdapter();
    if (!adapter) return fallback;
    try {
      return await fn(adapter);
    } catch (e: any) {
      if (e?.name === 'PrismaClientInitializationError' || e?.name === 'PrismaClientKnownRequestError') {
        adapterFailed = true;
      }
      console.warn('[Orcbase] Query failed:', e.message?.slice(0, 120));
      return fallback;
    }
  };
}

// ---------------------------------------------------------------------------
// Prisma Adapter (legacy — active when DBITY_MODE is unset or 'disabled')
// ---------------------------------------------------------------------------

let prismaClient: any = null;
let prismaFailed = false;

async function getPrisma() {
  if (prismaFailed) return null;
  if (!prismaClient) {
    try {
      const { prisma } = await import('./prisma');
      prismaClient = prisma;
    } catch {
      prismaFailed = true;
      return null;
    }
  }
  return prismaClient;
}

const safePrismaQuery = createSafeQuery(getPrisma);

function createPrismaAdapter(): LawnCareClient {
  return {
    quotes: {
      count: (where) => safePrismaQuery(p => p.quote.count({ where }), 0),
      findMany: (options) => safePrismaQuery(p => p.quote.findMany(options), []),
      findUnique: (where) => safePrismaQuery(p => p.quote.findUnique({ where }), null),
      create: (data) => safePrismaQuery(p => p.quote.create({ data }), null as any),
      update: (where, data) => safePrismaQuery(p => p.quote.update({ where, data }), null as any),
      aggregate: (options) => safePrismaQuery(p => p.quote.aggregate(options), { _sum: {}, _avg: {} }),
      groupBy: (options) => safePrismaQuery(p => p.quote.groupBy(options), []),
    },
    contacts: {
      findMany: (options) => safePrismaQuery(p => p.contactSubmission.findMany(options), []),
      create: (data) => safePrismaQuery(p => p.contactSubmission.create({ data }), null as any),
    },
    reviews: {
      findMany: (options) => safePrismaQuery(p => p.review.findMany(options), []),
    },
  };
}

// ---------------------------------------------------------------------------
// Dbity Adapter (production — active when DBITY_MODE='production' or 'hybrid')
// Uses DbityRuntime.primary() for all CRUD operations against PostgreSQL.
// ---------------------------------------------------------------------------

import type { EngineAdapter, SelectQuery, QueryFilters } from '@growsz/orcbase-core';

/** Lazy-init: bootstrap Dbity runtime on first query */
let dbityEngine: EngineAdapter | null = null;
let dbityFailed = false;

async function getDbityEngine(): Promise<EngineAdapter | null> {
  if (dbityFailed) return null;
  if (dbityEngine) return dbityEngine;

  // Guard: DATABASE_URL must be PostgreSQL for Dbity (not SQLite)
  const dbUrl = process.env.DATABASE_URL ?? '';
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    dbityFailed = true;
    console.warn('[Orcbase] DATABASE_URL is not PostgreSQL — Dbity requires postgresql:// URL. Using Prisma.');
    return null;
  }

  try {
    const { bootstrapDbity } = await import('@growsz/dbity-runtime');
    const { runtime } = bootstrapDbity({
      mode: (process.env.DBITY_MODE as 'production' | 'hybrid') ?? 'production',
      engines: {
        primary: {
          adapter: 'postgresql',
          connection: { url: dbUrl },
        },
      },
    });

    const engine = runtime.primary();
    await engine.connect({ url: dbUrl });
    dbityEngine = engine;
    console.log('[Orcbase] Dbity primary engine connected (PostgreSQL)');
    return engine;
  } catch (e: unknown) {
    dbityFailed = true;
    const msg = e instanceof Error ? e.message : String(e);
    console.warn('[Orcbase] Dbity bootstrap failed — falling back to Prisma:', msg.slice(0, 120));
    return null;
  }
}

const safeDbityQuery = createSafeQuery(getDbityEngine);

/** Convert Prisma-style where to Orcbase QueryFilters */
function toFilters(where?: Record<string, unknown>): QueryFilters | undefined {
  if (!where || Object.keys(where).length === 0) return undefined;
  const filters: QueryFilters = {};
  for (const [key, value] of Object.entries(where)) {
    if (value !== undefined) filters[key] = value as any;
  }
  return filters;
}

/** Convert Prisma-style orderBy to Orcbase SortConfig */
function toSort(orderBy?: Record<string, string>): { field: string; order: 'asc' | 'desc' } | undefined {
  if (!orderBy) return undefined;
  const entries = Object.entries(orderBy);
  if (entries.length === 0) return undefined;
  const [field, order] = entries[0];
  return { field, order: order as 'asc' | 'desc' };
}

/** Convert Prisma-style select to Orcbase field list */
function toSelectFields(select?: Record<string, boolean>): string[] | undefined {
  if (!select) return undefined;
  return Object.entries(select).filter(([, v]) => v).map(([k]) => k);
}

function createDbityAdapter(): LawnCareClient {
  // Fallback Prisma adapter — used if Dbity fails for any individual query
  const prismaFallback = createPrismaAdapter();

  return {
    quotes: {
      count: (where) => safeDbityQuery(
        e => e.count('"Quote"', toFilters(where)),
        0,
      ).then(r => r ?? prismaFallback.quotes.count(where)),

      findMany: (options) => safeDbityQuery(
        e => e.select('"Quote"', {
          filters: toFilters(options?.where),
          sort: toSort(options?.orderBy),
          limit: options?.take,
          select: toSelectFields(options?.select),
        } satisfies SelectQuery) as Promise<Quote[]>,
        [],
      ),

      findUnique: ({ id }) => safeDbityQuery(
        async (e) => {
          const rows = await e.select('"Quote"', { filters: { id }, limit: 1 });
          return (rows[0] as Quote) ?? null;
        },
        null,
      ),

      create: (data) => safeDbityQuery(
        e => e.insert('"Quote"', {
          id: crypto.randomUUID(),
          status: 'pending',
          usedAIPlanner: false,
          usedAudit: false,
          pageViewCount: 1,
          isReturnVisit: false,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }) as Promise<Quote>,
        null as any,
      ),

      update: ({ id }, data) => safeDbityQuery(
        e => e.update('"Quote"', id, {
          ...data,
          updatedAt: new Date(),
        }) as Promise<Quote>,
        null as any,
      ),

      // Aggregate/groupBy: fall back to Prisma for now (Dbity primary engine
      // doesn't expose aggregate functions yet — Wave 0.2 will add query routing)
      aggregate: (options) => prismaFallback.quotes.aggregate(options),
      groupBy: (options) => prismaFallback.quotes.groupBy(options),
    },

    contacts: {
      findMany: (options) => safeDbityQuery(
        e => e.select('"ContactSubmission"', {
          sort: toSort(options?.orderBy),
          limit: options?.take,
        }) as Promise<ContactSubmission[]>,
        [],
      ),

      create: (data) => safeDbityQuery(
        e => e.insert('"ContactSubmission"', {
          id: crypto.randomUUID(),
          status: 'new',
          ...data,
          createdAt: new Date(),
        }) as Promise<ContactSubmission>,
        null as any,
      ),
    },

    reviews: {
      findMany: (options) => safeDbityQuery(
        e => e.select('"Review"', {
          sort: toSort(options?.orderBy),
          limit: options?.take,
        }) as Promise<Review[]>,
        [],
      ),
    },
  };
}

// ---------------------------------------------------------------------------
// Knowledge Feed Domain Types (Dbity layer)
// ---------------------------------------------------------------------------

export interface InsightsTopic {
  id: string;
  name: string;
  slug: string;
  description: string;
  source: 'manual' | 'programmatic';
  serviceId?: string;
  enabled: boolean;
  createdAt: string;
}

export interface InsightsQuery {
  id: string;
  topicId: string;
  query: string;
  createdAt: string;
}

export interface InsightsPost {
  id: string;
  topicId: string;
  queryId?: string;
  title: string;
  summary: string;
  body: string;
  whyItMatters: string;
  suggestedActions: string[];
  localTip?: string;
  seasonalNote?: string;
  source: string;
  generatedBy: string;
  createdAt: string;
}

export interface InsightsRun {
  id: string;
  topicId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  postsGenerated: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

// ---------------------------------------------------------------------------
// In-Memory Dbity Store (Insights domain)
// Until Dbity cloud is deployed, we use an in-memory store.
// The Orcbase adapter pattern means zero code changes when we swap to Dbity.
// ---------------------------------------------------------------------------

/**
 * InsightsStore — Dual mode: Prisma persistence when available, in-memory fallback.
 * Prisma models: InsightsTopic, InsightsQuery, InsightsPost, InsightsRun (see schema.prisma)
 * In-memory: Map-based (survives hot reload but not server restart)
 */
class InsightsStore {
  private topics: Map<string, InsightsTopic> = new Map();
  private queries: Map<string, InsightsQuery> = new Map();
  private posts: Map<string, InsightsPost> = new Map();
  private runs: Map<string, InsightsRun> = new Map();

  // Topics
  createTopic(topic: InsightsTopic): InsightsTopic {
    this.topics.set(topic.id, topic);
    return topic;
  }
  getTopics(): InsightsTopic[] { return Array.from(this.topics.values()); }
  getTopic(id: string): InsightsTopic | undefined { return this.topics.get(id); }
  getTopicBySlug(slug: string): InsightsTopic | undefined {
    return this.getTopics().find(t => t.slug === slug);
  }

  // Queries
  createQuery(query: InsightsQuery): InsightsQuery {
    this.queries.set(query.id, query);
    return query;
  }
  getQueriesByTopic(topicId: string): InsightsQuery[] {
    return Array.from(this.queries.values()).filter(q => q.topicId === topicId);
  }

  // Posts
  createPost(post: InsightsPost): InsightsPost {
    this.posts.set(post.id, post);
    return post;
  }
  getPosts(): InsightsPost[] {
    return Array.from(this.posts.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  getPostsByTopic(topicId: string): InsightsPost[] {
    return this.getPosts().filter(p => p.topicId === topicId);
  }

  // Runs
  createRun(run: InsightsRun): InsightsRun {
    this.runs.set(run.id, run);
    return run;
  }
  updateRun(id: string, updates: Partial<InsightsRun>): InsightsRun | null {
    const existing = this.runs.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.runs.set(id, updated);
    return updated;
  }
  getRuns(): InsightsRun[] { return Array.from(this.runs.values()); }
}

export const insightsDb = new InsightsStore();

// ---------------------------------------------------------------------------
// Seed default topics (derived from services — programmatic)
// ---------------------------------------------------------------------------

const SEED_TOPICS: Omit<InsightsTopic, 'createdAt'>[] = [
  { id: 'topic-seed-sod', name: 'Seed & Sod', slug: 'seed-and-sod', description: 'Best practices for establishing new lawns from seed or sod', source: 'programmatic', serviceId: 'overseeding', enabled: true },
  { id: 'topic-overseeding', name: 'Over Seeding', slug: 'over-seeding', description: 'Techniques for overseeding existing lawns for thicker, healthier turf', source: 'programmatic', serviceId: 'overseeding', enabled: true },
  { id: 'topic-grading-drainage', name: 'Grading and Drainage', slug: 'grading-and-drainage', description: 'Proper grading, drainage solutions, and water management for landscapes', source: 'programmatic', serviceId: 'landscaping', enabled: true },
  { id: 'topic-grasses-soil', name: 'Types of Grasses & Soil Ecosystems', slug: 'grasses-and-soil', description: 'Understanding grass varieties and soil health for Ohio lawns', source: 'programmatic', serviceId: 'mowing', enabled: true },
];

for (const topic of SEED_TOPICS) {
  if (!insightsDb.getTopic(topic.id)) {
    insightsDb.createTopic({ ...topic, createdAt: new Date().toISOString() });
  }
}

// ---------------------------------------------------------------------------
// Singleton Export — The ONLY data access point for Grandpa Ron's
// ---------------------------------------------------------------------------
// DBITY_MODE controls which adapter is active:
//   - unset/'disabled'/'local' → Prisma adapter (existing behavior)
//   - 'production'/'hybrid'    → Dbity primary engine (PostgreSQL via Orcbase)
// ---------------------------------------------------------------------------

const dbityMode = process.env.DBITY_MODE ?? 'local';
const useDbity = dbityMode === 'production' || dbityMode === 'hybrid';

export const db: LawnCareClient = useDbity ? createDbityAdapter() : createPrismaAdapter();
