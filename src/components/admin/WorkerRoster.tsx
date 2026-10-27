import React from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  Users,
  CheckCircle2,
  Clock,
  Phone,
  Award,
  IndianRupee,
  MapPin,
} from 'lucide-react';

export const WorkerRoster: React.FC = () => {
  const { sectorData, t } = useFairShift();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          {t.tabRoster}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Certified personnel, active check-in stamps, and emergency contact registry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectorData.workers.map((worker) => {
          const isCheckedIn = Boolean(worker.activeCheckIn);
          const workerCerts = sectorData.certifications.filter((c) => c.workerId === worker.id);
          const workerShifts = sectorData.shifts.filter((s) => s.workerId === worker.id);
          const totalOT = workerShifts.reduce((acc, s) => acc + s.overtimeHours, 0);

          return (
            <div
              key={worker.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-base">
                    {worker.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      {worker.name}
                    </h3>
                    <p className="text-slate-500 font-medium">{worker.roleTitle}</p>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {worker.employeeCode}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                    isCheckedIn
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isCheckedIn ? 'On Shift' : 'Off Shift'}
                </span>
              </div>

              {/* Wage & Hours Breakdown */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl font-mono text-[11px]">
                <div>
                  <span className="font-sans text-slate-500 block">Base Rate:</span>
                  <strong className="text-slate-900 font-bold">₹{worker.hourlyRate}/h</strong>
                </div>
                <div>
                  <span className="font-sans text-slate-500 block">Logged Shifts:</span>
                  <strong className="text-slate-900 font-bold">{workerShifts.length}</strong>
                </div>
                <div>
                  <span className="font-sans text-slate-500 block">Total OT:</span>
                  <strong className="text-amber-800 font-bold">{totalOT}h</strong>
                </div>
              </div>

              {/* Active Geo Stamp */}
              {isCheckedIn && worker.activeCheckIn && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{worker.activeCheckIn.simulatedLocation}</span>
                </div>
              )}

              {/* Emergency Contact */}
              <div className="flex items-center gap-2 text-slate-600 text-[11px] pt-1 border-t border-slate-100">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Emergency: {worker.emergencyContact}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
