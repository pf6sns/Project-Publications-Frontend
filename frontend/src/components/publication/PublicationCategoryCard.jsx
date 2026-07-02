import React from 'react';

import { CategoryActions } from './CategoryActions';

export function PublicationCategoryCard({ category, isAdmin, onSelect, onEdit, onDelete }) {
  return (
    <div 
      className="bg-white border border-slate-200 hover:border-slate-350 hover:shadow-md transition-all duration-300 hover:scale-105 rounded-2xl p-6 flex flex-col justify-between relative group cursor-pointer"
      onClick={() => onSelect(category)}
    >
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider w-3/4 leading-snug">
          {category.name}
        </span>
        {isAdmin && (
          <CategoryActions 
            onEdit={() => onEdit(category)} 
            onDelete={() => onDelete(category)} 
          />
        )}
      </div>
      <div className="mt-4">
        <span className="text-4xl font-black font-mono text-slate-800">₹{category.amount}</span>
        <p className="text-[11px] text-slate-500 mt-1">Publication Fee</p>
      </div>

    </div>
  );
}
