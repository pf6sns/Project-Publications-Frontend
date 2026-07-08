import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Home, ArrowLeft } from 'lucide-react';

function Orb({ className }) {
  return <div className={`absolute rounded-full pointer-events-none ${className}`} />;
}

export default function NotFound() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* ── Animated background ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #0a0a0a 0%, #121212 40%, #1a1a1a 70%, #0a0a0a 100%)'
            : 'linear-gradient(135deg, #e8edf5 0%, #dde4f0 40%, #e4e8f8 70%, #edf0fa 100%)',
        }}
      />

      {/* Mesh hex pattern overlay */}
      <div className="absolute inset-0 hex-grid opacity-60 pointer-events-none" />

      {/* Animated orbs */}
      <Orb className={`w-120 h-120 -top-30 -left-20 animate-float-slow
        ${isDark
          ? 'bg-emerald-900/10 blur-[100px]'
          : 'bg-indigo-200/50 blur-[90px]'}`}
      />
      <Orb className={`w-90 h-90 -bottom-20 -right-15 animate-float-med
        ${isDark
          ? 'bg-slate-800/30 blur-[90px]'
          : 'bg-violet-200/40 blur-[80px]'}`}
      />

      {/* ── Glass card ───────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-lg animate-card-entrance rounded-3xl text-center p-8 sm:p-12"
        style={{
          background: isDark
            ? 'rgba(18, 18, 18, 0.72)'
            : 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(28px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
          border: isDark
            ? '1px solid rgba(255,255,255,0.05)'
            : '1px solid rgba(255,255,255,0.9)',
          boxShadow: isDark
            ? '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.03)'
            : '0 32px 80px rgba(100,116,139,0.18), 0 0 0 1px rgba(255,255,255,0.6), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        {/* Shimmer top edge */}
        <div className="absolute top-0 left-0 h-0.5 w-full overflow-hidden rounded-t-3xl">
          <div className="h-full w-full gradient-strip opacity-60" />
        </div>

        <h1 
          className="text-7xl sm:text-9xl font-black mb-2 animate-fade-up"
          style={{ 
            background: isDark 
              ? 'linear-gradient(135deg, #34d399 0%, #059669 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: isDark ? 'drop-shadow(0 0 12px rgba(52,211,153,0.3))' : 'none'
          }}
        >
          404
        </h1>
        
        <h2 
          className="text-xl sm:text-2xl font-bold mb-4 animate-fade-up-d1"
          style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
        >
          Page Not Found
        </h2>
        
        <p 
          className="text-sm font-medium mb-8 animate-fade-up-d2 max-w-sm mx-auto"
          style={{ color: isDark ? '#94a3b8' : '#475569' }}
        >
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-d3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              color: isDark ? '#cbd5e1' : '#334155',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="shimmer-btn w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
              boxShadow: isDark
                ? '0 8px 32px rgba(4,120,87,0.3), 0 2px 8px rgba(4,120,87,0.1)'
                : '0 8px 32px rgba(5,150,105,0.4), 0 2px 8px rgba(5,150,105,0.2)',
            }}
          >
            <Home size={16} />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
