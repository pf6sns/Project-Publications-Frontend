import React from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export function FacultyTable({ 
  data, 
  loading, 
  pagination, 
  onPageChange,
  onViewProfile
}) {
  const { page, totalPages, total, limit } = pagination;

  return (
    <div className="w-full bg-pure-white rounded-2xl border border-platinum-silver shadow-xs overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="w-full min-w-145 text-left text-sm text-slate-gray">
          <thead className="text-xs text-slate-500 font-extrabold uppercase tracking-wider bg-slate-50 border-b border-platinum-silver/45">
            <tr>
              <th scope="col" className="px-6 py-4 text-left">S.No</th>
              <th scope="col" className="px-6 py-4 text-left">Faculty Name</th>
              <th scope="col" className="px-6 py-4 text-left">Email</th>
              <th scope="col" className="px-6 py-4 text-left">Institution</th>
              <th scope="col" className="px-6 py-4 text-left">Publications</th>
              <th scope="col" className="px-6 py-4 text-center">View</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-gray">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-gray font-medium">
                  No results found.
                </td>
              </tr>
            ) : (
              data.map((faculty, index) => (
                <tr key={faculty.id} className="bg-pure-white border-b border-platinum-silver/45 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-charcoal">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td 
                    className="px-6 py-4 font-bold text-charcoal cursor-pointer hover:underline"
                    onClick={() => onViewProfile(faculty)}
                  >
                    {faculty.name}
                  </td>
                  <td className="px-6 py-4 font-medium">{faculty.email || '-'}</td>
                  <td className="px-6 py-4 font-medium">{faculty.institution}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-charcoal text-xs font-bold px-2.5 py-0.5 rounded-md border border-platinum-silver/40">
                      {faculty.publications || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onViewProfile(faculty)}
                      className="text-slate-gray hover:text-charcoal bg-white border border-platinum-silver hover:bg-slate-50 p-2 rounded-xl transition-colors shadow-2xs inline-flex items-center justify-center"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-platinum-silver/45 bg-pure-white px-4 py-4 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="relative inline-flex items-center rounded-xl border border-platinum-silver bg-pure-white px-4 py-2 text-sm font-bold text-charcoal hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="relative ml-3 inline-flex items-center rounded-xl border border-platinum-silver bg-pure-white px-4 py-2 text-sm font-bold text-charcoal hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-gray font-medium">
              Showing <span className="font-bold text-charcoal">{total === 0 ? 0 : (page - 1) * limit + 1}</span> to{' '}
              <span className="font-bold text-charcoal">
                {Math.min(page * limit, total)}
              </span>{' '}
              of <span className="font-bold text-charcoal">{total}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-xl shadow-xs" aria-label="Pagination">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1 || loading}
                className="relative inline-flex items-center rounded-l-xl px-2 py-2 text-slate-gray ring-1 ring-inset ring-platinum-silver hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-pure-white"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {/* Simple page numbers */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                // Only show a few pages around current page for simplicity, or all if small
                if (totalPages > 7 && (p < page - 2 || p > page + 2) && p !== 1 && p !== totalPages) {
                  if (p === 2 || p === totalPages - 1) return <span key={p} className="relative inline-flex items-center px-4 py-2 text-sm font-bold text-charcoal ring-1 ring-inset ring-platinum-silver focus:outline-offset-0 bg-pure-white">...</span>;
                  return null;
                }
                return (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    disabled={loading}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-bold focus:z-20 focus:outline-offset-0 transition-colors ${
                      p === page
                        ? 'z-10 bg-charcoal text-pure-white shadow-sm ring-1 ring-inset ring-charcoal'
                        : 'text-charcoal bg-pure-white ring-1 ring-inset ring-platinum-silver hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages || loading}
                className="relative inline-flex items-center rounded-r-xl px-2 py-2 text-slate-gray ring-1 ring-inset ring-platinum-silver hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-pure-white"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
