import { User, BeneficiaryProfile, Alert, Scheme, Enrollment, Child, HealthLog } from '../types';

// ── 10 ASHA workers ──────────────────────────────────────────
// Real demo ASHA worker (asha.demo@asha.ai)
export const DEMO_ASHA_WORKER_ID = '78b859a3-0946-4e8d-9186-8c9aade28ac7';

const ASHA_WORKERS: User[] = [
  { id: DEMO_ASHA_WORKER_ID, name: 'Sunita Demo', role: 'asha_worker' },
  { id: 'a02', name: 'Meena Kumari', role: 'asha_worker' },
  { id: 'a03', name: 'Rekha Sharma', role: 'asha_worker' },
  { id: 'a04', name: 'Kamala Devi', role: 'asha_worker' },
  { id: 'a05', name: 'Geeta Singh', role: 'asha_worker' },
  { id: 'a06', name: 'Lakshmi Yadav', role: 'asha_worker' },
  { id: 'a07', name: 'Padmini Rai', role: 'asha_worker' },
  { id: 'a08', name: 'Savitri Devi', role: 'asha_worker' },
  { id: 'a09', name: 'Usha Pandey', role: 'asha_worker' },
  { id: 'a10', name: 'Vimla Sharma', role: 'asha_worker' },
];

// ── 10 NGO partners ──────────────────────────────────────────
const NGO_PARTNERS: User[] = [
  { id: 'p01', name: 'Jan Vikas Foundation', role: 'partner' },
  { id: 'p02', name: 'Rural Health Collective', role: 'partner' },
  { id: 'p03', name: 'Maa Shakti NGO', role: 'partner' },
  { id: 'p04', name: 'Akshaya Health Trust', role: 'partner' },
  { id: 'p05', name: 'Gramin Kalyan Sanstha', role: 'partner' },
  { id: 'p06', name: 'Seva Bharati Mission', role: 'partner' },
  { id: 'p07', name: 'Nari Shakti Foundation', role: 'partner' },
  { id: 'p08', name: 'Bal Vikas Trust', role: 'partner' },
  { id: 'p09', name: 'Swasthya Setu NGO', role: 'partner' },
  { id: 'p10', name: 'Arogya Mitra Collective', role: 'partner' },
];

// ── 10 adolescent girls (beneficiaries) ─────────────────────
const GIRL_USERS: User[] = [
  { id: 'g01', name: 'Priya Sharma', role: 'beneficiary' },
  { id: 'g02', name: 'Ananya Singh', role: 'beneficiary' },
  { id: 'g03', name: 'Kavya Patel', role: 'beneficiary' },
  { id: 'g04', name: 'Riya Verma', role: 'beneficiary' },
  { id: 'g05', name: 'Sneha Kumari', role: 'beneficiary' },
  { id: 'g06', name: 'Divya Yadav', role: 'beneficiary' },
  { id: 'g07', name: 'Pooja Devi', role: 'beneficiary' },
  { id: 'g08', name: 'Neha Rai', role: 'beneficiary' },
  { id: 'g09', name: 'Ishita Mishra', role: 'beneficiary' },
  { id: 'g10', name: 'Tanvi Pandey', role: 'beneficiary' },
];

export const MOCK_USERS: User[] = [...GIRL_USERS, ...ASHA_WORKERS, ...NGO_PARTNERS];

export const DEMO_USER_BY_ROLE: Record<User['role'], User> = {
  beneficiary: GIRL_USERS[0],
  asha_worker: ASHA_WORKERS[0],
  partner: NGO_PARTNERS[0],
};

