import React from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isPhoneFrame, sector } = useFairShift();

  if (!isPhoneFrame) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-6 px-2 sm:px-4">
      {/* Smartphone Frame Container */}
      <div className="w-full max-w-[420px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-900/50 transition-all">
        {/* Phone Bezel Inner */}
        <div className="relative bg-slate-50 rounded-[36px] overflow-hidden flex flex-col min-h-[780px] max-h-[860px] border border-slate-200">
          {/* Top Speaker / Camera Island Bar */}
          <div className="bg-slate-950 text-white px-6 py-2.5 flex items-center justify-between text-[11px] font-semibold select-none z-30">
            <span className="tabular-nums">09:41</span>
            <div className="w-24 h-4 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Phone Scrollable Body */}
          <div className="flex-1 overflow-y-auto pb-20">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/80 rounded-full pointer-events-none z-30" />
        </div>
      </div>
    </div>
  );
};
