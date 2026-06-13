# 📋 ASHA AI - Technical Requirements Document

## 🎯 Project Overview

**ASHA AI** (Adaptive Support for Health & Awareness) is a voice-first, AI-powered maternal and reproductive health companion designed for rural Indian women and ASHA (Accredited Social Health Activist) workers. The platform addresses critical healthcare access barriers including low literacy, social stigma, limited connectivity, and overburdened healthcare systems.

---

## 🌟 Core Objectives

### Primary Goals
1. **Democratize Healthcare Access**: Provide dignified, private healthcare guidance to 300+ million rural women
2. **Empower ASHA Workers**: Digitize workflows and reduce administrative burden for community health workers
3. **Break Literacy Barriers**: Enable voice-first interactions in 11+ Indian languages
4. **Enable Offline-First**: Function seamlessly with intermittent connectivity on low-end devices
5. **Ensure Privacy**: Implement whisper privacy mode for sensitive health queries

### Target Users
- **Rural Women & Adolescent Girls** (Primary): Ages 10-45, low literacy, limited smartphone access
- **ASHA Workers** (Secondary): Community health workers managing 1000+ beneficiaries
- **NGO Partners** (Tertiary): Organizations running health schemes and campaigns

---

## 🛠️ Technical Stack

### Frontend Architecture
- **Framework**: React 18+ with TypeScript 5+
- **Build Tool**: Vite 6+ (lightning-fast HMR and optimized builds)
- **Routing**: React Router DOM v7
- **State Management**: Zustand (lightweight, performant)
- **Styling**: Tailwind CSS 3+ with custom utility classes
- **Animations**: Framer Motion 12+
- **UI Components**: Custom component library with accessibility focus
- **Charts**: Recharts 3+ for health data visualization
- **Date Handling**: date-fns 4+
- **HTTP Client**: Axios 1.9+
- **QR Code**: html5-qrcode, react-qr-code

### Backend Architecture
- **Framework**: FastAPI 0.109+ (async Python web framework)
- **Language**: Python 3.11+
- **Database**: PostgreSQL with asyncpg driver
- **ORM**: SQLAlchemy 2.0+ (async mode)
- **Migrations**: Alembic 1.13+
- **Authentication**: JWT (python-jose) with bcrypt password hashing
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

### AI/ML Services
- **LLM Integration**: Gemini API (hosted endpoint)
- **Speech-to-Text**: 
  - Primary: Web Speech API (browser-native, 11+ languages)
  - Optional: OpenAI Whisper (enhanced accuracy)
- **Text-to-Speech**: Web Speech Synthesis API
- **Language Support**: Hindi, Gujarati, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali, Punjabi, Bhojpuri, English
- **Medical Knowledge Base**: WHO guidelines + doctor-verified rural health protocols

### Infrastructure
- **Database Hosting**: Neon DB (serverless PostgreSQL with SSL)
- **API Deployment**: Cloud-ready (supports Docker, serverless)
- **Frontend Hosting**: Netlify-ready with SPA routing
- **Environment Management**: python-dotenv, Vite env variables

---

## 📦 Core Features & Requirements

### 1. Voice-First Symptom Checker

#### Functional Requirements
- Accept voice input in 11+ Indian languages and dialects
- Understand rural phrasing and colloquialisms
  - Examples: "Safed paani aa raha hai", "Tez pet dard", "Period nahi aaya"
- Provide culturally sensitive, doctor-verified responses
- Detect emergency keywords and trigger red-flag alerts
- Support audio playback of responses for low-literacy users

#### Technical Requirements
- Real-time speech recognition with <2s latency
- Fallback to text input when voice unavailable
- Emergency keyword detection in Hindi/English
- AI-powered intent classification (menstrual, pregnancy, nutrition, mental health, schemes)
- Response generation in user's input language

#### Emergency Keywords Detection
```
Hindi: खून, बहुत दर्द, बेहोश, चक्कर, बुखार, मदद, बचाओ
English: bleeding, severe pain, unconscious, dizzy, fever, help, emergency
Danger Signs: baby not moving, convulsion, water broke, heavy bleeding, can't breathe
```

---

### 2. Period & Fertility Tracking (Voice-Based)

#### Functional Requirements
- Voice-based cycle logging: "Meri last date 10 November thi"
- Automatic cycle prediction and fertile window calculation
- Irregularity detection and health risk identification
- Visual calendar with voice annotation support
- WhatsApp/SMS reminders for next period

#### Technical Requirements
- Local storage for privacy (IndexedDB/localStorage)
- Cycle prediction algorithm (average 28-day cycle with variance)
- Sync to backend when online (offline-first architecture)
- Date parsing from natural language input
- Calendar visualization with React components

---

### 3. Doctor-Verified Health Knowledge Base

#### Content Requirements
- **Menstrual Health**: Cycle irregularities, PCOS, hygiene, pain management
- **Reproductive Health**: Vaginal infections, contraception, STI awareness
- **Pregnancy Care**: Trimester-wise guidance, danger signs, nutrition
- **Adolescent Health**: Puberty education, body changes, mental health
- **Maternal Health**: Antenatal care, postnatal recovery, breastfeeding

