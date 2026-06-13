import { useStore } from '../../store/useStore';
import SOSButton from '../../components/SOSButton';
import {
  Gift, Apple, BookOpen, QrCode, Calendar, AlertCircle,
  Baby, Syringe, Heart, Pill, Stethoscope, MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateCycleInsights } from '../../utils/healthCalculators';
import { useState, useEffect } from 'react';
import { RoleLayout } from '../../components/layout/RoleLayout';
import { format, addDays } from 'date-fns';
import { useTranslation } from '../../hooks/useTranslation';
import {
  HealthStatusCard,
  VoiceAssistantWidget,
  GovernmentBenefitCard,
  PregnancyTimeline,
  SectionHeader,
} from '../../components/platform';

export default function BeneficiaryDashboard() {
  const { currentUser, beneficiaries, ensureBeneficiaryProfile, children, enrollments, schemes } = useStore();
  const navigate = useNavigate();
  const [ifaTaken, setIfaTaken] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (currentUser?.role === 'beneficiary') {
      const exists = beneficiaries.find((b) => b.userId === currentUser.id);
      if (!exists) ensureBeneficiaryProfile(currentUser.id, currentUser.name);
    }
  }, [currentUser, beneficiaries, ensureBeneficiaryProfile]);

  const profile = beneficiaries.find((b) => b.userId === currentUser?.id);
  if (!profile && currentUser) return <div className="py-6 text-center text-muted">{t('common.loading')}</div>;
  if (!profile) return null;

  const insights = profile.lastPeriodDate ? calculateCycleInsights(profile.lastPeriodDate) : null;
  const isProfileIncomplete = !profile.weight || !profile.height || !profile.bloodGroup;
  const myChildren = children.filter((c) => c.beneficiaryId === profile.id);
  const myEnrollments = enrollments
    .filter((e) => e.beneficiaryId === profile.id && e.status === 'active')
    .map((e) => schemes.find((s) => s.id === e.schemeId))
    .filter(Boolean);

  const journeySteps = [
    { id: '1', title: 'Profile', done: true },
    { id: '2', title: 'Voice session', done: !!insights },
    { id: '3', title: 'Health card', done: !isProfileIncomplete },
    { id: '4', title: 'ASHA visit', done: !!profile.linkedAshaId },
  ];

  const statusProps = () => {
    if (!insights) {
      return { eyebrow: 'Get started', title: t('dash.setup'), subtitle: t('dash.setup_desc'), icon: Calendar, accent: 'brand' as const };
    }
    if (profile.userType === 'girl') {
      return { eyebrow: 'Cycle', title: `${insights.daysToNextPeriod} days`, subtitle: `Next period ${insights.nextPeriod}`, icon: Heart, accent: 'brand' as const };
    }
    if (profile.userType === 'pregnant') {
      return { eyebrow: 'Pregnancy', title: `Week ${insights.pregnancyWeek}`, subtitle: `Due ${insights.edd}`, icon: Baby, accent: 'brand' as const };
    }
    const nextVaccine = format(addDays(new Date(), 14), 'dd MMM');
    return { eyebrow: 'Child health', title: 'Vaccine due', subtitle: `Polio dose 2 on ${nextVaccine}`, icon: Syringe, accent: 'warning' as const };
  };

  const quickLinks = [
    { title: t('menu.benefits'), icon: Gift, path: '/beneficiary/schemes' },
    { title: t('menu.nutrition'), icon: Apple, path: '/beneficiary/nutrition' },
    { title: t('menu.education'), icon: BookOpen, path: '/beneficiary/education' },
    { title: t('menu.card'), icon: QrCode, path: '/beneficiary/card' },
  ];

  return (
    <RoleLayout role="beneficiary" title={`${t('dash.welcome')}, ${profile.name.split(' ')[0]}`}>
      <div className="space-y-4 pb-16">
        {isProfileIncomplete && (
          <button
            type="button"
            onClick={() => navigate('/beneficiary/card')}
            className="w-full ui-card border-l-4 border-l-brand p-3 flex items-center gap-3 text-left hover:shadow-card transition-all"
          >
            <AlertCircle className="w-5 h-5 text-brand shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-ink">{t('dash.complete_profile')}</h3>
              <p className="text-caption text-muted">{t('dash.complete_profile_desc')}</p>
            </div>
            <span className="text-[11px] font-medium text-brand bg-brand-wash px-2.5 py-1 rounded-pill shrink-0">{t('dash.update')}</span>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <HealthStatusCard compact {...statusProps()} onClick={() => navigate('/beneficiary/tracker')} />
          <VoiceAssistantWidget compact />
        </div>

        {profile.userType === 'pregnant' && insights && (
          <PregnancyTimeline week={insights.pregnancyWeek} edd={insights.edd} compact />
        )}

        <section>
          <SectionHeader title="Quick access" compact />
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => navigate(link.path)}
                className="ui-card p-3 flex items-center gap-2.5 text-left hover:shadow-card transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-wash flex items-center justify-center text-brand shrink-0">
                  <link.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-ink">{link.title}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <div className="ui-card p-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] text-muted">{t('dash.ifa')}</p>
              <p className="text-caption text-muted truncate">{t('dash.ifa_desc')}</p>
            </div>
            <button
              type="button"
              onClick={() => setIfaTaken(!ifaTaken)}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${ifaTaken ? 'bg-brand text-white' : 'bg-subtle text-faint border border-border'}`}
            >
              <Pill className="w-4 h-4" />
            </button>
          </div>
          <div className="ui-card p-3">
            <div className="flex items-center gap-1.5 mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-brand" />
              <p className="text-[11px] text-muted">ASHA visit</p>
            </div>
            <p className="text-sm font-semibold text-ink">{profile.nextCheckupDate || 'Not scheduled'}</p>
          </div>
        </div>

        <div className="ui-card p-3">
          <p className="text-[11px] font-medium text-muted mb-2">Your journey</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {journeySteps.map((step) => (
              <div
                key={step.id}
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-pill text-caption font-medium ${step.done ? 'bg-brand-wash text-brand' : 'bg-subtle text-muted'}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${step.done ? 'bg-brand' : 'bg-border'}`} />
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {myEnrollments.length > 0 && (
          <section>
            <SectionHeader title="Government benefits" compact />
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {myEnrollments.slice(0, 4).map((scheme: any) => (
                <GovernmentBenefitCard
                  key={scheme.id}
                  compact
                  title={scheme.title}
                  description={scheme.provider}
                  status="Active"
                  image={scheme.heroImage}
                  onClick={() => navigate('/beneficiary/schemes')}
                />
              ))}
            </div>
          </section>
        )}

        {profile.userType === 'mother' && myChildren.length > 0 && (
          <div className="ui-card p-3">
            <p className="text-[11px] font-medium text-muted mb-2">My children</p>
            <div className="flex gap-2">
              {myChildren.map((child) => (
                <div key={child.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-card bg-subtle">
                  <span className="text-base">{child.gender === 'female' ? '👧' : '👦'}</span>
                  <span className="text-sm font-medium text-ink">{child.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.currentMedications && (
          <div className="ui-card p-3 flex items-start gap-2.5">
            <Stethoscope className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-ink">Medications</h3>
              <p className="text-caption text-muted">{profile.currentMedications}</p>
            </div>
          </div>
        )}

        <div className="ui-card p-3">
          <p className="text-sm font-semibold text-ink mb-2 text-center">{t('dash.emergency')}</p>
          <SOSButton beneficiaryId={profile.id} />
        </div>
      </div>
    </RoleLayout>
  );
}
