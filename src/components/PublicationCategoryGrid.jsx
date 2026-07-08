import React from 'react';
import { PublicationCategoryCard } from './PublicationCategoryCard';
import { Plus, AlertCircle } from 'lucide-react';

export function PublicationCategoryGrid({ categories, canCreate, canEdit, canDelete, onSelectCategory, onEditCategory, onDeleteCategory, onCreateCategory, isPaymentEnabled, onTogglePayment, disabledCategoryIds = [], drafts = [], categoriesWithSubmissions = [], onToggleDisable }) {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <h2 className="text-lg font-bold text-charcoal">Select Manuscript Category</h2>
          <p className="text-sm text-slate-500 mt-1">Choose the appropriate category for your research publication to proceed.</p>
        </div>

        {canCreate && (
          <div className="flex items-center space-x-4 shrink-0">
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-600">Payment:</span>
              <button
                onClick={onTogglePayment}
                style={{ minHeight: '0px' }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isPaymentEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                title={isPaymentEnabled ? 'Disable Razorpay Payments' : 'Enable Razorpay Payments'}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isPaymentEnabled ? 'translate-x-4' : 'translate-x-1'
                    } shadow-sm`}
                />
              </button>
            </div>
            <button
              onClick={onCreateCategory}
              className="px-4 py-2 bg-charcoal text-white hover:bg-steel-gray rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm shrink-0"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Create Category</span>
            </button>
          </div>
        )}
      </div>

      {canCreate && (
        <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-amber-900">Important Note for Administrators</h4>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Categories with existing submissions cannot be deleted to preserve historic data. If a category is no longer in use, you should toggle the status switch on its card to disable it and prevent new submissions.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {[...categories]
          .sort((a, b) => {
            const aDisabled = disabledCategoryIds.includes(a.id);
            const bDisabled = disabledCategoryIds.includes(b.id);
            if (aDisabled && !bDisabled) return 1;
            if (!aDisabled && bDisabled) return -1;
            return 0;
          })
          .map((cat) => (
            <PublicationCategoryCard
              key={cat.id}
              category={cat}
              canEdit={canEdit}
              canDelete={canDelete}
              onSelect={onSelectCategory}
              onEdit={onEditCategory}
              onDelete={onDeleteCategory}
              isPaymentEnabled={isPaymentEnabled}
              isDisabled={disabledCategoryIds.includes(cat.id)}
              hasDraft={drafts.some(d => Number(d.categoryId) === Number(cat.id))}
              hasSubmissions={categoriesWithSubmissions.includes(cat.id)}
              onToggleDisable={onToggleDisable}
            />
          ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-ice-gray border border-dashed border-platinum-silver rounded-2xl">
          <p className="text-sm font-bold text-slate-gray">No publication categories available.</p>
        </div>
      )}
    </div>
  );
}
