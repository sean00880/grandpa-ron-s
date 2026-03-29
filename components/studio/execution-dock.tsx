'use client';

/**
 * Execution Dock — Bottom terminal kanban + agent status.
 *
 * Collapsed: kanban cards per agent (Claude, Gemini, Local, Codex)
 * Expanded: terminal streams per agent
 * Bound to: .growsz/logs + execution events
 *
 * This is the execution-layer agent runtime surface from the concept images.
 */

import { useState } from 'react';
import { useStudio } from '@/app/dashboard/studio/layout';

interface AgentCard {
  id: string;
  name: string;
  provider: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  color: string;
  task?: string;
}

const AGENTS: AgentCard[] = [
  { id: 'claude', name: 'Claude', provider: 'Anthropic', status: 'running', color: '#8b5cf6', task: 'Building quote form' },
  { id: 'gemini', name: 'Gemini', provider: 'Google', status: 'idle', color: '#3b82f6' },
  { id: 'codex', name: 'Codex', provider: 'OpenAI', status: 'idle', color: '#22c55e' },
  { id: 'local', name: 'Local', provider: 'TryLLM', status: 'idle', color: '#f97316' },
];

export function ExecutionDock() {
  const [expanded, setExpanded] = useState(false);
  const { dualLane, snapshot } = useStudio();
  const laneReport = dualLane.getReport();
  const activeAgent = AGENTS.find(a => a.status === 'running');

  return (
    <div className="border-t border-border bg-card">
      {/* Collapsed: Status bar + kanban cards */}
      <div className="flex items-center gap-2 px-4 py-1.5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </button>

        {/* Agent kanban cards (collapsed) */}
        <div className="flex items-center gap-1.5">
          {AGENTS.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px]"
              style={{
                borderLeft: `2px solid ${agent.color}`,
                backgroundColor: agent.status === 'running' ? `${agent.color}10` : 'transparent',
                color: agent.status === 'running' ? agent.color : '#52525b',
              }}
            >
              {agent.status === 'running' && (
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: agent.color }} />
              )}
              <span className="font-medium">{agent.name}</span>
            </div>
          ))}
        </div>

        {/* Active task */}
        {activeAgent?.task && (
          <div className="flex items-center gap-1.5 ml-2 text-xs">
            <span className="text-muted-foreground/50">|</span>
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400">{activeAgent.task}</span>
            <span className="text-muted-foreground/30">— in progress</span>
          </div>
        )}

        {/* Shadow lane stats */}
        <div className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground/30">
          <span>Shadow: {laneReport.discoveries}d / {laneReport.conflicts}c</span>
          <span>Rate: {(laneReport.success_rate * 100).toFixed(0)}%</span>
          <span>Ops: {laneReport.orchestration_count}</span>
        </div>
      </div>

      {/* Expanded: Terminal surfaces per agent */}
      {expanded && (
        <div className="border-t border-border grid grid-cols-2 gap-px bg-muted" style={{ height: '200px' }}>
          {AGENTS.filter(a => a.status === 'running' || expanded).slice(0, 4).map((agent) => (
            <div key={agent.id} className="bg-card p-2 overflow-auto">
              <div className="flex items-center gap-1.5 mb-1 text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: agent.color }} />
                <span style={{ color: agent.color }} className="font-semibold">{agent.name}</span>
                <span className="text-muted-foreground/30">[{agent.provider}]</span>
              </div>
              <div className="font-mono text-[10px] text-muted-foreground/50">
                {agent.status === 'running' ? (
                  <>
                    <div>$ executing SPBVG pipeline...</div>
                    <div className="text-green-600">✓ Scout complete</div>
                    <div className="text-green-600">✓ Plan approved</div>
                    <div className="text-yellow-600 animate-pulse">▶ Build in progress...</div>
                  </>
                ) : (
                  <div className="text-muted-foreground/30">Idle — waiting for delegation</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
