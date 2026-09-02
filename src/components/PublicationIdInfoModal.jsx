import React, { useState } from 'react';
import { Info, X, Hash, Building2, Globe, UserCheck } from 'lucide-react';

export const PublicationIdInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-left">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Publication ID Format</h3>
              <p className="text-xs text-slate-500">Understanding how Publication IDs are generated</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Structure Preview */}
        <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-center text-sm font-semibold tracking-wider border border-slate-800 shadow-inner">
          <span className="text-emerald-400">INSTITUTION</span>-
          <span className="text-sky-400">OVERALL</span>-
          <span className="text-amber-400">INST_COUNT</span>-
          <span className="text-purple-400">FACULTY_COUNT</span>
        </div>

        {/* Breakdown List */}
        <div className="space-y-3 text-xs">
          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/80">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-900 block">1. Institution Code</span>
              <span className="text-emerald-700 leading-relaxed">
                Code representing your institution (e.g., <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[11px]">SNSCE</code>, <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[11px]">SNSCT</code>).
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-sky-50/50 border border-sky-100/80">
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 shrink-0">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sky-900 block">2. Overall Count</span>
              <span className="text-sky-700 leading-relaxed">
                Total sequential count of non-draft publications across the entire system.
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100/80">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
              <Hash className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-amber-900 block">3. Institution Count</span>
              <span className="text-amber-700 leading-relaxed">
                Sequential count of submissions specifically within your institution.
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-purple-50/50 border border-purple-100/80">
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700 shrink-0">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-purple-900 block">4. Faculty Count</span>
              <span className="text-purple-700 leading-relaxed">
                Sequential count of submissions created by you.
              </span>
            </div>
          </div>
        </div>

        {/* Real Example */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
          <span className="font-bold text-slate-800">Example: </span>
          <code className="font-mono font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">SNSCE-4-2-2</code>
          <p className="mt-1 text-[11px] text-slate-500">
            4th system submission, 2nd for SNSCE, 2nd submitted by the faculty.
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
