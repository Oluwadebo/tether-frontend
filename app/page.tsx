// Setup check only. Replaced by the real Floor screen in a later step.
export default function Home() {
  const swatches = [
    ['bg-limestone', 'Limestone'], ['bg-chalk', 'Chalk'], ['bg-flint', 'Flint'], ['bg-ink', 'Ink'],
    ['bg-ultramarine', 'Ultramarine'], ['bg-persimmon', 'Persimmon'], ['bg-straw', 'Straw'],
  ];
  return (
    <main className="mx-auto max-w-2xl space-y-8 p-10">
      <h1 className="font-serif text-4xl">Tether</h1>
      <div className="space-y-2">
        <p className="font-sans">Customer voice: Instrument Sans</p>
        <p className="font-mono text-ultramarine">AI voice: JetBrains Mono</p>
        <p className="font-serif text-persimmon">Team voice: Fraunces</p>
      </div>
      <ul className="flex flex-wrap gap-3">
        {swatches.map(([cls, name]) => (
          <li key={name} className="text-center text-xs">
            <div className={`${cls} h-12 w-12 rounded-full border border-flint`} />
            {name}
          </li>
        ))}
      </ul>
    </main>
  );
}
