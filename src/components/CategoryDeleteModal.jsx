import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function CategoryDeleteModal({ isOpen, category, mode, onClose, onDelete, onDisable, isDisabled }) {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-slide-up relative">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${mode === 'disablePrompt' ? 'bg-amber-100' : 'bg-red-100'}`}>
              <AlertTriangle className={`h-5 w-5 ${mode === 'disablePrompt' ? 'text-amber-600' : 'text-red-600'}`} />
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors absolute top-4 right-4 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>
          <h3 className="text-xl font-black text-charcoal mb-2">
            {mode === 'disablePrompt' ? `Cannot Delete ${category.name}` : `Delete ${category.name}?`}
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            {mode === 'disablePrompt' 
              ? "This card has publications and cannot be deleted. You can disable it instead."
              : "Are you sure you want to permanently delete this category? This action cannot be undone."}
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {mode === 'disablePrompt' ? (
              <button
                onClick={() => { onDisable(category); onClose(); }}
                className="px-4 py-2 text-sm font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
              >
                {isDisabled ? "Enable Instead" : "Disable Instead"}
              </button>
            ) : (
              <button
                onClick={() => onDelete(category)}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
