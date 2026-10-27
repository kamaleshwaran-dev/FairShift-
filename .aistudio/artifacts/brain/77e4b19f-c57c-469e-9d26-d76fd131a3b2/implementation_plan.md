# FairShift — UN SDG 8 Decent Work Platform

FairShift empowers frontline workers and site managers with transparent labor tracking, fair overtime accounting, voice-enabled safety reporting, and proactive fatigue/attrition prevention across Construction and Healthcare facilities.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned during Phase 1 clarification:
> - **Second Sector Domain**: Hospital and Healthcare (Ward nurses, sanitation workers, surgical orderlies, nursing assistants) paired with Infrastructure & Civil Construction (Masons, electricians, scaffolders, riggers).
> - **Worker UI Desktop Presentation**: Interactive mobile smartphone viewport frame with an instant 1-click toggle to full-screen responsive mode for comfortable desktop evaluation.
> - **Currency & Localization**: Indian Rupee (₹ INR) default with full native translations in English, Tamil (தமிழ்), and Hindi (हिन्दी) including localized number formats and speech readout.

---

### 1. Overview & Core Concept

FairShift directly advances **UN Sustainable Development Goal 8 (Decent Work and Economic Growth)** by tackling the pervasive exploitation, unrecorded overtime, hazardous conditions, and silent worker burnout experienced by hourly and blue-collar labor in emerging and industrial sectors.

- **Dual Personas & Ecosystem**:
  1. **Frontline Workers**: Mobile-first, low-literacy friendly, large touch targets (48px+), minimal text clutter, high-contrast WCAG AA visibility, voice-to-text safety reporting, and audio speech synthesis for payslip transparency.
  2. **Operations & HR Admins**: Real-time management console tracking real shift hours, dynamic overtime expenditure, predictive attrition risks, OSHA/labor compliance fatigue violations, and safety hazard resolutions.
- **Dual Industry Verticals**:
  - **Construction**: Heavy machinery, scaffold safety, dust/chemical hazards, night pours, dynamic shift wage rates.
  - **Hospital & Healthcare**: 24/7 rotational shifts, nurse staffing ratios, biohazard reporting, patient transfer orderlies, and infection control credentials.

---

### 2. User Experience & Visual Design

#### A. Key User Flows

```
[ Role Switch / Auth ]
       │
       ├──> [ Worker App ] (Mobile Frame / Responsive)
       │         ├── 1. Shift Tracker: Big tactile Check-in / Check-out button, simulated GPS/QR scan, live overtime timer (>8h).
       │         ├── 2. Clear Payslip: Base wages, automatic overtime (1.5x/2x beyond 8h), statutory deductions, Net Pay + "Listen" (Web Speech TTS).
       │         ├── 3. Safety Reporting: Voice record (SpeechRecognition) or typed hazard, photo/evidence tag, live status tracker (Reported ➔ In Review ➔ Resolved).
       │         ├── 4. Anonymous Feedback: Star ratings for manager & working conditions, submitted strictly decoupled from worker ID.
       │         └── 5. Skill Passport: Digital verifiable cards of site inductions, OSHA certifications, and BLS/First Aid training.
       │
       └──> [ Admin Dashboard ] (Desktop SaaS Console)
                 ├── Overview KPIs: Daily attendance, active overtime hours, pending hazards, aggregate worker satisfaction score.
                 ├── Attendance & Shift Trends: Sector-specific interactive analytics, shift distribution.
                 ├── Fatigue Alert Center: Real-time flags for >60 hrs/week and back-to-back turnaround shifts (<10 hrs rest).
                 ├── Attrition Risk Engine: Rule-based score (0–100%) highlighting flight risk from excessive overtime, low ratings, and unresolved hazards.
                 └── Hazard Resolution Board: Status transition pipeline (Reported, In Review, Resolved) with immediate sync to worker app.
```

#### B. Visual Identity & Theme (Domain-Grounded & Accessible)

