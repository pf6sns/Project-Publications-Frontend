import React, { useState } from 'react';
import { Search } from 'lucide-react';

export function FacultySearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-slate-gray" />
        </div>
        <input
          type="text"
          className="bg-pure-white border border-platinum-silver text-charcoal text-sm font-medium rounded-xl focus:ring-charcoal/30 focus:border-charcoal block w-full pl-10 p-2.5 shadow-xs transition-all outline-none"
          placeholder="Search by name, ID, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="p-2.5 ml-2 text-sm font-bold text-pure-white bg-charcoal rounded-xl border border-charcoal hover:bg-charcoal/90 focus:ring-4 focus:outline-none focus:ring-charcoal/30 transition-colors shadow-xs"
      >
        Search
      </button>
    </form>
  );
}
