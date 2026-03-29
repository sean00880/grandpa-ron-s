/**
 * Grandpa Ron's — Session API (SIWX Identity)
 *
 * GET    /api/auth/session  — Get current session
 * POST   /api/auth/session  — Create session (dev: display_name)
 * DELETE /api/auth/session  — Sign out
 *
 * Next.js 16 pattern: Response.json(), NO middleware.
 */

export const dynamic = 'force-dynamic';

import { sessionManager, validateRequest } from '@/lib/auth';

import type { IdentitySubject } from '@growsz/siwx-core';

export async function GET(request: Request) {
  try {
    const session = await validateRequest(request);
    if (!session) return Response.json({ session: null }, { status: 401 });
    return Response.json({
      session: {
        id: session.id,
        subject_id: session.subject_id,
        auth_method: session.auth_method,
        status: session.status,
        expires_at: session.expires_at,
      },
    });
  } catch (error) {
    console.error('[Auth] GET session error:', error);
    return Response.json({ error: 'Failed to validate session' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { display_name, email, role } = body;
    if (!display_name) return Response.json({ error: 'display_name required' }, { status: 400 });

    const subject: IdentitySubject = {
      id: `user_${crypto.randomUUID().slice(0, 8)}`,
      display_name,
      primary_auth_method: 'oauth',
      linked_identities: [],
      wallet_capabilities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const session = await sessionManager.createSession(subject, 'oauth', { email, role: role ?? 'workspace_owner' });
    const tokenPair = sessionManager.getTokenPair(session);

    return Response.json({ ...tokenPair, session: { id: session.id, subject_id: session.subject_id }, subject }, { status: 201 });
  } catch (error) {
    console.error('[Auth] POST session error:', error);
    return Response.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await validateRequest(request);
    if (!session) return Response.json({ error: 'No active session' }, { status: 401 });
    await sessionManager.revokeSession(session.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[Auth] DELETE session error:', error);
    return Response.json({ error: 'Failed to sign out' }, { status: 500 });
  }
}
