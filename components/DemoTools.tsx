'use client';
import { FormEvent, useState } from 'react';
import { ApiError, simulateCustomer } from '@/lib/api';

/** Demo helper: speak as the customer. If the AI holds the thread, it answers live. */
export default function DemoTools({ conversationId }: { conversationId: string }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function run(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await simulateCustomer(conversationId, text.trim() || undefined);
      setText('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={run} className="mt-2 space-y-2 rounded-xl border border-dashed border-flint p-4">
      <p className="font-mono text-xs uppercase tracking-widest text-ink/50">Demo tools</p>
      <div className="flex flex-wrap gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Customer message"
          placeholder="Type as the customer, or leave empty for a random message"
          className="min-w-64 flex-1 rounded-lg border border-flint bg-white px-3 py-2 text-sm outline-offset-2 focus:outline-2 focus:outline-ultramarine" />
        <button disabled={busy} className="rounded-lg border border-flint bg-chalk px-4 py-2 text-sm font-medium hover:border-ink disabled:opacity-50">
          Simulate customer message
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-ink/70">{error}</p>}
    </form>
  );
}
