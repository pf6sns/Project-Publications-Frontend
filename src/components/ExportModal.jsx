/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, Loader2, CalendarRange } from 'lucide-react';
import { SearchableDropdown } from './SearchableDropdown';
import { DateRangePicker } from './DateRangePicker';
import { exportDashboard } from '../api/dashboardApi';
import { INSTITUTION_OPTIONS } from '../utils/constants';

export const ExportModal = ({ isOpen, onClose }) => {
  const [exportInstitution, setExportInstitution] = useState(['All Institutions']);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      // Ensure institution mapping for backend
      let instId = undefined;
      if (!exportInstitution.includes('All Institutions') && exportInstitution.length > 0) {
        // Find the index of the institution + 1 to get the backend institution_id
        const instIndex = INSTITUTION_OPTIONS.indexOf(exportInstitution[0]);
        if (instIndex > 0) {
          instId = instIndex.toString();
        }
      }

      const downloadUrl = await exportDashboard(instId, '', exportStartDate, exportEndDate);
      
      if (downloadUrl) {
        // Use window.location.href to completely bypass any popup blockers
        window.location.href = downloadUrl;
      } else {
        alert("Failed to get download link.");
      }
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate export file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md overflow-visible relative z-10 animate-scale-in flex flex-col">

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl shrink-0">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Export Dashboard Data</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-5">
          {/* Institution */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-charcoal">
              Select Institution
            </label>
            <div className="relative z-30">
              <SearchableDropdown
                options={INSTITUTION_OPTIONS}
                value={exportInstitution}
                onChange={setExportInstitution}
                placeholder="Search institution..."
                isMulti={false}
              />
            </div>
            <p className="text-[11px] text-slate-gray">
              Leave as "All Institutions" to export data for all colleges, or select a specific one to filter the report.
            </p>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-charcoal flex items-center gap-1.5">
              <CalendarRange className="h-3.5 w-3.5 text-emerald-600" />
              Date Range <span className="text-slate-400 font-normal text-xs">(optional)</span>
            </label>
            <div className="relative z-20">
              <DateRangePicker
                startDate={exportStartDate}
                endDate={exportEndDate}
                onChange={({ startDate, endDate }) => {
                  setExportStartDate(startDate);
                  setExportEndDate(endDate);
                }}
              />
            </div>
            <p className="text-[11px] text-slate-gray">
              Leave empty to export all records, or set a date range to filter by submission date.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-platinum-silver rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center justify-center space-x-2 px-6 py-2 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isExporting ? 'Generating Excel...' : 'Generate Excel Report'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
