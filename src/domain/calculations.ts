/**
 * Pure domain calculation logic for FairShift
 * Handles:
 * 1. Overtime calculations (>8 hours daily threshold)
 * 2. Fatigue alert detection (>60h weekly, back-to-back turnaround shifts)
 * 3. Rule-based attrition risk scoring
 */

import { FatigueAlert, AttritionRisk, Sector } from './types';

export interface OvertimeResult {
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  grossPay: number;
  hourlyRate: number;
  effectiveHourlyRate: number;
}

/**
 * Calculates regular and overtime hours & pay for a given duration in hours.
 * Standard workday: 8 hours.
 * Hours 8 to 12 are paid at 1.5x overtime multiplier.
 * Hours beyond 12 are paid at 2.0x double-time multiplier.
 */
export function calculateOvertime(totalHours: number, hourlyRate: number): OvertimeResult {
  const safeHours = Math.max(0, Number(totalHours) || 0);
  const safeRate = Math.max(0, Number(hourlyRate) || 0);

  const regularHours = Math.min(safeHours, 8);
  const totalOvertime = Math.max(0, safeHours - 8);

  // Split overtime into standard 1.5x (up to 4 overtime hours) and double-time 2.0x (>12h total)
  const tier1OvertimeHours = Math.min(totalOvertime, 4); // hours 8 through 12
  const tier2OvertimeHours = Math.max(0, totalOvertime - 4); // hours beyond 12

  const regularPay = Math.round(regularHours * safeRate);
  const tier1OvertimePay = Math.round(tier1OvertimeHours * (safeRate * 1.5));
  const tier2OvertimePay = Math.round(tier2OvertimeHours * (safeRate * 2.0));
  const overtimePay = tier1OvertimePay + tier2OvertimePay;

  const grossPay = regularPay + overtimePay;
  const effectiveHourlyRate = safeHours > 0 ? Math.round((grossPay / safeHours) * 100) / 100 : safeRate;

  return {
    totalHours: Math.round(safeHours * 100) / 100,
    regularHours: Math.round(regularHours * 100) / 100,
    overtimeHours: Math.round(totalOvertime * 100) / 100,
    regularPay,
    overtimePay,
    grossPay,
    hourlyRate: safeRate,
    effectiveHourlyRate,
  };
}

/**
 * Calculates statutory deductions (Provident Fund, ESI, Labor Welfare)
 * and final net pay for Indian Rupee payslips.
 */
export function calculatePayslipBreakdown(grossPay: number) {
  const safeGross = Math.max(0, grossPay);
  // Standard statutory rates in India: PF 12%, ESI 0.75% of gross, Welfare Fund flat ₹25
  const providentFund = Math.round(safeGross * 0.12);
  const esiInsurance = Math.round(safeGross * 0.0075);
  const welfareFund = safeGross > 0 ? 25 : 0;
  const totalDeductions = providentFund + esiInsurance + welfareFund;
  const netPay = Math.max(0, safeGross - totalDeductions);

  return {
    providentFund,
    esiInsurance,
    welfareFund,
    totalDeductions,
    netPay,
  };
}

export interface ShiftTimeInterval {
  date: string; // YYYY-MM-DD
  startIso: string; // ISO string
  endIso: string;   // ISO string
  hours: number;
}

/**
 * Detects whether consecutive shifts have less than minimum rest hours (10 hours standard).
 * Returns the smallest rest gap found in hours, or null if no consecutive violation.
 */
export function checkBackToBackTurnaround(
  shifts: ShiftTimeInterval[],
  minimumRestHours = 10
): { hasViolation: boolean; minRestGapHours: number | null } {
  if (shifts.length < 2) {
    return { hasViolation: false, minRestGapHours: null };
  }

  // Sort shifts chronologically by start time
  const sorted = [...shifts].sort(
    (a, b) => new Date(a.startIso).getTime() - new Date(b.startIso).getTime()
  );

  let minGap = Infinity;
  let hasViolation = false;

  for (let i = 0; i < sorted.length - 1; i++) {
    const currentEnd = new Date(sorted[i].endIso).getTime();
    const nextStart = new Date(sorted[i + 1].startIso).getTime();

    // Gap in milliseconds converted to hours
    const gapHours = (nextStart - currentEnd) / (1000 * 60 * 60);

    if (gapHours >= 0 && gapHours < minGap) {
      minGap = gapHours;
    }

    if (gapHours >= 0 && gapHours < minimumRestHours) {
      hasViolation = true;
    }
  }

  return {
    hasViolation,
    minRestGapHours: minGap === Infinity ? null : Math.round(minGap * 10) / 10,
  };
}

/**
 * Evaluates fatigue risk for a worker based on total weekly hours and rest intervals.
 * Standard OSHA / FairShift rules:
 * - Weekly hours > 60: Critical fatigue breach (ILO & Indian Factories Act guideline).
 * - Weekly hours 48 to 60 with back-to-back shift: Moderate fatigue alert.
 * - Back-to-back shifts with < 10h turnaround: Flagged for mandatory rest.
 */
