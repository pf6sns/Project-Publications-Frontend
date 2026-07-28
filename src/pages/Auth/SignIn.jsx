/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import { Key, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import snsLogo from '../../assets/logos/app-logo.png';

/* ─── Floating orb decoration ─────────────────────────────────────────────── */
function Orb({ className, style }) {
  return <div className={`absolute rounded-full pointer-events-none ${className}`} style={style} />;
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Force light mode — strip 'dark' class from <html> while this page is mounted
  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains('dark');
    root.classList.remove('dark');
    return () => { if (wasDark) root.classList.add('dark'); };
  }, []);

  const isDark = false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Ensure email contains @
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    // Forward email + password to POST /api/auth/sso-login → external Okrion SSO
    const res = await login({ email, password });
    setIsLoading(false);
    if (res.success) {

      if (res.user.role?.toLowerCase() === 'developer') {

        navigate('/developer/assign-role');

      } else if (
        res.user.admin === true ||
        res.user.temp_admin === true
      ) {

        navigate('/admin/dashboard');

      } else {

        navigate('/faculty/upload');

      }

    } else {

      setError(res.error);

    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">

      {/* ── Back to Home Button ───────────────────────────────────────────── */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 sm:top-7 sm:left-8 z-30 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 4px 16px rgba(5,150,105,0.15), 0 1px 4px rgba(0,0,0,0.06)',
          color: '#0f172a',
        }}
      >
        <ArrowLeft size={14} className="text-emerald-600 group-hover:-translate-x-0.5 transition-transform duration-300" />
        <span className="tracking-wide">Back to Home</span>
      </button>

      {/* ══ WARM COASTAL BREEZE & BEACH WAVES BACKGROUND SYSTEM ════════════ */}

      {/* Layer 1 — Coastal Sky & Ocean Horizon Base Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #F8FFF9 0%, #EAFBF3 35%, #D4F6E7 68%, #C7F3E2 100%)',
        }}
      />

      {/* Layer 2 — Warm Sunlight Horizon Glow (Top-Right Warm Bloom) */}
      <div
        className="absolute w-200 h-200 pointer-events-none"
        style={{
          top: '-25%', right: '-15%',
          background: 'radial-gradient(circle, rgba(255,251,235,0.7) 0%, rgba(212,246,231,0.4) 45%, transparent 75%)',
          filter: 'blur(160px)',
          animation: 'sun-shimmer 12s ease-in-out infinite',
        }}
      />

      {/* Layer 3 — Gentle Rolling Shoreline Ocean Waves */}
      <div className="absolute inset-x-0 bottom-0 h-[50vh] overflow-hidden pointer-events-none z-0 opacity-70">
        {/* Wave 1: Deep Ocean Tide Wave */}
        <svg
          className="absolute bottom-0 w-[140%] left-[-20%] h-80 text-[#62D8AF]/25"
          style={{ animation: 'tide-swell-1 18s ease-in-out infinite' }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path fill="currentColor" d="M0,160 C320,240 420,80 720,160 C1020,240 1120,90 1440,160 L1440,320 L0,320 Z" />
        </svg>

        {/* Wave 2: Mid-Sea Aqua Tide Wave */}
        <svg
          className="absolute bottom-0 w-[140%] left-[-10%] h-70 text-[#7DDDC1]/35"
          style={{ animation: 'tide-swell-2 24s 2s ease-in-out infinite' }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path fill="currentColor" d="M0,192 C280,110 520,240 800,160 C1080,80 1280,210 1440,140 L1440,320 L0,320 Z" />
        </svg>

        {/* Wave 3: Light Foam Tide Crest */}
        <svg
          className="absolute bottom-0 w-[140%] left-[-15%] h-57.5 text-[#A7ECD2]/45"
          style={{ animation: 'tide-swell-1 20s 4s ease-in-out infinite' }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path fill="currentColor" d="M0,224 C360,160 600,260 920,180 C1240,100 1360,220 1440,192 L1440,320 L0,320 Z" />
        </svg>

        {/* Wave 4: Glistening White Surface Wave Foam */}
        <svg
          className="absolute bottom-0 w-[140%] left-[-5%] h-45 text-[#F6FFF9]/60"
          style={{ animation: 'tide-swell-2 26s 1s ease-in-out infinite' }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path fill="currentColor" d="M0,256 C400,200 680,270 960,220 C1240,170 1380,240 1440,230 L1440,320 L0,320 Z" />
        </svg>
      </div>

      {/* Layer 4 — Warm Soft Sunbeams (Coastal Sunlight Rays) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%', right: '5%',
          width: '450px', height: '130vh',
          background: 'linear-gradient(135deg, rgba(255,251,235,0.2) 0%, rgba(212,246,231,0.08) 50%, transparent 80%)',
          filter: 'blur(35px)',
          transformOrigin: 'top right',
          animation: 'light-ray-slow 35s ease-in-out infinite alternate',
        }}
      />

      {/* Layer 5 — Gentle Coastal Warm Breeze Particle Drift (Floating sideways across viewport) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[
          { top: '15%', size: 4, duration: '16s', delay: '0s' },
          { top: '28%', size: 3, duration: '20s', delay: '3s' },
          { top: '42%', size: 5, duration: '14s', delay: '6s' },
          { top: '55%', size: 3, duration: '22s', delay: '2s' },
          { top: '68%', size: 4, duration: '18s', delay: '8s' },
          { top: '78%', size: 3, duration: '24s', delay: '4s' },
          { top: '22%', size: 4, duration: '19s', delay: '11s' },
          { top: '36%', size: 3, duration: '23s', delay: '7s' },
          { top: '62%', size: 5, duration: '15s', delay: '13s' },
          { top: '84%', size: 4, duration: '21s', delay: '9s' },
          { top: '10%', size: 3, duration: '17s', delay: '14s' },
          { top: '48%', size: 4, duration: '25s', delay: '5s' },
          { top: '73%', size: 3, duration: '18s', delay: '12s' },
        ].map((breeze, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,251,235,0.9)]"
            style={{
              width: `${breeze.size}px`,
              height: `${breeze.size}px`,
              top: breeze.top,
              animation: `breeze-flow ${breeze.duration} ${breeze.delay} linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Layer 6 — Ambient Warm Soft Glow behind Card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 48%, rgba(255,253,245,0.85) 0%, rgba(248,255,249,0.4) 55%, transparent 75%)',
        }}
      />

      {/* Layer 7 — Ultra-Light Noise Overlay (1% opacity) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
          opacity: 0.01,
          mixBlendMode: 'multiply',
        }}
      />

      {/* ── Glass card ───────────────────────────────────────────────────── */}


      <div
        className="relative z-10 w-full max-w-sm sm:max-w-md animate-card-entrance rounded-3xl"
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

        {/* ── Header brand section ─────────────────────────────────────── */}
        <div className="pt-8 pb-6 px-8 text-center relative">
          {/* Glow behind logo */}
          <div
            className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* SNS Logo — real asset, www text naturally absent in stored file */}
          <div className="relative inline-block mb-4">
            <div
              className="p-3 rounded-2xl inline-flex animate-pulse-ring"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)',
                boxShadow: isDark
                  ? '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
                  : '0 4px 24px rgba(100,116,139,0.12), inset 0 1px 0 rgba(255,255,255,1)',
              }}
            >
              <img
                src={snsLogo}
                alt="SNS Institutions"
                className="w-32 sm:w-40 h-auto object-contain drop-shadow-sm"
                draggable={false}
              />
            </div>
          </div>

          {/* Tagline */}
          <p
            className="text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase mt-1"
            style={{ color: isDark ? '#64748b' : '#94a3b8' }}
          >
            Research Publication Management
          </p>

          {/* Divider */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest px-2"
              style={{ color: isDark ? '#334155' : '#cbd5e1' }}>Secure Portal</span>
            <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }} />
          </div>
        </div>

        {/* ── Form section ─────────────────────────────────────────────── */}
        <div className="px-6 sm:px-8 pb-8">

          {/* Error alert */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-semibold animate-fade-up"
              style={{
                background: isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: isDark ? '#f87171' : '#dc2626',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5 animate-fade-up-d1">
              <label
                className="text-[10px] font-bold uppercase tracking-[0.15em] ml-1"
                style={{ color: isDark ? '#475569' : '#94a3b8' }}
              >
                Email
              </label>
              <input
                id="signin-email"
                type="email"
                value={email}
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                className="signin-input w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300"
                placeholder="e.g. kumar@snsgroups.com"
                required
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5 animate-fade-up-d2">
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.15em] ml-1"
                style={{ color: isDark ? '#475569' : '#94a3b8' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="signin-input w-full px-4 py-3.5 pr-12 rounded-xl text-sm font-medium transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors cursor-pointer"
                  style={{ color: isDark ? '#64748b' : '#94a3b8' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end">
                <a
                  href="https://app.okrion.ai/forgot-password"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>


            {/* Submit button */}
            <div className="animate-fade-up-d3 pt-2">
              <button
                id="signin-submit"
                type="submit"
                disabled={isLoading}
                className="shimmer-btn w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-sm text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: isDark
                    ? (isLoading
                      ? 'linear-gradient(135deg, #047857, #064e3b)'
                      : 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)')
                    : (isLoading
                      ? 'linear-gradient(135deg, #059669, #047857)'
                      : 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)'),
                  boxShadow: isDark
                    ? '0 8px 32px rgba(4,120,87,0.3), 0 2px 8px rgba(4,120,87,0.1)'
                    : '0 8px 32px rgba(5,150,105,0.4), 0 2px 8px rgba(5,150,105,0.2)',
                  color: '#ffffff',
                }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>Authenticating…</span>
                  </>
                ) : (
                  <>
                    <Key size={15} className="opacity-80" />
                    <span>Authenticate Session</span>
                    <ArrowRight size={15} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* SSO hint */}
          <p
            className="mt-6 text-center text-xs font-semibold animate-fade-up-d4"
            style={{ color: isDark ? '#94a3b8' : '#475569' }}
          >
            Use OKRion Credentials
          </p>
        </div>
      </div>
    </div>
  );
}
