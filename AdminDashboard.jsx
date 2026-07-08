import React, { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — Replace with your real data source
   ═══════════════════════════════════════════════════════════════ */
const MOCK_DATA = {
  approved: 14,
  pending: 6,
  rejected: 4,
  total: 24,
  monthly: [2, 3, 7, 4, 5, 3],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER HOOK
   ═══════════════════════════════════════════════════════════════ */
function useAnimatedCounter(target, duration = 800, delay = 400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return value;
}

/* ═══════════════════════════════════════════════════════════════
   BAR CHART COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function BarChartPanel({ isDark }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const buildChart = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');

    if (chartRef.current) chartRef.current.destroy();

    const gridColor = isDark ? '#2e3748' : '#E2E5E9';
    const labelColor = isDark ? '#94a3b8' : '#6B7281';

    const grad = ctx.createLinearGradient(0, 0, 0, 300);
    grad.addColorStop(0, '#10B981');
    grad.addColorStop(1, '#047857');

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MOCK_DATA.months,
        datasets: [{
          label: 'Submissions',
          data: MOCK_DATA.monthly,
          backgroundColor: grad,
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 28,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1200, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1E293B',
            titleColor: '#FFF',
            bodyColor: '#FFF',
            cornerRadius: 8,
            titleFont: { size: 11, weight: 'bold' },
            bodyFont: { size: 11 },
            padding: 10,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: labelColor, font: { size: 11 } },
            border: { display: false },
          },
          y: {
            grid: { color: gridColor, drawBorder: false },
            ticks: {
              color: labelColor,
              font: { size: 11 },
              stepSize: 1,
              callback: (v) => Number.isInteger(v) ? v : '',
            },
            border: { display: false },
            beginAtZero: true,
          },
        },
      },
    });
  }, [isDark]);

  useEffect(() => {
    buildChart();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [buildChart]);

  const activeMonths = MOCK_DATA.monthly.filter(v => v > 0).length;
  const peakIdx = MOCK_DATA.monthly.indexOf(Math.max(...MOCK_DATA.monthly));

  return (
    <div className="db-chart-card animate-fade-in animate-delay-1">
      <div className="db-chart-header">
        <div>
          <div className="db-chart-title">Monthly Submission Trend</div>
          <div className="db-chart-subtitle">Total submissions by month (All Departments)</div>
        </div>
        <select className="db-year-select" defaultValue="2026">
          <option value="2026">Current Year (2026)</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="all">All Years</option>
        </select>
      </div>

      <div className="db-metric-badges">
        <div className="db-metric-item">
          <span className="db-metric-label">Total Submissions</span>
          <span className="db-metric-value">{MOCK_DATA.total}</span>
        </div>
        <div className="db-metric-item">
          <span className="db-metric-label">Active Months</span>
          <span className="db-metric-value">{activeMonths}</span>
        </div>
        <div className="db-metric-item">
          <span className="db-metric-label">Peak Month</span>
          <span className="db-metric-value">{MOCK_DATA.months[peakIdx]}</span>
        </div>
      </div>

      <div className="db-chart-container">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DOUGHNUT CHART COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function DoughnutChartPanel({ isDark }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const data = [
    { name: 'Approved', value: MOCK_DATA.approved, color: '#16A34A' },
    { name: 'Pending Review', value: MOCK_DATA.pending, color: '#F59E0B' },
    { name: 'Rejected', value: MOCK_DATA.rejected, color: '#DC2626' },
  ].filter(d => d.value > 0);

  const buildChart = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map(d => d.color),
          borderWidth: 0,
          spacing: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '68%',
        animation: { animateRotate: true, duration: 1200, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1E293B',
            titleColor: '#FFF',
            bodyColor: '#FFF',
            cornerRadius: 8,
            titleFont: { size: 11, weight: 'bold' },
            bodyFont: { size: 11 },
            padding: 10,
          },
        },
      },
    });
  }, [isDark]);

  useEffect(() => {
    buildChart();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [buildChart]);

  return (
    <div className="db-chart-card animate-fade-in animate-delay-2">
      <div className="db-chart-header">
        <div>
          <div className="db-chart-title">Publication Portfolio Status</div>
          <div className="db-chart-subtitle">Status of all submitted manuscripts</div>
        </div>
        <span className="db-chart-badge">Live Distribution</span>
      </div>

      <div className="db-pie-layout">
        <div className="db-pie-container">
          <canvas ref={canvasRef} />
          <div className="db-pie-center-label">
            <div className="db-pie-center-number">{MOCK_DATA.total}</div>
            <div className="db-pie-center-text">Total Papers</div>
          </div>
        </div>

        <div className="db-legend-list">
          {data.map((d, idx) => {
            const pct = Math.round((d.value / MOCK_DATA.total) * 100);
            return (
              <div key={idx} className="db-legend-row">
                <div className="db-legend-left">
                  <span className="db-legend-dot" style={{ backgroundColor: d.color }} />
                  <span className="db-legend-name">{d.name}</span>
                </div>
                <span className="db-legend-value">
                  {d.value} <span className="db-legend-pct">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT (default export)
   ═══════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('admin-dashboard-theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('admin-dashboard-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const totalAnimated = useAnimatedCounter(MOCK_DATA.total, 800, 400);
  const approvedAnimated = useAnimatedCounter(MOCK_DATA.approved, 800, 500);
  const pendingAnimated = useAnimatedCounter(MOCK_DATA.pending, 800, 600);
  const rejectedAnimated = useAnimatedCounter(MOCK_DATA.rejected, 800, 700);

  return (
    <>
      {/* ── Scoped CSS (all classes prefixed with db-) ──────────── */}
      <style>{`
        /* ═══════════════════════════════════════════════════════
           DESIGN TOKENS
           ═══════════════════════════════════════════════════════ */
        :root {
          --db-font: "Geist", "Inter", system-ui, sans-serif;
          --db-arctic-white: #F4F6F9;
          --db-pure-white: #FFFFFF;
          --db-platinum-silver: #DCDFE4;
          --db-charcoal: #1E2530;
          --db-slate-gray: #5E6977;
          --db-frost-gray: #E2E5E9;
          --db-brushed-silver: #BEC2C9;
          --db-approved: #10B981;
          --db-approved-deep: #047857;
          --db-rejected: #DC2626;
          --db-pending: #F59E0B;
        }

        .dark {
          --db-arctic-white: #13171d;
          --db-pure-white: #1e2530;
          --db-platinum-silver: #2e3748;
          --db-charcoal: #f8fafc;
          --db-slate-gray: #94a3b8;
          --db-frost-gray: #252d3d;
          --db-brushed-silver: #3c485d;
        }

        /* ═══════════════════════════════════════════════════════
           KEYFRAME ANIMATIONS
           ═══════════════════════════════════════════════════════ */
        @keyframes db-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: db-fade-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animate-delay-1 { animation-delay: 0.1s; }
        .animate-delay-2 { animation-delay: 0.2s; }

        @keyframes db-neon-grey-pulse {
          0%, 100% {
            box-shadow: 0 0 20px 2px rgba(107,114,128,0.35),
                        0 0 8px 0.5px rgba(156,163,175,0.15);
            border-color: var(--db-platinum-silver);
          }
          50% {
            box-shadow: 0 0 30px 6px rgba(107,114,128,0.55),
                        0 0 12px 2px rgba(156,163,175,0.35);
            border-color: var(--db-brushed-silver);
          }
        }
        .db-neon-grey-glow {
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1) !important;
        }
        .db-neon-grey-glow:hover {
          transform: scale(1.003) !important;
          animation: db-neon-grey-pulse 2.5s infinite ease-in-out !important;
        }

        @keyframes db-text-shine-flow {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .db-text-shine {
          background: linear-gradient(90deg,
            var(--db-charcoal) 0%, var(--db-charcoal) 25%,
            #94a3b8 50%,
            var(--db-charcoal) 75%, var(--db-charcoal) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
          animation: db-text-shine-flow 5s linear infinite !important;
          display: inline-block;
        }
        .dark .db-text-shine {
          background: linear-gradient(90deg,
            #f8fafc 0%, #f8fafc 25%, #94a3b8 50%, #f8fafc 75%, #f8fafc 100%);
          background-size: 200% auto;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
          animation: db-text-shine-flow 5s linear infinite !important;
        }

        @keyframes db-count-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes db-pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50%      { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
        }

        /* ═══════════════════════════════════════════════════════
           COMPONENT STYLES
           ═══════════════════════════════════════════════════════ */
        .db-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
          font-family: var(--db-font);
          color: var(--db-charcoal);
        }

        /* Theme toggle */
        .db-theme-toggle {
          position: fixed; top: 20px; right: 20px; z-index: 100;
          width: 44px; height: 44px; border-radius: 14px;
          border: 1px solid var(--db-platinum-silver);
          background: var(--db-pure-white);
          color: var(--db-charcoal);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .db-theme-toggle:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          transform: translateY(-2px) !important;
        }

        /* Welcome Banner */
        .db-welcome-banner {
          background: linear-gradient(to right, var(--db-frost-gray), var(--db-pure-white), var(--db-pure-white));
          padding: 24px 32px;
          border-radius: 16px;
          border: 1px solid var(--db-platinum-silver);
          text-align: left;
          position: relative; overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          cursor: default;
          transition: all 0.3s ease;
        }
        .db-welcome-banner:hover {
          transform: scale(1.01);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .db-welcome-title {
          font-size: clamp(1.25rem, 3vw, 1.875rem);
          font-weight: 900;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        .db-welcome-subtitle {
          font-size: 11px;
          color: var(--db-slate-gray);
          line-height: 1.6;
          max-width: 640px;
          margin-top: 4px;
        }
        .db-department-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--db-pure-white);
          padding: 10px 16px; border-radius: 12px;
          border: 1px solid var(--db-platinum-silver);
          font-size: 11px; font-weight: 700;
          color: var(--db-charcoal);
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          margin-top: 12px;
          transition: all 0.3s ease;
        }
        .db-department-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .db-status-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background-color: var(--db-approved);
          animation: db-pulse-ring 2.5s ease-in-out infinite;
        }

        /* Scorecard Grid */
        .db-scorecard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 1024px) {
          .db-scorecard-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .db-scorecard {
          background: var(--db-pure-white);
          padding: 16px; border-radius: 12px;
          border: 1px solid var(--db-platinum-silver);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          display: flex; flex-direction: column;
          justify-content: space-between;
          text-align: left;
          transition: all 0.3s ease;
          animation: db-count-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .db-scorecard:nth-child(1) { animation-delay: 0.1s; }
        .db-scorecard:nth-child(2) { animation-delay: 0.2s; }
        .db-scorecard:nth-child(3) { animation-delay: 0.3s; }
        .db-scorecard:nth-child(4) { animation-delay: 0.4s; }
        .db-scorecard:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          border-color: var(--db-brushed-silver);
        }
        .db-scorecard-label {
          font-size: 9px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .db-scorecard-value {
          font-size: 1.5rem;
          font-weight: 900;
          font-family: "SF Mono", "Fira Code", monospace;
          margin-top: 4px;
        }
        .db-label-approved { color: var(--db-approved); }
        .db-label-rejected { color: var(--db-rejected); }
        .db-label-pending  { color: var(--db-pending); }
        .db-label-total    { color: var(--db-slate-gray); }
        .db-value-approved { color: var(--db-approved); }
        .db-value-rejected { color: var(--db-rejected); }
        .db-value-pending  { color: var(--db-pending); }
        .db-value-total    { color: var(--db-charcoal); }

        /* Chart Cards */
        .db-charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px; flex: 1; min-height: 400px;
        }
        @media (min-width: 1024px) {
          .db-charts-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .db-chart-card {
          background: var(--db-pure-white);
          padding: 24px; border-radius: 16px;
          border: 1px solid var(--db-platinum-silver);
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          display: flex; flex-direction: column;
          transition: all 0.3s ease;
        }
        .db-chart-card:hover {
          transform: scale(1.015);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          border-color: var(--db-brushed-silver);
        }
        .db-chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .db-chart-title {
          font-size: 14px; font-weight: 700;
          color: var(--db-charcoal);
        }
        .db-chart-subtitle {
          font-size: 11px; color: var(--db-slate-gray);
          margin-top: 2px;
        }
        .db-chart-badge {
          font-size: 10px;
          background: var(--db-frost-gray);
          color: var(--db-charcoal);
          padding: 4px 10px; border-radius: 6px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid var(--db-platinum-silver);
        }

        /* Metric badges */
        .db-metric-badges {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px; margin-bottom: 20px;
          background: var(--db-frost-gray);
          padding: 12px; border-radius: 12px;
          border: 1px solid rgba(220,223,228,0.4);
        }
        .db-metric-item { text-align: center; }
        .db-metric-item:not(:last-child) {
          border-right: 1px solid rgba(220,223,228,0.6);
        }
        .db-metric-label {
          display: block; font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 800;
          color: var(--db-charcoal);
        }
        .db-metric-value {
          font-size: 1.125rem;
          font-weight: 900;
          color: var(--db-approved-deep);
        }
        .db-chart-container {
          flex: 1; min-height: 280px;
          position: relative;
        }

        /* Year selector */
        .db-year-select {
          font-size: 10px;
          background: var(--db-frost-gray);
          color: var(--db-charcoal);
          padding: 4px 24px 4px 10px;
          border-radius: 6px; font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid var(--db-platinum-silver);
          outline: none; cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
          background-position: right 0.4rem center;
          background-size: 1.1em 1.1em;
          background-repeat: no-repeat;
        }

        /* Pie chart */
        .db-pie-layout {
          display: flex; flex-direction: column;
          align-items: center; gap: 24px; flex: 1;
        }
        @media (min-width: 768px) {
          .db-pie-layout { flex-direction: row; }
        }
        .db-pie-container {
          width: 100%; max-width: 280px;
          position: relative;
        }
        .db-pie-center-label {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          text-align: center; pointer-events: none;
        }
        .db-pie-center-number {
          font-size: 2rem; font-weight: 900;
          color: var(--db-charcoal);
          line-height: 1;
        }
        .db-pie-center-text {
          font-size: 9px; text-transform: uppercase;
          letter-spacing: 0.1em; font-weight: 800;
          color: var(--db-slate-gray); margin-top: 4px;
        }

        /* Legend */
        .db-legend-list {
          flex: 1; display: flex;
          flex-direction: column; gap: 12px;
        }
        .db-legend-row {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--db-frost-gray);
        }
        .db-legend-row:last-child {
          border-bottom: none; padding-bottom: 0;
        }
        .db-legend-left {
          display: flex; align-items: center; gap: 10px;
        }
        .db-legend-dot {
          width: 14px; height: 14px;
          border-radius: 50%; flex-shrink: 0;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .db-legend-name {
          font-size: 12px; font-weight: 600;
          color: var(--db-charcoal);
        }
        .db-legend-value {
          font-size: 12px; font-weight: 700;
          color: var(--db-charcoal);
          background: var(--db-frost-gray);
          padding: 4px 10px; border-radius: 8px;
          border: 1px solid var(--db-platinum-silver);
          font-family: "SF Mono", "Fira Code", monospace;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .db-legend-pct {
          font-size: 10px; color: var(--db-slate-gray);
          font-weight: 500; margin-left: 4px;
        }

        @media (max-width: 639px) {
          .db-chart-container { min-height: 220px; }
        }
        @media (min-width: 1440px) {
          .db-chart-container { min-height: 340px; }
        }
      `}</style>

      {/* Theme Toggle */}
      <button
        className="db-theme-toggle"
        onClick={() => setIsDark(prev => !prev)}
        aria-label="Toggle dark mode"
        title="Toggle dark/light mode"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className="db-container">
        {/* ── Welcome Banner ─────────────────────────────────── */}
        <div className="db-welcome-banner animate-fade-in db-neon-grey-glow">
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h1 className="db-welcome-title db-text-shine">
              Welcome back, Dr. S. Vignesh!
            </h1>
            <p className="db-welcome-subtitle">
              Manage institutional publications, review submissions, delegate evaluations, and monitor research output — all from your admin command centre.
            </p>
          </div>
          <div className="db-department-badge">
            <span className="db-status-dot" />
            <span>Department: <strong>Office of Dean (Research)</strong></span>
          </div>
        </div>

        {/* ── Scorecard Cards ────────────────────────────────── */}
        <div className="db-scorecard-grid animate-fade-in">
          <div className="db-scorecard">
            <span className="db-scorecard-label db-label-approved">Total Submissions</span>
            <span className="db-scorecard-value db-value-approved">{totalAnimated}</span>
          </div>
          <div className="db-scorecard">
            <span className="db-scorecard-label db-label-approved">Approved</span>
            <span className="db-scorecard-value db-value-approved">{approvedAnimated}</span>
          </div>
          <div className="db-scorecard">
            <span className="db-scorecard-label db-label-pending">Pending Review</span>
            <span className="db-scorecard-value db-value-pending">{pendingAnimated}</span>
          </div>
          <div className="db-scorecard">
            <span className="db-scorecard-label db-label-rejected">Rejected</span>
            <span className="db-scorecard-value db-value-rejected">{rejectedAnimated}</span>
          </div>
        </div>

        {/* ── Charts ─────────────────────────────────────────── */}
        <div className="db-charts-grid">
          <BarChartPanel isDark={isDark} />
          <DoughnutChartPanel isDark={isDark} />
        </div>
      </div>
    </>
  );
}
