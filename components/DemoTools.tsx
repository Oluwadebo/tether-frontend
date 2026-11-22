'use client';
import { FormEvent, useState } from 'react';
import { ApiError, simulateCustomer } from '@/lib/api';

/** Demo helper: speak as the customer. If the AI holds the thread, it answers live. Collapsed on phones to save room. */
export default function DemoTools({ conversationId }: { conversationId: string }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

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
    <form onSubmit={run} className="rounded-xl border border-dashed border-flint p-3 sm:p-4">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className="flex w-full items-center justify-between font-mono text-xs uppercase tracking-widest text-ink/50 sm:pointer-events-none">
        Demo tools <span className="sm:hidden" aria-hidden>{open ? '−' : '+'}</span>
      </button>
      <div className={`mt-2 space-y-2 ${open ? 'block' : 'hidden'} sm:block`}>
        <div className="flex flex-wrap gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Customer message"
            placeholder="Type as the customer, or leave empty for a random message"
            className="min-w-0 flex-1 basis-56 rounded-lg border border-flint bg-white px-3 py-2 text-base outline-offset-2 focus:outline-2 focus:outline-ultramarine sm:text-sm" />
          <button disabled={busy} className="w-full rounded-lg border border-flint bg-chalk px-4 py-2 text-sm font-medium hover:border-ink disabled:opacity-50 sm:w-auto">
            Simulate customer message
          </button>
        </div>
        {error && <p role="alert" className="text-sm text-ink/70">{error}</p>}
      </div>
    </form>
  );
}
