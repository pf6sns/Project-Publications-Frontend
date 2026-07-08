import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

export function FacultySearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const debounceTimerRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      onSearch(val);
    }, 400); // 400ms debounce
  };

  const handleClear = () => {
    setSearchTerm('');
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    onSearch('');
  };

  return (
    <div className="relative flex items-center h-10 w-full sm:w-64 md:w-72 px-3 bg-white border border-slate-300 rounded-lg shadow-xs shrink-0 transition-all hover:border-slate-400 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
      <Search className="h-4 w-4 text-slate-400 shrink-0" />
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={handleChange}
        className="w-full text-xs pl-2 bg-transparent text-slate-900 border-none outline-none focus:ring-0 focus:outline-none"
      />
      {searchTerm && (
        <X
          className="h-3.5 w-3.5 text-slate-400 hover:text-red-500 cursor-pointer shrink-0 ml-1 transition-colors"
          onClick={handleClear}
          title="Clear search"
        />
      )}
    </div>
  );
}
