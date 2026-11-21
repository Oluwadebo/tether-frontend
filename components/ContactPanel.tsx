import type { Conversation, Holder } from '@/lib/api';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const label = (h: Holder) =>
  h === 'ai' ? <span className="font-mono text-ultramarine">AI</span>
  : h === 'human' ? <span className="font-serif italic text-persimmon">Your team</span>
  : <span className="text-ink/60">Paused</span>;

/** Who the customer is, and the full history of who held their thread. */
export default function ContactPanel({ c }: { c: Conversation }) {
  const log = [...c.control].reverse();
  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ink/50">Contact</p>
        <p className="mt-2 font-serif text-2xl">{c.contact?.name ?? 'Unknown contact'}</p>
        <p className="text-ink/70">{c.contact?.company}</p>
      </div>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div><dt className="text-ink/50">Plan</dt><dd className="font-medium">{c.contact?.plan ?? '-'}</dd></div>
        <div><dt className="text-ink/50">Account value</dt><dd className="font-medium">{c.contact?.value != null ? usd.format(c.contact.value) : '-'}</dd></div>
        <div><dt className="text-ink/50">Channel</dt><dd className="font-medium capitalize">{c.channel}</dd></div>
      </dl>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ink/50">Who held the thread</p>
        <ol className="mt-3 space-y-4 border-l-2 border-flint pl-4">
          {log.map((e, i) => (
            <li key={i} className="text-sm">
              <p>{label(e.holder)} <span className="text-ink/50">· {time(e.at)}</span></p>
              {e.reason && <p className="text-ink/60">{e.reason}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
