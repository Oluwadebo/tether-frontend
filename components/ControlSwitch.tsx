import type { Holder } from '@/lib/api';

const options: { holder: Holder; label: string; active: string }[] = [
  { holder: 'ai', label: 'AI drives', active: 'bg-ultramarine text-chalk' },
  { holder: 'paused', label: 'Paused', active: 'bg-flint text-ink' },
  { holder: 'human', label: 'I drive', active: 'bg-persimmon text-chalk' },
];

/** Who holds the thread. Taking it over asks for confirmation (handled by the page). */
export default function ControlSwitch({ status, onChange, disabled }: { status: Holder; onChange: (h: Holder) => void; disabled?: boolean }) {
  return (
    <div role="group" aria-label="Who holds this thread" className="inline-flex rounded-xl bg-limestone p-1 text-sm font-medium">
      {options.map((o) => (
        <button key={o.holder} type="button" aria-pressed={status === o.holder} disabled={disabled}
          onClick={() => status !== o.holder && onChange(o.holder)}
          className={`rounded-lg px-4 py-2 transition ${status === o.holder ? o.active : 'text-ink/60 hover:text-ink'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
