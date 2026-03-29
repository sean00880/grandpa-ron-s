/**
 * Studio Chat API - AI Core agent conversation
 *
 * POST /api/studio/chat - Send message to AI agent, get streaming response
 *
 * Uses Anthropic Claude API with WCG context. Streams response parts
 * (text, tool_call, reasoning) back to the conversation panel.
 *
 * When ANTHROPIC_API_KEY is not set, returns mock responses for development.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  origin: 'ai_core' | 'cms';
  scope_id?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const { messages, origin, scope_id } = body;

    if (!messages || messages.length === 0) {
      return Response.json({ error: 'messages required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // If API key available, use real Claude API with streaming
    if (apiKey) {
      return streamClaudeResponse(apiKey, messages, origin, scope_id ?? 'grandpa-ron');
    }

    // Development mode: return structured mock response
    return mockResponse(messages[messages.length - 1].content, origin);
  } catch (error) {
    console.error('[Studio Chat] error:', error);
    return Response.json({ error: 'Chat failed' }, { status: 500 });
  }
}

async function streamClaudeResponse(
  apiKey: string,
  messages: ChatMessage[],
  origin: string,
  scopeId: string,
): Promise<Response> {
  const systemPrompt = `You are the AI Core assistant for the ${scopeId} workspace in GROWSZ WebDevOS Studio.
You help build and modify the website through the WCG (Web Content Graph) composition model.

Current interface: ${origin}
Available actions:
- Create pages, blocks, and components via WCG mutations
- Edit content, styling, and layout
- Explain code and architecture decisions
- Generate full page implementations

When creating blocks, use this mutation format:
\`\`\`json
{"type": "create_node", "node_type": "block", "display_name": "...", "props": {"block_type": "hero|text|cta|cards|form|reviews|gallery|pricing|nav|footer", "content": "..."}}
\`\`\`

Always explain what you are doing before applying mutations.
Respond concisely and focus on actionable output.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return Response.json({ error: `Claude API error: ${err}` }, { status: 502 });
  }

  // Pass through the SSE stream
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function mockResponse(lastMessage: string, origin: string): Response {
  const lowerMsg = lastMessage.toLowerCase();

  let responseText: string;
  let mutations: Array<{ type: string; display_name: string; block_type: string; content: string }> = [];

  if (lowerMsg.includes('hero') || lowerMsg.includes('header')) {
    responseText = 'I\'ll create a hero section for you. This will be the main banner at the top of the page with a headline, description, and call-to-action button.';
    mutations = [{ type: 'block', display_name: 'Hero Banner', block_type: 'hero', content: 'Transform Your Outdoor Space' }];
  } else if (lowerMsg.includes('page') || lowerMsg.includes('create')) {
    responseText = 'I\'ll create a new page for you with a basic structure including a hero section and a content area.';
    mutations = [
      { type: 'block', display_name: 'Page Hero', block_type: 'hero', content: 'New Page' },
      { type: 'block', display_name: 'Content Section', block_type: 'text', content: 'Add your content here.' },
    ];
  } else if (lowerMsg.includes('form') || lowerMsg.includes('quote') || lowerMsg.includes('contact')) {
    responseText = 'I\'ll add a contact/quote form. This uses the WorkGun Quote Builder integration for lead scoring and seasonal pricing.';
    mutations = [{ type: 'block', display_name: 'Quote Builder', block_type: 'form', content: '' }];
  } else if (lowerMsg.includes('review') || lowerMsg.includes('testimonial')) {
    responseText = 'Adding a reviews section that connects to your Google Reviews widget.';
    mutations = [{ type: 'block', display_name: 'Customer Reviews', block_type: 'reviews', content: '' }];
  } else if (lowerMsg.includes('pricing') || lowerMsg.includes('plan')) {
    responseText = 'Creating a pricing table with your service tiers.';
    mutations = [{ type: 'block', display_name: 'Service Pricing', block_type: 'pricing', content: '' }];
  } else {
    responseText = `I understand you want to work on: "${lastMessage}"\n\nI can help you:\n- Create pages and blocks (hero, text, CTA, cards, forms, reviews, gallery, pricing)\n- Add WorkGun integrations (Quote Builder, Dispatch Board, Customer Portal)\n- Edit existing content and styling\n- Generate full page layouts\n\nWhat would you like me to build?`;
  }

  const response = {
    id: `msg_mock_${Date.now()}`,
    role: 'assistant',
    parts: [
      { type: 'text', content: responseText },
      ...mutations.map(m => ({
        type: 'tool_call',
        content: `create_${m.block_type}_block`,
        metadata: {
          state: 'completed',
          tool_name: 'wcg_create_node',
          input: { node_type: m.type, display_name: m.display_name, block_type: m.block_type, content: m.content },
          output: { success: true, mutation: `create_node: ${m.display_name}` },
        },
      })),
    ],
    mutations,
    origin,
    model: 'mock-dev',
  };

  return Response.json(response);
}
