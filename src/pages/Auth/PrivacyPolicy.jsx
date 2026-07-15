import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import rpmsLogo from '../../assets/logos/app-logo.png';

export default function PrivacyPolicy() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#050505] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      {/* Header */}
      <header className={`border-b px-6 py-4 ${isDark ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={rpmsLogo} alt="RPMS Logo" className="h-8 w-auto object-contain" />
            <span className={`font-bold text-base ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              SNS RPMS
            </span>
          </Link>
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content — placeholder until content is provided */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          Privacy Policy
        </h1>
        <p className={`text-sm mb-12 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        {/* Content will be added here */}
        <div className={`rounded-xl border-2 border-dashed p-12 text-center ${isDark ? 'border-white/10 text-slate-600' : 'border-slate-200 text-slate-400'}`}>
          <p className="text-sm">Content coming soon.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-8 mt-auto ${isDark ? 'bg-[#050505] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
            © {new Date().getFullYear()} SNS Groups. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              className={`transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/privacy"
              className={`transition-colors font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
