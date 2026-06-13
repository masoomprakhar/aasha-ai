import { Mic, Shield, WifiOff } from 'lucide-react';
import { Reveal } from './Reveal';

const FEATURES = [
  { icon: Mic, title: 'Voice in 11 languages', body: 'Hindi, Tamil, Bhojpuri, and more — auto-detected, no typing.' },
  { icon: WifiOff, title: 'Offline-first', body: 'Logs queue locally and sync when signal returns.' },
  { icon: Shield, title: 'Private by default', body: 'Anonymous sessions, local storage, auto-delete on shared phones.' },
];

export function MinimalFeatures() {
  return (
    <section className="border-b border-border bg-subtle" aria-labelledby="features">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <Reveal className="mb-12">
          <h2 id="features" className="text-[22px] font-semibold text-ink">Everything she needs. Nothing she doesn&apos;t.</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-10">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-wash flex items-center justify-center shrink-0">
                    <Icon className="w-[18px] h-[18px] text-brand" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-ink mb-1.5">{f.title}</h3>
                    <p className="text-[14px] text-muted leading-relaxed">{f.body}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
