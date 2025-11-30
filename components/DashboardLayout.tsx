'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { PropertyAudit } from './PropertyAudit';
import { VirtualPlanner } from './VirtualPlanner';
import { User } from '../types';

interface DashboardLayoutProps {
  user: User;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  user,
  activeTab: propActiveTab,
  onTabChange: propOnTabChange
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Use controlled or uncontrolled state
  const activeTab = propActiveTab || internalActiveTab;
  const setActiveTab = propOnTabChange || setInternalActiveTab;

  const renderContent = () => {
    switch (activeTab) {
      case 'visualizer':
        return <VirtualPlanner />;
      case 'audit':
        return <PropertyAudit />;
      case 'overview':
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="font-heading font-normal text-3xl text-gray-900 dark:text-white">Welcome back, {user.name.split(' ')[0]}</h1>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setActiveTab('audit')}>
                        <div className="text-green-600 bg-green-50 dark:bg-green-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="font-heading font-normal text-xl mb-1 dark:text-white">Property Health</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Last audit was 2 weeks ago.</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                            <div className="bg-green-500 h-1.5 rounded-full w-[85%]"></div>
                        </div>
                        <p className="text-xs text-right font-medium text-green-600 dark:text-green-400">85% Score</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
                        <div className="text-blue-600 bg-blue-50 dark:bg-blue-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="font-heading font-normal text-xl mb-1 dark:text-white">Upcoming Service</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Precision Mowing</p>
                        <p className="text-sm font-semibold mt-2 dark:text-white">Tomorrow, 9:00 AM</p>
                        <button className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">Reschedule</button>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
                        <div className="text-orange-600 bg-orange-50 dark:bg-orange-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="font-heading font-normal text-xl mb-1 dark:text-white">Open Invoice</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">May Maintenance</p>
                        <p className="text-lg font-bold mt-1 dark:text-white">$125.00</p>
                        <button className="mt-3 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200 font-bold">Pay Now</button>
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900 rounded-xl p-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-heading font-normal text-xl text-green-900 dark:text-green-100">Get your new property audit!</h3>
                        <p className="text-green-700 dark:text-green-300 text-sm mt-1">Upload a current photo to see how your lawn health has improved.</p>
                    </div>
                    <button 
                        onClick={() => setActiveTab('audit')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-green-900/10 hover:bg-green-700"
                    >
                        Start Audit
                    </button>
                </div>
            </div>
        );
      default:
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Feature coming soon</div>;
    }
  };

  return (
    <div className="flex h-[calc(100vh-72px)] overflow-hidden bg-gray-50 dark:bg-zinc-900/50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
        {renderContent()}
      </main>
    </div>
  );
};