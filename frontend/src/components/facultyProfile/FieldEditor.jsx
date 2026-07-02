import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

export function FieldEditor({ 
  field, 
  onSave, 
  onDelete, 
  onCancel 
}) {
  const [name, setName] = useState(field ? field.name : '');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const isEditing = !!field;

  const handleSave = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-md animate-in fade-in duration-200 p-4 font-sans">
      <div className="bg-pure-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative flex flex-col border border-platinum-silver/45">
        {/* Header */}
        <div className="px-6 py-4 border-b border-platinum-silver/45 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-black text-charcoal tracking-tight">
            {isEditing ? 'Edit Profile Field' : 'Add New Field'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-slate-gray hover:text-charcoal transition-colors p-1.5 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {!showConfirmDelete ? (
          <form onSubmit={handleSave} className="flex flex-col">
            <div className="px-6 py-6">
              <label htmlFor="fieldName" className="block text-sm font-bold text-charcoal mb-2">
                Field Name
              </label>
              <input
                id="fieldName"
                type="text"
                autoFocus
                className="w-full px-4 py-2.5 bg-slate-50 border border-platinum-silver rounded-xl focus:bg-pure-white focus:ring-2 focus:ring-charcoal/30 focus:border-charcoal outline-none transition-all text-charcoal font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Google Scholar"
                required
              />
              <p className="mt-2 text-xs text-slate-gray font-medium">
                This field will automatically appear in all faculty profiles as a URL link.
              </p>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-platinum-silver/45">
              <div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-bold text-red-650 bg-red-50 rounded-xl hover:bg-red-100 transition-colors shadow-xs"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-sm font-bold text-charcoal bg-pure-white border border-platinum-silver rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="px-4 py-2 text-sm font-bold text-pure-white bg-charcoal rounded-xl hover:bg-charcoal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Delete Confirmation */
          <div className="flex flex-col">
            <div className="px-6 py-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4 border border-red-100">
                <Trash2 className="h-6 w-6 text-red-650" />
              </div>
              <h3 className="text-lg font-black text-charcoal mb-2">Delete Field?</h3>
              <p className="text-sm text-slate-gray font-medium">
                Are you sure you want to delete the "{field.name}" field? 
                This will remove it from every faculty profile immediately. 
                This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex space-x-3 justify-end border-t border-platinum-silver/45">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-sm font-bold text-charcoal bg-pure-white border border-platinum-silver rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onDelete(field.id)}
                className="px-4 py-2 text-sm font-bold text-pure-white bg-red-650 rounded-xl hover:bg-red-700 transition-colors shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
