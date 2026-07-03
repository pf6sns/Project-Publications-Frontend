import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export function SearchableDropdown({ options, value, onChange, placeholder = "Select institution...", className = "", isMulti = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDisplayText = () => {
    if (isMulti) {
      if (!value || value.length === 0) return placeholder;
      if (value.length === 1) return value[0];
      if (value.includes('All Institutions') && value.length === 1) return 'All Institutions';
      return `${value.length} selected`;
    }
    return value || placeholder;
  };

  const handleSelect = (opt) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      let newValues;
      
      if (opt === 'All Institutions') {
        newValues = ['All Institutions'];
      } else {
        if (currentValues.includes(opt)) {
          newValues = currentValues.filter(v => v !== opt);
          if (newValues.length === 0) newValues = ['All Institutions'];
        } else {
          newValues = [...currentValues.filter(v => v !== 'All Institutions'), opt];
        }
      }
      onChange(newValues);
    } else {
      onChange(opt);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-10 bg-white/90 border border-platinum-silver text-slate-700 text-xs font-bold rounded-xl px-4 outline-none shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
      >
        <span className="truncate pr-2">{getDisplayText()}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-70 min-w-full sm:min-w-0 bg-white border border-platinum-silver rounded-xl shadow-lg overflow-hidden origin-top animate-fade-in">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.map((opt, i) => {
              const isSelected = isMulti ? (Array.isArray(value) && value.includes(opt)) : value === opt;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors mb-0.5 last:mb-0 ${
                    isSelected 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-charcoal'
                  }`}
                >
                  <span className="truncate pr-2">{opt}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
