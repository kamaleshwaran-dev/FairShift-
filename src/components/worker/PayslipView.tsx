import React, { useState, useEffect } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { speakText, stopSpeech } from '../../domain/speech';
import {
  Volume2,
  VolumeX,
  IndianRupee,
  Clock,
  Shield,
  FileCheck,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const PayslipView: React.FC = () => {
  const { currentPayslip, currentWorker, language, t } = useFairShift();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  if (!currentPayslip) {
    return (
      <div className="p-6 text-center text-slate-500">
        <p className="text-sm">No payslip generated yet for this worker.</p>
      </div>
    );
  }

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    setSpeechError(null);
    const speechScript = t.generatePayslipSpeech({
      workerName: currentWorker.name,
      period: currentPayslip.period,
      basePay: currentPayslip.basePay,
      regularHours: currentPayslip.regularHours,
      overtimeHours: currentPayslip.overtimeHours,
      overtimePay: currentPayslip.overtimePay,
      totalDeductions: currentPayslip.totalDeductions,
      netPay: currentPayslip.netPay,
    });

    speakText(
      speechScript,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      (err) => {
        setIsSpeaking(false);
        setSpeechError(err.message);
      }
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header with Title and "Listen" Audio CTA */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-700">
              {t.periodLabel} · {currentPayslip.period}
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight mt-0.5">
              {t.payslipTitle}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {currentWorker.name} ({currentWorker.employeeCode})
            </p>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            {t.paidStatus}
          </span>
        </div>

        {/* Audio Speech Button (>48px touch target) */}
        <button
          onClick={handleToggleSpeech}
          aria-label={isSpeaking ? t.stopListening : t.listenPayslip}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm ${
            isSpeaking
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-5 h-5" />
              <span>{t.stopListening} ({t.speakingPayslip})</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              <span>{t.listenPayslip}</span>
            </>
          )}
        </button>

        {speechError && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-xl">
            {speechError}
          </p>
        )}
      </div>

      {/* Main Net Pay Hero Card */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-md space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          {t.netTakeHomePay}
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tabular-nums">
          ₹{currentPayslip.netPay.toLocaleString('en-IN')}
        </div>
        <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-1 border-t border-slate-800">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>
            Total Time: <strong className="text-white">{currentPayslip.regularHours + currentPayslip.overtimeHours} hrs</strong> (Base: {currentPayslip.regularHours}h + OT: {currentPayslip.overtimeHours}h)
          </span>
        </div>
      </div>

      {/* Transparent Breakdown Sections */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
        {/* 1. Base Earnings */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">{t.basePayLabel}</div>
              <div className="text-xs text-slate-500 font-mono">
                {currentPayslip.regularHours} hrs × ₹{currentPayslip.hourlyRate}/h
              </div>
            </div>
          </div>
          <div className="font-mono font-bold text-slate-900 text-sm tabular-nums">
            ₹{currentPayslip.basePay.toLocaleString('en-IN')}
          </div>
        </div>

        {/* 2. Overtime Earnings */}
        <div className="p-4 flex items-center justify-between bg-amber-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                <span>{t.overtimePayLabel}</span>
              </div>
              <div className="text-xs text-amber-800 font-mono font-medium">
                {currentPayslip.overtimeHours} overtime hrs @ 1.5x/2.0x
              </div>
            </div>
          </div>
          <div className="font-mono font-bold text-amber-900 text-sm tabular-nums">
            +₹{currentPayslip.overtimePay.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Gross Total Subtotal */}
        <div className="p-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>{t.grossEarnings}</span>
          <span className="font-mono tabular-nums">
            ₹{currentPayslip.grossPay.toLocaleString('en-IN')}
          </span>
        </div>

        {/* 3. Statutory Deductions Breakdown */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-slate-500" />
              {t.statutoryDeductions}
            </span>
            <span className="font-mono text-rose-700 tabular-nums">
              -₹{currentPayslip.totalDeductions.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-1.5 pl-6 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>{t.providentFund}</span>
              <span className="font-mono font-semibold text-slate-800 tabular-nums">
                ₹{currentPayslip.deductions.providentFund}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t.esiInsurance}</span>
              <span className="font-mono font-semibold text-slate-800 tabular-nums">
                ₹{currentPayslip.deductions.esiInsurance}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t.welfareFund}</span>
              <span className="font-mono font-semibold text-slate-800 tabular-nums">
                ₹{currentPayslip.deductions.welfareFund}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Transparency Guarantee */}
      <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
        <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="font-medium leading-relaxed">
          {t.transparentPayNotice}
        </p>
      </div>
    </div>
  );
};
