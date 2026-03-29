/**
 * CRM Inbox — Email channel setup
 *
 * GET  /api/crm/inbox/connect — List configured email channels
 * POST /api/crm/inbox/connect — Connect new email channel (Gmail OAuth2 or SMTP)
 *
 * For Gmail: Returns the OAuth2 authorize URL (Google consent screen).
 * The actual token exchange happens at /api/crm/inbox/connect/callback.
 *
 * Data source: in-memory InboxStore (swap to Orcbase when Dbity tables land)
 */

export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { inboxStore, type EmailChannel, type ChannelProvider } from '@/lib/inbox-store';

// ---------------------------------------------------------------------------
// Gmail OAuth2 configuration
// ---------------------------------------------------------------------------

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID ?? '';
const GMAIL_REDIRECT_URI = process.env.GMAIL_REDIRECT_URI
  ?? 'http://localhost:3000/api/crm/inbox/connect/callback';

const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
].join(' ');

function buildGmailAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: GMAIL_CLIENT_ID,
    redirect_uri: GMAIL_REDIRECT_URI,
    response_type: 'code',
    scope: GMAIL_SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const channels = inboxStore.listChannels();

    // Strip sensitive fields for the response
    const safeChannels = channels.map(ch => ({
      id: ch.id,
      provider: ch.provider,
      email: ch.email,
      display_name: ch.display_name,
      is_default: ch.is_default,
      connected_at: ch.connected_at,
      status: ch.status,
    }));

    return Response.json({ channels: safeChannels });
  } catch (error) {
    console.error('[CRM Inbox Connect] GET error:', error);
    return Response.json(
      { error: 'Failed to list email channels' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, email, display_name, smtp_host, smtp_port } = body;

    if (!provider || !email) {
      return Response.json(
        { error: 'Missing required fields: provider, email' },
        { status: 400 },
      );
    }

    const validProviders: ChannelProvider[] = ['gmail', 'smtp', 'manual'];
    if (!validProviders.includes(provider)) {
      return Response.json(
        { error: `Invalid provider. Must be one of: ${validProviders.join(', ')}` },
        { status: 400 },
      );
    }

    // --- Gmail OAuth2 flow ---
    if (provider === 'gmail') {
      if (!GMAIL_CLIENT_ID) {
        return Response.json(
          { error: 'Gmail OAuth2 is not configured. Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET env vars.' },
          { status: 503 },
        );
      }

      // Generate state token for CSRF protection
      const state = crypto.randomUUID();

      // Create a pending channel entry (activated after callback)
      const channelId = `ch-${crypto.randomUUID().slice(0, 8)}`;
      const channel: EmailChannel = {
        id: channelId,
        provider: 'gmail',
        email,
        display_name: display_name ?? email,
        is_default: inboxStore.listChannels().length === 0,
        connected_at: new Date().toISOString(),
        access_token: null,
        refresh_token: null,
        token_expires_at: null,
        smtp_host: null,
        smtp_port: null,
        status: 'disconnected', // Pending OAuth callback
      };

      inboxStore.addChannel(channel);

      const authorize_url = buildGmailAuthUrl(
        JSON.stringify({ channel_id: channelId, csrf: state }),
      );

      return Response.json({
        success: true,
        channel_id: channelId,
        authorize_url,
        message: 'Redirect the user to authorize_url to complete Gmail connection.',
      }, { status: 201 });
    }

    // --- SMTP channel ---
    if (provider === 'smtp') {
      if (!smtp_host || !smtp_port) {
        return Response.json(
          { error: 'SMTP channels require smtp_host and smtp_port' },
          { status: 400 },
        );
      }

      const channelId = `ch-${crypto.randomUUID().slice(0, 8)}`;
      const channel: EmailChannel = {
        id: channelId,
        provider: 'smtp',
        email,
        display_name: display_name ?? email,
        is_default: inboxStore.listChannels().length === 0,
        connected_at: new Date().toISOString(),
        access_token: null,
        refresh_token: null,
        token_expires_at: null,
        smtp_host,
        smtp_port: parseInt(String(smtp_port), 10),
        status: 'active',
      };

      inboxStore.addChannel(channel);

      return Response.json({
        success: true,
        channel: {
          id: channel.id,
          provider: channel.provider,
          email: channel.email,
          display_name: channel.display_name,
          status: channel.status,
        },
      }, { status: 201 });
    }

    // --- Manual channel (no actual email sending) ---
    const channelId = `ch-${crypto.randomUUID().slice(0, 8)}`;
    const channel: EmailChannel = {
      id: channelId,
      provider: 'manual',
      email,
      display_name: display_name ?? email,
      is_default: inboxStore.listChannels().length === 0,
      connected_at: new Date().toISOString(),
      access_token: null,
      refresh_token: null,
      token_expires_at: null,
      smtp_host: null,
      smtp_port: null,
      status: 'active',
    };

    inboxStore.addChannel(channel);

    return Response.json({
      success: true,
      channel: {
        id: channel.id,
        provider: channel.provider,
        email: channel.email,
        display_name: channel.display_name,
        status: channel.status,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('[CRM Inbox Connect] POST error:', error);
    return Response.json(
      { error: 'Failed to connect email channel' },
      { status: 500 },
    );
  }
}
