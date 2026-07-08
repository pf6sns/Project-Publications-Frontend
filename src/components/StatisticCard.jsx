/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  FileText,
  DollarSign,
  Download,
  FileSpreadsheet,
  X,
} from 'lucide-react';


// ─── Period Grouping Helpers ──────────────────────────────────────────────────

function getWeekLabel(date) {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function getMonthLabel(date) {
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function buildBuckets(publications, mode) {
  const map = {};
  publications.forEach((pub) => {
    if (!pub.paymentDetails) return;
    const date = new Date(pub.paymentDetails.date);
    let label;
    let sortKey;
    if (mode === 'weekly') {
      const sunday = new Date(date);
      sunday.setDate(date.getDate() - date.getDay());
      sunday.setHours(0, 0, 0, 0);
      sortKey = sunday.toISOString();
      label = getWeekLabel(date);
    } else {
      sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      label = getMonthLabel(date);
    }
    const numVersions = pub.versions ? pub.versions.length : 1;
    if (!map[sortKey]) map[sortKey] = { label, count: 0, revenue: 0, sortKey };
    map[sortKey].count += numVersions;
    map[sortKey].revenue += (pub.paymentDetails.amount ?? 150) * numVersions;
  });
  return Object.values(map).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
}

// ─── Export & File Download Utilities ────────────────────────────────────────

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generateExcelXML(headers, rows, worksheetName) {
  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:graph"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="${worksheetName}">
  <Table>`;
  
  // Headers row
  xml += '\n   <Row>';
  headers.forEach(h => {
    xml += `<Cell><Data ss:Type="String">${h}</Data></Cell>`;
  });
  xml += '</Row>';
  
  // Data rows
  rows.forEach(row => {
    xml += '\n   <Row>';
    row.forEach(cell => {
      const isNum = typeof cell === 'number';
      const type = isNum ? 'Number' : 'String';
      xml += `<Cell><Data ss:Type="${type}">${cell}</Data></Cell>`;
    });
    xml += '</Row>';
  });
  
  xml += `\n  </Table>
 </Worksheet>
</Workbook>`;
  return xml;
}

function downloadPaymentsCSV(payments, periodLabel) {
  const headers = ['Name', 'Department', 'Payment'];
  const rows = payments.map(p => [p.author, p.department, (p.paymentDetails?.amount ?? 150) * (p.versions ? p.versions.length : 1)]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  triggerDownload(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `SNS_RPMS_payments_${periodLabel.replace(/[\s–/:]+/g, '_')}.csv`);
}

function downloadPaymentsExcel(payments, periodLabel) {
  const headers = ['Name', 'Department', 'Payment'];
  const rows = payments.map(p => [p.author, p.department, (p.paymentDetails?.amount ?? 150) * (p.versions ? p.versions.length : 1)]);
  const xml = generateExcelXML(headers, rows, 'Payments');
  triggerDownload(new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' }), `SNS_RPMS_payments_${periodLabel.replace(/[\s–/:]+/g, '_')}.xls`);
}

// ─── Main Redesigned Component ───────────────────────────────────────────────

export function InstitutionStats({ publications }) {
  const combinedPublications = useMemo(() => {
    return publications;
  }, [publications]);

  const paidPubs = useMemo(() => {
    return combinedPublications.filter((p) => 
      p.paymentDetails !== null && p.paymentDetails !== undefined
    );
  }, [combinedPublications]);
  
  const totalPublications = combinedPublications.reduce((sum, p) => sum + (p.versions ? p.versions.length : 1), 0);
  const totalRevenue = useMemo(() => paidPubs.reduce((sum, p) => sum + ((p.paymentDetails?.amount ?? 150) * (p.versions ? p.versions.length : 1)), 0), [paidPubs]);
  
  const weeklyBuckets = useMemo(() => buildBuckets(paidPubs, 'weekly'), [paidPubs]);
  const monthlyBuckets = useMemo(() => buildBuckets(paidPubs, 'monthly'), [paidPubs]);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFilterType, setExportFilterType] = useState('weekly');
  const [selectedPeriodKey, setSelectedPeriodKey] = useState('');

  useEffect(() => {
    const buckets = exportFilterType === 'weekly' ? weeklyBuckets : monthlyBuckets;
    if (buckets.length > 0) {
      setSelectedPeriodKey(buckets[0].sortKey);
    } else {
      setSelectedPeriodKey('');
    }
  }, [exportFilterType, weeklyBuckets, monthlyBuckets]);

  const selectedPeriodLabel = useMemo(() => {
    const buckets = exportFilterType === 'weekly' ? weeklyBuckets : monthlyBuckets;
    const bucket = buckets.find(b => b.sortKey === selectedPeriodKey);
    return bucket ? bucket.label : '';
  }, [exportFilterType, weeklyBuckets, monthlyBuckets, selectedPeriodKey]);

  const filteredPayments = useMemo(() => {
    if (!selectedPeriodKey) return [];
    return paidPubs.filter((pub) => {
      const date = new Date(pub.paymentDetails.date);
      if (exportFilterType === 'weekly') {
        const sunday = new Date(date);
        sunday.setDate(date.getDate() - date.getDay());
        sunday.setHours(0, 0, 0, 0);
        return sunday.toISOString() === selectedPeriodKey;
      } else {
        const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return sortKey === selectedPeriodKey;
      }
    });
  }, [paidPubs, exportFilterType, selectedPeriodKey]);

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* ── Metric Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Total Publications Card */}
        <div className="bg-white border border-slate-200 hover:border-slate-350 hover:shadow-md transition-all duration-300 hover:scale-105 rounded-2xl p-6 flex flex-col justify-between relative group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Publications</span>
            <div className="h-9 w-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-slate-100 transition-colors">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-black font-mono text-slate-800">{totalPublications}</span>
            <p className="text-[11px] text-slate-500 mt-1">Cumulative submissions recorded in the system</p>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 hover:scale-105 rounded-2xl p-6 flex flex-col justify-between relative group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider">Total Revenue</span>
            <div className="h-9 w-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-black font-mono text-emerald-600">₹{totalRevenue.toLocaleString('en-IN')}</span>
            <p className="text-[11px] text-slate-500 mt-1">Aggregate processing fees successfully collected</p>
          </div>
        </div>
      </div>

      {/* ── Payment Registry Card ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-sm uppercase text-slate-700 tracking-wider">Payment Registry</h3>
            <p className="text-xs text-slate-400 mt-0.5">Registry of publication processing fees and transactions.</p>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="self-start sm:self-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Payments</span>
          </button>
        </div>

        {/* Scrollable table container */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="max-h-95 overflow-y-auto overflow-x-auto table-responsive">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-5 py-3 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Faculty Member
                  </th>
                  <th scope="col" className="px-5 py-3 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-5 py-3 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-5 py-3 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-5 py-3 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider text-right">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {paidPubs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-xs text-slate-400 font-medium">
                      No payments processed.
                    </td>
                  </tr>
                ) : (
                  paidPubs.map((pub) => (
                    <tr key={pub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 text-xs font-semibold text-slate-700">
                        {pub.author}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">
                        {pub.department}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                        {new Date(pub.paymentDetails.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-mono text-slate-450">
                        {pub.paymentDetails.transactionId}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-800 text-right font-mono">
                        ₹{((pub.paymentDetails.amount ?? 150) * (pub.versions ? pub.versions.length : 1)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Export Popup Modal ── */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          {/* Modal Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl w-full max-w-md space-y-6 relative animate-fade-in">
            {/* Close Button */}
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title */}
            <div>
              <h3 className="font-extrabold text-sm uppercase text-slate-700 tracking-wider">Export Payments</h3>
              <p className="text-xs text-slate-400 mt-0.5">Select a timeframe and download formatted payment sheets.</p>
            </div>

            {/* Tab/Selector for Weekly vs Monthly */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Timeframe Type</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => setExportFilterType('weekly')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    exportFilterType === 'weekly'
                      ? 'bg-white border border-slate-200 shadow-xs text-slate-800'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Weekly Period
                </button>
                <button
                  type="button"
                  onClick={() => setExportFilterType('monthly')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    exportFilterType === 'monthly'
                      ? 'bg-white border border-slate-200 shadow-xs text-slate-800'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Monthly Period
                </button>
              </div>
            </div>

            {/* Period Dropdown */}
            <div className="space-y-2">
              <label htmlFor="period-select" className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Select {exportFilterType === 'weekly' ? 'Week' : 'Month'}
              </label>
              <select
                id="period-select"
                value={selectedPeriodKey}
                onChange={(e) => setSelectedPeriodKey(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-355 focus:border-slate-355 cursor-pointer"
              >
                {(exportFilterType === 'weekly' ? weeklyBuckets : monthlyBuckets).map((bucket) => (
                  <option key={bucket.sortKey} value={bucket.sortKey}>
                    {bucket.label} ({bucket.count} {bucket.count === 1 ? 'payment' : 'payments'})
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  downloadPaymentsCSV(filteredPayments, selectedPeriodLabel);
                  setShowExportModal(false);
                }}
                disabled={filteredPayments.length === 0}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>CSV Format</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadPaymentsExcel(filteredPayments, selectedPeriodLabel);
                  setShowExportModal(false);
                }}
                disabled={filteredPayments.length === 0}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Excel Format</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
