import React from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  LineChart,
  FileBarChart2,
  Settings,
  ShieldCheck,
  UploadCloud,
  Layers,
  Sparkles,
  Server
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ActiveTab } from '../../types/dashboard';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    alerts,
    metadata,
    backendStatus,
    triggerIncidentDemo
  } = useData();

  const newAlertsCount = alerts.filter(a => a.status === 'new').length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical' && a.status === 'new').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Executive Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'campaigns', label: 'CSV Upload & Schema', icon: <UploadCloud className="w-5 h-5" /> },
    {
      id: 'alerts',
      label: 'Incident Alerts',
      icon: <AlertTriangle className="w-5 h-5" />,
      badge: newAlertsCount > 0 ? newAlertsCount : undefined,
      badgeColor: criticalAlertsCount > 0 ? 'bg-rose-500' : 'bg-amber-500'
    },
    { id: 'analysis', label: 'Anomaly Bands Deep Dive', icon: <LineChart className="w-5 h-5" /> },
    { id: 'reports', label: 'Model Evaluation & Ground Truth', icon: <FileBarChart2 className="w-5 h-5" /> },
    { id: 'settings', label: 'Engine Thresholds', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800 shadow-xl z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold text-lg">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight tracking-tight">PS-04 AnomalyEngine</h1>
          <p className="text-[11px] text-indigo-400 font-medium">Alert Fatigue Prevention</p>
        </div>
      </div>

      {/* Dataset Status Banner */}
      <div className="mx-3 mt-4 mb-2 p-3 bg-slate-800/80 rounded-lg border border-slate-700/60">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400 font-medium">Dataset Source:</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
            metadata?.source === 'uploaded' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          }`}>
            {metadata?.source === 'uploaded' ? 'Uploaded CSV' : '180d Dataset'}
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-mono truncate" title={metadata?.filename || ''}>
          {metadata?.filename || 'No data loaded'}
        </p>
        {metadata && (
          <div className="mt-1.5 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{metadata.rowCount.toLocaleString()} rows</span>
            <span>{metadata.campaignCount} campaigns</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Main Views
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* 1-Click Judge Showcase Presets */}
        <div className="pt-4 mt-3 border-t border-slate-800">
          <div className="px-3 mb-2 flex items-center space-x-1.5 text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Judge Demo Showcase</span>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('alerts');
                triggerIncidentDemo('tracking_failure');
              }}
              className="w-full text-left px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            >
              <span>🔍 Broken Tag (C05)</span>
              <span className="text-[10px] text-rose-400 font-bold">CRITICAL</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('alerts');
                triggerIncidentDemo('budget_exhaustion');
              }}
              className="w-full text-left px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            >
              <span>🛑 Budget Exhaust (C12)</span>
              <span className="text-[10px] text-rose-400 font-bold">CRITICAL</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('alerts');
                triggerIncidentDemo('bid_strategy_change');
              }}
              className="w-full text-left px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            >
              <span>📈 Bid Surge (C03)</span>
              <span className="text-[10px] text-amber-400 font-bold">MEDIUM</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('alerts');
                triggerIncidentDemo('spend_spike');
              }}
              className="w-full text-left px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            >
              <span>⚡ Spend Spike (C09)</span>
              <span className="text-[10px] text-rose-400 font-bold">CRITICAL</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer Info with Live Engine Badge */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px]">{backendStatus === 'connected' ? 'FastAPI 0.1.0' : 'Client WASM'}</span>
        </div>
        <span
          className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}
          title={backendStatus === 'connected' ? 'Backend Connected' : 'Client Mode'}
        ></span>
      </div>
    </aside>
  );
};
