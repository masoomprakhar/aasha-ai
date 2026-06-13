import { useEffect, useState } from 'react';
import { Mic } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const BAR_COUNT = 28;
const STATIC_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => 8 + ((i * 7) % 18));

const USER_MSG = 'मुझे पेट में बहुत दर्द है';
const REPLY_MSG =
  'आपको पेट में दर्द कब से है? अगर बहुत तेज़ है तो Red Zone बटन दबाएं — मैं आशा दीदी को बता दूँगी।';

export function VoiceAgentOrb() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<'user' | 'reply' | 'idle'>('idle');

  useEffect(() => {
    if (reduceMotion) return;
    const timers = [
      setTimeout(() => setPhase('user'), 1200),
      setTimeout(() => setPhase('reply'), 3800),
      setTimeout(() => setPhase('idle'), 7200),
    ];
    const loop = setInterval(() => {
      setPhase('idle');
      setTimeout(() => setPhase('user'), 400);
      setTimeout(() => setPhase('reply'), 2600);
      setTimeout(() => setPhase('idle'), 6000);
    }, 9000);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, [reduceMotion]);

  return (
    <div
      className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
      aria-label="ASHA Didi voice assistant preview"
      role="img"
    >
      <div className="absolute inset-0 rounded-card bg-teal/20 blur-3xl scale-90 pointer-events-none" />

      <div className="relative rounded-card bg-ink p-6 sm:p-8 shadow-soft overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {!reduceMotion && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terra opacity-60" />
              )}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-terra" />
            </span>
            <span className="text-xs font-mono text-white/60 uppercase tracking-wider">Listening</span>
          </div>
          <span className="rounded-pill bg-white/10 px-2.5 py-1 text-[10px] font-mono text-white/70">
            hi · auto-detect
          </span>
        </div>

        {/* Orb + rings */}
        <div className="relative flex flex-col items-center py-4">
          <div className="relative flex items-center justify-center w-28 h-28 mb-6">
            {!reduceMotion &&
              [0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute inset-0 rounded-full border border-terra/40"
                  initial={{ scale: 1, opacity: 0.55 }}
                  animate={{ scale: 1.7, opacity: 0 }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: 'easeOut',
                  }}
                />
              ))}
            <div className="relative z-10 w-16 h-16 rounded-full bg-terra flex items-center justify-center shadow-lg shadow-terra/30">
              <Mic className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
          </div>

          {/* Equalizer */}
          <div className="flex items-end justify-center gap-[3px] h-8 w-full max-w-[220px] mb-2" aria-hidden="true">
            {Array.from({ length: BAR_COUNT }).map((_, i) =>
              reduceMotion ? (
                <div
                  key={i}
                  className="w-[4px] rounded-full bg-teal/70"
                  style={{ height: STATIC_HEIGHTS[i] }}
                />
              ) : (
                <motion.div
                  key={i}
                  className="w-[4px] rounded-full bg-teal"
                  animate={{ height: [6, 10 + (i % 5) * 4, 26, 8 + (i % 3) * 3, 6] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.06,
                    ease: 'easeInOut',
                  }}
                  style={{ height: 6 }}
                />
              )
            )}
          </div>
          <p className="text-sm font-serif text-white/90 mt-2">ASHA Didi</p>
        </div>

        {/* Chat bubbles */}
        <div className="space-y-3 min-h-[140px]">
          <AnimatePresence mode="wait">
            {(phase === 'user' || phase === 'reply') && (
              <motion.div
                key="user-bubble"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                className="rounded-card bg-white/10 px-4 py-3 max-w-[90%]"
              >
                <p className="text-sm text-white leading-relaxed">{USER_MSG}</p>
                <p className="text-[11px] font-mono text-white/45 mt-1">Stomach pain — very strong</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {phase === 'reply' && (
              <motion.div
                key="reply-bubble"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-card bg-teal/90 px-4 py-3 max-w-[92%] ml-auto"
              >
                <p className="text-[10px] font-mono text-white/70 mb-1 uppercase tracking-wide">ASHA Didi</p>
                <p className="text-sm text-white leading-relaxed">{REPLY_MSG}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
