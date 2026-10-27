import { describe, it, expect } from 'vitest';
import {
  calculateOvertime,
  calculatePayslipBreakdown,
  checkBackToBackTurnaround,
  evaluateFatigueAlert,
  calculateAttritionRisk,
  ShiftTimeInterval,
} from './calculations';

describe('FairShift Overtime Calculations', () => {
  const hourlyRate = 100; // ₹100/hr for baseline comparison

  it('calculates standard 8-hour shift with 0 overtime', () => {
    const result = calculateOvertime(8, hourlyRate);
    expect(result.totalHours).toBe(8);
    expect(result.regularHours).toBe(8);
    expect(result.overtimeHours).toBe(0);
    expect(result.regularPay).toBe(800);
    expect(result.overtimePay).toBe(0);
    expect(result.grossPay).toBe(800);
    expect(result.effectiveHourlyRate).toBe(100);
  });

  it('calculates sub-8 hour shift correctly (e.g. 5.5 hours)', () => {
    const result = calculateOvertime(5.5, hourlyRate);
    expect(result.totalHours).toBe(5.5);
    expect(result.regularHours).toBe(5.5);
    expect(result.overtimeHours).toBe(0);
    expect(result.regularPay).toBe(550);
    expect(result.overtimePay).toBe(0);
    expect(result.grossPay).toBe(550);
  });

  it('calculates fractional overtime beyond 8 hours at 1.5x multiplier', () => {
    // 8.5 hours = 8 reg (800) + 0.5 OT @ 1.5x (75) = 875
    const result = calculateOvertime(8.5, hourlyRate);
    expect(result.totalHours).toBe(8.5);
    expect(result.regularHours).toBe(8);
    expect(result.overtimeHours).toBe(0.5);
    expect(result.regularPay).toBe(800);
    expect(result.overtimePay).toBe(75);
    expect(result.grossPay).toBe(875);
  });

  it('calculates standard 10-hour shift at 1.5x multiplier', () => {
    // 10 hours = 8 regular (800) + 2 overtime @ 1.5x (300) = 1100
    const result = calculateOvertime(10, hourlyRate);
    expect(result.totalHours).toBe(10);
    expect(result.regularHours).toBe(8);
    expect(result.overtimeHours).toBe(2);
    expect(result.regularPay).toBe(800);
    expect(result.overtimePay).toBe(300);
    expect(result.grossPay).toBe(1100);
    expect(result.effectiveHourlyRate).toBe(110);
  });

  it('calculates exact 12-hour boundary before double-time tier', () => {
    // 12 hours = 8 reg (800) + 4 OT @ 1.5x (600) + 0 double-time = 1400
    const result = calculateOvertime(12, hourlyRate);
    expect(result.totalHours).toBe(12);
    expect(result.regularHours).toBe(8);
    expect(result.overtimeHours).toBe(4);
    expect(result.regularPay).toBe(800);
    expect(result.overtimePay).toBe(600);
    expect(result.grossPay).toBe(1400);
  });

  it('calculates double-time overtime beyond 12 hours (2.0x multiplier)', () => {
    // 14 hours = 8 reg (800) + 4 OT @ 1.5x (600) + 2 double-time @ 2.0x (400) = 1800
    const result = calculateOvertime(14, hourlyRate);
    expect(result.totalHours).toBe(14);
    expect(result.regularHours).toBe(8);
    expect(result.overtimeHours).toBe(6);
    expect(result.regularPay).toBe(800);
    expect(result.overtimePay).toBe(1000);
    expect(result.grossPay).toBe(1800);
  });

  it('calculates extreme 16-hour emergency shift correctly', () => {
    // 16 hours = 8 reg (800) + 4 OT @ 1.5x (600) + 4 double-time @ 2.0x (800) = 2200
    const result = calculateOvertime(16, hourlyRate);
    expect(result.totalHours).toBe(16);
    expect(result.regularHours).toBe(8);
    expect(result.overtimeHours).toBe(8);
    expect(result.regularPay).toBe(800);
    expect(result.overtimePay).toBe(1400);
    expect(result.grossPay).toBe(2200);
  });

  it('works with non-round wage rates (e.g. ₹185/hr rigger rate)', () => {
    // 9 hours @ 185 = 8 * 185 (1480) + 1 * 277.5 (278) = 1758
    const result = calculateOvertime(9, 185);
    expect(result.regularPay).toBe(1480);
    expect(result.overtimePay).toBe(278);
    expect(result.grossPay).toBe(1758);
  });

  it('handles 0 or negative inputs gracefully without crashing', () => {
    const resultZero = calculateOvertime(0, hourlyRate);
    expect(resultZero.totalHours).toBe(0);
    expect(resultZero.grossPay).toBe(0);

    const resultNegative = calculateOvertime(-5, hourlyRate);
    expect(resultNegative.totalHours).toBe(0);
    expect(resultNegative.grossPay).toBe(0);
  });
});

