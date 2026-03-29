/**
 * Knowledge Feed API — Multi-model content generation + Dbity persistence
 *
 * Model selection via SSOT model catalog (.growsz/registries/models/model-catalog.json)
 * Provider routing via TryLLM pattern — no hardcoded model data.
 *
 * GET /api/insights — List topics + posts + available models (from SSOT)
 * POST /api/insights — Generate a post for a topic via selected model
 */

import { NextRequest } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { insightsDb, type InsightsPost } from '@/lib/orcbase';
import { buildEnhancedPrompt, getRotatingTopics, workspaceContext } from '@/data/workspaceContext';

// ---------------------------------------------------------------------------
// SSOT Model Catalog (read from .growsz/registries/models/model-catalog.json)
// ---------------------------------------------------------------------------

interface CatalogModel {
  modelId: string;
  displayName: string;
  provider: string;
  family: string;
  tier: string;
  pricing: { inputPer1M?: number; outputPer1M?: number };
  capabilities?: string[];
  releaseStatus?: string;
  costWeight?: number;
}

interface ModelOption {
  id: string;
  provider: string;
  displayName: string;
  family: string;
  tier: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  available: boolean;
  envKey: string;
}

const PROVIDER_ENV_KEYS: Record<string, string> = {
  anthropic: 'ANTHROPIC_API_KEY',
  openai: 'OPENAI_API_KEY',
  google: 'GOOGLE_GENERATIVE_AI_API_KEY',
  xai: 'XAI_API_KEY',
  deepseek: 'DEEPSEEK_API_KEY',
};

const GOOGLE_KEY_ALTS = ['GOOGLE_GENERATIVE_AI_API_KEY', 'GEMINI_API_KEY', 'NEXT_PUBLIC_GEMINI_API_KEY'];

function hasProviderKey(provider: string): boolean {
  if (provider === 'google') {
    return GOOGLE_KEY_ALTS.some(k => !!process.env[k]);
  }
  const key = PROVIDER_ENV_KEYS[provider];
  return key ? !!process.env[key] : false;
}

function loadModelCatalog(): ModelOption[] {
  const catalogPath = resolve(process.cwd(), '../../.growsz/registries/models/model-catalog.json');
  if (!existsSync(catalogPath)) return [];

  try {
    const raw = JSON.parse(readFileSync(catalogPath, 'utf8'));
    const models: ModelOption[] = [];

    for (const [provider, providerModels] of Object.entries(raw.models ?? {})) {
      for (const m of providerModels as CatalogModel[]) {
        // Skip deprecated, legacy, image, video, and preview-only models for Knowledge Feed
        if (m.releaseStatus === 'legacy' || m.releaseStatus === 'discontinuing') continue;
        if (m.family === 'gpt-image' || m.family === 'sora') continue;
        if (!m.pricing?.inputPer1M) continue;
        // Only include text generation models
        if (!m.capabilities?.some(c => ['coding', 'reasoning_chains', 'instruction_following', 'fast_response', 'multimodal', 'long_context'].includes(c))) continue;

        models.push({
          id: m.modelId,
          provider,
          displayName: m.displayName,
          family: m.family,
          tier: m.tier,
          inputCostPer1M: m.pricing.inputPer1M ?? 0,
          outputCostPer1M: m.pricing.outputPer1M ?? 0,
          available: hasProviderKey(provider),
          envKey: PROVIDER_ENV_KEYS[provider] ?? `${provider.toUpperCase()}_API_KEY`,
        });
      }
    }

    // Sort by cost (cheapest first)
    models.sort((a, b) => (a.inputCostPer1M + a.outputCostPer1M) - (b.inputCostPer1M + b.outputCostPer1M));
    return models;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Provider-Specific Generation (TryLLM routing pattern)
// ---------------------------------------------------------------------------

async function generateContent(modelId: string, provider: string, prompt: string): Promise<string> {
  switch (provider) {
    case 'google': {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
          || process.env.GEMINI_API_KEY
          || process.env.NEXT_PUBLIC_GEMINI_API_KEY
          || '',
      });
      const response = await ai.models.generateContent({ model: modelId, contents: prompt });
      return response.text ?? '';
    }

    case 'anthropic': {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: modelId,
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message ?? 'Anthropic API error');
      return data.content?.[0]?.text ?? '';
    }

    case 'openai': {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4096,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message ?? 'OpenAI API error');
      return data.choices?.[0]?.message?.content ?? '';
    }

    case 'xai': {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4096,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message ?? 'xAI API error');
      return data.choices?.[0]?.message?.content ?? '';
    }

    case 'deepseek': {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4096,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message ?? 'DeepSeek API error');
      return data.choices?.[0]?.message?.content ?? '';
    }

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// ---------------------------------------------------------------------------
// GET — List topics + posts + available models (from SSOT catalog)
// ---------------------------------------------------------------------------

