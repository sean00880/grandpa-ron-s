'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  FileSearch, 
  Calendar, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange,
  isCollapsed,
  toggleCollapse
}) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'audit', label: 'Property Report', icon: <FileSearch size={20} /> },
    { id: 'schedule', label: 'Scheduled Services', icon: <Calendar size={20} /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside 
      className={`bg-gray-900 text-white h-full transition-all duration-300 flex flex-col border-r border-gray-800 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-800 h-[70px]">
        {!isCollapsed && <span className="font-bold text-lg tracking-tight truncate">My Account</span>}
        <button 
          onClick={toggleCollapse}
          className={`p-2 hover:bg-gray-800 rounded-lg transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === item.id 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? item.label : undefined}
          >
            <div className="shrink-0">
              {item.icon}
            </div>
            {!isCollapsed && <span className="font-medium opacity-100 transition-opacity duration-300">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={logout}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-colors whitespace-nowrap ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <div className="shrink-0">
            <LogOut size={20} />
          </div>
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};