/** Loading state for lists: grey threads being drawn where the real ones will appear. */
export default function ThreadSkeleton({ rows = 6 }: { rows?: number }) {
  const widths = ['72%', '48%', '88%', '60%', '80%', '38%'];
  return (
    <div role="status" aria-label="Loading threads" className="space-y-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-[14rem_1fr_6rem] items-center gap-4">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded-full bg-flint/70" />
            <div className="h-2.5 w-32 rounded-full bg-flint/40" />
          </div>
          <div className="relative h-1 rounded-full bg-flint/30">
            <div className="animate-reveal absolute inset-y-0 left-0 rounded-full bg-flint"
              style={{ width: widths[i % widths.length], animationDelay: `${i * 120}ms`, animationIterationCount: 'infinite', animationDirection: 'alternate' }} />
          </div>
          <div className="h-3 w-12 rounded-full bg-flint/50" />
        </div>
      ))}
    </div>
  );
}