export async function GET() {
  const topics = insightsDb.getTopics();
  const posts = insightsDb.getPosts();
  const runs = insightsDb.getRuns();
  const models = loadModelCatalog();

  const rotatingTopics = getRotatingTopics();

  return Response.json({
    topics,
    posts,
    runs,
    models,
    rotatingTopics,
    workspace: {
      name: workspaceContext.business.name,
      city: workspaceContext.business.address.city,
      region: workspaceContext.business.address.region,
    },
    stats: {
      totalTopics: topics.length,
      totalPosts: posts.length,
      enabledTopics: topics.filter(t => t.enabled).length,
      totalModels: models.length,
      availableModels: models.filter(m => m.available).length,
      rotatingSlots: rotatingTopics.length,
    },
  });
}

// ---------------------------------------------------------------------------
// POST — Generate a post for a topic via selected model
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { topicId, modelId } = body;

  if (!topicId) {
    return Response.json({ error: 'topicId is required' }, { status: 400 });
  }

  const topic = insightsDb.getTopic(topicId);
  if (!topic) {
    return Response.json({ error: `Topic ${topicId} not found` }, { status: 404 });
  }

  // Resolve model from SSOT catalog
  const models = loadModelCatalog();
  const selectedModel = modelId
    ? models.find(m => m.id === modelId)
    : models.find(m => m.available); // Default: cheapest available

  if (!selectedModel) {
    return Response.json(
      { error: 'No AI model available. Set an API key for at least one provider.' },
      { status: 400 },
    );
  }

  if (!selectedModel.available) {
    return Response.json(
      { error: `Model ${selectedModel.id} requires ${selectedModel.envKey} to be set.` },
      { status: 400 },
    );
  }

  const runId = `run-${Date.now().toString(36)}`;
  insightsDb.createRun({
    id: runId,
    topicId,
    status: 'running',
    postsGenerated: 0,
    startedAt: new Date().toISOString(),
  });

  try {
    const queryText = `${topic.name}: ${topic.description}. Best practices for landscaping businesses in Columbus, Ohio.`;
    const queryId = `q-${Date.now().toString(36)}`;
    insightsDb.createQuery({ id: queryId, topicId, query: queryText, createdAt: new Date().toISOString() });

    const prompt = buildEnhancedPrompt(topic.name, topic.description);

    const text = await generateContent(selectedModel.id, selectedModel.provider, prompt);
    const cleanText = text.replace(/```json\n?|```/g, '').trim();

    let parsed: { title: string; summary: string; body: string; whyItMatters: string; suggestedActions: string[] };
    try {
      parsed = JSON.parse(cleanText);
    } catch {
      parsed = {
        title: `${topic.name}: Expert Guide`,
        summary: text.slice(0, 200),
        body: text,
        whyItMatters: `Understanding ${topic.name} is essential for Ohio lawn health.`,
        suggestedActions: ['Schedule a consultation', 'Get a free property audit', 'Request a quote'],
      };
    }

    const postId = `post-${Date.now().toString(36)}`;
    const post: InsightsPost = {
      id: postId,
      topicId,
      queryId,
      title: parsed.title,
      summary: parsed.summary,
      body: parsed.body,
      whyItMatters: parsed.whyItMatters,
      suggestedActions: parsed.suggestedActions,
      source: selectedModel.id,
      generatedBy: `knowledge-feed:${selectedModel.provider}`,
      createdAt: new Date().toISOString(),
    };

    insightsDb.createPost(post);
    insightsDb.updateRun(runId, { status: 'completed', postsGenerated: 1, completedAt: new Date().toISOString() });

    return Response.json({
      post,
      run: insightsDb.getRuns().find(r => r.id === runId),
      model: { id: selectedModel.id, provider: selectedModel.provider, displayName: selectedModel.displayName },
    });
  } catch (error) {
    insightsDb.updateRun(runId, { status: 'failed', error: String(error), completedAt: new Date().toISOString() });
    return Response.json({ error: 'Content generation failed', details: String(error) }, { status: 500 });
  }
}