describe('FairShift Payslip Statutory Deductions', () => {
  it('correctly calculates PF 12%, ESI 0.75%, Welfare Fund, and Net Pay', () => {
    const grossPay = 10000;
    const breakdown = calculatePayslipBreakdown(grossPay);

    expect(breakdown.providentFund).toBe(1200); // 12% of 10000
    expect(breakdown.esiInsurance).toBe(75);    // 0.75% of 10000
    expect(breakdown.welfareFund).toBe(25);     // ₹25 flat
    expect(breakdown.totalDeductions).toBe(1300);
    expect(breakdown.netPay).toBe(8700);
  });

  it('handles zero gross pay without negative net pay', () => {
    const breakdown = calculatePayslipBreakdown(0);
    expect(breakdown.providentFund).toBe(0);
    expect(breakdown.esiInsurance).toBe(0);
    expect(breakdown.welfareFund).toBe(0);
    expect(breakdown.totalDeductions).toBe(0);
    expect(breakdown.netPay).toBe(0);
  });
});

describe('FairShift Fatigue Detection', () => {
  it('detects back-to-back shift turnaround with under 10 hours rest (<10h rest gap)', () => {
    const shifts: ShiftTimeInterval[] = [
      {
        date: '2026-10-25',
        startIso: '2026-10-25T08:00:00Z',
        endIso: '2026-10-25T20:00:00Z', // finishes at 20:00
        hours: 12,
      },
      {
        date: '2026-10-26',
        startIso: '2026-10-26T03:00:00Z', // starts at 03:00 next day (7 hour gap!)
        endIso: '2026-10-26T12:00:00Z',
        hours: 9,
      },
    ];

    const turnaround = checkBackToBackTurnaround(shifts, 10);
    expect(turnaround.hasViolation).toBe(true);
    expect(turnaround.minRestGapHours).toBe(7);
  });

  it('passes turnaround check when rest exactly matches or exceeds 10 hours', () => {
    const shifts: ShiftTimeInterval[] = [
      {
        date: '2026-10-25',
        startIso: '2026-10-25T08:00:00Z',
        endIso: '2026-10-25T18:00:00Z', // finishes at 18:00
        hours: 10,
      },
      {
        date: '2026-10-26',
        startIso: '2026-10-26T04:00:00Z', // starts at 04:00 next day (exactly 10h gap)
        endIso: '2026-10-26T14:00:00Z',
        hours: 10,
      },
    ];

    const turnaround = checkBackToBackTurnaround(shifts, 10);
    expect(turnaround.hasViolation).toBe(false);
    expect(turnaround.minRestGapHours).toBe(10);
  });

  it('handles a single shift in a week without turnaround false positives', () => {
    const shifts: ShiftTimeInterval[] = [
      {
        date: '2026-10-25',
        startIso: '2026-10-25T08:00:00Z',
        endIso: '2026-10-25T16:00:00Z',
        hours: 8,
      },
    ];

    const turnaround = checkBackToBackTurnaround(shifts, 10);
    expect(turnaround.hasViolation).toBe(false);
    expect(turnaround.minRestGapHours).toBeNull();
  });

  it('flags worker with over 60 hours per week as Critical Fatigue', () => {
    const shifts: ShiftTimeInterval[] = [
      { date: '2026-10-20', startIso: '2026-10-20T08:00:00Z', endIso: '2026-10-20T21:00:00Z', hours: 13 },
      { date: '2026-10-21', startIso: '2026-10-21T08:00:00Z', endIso: '2026-10-21T21:00:00Z', hours: 13 },
      { date: '2026-10-22', startIso: '2026-10-22T08:00:00Z', endIso: '2026-10-22T21:00:00Z', hours: 13 },
      { date: '2026-10-23', startIso: '2026-10-23T08:00:00Z', endIso: '2026-10-23T21:00:00Z', hours: 13 },
      { date: '2026-10-24', startIso: '2026-10-24T08:00:00Z', endIso: '2026-10-24T18:00:00Z', hours: 10 },
    ]; // total = 62 hours!

    const alert = evaluateFatigueAlert({
      workerId: 'w-1',
      workerName: 'Rajesh Kumar',
      roleTitle: 'Scaffolder',
      sector: 'construction',
      shiftsInWeek: shifts,
    });

    expect(alert.weeklyHours).toBe(62);
    expect(alert.isOver60Hours).toBe(true);
    expect(alert.fatigueLevel).toBe('critical');
    expect(alert.mitigationAdvice).toContain('exceeded 60 weekly hours');
  });

  it('flags moderate fatigue for approaching high hours (e.g. 54h)', () => {
    const shifts: ShiftTimeInterval[] = [
      { date: '2026-10-20', startIso: '2026-10-20T08:00:00Z', endIso: '2026-10-20T17:00:00Z', hours: 9 },
      { date: '2026-10-21', startIso: '2026-10-21T08:00:00Z', endIso: '2026-10-21T17:00:00Z', hours: 9 },
      { date: '2026-10-22', startIso: '2026-10-22T08:00:00Z', endIso: '2026-10-22T17:00:00Z', hours: 9 },
      { date: '2026-10-23', startIso: '2026-10-23T08:00:00Z', endIso: '2026-10-23T17:00:00Z', hours: 9 },
      { date: '2026-10-24', startIso: '2026-10-24T08:00:00Z', endIso: '2026-10-24T17:00:00Z', hours: 9 },
      { date: '2026-10-25', startIso: '2026-10-25T08:00:00Z', endIso: '2026-10-25T17:00:00Z', hours: 9 },
    ]; // total = 54 hours (below 60h, but > 52h)

    const alert = evaluateFatigueAlert({
      workerId: 'w-2',
      workerName: 'Anjali Verma',
      roleTitle: 'Nursing Assistant',
      sector: 'hospital',
      shiftsInWeek: shifts,
    });

    expect(alert.weeklyHours).toBe(54);
    expect(alert.isOver60Hours).toBe(false);
    expect(alert.fatigueLevel).toBe('moderate');
  });
});

