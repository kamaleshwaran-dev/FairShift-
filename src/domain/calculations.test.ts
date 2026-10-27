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
  const hourlyRate = 100; // ₹100/hr for straightforward math

  it('calculates standard 8-hour shift with 0 overtime', () => {
    const result = calculateOvertime(8, hourlyRate);
    expect(result.totalHours).toBe(8);
    expect(result.regularHours).toBe(8);
    expect(result.overtimeHours).toBe(0);
    expect(result.regularPay).toBe(800);
    expect(result.overtimePay).toBe(0);
    expect(result.grossPay).toBe(800);
  });

  it('calculates sub-8 hour shift correctly', () => {
    const result = calculateOvertime(5.5, hourlyRate);
    expect(result.totalHours).toBe(5.5);
    expect(result.regularHours).toBe(5.5);
    expect(result.overtimeHours).toBe(0);
    expect(result.regularPay).toBe(550);
    expect(result.overtimePay).toBe(0);
    expect(result.grossPay).toBe(550);
  });

  it('calculates overtime beyond 8 hours at 1.5x multiplier', () => {
    // 10 hours = 8 regular + 2 overtime @ 1.5x (₹150/hr)
    const result = calculateOvertime(10, hourlyRate);
    expect(result.totalHours).toBe(10);
    expect(result.regularHours).toBe(8);
    expect(result.overtimeHours).toBe(2);
    expect(result.regularPay).toBe(800);
    expect(result.overtimePay).toBe(300); // 2 * 150
    expect(result.grossPay).toBe(1100);
  });

  it('calculates double-time overtime beyond 12 hours (2.0x multiplier)', () => {
    // 14 hours = 8 reg (800) + 4 hours @ 1.5x (600) + 2 hours @ 2.0x (400) = 1800
    const result = calculateOvertime(14, hourlyRate);
    expect(result.totalHours).toBe(14);
    expect(result.regularHours).toBe(8);
    expect(result.overtimeHours).toBe(6);
    expect(result.regularPay).toBe(800);
    expect(result.overtimePay).toBe(1000); // 4 * 150 + 2 * 200
    expect(result.grossPay).toBe(1800);
  });

  it('handles 0 or negative inputs gracefully', () => {
    const result = calculateOvertime(0, hourlyRate);
    expect(result.totalHours).toBe(0);
    expect(result.grossPay).toBe(0);
  });
});

describe('FairShift Payslip Statutory Deductions', () => {
  it('correctly calculates PF, ESI, Welfare, and Net Pay', () => {
    const grossPay = 10000;
    const breakdown = calculatePayslipBreakdown(grossPay);

    expect(breakdown.providentFund).toBe(1200); // 12%
    expect(breakdown.esiInsurance).toBe(75);    // 0.75%
    expect(breakdown.welfareFund).toBe(25);     // ₹25 flat
    expect(breakdown.totalDeductions).toBe(1300);
    expect(breakdown.netPay).toBe(8700);
  });
});

describe('FairShift Fatigue Detection', () => {
  it('detects back-to-back shift turnaround with under 10 hours rest', () => {
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

  it('passes turnaround check when rest exceeds 10 hours', () => {
    const shifts: ShiftTimeInterval[] = [
      {
        date: '2026-10-25',
        startIso: '2026-10-25T08:00:00Z',
        endIso: '2026-10-25T17:00:00Z', // finishes at 17:00
        hours: 9,
      },
      {
        date: '2026-10-26',
        startIso: '2026-10-26T08:00:00Z', // starts at 08:00 next day (15 hour gap)
        endIso: '2026-10-26T17:00:00Z',
        hours: 9,
      },
    ];

    const turnaround = checkBackToBackTurnaround(shifts, 10);
    expect(turnaround.hasViolation).toBe(false);
    expect(turnaround.minRestGapHours).toBe(15);
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
});
