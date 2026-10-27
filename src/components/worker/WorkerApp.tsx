import React, { useState } from 'react';
import { MobileFrame } from './MobileFrame';
import { WorkerTabBar, WorkerTab } from './WorkerTabBar';
import { ShiftTracker } from './ShiftTracker';
import { PayslipView } from './PayslipView';
import { SafetyReporter } from './SafetyReporter';
import { AnonymousFeedback } from './AnonymousFeedback';
import { SkillPassport } from './SkillPassport';

export const WorkerApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WorkerTab>('shift');

  return (
    <MobileFrame>
      <div className="relative min-h-[700px] flex flex-col justify-between">
        <main className="flex-1">
          {activeTab === 'shift' && <ShiftTracker />}
          {activeTab === 'payslip' && <PayslipView />}
          {activeTab === 'safety' && <SafetyReporter />}
          {activeTab === 'feedback' && <AnonymousFeedback />}
          {activeTab === 'passport' && <SkillPassport />}
        </main>

        <WorkerTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </MobileFrame>
  );
};
