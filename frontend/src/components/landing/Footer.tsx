import { useNavigate } from 'react-router-dom';
import { Flower2 } from 'lucide-react';

export function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-canvas border-t border-border" role="contentinfo">
      <div className="cedar-section py-10 flex flex-col sm:flex-row justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-canvas border border-border flex items-center justify-center">
            <Flower2 className="w-4 h-4 text-brand" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-ink">ASHA AI</p>
            <p className="text-caption text-muted">Voice first care for rural women</p>
          </div>
        </div>
        <div className="flex gap-6 text-caption">
          <button type="button" onClick={() => navigate('/role-select')} className="text-muted hover:text-brand transition-colors">Sign in</button>
          <a href="mailto:hello@asha-ai.org" className="text-muted hover:text-brand transition-colors">Contact</a>
        </div>
      </div>
      <div className="cedar-section pb-6 text-[12px] text-faint">© 2026 ASHA AI</div>
    </footer>
  );
}
