import { MapPin, TrendingUp } from 'lucide-react';

interface VillageAnalyticsCardProps {
  village: string;
  womenCovered: number;
  highRisk: number;
  coveragePct: number;
}

export function VillageAnalyticsCard({ village, womenCovered, highRisk, coveragePct }: VillageAnalyticsCardProps) {
  return (
    <div className="ui-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-brand" />
        <h4 className="text-[15px] font-semibold text-ink">{village}</h4>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xl font-semibold text-ink">{womenCovered}</p>
          <p className="text-[11px] text-muted">Women covered</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-warning">{highRisk}</p>
          <p className="text-[11px] text-muted">High risk</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        <TrendingUp className="w-4 h-4 text-success" />
        <span className="text-[13px] text-muted">{coveragePct}% program coverage</span>
      </div>
    </div>
  );
}
