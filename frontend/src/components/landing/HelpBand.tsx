import { Calendar, MessageCircle, Phone } from 'lucide-react';
import { Reveal } from './Reveal';

const COLUMNS = [
  {
    icon: Calendar,
    title: 'See ASHA AI in action',
    desc: 'Book a 30-minute walkthrough with our team.',
    cta: 'Book a demo',
    href: 'mailto:hello@asha-ai.org?subject=Demo%20request',
  },
  {
    icon: MessageCircle,
    title: 'Talk to the team',
    desc: 'Questions about pilots, languages, or privacy.',
    cta: 'Chat with us',
    href: 'mailto:hello@asha-ai.org',
  },
  {
    icon: Phone,
    title: 'Call the helpline',
    desc: 'Mon–Sat, 9am–6pm IST. Hindi & English.',
    cta: '1800-ASHA-AI',
    href: 'tel:1800274224',
  },
];

export function HelpBand() {
  return (
    <section id="help" className="py-16 mx-4 sm:mx-6 lg:mx-8" aria-labelledby="help-heading">
      <Reveal>
        <div className="max-w-7xl mx-auto rounded-card bg-teal px-6 sm:px-10 lg:px-14 py-12 lg:py-14">
          <h2 id="help-heading" className="sr-only">
            We&apos;re here to help
          </h2>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {COLUMNS.map((col) => {
              const Icon = col.icon;
              return (
                <div key={col.title} className="text-center md:text-left">
                  <div className="w-11 h-11 rounded-button bg-white/15 flex items-center justify-center text-white mb-4 mx-auto md:mx-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2">{col.title}</h3>
                  <p className="text-sm text-white/75 mb-5 leading-relaxed">{col.desc}</p>
                  <a
                    href={col.href}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-teal bg-white hover:bg-paper rounded-button transition-transform hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal"
                  >
                    {col.cta}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
