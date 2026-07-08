/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FacultyDashboardCharts } from '../../components/DashboardGrid';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { ExportModal } from '../../components/ExportModal';
import { DateRangePicker } from '../../components/DateRangePicker';
import { SearchableDropdown } from '../../components/SearchableDropdown';
import { Download, TrendingUp, BookOpen, Users, Loader2 } from 'lucide-react';
import * as dashboardApi from '../../api/dashboardApi';
import { INSTITUTION_OPTIONS, INSTITUTION_MAP } from '../../utils/constants';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { hasFeatureAccess } = usePermissions();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(['All Institutions']);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats from backend
  useEffect(() => {
    setLoading(true);

    const fetchAll = async () => {
      try {
        if (!selectedInstitution.includes('All Institutions') && selectedInstitution.length > 0) {
          const instIndices = selectedInstitution
            .map(inst => INSTITUTION_OPTIONS.indexOf(inst))
            .filter(idx => idx > 0);
          
          if (instIndices.length > 0) {
            const promises = instIndices.map(idx => 
              dashboardApi.fetchDashboard(idx.toString(), '', selectedDate, selectedEndDate)
            );
            const results = await Promise.all(promises);
            
            // Aggregate numeric fields
            const aggregated = {
              approved: results.reduce((sum, r) => sum + (r.approved || 0), 0),
              pending: results.reduce((sum, r) => sum + (r.pending || 0), 0),
              totalPublications: results.reduce((sum, r) => sum + (r.totalPublications || 0), 0),
              totalRevenue: results.reduce((sum, r) => sum + (r.totalRevenue || 0), 0),
              publications: results.flatMap(r => r.publications || []),
            };

            // Merge monthlyTrend by month
            const trendMap = {};
            results.forEach(r => {
              (r.monthlyTrend || []).forEach(entry => {
                const key = entry.month ?? entry.period ?? JSON.stringify(entry);
                if (!trendMap[key]) trendMap[key] = { ...entry, total: 0 };
                trendMap[key].total = (trendMap[key].total || 0) + Number(entry.total || 0);
              });
            });
            aggregated.monthlyTrend = Object.values(trendMap);

            // Merge publicationStatus by status
            const statusMap = {};
            results.forEach(r => {
              (r.publicationStatus || []).forEach(entry => {
                const key = entry.status;
                if (!statusMap[key]) statusMap[key] = { ...entry, count: 0 };
                statusMap[key].count = (statusMap[key].count || 0) + Number(entry.count || 0);
              });
            });
            aggregated.publicationStatus = Object.values(statusMap);

            setDashboardData(aggregated);
            return;
          }
        }
        
        const data = await dashboardApi.fetchDashboard(undefined, '', selectedDate, selectedEndDate);
        setDashboardData(data);
      } catch (err) {
        console.error('[Dashboard] Failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [selectedInstitution, selectedDate, selectedEndDate]);

  const completedCount = dashboardData?.approved ?? 0;
  const pendingCount = dashboardData?.pending ?? 0;
  const totalCount = dashboardData?.totalPublications ?? 0;
  const totalRevenue = dashboardData?.totalRevenue ?? 0;
  const publications = dashboardData?.publications ?? [];

  return (
    <div className="space-y-6 flex flex-col min-h-[calc(100vh-140px)] w-full min-w-0">
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} publications={publications} />
      <div className="bg-linear-to-r from-frost-gray via-pure-white to-pure-white p-4 sm:p-6 md:p-8 rounded-2xl border border-platinum-silver text-left space-y-3 sm:space-y-4 shadow-xs relative z-30 overflow-visible animate-fade-in neon-grey-glow cursor-default transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
        <div className="space-y-1 relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-sans tracking-tight text-shine">
            Welcome back, <span className="inline-block">{currentUser.name}!</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-gray leading-relaxed max-w-3xl">
            Manage institutional publications, reviews, and evaluation workflows here.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full relative z-20">
          <div className="bg-white h-10 px-4 rounded-xl border border-platinum-silver flex items-center space-x-2 shadow-xs transition-all duration-300 hover:scale-105 hover:shadow-xs text-xs font-bold text-charcoal shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Role: <strong className="font-extrabold">Admin</strong></span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center justify-end w-full sm:flex-1 relative z-20">
            <div className="w-full sm:w-[210px] shrink-0 relative z-30">
              <SearchableDropdown
                options={INSTITUTION_OPTIONS}
                value={selectedInstitution}
                onChange={setSelectedInstitution}
                placeholder="Search institution..."
                isMulti={true}
              />
            </div>
            <div className="w-full sm:w-[210px] shrink-0 relative z-20">
              <DateRangePicker 
                startDate={selectedDate}
                endDate={selectedEndDate}
                onChange={({ startDate, endDate }) => {
                  setSelectedDate(startDate);
                  setSelectedEndDate(endDate);
                }}
              />
            </div>
            
            {(selectedDate || selectedEndDate || (selectedInstitution.length > 0 && selectedInstitution[0] !== 'All Institutions')) && (
              <button
                onClick={() => {
                  setSelectedDate('');
                  setSelectedEndDate('');
                  setSelectedInstitution(['All Institutions']);
                }}
                className="h-10 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Clear
              </button>
            )}

            {hasFeatureAccess('export_data') && (
              <button
                onClick={() => setIsExportOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-4 rounded-xl border border-emerald-700 flex items-center space-x-2 shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer shrink-0 text-xs font-bold"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center text-slate-400 italic text-xs animate-pulse">Loading dashboard data...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow flex flex-col justify-between text-left transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-slate-300">
              <span className="text-[9px] uppercase font-bold text-emerald-600">Completed</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 mt-1">{completedCount}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow flex flex-col justify-between text-left transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-slate-300">
              <span className="text-[9px] uppercase font-bold text-indigo-500">Total Revenue</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-indigo-500 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow flex flex-col justify-between text-left transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-slate-300">
              <span className="text-[9px] uppercase font-bold text-amber-600">Pending</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-600 mt-1">{pendingCount}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow flex flex-col justify-between text-left transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-slate-300">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Total</span>
                <span className="text-[9px] uppercase font-bold text-slate-400 block mt-0.5">Publications</span>
              </div>
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-800 mt-1">{totalCount}</span>
            </div>
          </div>

          <div className="flex-1 min-h-[400px]">
            <FacultyDashboardCharts publications={publications} publicationStatuses={{ approved: completedCount, pending: pendingCount }} />
          </div>
        </>
      )}
    </div>
  );
}
