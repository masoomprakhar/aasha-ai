import { motion, useReducedMotion } from 'framer-motion';
import { Mic, Sparkles, Waves, Database, HeartHandshake, Check } from 'lucide-react';
import { VoiceAgentLogo } from './VoiceAgentLogo';

const STEPS = [
  { icon: Mic, label: 'She speaks', sub: 'Voice in her language' },
  { icon: Sparkles, label: 'ASHA Didi listens', sub: 'Private and warm' },
  { icon: Waves, label: 'AI understands', sub: 'Health context' },
  { icon: Database, label: 'Data syncs', sub: 'Clean records' },
  { icon: HeartHandshake, label: 'Care delivered', sub: 'ASHA alerted if needed' },
];

function StepNode({ icon: Icon, label, sub, index }: (typeof STEPS)[0] & { index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
      <motion.div
        className="relative flex flex-col items-center"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-canvas border border-border shadow-soft flex items-center justify-center">
          <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-brand" strokeWidth={1.75} />
        </div>
        <p className="mt-2 text-[11px] sm:text-xs font-semibold text-brand whitespace-nowrap">{label}</p>
        <p className="text-[10px] text-muted whitespace-nowrap hidden sm:block">{sub}</p>
      </motion.div>
      {index < STEPS.length - 1 && (
        <div className="relative w-10 sm:w-16 h-px bg-border shrink-0">
          {!reduceMotion && (
            <motion.span
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand"
              animate={{ left: ['0%', '100%'], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.35, ease: 'easeInOut' }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function VoiceAgentStrip() {
  const reduceMotion = useReducedMotion();
  const track = [...STEPS, ...STEPS];

  return (
    <div className="pb-12 lg:pb-16" aria-label="Voice agent sync pipeline">
      <div className="relative rounded-2xl border border-border bg-canvas overflow-hidden shadow-soft">
        <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 border-b border-border">
          <VoiceAgentLogo size="sm" />
          <motion.div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-canvas border border-border shrink-0"
            animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-[10px] font-medium text-brand-magenta">Syncing</span>
          </motion.div>
        </div>

        <div className="px-4 sm:px-6 py-5 sm:py-6 overflow-hidden">
          {reduceMotion ? (
            <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
              {STEPS.map((step, i) => (
                <StepNode key={step.label} {...step} index={i} />
              ))}
            </div>
          ) : (
            <div className="hidden md:flex items-center justify-center gap-0">
              {STEPS.map((step, i) => (
                <StepNode key={step.label} {...step} index={i} />
              ))}
            </div>
          )}

          {!reduceMotion && (
            <div className="md:hidden flex w-max animate-marquee gap-6 pr-6">
              {track.map((step, i) => (
                <div key={`${step.label}-${i}`} className="flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-canvas border border-border flex items-center justify-center">
                    <step.icon className="w-4 h-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand">{step.label}</p>
                    <p className="text-[10px] text-muted">{step.sub}</p>
                  </div>
                  <Check className="w-3.5 h-3.5 text-faint" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 pb-4">
          <div className="h-1 rounded-pill bg-gray-100 overflow-hidden">
            {!reduceMotion && (
              <motion.div
                className="h-full w-1/3 rounded-pill bg-gray-300"
                animate={{ x: ['-100%', '300%'] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
