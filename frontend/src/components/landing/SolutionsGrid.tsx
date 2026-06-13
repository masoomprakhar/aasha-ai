import {
  ArrowRight,
  Building2,
  CloudOff,
  Mic,
  Shield,
  Stethoscope,
  UserCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';

interface SolutionCard {
  icon: LucideIcon;
  title: string;
  subhead: string;
  description: string;
  href: string;
}

const CARDS: SolutionCard[] = [
  {
    icon: UserCircle2,
    title: 'For women & girls',
    subhead: 'Ask out loud, in your language',
    description: 'Voice assistant, cycle tracking, and one-tap SOS — no reading required.',
    href: '#workflows',
  },
  {
    icon: Stethoscope,
    title: 'For ASHA workers',
    subhead: 'Log a visit by speaking',
    description: 'AI extracts vitals and symptoms, QR health cards, and real-time risk alerts.',
    href: '#workflows',
  },
  {
    icon: Building2,
    title: 'For NGO partners',
    subhead: 'Launch schemes that reach the last mile',
    description: 'Campaign builder, enrollment tracking, and village-level reach analytics.',
    href: '#workflows',
  },
  {
    icon: Mic,
    title: 'Voice-first, always',
    subhead: 'Browser-native speech',
    description: 'Web Speech STT/TTS in 11 languages, with Whisper fallback for noisy rooms.',
    href: '#languages',
  },
  {
    icon: CloudOff,
    title: 'Offline-first sync',
    subhead: 'Works when signal drops',
    description: 'Actions queue locally and sync automatically when connectivity returns.',
    href: '#workflows',
  },
  {
    icon: Shield,
    title: 'Private by design',
    subhead: 'Your questions stay yours',
    description: 'Anonymous use, local storage, and auto-delete on shared family phones.',
    href: '#languages',
  },
];

export function SolutionsGrid() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-paper" aria-labelledby="solutions-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="solutions-heading" className="font-serif text-3xl sm:text-4xl text-ink tracking-tight mb-4">
            One platform, three jobs
          </h2>
          <p className="text-lg text-muted">
            Care that connects the woman, the worker, and the funder.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={i * 0.06}>
                <article className="group h-full rounded-card border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <div className="w-11 h-11 rounded-button bg-panel flex items-center justify-center text-teal mb-5">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink mb-1">{card.title}</h3>
                  <p className="text-sm font-medium text-teal mb-3">{card.subhead}</p>
                  <p className="text-sm text-muted leading-relaxed mb-5">{card.description}</p>
                  <button
                    type="button"
                    onClick={() => scrollTo(card.href)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-ink group-hover:text-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
