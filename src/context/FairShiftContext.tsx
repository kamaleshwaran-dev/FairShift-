import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sector,
  Language,
  UserRole,
  WorkerProfile,
  ShiftRecord,
  Payslip,
  SafetyReport,
  FeedbackSubmission,
  Certification,
  FatigueAlert,
  AttritionRisk,
  ReportStatus,
} from '../domain/types';
import {
  constructionData,
  hospitalData,
  SectorDataset,
} from '../domain/demoData';
import { translations, Translations } from '../domain/translations';
import {
  calculateOvertime,
  calculatePayslipBreakdown,
  evaluateFatigueAlert,
  calculateAttritionRisk,
  ShiftTimeInterval,
} from '../domain/calculations';

interface FairShiftContextType {
  sector: Sector;
  setSector: (s: Sector) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  role: UserRole;
  setRole: (r: UserRole) => void;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (p: boolean) => void;
  activeWorkerId: string;
  setActiveWorkerId: (id: string) => void;
  currentWorker: WorkerProfile;
  allWorkersInSector: WorkerProfile[];
  t: Translations;

  // Active Worker Data
  activeShiftDurationHours: number;
  activeShiftCalculation: ReturnType<typeof calculateOvertime> | null;
  currentPayslip: Payslip | null;
  currentCertifications: Certification[];
  currentWorkerShifts: ShiftRecord[];

  // Datasets
  sectorData: SectorDataset;
  allSafetyReports: SafetyReport[];
  allFeedback: FeedbackSubmission[];

  // Actions
  checkInShift: (method: 'qr' | 'gps') => void;
  checkOutShift: () => ShiftRecord;
  simulateAdvanceHour: () => void;
  submitSafetyReport: (
    report: Omit<SafetyReport, 'id' | 'sector' | 'reportedAt' | 'status'> & { sector?: Sector }
  ) => void;
  updateSafetyReportStatus: (id: string, status: ReportStatus, notes?: string) => void;
  submitFeedback: (fb: Omit<FeedbackSubmission, 'id' | 'sector' | 'timestamp'>) => void;
  resetDemoData: () => void;

  // Admin Analytics
  fatigueAlerts: FatigueAlert[];
  attritionRisks: AttritionRisk[];
  openHazardsCount: number;
  averageSatisfactionRating: number;
  totalWeeklyOvertimeHours: number;
}

const FairShiftContext = createContext<FairShiftContextType | null>(null);

const STORAGE_KEY_PREFIX = 'fairshift_data_v1_';

