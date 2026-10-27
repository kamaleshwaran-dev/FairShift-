import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Bed,
  UserCheck,
  ShieldAlert,
  Flame,
} from 'lucide-react';

export const FatigueAlerts: React.FC = () => {
  const { fatigueAlerts, t } = useFairShift();
  const [interventions, setInterventions] = useState<Record<string, string>>({});

  const handleApplyIntervention = (workerId: string, actionText: string) => {
    setInterventions((prev) => ({
      ...prev,
      [workerId]: actionText,
    }));
  };

  const criticalAlerts = fatigueAlerts.filter((a) => a.fatigueLevel === 'critical');
  const moderateAlerts = fatigueAlerts.filter((a) => a.fatigueLevel === 'moderate');
  const normalAlerts = fatigueAlerts.filter((a) => a.fatigueLevel === 'normal');

  return (
    <div className="space-y-6">
      {/* Title & Threshold Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Fatigue & Overtaxing Early Warning System</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {t.fatigueTitle}
        </h2>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          {t.fatigueSubtitle} Complies with ILO conventions and national factory limits to eliminate fatal night-shift mishaps, heavy equipment collisions, and clinical exhaustion.
        </p>

        {/* Threshold Rules Summary */}
        <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5">
            <Flame className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-950">60-Hour Weekly Hard Cap:</span>
              <p className="text-rose-800 text-[11px] mt-0.5">
                Workers exceeding 60 hours in a 7-day period are immediately flagged for mandatory rest.
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950">10-Hour Circadian Rest Gap:</span>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Turnaround between consecutive shifts under 10 hours triggers a quick-turnaround violation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fatigue Alerts Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Worker Roster Fatigue Audit ({fatigueAlerts.length} Monitored Personnel)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fatigueAlerts.map((alert) => {
            const isCritical = alert.fatigueLevel === 'critical';
            const isModerate = alert.fatigueLevel === 'moderate';
            const actionTaken = interventions[alert.workerId];

            return (
              <div
                key={alert.workerId}
                className={`p-5 rounded-3xl border shadow-sm space-y-4 transition-all ${
                  isCritical
                    ? 'bg-rose-50/70 border-rose-300'
                    : isModerate
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">
                        {alert.workerName}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {alert.roleTitle}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shrink-0 ${
                      isCritical
                        ? 'bg-rose-600 text-white'
                        : isModerate
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isCritical ? 'Critical Fatigue' : isModerate ? 'Moderate Risk' : 'Normal'}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/90 rounded-2xl border border-slate-200/80">
                    <span className="text-slate-500 font-medium">Weekly Total Hours:</span>
                    <div className={`text-xl font-mono font-extrabold tabular-nums mt-0.5 ${
                      alert.isOver60Hours ? 'text-rose-700' : 'text-slate-900'
                    }`}>
                      {alert.weeklyHours}h
                      {alert.isOver60Hours && (
                        <span className="text-xs font-sans font-bold text-rose-600 ml-1.5">
                          (&gt; 60h!)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-white/90 rounded-2xl border border-slate-200/80">
                    <span className="text-slate-500 font-medium">Consecutive Rest Gap:</span>
                    <div className={`text-xl font-mono font-extrabold tabular-nums mt-0.5 ${
                      alert.hasBackToBackShift ? 'text-amber-700' : 'text-slate-900'
                    }`}>
                      {alert.restGapHours !== undefined ? `${alert.restGapHours}h` : 'N/A'}
                      {alert.hasBackToBackShift && (
                        <span className="text-xs font-sans font-bold text-amber-700 ml-1.5">
                          (&lt; 10h)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommendation Advice */}
                <div className="p-3 bg-white/80 rounded-2xl border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-800">Compliance Protocol:</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {alert.mitigationAdvice}
                  </p>
                </div>

                {/* Admin Interventions Action Buttons */}
                {(isCritical || isModerate) && (
                  <div className="pt-1 space-y-2">
                    {actionTaken ? (
                      <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{actionTaken}</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            handleApplyIntervention(
                              alert.workerId,
                              '24-Hour Mandatory Rest Order Issued and Logged.'
                            )
                          }
                          aria-label={`Issue 24h rest to ${alert.workerName}`}
                          className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Bed className="w-3.5 h-3.5 text-blue-400" />
                          <span>{t.sendRestOrder}</span>
                        </button>
                        <button
                          onClick={() =>
                            handleApplyIntervention(
                              alert.workerId,
                              'Next Shift Rebalanced to Backup Relief Personnel.'
                            )
                          }
                          aria-label={`Reassign next shift for ${alert.workerName}`}
                          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{t.reassignShift}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
