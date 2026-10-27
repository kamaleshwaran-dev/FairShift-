/**
 * Domain types for FairShift - UN SDG 8 Decent Work Platform
 */

export type Sector = 'construction' | 'hospital';

export type Language = 'en' | 'ta' | 'hi';

export type UserRole = 'worker' | 'admin';

export interface WorkerProfile {
  id: string;
  name: string;
  employeeCode: string;
  sector: Sector;
  roleTitle: string;
  hourlyRate: number; // in INR (₹)
  phone: string;
  emergencyContact: string;
  activeCheckIn?: {
    startTime: string; // ISO string
    simulatedLocation: string;
    checkInMethod: 'qr' | 'gps';
  } | null;
}

export interface ShiftRecord {
  id: string;
  workerId: string;
  workerName: string;
  sector: Sector;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm or ISO
  endTime: string;   // HH:mm or ISO
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  overtimeRate: number; // 1.5x regular
  basePay: number;
  overtimePay: number;
  grossPay: number;
  status: 'active' | 'completed';
}

export interface DeductionItem {
  label: string;
  amount: number;
}

export interface Payslip {
  id: string;
  workerId: string;
  workerName: string;
  sector: Sector;
  period: string; // e.g., "October 2026 (Week 4)"
  basePay: number;
  regularHours: number;
  overtimePay: number;
  overtimeHours: number;
  grossPay: number;
  deductions: {
    providentFund: number;
    esiInsurance: number;
    welfareFund: number;
  };
  totalDeductions: number;
  netPay: number;
  hourlyRate: number;
  paymentStatus: 'paid' | 'pending';
  currency: string;
}

export type HazardCategory =
  | 'fall_protection'
  | 'machinery_scaffold'
  | 'chemical_dust'
  | 'biohazard_needle'
  | 'ergonomic_heavy_lift'
  | 'ppe_shortage'
  | 'excessive_heat_noise'
  | 'other';

export type HazardSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus = 'reported' | 'in_review' | 'resolved';

export interface SafetyReport {
  id: string;
  sector: Sector;
  reportedByWorkerId?: string; // Optional for anonymous submissions
  title: string;
  description: string;
  category: HazardCategory;
  severity: HazardSeverity;
  status: ReportStatus;
  reportedAt: string; // ISO string
  resolvedAt?: string;
  resolutionNotes?: string;
  inputMethod: 'voice' | 'text';
  audioDurationSeconds?: number;
}

export interface FeedbackSubmission {
  id: string;
  sector: Sector;
  timestamp: string; // ISO string
  ratingManager: number; // 1-5
  ratingConditions: number; // 1-5
  ratingRestBreaks: number; // 1-5
  ratingFairShifts: number; // 1-5
  anonymousComment?: string;
}

export interface Certification {
  id: string;
  workerId: string;
  title: string;
  issuingBody: string;
  credentialId: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status: 'valid' | 'expiring_soon' | 'expired';
  category: string;
  skills: string[];
}

export interface FatigueAlert {
  workerId: string;
  workerName: string;
  roleTitle: string;
  sector: Sector;
  weeklyHours: number;
  consecutiveDays: number;
  hasBackToBackShift: boolean; // less than 10h rest
  restGapHours?: number;
  isOver60Hours: boolean;
  fatigueLevel: 'normal' | 'moderate' | 'critical';
  mitigationAdvice: string;
}

export interface AttritionRisk {
  workerId: string;
  workerName: string;
  roleTitle: string;
  sector: Sector;
  score: number; // 0 to 100
  tier: 'low' | 'medium' | 'high';
  factors: {
    overtimeBurnout: number; // 0-100
    workplaceDissatisfaction: number; // 0-100
    safetyHazardExposure: number; // 0-100
  };
  keyDrivers: string[];
  recommendedAction: string;
}
