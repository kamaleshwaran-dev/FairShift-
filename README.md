# FairShift — Decent Work Platform (UN SDG 8)

[![UN SDG 8](https://img.shields.io/badge/UN%20SDG-8%20Decent%20Work-amber)](https://sdgs.un.org/goals/goal8)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-cyan)](https://react.dev/)
[![Cloud Run](https://img.shields.io/badge/Deploy-Google%20Cloud%20Run-blue)](https://cloud.google.com/run)

FairShift is an open, human-centered labor transparency platform aligning directly with **UN Sustainable Development Goal 8 (Decent Work & Economic Growth)**. It addresses wage leakage, unrecorded overtime, silent fatigue burnout, and occupational hazards for frontline blue-collar and essential shift workers.

---

## 1. Problem Statement & UN SDG 8 Alignment

Over 2 billion frontline and informal workers worldwide face daily labor vulnerabilities:
- **Uncompensated Overtime**: Arbitrary shift cutoffs where hours worked past standard 8-hour days go unrecorded.
- **Low-Literacy Pay Confusion**: Opaque paper pay stubs riddled with unexplained deductions.
- **Fear of Retaliation**: Safety hazards and abusive management go unreported due to fear of termination.
- **Excessive Fatigue & Accidents**: Back-to-back turnaround shifts (<10 hours rest) and >60 hour workweeks directly cause fatal machinery and clinical accidents.

FairShift eliminates these asymmetries through transparent digital verification, automated overtime calculation, Web Speech accessibility, anonymous feedback, and rule-based fatigue/attrition prevention.

---

## 2. Dual Sector Implementations

FairShift is pre-configured with distinct operational domains and realistic seeded datasets:

### A. Infrastructure & Heavy Civil Construction
- **Environment**: Metro rail, bridges, high-rise casting, and highway construction.
- **Target Roles**: Scaffolding specialists, senior masons, bar benders, crane riggers.
- **Core Hazards**: Fall protection failures, missing walkway clamps, silica dust extraction breakdowns, high-voltage excavation cable exposures.
- **Credentials**: National Scaffold Safety Competency, Heat Stress & CPR First Aid, Confined Space Entry.

### B. Hospital & Healthcare Facilities
- **Environment**: 24/7 rotational trauma centers, emergency departments, inpatient wards.
- **Target Roles**: ICU staff nurses, ward nursing assistants, patient transport orderlies, biohazard sanitation custodians.
- **Core Hazards**: Overflowing sharps needle disposal bins, chemical quaternary floor spills, HEPA airborne isolation pressure alarms.
- **Credentials**: Advanced Cardiac Life Support (ACLS/BLS), Biomedical Waste & Infection Control, Patient Ergonomic Transfer.

---

## 3. Core Features

### Worker Application (Mobile-First, Low-End Phone Ergonomics)
1. **Tactile Shift Tracking**:
   - Giant (>56px) Check-In / Check-Out button with simulated QR code / GPS geo-fence stamp.
   - Real-time timer calculating regular hours (up to 8h) and automatic overtime beyond 8 hours at 1.5x / 2.0x rates.
   - "+1 Hour (Simulate Shift)" button for instant demonstration of overtime calculations.
2. **Clear Transparent Payslip**:
   - Transparent rupee-for-rupee breakdown: Base pay, overtime pay, statutory deductions (Provident Fund 12%, ESI 0.75%, Welfare Fund ₹25), Net Take-Home Pay.
   - High-contrast visual cards and **"Listen" button** reading aloud the full payslip breakdown via the browser **Web Speech API** in English, Tamil (தமிழ்), or Hindi (हिन्दी).
3. **Voice & Text Safety Reporting**:
   - One-tap speech-to-text recording (Web Speech recognition) or typed hazard description.
   - Domain-specific hazard categorization and severity flags.
   - Real-time status tracking pipeline: `Reported` ➔ `In Review` ➔ `Resolved`.
4. **100% Anonymous Workplace Feedback**:
   - Decoupled star ratings (1-5) evaluating supervisor empathy, site amenities, rest breaks, and shift fairness.
   - Cryptographically decoupled: Zero worker ID or credentials stored.
5. **Digital Skill Passport**:
   - Verifiable occupational licenses, expiry warnings (<30 days), and credential QR codes.

### Operations Admin Dashboard (Desktop SaaS Management)
6. **Operational Analytics**:
   - Active on-site headcount, rolling weekly overtime volume, open hazard count, and aggregated satisfaction score.
   - Interactive 7-day attendance vs. overtime comparison charts.
7. **Fatigue & Overtaxing Early Warning Center**:
   - Flags workers exceeding the **60-hour weekly ceiling** or working **back-to-back shifts with under 10 hours rest**.
   - One-click intervention orders: "Issue 24h Mandatory Rest" or "Reassign to Relief Worker".
8. **Predictive Attrition Risk Engine**:
   - Transparent, rule-based formula weighting Overtime Burnout (45%), Workplace Dissatisfaction (35%), and Site Hazard Exposure (20%).
   - Actionable retention recommendations to prevent skilled trades flight.
9. **Hazard Resolution Management**:
   - Admin status transition board (Mark In Review, Record Corrective Actions, Mark Resolved) with immediate live sync back to the worker app.

---

## 4. Accessibility & Multilingual Localization

- **WCAG AA Compliance**: High-contrast ratios (>7:1 on text), visible blue focus rings (`focus-visible:ring-4`), minimum 48px touch hitboxes.
- **Languages**: Full trilingual support in **English**, **Tamil (தமிழ்)**, and **Hindi (हिन्दी)** with persistent browser storage.
- **Web Speech Integration**: Text-to-speech voice synthesis and speech-to-text recognition mapped to localized BCP 47 codes (`en-IN`, `ta-IN`, `hi-IN`).

---

## 5. Getting Started & Running Tests

### Prerequisites
- Node.js 20+ or 22+
- npm 10+

### Installation
```bash
# Clone and enter the applet directory
npm install
```

### Running Unit Tests
Unit tests cover pure business logic for overtime calculation, fatigue detection, and attrition scoring:
```bash
npm run test
```
The test suite validates:
- Standard 8h shifts and sub-8h proration.
- 1.5x overtime multiplier (hours 8-12) and 2.0x double-time (>12h).
- Statutory deductions (PF 12%, ESI 0.75%, Welfare ₹25).
- Quick-turnaround rest interval violations (<10 hours).
- Weekly >60 hour critical fatigue alerts.
- High, moderate, and low attrition risk scoring scenarios.

### Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view FairShift.

### Building for Production
```bash
npm run build
```

---

## 6. Google Cloud Run Deployment

FairShift includes a multi-stage production Dockerfile configured to run as a stateless container listening on the dynamic `$PORT` environment variable:

```bash
# Build Docker image
docker build -t gcr.io/[PROJECT_ID]/fairshift:latest .

# Run locally to test container
docker run -p 8080:8080 -e PORT=8080 gcr.io/[PROJECT_ID]/fairshift:latest

# Deploy directly to Google Cloud Run
gcloud run deploy fairshift \
  --image gcr.io/[PROJECT_ID]/fairshift:latest \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated
```
The container includes a built-in health check endpoint at `/health`.

---

## 7. License

Apache-2.0 · Built for UN Sustainable Development Goal 8 (Decent Work & Economic Growth).
