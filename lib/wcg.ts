/**
 * WCG Bridge for Grandpa Ron's Ecosystem
 *
 * Maps existing pages, services, layouts, and content into WCG graph nodes.
 * This is the integration point between the existing lawncare app and the
 * WebDevOS composition model.
 *
 * LAW-WCG-001: WCG is the canonical composition model.
 * LAW-WCG-003: All mutations flow Interface → WCP → WCG → Canonical State.
 */

import {
  WCGStore,
  MutationBuilder,
  type WCGSnapshot,
  type WCGNodeId,
  type InterfaceOrigin,
} from '@growsz/wcg-core';

// ---------------------------------------------------------------------------
// Singleton store for the Grandpa Ron's scope
// ---------------------------------------------------------------------------

let storeInstance: WCGStore | null = null;

export function getWCGStore(): WCGStore {
  if (!storeInstance) {
    storeInstance = new WCGStore('grandpa-ron');
    seedInitialGraph(storeInstance);
  }
  return storeInstance;
}

// ---------------------------------------------------------------------------
// Seed the WCG with existing Grandpa Ron's structure
// ---------------------------------------------------------------------------

function seedInitialGraph(store: WCGStore): void {
  const builder = new MutationBuilder('system', {
    scope_id: 'grandpa-ron',
    phase: 'BOOTSTRAP',
  });

  // Pages
  const pages = [
    { name: 'home', path: '/', title: 'Home' },
    { name: 'about', path: '/about', title: 'About' },
    { name: 'contact', path: '/contact', title: 'Contact' },
    { name: 'quote', path: '/quote', title: 'Get a Quote' },
    { name: 'services', path: '/services', title: 'Services' },
    { name: 'blog', path: '/blog', title: 'Blog' },
    { name: 'service-areas', path: '/service-areas', title: 'Service Areas' },
    { name: 'dashboard', path: '/dashboard', title: 'Dashboard' },
    { name: 'customer-portal', path: '/portal', title: 'Customer Portal' },
  ];

  for (const page of pages) {
    store.applyMutation(
      builder.createNode({
        type: 'page',
        name: page.name,
        display_name: page.title,
        props: { path: page.path, title: page.title },
      }),
    );
  }

  // Services (map from existing service registry)
  const services = [
    'lawn-mowing', 'landscaping', 'leaf-removal',
    'snow-removal', 'garden-design', 'tree-trimming',
    'mulching', 'hedge-trimming',
  ];

  for (const svc of services) {
    store.applyMutation(
      builder.createNode({
        type: 'content',
        name: svc,
        display_name: svc.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        props: {
          content_type: 'service',
          path: `/services/${svc}`,
          status: 'published',
        },
      }),
    );
  }

  // Layouts
  store.applyMutation(
    builder.createNode({
      type: 'layout',
      name: 'public-layout',
      display_name: 'Public Layout',
      props: {
        template: 'header-main-footer',
        slot_definitions: ['header', 'main', 'footer'],
      },
    }),
  );

  store.applyMutation(
    builder.createNode({
      type: 'layout',
      name: 'dashboard-layout',
      display_name: 'Dashboard Layout',
      props: {
        template: 'sidebar-main',
        slot_definitions: ['sidebar', 'header', 'main'],
      },
    }),
  );

  // Components
  const components = [
    { name: 'hero', import_path: '@/components/Hero' },
    { name: 'services-cards', import_path: '@/components/ServiceCards' },
    { name: 'gallery', import_path: '@/components/Gallery' },
    { name: 'quote-form', import_path: '@/components/QuoteRequestForm' },
    { name: 'property-audit', import_path: '@/components/PropertyAudit' },
    { name: 'google-reviews', import_path: '@/components/GoogleReviewsWidget' },
    { name: 'blog-section', import_path: '@/components/BlogSection' },
    { name: 'before-after-slider', import_path: '@/components/BeforeAfterSlider' },
  ];

  for (const comp of components) {
    store.applyMutation(
      builder.createNode({
        type: 'component',
        name: comp.name,
        display_name: comp.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        props: {
          component_id: comp.name,
          import_path: comp.import_path,
          is_server_component: false,
        },
      }),
    );
  }

  // Data sources
  store.applyMutation(
    builder.createNode({
      type: 'data_source',
      name: 'prisma-quotes',
      display_name: 'Quote Database',
      props: {
        source_type: 'database',
        query: 'prisma.quote.findMany',
      },
    }),
  );

  store.applyMutation(
    builder.createNode({
      type: 'data_source',
      name: 'gemini-ai',
      display_name: 'Gemini AI Service',
      props: {
        source_type: 'api',
        endpoint: '/api/analyze',
      },
    }),
  );

  store.applyMutation(
    builder.createNode({
      type: 'data_source',
      name: 'google-reviews',
      display_name: 'Google Reviews',
      props: {
        source_type: 'api',
        endpoint: '/api/reviews',
      },
    }),
  );

  store.applyMutation(
    builder.createNode({
      type: 'data_source',
      name: 'stripe-payments',
      display_name: 'Stripe Payments',
      props: {
        source_type: 'api',
        endpoint: '/api/payments',
      },
    }),
  );
}

// ---------------------------------------------------------------------------
// Helper to create mutation builders for different interfaces
// ---------------------------------------------------------------------------

export function createGRBuilder(origin: InterfaceOrigin, lineage?: string): MutationBuilder {
  return new MutationBuilder(origin, { scope_id: 'grandpa-ron' }, lineage);
}

// ---------------------------------------------------------------------------
// Export snapshot for API/SSR usage
// ---------------------------------------------------------------------------

export function getWCGSnapshot(): WCGSnapshot {
  return getWCGStore().exportSnapshot();
}
