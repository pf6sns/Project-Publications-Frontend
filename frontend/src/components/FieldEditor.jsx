import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Modal } from './Modal';

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
    <Modal
      isOpen={true} // Since FieldEditor is conditionally rendered, it's always open when mounted
      onClose={onCancel}
      title={isEditing ? 'Edit Profile Field' : 'Add New Field'}
      maxWidthClass="max-w-md"
      footerActions={
        !showConfirmDelete ? (
          <div className="flex w-full items-center justify-between">
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
                form="field-form"
                disabled={!name.trim()}
                className="px-4 py-2 text-sm font-bold text-pure-white bg-charcoal rounded-xl hover:bg-charcoal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-end space-x-3">
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
              className="px-4 py-2 text-sm font-bold text-pure-white bg-red-650 rounded-xl hover:bg-red-700 transition-colors shadow-xs flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete Permanently
            </button>
          </div>
        )
      }
    >
      {!showConfirmDelete ? (
        <form id="field-form" onSubmit={handleSave} className="flex flex-col">
          <div>
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
        </form>
      ) : (
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4 border border-red-100">
            <Trash2 className="h-6 w-6 text-red-650" />
          </div>
          <h3 className="text-lg font-black text-charcoal mb-2">Delete Field?</h3>
          <p className="text-sm text-slate-gray font-medium">
            Are you sure you want to delete the "{field.name}" field? 
            This will remove this field from all faculty profiles.
          </p>
        </div>
      )}
    </Modal>
  );
}
