'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { token } from '@/lib/api';
import WakeGate from '@/components/WakeGate';
import ThreadPanel from '@/components/ThreadPanel';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    if (token.get()) router.replace('/floor'); // already signed in; /floor re-checks the token
  }, [router]);

  return (
    <WakeGate>
      <main className="grid min-h-screen auto-rows-min md:auto-rows-auto md:grid-cols-2">
        <ThreadPanel />
        <LoginForm />
      </main>
    </WakeGate>
  );
}