describe('FairShift Attrition Risk Scoring Logic', () => {
  it('assigns High attrition risk to worker with extreme overtime and low feedback score', () => {
    const risk = calculateAttritionRisk({
      workerId: 'w-2',
      workerName: 'Priya Dharshini',
      roleTitle: 'Staff Nurse',
      sector: 'hospital',
      weeklyOvertimeHours: 16, // heavy overtime (100% burnout factor)
      averageSatisfactionRating: 1.5, // 87.5% dissatisfaction
      unresolvedHazardsCount: 4, // 80% hazard exposure
    });

    expect(risk.tier).toBe('high');
    expect(risk.score).toBeGreaterThanOrEqual(65);
    expect(risk.factors.overtimeBurnout).toBe(100);
    expect(risk.recommendedAction).toContain('High flight risk');
  });

  it('assigns Low attrition risk to worker with balanced hours and high satisfaction', () => {
    const risk = calculateAttritionRisk({
      workerId: 'w-3',
      workerName: 'S. Selvam',
      roleTitle: 'Mason',
      sector: 'construction',
      weeklyOvertimeHours: 2, // low overtime
      averageSatisfactionRating: 4.8, // high satisfaction
      unresolvedHazardsCount: 0, // no hazards
    });

    expect(risk.tier).toBe('low');
    expect(risk.score).toBeLessThan(35);
  });

  it('assigns Medium tier when score is in 35-64 boundary range', () => {
    const risk = calculateAttritionRisk({
      workerId: 'w-4',
      workerName: 'Dharmendra Yadav',
      roleTitle: 'Crane Operator',
      sector: 'construction',
      weeklyOvertimeHours: 8, // 50% burnout factor
      averageSatisfactionRating: 3.0, // 50% dissatisfaction
      unresolvedHazardsCount: 2, // 40% hazard exposure
    });

    // Score = 0.45*50 + 0.35*50 + 0.20*40 = 22.5 + 17.5 + 8 = 48
    expect(risk.score).toBe(48);
    expect(risk.tier).toBe('medium');
    expect(risk.recommendedAction).toContain('Moderate risk');
  });

  it('handles absolute best-case scenario (0 score)', () => {
    const risk = calculateAttritionRisk({
      workerId: 'w-ideal',
      workerName: 'Ideal Worker',
      roleTitle: 'Technician',
      sector: 'construction',
      weeklyOvertimeHours: 0,
      averageSatisfactionRating: 5.0,
      unresolvedHazardsCount: 0,
    });

    expect(risk.score).toBe(0);
    expect(risk.tier).toBe('low');
    expect(risk.factors.overtimeBurnout).toBe(0);
    expect(risk.factors.workplaceDissatisfaction).toBe(0);
    expect(risk.factors.safetyHazardExposure).toBe(0);
  });

  it('handles absolute worst-case scenario (100 score)', () => {
    const risk = calculateAttritionRisk({
      workerId: 'w-critical',
      workerName: 'Burned Out Worker',
      roleTitle: 'Staff',
      sector: 'hospital',
      weeklyOvertimeHours: 24, // >= 16h = 100%
      averageSatisfactionRating: 1.0, // 100% dissatisfaction
      unresolvedHazardsCount: 8, // >= 5 = 100% hazard exposure
    });

    expect(risk.score).toBe(100);
    expect(risk.tier).toBe('high');
    expect(risk.factors.overtimeBurnout).toBe(100);
    expect(risk.factors.workplaceDissatisfaction).toBe(100);
    expect(risk.factors.safetyHazardExposure).toBe(100);
  });
});
