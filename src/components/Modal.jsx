import React from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, icon: Icon, children, footerActions, maxWidthClass = "max-w-xl" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full ${maxWidthClass} overflow-visible relative z-10 animate-scale-in flex flex-col max-h-[92vh] sm:max-h-[90vh] font-sans`}>
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl shrink-0">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />}
            <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">{title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>

        {/* Footer Actions */}
        {footerActions && (
          <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3 rounded-b-2xl">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
}
