import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { startVoiceRecognition, isSpeechRecognitionSupported } from '../../domain/speech';
import { HazardCategory, HazardSeverity } from '../../domain/types';
import {
  Mic,
  MicOff,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertOctagon,
  FileText,
  Radio,
} from 'lucide-react';

export const SafetyReporter: React.FC = () => {
  const { sectorData, submitSafetyReport, language, sector, t } = useFairShift();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HazardCategory>(
    sector === 'construction' ? 'fall_protection' : 'biohazard_needle'
  );
  const [severity, setSeverity] = useState<HazardSeverity>('high');
  const [inputMethod, setInputMethod] = useState<'voice' | 'text'>('text');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const stopVoiceRef = React.useRef<(() => void) | null>(null);

  const handleToggleVoice = () => {
    if (isRecording) {
      if (stopVoiceRef.current) {
        stopVoiceRef.current();
        stopVoiceRef.current = null;
      }
      setIsRecording(false);
      return;
    }

    setVoiceError(null);
    setInputMethod('voice');

    const stop = startVoiceRecognition({
      lang: language,
      onStart: () => setIsRecording(true),
      onInterimResult: (interim) => setInterimTranscript(interim),
      onFinalResult: (final) => {
        setDescription((prev) => (prev ? `${prev} ${final}` : final));
        if (!title) {
          setTitle(final.slice(0, 40));
        }
        setInterimTranscript('');
        setIsRecording(false);
      },
      onError: (msg) => {
        setVoiceError(msg);
        setIsRecording(false);
      },
      onEnd: () => setIsRecording(false),
    });

    stopVoiceRef.current = stop;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitSafetyReport({
      title: title.trim() || description.slice(0, 40) + '...',
      description: description.trim(),
      category,
      severity,
      inputMethod,
      audioDurationSeconds: inputMethod === 'voice' ? 12 : undefined,
    });

    setTitle('');
    setDescription('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const categoryOptions: { id: HazardCategory; label: string }[] =
    sector === 'construction'
      ? [
          { id: 'fall_protection', label: t.catFallProtection },
          { id: 'machinery_scaffold', label: t.catMachineryScaffold },
          { id: 'chemical_dust', label: t.catChemicalDust },
          { id: 'ppe_shortage', label: t.catPpeShortage },
          { id: 'excessive_heat_noise', label: t.catExcessiveHeatNoise },
          { id: 'other', label: t.catOther },
        ]
      : [
          { id: 'biohazard_needle', label: t.catBiohazardNeedle },
          { id: 'ergonomic_heavy_lift', label: t.catErgonomicHeavyLift },
          { id: 'ppe_shortage', label: t.catPpeShortage },
          { id: 'chemical_dust', label: t.catChemicalDust },
          { id: 'other', label: t.catOther },
        ];

  return (
    <div className="p-4 space-y-4">
      {/* Title Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 leading-tight">
          {t.safetyTitle}
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          {t.safetySubtitle}
        </p>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
        {/* Voice Trigger Banner (>48px button) */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
          <button
            type="button"
            onClick={handleToggleVoice}
            aria-label={isRecording ? t.stopVoiceRecord : t.startVoiceRecord}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
            }`}
          >
            {isRecording ? (
              <>
                <Radio className="w-5 h-5 animate-spin" />
                <span>{t.stopVoiceRecord} ({t.listeningNow})</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>{t.startVoiceRecord}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500">
            {t.voiceReportPrompt}
          </p>

          {interimTranscript && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-slate-800 text-left">
              <em>{interimTranscript}</em>
            </div>
          )}

          {voiceError && (
            <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg text-left">
              {voiceError}
            </p>
          )}
        </div>

        {/* Hazard Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Hazard Title / Location
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Loose scaffold board on level 4"
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 text-slate-900"
          />
        </div>

        {/* Hazard Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t.hazardDescription}
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setInputMethod('text');
            }}
            placeholder={t.typeReportPrompt}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 text-slate-900"
          />
        </div>

        {/* Category Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t.hazardCategory}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as HazardCategory)}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t.hazardSeverity}
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['low', 'medium', 'high', 'critical'] as HazardSeverity[]).map((sev) => {
              const isSelected = severity === sev;
              return (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${
                    isSelected
                      ? sev === 'critical'
                        ? 'bg-rose-600 text-white border-rose-700'
                        : sev === 'high'
                        ? 'bg-amber-600 text-white border-amber-700'
                        : 'bg-blue-600 text-white border-blue-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sev === 'critical'
                    ? t.sevCritical.split(' ')[0]
                    : sev === 'high'
                    ? t.sevHigh
                    : sev === 'medium'
                    ? t.sevMedium
                    : t.sevLow}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button (>48px) */}
        <button
          type="submit"
          aria-label={t.submitHazardReport}
          className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
        >
          <Send className="w-4 h-4" />
          <span>{t.submitHazardReport}</span>
        </button>

        {showSuccessToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.hazardReportSuccess}</span>
          </div>
        )}
      </form>

      {/* Safety Incident History & Status Tracker */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
          {t.myReportsHistory}
        </h3>

        <div className="space-y-2.5">
          {sectorData.safetyReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-slate-900 text-sm leading-snug">
                  {report.title}
                </div>

                {/* Status Indicator Pill */}
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold shrink-0 ${
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

              <p className="text-slate-600 leading-relaxed">
                {report.description}
              </p>

              {report.resolutionNotes && (
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700">
                  <strong className="text-slate-900">Action:</strong> {report.resolutionNotes}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(report.reportedAt).toLocaleDateString()}
                </span>
                <span className="font-semibold capitalize text-slate-700">
                  {report.severity} Severity
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
