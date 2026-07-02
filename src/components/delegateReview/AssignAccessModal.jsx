/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldCheck, 
  X, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

export function GrantAssessorModal({
  isOpen,
  onClose,
  facultyUser,
  type,
}) {
  if (!isOpen || !facultyUser) return null;

  const isGranted = type === 'granted';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4 overflow-y-auto">
      <div className="w-full max-w-md overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-2xl animate-scale-in my-8">
        
        {/* Header Banner */}
        <div className={`p-5 flex items-center justify-between text-left text-white ${
          isGranted ? 'bg-emerald-600' : 'bg-red-650'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              {isGranted ? (
                <ShieldCheck className="h-5 w-5 text-white" />
              ) : (
                <AlertCircle className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider">
                {isGranted ? 'Access Granted' : 'Access Revoked'}
              </h3>
              <p className="text-[11px] text-white/90 mt-0.5">
                Faculty Member: <span className="font-bold underline">{facultyUser.name}</span>
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-center">
          {/* Status Message */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`p-3 rounded-full ${
              isGranted ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
              {isGranted ? (
                <CheckCircle2 className="h-10 w-10" />
              ) : (
                <AlertCircle className="h-10 w-10" />
              )}
            </div>
            <h4 className={`text-base font-extrabold ${
              isGranted ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {isGranted ? 'Assessor Access Enabled' : 'Assessor Access Disabled'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              {isGranted ? (
                <>
                  Temporary evaluation privileges have been successfully granted to <span className="font-bold text-slate-800">{facultyUser.name}</span>. They now have full access to evaluate pending manuscripts in the research queue (revenue details restricted).
                </>
              ) : (
                <>
                  Temporary evaluation privileges for <span className="font-bold text-slate-800">{facultyUser.name}</span> have been revoked. Their access to the Evaluation Console has been disabled.
                </>
              )}
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
            <button
              type="button"
              onClick={onClose}
              className={`w-full max-w-xs py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer ${
                isGranted 
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95' 
                  : 'bg-red-600 hover:bg-red-700 active:scale-95'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
