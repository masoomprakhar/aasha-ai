import {
  Mic, HeartHandshake, LockKeyhole, CloudOff, HeartPulse, IdCard,
  type LucideIcon,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Reveal } from './Reveal';

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: Mic,
    title: 'Voice in 11+ languages',
    body: 'Speak in Hindi, Tamil, Gujarati, Bhojpuri, and more. No reading or typing needed.',
  },
  {
    icon: HeartHandshake,
    title: 'ASHA Didi AI',
    body: 'Warm, non-judgmental answers for periods, pregnancy, and body questions.',
  },
  {
    icon: LockKeyhole,
    title: 'Whisper privacy',
    body: 'Private sessions on shared family phones. Her health stays between her and Didi.',
  },
  {
    icon: CloudOff,
    title: 'Offline-first',
    body: 'Visits and logs save locally, then sync when she is back online.',
  },
  {
    icon: HeartPulse,
    title: 'SOS alerts',
    body: 'One tap reaches her ASHA worker when danger signs appear.',
  },
  {
    icon: IdCard,
    title: 'Digital health card',
    body: 'QR profile for ANC visits, IFA reminders, and scheme enrollment.',
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className="ui-card p-5 sm:p-6 hover:shadow-card transition-shadow group"
    >
      <div className="w-11 h-11 rounded-xl bg-canvas border border-border flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-brand" strokeWidth={1.75} />
      </div>
      <h3 className="text-[15px] font-semibold text-ink mb-1.5">{feature.title}</h3>
      <p className="text-caption text-muted leading-relaxed">{feature.body}</p>
    </motion.article>
  );
}

export function TopFeatures() {
  return (
    <section className="bg-canvas py-16 lg:py-20 border-b border-border" aria-labelledby="features-heading">
      <div className="cedar-section">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <p className="ui-eyebrow mb-3">Why ASHA AI</p>
          <h2 id="features-heading" className="saas-headline text-ink mb-3">
            Everything she needs. Nothing she has to read.
          </h2>
          <p className="text-body text-muted">
            Voice-first care for adolescent girls, mothers, and ASHA workers across rural India.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