export const MOCK_BENEFICIARIES: BeneficiaryProfile[] = [
  { id: 'b01', userId: 'g01', name: 'Priya Sharma', userType: 'girl', age: 17, height: 155, weight: 48, bloodGroup: 'B+', lastPeriodDate: '2025-05-02', anemiaStatus: 'mild', riskLevel: 'low', linkedAshaId: DEMO_ASHA_WORKER_ID, nextCheckup: '2025-06-20', economicStatus: 'bpl', address: 'Village Rampur, Block Hajipur, Bihar' },
  { id: 'b02', userId: 'g02', name: 'Ananya Singh', userType: 'girl', age: 16, height: 152, weight: 45, bloodGroup: 'O+', lastPeriodDate: '2025-04-18', anemiaStatus: 'moderate', riskLevel: 'medium', linkedAshaId: DEMO_ASHA_WORKER_ID, nextCheckup: '2025-06-18', economicStatus: 'bpl', address: 'Village Chakia, East Champaran, Bihar' },
  { id: 'b03', userId: 'g03', name: 'Kavya Patel', userType: 'girl', age: 18, height: 158, weight: 50, bloodGroup: 'A+', lastPeriodDate: '2025-05-10', anemiaStatus: 'normal', riskLevel: 'low', linkedAshaId: 'a02', nextCheckup: '2025-06-22', economicStatus: 'apl', address: 'Village Barabanki, Uttar Pradesh' },
  { id: 'b04', userId: 'g04', name: 'Riya Verma', userType: 'girl', age: 15, height: 150, weight: 42, bloodGroup: 'AB+', lastPeriodDate: '2025-03-28', anemiaStatus: 'mild', riskLevel: 'medium', linkedAshaId: DEMO_ASHA_WORKER_ID, nextCheckup: '2025-06-15', economicStatus: 'bpl', address: 'Village Sitapur, Uttar Pradesh' },
  { id: 'b05', userId: 'g05', name: 'Sneha Kumari', userType: 'girl', age: 19, height: 160, weight: 52, bloodGroup: 'B-', lastPeriodDate: '2025-05-15', anemiaStatus: 'normal', riskLevel: 'low', linkedAshaId: 'a03', nextCheckup: '2025-06-25', economicStatus: 'apl', address: 'Village Gaya, Bihar' },
  { id: 'b06', userId: 'g06', name: 'Divya Yadav', userType: 'girl', age: 16, height: 153, weight: 46, bloodGroup: 'O-', lastPeriodDate: '2025-04-05', anemiaStatus: 'severe', riskLevel: 'high', linkedAshaId: DEMO_ASHA_WORKER_ID, nextCheckup: '2025-06-12', economicStatus: 'bpl', address: 'Village Muzaffarpur, Bihar' },
  { id: 'b07', userId: 'g07', name: 'Pooja Devi', userType: 'girl', age: 17, height: 156, weight: 47, bloodGroup: 'A-', lastPeriodDate: '2025-05-08', anemiaStatus: 'mild', riskLevel: 'low', linkedAshaId: 'a04', nextCheckup: '2025-06-19', economicStatus: 'bpl', address: 'Village Darbhanga, Bihar' },
  { id: 'b08', userId: 'g08', name: 'Neha Rai', userType: 'girl', age: 18, height: 157, weight: 49, bloodGroup: 'B+', lastPeriodDate: '2025-05-12', anemiaStatus: 'moderate', riskLevel: 'medium', linkedAshaId: DEMO_ASHA_WORKER_ID, nextCheckup: '2025-06-21', economicStatus: 'bpl', address: 'Village Madhubani, Bihar' },
  { id: 'b09', userId: 'g09', name: 'Ishita Mishra', userType: 'girl', age: 15, height: 149, weight: 41, bloodGroup: 'O+', lastPeriodDate: '2025-04-22', anemiaStatus: 'normal', riskLevel: 'low', linkedAshaId: 'a06', nextCheckup: '2025-06-17', economicStatus: 'apl', address: 'Village Varanasi, Uttar Pradesh' },
  { id: 'b10', userId: 'g10', name: 'Tanvi Pandey', userType: 'girl', age: 16, height: 154, weight: 44, bloodGroup: 'A+', lastPeriodDate: '2025-05-01', anemiaStatus: 'mild', riskLevel: 'low', linkedAshaId: 'a07', nextCheckup: '2025-06-23', economicStatus: 'bpl', address: 'Village Gorakhpur, Uttar Pradesh' },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'al01', beneficiaryId: 'b06', severity: 'high', status: 'open', timestamp: new Date().toISOString(), type: 'health_risk', reason: 'Severe anemia, missed IFA for 2 weeks' },
  { id: 'al02', beneficiaryId: 'b04', severity: 'medium', status: 'open', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'health_risk', reason: 'Irregular cycle, 45 days since last period' },
  { id: 'al03', beneficiaryId: 'b08', severity: 'medium', status: 'open', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'sos', reason: 'Reported dizziness and heavy bleeding' },
  { id: 'al04', beneficiaryId: 'b02', severity: 'medium', status: 'resolved', timestamp: new Date(Date.now() - 604800000).toISOString(), type: 'health_risk', reason: 'Follow-up completed' },
  { id: 'al05', beneficiaryId: 'b01', severity: 'high', status: 'open', timestamp: new Date().toISOString(), type: 'health_risk', reason: 'Missed IFA for 10 days' },
  { id: 'al06', beneficiaryId: 'b02', severity: 'medium', status: 'open', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'health_risk', reason: 'Irregular cycle — 52 days since last period' },
  { id: 'al07', beneficiaryId: 'b04', severity: 'medium', status: 'open', timestamp: new Date(Date.now() - 43200000).toISOString(), type: 'sos', reason: 'Reported heavy bleeding and dizziness' },
  { id: 'al08', beneficiaryId: 'b06', severity: 'high', status: 'open', timestamp: new Date().toISOString(), type: 'health_risk', reason: 'Severe anemia — needs urgent follow-up' },
  { id: 'al09', beneficiaryId: 'b08', severity: 'low', status: 'open', timestamp: new Date(Date.now() - 259200000).toISOString(), type: 'health_risk', reason: 'Upcoming checkup reminder' },
  { id: 'al10', beneficiaryId: 'b10', severity: 'low', status: 'resolved', timestamp: new Date(Date.now() - 1209600000).toISOString(), type: 'health_risk', reason: 'Routine screening completed' },
];

