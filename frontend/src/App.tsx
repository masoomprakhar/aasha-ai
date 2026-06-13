import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { authService } from './services';
import { ToastContainer } from './components/ui/ToastContainer';
import NetworkStatus from './components/ui/NetworkStatus';
import { useToast } from './store/useToast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const Landing = lazy(() => import('./pages/Landing'));
const RoleSelection = lazy(() => import('./pages/auth/RoleSelection'));
const Login = lazy(() => import('./pages/auth/Login'));
const BeneficiaryDashboard = lazy(() => import('./pages/beneficiary/Dashboard'));
const BeneficiarySchemes = lazy(() => import('./pages/beneficiary/Schemes'));
const BeneficiaryNutrition = lazy(() => import('./pages/beneficiary/Nutrition'));
const BeneficiaryEducation = lazy(() => import('./pages/beneficiary/Education'));
const BeneficiaryCard = lazy(() => import('./pages/beneficiary/DigitalCardPage'));
const CycleTrackerScreen = lazy(() => import('./pages/beneficiary/CycleTracker'));
const AshaDashboard = lazy(() => import('./pages/asha/Dashboard'));
const VisitForm = lazy(() => import('./pages/asha/VisitForm'));
const VisitScheduler = lazy(() => import('./pages/asha/VisitScheduler'));
const QRScanner = lazy(() => import('./pages/asha/QRScanner'));
const PatientProfile = lazy(() => import('./pages/asha/PatientProfile'));
const PatientList = lazy(() => import('./pages/asha/PatientList'));
const AshaAlerts = lazy(() => import('./pages/asha/Alerts'));
const AshaSchemeManagement = lazy(() => import('./pages/asha/SchemeManagement'));
const PartnerDashboard = lazy(() => import('./pages/partner/Dashboard'));
const SchemesList = lazy(() => import('./pages/partner/SchemesList'));
const CreateScheme = lazy(() => import('./pages/partner/CreateScheme'));
const SchemeDetails = lazy(() => import('./pages/partner/SchemeDetails'));

const PUBLIC_PATHS = new Set(['/', '/landing/index.html', '/role-select', '/login']);

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-subtle">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand animate-pulse-soft" />
        <p className="text-[13px] text-muted font-medium">Loading ASHA AI…</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { fetchInitialData, setOnlineStatus, processSyncQueue, currentUser, login, resetSession } = useStore();
  const { addToast } = useToast();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let active = true;

    void authService.initialize()
      .then((user) => {
        if (!active) return;
        if (user) {
          login(user);
        } else {
          resetSession();
        }
        setAuthReady(true);
      })
      .catch(() => {
        if (!active) return;
        resetSession();
        setAuthReady(true);
      });

    return () => {
      active = false;
    };
  }, [login, resetSession]);

  useEffect(() => {
    if (!authReady) return;
    const isPublic = PUBLIC_PATHS.has(location.pathname);
    if (!isPublic && authService.isAuthenticated()) {
      void fetchInitialData();
    }
  }, [location.pathname, fetchInitialData, authReady]);

  useEffect(() => {
    if (!authService.isAuthenticated() || currentUser?.role !== 'asha_worker') return;

    const alertsInterval = setInterval(() => {
      void fetchInitialData(true);
    }, 60000);

    return () => clearInterval(alertsInterval);
  }, [currentUser?.role, fetchInitialData]);

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      processSyncQueue();
      if (authService.isAuthenticated()) void fetchInitialData(true);
      addToast('Back online. Syncing data…', 'success');
    };
    const handleOffline = () => {
      setOnlineStatus(false);
      addToast('You are offline. Changes will sync when reconnected.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addToast, fetchInitialData, processSyncQueue, setOnlineStatus]);

  if (!authReady) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/role-select" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />

        <Route path="/beneficiary" element={<ProtectedRoute roles={['beneficiary']}><BeneficiaryDashboard /></ProtectedRoute>} />
        <Route path="/beneficiary/schemes" element={<ProtectedRoute roles={['beneficiary']}><BeneficiarySchemes /></ProtectedRoute>} />
        <Route path="/beneficiary/nutrition" element={<ProtectedRoute roles={['beneficiary']}><BeneficiaryNutrition /></ProtectedRoute>} />
        <Route path="/beneficiary/education" element={<ProtectedRoute roles={['beneficiary']}><BeneficiaryEducation /></ProtectedRoute>} />
        <Route path="/beneficiary/card" element={<ProtectedRoute roles={['beneficiary']}><BeneficiaryCard /></ProtectedRoute>} />
        <Route path="/beneficiary/tracker" element={<ProtectedRoute roles={['beneficiary']}><CycleTrackerScreen /></ProtectedRoute>} />

        <Route path="/asha" element={<ProtectedRoute roles={['asha_worker']}><AshaDashboard /></ProtectedRoute>} />
        <Route path="/asha/visit" element={<ProtectedRoute roles={['asha_worker']}><VisitForm /></ProtectedRoute>} />
        <Route path="/asha/visit/:id" element={<ProtectedRoute roles={['asha_worker']}><VisitForm /></ProtectedRoute>} />
        <Route path="/asha/scheduler" element={<ProtectedRoute roles={['asha_worker']}><VisitScheduler /></ProtectedRoute>} />
        <Route path="/asha/scan" element={<ProtectedRoute roles={['asha_worker']}><QRScanner /></ProtectedRoute>} />
        <Route path="/asha/patients" element={<ProtectedRoute roles={['asha_worker']}><PatientList /></ProtectedRoute>} />
        <Route path="/asha/alerts" element={<ProtectedRoute roles={['asha_worker']}><AshaAlerts /></ProtectedRoute>} />
        <Route path="/asha/schemes" element={<ProtectedRoute roles={['asha_worker']}><AshaSchemeManagement /></ProtectedRoute>} />
        <Route path="/asha/patient/:id" element={<ProtectedRoute roles={['asha_worker']}><PatientProfile /></ProtectedRoute>} />

        <Route path="/partner" element={<ProtectedRoute roles={['partner']}><PartnerDashboard /></ProtectedRoute>} />
        <Route path="/partner/schemes" element={<ProtectedRoute roles={['partner']}><SchemesList /></ProtectedRoute>} />
        <Route path="/partner/schemes/create" element={<ProtectedRoute roles={['partner']}><CreateScheme /></ProtectedRoute>} />
        <Route path="/partner/schemes/edit/:id" element={<ProtectedRoute roles={['partner']}><CreateScheme /></ProtectedRoute>} />
        <Route path="/partner/schemes/:id" element={<ProtectedRoute roles={['partner']}><SchemeDetails /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <NetworkStatus />
        <ToastContainer />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
