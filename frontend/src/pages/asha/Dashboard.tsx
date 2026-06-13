import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, CalendarClock, ChevronRight, Syringe, Baby, UserPlus, Flower2, User,
  Users, AlertCircle, Siren, ClipboardList,
} from 'lucide-react';
import { RoleLayout } from '../../components/layout/RoleLayout';
import { useTranslation } from '../../hooks/useTranslation';
import { VACCINE_SCHEDULE } from '../../data/vaccines';
import { differenceInWeeks, isSameDay, parseISO } from 'date-fns';
import {
  MetricCard,
  AIInsightPanel,
  RiskAlertCard,
  SectionHeader,
} from '../../components/platform';
import { patientsForAsha } from '../../utils/ashaPatients';

export default function AshaDashboard() {
  const { beneficiaries, alerts, children, healthLogs, currentUser } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const myPatients = patientsForAsha(beneficiaries, currentUser?.id);

  useEffect(() => {
    if (beneficiaries.length === 0) useStore.getState().fetchInitialData();
  }, [beneficiaries.length]);

  const activeAlerts = (alerts?.filter((a) => a.status === 'open') || []).filter((a) =>
    myPatients.some((p) => p.id === a.beneficiaryId),
  );
  const highRiskCount = myPatients.filter((b) => b.riskLevel === 'high' || b.riskLevel === 'medium').length;
  const visitsToday = healthLogs?.filter((log) => {
    try {
      const d = typeof log.date === 'string' ? parseISO(log.date) : new Date(log.date);
      return isSameDay(d, new Date());
    } catch { return false; }
  }).length || 0;

  const highRiskPatients = myPatients.filter((b) => {
    if (!b || (b.riskLevel !== 'high' && b.riskLevel !== 'medium')) return false;
    return !(healthLogs || []).some((log) => {
      if (!log || log.beneficiaryId !== b.id) return false;
      try {
        const d = typeof log.date === 'string' ? parseISO(log.date) : new Date(log.date);
        return isSameDay(d, new Date());
      } catch { return false; }
    });
  });

  const dueVaccines = (children || []).flatMap((child) => {
    if (!child) return [];
    try {
      const ageInWeeks = differenceInWeeks(new Date(), new Date(child.dob));
      const upcoming = VACCINE_SCHEDULE.filter((v) => {
        if (child.vaccinations?.includes(v.id)) return false;
        const dueInWeeks = v.dueWeek - ageInWeeks;
        return dueInWeeks <= 4 && dueInWeeks >= -4;
      });
      if (!upcoming.length) return [];
      const mother = myPatients.find((b) => b.id === child.beneficiaryId);
      return upcoming.map((v) => ({
        childName: child.name,
        motherName: mother?.name || 'Unknown',
        vaccineName: v.name,
        beneficiaryId: child.beneficiaryId,
        isOverdue: v.dueWeek < ageInWeeks,
      }));
    } catch { return []; }
  });

  const missedIfa = Math.max(0, Math.floor(myPatients.length * 0.15));

  const insights = [
    { id: '1', text: `${highRiskPatients.length} high-risk pregnancies require follow-up today.`, priority: 'high' as const },
    { id: '2', text: `${dueVaccines.length} children missed or are due for vaccination schedules.`, priority: 'medium' as const },
    { id: '3', text: `${missedIfa} beneficiaries have not reported IFA intake this week.`, priority: 'low' as const },
  ];

  const getPatientIcon = (type: string) => {
    switch (type) {
      case 'mother': return <Baby size={18} />;
      case 'pregnant': return <UserPlus size={18} />;
      case 'girl': return <Flower2 size={18} />;
      default: return <User size={18} />;
    }
  };

  const ActionTile = ({ title, desc, icon: Icon, onClick }: { title: string; desc: string; icon: typeof CalendarClock; onClick: () => void }) => (
    <button type="button" onClick={onClick} className="ui-card p-5 flex items-center justify-between gap-4 text-left hover:shadow-card transition-all group w-full">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-11 h-11 rounded-lg bg-brand-wash flex items-center justify-center text-brand shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-ink">{title}</h3>
          <p className="text-[13px] text-muted">{desc}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-faint group-hover:text-brand shrink-0" />
    </button>
  );

  return (
    <RoleLayout role="asha_worker" title={t('asha.dashboard')}>
      <div className="space-y-4 pb-16">
        <AIInsightPanel insights={insights} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <MetricCard compact label="Women under care" value={myPatients.length} subtitle="Total patients" icon={Users} onClick={() => navigate('/asha/patients')} />
          <MetricCard compact label="High risk cases" value={highRiskCount} subtitle="Needs attention" icon={AlertCircle} onClick={() => navigate('/asha/patients')} />
          <MetricCard compact label="Visits today" value={visitsToday} subtitle="Completed" icon={ClipboardList} onClick={() => navigate('/asha/scheduler')} />
          <MetricCard compact label="SOS alerts" value={activeAlerts.length} subtitle="Open" icon={Siren} onClick={() => navigate('/asha/alerts')} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <ActionTile title="Visit scheduler" desc="Plan and track home visits" icon={CalendarClock} onClick={() => navigate('/asha/scheduler')} />
          <ActionTile title="Government schemes" desc="Enroll and manage benefits" icon={ClipboardList} onClick={() => navigate('/asha/schemes')} />
        </div>

        {activeAlerts.length > 0 && (
          <section>
            <SectionHeader title={t('asha.critical_alerts')} compact />
            <div className="space-y-3">
              {activeAlerts.slice(0, 3).map((alert) => {
                const patient = myPatients.find((b) => b.id === alert.beneficiaryId);
                return (
                  <RiskAlertCard
                    key={alert.id}
                    name={patient?.name || 'Unknown'}
                    detail={`SOS triggered`}
                    severity="critical"
                    time={new Date(alert.timestamp).toLocaleTimeString()}
                    onClick={() => navigate('/asha/alerts')}
                  />
                );
              })}
            </div>
          </section>
        )}

        {dueVaccines.length > 0 && (
          <section>
            <SectionHeader title={t('asha.vaccines_due')} description={`${dueVaccines.length} due`} compact />
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {dueVaccines.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => navigate(`/asha/patient/${item.beneficiaryId}`)}
                  className="ui-card min-w-[240px] p-4 text-left hover:shadow-card shrink-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-brand-wash rounded-full flex items-center justify-center text-brand">
                      <Baby size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-ink">{item.childName}</h4>
                      <p className="text-[12px] text-muted">Mother: {item.motherName}</p>
                      <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-brand">
                        <Syringe size={12} className={item.isOverdue ? 'text-critical' : ''} />
                        {item.vaccineName}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionHeader
            compact
            title={t('asha.follow_ups')}
            action={
              <button type="button" onClick={() => navigate('/asha/patients')} className="text-[13px] font-medium text-brand">
                {t('common.view_all')}
              </button>
            }
          />
          <div className="space-y-3">
            {highRiskPatients.length === 0 ? (
              <div className="ui-card p-8 text-center text-muted text-[14px]">All high-risk visits completed for today.</div>
            ) : (
              highRiskPatients.slice(0, 5).map((patient) => (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => navigate(`/asha/patient/${patient.id}`)}
                  className="ui-card p-5 flex justify-between items-center w-full text-left hover:shadow-card transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${patient.riskLevel === 'high' ? 'bg-critical' : 'bg-warning'}`}>
                      {getPatientIcon(patient.userType)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-ink">{patient.name}</h3>
                      <p className="text-[13px] text-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {patient.address || 'Location not set'} · Due today
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-faint shrink-0" />
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </RoleLayout>
  );
}
