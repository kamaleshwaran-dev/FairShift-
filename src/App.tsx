/**
 * FairShift - Decent Work Platform (UN SDG 8)
 * Dual interfaces: Frontline Worker App & Operations Admin Dashboard
 * Dual sectors: Construction & Civil Works, Hospital & Healthcare Facilities
 */

import React from 'react';
import { FairShiftProvider, useFairShift } from './context/FairShiftContext';
import { Header } from './components/common/Header';
import { WorkerApp } from './components/worker/WorkerApp';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainContent: React.FC = () => {
  const { role } = useFairShift();

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col">
        {role === 'worker' ? <WorkerApp /> : <AdminDashboard />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <FairShiftProvider>
      <MainContent />
    </FairShiftProvider>
  );
}
