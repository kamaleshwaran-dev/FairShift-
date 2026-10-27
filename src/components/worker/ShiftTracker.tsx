import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  Clock,
  QrCode,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  FastForward,
  IndianRupee,
  ShieldAlert,
} from 'lucide-react';

export const ShiftTracker: React.FC = () => {
  const {
    currentWorker,
    allWorkersInSector,
    setActiveWorkerId,
    activeShiftDurationHours,
    activeShiftCalculation,
    checkInShift,
    checkOutShift,
    simulateAdvanceHour,
    currentWorkerShifts,
    sector,
    t,
  } = useFairShift();

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [justCheckedOutShift, setJustCheckedOutShift] = useState<{
    hours: number;
    grossPay: number;
    overtimeHours: number;
  } | null>(null);

  const isCheckedIn = Boolean(currentWorker.activeCheckIn);

  // Time format calculations
  const totalMinutes = Math.floor(activeShiftDurationHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const isOvertimeActive = activeShiftDurationHours > 8;

  const handleStartCheckIn = (method: 'qr' | 'gps') => {
    checkInShift(method);
    setShowCheckInModal(false);
    setJustCheckedOutShift(null);
  };

  const handleCheckOut = () => {
    const shift = checkOutShift();
    setJustCheckedOutShift({
      hours: shift.totalHours,
      grossPay: shift.grossPay,
      overtimeHours: shift.overtimeHours,
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Worker Profile Header & Quick Switch */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-base">
            {currentWorker.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base leading-tight">
                {currentWorker.name}
              </h2>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                {currentWorker.employeeCode}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">{currentWorker.roleTitle}</p>
          </div>
        </div>

        {/* Worker Switcher dropdown for quick testing */}
        <select
          aria-label="Switch active worker profile"
          value={currentWorker.id}
          onChange={(e) => setActiveWorkerId(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 font-medium text-slate-800 focus:ring-2 focus:ring-blue-600"
        >
          {allWorkersInSector.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} (₹{w.hourlyRate}/h)
            </option>
          ))}
        </select>
      </div>

      {/* Primary Shift Attendance Tactile Card */}
      <div
        className={`p-5 rounded-3xl border text-center transition-all shadow-sm ${
          isCheckedIn
            ? isOvertimeActive
              ? 'bg-amber-50/70 border-amber-300'
              : 'bg-emerald-50/70 border-emerald-300'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-wide uppercase mb-2">
          {isCheckedIn ? (
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isOvertimeActive
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-700 text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {isOvertimeActive ? `${t.overtimeHoursLabel}` : t.shiftActive}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
              {t.shiftNotStarted}
            </span>
          )}
        </div>

        {/* Digital Clock Display */}
        <div className="my-3">
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-slate-900 tabular-nums">
            {isCheckedIn ? (
              `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
            ) : (
              '00:00'
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {isCheckedIn ? t.elapsedTime : t.shiftTrackingSubtitle}
          </p>
        </div>

        {/* Real-time Earnings Meter & Overtime Indicator */}
        {isCheckedIn && activeShiftCalculation && (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-3 border border-slate-200/80 my-3 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">{t.regularHoursLabel}:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {activeShiftCalculation.regularHours.toFixed(1)} hrs (₹{activeShiftCalculation.regularPay})
              </span>
            </div>

            {/* Overtime Highlight */}
            <div
              className={`flex items-center justify-between text-xs p-1.5 rounded-lg ${
                isOvertimeActive ? 'bg-amber-100/80 text-amber-950 font-bold' : 'text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1">
                {isOvertimeActive && <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />}
                {t.overtimeHoursLabel}:
              </span>
              <span className="font-mono font-bold tabular-nums">
                {activeShiftCalculation.overtimeHours.toFixed(1)} hrs (₹{activeShiftCalculation.overtimePay})
              </span>
            </div>

            {/* Accrued Total */}
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-800">{t.totalEarningsToday}:</span>
              <span className="font-mono font-extrabold text-blue-700 text-lg tabular-nums">
                ₹{activeShiftCalculation.grossPay.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Big Tactile Action Button (>56px height) */}
        {!isCheckedIn ? (
          <button
            onClick={() => setShowCheckInModal(true)}
            aria-label={t.checkIn}
            className={`w-full h-16 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform ${
              sector === 'construction'
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/30'
            }`}
          >
            <Play className="w-6 h-6 fill-current" />
            <span>{t.checkIn}</span>
          </button>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleCheckOut}
              aria-label={t.checkOut}
              className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-transform"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>{t.checkOut}</span>
            </button>

            {/* Fast-Forward +1 Hour Simulator Button */}
            <button
              onClick={simulateAdvanceHour}
              aria-label="Simulate adding one hour to active shift"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition-colors"
            >
              <FastForward className="w-4 h-4 text-slate-600" />
              <span>{t.simulateHourAdvance}</span>
            </button>
          </div>
        )}

        {/* Location & Geo-fence Badge */}
        {isCheckedIn && currentWorker.activeCheckIn && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate max-w-[280px]">
              {currentWorker.activeCheckIn.simulatedLocation}
            </span>
          </div>
        )}
      </div>

      {/* Just Finalized Shift Confirmation Toast */}
      {justCheckedOutShift && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-slate-900 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Shift Completed & Recorded</span>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Total Hours: <span className="font-bold">{justCheckedOutShift.hours.toFixed(1)}h</span> · Overtime:{' '}
            <span className="font-bold">{justCheckedOutShift.overtimeHours.toFixed(1)}h</span> · Gross Pay:{' '}
            <span className="font-bold text-emerald-700 font-mono">
              ₹{justCheckedOutShift.grossPay.toLocaleString('en-IN')}
            </span>
          </p>
        </div>
      )}

      {/* Shift History Table / Cards */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
          Recent Shift Logs
        </h3>
        <div className="space-y-2">
          {currentWorkerShifts.slice(0, 3).map((shift) => (
            <div
              key={shift.id}
              className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-slate-900">{shift.date}</div>
                <div className="text-slate-500 font-mono">
                  {shift.startTime} – {shift.endTime} ({shift.totalHours}h)
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-slate-900">
                  ₹{shift.grossPay.toLocaleString('en-IN')}
                </div>
                {shift.overtimeHours > 0 && (
                  <div className="text-[11px] font-semibold text-amber-700">
                    +{shift.overtimeHours}h OT (₹{shift.overtimePay})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Check-In Verification Modal */}
      {showCheckInModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{t.geoVerified}</h3>
              <p className="text-xs text-slate-600 mt-1">
                {sector === 'construction'
                  ? 'Metro Rail Phase 3 · South Gate QR Scanner'
                  : 'District General Hospital · Trauma Care Beacon'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleStartCheckIn('qr')}
                aria-label="Confirm check-in via site QR code"
                className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <QrCode className="w-5 h-5" />
                <span>{t.simulatedQr}</span>
              </button>
              <button
                onClick={() => handleStartCheckIn('gps')}
                aria-label="Confirm check-in via GPS Geo-fence"
                className="py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <MapPin className="w-5 h-5" />
                <span>{t.simulatedGps}</span>
              </button>
            </div>

            <button
              onClick={() => setShowCheckInModal(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 pt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
