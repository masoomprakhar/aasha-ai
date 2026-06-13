import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

const POSTS = [
  {
    tag: 'NEWS',
    date: 'May 28, 2026',
    title: 'ASHA AI pilots voice period tracking in 12 Bihar blocks',
    excerpt: 'No typing, no calendar — women log cycles by speaking one sentence in Bhojpuri.',
  },
  {
    tag: 'FIELD NOTES',
    date: 'May 14, 2026',
    title: 'What we learned when 200 women asked their first health question aloud',
    excerpt: 'Shame, shared phones, and why audio replies beat text every time.',
  },
  {
    tag: 'EVENTS',
    date: 'Jun 8, 2026',
    title: 'Demo day: ASHA workers log a full antenatal visit in under 90 seconds',
    excerpt: 'Live walkthrough of voice extraction, risk scoring, and SOS handoff.',
  },
];

export function InsightsGrid() {
  return (
    <section id="insights" className="py-20 lg:py-28 bg-panel/40" aria-labelledby="insights-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12">
          <h2 id="insights-heading" className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
            What&apos;s new
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {POSTS.map((post, i) => (
            <Reveal key={post.title} delay={i * 0.08}>
              <article className="group h-full rounded-card border border-line bg-paper p-6 transition-all hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-mono font-medium text-teal uppercase tracking-widest">
                    {post.tag}
                  </span>
                  <span className="text-[10px] font-mono text-muted">{post.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-ink mb-3 leading-snug group-hover:text-teal transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-5">{post.excerpt}</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-ink group-hover:text-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
                  aria-label={`Read more: ${post.title}`}
                >
                  Read more
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