- **Color Palette (WCAG AA Compliant)**:
  - **Neutral Canvas**: Deep Slate (`#0F172A`) for dark accents, crisp high-contrast white (`#FFFFFF`) / soft background slate (`#F8FAFC`) ensuring `> 7:1` text contrast.
  - **Sector Anchors**:
    - Construction: High-visibility Safety Amber (`#D97706` / `#F59E0B`) and Industrial Cobalt (`#1D4ED8`).
    - Healthcare: Clinical Teal/Cyan (`#0D9488` / `#0891B2`) and Caduceus Blue (`#2563EB`).
  - **Semantic States**: Emerald (`#16A34A` for normal/settled), Amber (`#D97706` for warning/review), Ruby (`#DC2626` for fatigue/hazard alerts).
- **Typography**: Clean, robust sans `Plus Jakarta Sans` / `Outfit` with monospace tabular numerals (`tabular-nums`) for currency, shift durations, and timestamps.
- **Accessibility Discipline**: Zero microscopic text (<14px on worker mobile), zero low-contrast gray-on-gray, visible blue focus rings (`focus-visible:ring-4`), full keyboard navigability (Tab/Enter/Space), and screen reader `aria-labels`.

---

### 3. Key Product Decisions & Trade-Offs

1. **Deterministic Calculation Logic (Overtime, Fatigue, Attrition)**:
   - *Overtime*: Automatic daily thresholding (> 8 hours in single shift = 1.5x standard hourly rate; > 12 hours = 2.0x double-time).
   - *Fatigue Detection*: Triggered when 7-day rolling hours exceed 60 hours OR rest between successive shifts is under 10 hours.
   - *Attrition Risk Index*: Transparent, rule-based formula weighting 3 factors:
     $$\text{Attrition Score} = 0.45 \times \text{Overtime Burden} + 0.35 \times (5 - \text{Workplace Sentiment}) \times 20 + 0.20 \times \text{Unresolved Hazards}$$
   - *Rationale*: Transparent rule-based logic is auditable, explainable to labor unions, and covered by unit tests.

2. **Web Speech API & Multilingual Localization (English, Tamil, Hindi)**:
   - *TTS*: Uses browser `window.speechSynthesis` with Tamil (`ta-IN`), Hindi (`hi-IN`), and English (`en-IN` / `en-US`) voice matching. Includes a visual animated waveform feedback and fallback text banner if the device lacks speech synthesizer voices.
   - *STT*: Uses `webkitSpeechRecognition` / `SpeechRecognition` for one-tap voice hazard reporting in Tamil, Hindi, or English.

3. **Data Persistence & Sector Isolation**:
   - Seeded with realistic profiles (e.g., Construction: M. Arumugam, Rajesh Kumar, S. Selvam; Hospital: Priya Dharshini, Anjali Verma, K. Ramesh).
   - In-memory + persistent `localStorage` store so modifications (check-in, hazard reports, feedback, status updates) persist across refresh, with an instant "Reset Demo Data" button.

---

### 4. Technical Architecture & Verification Plan

