/** Branded loader: a thread running along a wave. Use instead of "Loading..." text. */
export default function ThreadLoader({ className = 'w-10', label = 'Working' }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 40 12" className={className} role="status" aria-label={label} fill="none" strokeLinecap="round">
      <path d="M2 6 C8 0, 12 12, 20 6 S32 0, 38 6" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <path d="M2 6 C8 0, 12 12, 20 6 S32 0, 38 6" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" className="animate-run" />
    </svg>
  );
}
