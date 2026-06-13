import { useStore } from '../../store/useStore';
import type { Language } from '../../types';

export function TopBar() {
  const { language, setLanguage } = useStore();

  const toggleLang = () => {
    const next: Language = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
  };

  return (
    <div
      className="h-8 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-paper border-b border-line text-xs font-mono text-muted"
      role="banner"
      aria-label="Utility bar"
    >
      <span className="inline-flex items-center gap-2">
        <span className="hidden sm:inline rounded-pill bg-panel px-2.5 py-0.5 text-[10px] tracking-wide uppercase">
          Built for social good · 11 Indian languages
        </span>
        <span className="sm:hidden text-[10px] tracking-wide uppercase">Social good · 11 languages</span>
      </span>
      <div className="flex items-center gap-4">
        <a
          href="tel:1800274224"
          className="hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
        >
          1800-ASHA-AI
        </a>
        <button
          type="button"
          onClick={toggleLang}
          className="uppercase tracking-wider hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
          aria-label="Toggle language"
        >
          {language === 'en' ? 'EN / हिंदी' : 'हिंदी / EN'}
        </button>
      </div>
    </div>
  );
}
