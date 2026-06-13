import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flower2 } from 'lucide-react';
import { Reveal } from './Reveal';

export function TaglineBand() {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-28 bg-canvas border-t border-border">
      <div className="cedar-section text-center">
        <Reveal>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-canvas border border-border mb-6">
            <Flower2 className="w-5 h-5 text-brand-magenta" />
          </div>
          <h2 className="saas-display max-w-3xl mx-auto mb-4">
            Dignified care for every girl. Every mother. Every village.
          </h2>
          <p className="saas-lead max-w-lg mx-auto mb-8">
            ASHA AI is the voice-first maternal health platform built for rural India. Private. Warm. Always in her language.
          </p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/role-select')}
            className="btn-brand h-11 px-7 gap-2 text-[15px]"
          >
            Start with ASHA AI
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Reveal>
      </div>
    </section>
  );
}
