import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export function CategoryActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="p-1.5 bg-pure-white/80 backdrop-blur-md border border-platinum-silver/60 rounded-md text-slate-gray hover:text-charcoal hover:bg-mist-silver transition-colors"
        title="Edit Category"
      >
        <Edit2 className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1.5 bg-pure-white/80 backdrop-blur-md border border-platinum-silver/60 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
        title="Delete Category"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
