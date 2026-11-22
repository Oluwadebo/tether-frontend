/** Left side of the login screen: draws the product idea (AI thread, knot, team thread). */
const draw = (delay: string) => ({ strokeDasharray: 1, strokeDashoffset: 1, animationDelay: delay });

export default function ThreadPanel() {
  return (
    <section className="flex flex-col justify-between gap-6 p-6 md:p-10 lg:gap-10 lg:p-14">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
          <path d="M2 16 C6 16, 8 6, 12 12" className="stroke-ultramarine" />
          <path d="M12 12 C16 18, 18 8, 22 8" className="stroke-persimmon" />
        </svg>
        <span className="font-serif text-2xl">Tether</span>
      </div>

      <div className="space-y-6">
        <h1 className="max-w-md font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">Every conversation is a thread.</h1>
        <p className="hidden max-w-sm text-lg text-ink/70 sm:block">See who is holding it, and take it the moment it matters.</p>

        <svg viewBox="0 0 520 220" className="hidden w-full max-w-xl sm:block" fill="none" strokeLinecap="round" aria-hidden>
          {/* AI thread: solid while confident */}
          <path pathLength={1} d="M0 150 C90 150 120 70 190 78" strokeWidth="4"
            className="animate-draw stroke-ultramarine" style={{ ...draw('0.2s'), animationDuration: '1s' }} />
          {/* AI thread frays into straw just before the handoff */}
          <g className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <path d="M190 78 C260 86 270 130 300 130" strokeWidth="4" strokeDasharray="5 6" className="animate-fray stroke-straw" />
          </g>
          {/* Team thread continues from the knot */}
          <path pathLength={1} d="M300 130 C335 130 350 92 392 92 S455 150 496 112" strokeWidth="4"
            className="animate-draw stroke-persimmon" style={draw('1.6s')} />
          <circle cx="300" cy="130" r="9" strokeWidth="3" className="animate-knot origin-center fill-chalk stroke-ink [animation-delay:1.6s] [transform-box:fill-box]" />
          <text x="14" y="178" className="fill-ultramarine font-mono text-[13px]">AI · 94% sure</text>
          <text x="364" y="74" className="fill-persimmon font-serif text-[16px]">Your team</text>
        </svg>

        <ul className="hidden space-y-2 text-sm text-ink/70 lg:block">
          <li><span className="mr-2 inline-block h-2 w-6 rounded-full bg-ultramarine align-middle" />Ultramarine: the AI holds the thread</li>
          <li><span className="mr-2 inline-block h-2 w-6 rounded-full bg-straw align-middle" />Straw: the AI is unsure</li>
          <li><span className="mr-2 inline-block h-2 w-6 rounded-full bg-persimmon align-middle" />Persimmon: your team holds it</li>
        </ul>
      </div>
      <p className="hidden text-sm text-ink/50 lg:block">Tether demo</p>
    </section>
  );
}
