import { Reveal } from './Reveal';

const STATES = ['Bihar', 'Uttar Pradesh', 'Maharashtra', 'Tamil Nadu', 'Gujarat'];

export function ProofStrip() {
  return (
    <section className="py-10 border-y border-line bg-paper" aria-label="Program reach">
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-muted mb-6">
          Trusted by frontline health programs across
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {STATES.map((state) => (
            <span
              key={state}
              className="text-sm sm:text-base font-medium text-ink/35 hover:text-ink/55 transition-colors"
            >
              {state}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
