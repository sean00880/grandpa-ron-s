'use client';

/**
 * Workspace Sidebar — Files / Chat / Tasks tabs.
 * Matches Dev.png concept: left sidebar with project context.
 *
 * Files: WorkspaceExplorer (file tree + git status + agent badges)
 * Chat: Conversation session list (navigable)
 * Tasks: HyperList items (active/pending/completed with subtasks + steps)
 */

import { useStudio, type SidebarTab } from '@/app/dashboard/studio/layout';

const SIDEBAR_TABS: Array<{ id: SidebarTab; label: string }> = [
  { id: 'files', label: 'Files' },
  { id: 'chat', label: 'Chat' },
  { id: 'tasks', label: 'Tasks' },
];

export function WorkspaceSidebar() {
  const { sidebarTab, setSidebarTab, sidebarCollapsed, toggleSidebar, snapshot, hyperList } = useStudio();

  if (sidebarCollapsed) {
    return (
      <div className="flex w-10 flex-col items-center border-r border-border bg-background py-2">
        <button onClick={toggleSidebar} className="rounded p-1 text-muted-foreground/70 hover:text-foreground/80" title="Expand sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    );
  }

  const hlNodes = hyperList.getAllNodes();
  const activeNodes = hlNodes.filter(n => n.status === 'active');
  const pendingNodes = hlNodes.filter(n => n.status === 'pending');

  return (
    <div className="flex w-64 flex-col border-r border-border bg-background">
      {/* Workspace header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div>
          <div className="text-xs font-semibold text-foreground/80">Grandpa Ron&apos;s</div>
          <div className="text-[10px] text-muted-foreground/50">ecosystems/grandpa-ron-nextjs</div>
        </div>
        <button onClick={toggleSidebar} className="rounded p-0.5 text-muted-foreground/50 hover:text-muted-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border">
        {SIDEBAR_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSidebarTab(tab.id)}
            className={`flex-1 py-1.5 text-[11px] font-medium transition-colors ${
              sidebarTab === tab.id ? 'text-purple-400 border-b border-purple-400' : 'text-muted-foreground/70 hover:text-foreground/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {sidebarTab === 'files' && <FilesPanel />}
        {sidebarTab === 'chat' && <ChatPanel />}
        {sidebarTab === 'tasks' && <TasksPanel activeNodes={activeNodes} pendingNodes={pendingNodes} allNodes={hlNodes} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Files Panel — Workspace file tree
// ---------------------------------------------------------------------------

function FilesPanel() {
  const { snapshot, projectView } = useStudio();
  const isCMS = projectView === 'cms';

  if (isCMS) return <CMSFileExplorer />;
  return <IDEFileExplorer />;
}

/** AI Core: IDE-style file tree (src/, components/, lib/) */
function IDEFileExplorer() {
  const { snapshot } = useStudio();
  const pages = Object.values(snapshot.nodes).filter(n => n.type === 'page');
  const components = Object.values(snapshot.nodes).filter(n => n.type === 'component');
  const layouts = Object.values(snapshot.nodes).filter(n => n.type === 'layout');
  const dataSources = Object.values(snapshot.nodes).filter(n => n.type === 'data_source');
  const blocks = Object.values(snapshot.nodes).filter(n => n.type === 'block');
  const routes = Object.values(snapshot.nodes).filter(n => n.type === 'route');

  return (
    <div className="p-2 text-xs">
      <div className="mb-2 text-[9px] font-semibold text-purple-400/70 uppercase tracking-wider">IDE View</div>
      <FileGroup label="app/ (Pages)" items={pages} icon="📄" />
      <FileGroup label="components/" items={components} icon="🧩" />
      <FileGroup label="layouts/" items={layouts} icon="📐" />
      <FileGroup label="lib/ (Data)" items={dataSources} icon="🔌" />
      {blocks.length > 0 && <FileGroup label="blocks/" items={blocks} icon="🔲" />}
      {routes.length > 0 && <FileGroup label="api/" items={routes} icon="⚡" />}
    </div>
  );
}

/** CMS: Page → Sections → Blocks hierarchy */
function CMSFileExplorer() {
  const { snapshot } = useStudio();
  const pages = Object.values(snapshot.nodes).filter(n => n.type === 'page');

  return (
    <div className="p-2 text-xs">
      <div className="mb-2 text-[9px] font-semibold text-cyan-400/70 uppercase tracking-wider">CMS View</div>
      {pages.map(page => {
        const children = Object.values(snapshot.nodes).filter(n => n.parent_id === page.id);
        return (
          <div key={page.id} className="mb-2">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground/70 mb-0.5">
              <span>📄</span> {page.display_name ?? page.name}
              <span className="ml-auto text-muted-foreground/30">{children.length}</span>
            </div>
            {children.map(child => (
              <div key={child.id} className="pl-4 py-0.5 text-muted-foreground/60 hover:text-muted-foreground cursor-pointer rounded hover:bg-muted">
                <span className="text-[10px]">{child.type === 'component' ? '🧩' : '🔲'}</span>{' '}
                {child.display_name ?? child.name}
              </div>
            ))}
            {children.length === 0 && (
              <div className="pl-4 py-0.5 text-[10px] text-muted-foreground/30">Empty page</div>
            )}
          </div>
        );
      })}
      {pages.length === 0 && (
        <div className="text-muted-foreground/30 text-center py-4">No pages yet</div>
      )}
    </div>
  );
}

function FileGroup({ label, items, icon }: { label: string; items: any[]; icon: string }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        <span>{icon}</span> {label} ({items.length})
      </div>
      {items.map((item) => (
        <div key={item.id} className="cursor-pointer rounded px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          {item.display_name ?? item.name}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat Panel — Conversation sessions
// ---------------------------------------------------------------------------

function ChatPanel() {
  return (
    <div className="p-2">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Conversations</div>
      {['Current Session', 'Quote Form Build', 'Homepage Redesign'].map((session, i) => (
        <div key={i} className={`cursor-pointer rounded px-2 py-1.5 text-xs transition-colors ${
          i === 0 ? 'bg-purple-500/10 text-purple-400' : 'text-muted-foreground hover:bg-muted'
        }`}>
          <div className="font-medium">{session}</div>
          <div className="text-[10px] text-muted-foreground/50">{i === 0 ? 'Active' : '2h ago'}</div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tasks Panel — HyperList items with active/pending/completed
// ---------------------------------------------------------------------------

function TasksPanel({ activeNodes, pendingNodes, allNodes }: { activeNodes: any[]; pendingNodes: any[]; allNodes: any[] }) {
  const completedCount = allNodes.filter(n => n.status === 'completed').length;

  return (
    <div className="p-2">
      {activeNodes.length > 0 && (
        <div className="mb-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-yellow-500">Active ({activeNodes.length})</div>
          {activeNodes.map(n => (
            <TaskItem key={n.id} node={n} />
          ))}
        </div>
      )}
      {pendingNodes.length > 0 && (
        <div className="mb-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Pending ({pendingNodes.length})</div>
          {pendingNodes.map(n => (
            <TaskItem key={n.id} node={n} />
          ))}
        </div>
      )}
      {allNodes.length === 0 && (
        <div className="px-2 py-4 text-center text-[11px] text-muted-foreground/50">
          No tasks yet. Agent conversations will generate tasks via the HyperList substrate.
        </div>
      )}
      {completedCount > 0 && (
        <div className="mt-2 text-[10px] text-muted-foreground/50 px-2">{completedCount} completed</div>
      )}
    </div>
  );
}

function TaskItem({ node }: { node: any }) {
  return (
    <div className="rounded px-2 py-1.5 text-xs hover:bg-muted cursor-pointer">
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${
          node.status === 'active' ? 'bg-yellow-500 animate-pulse' :
          node.status === 'completed' ? 'bg-green-500' : 'bg-muted-foreground/40'
        }`} />
        <span className="text-foreground/80">{node.title}</span>
      </div>
      <div className="mt-0.5 pl-3 text-[10px] text-muted-foreground/50">{node.priority} &middot; {node.type}</div>
    </div>
  );
}
