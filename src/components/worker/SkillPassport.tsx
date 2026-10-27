import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { Certification } from '../../domain/types';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  Plus,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

export const SkillPassport: React.FC = () => {
  const { currentCertifications, currentWorker, t } = useFairShift();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIssuer, setNewIssuer] = useState('');
  const [localCerts, setLocalCerts] = useState<Certification[]>([]);

  const allCerts = [...localCerts, ...currentCertifications];

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const cert: Certification = {
      id: `cert-custom-${Date.now()}`,
      workerId: currentWorker.id,
      title: newTitle.trim(),
      issuingBody: newIssuer.trim() || 'National Skill Council',
      credentialId: `VER-${Math.floor(100000 + Math.random() * 900000)}`,
      issueDate: new Date().toISOString().slice(0, 10),
      expiryDate: new Date(Date.now() + 365 * 24 * 3600000).toISOString().slice(0, 10),
      status: 'valid',
      category: 'Occupational Skill',
      skills: ['Verified Site Competency', 'Safety Protocol'],
    };

    setLocalCerts((prev) => [cert, ...prev]);
    setNewTitle('');
    setNewIssuer('');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Title & Passport ID Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl shadow-md space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>{t.passportTitle}</span>
            </div>
            <h2 className="text-lg font-extrabold text-white leading-tight mt-1">
              {currentWorker.name}
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              {currentWorker.roleTitle} · {currentWorker.employeeCode}
            </p>
          </div>

          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
            <QrCode className="w-7 h-7 text-amber-400" />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
          <span>Active Credentials: <strong className="text-white font-mono">{allCerts.length}</strong></span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t.verifiedBadge}
          </span>
        </div>
      </div>

      {/* Action to upload / claim new certificate */}
      <button
        onClick={() => setShowAddModal(true)}
        aria-label={t.addCertificate}
        className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-2xl border border-slate-200 flex items-center justify-center gap-2 shadow-sm transition-colors"
      >
        <Plus className="w-4 h-4 text-blue-600" />
        <span>{t.addCertificate}</span>
      </button>

      {/* Certificate Cards List */}
      <div className="space-y-3">
        {allCerts.map((cert) => (
          <div
            key={cert.id}
            className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2.5 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold tracking-wide uppercase text-slate-500">
                  {cert.category}
                </span>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {cert.title}
                </h3>
                <p className="text-slate-600 text-xs mt-0.5">{cert.issuingBody}</p>
              </div>

              {/* Status Badge */}
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold shrink-0 ${
                  cert.status === 'valid'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : cert.status === 'expiring_soon'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {cert.status === 'valid'
                  ? t.statusValid
                  : cert.status === 'expiring_soon'
                  ? t.statusExpiring
                  : t.statusExpired}
              </span>
            </div>

            {/* Credential ID & Dates */}
            <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 font-mono text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span className="font-sans font-semibold text-slate-700">{t.credentialIdLabel}:</span>
                <span className="font-bold text-slate-900">{cert.credentialId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans font-semibold text-slate-700">{t.issuedOn}:</span>
                <span>{cert.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans font-semibold text-slate-700">{t.validUntil}:</span>
                <span
                  className={
                    cert.status === 'expired'
                      ? 'text-rose-700 font-bold'
                      : cert.status === 'expiring_soon'
                      ? 'text-amber-700 font-bold'
                      : 'text-slate-800'
                  }
                >
                  {cert.expiryDate}
                </span>
              </div>
            </div>

            {/* Verified Skills Tags */}
            {cert.skills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800">Verified:</span>
                {cert.skills.map((s, idx) => (
                  <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Certificate Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Award className="w-5 h-5 text-blue-600" />
              <h3>{t.addCertificate}</h3>
            </div>

            <form onSubmit={handleAddCert} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Certification Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Heavy Crane Rigger Certification"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  placeholder="e.g., National Safety Council India"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
