/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BarChart,
  ComposedChart,
  Area,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  LabelList,
} from 'recharts';

export const statusColors = {
  Completed: '#16A34A', // Green
  Pending: '#F59E0B',  // Amber/Orange
};

const renderCustomizedLabel = (props) => {
  const { x, y, width, value } = props;
  if (!value || value === 0) return null;
  return (
    <g>
      {/* Pill background */}
      <rect x={x + width / 2 - 15} y={y - 30} width={30} height={20} rx={10} fill="#10B981" />
      {/* Triangle pointer */}
      <polygon points={`${x + width / 2 - 4},${y - 10} ${x + width / 2 + 4},${y - 10} ${x + width / 2},${y - 5}`} fill="#10B981" />
      <text x={x + width / 2} y={y - 20} fill="#ffffff" textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight="extrabold">
        {value}
      </text>
    </g>
  );
};

export function FacultyDashboardCharts({ publications, publicationStatuses }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(currentYear.toString());
  
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIndex = new Date().getMonth();
  const months = selectedYear === currentYear.toString() 
    ? allMonths.slice(0, currentMonthIndex + 1) 
    : allMonths;

  const monthlyTrendData = months.map((month, index) => {
    const count = publications.filter(p => {
      if (!p.submissionDate) return false;
      const d = new Date(p.submissionDate);
      const matchesMonth = d.getMonth() === index;
      const matchesYear = selectedYear === 'All' || d.getFullYear().toString() === selectedYear;
      return matchesMonth && matchesYear;
    }).length;
    return { month, count };
  });

  const filteredPubsForYear = publications.filter(p => {
    if (selectedYear === 'All') return true;
    if (!p.submissionDate) return false;
    return new Date(p.submissionDate).getFullYear().toString() === selectedYear;
  });

  const donutData = [
    { name: 'Completed', value: publicationStatuses.approved, color: statusColors.Completed },
    { name: 'Pending Review', value: publicationStatuses.pending, color: statusColors.Pending },
  ].filter(d => d.value > 0);

  // If no publications, provide a fallback visual state
  const hasData = publicationStatuses.approved > 0 || publicationStatuses.pending > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[400px]">
      {/* Monthly Submission bar graph */}
      <div className="bg-pure-white p-4 sm:p-6 rounded-2xl border border-platinum-silver shadow-xs flex flex-col h-full min-w-0">
        <div>
          <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
            <div>
              <h3 className="font-bold text-charcoal text-sm">Monthly Submission Trend</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-gray">
                Total uploads by month ({selectedYear === 'All' ? 'All Years' : selectedYear})
              </p>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-[10px] bg-frost-gray text-charcoal px-2.5 py-1 pr-6 rounded-md font-bold uppercase tracking-wider border border-platinum-silver outline-none cursor-pointer appearance-none relative"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2523334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.4rem center',
                backgroundSize: '1.1em 1.1em',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <option value={currentYear.toString()}>Current Year ({currentYear})</option>
              <option value={(currentYear - 1).toString()}>{currentYear - 1}</option>
              <option value={(currentYear - 2).toString()}>{currentYear - 2}</option>
              <option value="All">All Years</option>
            </select>
          </div>

          {/* Dynamic Metric Badges to make it easily understandable */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6 bg-slate-50 p-2 sm:p-3 rounded-xl border border-platinum-silver/40">
            <div className="text-center">
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-900 font-extrabold leading-tight">Total Submissions</span>
              <span className="text-base sm:text-lg font-black text-emerald-800">{filteredPubsForYear.length}</span>
            </div>
            <div className="text-center border-x border-slate-200/60">
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-900 font-extrabold leading-tight">Active Months</span>
              <span className="text-base sm:text-lg font-black text-emerald-800">{monthlyTrendData.filter(d => d.count > 0).length}</span>
            </div>
            <div className="text-center">
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-900 font-extrabold leading-tight">Peak Month</span>
              <span className="text-base sm:text-lg font-black text-emerald-800">
                {filteredPubsForYear.length > 0 
                  ? monthlyTrendData.reduce((max, current) => current.count > max.count ? current : max, { month: 'None', count: -1 }).month
                  : 'None'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[250px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyTrendData} margin={{ top: 35, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                </linearGradient>
                <linearGradient id="barFillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981"/>
                  <stop offset="100%" stopColor="#047857"/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--chart-label)" fontSize={11} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis stroke="var(--chart-label)" fontSize={11} tickLine={false} allowDecimals={false} axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                cursor={{ fill: 'var(--chart-cursor)' }}
              />
              <Bar dataKey="count" fill="url(#barFillGradient)" radius={[6, 6, 0, 0]} barSize={26} name="Publications">
                <LabelList dataKey="count" content={renderCustomizedLabel} />
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Publication Status Pie Chart */}
      <div className="bg-pure-white p-4 sm:p-6 rounded-2xl border border-platinum-silver shadow-xs flex flex-col h-full min-w-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-charcoal text-sm">Publication Portfolio Status</h3>
            <p className="text-[11px] text-slate-gray">Status of submitted manuscripts</p>
          </div>
          <span className="text-[10px] bg-frost-gray text-charcoal px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-platinum-silver">
            Live Distribution
          </span>
        </div>
        
        <div className="flex-1 w-full flex flex-col xl:flex-row items-center justify-center gap-6 min-w-0 mt-4 min-h-[250px]">
          {!hasData ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-gray text-xs">
              <span>No submitted publications active.</span>
            </div>
          ) : (
            <>
              {/* Pie container */}
              <div className="w-full xl:w-1/2 h-56 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="approvedPieGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="pendingPieGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#D97706" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="85%"
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => {
                        const fillValue = entry.name === 'Completed'
                          ? 'url(#approvedPieGrad)'
                          : 'url(#pendingPieGrad)';
                        return <Cell key={`cell-${index}`} fill={fillValue} />;
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                    />
                    <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="font-sans font-black text-3xl" fill="var(--chart-text)">
                      {publications.length}
                    </text>
                    <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" className="font-sans font-extrabold text-[9px] uppercase tracking-widest" fill="var(--chart-label)">
                      Total Papers
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends */}
              <div className="w-full xl:w-1/2 space-y-4 pr-2 pl-2 xl:pl-6 pb-4 xl:pb-0 min-w-0">
                {donutData.map((d, idx) => {
                  const pct = Math.round((d.value / publications.length) * 100) || 0;
                  return (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0 gap-2">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <span className="w-3.5 h-3.5 rounded-full shrink-0 border" style={{ backgroundColor: d.color, borderColor: 'rgba(0,0,0,0.05)' }} />
                        <span className="text-xs font-semibold text-charcoal truncate">
                          {d.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-charcoal bg-frost-gray px-2.5 py-1 rounded-lg border border-platinum-silver font-mono shadow-2xs shrink-0 whitespace-nowrap">
                        {d.value} <span className="text-[10px] text-slate-500 font-medium ml-1">({pct}%)</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ADMIN DASHBOARD & ANALYTICS CHARTS
// -------------------------------------------------------------

export function AdminAnalyticsDashboardCharts({
  stats,
  departmentSubmissions,
}) {
  const donutData = [
    { name: 'Completed', value: stats.approved, color: '#16A34A' },
    { name: 'Pending Review', value: stats.pending, color: '#F59E0B' },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Department comparisons */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:scale-[1.015] hover:shadow-md hover:border-slate-300 min-w-0">
        <div className="mb-4">
          <h3 className="font-bold text-slate-800 text-sm">Submissions by Department</h3>
          <p className="text-[11px] text-slate-400">Manuscripts submitted per department</p>
        </div>
        
        <div className="chart-sm w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentSubmissions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="dept" stroke="var(--chart-label)" fontSize={10} tickLine={false} />
              <YAxis stroke="var(--chart-label)" fontSize={10} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', fontSize: '11px', border: 'none' }}
              />
              <Legend verticalAlign="top" height={36} fontSize={10} />
              <Bar dataKey="approved" stackId="a" fill="#16A34A" name="Completed" barSize={20} />
              <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Global Status Distribution */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:scale-[1.015] hover:shadow-md hover:border-slate-300 min-w-0">
        <div className="mb-4">
          <h3 className="font-bold text-slate-800 text-sm">Publication Status</h3>
          <p className="text-[11px] text-slate-400">Status of all submitted papers</p>
        </div>

        <div className="h-auto w-full flex flex-col xl:flex-row items-center justify-between gap-6 min-w-0">
          {donutData.length === 0 ? (
            <div className="flex-1 text-center py-10 text-slate-400 text-xs text-mono italic">
              No submissions tracked in session
            </div>
          ) : (
            <>
              {/* Pie center */}
              <div className="w-full xl:w-1/2 h-48 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius="55%"
                      outerRadius="85%"
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="w-full xl:w-1/2 space-y-3 pr-2 pl-2 xl:pl-4 pb-4 xl:pb-0 min-w-0">
                {donutData.map((d, index) => (
                  <div key={index} className="flex items-center justify-between pb-1.5 border-b border-slate-50 last:border-0 last:pb-0 gap-2">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-xs font-semibold text-slate-600 truncate">{d.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                      {d.value} ({Math.round((d.value / stats.total) * 100) || 0}%)
                    </span>
                  </div>
                ))}
                
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Publications</span>
                  <span className="text-xs font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    {stats.total}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
