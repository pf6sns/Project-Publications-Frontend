import React from 'react';

import { CategoryActions } from './CategoryActions';

export function PublicationCategoryCard({ category, canEdit, canDelete, onSelect, onEdit, onDelete }) {
  return (
    <div 
      className="bg-white border border-slate-200 hover:border-slate-350 hover:shadow-md transition-all duration-300 hover:scale-105 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between relative group cursor-pointer min-h-30 sm:min-h-35"
      onClick={() => onSelect(category)}
    >
      <div className="flex items-start justify-between">
        <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-400 tracking-wider w-3/4 leading-snug">
          {category.name}
        </span>
        {(canEdit || canDelete) && (
          <CategoryActions 
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={() => onEdit(category)} 
            onDelete={() => onDelete(category)} 
          />
        )}
      </div>
      <div className="mt-3 sm:mt-4">
        <span className="text-3xl sm:text-4xl font-black font-mono text-slate-800">₹{category.amount}</span>
        <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">Publication Fee</p>
      </div>

    </div>
  );
}
