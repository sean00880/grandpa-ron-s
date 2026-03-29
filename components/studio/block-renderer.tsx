'use client';

/**
 * Block Renderer - Visual preview of WCG blocks in CMS mode.
 * Maps block_type to React component for live visual editing.
 * LAW-WCG-002: Interfaces never own state.
 */

interface WCGNodeLike {
  id: string;
  name: string;
  type: string;
  display_name?: string;
  props?: Record<string, unknown>;
}

interface BlockRendererProps {
  blocks: WCGNodeLike[];
  selectedNodeId: string | null;
  onSelectBlock: (id: string) => void;
}

export function BlockRenderer({ blocks, selectedNodeId, onSelectBlock }: BlockRendererProps) {
  if (blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground/40">
        <div className="text-center">
          <div className="text-4xl mb-2">+</div>
          <div className="text-sm">Add blocks from the palette</div>
          <div className="text-[10px] text-muted-foreground/30 mt-1">Blocks render here as visual components</div>
        </div>
      </div>
    );
  }

  const sorted = [...blocks].sort((a, b) =>
    (Number(a.props?._order) || 0) - (Number(b.props?._order) || 0)
  );

  return (
    <div className="p-4 space-y-2 max-w-4xl mx-auto">
      {sorted.map(block => (
        <div
          key={block.id}
          onClick={() => onSelectBlock(block.id)}
          className={`group relative rounded-lg transition-all cursor-pointer ${
            selectedNodeId === block.id
              ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-background'
              : 'hover:ring-1 hover:ring-border'
          }`}
        >
          <div className={`absolute -top-2.5 left-2 z-10 rounded px-1.5 py-0 text-[9px] font-medium ${
            selectedNodeId === block.id ? 'bg-purple-500 text-white' : 'bg-muted text-muted-foreground/70 opacity-0 group-hover:opacity-100'
          }`}>
            {block.display_name ?? block.name}
          </div>
          <VisualBlock block={block} />
        </div>
      ))}
    </div>
  );
}

