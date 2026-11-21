'use client';
import { KeyboardEvent, useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { ApiError } from '@/lib/api';
import ThreadLoader from './ThreadLoader';

type Props = { canReply: boolean; hint: string; onSend: (text: string) => Promise<unknown> };

/** Reply box. Written in the serif because it is your team's voice. Locked until you hold the thread. */
export default function Composer({ canReply, hint, onSend }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    const t = text.trim();
    if (!t || !canReply || sending) return;
    setSending(true);
    setError('');
    try {
      await onSend(t);
      setText('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send. Try again.');
    } finally {
      setSending(false);
    }
  }
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-straw/25 px-3 py-2 text-sm">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />{error}
        </p>
      )}
      <div className="flex items-end gap-3">
        <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKeyDown} disabled={!canReply} rows={2}
          aria-label="Reply" placeholder={canReply ? 'Write a reply. Enter sends, Shift+Enter adds a line.' : hint}
          className="min-h-16 flex-1 resize-none rounded-xl border border-flint bg-white px-4 py-3 font-serif text-[17px] outline-offset-2 focus:outline-2 focus:outline-persimmon disabled:bg-limestone disabled:text-ink/50" />
        <button onClick={submit} disabled={!canReply || sending || !text.trim()}
          className="flex h-12 min-w-24 items-center justify-center rounded-xl bg-ink px-5 font-medium text-chalk hover:bg-persimmon disabled:opacity-40">
          {sending ? <ThreadLoader className="w-8 text-chalk" label="Sending" /> : 'Send'}
        </button>
      </div>
      {!canReply && <p className="text-sm text-ink/60">{hint}</p>}
    </div>
  );
}
