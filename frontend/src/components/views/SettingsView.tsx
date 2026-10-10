import React from 'react';
import {
  Settings,
  Sliders,
  Shield,
  Server,
  Bell,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const SettingsView: React.FC = () => {
  const { config, updateConfig, handleResetData } = useData();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Anomaly Engine & Threshold Configuration</h2>
        <p className="text-xs text-slate-500 mt-1">
          Tune campaign-specific rolling baseline parameters, sensitivity multipliers, and alert fatigue suppression rules.
        </p>
      </div>

      {/* Engine Threshold Parameters */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card space-y-6">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-3">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>Statistical Baseline Parameters</span>
        </h3>

        <div className="space-y-6">
          {/* Baseline Window Size Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800">Rolling Baseline Window Size (Days)</label>
              <span className="font-mono text-xs font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded">
                {config.baselineWindow} Days
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Number of historical days used to calculate rolling mean ($\mu$) and standard deviation ($\sigma$). Default is 14 days.
            </p>
            <input
              type="range"
              min={7}
              max={30}
              value={config.baselineWindow}
              onChange={e => updateConfig({ baselineWindow: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Sensitivity Z-Score Threshold Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800">Sensitivity Threshold ($Z$-Score Multiplier)</label>
              <span className="font-mono text-xs font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded">
                {config.zScoreThreshold} $\sigma$
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Higher values reduce false alarms (alert fatigue protection); lower values increase sensitivity to small deviations.
            </p>
            <input
              type="range"
              min={1.5}
              max={4.0}
              step={0.1}
              value={config.zScoreThreshold}
              onChange={e => updateConfig({ zScoreThreshold: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Cooldown Period Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800">Alert Cooldown Period (Days)</label>
              <span className="font-mono text-xs font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded">
                {config.cooldownPeriodDays} Days
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Suppresses duplicate daily alerts for ongoing sustained issues on the same campaign to prevent fatigue.
            </p>
            <input
              type="range"
              min={1}
              max={7}
              value={config.cooldownPeriodDays}
              onChange={e => updateConfig({ cooldownPeriodDays: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Min Spend Threshold */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Minimum Spend Threshold (₹/Day)</label>
            <p className="text-xs text-slate-500 mb-2">Ignore tracking failure noise on low-spend / paused campaigns.</p>
            <input
              type="number"
              value={config.minSpendThreshold}
              onChange={e => updateConfig({ minSpendThreshold: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 max-w-xs"
            />
          </div>
        </div>
      </div>

      {/* Backend Python API Integration Settings */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-3">
          <Server className="w-4 h-4 text-indigo-600" />
          <span>Backend Python Anomaly API Endpoint (Modular Hook)</span>
        </h3>

        <p className="text-xs text-slate-500">
          The frontend anomaly detection engine is modularly structured in <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">src/utils/anomalyEngine.ts</code>. You can seamlessly connect it to an external FastAPI / Flask Python microservice.
        </p>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">Python Microservice URL</label>
          <input
            type="text"
            value={config.backendApiUrl || ''}
            onChange={e => updateConfig({ backendApiUrl: e.target.value })}
            placeholder="http://localhost:8000/api/v1/anomalies"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
