import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header className={`sticky top-0 z-50 bg-canvas/95 backdrop-blur-md transition-shadow ${scrolled ? 'border-b border-border shadow-soft' : ''}`}>
        <nav className="cedar-section h-14 flex items-center justify-between" aria-label="Main">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[15px] font-bold text-black tracking-tight">
            ASHA AI
          </button>

          <div className="hidden md:flex items-center gap-6">
            <button type="button" onClick={() => navigate('/role-select')} className="text-caption text-muted hover:text-brand transition-colors">Sign in</button>
            <button type="button" onClick={() => navigate('/role-select')} className="btn-brand h-9 px-4 text-caption">Get started</button>
          </div>

          <button type="button" className="md:hidden p-2 text-ink" onClick={() => setOpen(true)} aria-label="Menu"><Menu className="w-5 h-5" /></button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-ink/5 backdrop-blur-sm z-50 md:hidden" onClick={() => setOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 320 }} className="fixed top-0 right-0 bottom-0 w-[min(100%,300px)] bg-canvas border-l border-border z-50 p-6 flex flex-col md:hidden">
              <div className="flex justify-between mb-10">
                <span className="font-bold text-black">ASHA AI</span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close"><X className="w-5 h-5" /></button>
              </div>
              <div className="mt-auto space-y-3">
                <button type="button" onClick={() => { setOpen(false); navigate('/role-select'); }} className="btn-ghost w-full">Sign in</button>
                <button type="button" onClick={() => { setOpen(false); navigate('/role-select'); }} className="btn-brand w-full">Get started</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
