import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { Reveal } from './Reveal';
import { FeaturesAnimation } from './FeaturesAnimation';
import { AshaNetworkBanner } from './AshaNetworkBanner';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-canvas border-b border-border" aria-labelledby="hero-heading">
      <div className="w-full max-w-[1440px] mx-auto lg:grid lg:grid-cols-2 lg:items-center">
        <Reveal className="order-2 lg:order-1 flex items-center justify-center lg:justify-end px-5 sm:px-8 lg:pl-12 xl:pl-16 lg:pr-10 xl:pr-14 py-14 sm:py-16 lg:py-20">
          <div className="w-full max-w-xl">
            <p className="ui-eyebrow mb-5">Built for her</p>

            <h1 id="hero-heading" className="saas-display text-ink mb-5">
              Ask anything. Speak freely. Stay private.
            </h1>

            <p className="saas-lead mb-8 max-w-md">
              ASHA Didi is your voice health companion for periods, pregnancy, nutrition, and government schemes. In Hindi, Tamil, Bhojpuri, and 8 more languages.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => navigate('/role-select')} className="btn-brand h-11 px-6">
                Get started free
              </button>
              <button type="button" onClick={() => navigate('/role-select?role=beneficiary')} className="btn-ghost h-11 px-6 gap-2 text-brand">
                <Mic className="w-4 h-4" strokeWidth={1.75} />
                Try ASHA Didi
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <p className="mt-8 text-caption text-faint">
              Trusted by women across Bihar, Uttar Pradesh, Maharashtra, and Tamil Nadu
            </p>
          </div>
        </Reveal>

        <Reveal
          delay={0.08}
          className="order-1 lg:order-2 flex justify-center lg:justify-start px-5 sm:px-8 lg:pl-4 xl:pl-6 lg:pr-12 xl:pr-16 pb-14 sm:pb-16 lg:pb-20 lg:pt-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[560px] lg:max-w-none mt-8 lg:mt-12 ui-card p-2 sm:p-2.5 shadow-card overflow-hidden"
          >
            <div className="relative w-full aspect-[5/3] sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden rounded-[10px]">
              <img
                src="/images/hero-asha-workers.png"
                alt="ASHA health worker with stethoscope and community women in rural India"
                className="absolute inset-0 h-full w-full object-cover object-[44%_36%] sm:object-[42%_34%] lg:object-[40%_32%]"
                width={1024}
                height={682}
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </Reveal>
      </div>

      <FeaturesAnimation />
      <AshaNetworkBanner />
    </section>
  );
}