export const FairShiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent language
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('fairshift_lang');
      if (saved === 'ta' || saved === 'hi' || saved === 'en') return saved;
    } catch {}
    return 'en';
  });

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    try {
      localStorage.setItem('fairshift_lang', l);
    } catch {}
  };

  const [sector, setSectorState] = useState<Sector>('construction');
  const [role, setRole] = useState<UserRole>('worker');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Sector Data state with resilient merging
  const [datasets, setDatasets] = useState<{
    construction: SectorDataset;
    hospital: SectorDataset;
  }>(() => {
    try {
      const cRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}construction`);
      const hRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}hospital`);

      const c = cRaw ? JSON.parse(cRaw) : null;
      const h = hRaw ? JSON.parse(hRaw) : null;

      return {
        construction: {
          ...constructionData,
          ...(c || {}),
          safetyReports:
            c?.safetyReports && Array.isArray(c.safetyReports) && c.safetyReports.length > 0
              ? c.safetyReports
              : constructionData.safetyReports,
          workers: c?.workers?.length ? c.workers : constructionData.workers,
          shifts: c?.shifts?.length ? c.shifts : constructionData.shifts,
          payslips: c?.payslips?.length ? c.payslips : constructionData.payslips,
          feedback: c?.feedback?.length ? c.feedback : constructionData.feedback,
          certifications: c?.certifications?.length ? c.certifications : constructionData.certifications,
        },
        hospital: {
          ...hospitalData,
          ...(h || {}),
          safetyReports:
            h?.safetyReports && Array.isArray(h.safetyReports) && h.safetyReports.length > 0
              ? h.safetyReports
              : hospitalData.safetyReports,
          workers: h?.workers?.length ? h.workers : hospitalData.workers,
          shifts: h?.shifts?.length ? h.shifts : hospitalData.shifts,
          payslips: h?.payslips?.length ? h.payslips : hospitalData.payslips,
          feedback: h?.feedback?.length ? h.feedback : hospitalData.feedback,
          certifications: h?.certifications?.length ? h.certifications : hospitalData.certifications,
        },
      };
    } catch {
      return { construction: constructionData, hospital: hospitalData };
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}construction`,
        JSON.stringify(datasets.construction)
      );
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}hospital`,
        JSON.stringify(datasets.hospital)
      );
    } catch {}
  }, [datasets]);

  // Active worker selector
  const [activeWorkerId, setActiveWorkerId] = useState<string>('w-c-1');

  // When sector switches, auto-switch to default worker of that sector
  const setSector = (newSector: Sector) => {
    setSectorState(newSector);
    const firstWorker = datasets[newSector].workers[0];
    if (firstWorker) {
      setActiveWorkerId(firstWorker.id);
    }
  };

  const currentSectorData = datasets[sector];

  const currentWorker = useMemo(() => {
    const found = currentSectorData.workers.find((w) => w.id === activeWorkerId);
    return found || currentSectorData.workers[0];
  }, [currentSectorData.workers, activeWorkerId]);

  // Translation bundle
  const t = translations[language] || translations.en;

  // Timer tick for active shift duration
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute active shift elapsed hours
  const activeShiftDurationHours = useMemo(() => {
    if (!currentWorker.activeCheckIn) return 0;
    const start = new Date(currentWorker.activeCheckIn.startTime).getTime();
    const diffMs = Math.max(0, now - start);
    return diffMs / (1000 * 60 * 60);
  }, [currentWorker.activeCheckIn, now]);

  // Active shift calculations
  const activeShiftCalculation = useMemo(() => {
    if (!currentWorker.activeCheckIn) return null;
    return calculateOvertime(activeShiftDurationHours, currentWorker.hourlyRate);
  }, [currentWorker.activeCheckIn, activeShiftDurationHours, currentWorker.hourlyRate]);

  // Worker's latest payslip
  const currentPayslip = useMemo(() => {
    return (
      currentSectorData.payslips.find((p) => p.workerId === currentWorker.id) ||
      currentSectorData.payslips[0] ||
      null
    );
  }, [currentSectorData.payslips, currentWorker.id]);

  // Worker's certificates
  const currentCertifications = useMemo(() => {
    return currentSectorData.certifications.filter(
      (c) => c.workerId === currentWorker.id
    );
  }, [currentSectorData.certifications, currentWorker.id]);

  // Worker's shift history
  const currentWorkerShifts = useMemo(() => {
    return currentSectorData.shifts.filter(
      (s) => s.workerId === currentWorker.id
    );
  }, [currentSectorData.shifts, currentWorker.id]);

  // Action: Check-in shift
  const checkInShift = (method: 'qr' | 'gps') => {
    const location =
      sector === 'construction'
        ? 'Metro Rail Phase 3 · South Gate QR Verified'
        : 'District General Hospital · Trauma Care GPS Beacon';

    setDatasets((prev) => ({
      ...prev,
      [sector]: {
        ...prev[sector],
        workers: prev[sector].workers.map((w) =>
          w.id === currentWorker.id
            ? {
                ...w,
                activeCheckIn: {
                  startTime: new Date().toISOString(),
                  simulatedLocation: location,
                  checkInMethod: method,
                },
              }
            : w
        ),
      },
    }));
  };

  // Action: Check-out shift & finalize overtime
  const checkOutShift = (): ShiftRecord => {
    const hoursWorked = Math.max(0.5, activeShiftDurationHours);
    const calc = calculateOvertime(hoursWorked, currentWorker.hourlyRate);
    const deductions = calculatePayslipBreakdown(calc.grossPay);

    const nowIso = new Date().toISOString();
    const dateStr = nowIso.slice(0, 10);
    const startIso = currentWorker.activeCheckIn?.startTime || new Date(Date.now() - 8 * 3600000).toISOString();

    const newShift: ShiftRecord = {
      id: `s-${Date.now()}`,
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      sector,
      date: dateStr,
      startTime: new Date(startIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalHours: calc.totalHours,
      regularHours: calc.regularHours,
      overtimeHours: calc.overtimeHours,
      hourlyRate: currentWorker.hourlyRate,
      overtimeRate: currentWorker.hourlyRate * 1.5,
      basePay: calc.regularPay,
      overtimePay: calc.overtimePay,
      grossPay: calc.grossPay,
      status: 'completed',
    };

    setDatasets((prev) => {
      const updatedWorkers = prev[sector].workers.map((w) =>
        w.id === currentWorker.id ? { ...w, activeCheckIn: null } : w
      );

      // Update existing payslip with new hours
      const updatedPayslips = prev[sector].payslips.map((p) => {
        if (p.workerId === currentWorker.id) {
          const newGross = p.grossPay + calc.grossPay;
          const newDeds = calculatePayslipBreakdown(newGross);
          return {
            ...p,
            regularHours: p.regularHours + calc.regularHours,
            basePay: p.basePay + calc.regularPay,
            overtimeHours: p.overtimeHours + calc.overtimeHours,
            overtimePay: p.overtimePay + calc.overtimePay,
            grossPay: newGross,
            deductions: {
              providentFund: newDeds.providentFund,
              esiInsurance: newDeds.esiInsurance,
              welfareFund: newDeds.welfareFund,
            },
            totalDeductions: newDeds.totalDeductions,
            netPay: newDeds.netPay,
          };
        }
        return p;
      });

      return {
        ...prev,
        [sector]: {
          ...prev[sector],
          workers: updatedWorkers,
          shifts: [newShift, ...prev[sector].shifts],
          payslips: updatedPayslips,
        },
      };
    });

    return newShift;
  };

  // Action: Advance simulated shift by +1 hour (convenient for reviewers!)
  const simulateAdvanceHour = () => {
    if (!currentWorker.activeCheckIn) return;
    const currentStart = new Date(currentWorker.activeCheckIn.startTime).getTime();
    // Move start time 1 hour backwards in time, so elapsed duration grows by +1 hour
    const updatedStart = new Date(currentStart - 60 * 60 * 1000).toISOString();

    setDatasets((prev) => ({
      ...prev,
      [sector]: {
        ...prev[sector],
        workers: prev[sector].workers.map((w) =>
          w.id === currentWorker.id && w.activeCheckIn
            ? {
                ...w,
                activeCheckIn: {
                  ...w.activeCheckIn,
                  startTime: updatedStart,
                },
              }
            : w
        ),
      },
    }));
  };

  // Action: Submit safety report
  const submitSafetyReport = (
    report: Omit<SafetyReport, 'id' | 'sector' | 'reportedAt' | 'status'> & { sector?: Sector }
  ) => {
    const targetSector = report.sector || sector;
    const newReport: SafetyReport = {
      ...report,
      id: `rep-${Date.now()}`,
      sector: targetSector,
      status: 'reported',
      reportedAt: new Date().toISOString(),
    };

    setDatasets((prev) => ({
      ...prev,
      [targetSector]: {
        ...prev[targetSector],
        safetyReports: [newReport, ...(prev[targetSector]?.safetyReports || [])],
      },
    }));
  };

  // Action: Update safety report status (Admin action - updates across sectors)
  const updateSafetyReportStatus = (
    reportId: string,
    status: ReportStatus,
    resolutionNotes?: string
  ) => {
    setDatasets((prev) => {
      const updateList = (list: SafetyReport[] = []) =>
        list.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status,
                resolutionNotes: resolutionNotes !== undefined ? resolutionNotes : r.resolutionNotes,
                resolvedAt: status === 'resolved' ? (r.resolvedAt || new Date().toISOString()) : undefined,
              }
            : r
        );

      return {
        ...prev,
        construction: {
          ...prev.construction,
          safetyReports: updateList(prev.construction?.safetyReports),
        },
        hospital: {
          ...prev.hospital,
          safetyReports: updateList(prev.hospital?.safetyReports),
        },
      };
    });
  };

  // Action: Submit anonymous feedback
  const submitFeedback = (
    fb: Omit<FeedbackSubmission, 'id' | 'sector' | 'timestamp'>
  ) => {
    const newFb: FeedbackSubmission = {
      ...fb,
      id: `fb-${Date.now()}`,
      sector,
      timestamp: new Date().toISOString(),
    };

    setDatasets((prev) => ({
      ...prev,
      [sector]: {
        ...prev[sector],
        feedback: [newFb, ...prev[sector].feedback],
      },
    }));
  };

  // Action: Reset all demo data
  const resetDemoData = () => {
    setDatasets({
      construction: constructionData,
      hospital: hospitalData,
    });
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}construction`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}hospital`);
  };

  // --- Admin Analytics Computation ---

  // Unresolved hazards count
  const openHazardsCount = useMemo(() => {
    return currentSectorData.safetyReports.filter((r) => r.status !== 'resolved').length;
  }, [currentSectorData.safetyReports]);

  // Average workplace satisfaction score
  const averageSatisfactionRating = useMemo(() => {
    const fbs = currentSectorData.feedback;
    if (fbs.length === 0) return 4.0;
    const total = fbs.reduce(
      (sum, f) =>
        sum +
        (f.ratingManager + f.ratingConditions + f.ratingRestBreaks + f.ratingFairShifts) / 4,
      0
    );
    return Math.round((total / fbs.length) * 10) / 10;
  }, [currentSectorData.feedback]);

  // Total weekly overtime hours in sector
  const totalWeeklyOvertimeHours = useMemo(() => {
    return currentSectorData.shifts.reduce((sum, s) => sum + s.overtimeHours, 0);
  }, [currentSectorData.shifts]);

  // Fatigue alerts across workers
  const fatigueAlerts = useMemo(() => {
    return currentSectorData.workers.map((worker) => {
      const workerShifts = currentSectorData.shifts.filter((s) => s.workerId === worker.id);

      // Convert shifts to time intervals for fatigue checking
      const intervals: ShiftTimeInterval[] = workerShifts.map((s) => ({
        date: s.date,
        startIso: `${s.date}T${s.startTime.padStart(5, '0')}:00Z`,
        endIso: `${s.date}T${s.endTime.padStart(5, '0')}:00Z`,
        hours: s.totalHours,
      }));

      return evaluateFatigueAlert({
        workerId: worker.id,
        workerName: worker.name,
        roleTitle: worker.roleTitle,
        sector,
        shiftsInWeek: intervals,
      });
    });
  }, [currentSectorData.workers, currentSectorData.shifts, sector]);

  // Attrition risk scores across workers
  const attritionRisks = useMemo(() => {
    return currentSectorData.workers.map((worker) => {
      const workerShifts = currentSectorData.shifts.filter((s) => s.workerId === worker.id);
      const weeklyOvertimeHours = workerShifts.reduce((sum, s) => sum + s.overtimeHours, 0);

      return calculateAttritionRisk({
        workerId: worker.id,
        workerName: worker.name,
        roleTitle: worker.roleTitle,
        sector,
        weeklyOvertimeHours,
        averageSatisfactionRating,
        unresolvedHazardsCount: openHazardsCount,
      });
    });
  }, [
    currentSectorData.workers,
    currentSectorData.shifts,
    sector,
    averageSatisfactionRating,
    openHazardsCount,
  ]);

  // All safety reports across both sectors
  const allSafetyReports = useMemo(() => {
    const list = [
      ...(datasets.construction?.safetyReports || []),
      ...(datasets.hospital?.safetyReports || []),
    ];
    return list.sort(
      (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    );
  }, [datasets]);

  return (
    <FairShiftContext.Provider
      value={{
        sector,
        setSector,
        language,
        setLanguage,
        role,
        setRole,
        isPhoneFrame,
        setIsPhoneFrame,
        activeWorkerId,
        setActiveWorkerId,
        currentWorker,
        allWorkersInSector: currentSectorData.workers,
        t,
        activeShiftDurationHours,
        activeShiftCalculation,
        currentPayslip,
        currentCertifications,
        currentWorkerShifts,
        sectorData: currentSectorData,
        allSafetyReports,
        allFeedback: currentSectorData.feedback,
        checkInShift,
        checkOutShift,
        simulateAdvanceHour,
        submitSafetyReport,
        updateSafetyReportStatus,
        submitFeedback,
        resetDemoData,
        fatigueAlerts,
        attritionRisks,
        openHazardsCount,
        averageSatisfactionRating,
        totalWeeklyOvertimeHours,
      }}
    >
      {children}
    </FairShiftContext.Provider>
  );
};

export const useFairShift = () => {
  const context = useContext(FairShiftContext);
  if (!context) {
    throw new Error('useFairShift must be used within FairShiftProvider');
  }
  return context;
};
