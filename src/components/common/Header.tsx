import React from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { Sector, Language, UserRole } from '../../domain/types';
import {
  HardHat,
  Cross,
  User,
  ShieldCheck,
  Smartphone,
  Maximize2,
  RotateCcw,
  Globe,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    sector,
    setSector,
    language,
    setLanguage,
    role,
    setRole,
    isPhoneFrame,
    setIsPhoneFrame,
    resetDemoData,
    t,
  } = useFairShift();

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      {/* Top Banner: UN SDG 8 Decent Work Alignment */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400">UN SDG 8</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-300 font-medium">Decent Work & Economic Growth</span>
          <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
          <span className="text-slate-400 hidden sm:inline">Fair Shifts, Overtime Transparency & Zero Exploitation</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetDemoData}
            aria-label="Reset demo data to initial state"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2 py-0.5 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            FS
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
              {t.appName}
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Sector & Role Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sector Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setSector('construction')}
              aria-label="Switch to Construction Sector"
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                sector === 'construction'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>{t.constructionSector.split(' ')[0]}</span>
            </button>
            <button
              onClick={() => setSector('hospital')}
              aria-label="Switch to Hospital & Healthcare Sector"
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                sector === 'hospital'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Cross className="w-4 h-4" />
              <span>{t.hospitalSector.split(' ')[0]}</span>
            </button>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setRole('worker')}
              aria-label="Switch to Frontline Worker App"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'worker'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t.workerRole}</span>
            </button>
            <button
              onClick={() => setRole('admin')}
              aria-label="Switch to Operations Admin Dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.adminRole}</span>
            </button>
          </div>

          {/* Phone Frame Toggle (visible when in Worker mode on desktop) */}
          {role === 'worker' && (
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              title={isPhoneFrame ? t.fullScreenToggle : t.desktopFrameToggle}
              aria-label="Toggle Phone Frame Simulator"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
            >
              {isPhoneFrame ? (
                <>
                  <Maximize2 className="w-4 h-4 text-slate-600" />
                  <span>{t.fullScreenToggle}</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-slate-600" />
                  <span>{t.desktopFrameToggle}</span>
                </>
              )}
            </button>
          )}

          {/* Language Toggle (EN, தமிழ், हिन्दी) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5" />
            {(['en', 'ta', 'hi'] as Language[]).map((langCode) => (
              <button
                key={langCode}
                onClick={() => setLanguage(langCode)}
                aria-label={`Switch language to ${
                  langCode === 'en' ? 'English' : langCode === 'ta' ? 'Tamil' : 'Hindi'
                }`}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === langCode
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {langCode === 'en' ? 'EN' : langCode === 'ta' ? 'தமிழ்' : 'हिन्दी'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
