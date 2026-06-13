import { useEffect, useState, useCallback } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { VoiceAgentLogo } from './VoiceAgentLogo';

interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  sub?: string;
}

const SCRIPT: Omit<ChatMessage, 'id'>[] = [
  { role: 'user', text: 'मेरे पीरियड दो महीने से नहीं आए…', sub: 'My periods are 2 months late' },
  { role: 'agent', text: 'मैं समझती हूँ, बेटा। चिंता मत करो. यहाँ सिर्फ तुम और मैं हैं। क्या तुम्हें कोई दर्द है?' },
  { role: 'user', text: 'हाँ, पेट में हल्का दर्द रहता है', sub: 'Yes, mild stomach ache' },
  { role: 'agent', text: 'ठीक है। मैं कुछ सवाल और पूछूँगी, फिर बताऊँगी क्या करना चाहिए। तुम अकेली नहीं हो।' },
];

type Phase = 'idle' | 'listening' | 'thinking' | 'done';

function Waveform({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex items-center justify-center gap-[2px] h-6" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className={`w-[2px] rounded-full origin-bottom ${active && !reduceMotion ? 'bg-gray-300 animate-wave' : 'bg-gray-200'}`}
          style={{
            height: active && !reduceMotion ? undefined : 4 + (i % 4) * 2,
            animationDelay: `${i * 0.045}s`,
          }}
        />
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5 rounded-2xl rounded-br-md bg-canvas border border-border ml-auto w-fit">
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-300" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-300" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-300" />
    </div>
  );
}

function WomanAvatar({ active }: { active: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className={`w-9 h-9 rounded-full bg-canvas border-2 flex items-center justify-center transition-colors ${active ? 'border-brand' : 'border-border'}`}>
        <svg viewBox="0 0 36 36" className="w-7 h-7" aria-hidden="true">
          <circle cx="18" cy="13" r="6.5" fill="#E5E7EB" />
          <path d="M8 28c2-6 6-9 10-9s8 3 10 9" fill="#D1D5DB" />
          <ellipse cx="18" cy="31" rx="10" ry="7" fill="#F3F4F6" />
        </svg>
      </div>
      {active && (
        <motion.span
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand border-2 border-white"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}
    </div>
  );
}

function GirlAvatarSmall() {
  return (
    <div className="w-6 h-6 rounded-full bg-canvas border border-border shrink-0 mb-0.5 flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <circle cx="12" cy="9" r="4" fill="#E5E7EB" />
        <ellipse cx="12" cy="20" rx="6" ry="5" fill="#F3F4F6" />
      </svg>
    </div>
  );
}

function ChatBubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'user') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 items-end max-w-[90%]"
      >
        <GirlAvatarSmall />
        <div className="rounded-2xl rounded-bl-sm bg-canvas border border-border px-3.5 py-2.5 shadow-soft">
          <p className="text-[13px] text-ink leading-[1.45]">{msg.text}</p>
          {msg.sub && <p className="text-[11px] text-faint mt-1">{msg.sub}</p>}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 items-end justify-end max-w-[90%] ml-auto"
    >
      <div className="rounded-2xl rounded-br-sm bg-canvas border border-border px-3.5 py-2.5 shadow-soft">
        <p className="text-[10px] font-semibold text-brand-magenta mb-0.5">ASHA Didi</p>
        <p className="text-[13px] text-ink leading-[1.45]">{msg.text}</p>
      </div>
      <div className="w-6 h-6 rounded-full bg-canvas border border-border flex items-center justify-center shrink-0 mb-0.5">
        <Volume2 className="w-3 h-3 text-brand" />
      </div>
    </motion.div>
  );
}

export function PhoneVoiceAgent() {
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [scriptIdx, setScriptIdx] = useState(0);

  const reset = useCallback(() => {
    setMessages([]);
    setScriptIdx(0);
    setPhase('idle');
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setMessages(SCRIPT.map((m, i) => ({ ...m, id: String(i) })));
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(() => { if (!cancelled) resolve(); }, ms);
        timers.push(t);
      });

    const run = async () => {
      while (!cancelled) {
        reset();
        await wait(800);

        for (let i = 0; i < SCRIPT.length && !cancelled; i++) {
          const item = SCRIPT[i];
          setScriptIdx(i);

          if (item.role === 'user') {
            setPhase('listening');
            await wait(1600);
            setMessages((prev) => [...prev, { ...item, id: `${i}-u` }]);
            setPhase('done');
            await wait(400);
          } else {
            setPhase('thinking');
            await wait(1200);
            setMessages((prev) => [...prev, { ...item, id: `${i}-a` }]);
            setPhase('done');
            await wait(1800);
          }
        }

        setPhase('idle');
        await wait(2400);
      }
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduceMotion, reset]);

  const isListening = phase === 'listening';

  return (
    <div className="relative flex justify-center" aria-label="Priya speaking with ASHA Didi about her health">
      <motion.div
        className={`relative w-[280px] sm:w-[304px] ${!reduceMotion ? 'animate-phone-float' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="rounded-phone bg-canvas p-[11px] shadow-phone border border-border">
          <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[96px] h-[28px] bg-canvas rounded-full z-10 pointer-events-none border border-border" />

          <div className="rounded-[2rem] bg-canvas overflow-hidden h-[520px] sm:h-[540px] flex flex-col relative border border-border">
            <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-medium text-faint">
              <span>9:41</span>
            </div>

            <div className="px-4 py-3 border-b border-border bg-canvas">
              <VoiceAgentLogo size="sm" />
            </div>

            <div className="px-4 py-2.5 border-b border-border flex items-center gap-3 bg-canvas">
              <WomanAvatar active={isListening} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-ink">Priya, 19</p>
                <p className="text-[12px] text-muted">
                  {isListening ? 'Sharing privately in Hindi' : phase === 'thinking' ? 'ASHA Didi is listening…' : "Women's health session"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3.5 bg-canvas no-scrollbar">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} msg={msg} />
                ))}
              </AnimatePresence>

              {isListening && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-end max-w-[90%]">
                  <GirlAvatarSmall />
                  <div className="rounded-2xl rounded-bl-sm bg-canvas border border-border px-4 py-3 shadow-soft">
                    <Waveform active />
                  </div>
                </motion.div>
              )}

              {phase === 'thinking' && <TypingIndicator />}
            </div>

            <div className="px-4 py-3.5 border-t border-border bg-canvas">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-canvas border border-border flex items-center justify-center shrink-0">
                  <Mic className="w-[18px] h-[18px] text-brand" />
                </div>
                <div className="flex-1 h-10 rounded-full bg-canvas border border-border flex items-center px-4">
                  <p className="text-[12px] text-faint truncate">
                    {isListening ? `${SCRIPT[scriptIdx]?.text?.slice(0, 18)}…` : 'Hold to speak to Didi'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
