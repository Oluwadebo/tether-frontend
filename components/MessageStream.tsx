import type { Holder, Message } from '@/lib/api';
import type { StreamItem } from '@/lib/thread';
import { UNSURE_BELOW } from '@/lib/floor';

const rail: Record<Holder, string> = { ai: 'bg-ultramarine', human: 'bg-persimmon', paused: 'bg-flint' };
const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const isUnsure = (m: Message) => m.from === 'ai' && (m.confidence ?? 1) < UNSURE_BELOW;

/** The vertical thread beside the messages: colour shows who held it when each message was sent. */
function Rail({ color, knot }: { color: string; knot?: boolean }) {
  return (
    <div className="relative" aria-hidden>
      <div className={`absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 ${color}`} />
      {knot
        ? <div className="animate-knot absolute left-1/2 top-3 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ink bg-chalk" />
        : <div className={`absolute left-1/2 top-4 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-limestone ${color}`} />}
    </div>
  );
}

function Bubble({ m, name }: { m: Message; name: string }) {
  if (m.from === 'customer') {
    return (
      <div className="mr-8 flex flex-col items-start sm:mr-24">
        <p className="mb-1 text-xs text-ink/50">{name} · {time(m.createdAt)}</p>
        <p className="rounded-2xl rounded-tl-sm border border-flint bg-white px-4 py-2.5">{m.text}</p>
      </div>
    );
  }
  if (m.from === 'ai') {
    const unsure = isUnsure(m);
    return (
      <div className="ml-8 flex flex-col items-end sm:ml-24">
        <p className={`mb-1 font-mono text-xs text-ultramarine ${unsure ? 'rounded bg-straw/30 px-1.5 py-0.5' : ''}`}>
          AI · {unsure ? 'unsure' : 'sure'} {Math.round((m.confidence ?? 0) * 100)}% · {time(m.createdAt)}
        </p>
        <p className="rounded-2xl rounded-tr-sm bg-ultramarine/10 px-4 py-2.5 font-mono text-[13px] leading-relaxed">{m.text}</p>
      </div>
    );
  }
  return (
    <div className="ml-8 flex flex-col items-end sm:ml-24">
      <p className="mb-1 font-serif text-sm italic text-persimmon">Your team · {time(m.createdAt)}</p>
      <p className="rounded-2xl rounded-tr-sm bg-persimmon/10 px-4 py-2.5 font-serif text-[17px] leading-relaxed">{m.text}</p>
    </div>
  );
}

function HandoffLabel({ holder, reason, at }: { holder: Holder; reason?: string; at: string }) {
  const label =
    holder === 'human' ? <span className="font-serif italic text-persimmon">Handed to your team</span>
    : holder === 'ai' ? <span className="font-mono text-ultramarine">Handed back to the AI</span>
    : <span className="text-ink/60">Paused</span>;
  return (
    <p className="text-sm">
      {label} <span className="text-ink/50">· {time(at)}{reason ? ` · ${reason}` : ''}</span>
    </p>
  );
}

export default function MessageStream({ items, contactName }: { items: StreamItem[]; contactName: string }) {
  return (
    <ol>
      {items.map((it, i) => (
        <li key={it.kind === 'message' ? it.message.id : `h${i}`} className="grid grid-cols-[2.25rem_1fr] gap-3">
          {it.kind === 'message'
            ? <Rail color={isUnsure(it.message) ? 'bg-straw' : rail[it.holder]} />
            : <Rail color={rail[it.holder]} knot />}
          <div className="py-2">
            {it.kind === 'message'
              ? <Bubble m={it.message} name={contactName} />
              : <div className="flex min-h-9 items-center"><HandoffLabel holder={it.holder} reason={it.reason} at={it.at} /></div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
