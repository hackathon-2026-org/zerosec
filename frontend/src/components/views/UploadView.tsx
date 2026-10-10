import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCheck,
  Download,
  RefreshCw,
  AlertCircle,
  Database,
  CheckCircle2,
  Table as TableIcon,
  Sliders,
  FileText,
  PlayCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { exportToCSV, generateSampleDataset } from '../../utils/csvParser';
import { ColumnMapping } from '../../types/dashboard';

export const UploadView: React.FC = () => {
  const {
    metadata,
    records,
    isLoading,
    error,
    handleFileUpload,
    handleLoadDemoData,
    handleResetData,
    updateColumnMappingAndReprocess,
    runBackendAnalysis,
    isAnalyzingBackend,
    backendStatus
  } = useData();

  const [dragActive, setDragActive] = useState(false);
  const [editingMapping, setEditingMapping] = useState<ColumnMapping | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        handleFileUpload(file);
      } else {
        alert('Please select a valid .csv file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDownloadSample = () => {
    const { records: sampleRecords } = generateSampleDataset();
    const rows = sampleRecords.map(r => ({
      date: r.date,
      campaign: r.campaign,
      spend: r.spend,
      conversions: r.conversions,
      impressions: r.impressions,
      clicks: r.clicks,
      is_incident: r.is_incident !== undefined ? (r.is_incident ? 1 : 0) : '',
      incident_type: r.incident_type || ''
    }));
    exportToCSV('sample_campaign_anomalies_180d.csv', rows);
  };

  // Preview first 10 rows
  const previewRows = records.slice(0, 10);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dataset Ingestion & Schema Mapper</h2>
        <p className="text-xs text-slate-500 mt-1">
          Upload custom campaign CSV metrics (supports 180+ days, multiple campaigns). Automatic header resolution maps spend, conversions, date, and incident labels.
        </p>
      </div>

      {/* Main Upload Dropzone */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-card">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            {isLoading ? 'Parsing Dataset CSV...' : 'Drag & Drop campaign CSV file here'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Supports PapaParse engine. Required headers: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">date</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">campaign</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">spend</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">conversions</code>.
          </p>

          <div className="mt-6 flex items-center space-x-3">
            <button
              type="button"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-colors"
            >
              Browse Local CSV File
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadSample();
              }}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download 180-Day Sample CSV</span>
            </button>
          </div>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Dataset Mapping Warning</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Active Dataset Inspector Card */}
      {metadata && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-base">{metadata.filename}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    metadata.source === 'uploaded' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {metadata.source === 'uploaded' ? 'Custom Uploaded CSV' : 'Sample Evaluation Dataset'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Uploaded at {metadata.uploadedAt} • Parsed {metadata.rowCount.toLocaleString()} rows across {metadata.campaignCount} campaigns ({metadata.minDate} to {metadata.maxDate})
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => runBackendAnalysis()}
                disabled={isAnalyzingBackend || isLoading}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm active:scale-[0.98]"
                title="Process through FastAPI backend pipeline"
              >
                <PlayCircle className={`w-3.5 h-3.5 ${isAnalyzingBackend ? 'animate-spin' : ''}`} />
                <span>{isAnalyzingBackend ? 'Analyzing...' : 'Process with FastAPI'}</span>
              </button>
              <button
                onClick={handleLoadDemoData}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Demo Data</span>
              </button>
              <button
                onClick={handleResetData}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Mapped Column Headers Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Resolved Schema & Field Mappings</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 font-medium">Date Field:</span>
                <p className="font-mono font-semibold text-indigo-600 mt-1">{metadata.mappedColumns.dateField || 'Not Mapped'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 font-medium">Campaign Field:</span>
                <p className="font-mono font-semibold text-indigo-600 mt-1">{metadata.mappedColumns.campaignField || 'Not Mapped'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 font-medium">Spend / Cost Field:</span>
                <p className="font-mono font-semibold text-indigo-600 mt-1">{metadata.mappedColumns.spendField || 'Not Mapped'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 font-medium">Conversions Field:</span>
                <p className="font-mono font-semibold text-indigo-600 mt-1">{metadata.mappedColumns.conversionsField || 'Not Mapped'}</p>
              </div>
            </div>
          </div>

          {/* First 10 Rows Preview Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <TableIcon className="w-4 h-4 text-indigo-600" />
              <span>First 10 Rows Preview ({records.length.toLocaleString()} Total)</span>
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Campaign</th>
                    <th className="py-2.5 px-3">Spend (₹)</th>
                    <th className="py-2.5 px-3">Conversions</th>
                    <th className="py-2.5 px-3">CPA (₹)</th>
                    <th className="py-2.5 px-3">Ground Truth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700 font-mono">
                  {previewRows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3">{r.date}</td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-900 max-w-xs truncate">{r.campaign}</td>
                      <td className="py-2 px-3">₹{r.spend.toFixed(2)}</td>
                      <td className="py-2 px-3">{r.conversions}</td>
                      <td className="py-2 px-3">₹{r.cpa.toFixed(2)}</td>
                      <td className="py-2 px-3">
                        {r.is_incident !== undefined ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.is_incident ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {r.is_incident ? `INCIDENT (${r.incident_type || 'YES'})` : 'NORMAL'}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-sans italic">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
