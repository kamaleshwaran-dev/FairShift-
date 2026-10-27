import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  UserX,
  Sparkles,
} from 'lucide-react';

export const AttritionRiskView: React.FC = () => {
  const { attritionRisks, t } = useFairShift();
  const [remediesApplied, setRemediesApplied] = useState<Record<string, string>>({});

  const handleApplyRemedy = (workerId: string) => {
    setRemediesApplied((prev) => ({
      ...prev,
      [workerId]: 'Retention package applied: 2-day recovery cycle scheduled & supervisor meeting logged.',
    }));
  };

  return (
    <div className="space-y-6">
      {/* Title & Methodology Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <TrendingDown className="w-4 h-4" />
          <span>Rule-Based Frontline Worker Retention Model</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {t.attritionTitle}
        </h2>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          {t.attritionSubtitle} Instead of black-box AI, this engine relies on an explainable, deterministic formula derived from occupational labor research:
        </p>

        {/* Formula Explainer Strip */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-800 space-y-1">
          <div className="font-bold text-slate-900">
            Attrition Score = (45% × Overtime Exhaustion) + (35% × Dissatisfaction) + (20% × Hazard Exposure)
          </div>
          <p className="text-[11px] font-sans text-slate-500">
            Enables site directors to step in before valuable certified tradespeople and hospital staff resign.
          </p>
        </div>
      </div>

      {/* Worker Risk Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Flight Risk Analysis by Worker ({attritionRisks.length} Evaluated)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attritionRisks.map((risk) => {
            const isHigh = risk.tier === 'high';
            const isMedium = risk.tier === 'medium';
            const remedy = remediesApplied[risk.workerId];

            return (
              <div
                key={risk.workerId}
                className={`p-5 rounded-3xl border shadow-sm space-y-4 transition-all ${
                  isHigh
                    ? 'bg-rose-50/50 border-rose-300'
                    : isMedium
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {risk.workerName}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {risk.roleTitle}
                    </p>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-2xl font-black font-mono tabular-nums leading-none ${
                        isHigh ? 'text-rose-700' : isMedium ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {risk.score}%
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isHigh ? 'text-rose-600' : isMedium ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {isHigh ? t.highRisk.split(' ')[0] : isMedium ? t.mediumRisk.split(' ')[0] : t.lowRisk.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Contributing Factor Progress Bars */}
                <div className="space-y-2 pt-1 text-xs">
                  {/* Factor 1: Overtime Burnout */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>{t.burnoutFactor} (45% wgt)</span>
                      <span className="font-mono font-bold text-slate-800">
                        {risk.factors.overtimeBurnout}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${risk.factors.overtimeBurnout}%` }}
                        className="h-full bg-rose-500 rounded-full transition-all"
                      />
                    </div>
                  </div>

                  {/* Factor 2: Workplace Dissatisfaction */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>{t.dissatisfactionFactor} (35% wgt)</span>
                      <span className="font-mono font-bold text-slate-800">
                        {risk.factors.workplaceDissatisfaction}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${risk.factors.workplaceDissatisfaction}%` }}
                        className="h-full bg-amber-500 rounded-full transition-all"
                      />
                    </div>
                  </div>

                  {/* Factor 3: Hazard Exposure */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>{t.safetyHazardFactor} (20% wgt)</span>
                      <span className="font-mono font-bold text-slate-800">
                        {risk.factors.safetyHazardExposure}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${risk.factors.safetyHazardExposure}%` }}
                        className="h-full bg-blue-500 rounded-full transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Key Drivers */}
                <div className="p-3 bg-white/90 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800">Key Risk Drivers:</span>
                  <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                    {risk.keyDrivers.map((driver, i) => (
                      <li key={i}>{driver}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendation Strategy & Remedy */}
                <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-2xl text-xs space-y-2">
                  <div>
                    <span className="font-bold text-blue-950">Recommended Strategy:</span>
                    <p className="text-blue-900 text-[11px] mt-0.5 leading-relaxed">
                      {risk.recommendedAction}
                    </p>
                  </div>

                  {isHigh && (
                    <div className="pt-1">
                      {remedy ? (
                        <div className="p-2 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{remedy}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApplyRemedy(risk.workerId)}
                          aria-label={`Apply retention remedy to ${risk.workerName}`}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t.takePreventiveAction}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
