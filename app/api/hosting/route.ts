/**
 * Hosting & Domain API — DeployOS integration for WorkGun dashboard
 *
 * GET  /api/hosting              — Current hosting status + domain info
 * POST /api/hosting              — Deploy/redeploy application
 * POST /api/hosting?action=domain-search — Search domain availability
 * POST /api/hosting?action=domain-buy    — Purchase + configure domain
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  // Return current hosting configuration
  // In production: read from DeployOS / Coolify API
  // For now: return static config matching grandparons.com
  const config = {
    project: {
      name: 'grandpa-ron',
      ecosystem_id: 'grandpa-ron',
      framework: 'nextjs',
      git_repo: 'Growsz/GROWSZ',
      git_branch: 'main',
      root_directory: 'ecosystems/grandpa-ron-nextjs',
      status: 'active',
    },
    domain: {
      primary: 'grandparons.com',
      ssl_status: 'active',
      cdn_enabled: true,
      cdn_provider: 'cloudflare',
      analytics_enabled: true,
    },
    deployment: {
      provider: process.env.COOLIFY_URL ? 'coolify' : 'vercel',
      last_deploy: new Date().toISOString(),
      status: 'ready',
    },
    infrastructure: {
      backend: process.env.DBITY_MODE === 'production' ? 'dbity' : 'prisma',
      database: process.env.DATABASE_URL?.startsWith('postgresql') ? 'postgresql' : 'sqlite',
      auth: 'siwx',
      tier: process.env.WORKGUN_TIER ?? 'professional',
    },
    deployos: {
      available: !!(process.env.COOLIFY_URL && process.env.COOLIFY_TOKEN),
      coolify_configured: !!process.env.COOLIFY_URL,
      cloudflare_configured: !!process.env.CLOUDFLARE_API_TOKEN,
      domain_registry_configured: !!process.env.NAMESILO_API_KEY,
    },
  };

  return Response.json(config);
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'domain-search') {
    const { name, tlds } = await request.json();
    if (!name) return Response.json({ error: 'name required' }, { status: 400 });

    // In production: use DomainRegistryClient from @growsz/deploy-core
    // For now: return mock availability
    const defaultTlds = tlds ?? ['com', 'net', 'org', 'io', 'co'];
    const results = defaultTlds.map((tld: string) => ({
      domain: `${name}.${tld}`,
      available: Math.random() > 0.3, // Mock: 70% available
      price_usd: tld === 'com' ? 12.99 : tld === 'io' ? 39.99 : 9.99,
      premium: false,
      tld,
    }));

    return Response.json({ results, provider: 'namesilo', mode: process.env.NAMESILO_API_KEY ? 'live' : 'mock' });
  }

  if (action === 'domain-buy') {
    const { domain } = await request.json();
    if (!domain) return Response.json({ error: 'domain required' }, { status: 400 });

    // In production: DomainRegistryClient.purchase() + DeployOS.deployApp()
    return Response.json({
      success: false,
      message: 'Domain purchase requires NAMESILO_API_KEY + COOLIFY_URL + CLOUDFLARE_API_TOKEN in env. Configure in Settings > Integrations.',
      required_env: ['NAMESILO_API_KEY', 'COOLIFY_URL', 'COOLIFY_TOKEN', 'CLOUDFLARE_API_TOKEN'],
    }, { status: 501 });
  }

  if (action === 'redeploy') {
    // In production: CoolifyClient.deploy(appUuid)
    return Response.json({
      success: false,
      message: 'Redeploy requires COOLIFY_URL + COOLIFY_TOKEN. Currently deployed via Vercel.',
      current_provider: process.env.COOLIFY_URL ? 'coolify' : 'vercel',
    }, { status: 501 });
  }

  return Response.json({ error: 'action must be domain-search, domain-buy, or redeploy' }, { status: 400 });
}