export function evaluateFatigueAlert(params: {
  workerId: string;
  workerName: string;
  roleTitle: string;
  sector: Sector;
  shiftsInWeek: ShiftTimeInterval[];
}): FatigueAlert {
  const { workerId, workerName, roleTitle, sector, shiftsInWeek } = params;

  const weeklyHours = shiftsInWeek.reduce((sum, s) => sum + s.hours, 0);
  const roundedHours = Math.round(weeklyHours * 10) / 10;
  const isOver60Hours = roundedHours > 60;

  const turnaround = checkBackToBackTurnaround(shiftsInWeek, 10);
  const consecutiveDays = new Set(shiftsInWeek.map((s) => s.date)).size;

  let fatigueLevel: FatigueAlert['fatigueLevel'] = 'normal';
  let mitigationAdvice = 'Shift schedule is within safe ergonomic limits.';

  if (isOver60Hours) {
    fatigueLevel = 'critical';
    mitigationAdvice =
      'Worker has exceeded 60 weekly hours. Immediate mandatory 24-hour rest cycle required.';
  } else if (turnaround.hasViolation && roundedHours > 45) {
    fatigueLevel = 'critical';
    mitigationAdvice = `Turnaround rest is only ${turnaround.minRestGapHours}h (< 10h minimum) with high weekly load. Reassign next shift.`;
  } else if (isOver60Hours || turnaround.hasViolation || roundedHours > 52) {
    fatigueLevel = 'moderate';
    mitigationAdvice = turnaround.hasViolation
      ? `Quick turnaround detected (${turnaround.minRestGapHours}h rest gap). Monitor alertness.`
      : 'Approaching maximum safe weekly hours (52h+). Limit further overtime.';
  }

  return {
    workerId,
    workerName,
    roleTitle,
    sector,
    weeklyHours: roundedHours,
    consecutiveDays,
    hasBackToBackShift: turnaround.hasViolation,
    restGapHours: turnaround.minRestGapHours ?? undefined,
    isOver60Hours,
    fatigueLevel,
    mitigationAdvice,
  };
}

/**
 * Calculates a transparent rule-based Attrition Risk score (0 - 100).
 *
 * Factors:
 * 1. Overtime Burnout (45% weight): High overtime hours beyond 8h/day or >55h/week cause rapid burnout.
 * 2. Workplace Dissatisfaction (35% weight): Low manager/condition ratings in anonymous feedback.
 * 3. Safety Hazard Exposure (20% weight): Unresolved safety hazards in the worker's sector/site.
 */
export function calculateAttritionRisk(params: {
  workerId: string;
  workerName: string;
  roleTitle: string;
  sector: Sector;
  weeklyOvertimeHours: number;
  averageSatisfactionRating: number; // 1 to 5
  unresolvedHazardsCount: number;
}): AttritionRisk {
  const {
    workerId,
    workerName,
    roleTitle,
    sector,
    weeklyOvertimeHours,
    averageSatisfactionRating,
    unresolvedHazardsCount,
  } = params;

  // 1. Overtime factor: 0 at 0h overtime, 100 at 16+ hours overtime/week
  const overtimeBurnout = Math.min(100, Math.round((Math.max(0, weeklyOvertimeHours) / 16) * 100));

  // 2. Dissatisfaction factor: Rating 5/5 = 0% dissatisfaction, Rating 1/5 = 100% dissatisfaction
  const safeRating = Math.max(1, Math.min(5, averageSatisfactionRating || 3.5));
  const workplaceDissatisfaction = Math.round(((5 - safeRating) / 4) * 100);

  // 3. Hazard exposure factor: 0 for 0 unresolved hazards, 100 for 5+ unresolved hazards
  const safetyHazardExposure = Math.min(100, Math.round((Math.max(0, unresolvedHazardsCount) / 5) * 100));

  // Weighted composite score (0 - 100)
  const compositeScore = Math.round(
    overtimeBurnout * 0.45 +
    workplaceDissatisfaction * 0.35 +
    safetyHazardExposure * 0.20
  );

  const keyDrivers: string[] = [];
  if (overtimeBurnout >= 50) {
    keyDrivers.push(`High overtime burnout (${weeklyOvertimeHours}h overtime this week)`);
  }
  if (workplaceDissatisfaction >= 50) {
    keyDrivers.push(`Low workplace condition rating (${safeRating.toFixed(1)} / 5.0)`);
  }
  if (safetyHazardExposure >= 40) {
    keyDrivers.push(`${unresolvedHazardsCount} unresolved safety hazard(s) on site`);
  }
  if (keyDrivers.length === 0) {
    keyDrivers.push('Balanced shift hours and positive workplace feedback');
  }

  let tier: AttritionRisk['tier'] = 'low';
  let recommendedAction = 'Maintain regular check-ins and standard shift allocation.';

  if (compositeScore >= 65) {
    tier = 'high';
    recommendedAction =
      'High flight risk: Cap overtime immediately, schedule 1-on-1 supervisor check-in, and address site hazards.';
  } else if (compositeScore >= 35) {
    tier = 'medium';
    recommendedAction =
      'Moderate risk: Rebalance upcoming schedule to grant 2 consecutive rest days.';
  }

  return {
    workerId,
    workerName,
    roleTitle,
    sector,
    score: compositeScore,
    tier,
    factors: {
      overtimeBurnout,
      workplaceDissatisfaction,
      safetyHazardExposure,
    },
    keyDrivers,
    recommendedAction,
  };
}
