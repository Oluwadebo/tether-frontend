import type { Conversation, Holder } from '@/lib/api';
import { TICKS, buildThread, isUnsure } from '@/lib/floor';

const fill: Record<Holder, string> = { ai: 'bg-ultramarine', human: 'bg-persimmon', paused: 'bg-flint' };
const dashed = { backgroundImage: 'repeating-linear-gradient(90deg, var(--color-straw) 0 6px, transparent 6px 11px)' };

function Who({ c }: { c: Conversation }) {
  if (c.status === 'ai')
    return <span className={`font-mono text-xs text-ultramarine ${isUnsure(c) ? 'rounded bg-straw/30 px-1.5 py-0.5' : ''}`}>AI {Math.round(c.confidence * 100)}%</span>;
  if (c.status === 'human') return <span className="font-serif text-base italic text-persimmon">Team</span>;
  return <span className="text-xs text-ink/50">Paused</span>;
}

function Row({ c, now, index }: { c: Conversation; now: number; index: number }) {
  const { segments, knots } = buildThread(c, now);
  const delay = `${index * 90}ms`;
  return (
    <li id={c.id} className="scroll-mt-24 rounded-lg px-2 py-3 target:bg-chalk target:ring-1 target:ring-flint">
      <div className="grid grid-cols-[14rem_1fr_6rem] items-center gap-4">
        <div className="min-w-0">
          <p className="truncate font-medium">{c.contact?.name ?? 'Unknown contact'}</p>
          <p className="truncate text-sm text-ink/60">{c.topic ?? c.contact?.company}</p>
        </div>
        <div className="animate-reveal relative h-8" style={{ animationDelay: delay }} aria-hidden>
          <div className="absolute inset-x-0 top-1/2 h-px bg-flint/60" />
          {[25, 50, 75].map((p) => <div key={p} className="absolute inset-y-1 w-px bg-flint/40" style={{ left: `${p}%` }} />)}
          {segments.map((s, i) => (
            <div key={i} className={`absolute top-1/2 h-1 -translate-y-1/2 rounded-full ${s.unsure ? '' : fill[s.holder]}`}
              style={{ left: `${s.from}%`, width: `${s.to - s.from}%`, ...(s.unsure ? dashed : {}) }} />
          ))}
          {knots.map((k, i) => (
            <div key={i} title={k.reason} className="animate-knot absolute top-1/2 h-3.5 w-3.5 origin-center -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-chalk"
              style={{ left: `${k.at}%`, animationDelay: `${index * 90 + 700}ms` }} />
          ))}
        </div>
        <div className="text-right"><Who c={c} /></div>
      </div>
      <span className="sr-only">Held by {c.status === 'ai' ? 'the AI' : c.status === 'human' ? 'your team' : 'nobody, paused'}.</span>
    </li>
  );
}

/** One horizontal thread per conversation over the Floor window. Knots mark handoffs. */
export default function Timeline({ convos, now }: { convos: Conversation[]; now: number }) {
  return (
    <div>
      <div className="grid grid-cols-[14rem_1fr_6rem] gap-4 px-2 pb-2" aria-hidden>
        <span />
        <div className="relative h-4 font-mono text-[11px] text-ink/50">
          {TICKS.map(([p, label]) => (
            <span key={p} className={`absolute ${p === 100 ? '-translate-x-full' : p === 0 ? '' : '-translate-x-1/2'}`} style={{ left: `${p}%` }}>{label}</span>
          ))}
        </div>
        <span />
      </div>
      <ul className="divide-y divide-flint">
        {convos.map((c, i) => <Row key={c.id} c={c} now={now} index={i} />)}
      </ul>
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70" aria-label="Legend">
        <li><span className="mr-2 inline-block h-1.5 w-6 rounded-full bg-ultramarine align-middle" />AI holds it</li>
        <li><span className="mr-2 inline-block h-1.5 w-6 rounded-full align-middle" style={dashed} />AI is unsure</li>
        <li><span className="mr-2 inline-block h-1.5 w-6 rounded-full bg-persimmon align-middle" />Your team holds it</li>
        <li><span className="mr-2 inline-block h-3 w-3 rounded-full border-2 border-ink bg-chalk align-middle" />Handoff</li>
      </ul>
    </div>
  );
}
