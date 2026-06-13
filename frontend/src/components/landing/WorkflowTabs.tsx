import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mic, Bell, BarChart3, HeartHandshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  body: string;
  mockLabel: string;
}

const TABS: Tab[] = [
  {
    id: 'speak',
    label: 'She speaks',
    icon: Mic,
    title: 'One tap. Her own words.',
    body: 'She describes how she feels in Hindi, Tamil, or Bhojpuri — no forms, no pamphlets, no shame. The mic listens; she never has to read.',
    mockLabel: 'Voice input · cycle · SOS',
  },
  {
    id: 'respond',
    label: 'ASHA Didi responds',
    icon: HeartHandshake,
    title: 'Warm guidance, not a diagnosis.',
    body: 'WHO-aligned audio answers in her language. Red-flag keywords — bleeding, severe pain, baby not moving — trigger an instant SOS alert.',
    mockLabel: 'AI reply · audio playback',
  },
  {
    id: 'act',
    label: 'The worker acts',
    icon: Bell,
    title: 'Context reaches the right person.',
    body: 'Her linked ASHA worker gets a full alert on the dashboard — symptoms, risk level, location — and can schedule a visit in seconds.',
    mockLabel: 'Alerts · visit scheduler',
  },
  {
    id: 'impact',
    label: 'Partners see impact',
    icon: BarChart3,
    title: 'Reach you can measure.',
    body: 'Enrollment counts, language breakdown, and village-level analytics roll up for NGO and government partners funding the program.',
    mockLabel: 'Scheme analytics · enrollments',
  },
];

function PhoneMockup({ label }: { label: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] rounded-[2rem] border-[6px] border-ink/10 bg-panel shadow-soft overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-7 bg-ink/5 flex items-center justify-center">
        <div className="w-16 h-1 rounded-full bg-ink/15" />
      </div>
      <div className="pt-10 px-4 pb-4 h-full flex flex-col">
        <div className="rounded-card bg-teal/10 px-3 py-2 mb-3">
          <p className="text-[10px] font-mono text-teal uppercase tracking-wider">ASHA AI</p>
        </div>
        <div className="flex-1 space-y-2">
          <div className="rounded-card bg-white border border-line p-3 h-16" />
          <div className="rounded-card bg-ink p-3 h-20 ml-4" />
          <div className="rounded-card bg-teal/90 p-3 h-24 mr-4" />
          <div className="rounded-card bg-white border border-line p-3 flex-1 min-h-[60px]" />
        </div>
        <p className="text-center text-[10px] font-mono text-muted mt-3">{label}</p>
      </div>
    </div>
  );
}

export function WorkflowTabs() {
  const [active, setActive] = useState(TABS[0].id);
  const reduceMotion = useReducedMotion();
  const current = TABS.find((t) => t.id === active) ?? TABS[0];
  const Icon = current.icon;

  return (
    <section id="workflows" className="py-20 lg:py-28 bg-panel/50" aria-labelledby="workflows-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12">
          <h2 id="workflows-heading" className="font-serif text-3xl sm:text-4xl text-ink tracking-tight mb-4">
            How a question becomes care
          </h2>
          <p className="text-muted max-w-xl">
            From a whispered symptom to a scheduled visit — every step designed for low literacy and low bandwidth.
          </p>
        </Reveal>

        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Care workflow steps">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-pill transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                active === tab.id
                  ? 'bg-ink text-white shadow-soft'
                  : 'bg-paper text-muted border border-line hover:text-ink hover:border-ink/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: 16 }}
                transition={{ duration: 0.35 }}
              >
                <div className="w-12 h-12 rounded-button bg-teal/10 flex items-center justify-center text-teal mb-6">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl text-ink mb-4">{current.title}</h3>
                <p className="text-muted leading-relaxed text-lg">{current.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <Reveal delay={0.1}>
            <PhoneMockup label={current.mockLabel} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
