import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronRight, User, Baby, UserPlus, Flower2, RefreshCw, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { beneficiaryService } from '../../services';
import { BeneficiaryProfile } from '../../types';
import { tokenManager } from '../../lib/api';
import { BYPASS_TOKEN } from '../../lib/auth';
import { patientsForAsha } from '../../utils/ashaPatients';

export default function PatientList() {
  const { beneficiaries: storeBeneficiaries, fetchInitialData, currentUser } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [localBeneficiaries, setLocalBeneficiaries] = useState<BeneficiaryProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch beneficiaries on mount and when store is empty
  useEffect(() => {
    const loadBeneficiaries = async () => {
      if (storeBeneficiaries.length > 0) {
        setLocalBeneficiaries(storeBeneficiaries);
        setLoading(false);
        return;
      }

      await fetchInitialData(true);
      const refreshed = useStore.getState().beneficiaries;
      if (refreshed.length > 0) {
        setLocalBeneficiaries(refreshed);
        setLoading(false);
        return;
      }

      if (tokenManager.getAccessToken() === BYPASS_TOKEN) {
        setLocalBeneficiaries(refreshed);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await beneficiaryService.list();
        setLocalBeneficiaries(data);
      } catch (err) {
        console.error('[PatientList] Error loading beneficiaries:', err);
        setError('Failed to load patients. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void loadBeneficiaries();
  }, [storeBeneficiaries, fetchInitialData]);

  // Refresh function
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      if (tokenManager.getAccessToken() === BYPASS_TOKEN) {
        await fetchInitialData(true);
        setLocalBeneficiaries(useStore.getState().beneficiaries);
      } else {
        const data = await beneficiaryService.list();
        setLocalBeneficiaries(data);
        fetchInitialData(true);
      }
    } catch (err) {
      console.error('[PatientList] Refresh error:', err);
      setError('Failed to refresh. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Use local beneficiaries (from API) instead of just store
  const beneficiaries = patientsForAsha(
    localBeneficiaries.length > 0 ? localBeneficiaries : storeBeneficiaries,
    currentUser?.id,
  );

  // Enhanced Filter: Matches Name OR ID (start)
  const filtered = beneficiaries.filter(b => {
    const query = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(query) ||
      b.id.toLowerCase().startsWith(query)
    );
  });

  const getPatientIcon = (type: string) => {
    switch (type) {
      case 'mother': return <Baby size={20} />;
      case 'pregnant': return <UserPlus size={20} />;
      case 'girl': return <Flower2 size={20} />;
      default: return <User size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-white sticky top-0 z-10 border-b shadow-sm">
        <div className="p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="font-bold text-lg text-gray-800 flex-1">
            {t('asha.patients_total')} ({beneficiaries.length})
          </h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Name or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-2" />
            <p className="text-gray-500">Loading patients...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-10">
            <p className="text-red-500 font-medium mb-2">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-brand-dark hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-10">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">
              {beneficiaries.length === 0
                ? 'No patients registered yet.'
                : 'No patients found matching your search.'}
            </p>
            {beneficiaries.length === 0 && (
              <button
                onClick={() => navigate('/asha/scan')}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Scan patient QR code
              </button>
            )}
          </div>
        )}

        {/* Patient List */}
        {!loading && !error && filtered.map(patient => (
          <div
            key={patient.id}
            onClick={() => navigate(`/asha/patient/${patient.id}`)}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-sm ${patient.riskLevel === 'high' ? 'bg-red-500' :
                  patient.riskLevel === 'medium' ? 'bg-orange-500' :
                    'bg-green-500'
                }`}>
                {getPatientIcon(patient.userType)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{patient.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="capitalize">
                    {patient.pregnancyStage ? patient.pregnancyStage.replace('_', ' ') : patient.userType}
                  </span>
                  <span className="text-xs bg-gray-100 px-1.5 rounded text-gray-400">
                    ID: {patient.id.slice(0, 4)}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
