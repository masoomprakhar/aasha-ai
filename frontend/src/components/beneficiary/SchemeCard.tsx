import { Scheme } from '../../types';
import { ArrowRight, Check } from 'lucide-react';

interface Props {
  scheme: Scheme;
  isEnrolled: boolean;
  onEnroll?: () => void;
}

export default function SchemeCard({ scheme, isEnrolled, onEnroll }: Props) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="h-40 relative">
        <img src={scheme.heroImage} alt={scheme.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <h3 className="text-white font-bold text-lg leading-tight">{scheme.title}</h3>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{scheme.description}</p>
        
        <div className="space-y-2 mb-4">
          {(scheme.benefits || []).slice(0, 2).map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs font-medium text-gray-700">
              <Check className="w-4 h-4 text-green-500 shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          {isEnrolled ? (
            <div className="w-full py-2 bg-green-50 text-green-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Enrolled
            </div>
          ) : (
            <button 
              onClick={onEnroll}
              className="w-full py-2 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
