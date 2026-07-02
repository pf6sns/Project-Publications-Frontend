import React from 'react';
import { PublicationCategoryCard } from './PublicationCategoryCard';
import { Plus } from 'lucide-react';

export function PublicationCategoryGrid({ categories, isAdmin, onSelectCategory, onEditCategory, onDeleteCategory, onCreateCategory }) {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex justify-end pb-4">
        
        {isAdmin && (
          <button
            onClick={onCreateCategory}
            className="px-4 py-2 bg-charcoal text-white hover:bg-steel-gray rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create Category</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <PublicationCategoryCard
            key={cat.id}
            category={cat}
            isAdmin={isAdmin}
            onSelect={onSelectCategory}
            onEdit={onEditCategory}
            onDelete={onDeleteCategory}
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