function VisualBlock({ block }: { block: WCGNodeLike }) {
  const blockType = String(block.props?.block_type ?? block.type);
  const content = String(block.props?.content ?? '');
  const integrationId = block.props?.integration_id ? String(block.props.integration_id) : null;

  if (integrationId) {
    return <IntegrationBlock integrationId={integrationId} displayName={block.display_name ?? block.name} />;
  }

  switch (blockType) {
    case 'hero':
      return (
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-12 text-white">
          <h1 className="text-3xl font-bold mb-3">{content || 'Your Hero Headline Here'}</h1>
          <p className="text-green-200/80 text-lg max-w-xl">Professional lawn care services in Columbus, Ohio</p>
          <button className="mt-6 bg-white text-green-900 px-6 py-2.5 rounded-lg font-semibold text-sm">Get a Free Quote</button>
        </div>
      );
    case 'text':
      return (
        <div className="p-6 bg-card rounded-lg border border-border">
          <p className="text-foreground/80 leading-relaxed">{content || 'Add your text content here. Click to edit in the properties panel.'}</p>
        </div>
      );
    case 'cta':
      return (
        <div className="p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20 text-center">
          <h3 className="text-xl font-semibold mb-2">{content || 'Ready to transform your lawn?'}</h3>
          <button className="bg-cyan-600 text-white px-8 py-3 rounded-lg font-medium">Get Started Today</button>
        </div>
      );
    case 'cards':
      return (
        <div className="grid grid-cols-3 gap-4">
          {['Mowing', 'Landscaping', 'Tree Trimming'].map(s => (
            <div key={s} className="p-4 bg-card rounded-lg border border-border text-center">
              <div className="text-2xl mb-2">&#127807;</div>
              <h4 className="font-semibold text-sm">{s}</h4>
              <p className="text-xs text-muted-foreground mt-1">Professional {s.toLowerCase()} services</p>
            </div>
          ))}
        </div>
      );
    case 'image':
      return (
        <div className="aspect-video bg-muted rounded-lg border border-border flex items-center justify-center text-muted-foreground/40 text-xs">
          &#128444; Image placeholder
        </div>
      );
    case 'form':
      return (
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="font-semibold mb-4">Contact Form</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">Name</div>
            <div className="rounded border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">Email</div>
            <div className="col-span-2 rounded border border-border bg-muted px-3 py-2 text-xs text-muted-foreground h-16">Message</div>
          </div>
          <button className="mt-3 bg-primary text-primary-foreground px-4 py-2 rounded text-xs">Submit</button>
        </div>
      );
    case 'reviews':
      return (
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="font-semibold mb-3">Customer Reviews</h3>
          <div className="flex gap-1 mb-2 text-yellow-500">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p className="text-sm text-muted-foreground italic">&ldquo;Best lawn care service in Columbus!&rdquo;</p>
          <p className="text-xs text-muted-foreground/70 mt-1">&mdash; Google Reviews (4.8/5)</p>
        </div>
      );
    case 'gallery':
      return (
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-lg border border-border flex items-center justify-center text-muted-foreground/30 text-xs">
              Photo {i + 1}
            </div>
          ))}
        </div>
      );
    case 'pricing':
      return (
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'Basic', price: '$45/visit', features: ['Mowing', 'Edging', 'Blowing'] },
            { name: 'Premium', price: '$89/visit', features: ['+ Trimming', '+ Fertilizing'] },
            { name: 'Complete', price: '$150/visit', features: ['+ Aeration', '+ Seeding', '+ Mulching'] },
          ].map(plan => (
            <div key={plan.name} className={`p-4 rounded-lg border text-center ${plan.name === 'Premium' ? 'border-cyan-500 bg-cyan-500/5' : 'border-border bg-card'}`}>
              <h4 className="font-semibold">{plan.name}</h4>
              <div className="text-2xl font-bold mt-2">{plan.price}</div>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      );
    case 'nav':
      return (
        <div className="flex items-center gap-6 p-4 bg-card rounded-lg border border-border">
          <span className="font-bold text-sm">Grandpa Ron&#39;s</span>
          {['Home', 'Services', 'About', 'Blog', 'Contact'].map(link => (
            <span key={link} className="text-xs text-muted-foreground">{link}</span>
          ))}
          <button className="ml-auto bg-primary text-primary-foreground px-3 py-1 rounded text-xs">Get Quote</button>
        </div>
      );
    case 'footer':
      return (
        <div className="p-6 bg-card rounded-lg border border-border grid grid-cols-3 gap-4 text-xs text-muted-foreground">
          <div><div className="font-semibold text-foreground/80 mb-2">Grandpa Ron&#39;s</div><p>Professional lawn care in Columbus, OH</p></div>
          <div><div className="font-semibold text-foreground/80 mb-2">Services</div><p>Mowing, Landscaping, Tree Care</p></div>
          <div><div className="font-semibold text-foreground/80 mb-2">Contact</div><p>(220) 666-2520</p></div>
        </div>
      );
    case 'map':
      return (
        <div className="h-48 bg-muted rounded-lg border border-border flex items-center justify-center text-muted-foreground/40 text-xs">
          &#128205; Service Area Map &mdash; Columbus, OH
        </div>
      );
    default:
      return (
        <div className="p-4 bg-muted/50 rounded-lg border border-dashed border-border text-center text-sm text-muted-foreground/50">
          [{blockType}] &mdash; {block.display_name ?? block.name}
        </div>
      );
  }
}

function IntegrationBlock({ integrationId, displayName }: { integrationId: string; displayName: string }) {
  const info: Record<string, { icon: string; desc: string }> = {
    'workgun:quote-form': { icon: '&#128202;', desc: 'Quote Builder with lead scoring' },
    'workgun:dispatch-board': { icon: '&#128666;', desc: 'Real-time crew dispatch' },
    'workgun:crew-calendar': { icon: '&#128197;', desc: 'Team scheduling' },
    'workgun:customer-portal': { icon: '&#127968;', desc: 'Self-service portal' },
    'workgun:invoice-gen': { icon: '&#129534;', desc: 'Stripe invoicing' },
    'workgun:team-inbox': { icon: '&#128236;', desc: 'Shared email inbox' },
    'workgun:property-audit': { icon: '&#128269;', desc: 'AI property analysis' },
    'workgun:review-collector': { icon: '&#11088;', desc: 'Auto review collection' },
  };

  const item = info[integrationId] ?? { icon: '&#128295;', desc: displayName };

  return (
    <div className="p-6 rounded-lg border-2 border-dashed border-cyan-500/30 bg-cyan-500/5">
      <div className="flex items-center gap-3">
        <span className="text-3xl" dangerouslySetInnerHTML={{ __html: item.icon }} />
        <div>
          <div className="font-semibold text-sm">{displayName}</div>
          <div className="text-xs text-muted-foreground">{item.desc}</div>
          <div className="text-[10px] text-cyan-500/70 mt-1 font-mono">{integrationId}</div>
        </div>
      </div>
    </div>
  );
}