#### Technical Requirements
- Structured medical content database
- AI-powered content retrieval based on query intent
- Multi-language content support
- Regular updates from medical advisors
- Citation of WHO/ICMR guidelines

---

### 4. ASHA Worker Digital Assistant

#### Functional Requirements
- **Voice-Based Visit Logging**: Record patient visits via voice notes
- **Auto-Digitization**: Extract structured data from voice transcriptions
  - Patient vitals (BP, weight, temperature)
  - Symptoms and severity assessment
  - Services provided and medicines distributed
  - Counseling topics and observations
- **Digital Health Cards**: Generate QR-coded health cards for beneficiaries
- **Pregnancy Risk Identification**: AI-powered red-flag detection
- **Follow-Up Reminders**: Automated scheduling and notifications
- **Village-Level Analytics**: Aggregate health metrics dashboard

#### Technical Requirements
- Offline data collection with background sync
- QR code generation and scanning
- Structured data extraction from unstructured voice input
- Risk scoring algorithm (0-100 scale)
- Real-time alert system for high-risk cases
- Export reports (PDF/CSV) for supervisors

---

### 5. Privacy & Safety Layer (Whisper Privacy Mode)

#### Functional Requirements
- **Anonymous Usage**: No mandatory name/phone number
- **Auto-Delete Mode**: Clear sensitive data on shared devices
- **Local Storage**: Keep sensitive queries client-side only
- **Secure Authentication**: Optional account creation for data persistence
- **Data Encryption**: End-to-end encryption for sensitive health data

#### Technical Requirements
- JWT-based authentication with refresh tokens
- Client-side encryption for sensitive fields
- Session timeout and auto-logout
- Privacy mode toggle in UI
- GDPR/DPDPA compliance measures

---

### 6. Health Micro-Lessons (Micro Capsules)

#### Functional Requirements
- Micro lessons on key topics:
  - Menstrual hygiene and myth-busting
  - Anemia prevention and iron-rich foods
  - Reproductive health basics
  - Puberty education for adolescents
  - Pregnancy danger signs
- Bite-sized, culturally appropriate content
- Playback controls (pause, replay, speed adjustment)
- Progress tracking and completion badges

---

### 7. Nutrition Planner for Adolescent Girls

#### Functional Requirements
- **Voice-Based Recommendations**: "Mujhe anemia hai, kya khana chahiye?"
- **Iron-Rich Meal Planning**: Weekly plans using low-cost rural foods
  - Jaggery (gur), chickpeas (chana), leafy greens (palak, methi)
- **Menstrual-Cycle-Based Nutrition**: Adjust recommendations by cycle phase
- **Personalized Tips**: Based on weight, anemia status, pregnancy
- **IFA Tablet Reminders**: Weekly Iron-Folic Acid dose notifications

#### Technical Requirements
- Nutrition database with local food items
- Meal plan generation algorithm
- Reminder scheduling system
- Integration with health logs for personalized plans
- Visual meal cards with ingredient lists

---

### 8. Multilingual Mini-LLM (Fine-Tuned)

#### Functional Requirements
- Understand rural Indian dialects and slang
- Process noisy audio recordings
- Respond in user's input language automatically
- Handle code-mixing (Hindi-English, regional languages)
- Provide contextually appropriate medical guidance

#### Technical Requirements
- Fine-tuned on:
  - Rural health FAQs from ASHA workers
  - Government health guidelines (NRHM, RMNCH+A)
  - WHO maternal health protocols
  - Common menstrual/adolescent health queries
- Low-latency inference (<3s response time)
- Partial offline capability (cached responses)
- Continuous learning from user interactions

---

## 🔐 Security & Compliance Requirements

### Authentication & Authorization
- JWT-based stateless authentication
- Role-based access control (RBAC):
  - `beneficiary`: Limited to personal health data
  - `asha_worker`: Access to assigned beneficiaries
  - `partner`: Scheme management and analytics
- Secure password hashing (bcrypt with salt)
- Token refresh mechanism
- Session management with expiry

### Data Privacy
- HIPAA-inspired data handling (though not US-based)
- DPDPA (Digital Personal Data Protection Act) compliance
- Minimal data collection principle
- User consent for data sharing
- Right to data deletion
- Anonymized analytics

### API Security
- HTTPS/TLS encryption in transit
- CORS policy enforcement
- Rate limiting to prevent abuse
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection

---

## 🌐 Offline-First Architecture

### Requirements
- **Progressive Web App (PWA)**: Installable on Android/iOS
- **Service Workers**: Cache static assets and API responses
- **IndexedDB**: Store health logs, cycle data, and chat history
- **Background Sync**: Queue failed requests for retry when online
- **Optimistic UI Updates**: Immediate feedback, sync in background
- **Conflict Resolution**: Last-write-wins with timestamp comparison

### Sync Strategy
1. User performs action offline → Store in local queue (indexedDB)
2. Network detected → Attempt sync in background
3. Success → Remove from queue, update UI
4. Failure → Retry with exponential backoff
5. Conflict → Merge or prompt user for resolution

---

## 📊 Performance Requirements

### Mobile Optimization
- Works on devices with:
  - 2GB RAM minimum
  - Android 8+ / iOS 12+
  - 3G network speeds
  - Screen sizes 320px-1920px
