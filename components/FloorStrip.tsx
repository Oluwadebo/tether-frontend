'use client';
import { useConversations } from '@/lib/hooks';
import { isUnsure } from '@/lib/floor';
import type { Conversation } from '@/lib/api';

const wave = 'M2 8 C12 0 20 16 32 8 S52 0 62 8';

function Mini({ c }: { c: Conversation }) {
  const unsure = isUnsure(c);
  const color = unsure ? 'stroke-straw' : c.status === 'ai' ? 'stroke-ultramarine' : c.status === 'human' ? 'stroke-persimmon' : 'stroke-flint';
  const who = c.status === 'ai' ? (unsure ? 'AI, unsure' : 'AI') : c.status === 'human' ? 'your team' : 'paused';
  return (
    <a href={`/floor#${c.id}`} aria-label={`${c.contact?.name ?? 'Unknown'}, held by ${who}`}
      className="group flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1 hover:bg-limestone">
      <svg viewBox="0 0 64 16" className="h-4 w-16" fill="none" strokeLinecap="round" strokeWidth="3" aria-hidden>
        <path d={wave} className={color} strokeDasharray={unsure ? '4 5' : undefined} />
        {c.status === 'human' && <circle cx="32" cy="8" r="3.5" className="fill-chalk stroke-ink" strokeWidth="1.5" />}
      </svg>
      <span className="max-w-[4.5rem] truncate text-[11px] text-ink/60 group-hover:text-ink">{c.contact?.name.split(' ')[0] ?? '?'}</span>
    </a>
  );
}

/** The ribbon across the top: every live thread at a glance, coloured by who holds it. */
export default function FloorStrip() {
  const { data } = useConversations();
  return (
    <nav aria-label="Live threads" className="flex min-h-[3.25rem] items-center gap-1 overflow-x-auto border-b border-flint bg-chalk px-4">
      {data ? data.map((c) => <Mini key={c.id} c={c} />) : Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex w-20 shrink-0 flex-col items-center gap-1.5 px-2 py-1" aria-hidden>
          <div className="animate-reveal h-1 w-14 rounded-full bg-flint" style={{ animationDelay: `${i * 90}ms`, animationIterationCount: 'infinite', animationDirection: 'alternate' }} />
          <div className="h-2 w-10 rounded-full bg-flint/50" />
        </div>
      ))}
    </nav>
  );
}
