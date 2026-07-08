import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export function CategoryActions({ canEdit, canDelete, onEdit, onDelete, hasSubmissions, isDisabled, onToggleDisable }) {
  return (
    <div className="flex items-center space-x-2">
      {canEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 bg-pure-white/80 backdrop-blur-md border border-platinum-silver/60 rounded-md text-slate-gray hover:text-charcoal hover:bg-mist-silver transition-colors cursor-pointer"
          title="Edit Category"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
      )}
      {canDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleDisable();
          }}
          style={{ minHeight: '0px' }}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 cursor-pointer ${
            !isDisabled ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
          title={!isDisabled ? 'Disable Category' : 'Enable Category'}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              !isDisabled ? 'translate-x-4' : 'translate-x-1'
            } shadow-sm`}
          />
        </button>
      )}
      {canDelete && !hasSubmissions && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 bg-pure-white/80 backdrop-blur-md border border-platinum-silver/60 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
          title="Delete Category"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
