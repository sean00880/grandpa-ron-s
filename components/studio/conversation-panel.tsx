'use client';

/**
 * Conversation Panel — Agent-native conversation runtime.
 *
 * NOT generic chat. Each message supports structured parts:
 * - text (MessageResponse)
 * - reasoning (ReasoningBlock — collapsible chain-of-thought)
 * - tool-call (ToolCallCard — state machine: pending/running/completed/error)
 * - task (Task — collapsible with subtasks and active step)
 * - plan (Plan — title + description + steps)
 * - delegation (DelegationCard — agent→agent handoff)
 * - file-change (file path with +/- indicators)
 * - evidence (pass/fail badge)
 * - step (SPBVG phase marker)
 *
 * All mutations submitted via WCG Core (LAW-WCG-002).
 */

import { useState, useRef, useCallback } from 'react';
import { useStudio } from '@/app/dashboard/studio/layout';
import { MutationBuilder } from '@growsz/wcg-core';

// ---------------------------------------------------------------------------
// Message Types (Agent-Native)
// ---------------------------------------------------------------------------

type PartType = 'text' | 'reasoning' | 'tool_call' | 'task' | 'plan' | 'delegation' | 'file_change' | 'evidence' | 'step';

interface MessagePart {
  type: PartType;
  content: string;
  metadata?: Record<string, unknown>;
}

interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
  agent?: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ConversationPanel() {
  const { applyMutation, createBuilder, refreshSnapshot, projectView } = useStudio();
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      agent: 'claude-opus-4-6',
      parts: [
        { type: 'text', content: 'Connected to WebDevOS Core. Workspace: **Grandpa Ron\'s** (ecosystems/grandpa-ron-nextjs). Backend: Orcbase → Prisma adapter. WCG graph seeded with 13 nodes.' },
        { type: 'task', content: 'Workspace initialized', metadata: { status: 'completed', subtasks: ['WCG seeded', 'Orcbase connected', 'Shadow lane active'] } },
      ],
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    // User message
    const userMsg: AgentMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      parts: [{ type: 'text', content: input }],
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    const prompt = input;
    setInput('');

    // Create WCG mutation
    const builder = createBuilder(projectView === 'cms' ? 'cms' : 'ai_core');
    const result = applyMutation(
      builder.createNode({
        type: 'block',
        name: `block-${Date.now().toString(36)}`,
        display_name: prompt.slice(0, 40),
        props: { block_type: 'ai-generated', prompt },
      }),
    );

    // Agent response with structured parts
    setTimeout(() => {
      const parts: MessagePart[] = [
        { type: 'reasoning', content: `Analyzing request: "${prompt.slice(0, 60)}"\nDetermining optimal mutation strategy...\nChecking WCG graph integrity...`, metadata: { duration: 1200 } },
        { type: 'tool_call', content: 'wcg.createNode', metadata: { state: 'completed', input: { type: 'block', name: prompt.slice(0, 30) }, output: { mutation_id: result.mutation_id, status: result.status } } },
        { type: 'text', content: `Created WCG node via mutation protocol.\n\n**Mutation**: \`${result.mutation_id}\`\n**Status**: ${result.status}\n**Affected**: ${result.affected_nodes.length} nodes` },
        { type: 'task', content: prompt.slice(0, 40), metadata: { status: 'in_progress', subtasks: ['WCG node created', 'Rendering sync pending', 'Validation pending'], activeStep: 'Rendering sync pending' } },
      ];

      if (result.status === 'rejected') {
        parts.push({ type: 'evidence', content: 'FAIL', metadata: { reason: result.rejection_reason } });
      }

      const assistantMsg: AgentMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        agent: 'claude-opus-4-6',
        parts,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  }, [input, applyMutation, createBuilder, projectView]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <MessageRenderer key={msg.id} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Prompt Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe what to build..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
          />
          <button onClick={handleSend} className="rounded-full bg-purple-600 p-1.5 text-white hover:bg-purple-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Message Renderer — Structured parts (agent-native)
// ---------------------------------------------------------------------------

function MessageRenderer({ message }: { message: AgentMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[95%] space-y-2 ${isUser ? '' : ''}`}>
        {/* Agent badge */}
        {!isUser && message.agent && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            {message.agent}
          </div>
        )}

        {/* Render each part */}
        {message.parts.map((part, i) => (
          <PartRenderer key={i} part={part} isUser={isUser} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Part Renderer — Handles all 9 part types
// ---------------------------------------------------------------------------

function PartRenderer({ part, isUser }: { part: MessagePart; isUser: boolean }) {
  switch (part.type) {
    case 'text':
      return (
        <div className={`rounded-lg px-3 py-2 text-sm ${
          isUser ? 'bg-primary/20 text-foreground' : 'bg-muted text-foreground/80 border border-border'
        }`}>
          {part.content.split('\n').map((line, i) => (
            <p key={i} className={`${i > 0 ? 'mt-1' : ''} ${line.startsWith('**') ? 'font-semibold text-foreground' : ''}`}>
              {line.replace(/`([^`]+)`/g, '⌘$1').replace(/\*\*([^*]+)\*\*/g, '$1')}
            </p>
          ))}
        </div>
      );

    case 'reasoning':
      return <ReasoningBlock content={part.content} duration={part.metadata?.duration as number} />;

    case 'tool_call':
      return <ToolCallCard name={part.content} metadata={part.metadata ?? {}} />;

    case 'task':
      return <TaskCard title={part.content} metadata={part.metadata ?? {}} />;

    case 'plan':
      return (
        <div className="rounded-lg border border-blue-800/30 bg-blue-950/20 px-3 py-2 text-sm">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-1">Plan</div>
          <div className="text-foreground/80">{part.content}</div>
        </div>
      );

    case 'delegation':
      return (
        <div className="rounded-lg border border-purple-800/30 bg-purple-950/20 px-3 py-2 text-sm">
          <div className="flex items-center gap-1.5 text-[10px] text-purple-400">
            <span>→</span> Delegating to <span className="font-semibold">{part.content}</span>
          </div>
        </div>
      );

    case 'file_change':
      return (
        <div className="flex items-center gap-2 rounded px-3 py-1 text-xs font-mono text-cyan-400 bg-muted border border-border">
          <span className="text-green-500">M</span> {part.content}
        </div>
      );

    case 'evidence':
      return (
        <div className={`rounded px-3 py-1 text-xs font-medium ${
          part.content === 'PASS' ? 'bg-green-950/30 text-green-400 border border-green-800/30' :
          'bg-red-950/30 text-red-400 border border-red-800/30'
        }`}>
          {part.content === 'PASS' ? '✓' : '✗'} {part.content}
          {!!part.metadata?.reason && <span className="ml-2 text-muted-foreground/70">{String(part.metadata?.reason)}</span>}
        </div>
      );

    case 'step':
      return (
        <div className="flex items-center gap-2 rounded px-3 py-1 text-[10px] text-muted-foreground/70 bg-muted/50 border border-border/50">
          <span className="font-semibold text-purple-400">SPBVG</span>
          <span>{part.content}</span>
        </div>
      );

    default:
      return <div className="text-xs text-muted-foreground/50">[{part.type}] {part.content}</div>;
  }
}

