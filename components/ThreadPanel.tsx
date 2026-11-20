/** Left side of the login screen: draws the product idea (AI thread, knot, team thread). */
const draw = (delay: string) => ({ strokeDasharray: 1, strokeDashoffset: 1, animationDelay: delay });

export default function ThreadPanel() {
  return (
    <section className="flex flex-col justify-between gap-10 p-8 lg:p-14">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
          <path d="M2 16 C6 16, 8 6, 12 12" className="stroke-ultramarine" />
          <path d="M12 12 C16 18, 18 8, 22 8" className="stroke-persimmon" />
        </svg>
        <span className="font-serif text-2xl">Tether</span>
      </div>

      <div className="space-y-6">
        <h1 className="max-w-md font-serif text-4xl leading-tight lg:text-5xl">Every conversation is a thread.</h1>
        <p className="max-w-sm text-lg text-ink/70">See who is holding it, and take it the moment it matters.</p>

        <svg viewBox="0 0 520 220" className="w-full max-w-xl" fill="none" strokeLinecap="round" aria-hidden>
          <path pathLength={1} d="M0 150 C80 150 110 60 190 90 S270 190 300 130" strokeWidth="4"
            className="animate-draw stroke-ultramarine" style={draw('0.2s')} />
          <path d="M236 160 C262 158 282 148 300 130" strokeWidth="4" strokeDasharray="4 5"
            className="animate-fray stroke-straw" />
          <path pathLength={1} d="M300 130 C360 70 410 170 470 120 S510 100 520 110" strokeWidth="4"
            className="animate-draw stroke-persimmon" style={draw('1.3s')} />
          <circle cx="300" cy="130" r="9" strokeWidth="3" className="animate-knot origin-center fill-chalk stroke-ink [animation-delay:1.3s] [transform-box:fill-box]" />
          <text x="20" y="200" className="fill-ultramarine font-mono text-[13px]">AI · 94% sure</text>
          <text x="380" y="190" className="fill-persimmon font-serif text-[16px]">Your team</text>
        </svg>

        <ul className="space-y-2 text-sm text-ink/70">
          <li><span className="mr-2 inline-block h-2 w-6 rounded-full bg-ultramarine align-middle" />Ultramarine: the AI holds the thread</li>
          <li><span className="mr-2 inline-block h-2 w-6 rounded-full bg-straw align-middle" />Straw: the AI is unsure</li>
          <li><span className="mr-2 inline-block h-2 w-6 rounded-full bg-persimmon align-middle" />Persimmon: your team holds it</li>
        </ul>
      </div>
      <p className="hidden text-sm text-ink/50 lg:block">Tether demo</p>
    </section>
  );
}
