import { useState } from 'react';
import { Reveal } from './Reveal';

const QUOTES = [
  {
    id: 'asha',
    tab: 'ASHA worker',
    quote:
      'Pehle ek visit likhne mein 20 minute lagte the. Ab main bolti hoon — BP, dawa, follow-up sab form mein aa jata hai. High-risk wali ko turant dekh leti hoon.',
    name: 'Sunita Devi',
    role: 'ASHA worker, Samastipur, Bihar',
  },
  {
    id: 'program',
    tab: 'Program lead',
    quote:
      'Women who never opened a health app are asking questions in Bhojpuri at night, privately. That is the metric that matters — dignity, not downloads.',
    name: 'Dr. Priya Nair',
    role: 'Maternal health program, Maharashtra',
  },
];

const METRICS = [
  { value: '90%', label: 'questions answered in-language' },
  { value: '3×', label: 'faster visit logging' },
  { value: '<30s', label: 'SOS to alert' },
];

export function ImpactStory() {
  const [active, setActive] = useState(QUOTES[0].id);
  const current = QUOTES.find((q) => q.id === active) ?? QUOTES[0];

  return (
    <section className="py-20 lg:py-28 bg-paper" aria-labelledby="impact-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10">
          <h2 id="impact-heading" className="font-serif text-3xl sm:text-4xl text-ink tracking-tight mb-2">
            Voices from the field
          </h2>
          <p className="text-xs font-mono text-muted uppercase tracking-wider">
            Illustrative sample outcomes · not clinical claims
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <Reveal className="lg:col-span-3">
            <div className="flex gap-2 mb-6" role="tablist">
              {QUOTES.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  role="tab"
                  aria-selected={active === q.id}
                  onClick={() => setActive(q.id)}
                  className={`px-4 py-2 text-sm rounded-pill transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                    active === q.id
                      ? 'bg-panel border border-line text-ink font-medium'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {q.tab}
                </button>
              ))}
            </div>
            <blockquote className="rounded-card border border-line bg-white p-8 shadow-soft">
              <p className="text-lg sm:text-xl text-ink leading-relaxed mb-6">&ldquo;{current.quote}&rdquo;</p>
              <footer>
                <cite className="not-italic">
                  <p className="font-semibold text-ink">{current.name}</p>
                  <p className="text-sm text-muted">{current.role}</p>
                </cite>
              </footer>
            </blockquote>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-2 flex flex-col justify-center gap-8">
            {METRICS.map((m) => (
              <div key={m.label} className="border-l-2 border-teal pl-5">
                <p className="font-serif text-4xl text-teal tracking-tight mb-1">{m.value}</p>
                <p className="text-xs font-mono uppercase tracking-wider text-muted">{m.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
