import React from 'react';
import { FileText } from 'lucide-react';

import { CategoryActions } from './CategoryActions';

export function PublicationCategoryCard({ category, canEdit, canDelete, onSelect, onEdit, onDelete, isPaymentEnabled = true, isDisabled = false, hasDraft = false, hasSubmissions = false, onToggleDisable }) {
  return (
    <div 
      className={`bg-white border border-slate-200 hover:border-slate-350 hover:shadow-md transition-all duration-300 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col relative group min-h-30 sm:min-h-35 ${isPaymentEnabled ? 'justify-between' : 'justify-center items-center'} ${isDisabled ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
      onClick={() => !isDisabled && onSelect(category)}
    >
      {isDisabled && (
        <div className="absolute top-0 left-0 bg-slate-300 text-slate-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-tl-2xl rounded-br-lg shadow-sm z-20">
          Disabled
        </div>
      )}
      {isPaymentEnabled ? (
        <>
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col flex-1 min-w-0 pr-4">
              <span className="text-xs sm:text-sm font-extrabold uppercase text-slate-900 tracking-wider leading-snug">
                {category.name}
              </span>
              {hasDraft && (
                <span className="inline-flex items-center w-fit px-2 py-0.5 mt-1 rounded text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-850 border border-orange-200 animate-pulse">
                  Draft Available
                </span>
              )}
            </div>
            {(canEdit || canDelete) && (
              <div className="shrink-0">
                <CategoryActions 
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onEdit={() => onEdit(category)} 
                  onDelete={() => onDelete(category)}
                  hasSubmissions={hasSubmissions}
                  isDisabled={isDisabled}
                  onToggleDisable={() => onToggleDisable(category)}
                />
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center items-start mt-3 sm:mt-4">
            <span className="text-xs sm:text-sm font-extrabold font-mono text-slate-800 tracking-wider">
              {Number(category.amount) === 0 ? 'Free' : `₹${category.amount}`}
            </span>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">Fee</p>
          </div>
        </>
      ) : (
        <>
          {(canEdit || canDelete) && (
            <div className="absolute top-4 right-4 z-10">
              <CategoryActions 
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={() => onEdit(category)} 
                onDelete={() => onDelete(category)}
                hasSubmissions={hasSubmissions}
                isDisabled={isDisabled}
                onToggleDisable={() => onToggleDisable(category)}
              />
            </div>
          )}
          <div className="flex flex-col items-center justify-center h-full w-full space-y-4 pt-2">
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-charcoal group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group-hover:scale-110">
               <FileText className="h-5 w-5" />
            </div>
            <div className="text-center">
              <span className="text-sm font-extrabold uppercase text-slate-900 tracking-wider block leading-snug">
                {category.name}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-1.5 block opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-widest">
                Select
              </span>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
