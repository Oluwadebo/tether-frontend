'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { logout, resetDemo, token } from '@/lib/api';
import { useMe } from '@/lib/hooks';
import { useRealtime } from '@/lib/realtime';
import FloorStrip from '@/components/FloorStrip';
import ThreadLoader from '@/components/ThreadLoader';
import ConfirmDialog from '@/components/ConfirmDialog';

/** Shell for every signed-in screen: header, live thread strip, auth check, live connection. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isError } = useMe();
  const { live } = useRealtime(!!user);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (!token.get() || isError) {
      logout();
      router.replace('/login');
    }
  }, [isError, router]);

  async function doReset() {
    setResetting(true);
    try {
      await resetDemo();
      await queryClient.invalidateQueries();
      router.push('/floor');
    } finally {
      setResetting(false);
      setConfirmReset(false);
    }
  }

  if (!user) {
    return <div className="grid min-h-screen place-items-center text-ultramarine"><ThreadLoader className="w-24" label="Loading your floor" /></div>;
  }
  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M2 16 C6 16, 8 6, 12 12" className="stroke-ultramarine" />
            <path d="M12 12 C16 18, 18 8, 22 8" className="stroke-persimmon" />
          </svg>
          <span className="font-serif text-xl">Tether</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span role="status" className="flex items-center gap-1.5 font-mono text-xs text-ink/60">
            <span className={`h-2 w-2 rounded-full ${live ? 'bg-ultramarine' : 'animate-pulse bg-straw'}`} />
            {live ? 'Live' : 'Reconnecting'}
          </span>
          <span>{user.name} <span className="font-mono text-xs text-ink/50">{user.role}</span></span>
          <button onClick={() => setConfirmReset(true)} className="rounded-lg px-3 py-1.5 text-ink/60 hover:text-ink">Reset demo</button>
          <button onClick={() => { logout(); queryClient.clear(); router.replace('/login'); }}
            className="rounded-lg border border-flint bg-chalk px-3 py-1.5 hover:border-ink">Sign out</button>
        </div>
      </header>
      <FloorStrip />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>

      <ConfirmDialog open={confirmReset} onOpenChange={setConfirmReset} busy={resetting}
        title="Reset the demo data?" confirmLabel="Reset" onConfirm={doReset}
        description="Every conversation is replaced with fresh sample data, so the Floor looks lively again. Your account stays." />
    </div>
  );
}
