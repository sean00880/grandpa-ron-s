/**
 * Grandpa Ron's Auth — SIWX session management singleton
 *
 * Provides session creation, validation, and permission checking.
 * Uses @growsz/siwx-session LocalSessionManager with InMemorySessionStore.
 *
 * NOT middleware (Next.js 16 uses proxy.ts). This is a utility for route handlers.
 */

import {
  createLocalSessionManager,
  InMemorySessionStore,
  validateRequest as siwxValidateRequest,
  type LocalSessionManager,
  type SessionManagerConfig,
} from '@growsz/siwx-session';
import type { Session } from '@growsz/siwx-core';
import { checkPermission, type WorkgunRole, type WorkgunResource, type WorkgunAction } from '@growsz/dbity-core';

// Session configuration (TTLs match CastVee for consistency)
const SESSION_CONFIG: SessionManagerConfig = {
  token_strategy: 'opaque',
  ttl: {
    oauth: 30 * 24 * 3600,
    wallet: 7 * 24 * 3600,
    email: 14 * 24 * 3600,
    enterprise: 8 * 3600,
    api_key: 365 * 24 * 3600,
    refresh: 90 * 24 * 3600,
  },
  max_sessions_per_subject: 5,
  max_sessions_per_device: 3,
  track_devices: false,
  refresh_window_seconds: 3600,
};

// Lazy-init session manager (avoid instantiation at build time)
let _sessionManager: ReturnType<typeof createLocalSessionManager> | null = null;

function getSessionManager() {
  if (!_sessionManager) {
    const store = new InMemorySessionStore();
    _sessionManager = createLocalSessionManager(SESSION_CONFIG, store);
  }
  return _sessionManager;
}

export const sessionManager = new Proxy({} as ReturnType<typeof createLocalSessionManager>, {
  get(_, prop) {
    return (getSessionManager() as any)[prop];
  },
});
export type { Session };

/**
 * Validate a request's Bearer token. Returns Session or null.
 * Use in API route handlers (NOT middleware).
 */
export async function validateRequest(request: Request): Promise<Session | null> {
  return siwxValidateRequest(request, sessionManager);
}

/**
 * Require authentication. Returns Session or 401 Response.
 */
export async function requireAuth(request: Request): Promise<Session | Response> {
  const session = await validateRequest(request);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}

/**
 * Check if a role has permission for an action on a resource.
 * Uses the RBAC matrix from workgun-team-registry.json.
 */
export function hasPermission(role: WorkgunRole, resource: WorkgunResource, action: WorkgunAction): boolean {
  return checkPermission(role, resource, action);
}

/**
 * Default role for development (when no auth is configured).
 * In production, this is resolved from the TeamMember table.
 */
export function getDefaultRole(): WorkgunRole {
  return 'workspace_owner';
}
