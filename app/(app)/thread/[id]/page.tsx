'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, Holder, sendMessage, setControl } from '@/lib/api';
import { useConversation } from '@/lib/hooks';
import { useTyping } from '@/lib/realtime';
import { buildStream } from '@/lib/thread';
import MessageStream from '@/components/MessageStream';
import ControlSwitch from '@/components/ControlSwitch';
import ConfirmDialog from '@/components/ConfirmDialog';
import Composer from '@/components/Composer';
import ContactPanel from '@/components/ContactPanel';
import DemoTools from '@/components/DemoTools';

function StreamSkeleton() {
  const bars = ['w-2/3', 'w-1/2', 'w-3/5', 'w-2/5'];
  return (
    <div role="status" aria-label="Loading conversation" className="space-y-2">
      {bars.map((w, i) => (
        <div key={i} className="grid grid-cols-[2.25rem_1fr] gap-3">
          <div className="relative"><div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-flint/60" /></div>
          <div className={`py-3 ${i % 2 ? 'flex justify-end' : ''}`}>
            <div className={`animate-reveal h-10 rounded-2xl bg-flint/50 ${w}`}
              style={{ animationDelay: `${i * 140}ms`, animationIterationCount: 'infinite', animationDirection: 'alternate' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ThreadPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, refetch } = useConversation(id);
  const [confirmTakeOver, setConfirmTakeOver] = useState(false);
  const [controlError, setControlError] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const typing = useTyping(id);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['conversation', id] });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  };
  const control = useMutation({
    mutationFn: (h: Holder) => setControl(id, h),
    onSuccess: () => { setConfirmTakeOver(false); setControlError(''); refresh(); },
    onError: (e) => { setConfirmTakeOver(false); setControlError(e instanceof ApiError ? e.message : 'Could not change the thread.'); },
  });
  const send = useMutation({ mutationFn: (text: string) => sendMessage(id, text), onSuccess: refresh });

  const items = useMemo(() => (data ? buildStream(data.conversation, data.messages) : []), [data]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [items.length, typing]);

  const convo = data?.conversation;
  const hint = convo?.status === 'paused' ? 'This thread is paused. Take it over to reply.' : 'The AI is holding this thread. Take it over to reply.';
  const notFound = isError && error instanceof ApiError && error.status === 404;

  return (
    <div className="mx-auto grid max-w-[90rem] gap-10 px-6 py-6 lg:px-12 xl:grid-cols-[1fr_20rem]">
      <section className="min-w-0">
        <Link href="/floor" className="text-sm text-ink/60 hover:text-ink">← The floor</Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4 pb-6">
          <div>
            <h1 className="font-serif text-3xl">{convo ? (convo.contact?.name ?? 'Unknown contact') : <span className="inline-block h-8 w-56 rounded-full bg-flint/60" />}</h1>
            {convo && <p className="mt-1 text-ink/60">{convo.topic}</p>}
          </div>
          {convo && <ControlSwitch status={convo.status} disabled={control.isPending}
            onChange={(h) => (h === 'human' ? setConfirmTakeOver(true) : control.mutate(h))} />}
        </div>

        {controlError && <p role="alert" className="mb-4 rounded-lg bg-straw/25 px-3 py-2 text-sm">{controlError}</p>}

        {isPending && <StreamSkeleton />}
        {isError && (
          <div role="alert" className="max-w-md space-y-3 rounded-xl border border-flint bg-chalk p-6">
            <p className="font-serif text-2xl">{notFound ? 'That thread does not exist.' : 'The thread did not load.'}</p>
            {!notFound && <button onClick={() => refetch()} className="rounded-lg bg-ink px-4 py-2 text-chalk hover:bg-ultramarine">Try again</button>}
          </div>
        )}
        {convo && <MessageStream items={items} typing={typing} contactName={convo.contact?.name.split(' ')[0] ?? 'Customer'} />}
        <div ref={end} />

        {convo && (
          <div className="sticky bottom-0 mt-4 bg-limestone/90 pb-4 pt-3 backdrop-blur">
            <Composer canReply={convo.status === 'human'} hint={hint} onSend={(t) => send.mutateAsync(t)} />
          </div>
        )}
        {convo && <DemoTools conversationId={id} />}
      </section>

      <aside className="hidden xl:block">{convo && <ContactPanel c={convo} />}</aside>

      <ConfirmDialog open={confirmTakeOver} onOpenChange={setConfirmTakeOver} busy={control.isPending}
        title="Take over this thread?" confirmLabel="Take over" onConfirm={() => control.mutate('human')}
        description={`The AI stops replying to ${convo?.contact?.name ?? 'this customer'} and the thread turns Persimmon. You can hand it back at any time.`} />
    </div>
  );
}
