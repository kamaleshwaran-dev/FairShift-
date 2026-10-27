import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { AdminOverview } from './AdminOverview';
import { FatigueAlerts } from './FatigueAlerts';
import { AttritionRiskView } from './AttritionRisk';
import { SafetyReportsAdmin } from './SafetyReportsAdmin';
import { WorkerRoster } from './WorkerRoster';
import {
  LayoutDashboard,
  ShieldAlert,
  TrendingDown,
  AlertTriangle,
  Users,
} from 'lucide-react';

export type AdminTab = 'overview' | 'fatigue' | 'attrition' | 'safety' | 'roster';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const { fatigueAlerts, attritionRisks, openHazardsCount, t } = useFairShift();

  const criticalFatigueCount = fatigueAlerts.filter((a) => a.fatigueLevel === 'critical').length;
  const highAttritionCount = attritionRisks.filter((r) => r.tier === 'high').length;

  const tabs: {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badgeCount?: number;
    badgeColor?: string;
  }[] = [
    { id: 'overview', label: t.tabOverview, icon: LayoutDashboard },
    {
      id: 'fatigue',
      label: t.tabFatigueAlerts,
      icon: ShieldAlert,
      badgeCount: criticalFatigueCount,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'attrition',
      label: t.tabAttritionRisk,
      icon: TrendingDown,
      badgeCount: highAttritionCount,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'safety',
      label: t.tabSafetyBoard,
      icon: AlertTriangle,
      badgeCount: openHazardsCount,
      badgeColor: 'bg-blue-600 text-white',
    },
    { id: 'roster', label: t.tabRoster, icon: Users },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Sub-Navigation Tabs */}
      <nav
        aria-label="Admin console navigation tabs"
        className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={isActive}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {Boolean(tab.badgeCount && tab.badgeCount > 0) && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    tab.badgeColor || 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Active Tab Content */}
      <main>
        {activeTab === 'overview' && (
          <AdminOverview
            onNavigateTab={(target) => {
              if (target === 'fatigue') setActiveTab('fatigue');
              if (target === 'attrition') setActiveTab('attrition');
              if (target === 'safety') setActiveTab('safety');
            }}
          />
        )}
        {activeTab === 'fatigue' && <FatigueAlerts />}
        {activeTab === 'attrition' && <AttritionRiskView />}
        {activeTab === 'safety' && <SafetyReportsAdmin />}
        {activeTab === 'roster' && <WorkerRoster />}
      </main>
    </div>
  );
};
