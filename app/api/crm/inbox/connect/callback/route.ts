/**
 * CRM Inbox — Gmail OAuth2 callback
 *
 * GET /api/crm/inbox/connect/callback?code=...&state=... — Handle Gmail OAuth2 callback
 *
 * Exchanges the authorization code for tokens, stores them in the email channel,
 * and redirects back to the CRM inbox settings.
 *
 * Data source: in-memory InboxStore (swap to Orcbase when Dbity tables land)
 */

export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { inboxStore } from '@/lib/inbox-store';

// ---------------------------------------------------------------------------
// Gmail OAuth2 token exchange
// ---------------------------------------------------------------------------

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID ?? '';
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET ?? '';
const GMAIL_REDIRECT_URI = process.env.GMAIL_REDIRECT_URI
  ?? 'http://localhost:3000/api/crm/inbox/connect/callback';

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      redirect_uri: GMAIL_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Token exchange failed (${response.status}): ${errorBody}`);
  }

  return response.json() as Promise<GoogleTokenResponse>;
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get('code');
    const stateRaw = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle user denial or errors from Google
    if (error) {
      console.warn('[Gmail OAuth] User denied or error:', error);
      return Response.redirect(
        new URL('/dashboard/crm?tab=inbox&connect=error&reason=' + encodeURIComponent(error), request.url),
      );
    }

    if (!code || !stateRaw) {
      return Response.json(
        { error: 'Missing code or state parameter' },
        { status: 400 },
      );
    }

    // Parse state to get channel_id
    let channelId: string;
    try {
      const state = JSON.parse(stateRaw);
      channelId = state.channel_id;
    } catch {
      return Response.json(
        { error: 'Invalid state parameter' },
        { status: 400 },
      );
    }

    const channel = inboxStore.getChannel(channelId);
    if (!channel) {
      return Response.json(
        { error: 'Channel not found. The connection may have expired.' },
        { status: 404 },
      );
    }

    // Exchange code for tokens
    if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET) {
      return Response.json(
        { error: 'Gmail OAuth2 is not configured on the server.' },
        { status: 503 },
      );
    }

    const tokens = await exchangeCodeForTokens(code);

    // Update channel with tokens and mark as active
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    // Directly update the channel object in the store
    const updatedChannel = inboxStore.getChannel(channelId);
    if (updatedChannel) {
      updatedChannel.access_token = tokens.access_token;
      updatedChannel.refresh_token = tokens.refresh_token ?? null;
      updatedChannel.token_expires_at = expiresAt;
      updatedChannel.status = 'active';
    }

    console.log(`[Gmail OAuth] Channel ${channelId} connected successfully for ${channel.email}`);

    // Redirect back to CRM inbox with success indicator
    return Response.redirect(
      new URL('/dashboard/crm?tab=inbox&connect=success&channel=' + channelId, request.url),
    );
  } catch (error) {
    console.error('[Gmail OAuth] Callback error:', error);

    // Redirect with error for UX (don't leave user on a JSON error page)
    return Response.redirect(
      new URL('/dashboard/crm?tab=inbox&connect=error&reason=token_exchange_failed', request.url),
    );
  }
}
