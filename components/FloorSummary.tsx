import type { Conversation } from '@/lib/api';
import { summarize } from '@/lib/floor';

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
const AI = ({ children }: { children: React.ReactNode }) => <span className="font-mono text-[0.8em] text-ultramarine">{children}</span>;
const Team = ({ children }: { children: React.ReactNode }) => <span className="italic text-persimmon">{children}</span>;

/** The key numbers, written as sentences instead of boxes. */
export default function FloorSummary({ convos, now }: { convos: Conversation[]; now: number }) {
  const s = summarize(convos, now);
  return (
    <div className="space-y-4">
      <p className="max-w-3xl font-serif text-3xl leading-snug lg:text-4xl">
        {s.live} {plural(s.live, 'thread is', 'threads are')} live. The AI holds <AI>{s.ai}</AI>, your team holds <Team>{s.human}</Team>
        {s.paused > 0 && <>, and <span className="text-ink/50">{s.paused}</span> {plural(s.paused, 'is', 'are')} paused</>}.
      </p>
      <p className="max-w-3xl text-lg text-ink/70">
        Over the last four hours the AI held <AI>{s.aiShare}%</AI> of thread time, and passed {s.handoffs}{' '}
        {plural(s.handoffs, 'conversation', 'conversations')} to <Team>your team</Team>.
      </p>
      {s.unsure.length > 0 && (
        <p className="inline-block rounded-lg bg-straw/25 px-3 py-2 text-sm">
          {s.unsure.map((c) => c.contact?.name ?? 'A contact').join(', ')} {plural(s.unsure.length, 'is', 'are')} on a frayed thread: the AI is not sure of its answers.
        </p>
      )}
    </div>
  );
}
