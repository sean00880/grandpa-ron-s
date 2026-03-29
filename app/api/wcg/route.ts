/**
 * WCG API for Grandpa Ron's — Graph-native mutation endpoint
 * GET /api/wcg — Current WCG snapshot
 * POST /api/wcg — Submit a mutation
 */

import { NextRequest } from 'next/server';
import { getWCGStore, getWCGSnapshot } from '@/lib/wcg';
import { runFullEnforcement } from '@growsz/wcg-core';

export async function GET() {
  const snapshot = getWCGSnapshot();
  const store = getWCGStore();
  const enforcement = runFullEnforcement(store);

  return Response.json({
    snapshot,
    enforcement: {
      passed: enforcement.passed,
      total_violations: enforcement.total_violations,
      blocking_violations: enforcement.blocking_violations,
    },
    stats: {
      nodes: Object.keys(snapshot.nodes).length,
      edges: snapshot.edges.length,
      root_pages: snapshot.root_pages.length,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const store = getWCGStore();

  if (!body.type || !body.interface_origin || !body.wcp_context) {
    return Response.json(
      { status: 'rejected', rejection_reason: 'Missing type, interface_origin, or wcp_context' },
      { status: 400 },
    );
  }

  const result = store.applyMutation(body);
  return Response.json(result, { status: result.status === 'rejected' ? 400 : 200 });
}
