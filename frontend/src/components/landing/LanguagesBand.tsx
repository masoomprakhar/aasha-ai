import { Reveal } from './Reveal';

const LANGS = ['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Bhojpuri', 'English'];

export function LanguagesBand() {
  return (
    <section className="bg-subtle border-b border-border py-20" aria-labelledby="langs">
      <div className="cedar-section">
        <Reveal>
          <p className="ui-eyebrow mb-3">Multilingual</p>
          <h2 id="langs" className="text-2xl font-semibold text-ink mb-2">Speaks her language</h2>
          <p className="text-[15px] text-muted mb-8 max-w-lg">
            Responses match the language she uses. No switching. No shame.
          </p>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <span key={l} className="px-4 py-2 text-[13px] text-ink bg-canvas border border-border rounded-pill hover:border-brand hover:text-brand transition-colors">
                {l}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