#### A. System Component Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          FairShift App Root                            │
│  [Sector Switcher: Construction | Hospital]   [Lang: EN | தமிழ் | हिंदी] │
│  [Role Switcher: Worker Mode (Mobile View)  |  Admin Dashboard]        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────────┐      ┌──────────────────────────────────┐
│        Worker Application        │      │         Admin Dashboard          │
│  (Simulated Mobile Frame Toggle) │      │  (Full-Width Desktop Management) │
├──────────────────────────────────┤      ├──────────────────────────────────┤
│ • ShiftTracker (GPS/QR check-in) │      │ • Operational KPI Strip          │
│ • PayslipView (Web Speech TTS)   │      │ • Attendance & Overtime Trends   │
│ • SafetyReporter (STT Voice/Txt) │      │ • Fatigue Risk Watchlist (>60h)  │
│ • AnonymousFeedback (Decoupled)  │      │ • Attrition Predictor Matrix     │
│ • SkillPassport (Verifiable Certs│      │ • Hazard Resolution Kanban/Table │
└─────────────────┬────────────────┘      └─────────────────┬────────────────┘
                  │                                         │
                  └─────────────────┬───────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Shared Domain Engine & Local Store                   │
│  • calculations.ts (Pure logic: Overtime, Fatigue, Attrition)         │
│  • translations.ts (Full i18n dictionaries: EN, TA, HI)                │
│  • demoData.ts (Seeded Construction & Hospital worker/shift records)   │
│  • useFairShiftStore.ts (State management & event synchronization)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Verification & Cloud Run Deployment                    │
│  • calculations.test.ts (Unit tests with Vitest)                       │
│  • Dockerfile (Multi-stage Node/Vite build serving port $PORT)         │
│  • README.md (Comprehensive problem statement, SDG 8 guide, test runs) │
└────────────────────────────────────────────────────────────────────────┘
```

#### B. Step-by-Step Execution Plan

1. **Phase 1: Dependencies & Configuration**
   - Add `vitest` for running fast unit tests.
   - Configure `metadata.json` and sync `index.html` tags with FairShift branding.
   - Ensure Tailwind CSS and Lucide icons are properly wired.

2. **Phase 2: Core Domain Logic & Localization Engine**
   - `src/domain/calculations.ts`: Pure functions for overtime calculation, fatigue violation detector, and attrition risk score.
   - `src/domain/calculations.test.ts`: Exhaustive test suite verifying boundary conditions (8h, 12h, 60h, back-to-back rest, zero-score edge cases).
   - `src/domain/translations.ts`: High-quality translations for English, Tamil (தமிழ்), and Hindi (हिन्दी) covering all actions, payslip terms, and speech phrases.
   - `src/domain/speech.ts`: Browser Web Speech API wrappers with robust fallback mechanisms.

3. **Phase 3: Seeded Datasets & Reactive State Store**
   - `src/domain/demoData.ts`: Construction and Hospital presets with realistic workers, active shifts, historical payslips, hazards, and certifications.
   - `src/context/FairShiftContext.tsx`: Shared state providing role switching, sector switching, live check-in/out, hazard submission, and admin status updates.

4. **Phase 4: Worker Mobile Interface**
   - `src/components/worker/MobileFrame.tsx`: Phone bezel simulator with viewport toggle.
   - `src/components/worker/ShiftTracker.tsx`: Large tactile button, simulated QR scanner/geo-location, live elapsed and overtime counter.
   - `src/components/worker/PayslipView.tsx`: Transparent financial card, icon breakdown, multi-lingual audio readout button.
   - `src/components/worker/SafetyReporter.tsx`: Speech-to-text mic recording + text hazard submission + status tracker pill.
   - `src/components/worker/AnonymousFeedback.tsx`: Decoupled star rating and condition assessment.
   - `src/components/worker/SkillPassport.tsx`: Verified certificate cards with expiry tracking.

5. **Phase 5: Admin Management Dashboard**
   - `src/components/admin/AdminOverview.tsx`: Metric cards, trend charts (attendance, overtime distribution).
   - `src/components/admin/FatigueAlerts.tsx`: Clear warning queue highlighting >60h weekly limits and consecutive turnaround violations.
   - `src/components/admin/AttritionRisk.tsx`: Score cards with risk level badges, contributing factors, and suggested mitigation actions.
   - `src/components/admin/SafetyReportsAdmin.tsx`: Interactive hazard management table with status updating.

6. **Phase 6: Production Packaging & Cloud Run Deployment**
   - `Dockerfile`: Production multi-stage container build with static server listening on dynamic `$PORT`.
   - `README.md`: Detailed documentation explaining UN SDG 8 alignment, Construction & Hospital cases, test execution, and deployment.
   - Run unit tests and `compile_applet` to verify clean build.
