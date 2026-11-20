import type { Conversation, Holder } from './api';

export const WINDOW_MIN = 120; // how far back the Floor looks. Change this one number to zoom in or out.
export const UNSURE_BELOW = 0.6;

const hours = WINDOW_MIN / 60;
export const WINDOW_LABEL = Number.isInteger(hours) ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : `${WINDOW_MIN} minutes`;

/** Axis labels, derived from WINDOW_MIN so they always match the drawing. */
export const TICKS = ([0, 25, 50, 75, 100] as const).map((p) => {
  const m = Math.round((WINDOW_MIN * (100 - p)) / 100);
  const label = m === 0 ? 'now' : m % 60 === 0 ? `${m / 60}h` : `${m}m`;
  return [p, p === 0 ? `${label} ago` : label] as const;
});

export type Segment = { holder: Holder; from: number; to: number; unsure?: boolean }; // percentages of the window
export type Knot = { at: number; holder: Holder; reason?: string };

export const isUnsure = (c: Conversation) => c.status === 'ai' && c.confidence < UNSURE_BELOW;

/** Turns a conversation's control history into drawable thread segments and handoff knots. */
export function buildThread(c: Conversation, now: number) {
  const start = now - WINDOW_MIN * 60_000;
  const pct = (t: number) => Math.min(100, Math.max(0, ((t - start) / (now - start)) * 100));
  const control = [...c.control].sort((a, b) => +new Date(a.at) - +new Date(b.at));
  const segments: Segment[] = [];
  const knots: Knot[] = [];

  control.forEach((e, i) => {
    const from = +new Date(e.at);
    const to = control[i + 1] ? +new Date(control[i + 1].at) : now;
    const f = pct(from);
    const t = pct(to);
    if (t > f) segments.push({ holder: e.holder, from: f, to: t });
    if (i > 0 && from >= start) knots.push({ at: pct(from), holder: e.holder, reason: e.reason });
  });
  if (segments.length === 0) segments.push({ holder: c.status, from: 0, to: 100 });

  // When the AI is unsure, the end of its thread frays into straw.
  const last = segments[segments.length - 1];
  if (isUnsure(c) && last.holder === 'ai') {
    const cut = Math.max(last.from, last.to - (20 / WINDOW_MIN) * 100);
    segments.push({ holder: 'ai', from: cut, to: last.to, unsure: true });
    last.to = cut;
  }
  return { segments: segments.filter((s) => s.to - s.from > 0.05), knots };
}

export function summarize(convos: Conversation[], now: number) {
  const count = (h: Holder) => convos.filter((c) => c.status === h).length;
  let ai = 0;
  let total = 0;
  convos.forEach((c) =>
    buildThread(c, now).segments.forEach((s) => {
      total += s.to - s.from;
      if (s.holder === 'ai') ai += s.to - s.from;
    }),
  );
  const handoffs = convos.reduce((n, c) => n + c.control.slice(1).filter((e) => e.holder === 'human').length, 0);
  return {
    live: convos.length,
    ai: count('ai'),
    human: count('human'),
    paused: count('paused'),
    unsure: convos.filter(isUnsure),
    aiShare: total ? Math.round((ai / total) * 100) : 0,
    handoffs,
  };
}
