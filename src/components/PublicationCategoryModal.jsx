import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Modal } from './Modal';
export function PublicationCategoryModal({ category, isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setAmount(category.amount.toString());
      setIsFree(Number(category.amount) === 0);
    } else {
      setName('');
      setAmount('');
      setIsFree(false);
    }
    setError('');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    
    const parsedAmount = isFree ? 0 : parseInt(amount);
    if (!isFree && (isNaN(parsedAmount) || parsedAmount < 0)) {
      setError('Please enter a valid positive amount');
      return;
    }

    onSave({
      name: name.trim(),
      amount: parsedAmount
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Create Category'}
      maxWidthClass="max-w-md"
      footerActions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="category-form"
            className="px-4 py-2 text-sm font-semibold text-white bg-charcoal rounded-lg shadow-sm hover:bg-charcoal/90 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>{category ? 'Save Changes' : 'Create'}</span>
          </button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase text-charcoal mb-1.5">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. International Journal (Scopus Indexed)"
            className="w-full border border-platinum-silver rounded-lg px-3 py-2.5 text-sm bg-pure-white focus:ring-2 focus:ring-charcoal/30 focus:border-charcoal outline-none transition-shadow text-charcoal font-medium"
            autoFocus
          />
        </div>

        <div className="flex items-center space-x-2 my-2 select-none">
          <input
            type="checkbox"
            id="is-free-checkbox"
            checked={isFree}
            onChange={(e) => {
              setIsFree(e.target.checked);
              if (e.target.checked) setAmount('0');
            }}
            className="h-4 w-4 rounded border-gray-300 text-charcoal focus:ring-charcoal"
          />
          <label htmlFor="is-free-checkbox" className="text-xs font-bold uppercase text-charcoal cursor-pointer">
            Free Category (No publication fee)
          </label>
        </div>

        {!isFree && (
          <div>
            <label className="block text-xs font-bold uppercase text-charcoal mb-1.5">
              Payment Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 150"
              min="0"
              className="w-full border border-platinum-silver rounded-lg px-3 py-2.5 text-sm bg-pure-white focus:ring-2 focus:ring-charcoal/30 focus:border-charcoal outline-none transition-shadow font-mono text-charcoal"
            />
          </div>
        )}
      </form>
    </Modal>
  );
}
