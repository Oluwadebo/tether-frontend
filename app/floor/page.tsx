'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, logout, token } from '@/lib/api';
import ThreadLoader from '@/components/ThreadLoader';

// Placeholder. The real Floor (dashboard) is built in a later step.
export default function FloorPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isError } = useQuery({ queryKey: ['me'], queryFn: getMe, retry: false });

  useEffect(() => {
    if (!token.get() || isError) {
      logout();
      router.replace('/login');
    }
  }, [isError, router]);

  if (!user) {
    return <div className="grid min-h-screen place-items-center text-ultramarine"><ThreadLoader className="w-24" label="Loading your floor" /></div>;
  }
  return (
    <main className="mx-auto max-w-2xl space-y-4 p-10">
      <p className="font-mono text-sm text-ultramarine">signed in · {user.role}</p>
      <h1 className="font-serif text-4xl">Good to see you, {user.name}.</h1>
      <p className="text-ink/70">The Floor is built in the next step.</p>
      <button onClick={() => { logout(); queryClient.clear(); router.replace('/login'); }}
        className="rounded-lg border border-flint bg-chalk px-4 py-2 text-sm hover:border-ink">Sign out</button>
    </main>
  );
}
