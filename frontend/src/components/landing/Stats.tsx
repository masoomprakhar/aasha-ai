import { Reveal } from './Reveal';

const STATS = [
  { value: '300M', label: 'rural women underserved' },
  { value: '1:1000', label: 'ASHA worker ratio' },
  { value: '11+', label: 'languages supported' },
  { value: '0', label: 'downloads to start' },
];

export function Stats() {
  return (
    <section className="py-12 bg-paper border-b border-line" aria-label="Key statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-x-0 lg:divide-x divide-line">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center px-2 ${i > 0 && i % 2 === 0 ? 'border-t border-line pt-8 lg:border-t-0 lg:pt-0' : ''} ${i === 1 ? 'border-t border-line pt-8 lg:border-t-0 lg:pt-0' : ''}`}
              >
                <p className="font-serif text-3xl sm:text-4xl text-teal tracking-tight mb-2">{stat.value}</p>
                <p className="text-xs font-mono uppercase tracking-wider text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
