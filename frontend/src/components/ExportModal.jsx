/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, FileSpreadsheet } from 'lucide-react';
import { exportToXlsx } from '../utils/exportXlsx';
import { SearchableDropdown } from './SearchableDropdown';

const INSTITUTION_OPTIONS = [
  'All Institutions',
  'SNSCT',
  'SNSCE',
  'SNSRCAS',
  'SNSCAHS',
  'SNSCNURSING',
  'SNSCPHYSIO',
  'SNSCPHS',
  'DRSNSCEDU',
  'SNSBSPINE',
  'SNSACADEMY'
];

const AVAILABLE_FIELDS = [
  { id: 'college', label: 'College Name', group: 'Publications' },
  { id: 'count', label: 'Publication Count', group: 'Publications' },
  { id: 'approved', label: 'Approved', group: 'Publications' },
  { id: 'pending', label: 'Pending', group: 'Publications' },
  { id: 'collegePublications', label: 'College (Totals)', group: 'Publications' },
  { id: 'revenue', label: 'Total Amount Collected', group: 'Financials' },
];

export const ExportModal = ({ isOpen, onClose, publications }) => {
  const [selectedFields, setSelectedFields] = useState(
    AVAILABLE_FIELDS.reduce((acc, field) => ({ ...acc, [field.id]: true }), {})
  );
  const [exportInstitution, setExportInstitution] = useState(['All Institutions']);

  const isAllSelected = Object.values(selectedFields).every(Boolean);
  const isIndeterminate = !isAllSelected && Object.values(selectedFields).some(Boolean);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectedFields(AVAILABLE_FIELDS.reduce((acc, field) => ({ ...acc, [field.id]: checked }), {}));
  };

  const handleFieldChange = (id) => {
    setSelectedFields(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExport = () => {
    const filteredPublications = publications.filter(p => {
      if (exportInstitution.includes('All Institutions')) return true;
      let pubInstitution = p.institution;
      if (!pubInstitution) {
        const hash = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const mod = hash % 4;
        if (mod === 0) pubInstitution = 'SNSCT';
        else if (mod === 1) pubInstitution = 'SNSCE';
        else if (mod === 2) pubInstitution = 'SNSRCAS';
        else pubInstitution = 'SNSCAHS';
      }
      return exportInstitution.includes('All Institutions') || exportInstitution.includes(pubInstitution);
    });

    if (filteredPublications.length === 0) {
      alert('There is no data to export for the selected institution.');
      return;
    }

    // 1. Group by authorId and compute per-college totals
    const facultyMap = {};
    const collegeRevenueMap = {};
    const collegeStatsMap = {};

    filteredPublications.forEach(pub => {
      const dept = pub.department || 'N/A';

      if (!collegeStatsMap[dept]) {
        collegeStatsMap[dept] = { count: 0, approved: 0, pending: 0 };
      }
      collegeStatsMap[dept].count += 1;
      if (pub.status === 'Approved') collegeStatsMap[dept].approved += 1;
      if (pub.status === 'Pending') collegeStatsMap[dept].pending += 1;

      if (!facultyMap[pub.authorId]) {
        facultyMap[pub.authorId] = {
          name: pub.author,
          college: dept,
          count: 0,
          approved: 0,
          pending: 0,
          revenue: 0,
        };
      }

      const f = facultyMap[pub.authorId];
      f.count += 1;
      if (pub.status === 'Approved') f.approved += 1;
      if (pub.status === 'Pending') f.pending += 1;
      if (pub.paymentStatus === 'Paid') {
        f.revenue += 150;
        collegeRevenueMap[dept] = (collegeRevenueMap[dept] || 0) + 150;
      }
    });

    const hasSelectedFields = Object.values(selectedFields).some(Boolean);
    if (!hasSelectedFields) {
      alert('Please select at least one field to export.');
      return;
    }

    if (publications.length === 0) {
      alert('There is no publication data to export yet.');
      return;
    }

    // 2. Build rows based on selection
    const data = Object.values(facultyMap).map(f => {
      const row = {};
      if (selectedFields.name) row['Name'] = f.name;
      if (selectedFields.college) row['College Name'] = f.college;
      if (selectedFields.count) row['Publication Count'] = f.count;
      if (selectedFields.approved) row['Approved'] = f.approved;
      if (selectedFields.pending) row['Pending'] = f.pending;
      if (selectedFields.collegePublications) {
        row['College Total Publications'] = collegeStatsMap[f.college]?.count || 0;
        row['College Total Approved'] = collegeStatsMap[f.college]?.approved || 0;
        row['College Total Pending'] = collegeStatsMap[f.college]?.pending || 0;
      }
      if (selectedFields.revenue) row['Total Amount Collected'] = `₹${f.revenue}`;
      if (selectedFields.collegeRevenue) row['Revenue by College'] = `₹${collegeRevenueMap[f.college] || 0}`;
      return row;
    });

    // 3. Generate Excel
    exportToXlsx(data, 'RPMS_Dashboard_Export.xlsx', 'Dashboard Export');

    onClose();
  };

  // Group fields for section labels
  const groups = [...new Set(AVAILABLE_FIELDS.map(f => f.group))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-xl overflow-visible relative z-10 animate-scale-in flex flex-col max-h-[92vh] sm:max-h-[90vh]">

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

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          <p className="text-sm text-slate-500">Select the college and fields to include in the Excel export:</p>

          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-visible">

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 bg-white rounded-t-xl px-4 py-3 gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600 shrink-0"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Select All Fields</span>
                  <span className="text-xs text-slate-400 font-medium">
                    {Object.values(selectedFields).filter(Boolean).length}/{AVAILABLE_FIELDS.length} selected
                  </span>
                </div>
              </label>

              <div className="w-full sm:w-56 shrink-0 relative z-20">
                <SearchableDropdown
                  options={INSTITUTION_OPTIONS}
                  value={exportInstitution}
                  onChange={setExportInstitution}
                  placeholder="Select college"
                  isMulti={true}
                />
              </div>
            </div>

            {/* Grouped checkboxes — 2-column grid per group */}
            <div className="p-4 space-y-4">
              {groups.map(group => (
                <div key={group}>
                  {/* Group label */}
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-0.5">
                    {group}
                  </p>
                  {/* 1-col on mobile, 2-col on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                    {AVAILABLE_FIELDS.filter(f => f.group === group).map(field => (
                      <label
                        key={field.id}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFields[field.id]}
                          onChange={() => handleFieldChange(field.id)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600 shrink-0"
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 leading-tight">
                          {field.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 sm:space-x-0 rounded-b-2xl shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export to Excel</span>
          </button>
        </div>

      </div>
    </div>
  );
};
