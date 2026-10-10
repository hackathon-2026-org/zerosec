import React from 'react';
import {
  UploadCloud,
  Calendar,
  Bell,
  RefreshCw,
  Zap,
  Server,
  PlayCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedDateRange,
    setSelectedDateRange,
    alerts,
    handleResetData,
    runBackendAnalysis,
    backendStatus,
    isAnalyzingBackend,
    isLoading
  } = useData();

  const newAlerts = alerts.filter(a => a.status === 'new');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left Title & Status */}
        <div className="flex items-center space-x-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Campaign Anomaly Alerting
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                No Alert Fatigue
              </span>

              {/* FastAPI Backend Live Status Badge */}
              <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                backendStatus === 'connected'
                  ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-700 border-amber-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  backendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}></span>
                <span>{backendStatus === 'connected' ? 'FastAPI Engine Active' : 'Client Engine Active'}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              180-Day Intelligence • Per-Campaign Rolling Baselines • Precision & Recall Verified
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Analyze via FastAPI Engine Trigger */}
          <button
            onClick={() => runBackendAnalysis()}
            disabled={isAnalyzingBackend || isLoading}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-all active:scale-[0.98]"
            title="Execute pipeline through FastAPI server"
          >
            <PlayCircle className={`w-3.5 h-3.5 text-emerald-600 ${isAnalyzingBackend ? 'animate-spin' : ''}`} />
            <span>{isAnalyzingBackend ? 'Computing...' : 'Run FastAPI Engine'}</span>
          </button>

          {/* Date Range Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 ml-2 mr-1 text-slate-500" />
            <button
              onClick={() => setSelectedDateRange('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedDateRange === 'all'
                  ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full 180 Days
            </button>
            <button
              onClick={() => setSelectedDateRange('90d')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedDateRange === '90d'
                  ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 90 Days
            </button>
            <button
              onClick={() => setSelectedDateRange('30d')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedDateRange === '30d'
                  ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 30 Days
            </button>
          </div>

          {/* Upload CSV Quick Action */}
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all ${
              activeTab === 'campaigns'
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-indigo-600" />
            <span>Upload CSV</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleResetData}
            disabled={isLoading || isAnalyzingBackend}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200"
            title="Reset dataset to default 180-day sample"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading || isAnalyzingBackend ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          {/* Quick Notification Bell */}
          <button
            onClick={() => setActiveTab('alerts')}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200"
            title="View Active Alerts"
          >
            <Bell className="w-4 h-4" />
            {newAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                {newAlerts.length}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center pl-2 border-l border-slate-200 space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">Ad Ops Lead</p>
              <p className="text-[10px] text-slate-500">Enterprise Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
