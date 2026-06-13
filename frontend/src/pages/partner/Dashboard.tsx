import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Plus, Users, FileText, Baby } from 'lucide-react';
import { RoleLayout } from '../../components/layout/RoleLayout';
import { useTranslation } from '../../hooks/useTranslation';
import { SectionHeader, ImpactMetricsCard, VillageAnalyticsCard } from '../../components/platform';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const { beneficiaries, schemes, children } = useStore();
  const { t } = useTranslation();

  const riskData = [
    { name: 'High Risk', value: beneficiaries.filter((b) => b.riskLevel === 'high').length },
    { name: 'Medium Risk', value: beneficiaries.filter((b) => b.riskLevel === 'medium').length },
    { name: 'Low Risk', value: beneficiaries.filter((b) => b.riskLevel === 'low').length },
  ];
  const RISK_COLORS = ['#EF4444', '#F59E0B', '#10B981'];

  const anemiaData = [
    { name: 'Severe', value: beneficiaries.filter((b) => b.anemiaStatus === 'severe').length },
    { name: 'Moderate', value: beneficiaries.filter((b) => b.anemiaStatus === 'moderate').length },
    { name: 'Mild', value: beneficiaries.filter((b) => b.anemiaStatus === 'mild').length },
    { name: 'Normal', value: beneficiaries.filter((b) => !b.anemiaStatus || b.anemiaStatus === 'normal').length },
  ];
  const ANEMIA_COLORS = ['#b91c1c', '#ea580c', '#facc15', '#10B981'];

  const totalEnrolled = schemes.reduce((acc, s) => acc + (Number(s.enrolledCount) || 0), 0);

  return (
    <RoleLayout role="partner" title={t('partner.dashboard')}>
      <div className="space-y-4">
        <div className="ui-card p-5 sm:p-6 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <p className="ui-eyebrow mb-2">{t('partner.campaigns')}</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-ink mb-2 leading-tight">{t('partner.launch_monitor')}</h2>
            <p className="text-body text-muted mb-4">Launch and monitor maternal health programs across rural districts.</p>
            <button type="button" onClick={() => navigate('/partner/schemes/create')} className="btn-brand gap-2">
              <Plus className="w-5 h-5" /> {t('partner.launch_scheme')}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-wash rounded-full -mr-20 -mt-20 pointer-events-none" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <ImpactMetricsCard label={t('nav.patients')} value={beneficiaries.length} icon={Users} change="+12% this quarter" />
          <ImpactMetricsCard label={t('partner.active_schemes')} value={schemes.filter((s) => s.status === 'active').length} icon={FileText} />
          <ImpactMetricsCard label={t('partner.total_enrolled')} value={totalEnrolled} icon={Users} />
          <ImpactMetricsCard label={t('partner.child_stats')} value={children.length} icon={Baby} />
        </div>

        <SectionHeader title="Coverage" description="Village-level program reach" eyebrow="Geographic insights" compact />
        <div className="grid sm:grid-cols-3 gap-2 sm:gap-3">
          <VillageAnalyticsCard village="Patna District" womenCovered={1240} highRisk={38} coveragePct={78} />
          <VillageAnalyticsCard village="Gaya Block" womenCovered={890} highRisk={22} coveragePct={65} />
          <VillageAnalyticsCard village="Muzaffarpur" womenCovered={1560} highRisk={51} coveragePct={82} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="ui-card p-4 sm:p-5 h-[300px] sm:h-[340px]">
            <h3 className="font-semibold text-base text-ink mb-3">{t('partner.pop_risk')}</h3>
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value" stroke="none">
                  {riskData.map((_, i) => (
                    <Cell key={i} fill={RISK_COLORS[i % RISK_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontFamily: 'Geist, Inter, sans-serif' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-[13px] text-muted flex-wrap">
              {riskData.map((entry, i) => (
                <span key={entry.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RISK_COLORS[i] }} />
                  {entry.name}
                </span>
              ))}
            </div>
          </div>

          <div className="ui-card p-4 sm:p-5 h-[300px] sm:h-[340px]">
            <h3 className="font-semibold text-base text-ink mb-3">{t('partner.anemia_stats')}</h3>
            <ResponsiveContainer width="100%" height="70%">
              <BarChart data={anemiaData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={72} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                  {anemiaData.map((_, i) => (
                    <Cell key={i} fill={ANEMIA_COLORS[i % ANEMIA_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ui-card p-4 sm:p-5">
          <SectionHeader
            compact
            title={t('partner.top_schemes')}
            action={
              <button type="button" onClick={() => navigate('/partner/schemes')} className="text-[13px] font-medium text-brand">
                {t('common.view_all')}
              </button>
            }
          />
          <div className="space-y-3">
            {schemes.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0)).slice(0, 4).map((scheme) => (
              <button
                key={scheme.id}
                type="button"
                onClick={() => navigate(`/partner/schemes/${scheme.id}`)}
                className="flex items-center gap-4 p-4 rounded-card bg-subtle hover:bg-brand-wash/50 transition-colors w-full text-left"
              >
                <img src={scheme.heroImage} alt="" className="w-14 h-14 object-cover rounded-card shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-ink truncate">{scheme.title}</h4>
                  <p className="text-[13px] text-muted line-clamp-1 mt-0.5">{scheme.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-brand text-lg">{scheme.enrolledCount || 0}</p>
                  <p className="text-[11px] text-muted">{t('schemes.enrolled')}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </RoleLayout>
  );
}
