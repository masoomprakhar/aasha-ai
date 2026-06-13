import { Sparkles } from 'lucide-react';

/** ASHA Didi voice agent mark. White surface, pink text only. */
export function VoiceAgentLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const icon = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-2">
      <div className={`${dim} rounded-2xl bg-canvas border border-border flex items-center justify-center`}>
        <Sparkles className={`${icon} text-brand-magenta`} strokeWidth={2} />
      </div>
      <div>
        <p className={`font-semibold text-brand leading-none ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>ASHA Didi</p>
        <p className={`text-muted ${size === 'sm' ? 'text-[10px]' : 'text-[11px]'} font-medium`}>Voice agent</p>
      </div>
    </div>
  );
}
