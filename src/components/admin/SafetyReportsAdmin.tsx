import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { SafetyReport, ReportStatus, Sector, HazardCategory, HazardSeverity } from '../../domain/types';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Mic,
  FileText,
  Filter,
  HardHat,
  Cross,
  Plus,
  Layers,
} from 'lucide-react';

export const SafetyReportsAdmin: React.FC = () => {
  const {
    sectorData,
    allSafetyReports,
    updateSafetyReportStatus,
    submitSafetyReport,
    sector: currentGlobalSector,
    t,
  } = useFairShift();

  const [filterSector, setFilterSector] = useState<'all' | Sector>('all');
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);

  // Quick hazard form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSector, setNewSector] = useState<Sector>(currentGlobalSector);
  const [newSeverity, setNewSeverity] = useState<HazardSeverity>('high');

  // Choose source list based on sector filter
  const baseList = filterSector === 'all' ? (allSafetyReports || []) : (sectorData?.safetyReports || []);

  const reports = baseList.filter((r) => {
    const matchesSector = filterSector === 'all' ? true : r.sector === filterSector;
    const matchesStatus = filterStatus === 'all' ? true : r.status === filterStatus;
    return matchesSector && matchesStatus;
  });

  const handleStatusChange = (reportId: string, newStatus: ReportStatus) => {
    updateSafetyReportStatus(reportId, newStatus, resolutionNotes.trim() || undefined);
    setSelectedReportId(null);
    setResolutionNotes('');
  };

  const handleQuickAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    submitSafetyReport({
      sector: newSector,
      title: newTitle.trim() || newDesc.slice(0, 40) + '...',
      description: newDesc.trim(),
      category: newSector === 'construction' ? 'fall_protection' : 'biohazard_needle',
      severity: newSeverity,
      inputMethod: 'text',
    });

    setNewTitle('');
    setNewDesc('');
    setShowQuickAddModal(false);
  };

  const openCount = baseList.filter((r) => r.status !== 'resolved').length;
  const resolvedCount = baseList.filter((r) => r.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Title & Filter Strip */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {t.safetyBoardTitle}
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                {reports.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and manage hazard reports submitted by frontline workers via voice or text across all active sites.
            </p>
          </div>

          {/* Quick Create Incident Button */}
          <button
            onClick={() => setShowQuickAddModal(true)}
            aria-label="Log new hazard incident report"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            <span>Log Safety Incident</span>
          </button>
        </div>

        {/* Filter Controls Row: Sector Scope & Status */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Sector Scope Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setFilterSector('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                filterSector === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>All Sectors</span>
            </button>
            <button
              onClick={() => setFilterSector('construction')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                filterSector === 'construction'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Construction</span>
            </button>
            <button
              onClick={() => setFilterSector('hospital')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                filterSector === 'hospital'
                  ? 'bg-teal-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cross className="w-3.5 h-3.5" />
              <span>Hospital</span>
            </button>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            {(['all', 'reported', 'in_review', 'resolved'] as (ReportStatus | 'all')[]).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === st
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all'
                  ? 'All Statuses'
                  : st === 'reported'
                  ? t.statusReported
                  : st === 'in_review'
                  ? t.statusInReview
                  : t.statusResolved}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Reports Table / Cards */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No Safety Incidents Found for Selected Filter
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try switching the sector filter to "All Sectors" or "All Statuses" above to view past resolved hazards.
            </p>
            <button
              onClick={() => {
                setFilterSector('all');
                setFilterStatus('all');
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters to All
            </button>
          </div>
        ) : (
          reports.map((report) => {
            const isEditing = selectedReportId === report.id;

            return (
              <div
                key={report.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs transition-all hover:border-slate-300"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                          report.sector === 'construction'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-teal-100 text-teal-900 border border-teal-300'
                        }`}
                      >
                        {report.sector === 'construction' ? (
                          <HardHat className="w-3 h-3" />
                        ) : (
                          <Cross className="w-3 h-3" />
                        )}
                        <span>{report.sector}</span>
                      </span>

                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {report.title}
                      </h3>

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

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>Logged: {new Date(report.reportedAt).toLocaleString()}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 font-sans capitalize">
                        {report.inputMethod === 'voice' ? (
                          <>
                            <Mic className="w-3.5 h-3.5 text-blue-600" />
                            Voice Report ({report.audioDurationSeconds || 12}s)
                          </>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5 text-slate-600" />
                            Text Entry
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
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
                </div>

                {/* Incident Description */}
                <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {report.description}
                </p>

                {/* Existing Resolution Notes */}
                {report.resolutionNotes && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Resolution / Corrective Action Recorded:</span>
                    </div>
                    <p className="pl-5 text-emerald-900 leading-relaxed font-medium">
                      {report.resolutionNotes}
                    </p>
                  </div>
                )}

                {/* Admin Status Transition Controls */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 text-xs">
                      {t.updateStatus}:
                    </span>

                    {report.status !== 'in_review' && report.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(report.id, 'in_review')}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs transition-colors"
                      >
                        {t.markInReview}
                      </button>
                    )}

                    {report.status !== 'resolved' && (
                      <button
                        onClick={() => setSelectedReportId(report.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
                      >
                        {t.markResolved}
                      </button>
                    )}

                    {report.status === 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(report.id, 'reported')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
                      >
                        Re-open Incident
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Resolution Action Input when resolving */}
                {isEditing && (
                  <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-3 animate-in fade-in">
                    <label className="block font-bold text-slate-900 text-xs">
                      {t.resolutionNotesPrompt}
                    </label>
                    <textarea
                      rows={2}
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="e.g., Scaffold clamps replaced and verified by lead rigger; biohazard bin emptied and autoclaved."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedReportId(null)}
                        className="px-3 py-1.5 text-slate-600 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(report.id, 'resolved')}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                      >
                        Confirm & Close Incident
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Add Incident Modal */}
      {showQuickAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3>Log Emergency Safety Hazard</h3>
            </div>

            <form onSubmit={handleQuickAddReport} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sector Location
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSector('construction')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${
                      newSector === 'construction'
                        ? 'bg-amber-500 text-slate-950 border-amber-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <HardHat className="w-4 h-4" />
                    <span>Construction</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSector('hospital')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${
                      newSector === 'hospital'
                        ? 'bg-teal-600 text-white border-teal-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Cross className="w-4 h-4" />
                    <span>Hospital</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Incident Title / Location
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Water pooling near electrical panel"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hazard Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the dangerous condition..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Severity
                </label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as HazardSeverity)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical / Immediate Danger</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
