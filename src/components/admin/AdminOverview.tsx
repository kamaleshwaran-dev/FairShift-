import React from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  Users,
  Clock,
  AlertTriangle,
  Heart,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  Cross,
} from 'lucide-react';

export const AdminOverview: React.FC<{
  onNavigateTab: (tab: 'fatigue' | 'attrition' | 'safety') => void;
}> = ({ onNavigateTab }) => {
  const {
    sectorData,
    fatigueAlerts,
    attritionRisks,
    openHazardsCount,
    averageSatisfactionRating,
    totalWeeklyOvertimeHours,
    updateSafetyReportStatus,
    sector,
    t,
  } = useFairShift();

  const activeCheckedInWorkers = sectorData.workers.filter((w) => Boolean(w.activeCheckIn));
  const criticalFatigueCount = fatigueAlerts.filter((a) => a.fatigueLevel === 'critical').length;
  const highAttritionCount = attritionRisks.filter((r) => r.tier === 'high').length;

  // Daily attendance mock trends for current sector
  const dailyTrends = [
    { day: 'Mon', attendance: 24, overtimeHrs: 18 },
    { day: 'Tue', attendance: 26, overtimeHrs: 22 },
    { day: 'Wed', attendance: 25, overtimeHrs: 29 },
    { day: 'Thu', attendance: 27, overtimeHrs: 34 },
    { day: 'Fri', attendance: 28, overtimeHrs: 38 },
    { day: 'Sat', attendance: 22, overtimeHrs: 24 },
    { day: 'Sun', attendance: 15, overtimeHrs: 16 },
  ];

  return (
    <div className="space-y-6">
      {/* Sector Badge & Context Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
              sector === 'construction' ? 'bg-amber-600' : 'bg-teal-600'
            }`}
          >
            {sector === 'construction' ? <HardHat className="w-6 h-6" /> : <Cross className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Sector Monitoring
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {sector === 'construction' ? t.constructionSector : t.hospitalSector}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {criticalFatigueCount > 0 && (
            <button
              onClick={() => onNavigateTab('fatigue')}
              className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-100 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{criticalFatigueCount} Critical Fatigue Alert(s)</span>
            </button>
          )}

          {highAttritionCount > 0 && (
            <button
              onClick={() => onNavigateTab('attrition')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>{highAttritionCount} Attrition Flight Risk(s)</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active On-site Workers */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>{t.metricActiveWorkers}</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {activeCheckedInWorkers.length} <span className="text-xs font-sans text-slate-500">/ {sectorData.workers.length} active</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Geo-verified check-ins recorded at access portals
          </p>
        </div>

        {/* KPI 2: Weekly Overtime Hours */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>{t.metricWeeklyOvertime}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-900 font-mono tabular-nums">
            {totalWeeklyOvertimeHours.toFixed(1)}h
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Accumulated hours beyond standard 8h day
          </p>
        </div>

        {/* KPI 3: Open Safety Reports */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>{t.metricOpenHazards}</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {openHazardsCount}
          </div>
          <button
            onClick={() => onNavigateTab('safety')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Review Hazard Resolution Board →
          </button>
        </div>

        {/* KPI 4: Workplace Health Index */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>{t.metricSatisfactionScore}</span>
            <Heart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {averageSatisfactionRating.toFixed(1)} <span className="text-xs font-sans text-slate-500">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Aggregated anonymous worker condition ratings
          </p>
        </div>
      </div>

      {/* Analytics & Trend Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance & Overtime Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Weekly Attendance & Overtime Volume
              </h3>
              <p className="text-xs text-slate-500">
                Monitored shift attendance vs. overtime hours over rolling 7 days
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-700">
                <span className="w-3 h-3 bg-blue-600 rounded-sm" /> Attendance
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-3 h-3 bg-amber-500 rounded-sm" /> Overtime (hrs)
              </span>
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-64 w-full pt-4">
            <div className="h-48 flex items-end justify-between gap-2 border-b border-slate-200 px-2">
              {dailyTrends.map((d) => {
                const attendanceHeight = (d.attendance / 35) * 100;
                const overtimeHeight = (d.overtimeHrs / 40) * 100;

                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Attendance Bar */}
                      <div
                        style={{ height: `${attendanceHeight}%` }}
                        className="w-1/2 max-w-[28px] bg-blue-600 rounded-t-md hover:bg-blue-700 transition-all relative group/bar"
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity font-mono pointer-events-none whitespace-nowrap">
                          {d.attendance} workers
                        </span>
                      </div>
                      {/* Overtime Bar */}
                      <div
                        style={{ height: `${overtimeHeight}%` }}
                        className="w-1/2 max-w-[28px] bg-amber-500 rounded-t-md hover:bg-amber-600 transition-all relative group/bar"
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity font-mono pointer-events-none whitespace-nowrap">
                          {d.overtimeHrs}h OT
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 font-mono">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Shift Allocation & Compliance Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">
            Decent Work Compliance Status
          </h3>

          <div className="space-y-3 text-xs">
            {/* Rule 1: 8h Daily Cap */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Daily 8h Standard</span>
                <span className="text-emerald-700 font-mono">Enforced (1.5x Multiplier)</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                All working hours beyond 8h automatically increment payroll ledger.
              </p>
            </div>

            {/* Rule 2: 60h Weekly Cap */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Weekly 60h Safety Ceiling</span>
                <span className={criticalFatigueCount > 0 ? 'text-rose-700 font-mono' : 'text-emerald-700 font-mono'}>
                  {criticalFatigueCount > 0 ? `${criticalFatigueCount} Exceeded` : '100% Compliant'}
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Immediate 24-hour mandatory rest triggered when worker breaches limit.
              </p>
            </div>

            {/* Rule 3: 10h Turnaround Rest */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>10h Rest Gap Guarantee</span>
                <span className="text-amber-700 font-mono">Monitored</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Prevents back-to-back shift scheduling without adequate circadian sleep.
              </p>
            </div>

            {/* Rule 4: Unexplained Deductions */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Deduction Transparency</span>
                <span className="text-emerald-700 font-mono">Verified Zero Hidden Fees</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Only statutory PF, ESI, and Welfare fund deductions are permitted.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Safety Hazard Incidents Section on Dashboard Overview */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">
                Active Safety Incidents & Hazard Reports
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                {openHazardsCount} Open
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Hazards reported by frontline workers via voice or text in {sector === 'construction' ? 'Construction' : 'Hospital'} sector
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('safety')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>Full Safety Resolution Board →</span>
          </button>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {sectorData.safetyReports.slice(0, 4).map((report) => (
            <div
              key={report.id}
              className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200 text-xs space-y-2.5 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {report.title}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        report.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : report.severity === 'high'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {report.severity} Priority
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                    <span>{new Date(report.reportedAt).toLocaleString()}</span>
                    <span>·</span>
                    <span className="capitalize">{report.inputMethod} submission</span>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 ${
                    report.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : report.status === 'in_review'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {report.status === 'resolved'
                    ? t.statusResolved
                    : report.status === 'in_review'
                    ? t.statusInReview
                    : t.statusReported}
                </span>
              </div>

              <p className="text-slate-700 text-xs leading-relaxed">
                {report.description}
              </p>

              {report.resolutionNotes && (
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-950 text-[11px] border border-emerald-200">
                  <strong className="text-emerald-800">Resolution:</strong> {report.resolutionNotes}
                </div>
              )}

              {/* Status Action Controls */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Category: <strong className="text-slate-700 capitalize">{report.category.replace(/_/g, ' ')}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {report.status === 'reported' && (
                    <button
                      onClick={() => updateSafetyReportStatus(report.id, 'in_review')}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors"
                    >
                      {t.markInReview}
                    </button>
                  )}
                  {report.status !== 'resolved' && (
                    <button
                      onClick={() => updateSafetyReportStatus(report.id, 'resolved', 'Verified and resolved by site safety manager.')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      {t.markResolved}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
