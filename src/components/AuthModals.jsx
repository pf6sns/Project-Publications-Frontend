/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, Clock, LogOut, CheckCircle } from 'lucide-react';

export function SessionModal({ isOpen, onClose, onLogout, timeLeft }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md overflow-hidden bg-white rounded-xl border border-slate-200 shadow-2xl animate-scale-in">
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center space-x-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-full">
            <Clock className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Session Timeout</h3>
            <p className="text-xs text-amber-800 font-medium">Your session is about to expire</p>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            For security reasons, your session will automatically expire in:
          </p>
          
          <div className="flex items-center justify-center space-x-3 bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
            <span className="text-3xl font-mono font-bold text-amber-600">{timeLeft}</span>
            <span className="text-sm font-semibold text-slate-500">seconds remaining</span>
          </div>

          <div className="text-xs text-slate-400 mb-6 flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Any unsaved changes or uploads may be lost.</span>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onLogout}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-650 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out Now</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Extend Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md overflow-hidden bg-white rounded-xl border border-slate-200 shadow-2xl animate-scale-in">
        <div className="p-6 text-center">
          <div className="mx-auto my-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-650">
            <LogOut className="h-6 w-6" />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Are you sure you want to sign out?
          </p>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-650 hover:bg-red-700 rounded-lg shadow-md transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