// ---------------------------------------------------------------------------
// Reasoning Block (collapsible)
// ---------------------------------------------------------------------------

function ReasoningBlock({ content, duration }: { content: string; duration?: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border/50 bg-muted/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-[11px] text-muted-foreground/70 hover:text-foreground/80"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <span className="italic">Reasoning</span>
        {duration && <span className="ml-auto text-muted-foreground/30">{duration}ms</span>}
      </button>
      {expanded && (
        <div className="border-t border-border/50 px-3 py-2 text-xs text-muted-foreground/70 italic font-mono whitespace-pre-wrap">
          {content}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tool Call Card (state machine)
// ---------------------------------------------------------------------------

function ToolCallCard({ name, metadata }: { name: string; metadata: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false);
  const state = (metadata.state as string) ?? 'completed';

  const stateColors = {
    pending: 'border-border text-muted-foreground',
    running: 'border-blue-500 text-blue-400 animate-pulse',
    completed: 'border-green-600/50 text-green-400',
    error: 'border-red-600/50 text-red-400',
  }[state] ?? 'border-border text-muted-foreground';

  const stateIcon = { pending: '⏳', running: '▶', completed: '✓', error: '✗' }[state] ?? '?';

  return (
    <div className={`rounded-lg border ${stateColors} bg-muted/80 overflow-hidden`}>
      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center gap-2 px-3 py-1.5 text-xs">
        <span>{stateIcon}</span>
        <span className="font-mono">{name}</span>
        <span className="ml-auto text-muted-foreground/50 text-[10px]">{state}</span>
      </button>
      {expanded && !!metadata.input && (
        <div className="border-t border-border/50 px-3 py-2 text-[10px] font-mono text-muted-foreground/50 whitespace-pre-wrap">
          {JSON.stringify(metadata.input, null, 2)}
        </div>
      )}
      {expanded && !!metadata.output && (
        <div className="border-t border-border/50 px-3 py-2 text-[10px] font-mono text-green-600/60 whitespace-pre-wrap">
          {JSON.stringify(metadata.output, null, 2)}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Task Card (with subtasks and active step)
// ---------------------------------------------------------------------------

function TaskCard({ title, metadata }: { title: string; metadata: Record<string, unknown> }) {
  const subtasks = (metadata.subtasks as string[]) ?? [];
  const activeStep = metadata.activeStep as string | undefined;
  const status = metadata.status as string ?? 'pending';

  return (
    <div className="rounded-lg border border-border bg-muted/80 px-3 py-2">
      <div className="flex items-center gap-2 text-xs">
        <span className={`h-2 w-2 rounded-full ${
          status === 'completed' ? 'bg-green-500' :
          status === 'in_progress' ? 'bg-yellow-500 animate-pulse' : 'bg-muted-foreground/40'
        }`} />
        <span className="font-medium text-foreground/80">{title}</span>
        <span className="ml-auto text-[10px] text-muted-foreground/50">{status}</span>
      </div>
      {subtasks.length > 0 && (
        <div className="mt-1.5 space-y-0.5 pl-4">
          {subtasks.map((st, i) => (
            <div key={i} className={`flex items-center gap-1.5 text-[11px] ${
              st === activeStep ? 'text-yellow-400 font-medium' : 'text-muted-foreground/70'
            }`}>
              <span className={`h-1 w-1 rounded-full ${
                st === activeStep ? 'bg-yellow-400 animate-pulse' : 'bg-muted-foreground/40'
              }`} />
              {st}
              {st === activeStep && <span className="text-[9px] text-yellow-600">← active</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
