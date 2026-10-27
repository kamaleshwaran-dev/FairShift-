import React from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { Clock, IndianRupee, AlertTriangle, MessageSquare, Award } from 'lucide-react';

export type WorkerTab = 'shift' | 'payslip' | 'safety' | 'feedback' | 'passport';

interface WorkerTabBarProps {
  activeTab: WorkerTab;
  onTabChange: (tab: WorkerTab) => void;
}

export const WorkerTabBar: React.FC<WorkerTabBarProps> = ({ activeTab, onTabChange }) => {
  const { t, sector } = useFairShift();

  const accentColor = sector === 'construction' ? 'text-amber-600' : 'text-teal-600';
  const activeBg = sector === 'construction' ? 'bg-amber-50' : 'bg-teal-50';

  const tabs: { id: WorkerTab; label: string; icon: React.ElementType }[] = [
    { id: 'shift', label: t.navShift, icon: Clock },
    { id: 'payslip', label: t.navPayslip, icon: IndianRupee },
    { id: 'safety', label: t.navSafety, icon: AlertTriangle },
    { id: 'feedback', label: t.navFeedback, icon: MessageSquare },
    { id: 'passport', label: t.navPassport, icon: Award },
  ];

  return (
    <nav
      aria-label="Worker application navigation"
      className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg"
    >
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-selected={isActive}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[50px] ${
                isActive ? `${activeBg} ${accentColor} font-bold` : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[11px] leading-none whitespace-nowrap truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
