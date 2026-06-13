import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, Sparkles } from 'lucide-react';

type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface VoiceAssistantWidgetProps {
  compact?: boolean;
  onActivate?: () => void;
}

export function VoiceAssistantWidget({ compact, onActivate }: VoiceAssistantWidgetProps) {
  const [state, setState] = useState<VoiceState>('idle');

  const cycle = () => {
    onActivate?.();
    const order: VoiceState[] = ['listening', 'thinking', 'speaking', 'idle'];
    const idx = order.indexOf(state);
    setState(order[(idx + 1) % order.length]);
  };

  const label = {
    idle: 'Tap to speak with ASHA Didi',
    listening: 'Listening in your language…',
    thinking: 'ASHA Didi is thinking…',
    speaking: 'Playing guidance aloud…',
  }[state];

  if (compact) {
    return (
      <button
        type="button"
        onClick={cycle}
        className="flex items-center gap-3 w-full ui-card p-4 hover:border-brand-ring transition-colors text-left"
      >
        <motion.div
          animate={state === 'listening' ? { scale: [1, 1.08, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="w-11 h-11 rounded-full bg-brand flex items-center justify-center shrink-0"
        >
          <Mic className="w-5 h-5 text-white" />
        </motion.div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-ink">ASHA Didi AI</p>
          <p className="text-[12px] text-muted truncate">{label}</p>
        </div>
      </button>
    );
  }

  return (
    <div className="ui-card overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-border bg-gradient-to-br from-brand-wash/80 to-canvas">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-brand" />
          <p className="ui-eyebrow">Voice-first care</p>
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold text-ink mb-2">ASHA Didi AI</h3>
        <p className="text-[14px] text-muted leading-relaxed max-w-md">
          Ask about periods, pregnancy, nutrition, or danger signs. Private guidance in 11 languages.
        </p>
      </div>
      <div className="p-6 sm:p-8 flex flex-col items-center">
        <motion.button
          type="button"
          onClick={cycle}
          whileTap={{ scale: 0.96 }}
          animate={
            state === 'listening'
              ? { boxShadow: ['0 0 0 0 rgba(67,56,202,0.35)', '0 0 0 14px rgba(67,56,202,0)'] }
              : { boxShadow: '0 4px 14px rgba(67,56,202,0.2)' }
          }
          transition={{ duration: 1.4, repeat: state === 'listening' ? Infinity : 0 }}
          className="w-20 h-20 rounded-full bg-brand flex items-center justify-center mb-6"
        >
          {state === 'speaking' ? (
            <Volume2 className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </motion.button>
        <AnimatePresence mode="wait">
          <motion.p
            key={state}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-[14px] font-medium text-ink mb-4"
          >
            {label}
          </motion.p>
        </AnimatePresence>
        <Waveform active={state === 'listening' || state === 'speaking'} />
      </div>
    </div>
  );
}

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end justify-center gap-[3px] h-8 w-full max-w-[200px]" aria-hidden="true">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-brand/40 origin-bottom"
          animate={{ height: active ? [6, 14 + (i % 4) * 3, 6] : 6 }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}
