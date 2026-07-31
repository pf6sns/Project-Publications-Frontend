import React, { useEffect } from 'react';
import { Mail, Clock, RefreshCw } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

// Import your two image variations
import maintenanceArt from '../../assets/images/maintenanceimage.jpeg';
import maintenanceArtOpen from '../../assets/images/maintenanceimage.jpeg';

export default function Maintenance() {
  const { recheckHealth, isChecking } = useHealth() || {};

  // Force light mode on this specific page by removing dark class from HTML
  useEffect(() => {
    const htmlEl = document.documentElement;
    const hadDark = htmlEl.classList.contains('dark');
    if (hadDark) {
      htmlEl.classList.remove('dark');
    }
    return () => {
      // Revert back if they navigate away
      if (hadDark) {
        htmlEl.classList.add('dark');
      }
    };
  }, []);

  return (
    <>
      {/* 
        Injecting custom animations directly in the component so it's a completely standalone file 
      */}
      <style>
        {`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
            33% { transform: translateY(-18px) translateX(8px) scale(1.04); }
            66% { transform: translateY(12px) translateX(-5px) scale(0.98); }
          }
          @keyframes blink-meditation {
            0%, 85% { opacity: 1; }
            88%, 92% { opacity: 0; }
            95%, 100% { opacity: 1; }
          }
          .custom-animate-float-slow {
            animation: float-slow 9s ease-in-out infinite;
          }
          .custom-animate-blink-meditation {
            animation: blink-meditation 6s infinite;
          }
        `}
      </style>

      <div
        className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8"
        style={{ backgroundColor: '#ffffff', color: '#1e293b' }}
      >
        {/* Container for the illustration */}
        <div className="relative w-full max-w-3xl flex justify-center mb-4">
          {/* The container itself bobs up and down gently to make everything "float" */}
          <div className="relative w-full max-w-xl custom-animate-float-slow flex justify-center">
            {/* Base image (Closed Eyes) */}
            <img
              src={maintenanceArt}
              alt="Maintenance Illustration"
              className="w-full object-contain"
            />

            {/* Overlay image (Open Eyes) with blink animation */}
            <img
              src={maintenanceArtOpen}
              alt=""
              className="absolute inset-0 w-full h-full object-contain custom-animate-blink-meditation"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="text-center max-w-2xl z-10">
          <h1
            className="text-4xl sm:text-6xl font-black mb-4 tracking-tight"
            style={{ color: '#1e293b' }}
          >
            System Maintenance
          </h1>

          <p
            className="text-lg sm:text-xl font-medium mb-8 max-w-xl mx-auto"
            style={{ color: '#64748b' }}
          >
            We're taking a moment of zen to upgrade the SNS RPMS system. Please check back shortly!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl w-full sm:w-auto transition-all"
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #f1f5f9',
              }}
            >
              <Clock size={20} style={{ color: '#94a3b8' }} />
              <span className="font-bold text-sm" style={{ color: '#475569' }}>
                Estimated downtime: Temporary
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                if (recheckHealth) recheckHealth();
                else window.location.reload();
              }}
              disabled={isChecking}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-white transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
              }}
            >
              <RefreshCw size={18} className={isChecking ? 'animate-spin' : ''} />
              {isChecking ? 'Checking System Status...' : 'Check System Status'}
            </button>

            <button
              onClick={() => window.location.href = 'mailto:support@sns.edu'}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-white transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Mail size={18} />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
