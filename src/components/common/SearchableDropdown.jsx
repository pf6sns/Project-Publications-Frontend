import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export function SearchableDropdown({ options, value, onChange, placeholder = "Select institution...", className = "" }) {
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

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-10 bg-white/90 border border-platinum-silver text-slate-700 text-xs font-bold rounded-xl px-4 outline-none shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
      >
        <span className="truncate pr-2">{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full right-0 mt-2 w-70 bg-white border border-platinum-silver rounded-xl shadow-lg overflow-hidden origin-top-right animate-fade-in">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.map((opt, i) => {
              const isSelected = value === opt;
              return (
                <button
                  key={i}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
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
