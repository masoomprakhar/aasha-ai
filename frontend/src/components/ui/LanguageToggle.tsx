import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Language } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'bho', label: 'Bhojpuri', native: 'भोजपुरी' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export function LanguageToggle() {
  const { language, setLanguage } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 h-10 rounded-full bg-panel hover:bg-[#e2e2e0] transition-colors flex items-center gap-2"
        aria-label="Change Language"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-xs font-semibold text-gray-700 uppercase">
          {language}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-12 z-50 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div className="p-2 space-y-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${
                      language === lang.code
                        ? 'bg-brand-wash text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm">{lang.native}</p>
                      <p className="text-xs opacity-60">{lang.label}</p>
                    </div>
                    {language === lang.code && <Check size={16} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