export const MOCK_SCHEMES: Scheme[] = [
  { id: 's01', title: 'Janani Suraksha Yojana', provider: 'Govt', category: 'financial', description: 'Cash assistance for institutional delivery.', heroImage: 'https://cdn-icons-png.flaticon.com/512/2382/2382461.png', benefits: ['₹1400 cash assistance', 'Free transport', 'Free medicines'], eligibilityCriteria: ['BPL families', 'Age 19+'], targetAudience: { economicStatus: ['bpl'] }, status: 'active', budget: 5000000, enrolledCount: 1240, startDate: '2024-01-01' },
  { id: 's02', title: 'Poshan Abhiyaan', provider: 'NGO', category: 'nutrition', description: 'Nutrition support for adolescent girls with anemia.', heroImage: 'https://cdn-icons-png.flaticon.com/512/2913/2913465.png', benefits: ['Weekly fruit basket', 'Iron supplements', 'Nutrition counselling'], eligibilityCriteria: ['Anemia moderate or severe', 'Age 15-19'], targetAudience: { riskLevel: ['medium', 'high'] }, status: 'active', budget: 1200000, enrolledCount: 450, startDate: '2024-03-15' },
  { id: 's03', title: 'Matru Vandana', provider: 'Govt', category: 'financial', description: 'Maternity benefit for first live birth.', heroImage: 'https://cdn-icons-png.flaticon.com/512/1012/1012726.png', benefits: ['₹5000 in 3 installments'], eligibilityCriteria: ['First live birth'], targetAudience: {}, status: 'active', budget: 8000000, enrolledCount: 3100, startDate: '2024-02-01' },
  { id: 's04', title: 'Girls Iron Plus Program', provider: 'NGO', category: 'nutrition', description: 'Weekly IFA distribution for school-age girls.', heroImage: 'https://cdn-icons-png.flaticon.com/512/2913/2913465.png', benefits: ['IFA tablets', 'Health screening', 'Parent awareness sessions'], eligibilityCriteria: ['Girls age 15-19', 'BPL priority'], targetAudience: { economicStatus: ['bpl', 'apl'] }, status: 'active', budget: 850000, enrolledCount: 620, startDate: '2024-06-01' },
  { id: 's05', title: 'Safe Periods Initiative', provider: 'NGO', category: 'health', description: 'Pads, hygiene kits, and private counselling for adolescents.', heroImage: 'https://cdn-icons-png.flaticon.com/512/2965/2965879.png', benefits: ['Hygiene kits', 'Counselling sessions', 'ASHA training support'], eligibilityCriteria: ['Adolescent girls', 'Rural blocks'], targetAudience: {}, status: 'active', budget: 640000, enrolledCount: 380, startDate: '2024-08-10' },
  { id: 's06', title: 'Village Health Camps', provider: 'NGO', category: 'health', description: 'Monthly camps for screenings and referrals.', heroImage: 'https://cdn-icons-png.flaticon.com/512/2965/2965320.png', benefits: ['Free checkups', 'Lab tests', 'Specialist referrals'], eligibilityCriteria: ['All women and girls'], targetAudience: {}, status: 'active', budget: 2100000, enrolledCount: 890, startDate: '2024-05-01' },
  { id: 's07', title: 'Digital Literacy for Didi', provider: 'NGO', category: 'health', description: 'Training ASHA workers on voice logging and QR cards.', heroImage: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png', benefits: ['Phone stipend', 'ASHA AI training', 'Data support'], eligibilityCriteria: ['Active ASHA workers'], targetAudience: {}, status: 'active', budget: 430000, enrolledCount: 120, startDate: '2025-01-15' },
  { id: 's08', title: 'Adolescent Wellness Camps', provider: 'NGO', category: 'health', description: 'Quarterly wellness camps for rural adolescent girls.', heroImage: 'https://cdn-icons-png.flaticon.com/512/2965/2965320.png', benefits: ['Free screening', 'Counselling', 'Referrals'], eligibilityCriteria: ['Girls age 15-19'], targetAudience: {}, status: 'active', budget: 980000, enrolledCount: 540, startDate: '2024-09-01' },
  { id: 's09', title: 'Maternal Nutrition Support', provider: 'Govt', category: 'nutrition', description: 'Supplementary nutrition for pregnant and lactating women.', heroImage: 'https://cdn-icons-png.flaticon.com/512/2913/2913465.png', benefits: ['Take-home rations', 'IFA supplements'], eligibilityCriteria: ['Pregnant or lactating'], targetAudience: {}, status: 'active', budget: 3200000, enrolledCount: 2100, startDate: '2024-04-01' },
  { id: 's10', title: 'School Health Program', provider: 'NGO', category: 'health', description: 'Health education and screening in government schools.', heroImage: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png', benefits: ['Health talks', 'Screening', 'Hygiene kits'], eligibilityCriteria: ['School-age girls'], targetAudience: {}, status: 'active', budget: 760000, enrolledCount: 410, startDate: '2024-11-20' },
];

export const MOCK_CHILDREN: Child[] = [];

export const MOCK_ENROLLMENTS: Enrollment[] = [
  { id: 'e01', schemeId: 's02', beneficiaryId: 'b06', status: 'active', enrolledBy: 'a03', date: '2025-03-10' },
  { id: 'e02', schemeId: 's04', beneficiaryId: 'b01', status: 'active', enrolledBy: 'a01', date: '2025-04-02' },
  { id: 'e03', schemeId: 's05', beneficiaryId: 'b04', status: 'active', enrolledBy: 'a02', date: '2025-04-18' },
  { id: 'e04', schemeId: 's04', beneficiaryId: 'b08', status: 'active', enrolledBy: 'a05', date: '2025-05-01' },
  { id: 'e05', schemeId: 's05', beneficiaryId: 'b09', status: 'active', enrolledBy: 'a06', date: '2025-05-08' },
];

export const MOCK_HEALTH_LOGS: HealthLog[] = [
  { id: 'h01', beneficiaryId: 'b01', date: new Date().toISOString(), bpSystolic: 110, bpDiastolic: 70, symptoms: ['fatigue'], mood: 'Neutral', isEmergency: false },
  { id: 'h02', beneficiaryId: 'b06', date: new Date().toISOString(), bpSystolic: 100, bpDiastolic: 65, symptoms: ['dizziness', 'weakness'], mood: 'Tired', isEmergency: false },
  { id: 'h03', beneficiaryId: 'b04', date: new Date(Date.now() - 86400000).toISOString(), bpSystolic: 108, bpDiastolic: 68, symptoms: ['cramps'], mood: 'Pain', isEmergency: false },
  { id: 'h04', beneficiaryId: 'b02', date: new Date().toISOString(), bpSystolic: 108, bpDiastolic: 68, symptoms: ['fatigue'], mood: 'Neutral', isEmergency: false },
  { id: 'h05', beneficiaryId: 'b06', date: new Date().toISOString(), bpSystolic: 98, bpDiastolic: 62, symptoms: ['dizziness', 'pallor', 'weakness'], mood: 'Weak', isEmergency: true },
  { id: 'h06', beneficiaryId: 'b08', date: new Date(Date.now() - 43200000).toISOString(), bpSystolic: 106, bpDiastolic: 70, symptoms: ['heavy bleeding', 'fatigue'], mood: 'Anxious', isEmergency: false },
  { id: 'h07', beneficiaryId: 'b03', date: new Date(Date.now() - 172800000).toISOString(), bpSystolic: 112, bpDiastolic: 72, symptoms: [], mood: 'Good', isEmergency: false },
  { id: 'h08', beneficiaryId: 'b05', date: new Date(Date.now() - 259200000).toISOString(), bpSystolic: 114, bpDiastolic: 74, symptoms: ['mild headache'], mood: 'Neutral', isEmergency: false },
  { id: 'h09', beneficiaryId: 'b07', date: new Date(Date.now() - 345600000).toISOString(), bpSystolic: 109, bpDiastolic: 69, symptoms: ['cramps'], mood: 'Pain', isEmergency: false },
  { id: 'h10', beneficiaryId: 'b10', date: new Date(Date.now() - 432000000).toISOString(), bpSystolic: 111, bpDiastolic: 71, symptoms: [], mood: 'Good', isEmergency: false },
];
