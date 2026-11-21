import type { Conversation, Holder, Message } from './api';

export type StreamItem =
  | { kind: 'message'; message: Message; holder: Holder }
  | { kind: 'handoff'; at: string; holder: Holder; reason?: string };

/** Merges messages and handoffs into one timeline, tagging each message with who held the thread at that moment. */
export function buildStream(c: Conversation, messages: Message[]): StreamItem[] {
  const control = [...c.control].sort((a, b) => +new Date(a.at) - +new Date(b.at));
  const holderAt = (t: number): Holder => {
    let h: Holder = control[0]?.holder ?? 'ai';
    for (const e of control) if (+new Date(e.at) <= t) h = e.holder;
    return h;
  };
  const rows: { t: number; item: StreamItem }[] = messages.map((m) => {
    const t = +new Date(m.createdAt);
    return { t, item: { kind: 'message', message: m, holder: holderAt(t) } };
  });
  control.slice(1).forEach((e) =>
    rows.push({ t: +new Date(e.at), item: { kind: 'handoff', at: e.at, holder: e.holder, reason: e.reason } }),
  );
  return rows.sort((a, b) => a.t - b.t).map((r) => r.item);
}

/** Reasons that only repeat the label ("Handed back to the AI"). The UI hides them. */
export const GENERIC_REASONS = new Set(['Handed back to the AI', 'Paused by the team', 'Conversation started']);
