'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { health } from '@/lib/api';

/**
 * Pings the backend first. Free hosting sleeps when idle, so a slow wake-up
 * shows a designed waiting screen instead of a broken-looking page.
 */
export default function WakeGate({ children }: { children: ReactNode }) {
  const { isSuccess } = useQuery({
    queryKey: ['health'],
    queryFn: health,
    retry: false,
    refetchInterval: (q) => (q.state.status === 'success' ? false : 3000),
  });
  const [slow, setSlow] = useState(false);
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 800);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (isSuccess) return;
    const i = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [isSuccess]);

  if (isSuccess) return <>{children}</>;
  if (!slow) return null;

  const loop = { animationIterationCount: 'infinite', animationDirection: 'alternate' } as const;
  return (
    <div className="grid min-h-screen place-items-center p-8 text-center">
      <div role="status" className="space-y-5">
        <svg viewBox="0 0 160 80" className="mx-auto w-40" fill="none" strokeLinecap="round" aria-hidden>
          <path pathLength={1} d="M4 56 C30 56 40 20 80 40" strokeWidth="5" className="animate-draw stroke-ultramarine"
            style={{ strokeDasharray: 1, strokeDashoffset: 1, ...loop }} />
          <path pathLength={1} d="M156 56 C130 56 120 20 80 40" strokeWidth="5" className="animate-draw stroke-persimmon"
            style={{ strokeDasharray: 1, strokeDashoffset: 1, animationDelay: '0.3s', ...loop }} />
          <circle cx="80" cy="40" r="8" strokeWidth="3" className="animate-knot origin-center fill-chalk stroke-ink [transform-box:fill-box]" style={{ animationDelay: '1s', ...loop }} />
        </svg>
        <p className="font-serif text-2xl">Waking the server…</p>
        <p className="mx-auto max-w-xs text-sm text-ink/60">
          {secs < 60
            ? 'Free hosting sleeps when idle, so the first visit can take up to a minute.'
            : 'Taking longer than usual. If you are running locally, check that the backend is started.'}
        </p>
      </div>
    </div>
  );
}
