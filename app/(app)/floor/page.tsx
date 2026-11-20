'use client';
import { useEffect, useState } from 'react';
import { useConversations } from '@/lib/hooks';
import FloorSummary from '@/components/FloorSummary';
import Timeline from '@/components/Timeline';
import ThreadSkeleton from '@/components/ThreadSkeleton';
import { WINDOW_LABEL } from '@/lib/floor';

export default function FloorPage() {
  const { data, isPending, isError, refetch } = useConversations();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="mx-auto max-w-[90rem] space-y-10 px-6 py-10 lg:px-12">
      <p className="font-mono text-xs uppercase tracking-widest text-ink/50">The floor · last {WINDOW_LABEL}</p>

      {isPending && (
        <>
          <div className="space-y-3" aria-hidden>
            <div className="animate-reveal h-3 w-2/3 rounded-full bg-flint" style={{ animationIterationCount: 'infinite', animationDirection: 'alternate' }} />
            <div className="animate-reveal h-3 w-1/2 rounded-full bg-flint/60" style={{ animationDelay: '150ms', animationIterationCount: 'infinite', animationDirection: 'alternate' }} />
          </div>
          <ThreadSkeleton />
        </>
      )}

      {isError && (
        <div role="alert" className="max-w-md space-y-3 rounded-xl border border-flint bg-chalk p-6">
          <p className="font-serif text-2xl">The floor did not load.</p>
          <p className="text-ink/70">The server could not be reached, or your session has expired.</p>
          <button onClick={() => refetch()} className="rounded-lg bg-ink px-4 py-2 text-chalk hover:bg-ultramarine">Try again</button>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="max-w-md space-y-2 rounded-xl border border-dashed border-flint p-6">
          <p className="font-serif text-2xl">No threads yet.</p>
          <p className="text-ink/70">Run <code className="font-mono text-sm">npm run seed</code> in the backend to add demo conversations.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <>
          <FloorSummary convos={data} now={now} />
          <Timeline convos={data} now={now} />
        </>
      )}
    </div>
  );
}
