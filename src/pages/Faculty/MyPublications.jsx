import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Eye, ArrowLeft, Download, Search, X, ChevronLeft, ChevronRight, RotateCcw, UploadCloud, AlertTriangle, FileText, CheckCircle2, Loader2, Info } from 'lucide-react';
import { DateRangePicker } from '../../components/DateRangePicker';
import { SearchableDropdown } from '../../components/SearchableDropdown';
import { PublicationIdInfoModal } from '../../components/PublicationIdInfoModal';
import { getMyPublications, getPublicationDetail, reattemptSubmission } from '../../services/publicationService';
import { downloadFromUrl } from '../../services/uploadService';
import { getAbsolutePdfUrl } from '../../api/apiClient';

export const PublicationsPage = ({
  currentUser,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [selectedPubId, setSelectedPubId] = useState(id || null);
  const [directFetchedPub, setDirectFetchedPub] = useState(null);
  const [fSearchText, setFSearchText] = useState('');
  const [fStatusFilter, setFStatusFilter] = useState('All statuses');
  const [fStartDate, setFStartDate] = useState('');
  const [fEndDate, setFEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [publications, setPublications] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Re-attempt Modal States
  const [showReattemptConfirm, setShowReattemptConfirm] = useState(false);
  const [showReattemptUploadModal, setShowReattemptUploadModal] = useState(false);
  const [reattemptFile, setReattemptFile] = useState(null);
  const [isSubmittingReattempt, setIsSubmittingReattempt] = useState(false);
  const [reattemptError, setReattemptError] = useState('');
  const [reattemptSuccessMsg, setReattemptSuccessMsg] = useState('');

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const res = await getMyPublications({
        page: currentPage,
        limit: itemsPerPage,
        search: fSearchText,
        status: fStatusFilter,
        startDate: fStartDate,
        endDate: fEndDate
      });
      setPublications(res.publications || []);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error('[MyPublications] Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [currentPage, fSearchText, fStatusFilter, fStartDate, fEndDate, location.key]);

  // Listen for global publication mutation events and window focus for auto-refresh
  useEffect(() => {
    const handleUpdate = () => {
      fetchPublications();
      if (selectedPubId) {
        getPublicationDetail(selectedPubId).then(pub => setDirectFetchedPub(pub)).catch(() => {});
      }
    };
    window.addEventListener('publication-updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    return () => {
      window.removeEventListener('publication-updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [currentPage, fSearchText, fStatusFilter, fStartDate, fEndDate, selectedPubId]);

  // Sync selectedPubId if url param 'id' changes
  useEffect(() => {
    if (id) {
      setSelectedPubId(id);
    } else {
      setSelectedPubId(null);
    }
  }, [id]);

  // Always fetch full details when a specific publication is selected
  useEffect(() => {
    if (selectedPubId) {
      getPublicationDetail(selectedPubId)
        .then(pub => setDirectFetchedPub(pub))
        .catch(err => {
          console.error("Failed to load publication details:", err);
          const found = publications.find(p => p.id === selectedPubId);
          if (!found) {
            navigate('/not-found', { replace: true });
          }
        });
    } else {
      setDirectFetchedPub(null);
    }
  }, [selectedPubId, navigate]);

  const handleSelectPub = (pubId) => {
    setSelectedPubId(pubId);
    setReattemptError('');
    setReattemptSuccessMsg('');
    const prefix = location.pathname.startsWith('/admin') ? '/admin' : '/faculty';
    if (pubId) {
      navigate(`${prefix}/publication/${pubId}`);
    } else {
      navigate(`${prefix}/publications`);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [fSearchText, fStatusFilter, fStartDate, fEndDate]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPubs = publications;

  const hasActiveFilters = fSearchText !== '' || fStatusFilter !== 'All' || fStartDate !== '' || fEndDate !== '';

  const handleClearFilters = () => {
    setFSearchText('');
    setFStatusFilter('All statuses');
    setFStartDate('');
    setFEndDate('');
  };

  const handleExecuteReattempt = async () => {
    if (!reattemptFile) {
      setReattemptError('Please select a PDF file to re-attempt.');
      return;
    }
    const target = directFetchedPub || publications.find(p => p.id === selectedPubId);
    if (!target) return;

    setIsSubmittingReattempt(true);
    setReattemptError('');

    try {
      const updated = await reattemptSubmission(target.id, reattemptFile);
      setReattemptSuccessMsg('Re-attempted manuscript uploaded successfully!');
      setShowReattemptUploadModal(false);
      setReattemptFile(null);
      
      // Update local state
      setDirectFetchedPub(prev => prev ? { ...prev, ...updated } : updated);
      fetchPublications();
    } catch (err) {
      setReattemptError(err.message || 'Failed to submit re-attempt');
    } finally {
      setIsSubmittingReattempt(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <PublicationIdInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />

      {/* ── Re-attempt Confirmation Modal ────────────────────────────────────────── */}
      {showReattemptConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Confirm Re-attempt Process</h3>
                <p className="text-xs text-slate-500">Publication ID: {selectedPubId}</p>
              </div>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed font-medium space-y-2">
              <p>
                <strong>Important Notice:</strong> You are allowed <strong>ONLY ONE (1) RE-ATTEMPT</strong> for this publication.
              </p>
              <p>
                Your original manuscript and initial review evaluation PDF will be preserved. Re-attempting allows you to submit an updated manuscript PDF for re-evaluation.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowReattemptConfirm(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReattemptConfirm(false);
                  setShowReattemptUploadModal(true);
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Yes, Proceed to Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Re-attempt Upload Modal ──────────────────────────────────────────────── */}
      {showReattemptUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Upload Re-attempted Manuscript</h3>
              </div>
              <button
                onClick={() => {
                  setShowReattemptUploadModal(false);
                  setReattemptFile(null);
                  setReattemptError('');
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reattemptError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
                {reattemptError}
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">Select PDF Manuscript File</label>
              {!reattemptFile ? (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center relative cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.type !== 'application/pdf') {
                          setReattemptError('Only PDF files are allowed');
                          return;
                        }
                        setReattemptFile(file);
                        setReattemptError('');
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="h-10 w-10 text-slate-400 group-hover:text-indigo-600 transition-colors mb-2" />
                  <span className="text-xs font-bold text-slate-800">Click to browse or drag & drop PDF</span>
                  <span className="text-[10px] text-slate-500 mt-1 font-medium">Accepts PDF format (Max 100 MB)</span>
                </div>
              ) : (
                <div className="border border-indigo-200 bg-indigo-50/40 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3 truncate">
                    <FileText className="h-6 w-6 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">{reattemptFile.name}</p>
                      <p className="text-[10px] text-indigo-700 font-semibold mt-0.5">{(reattemptFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for submission</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setReattemptFile(null)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg shrink-0 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                disabled={isSubmittingReattempt}
                onClick={() => {
                  setShowReattemptUploadModal(false);
                  setReattemptFile(null);
                  setReattemptError('');
                }}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isSubmittingReattempt || !reattemptFile}
                onClick={handleExecuteReattempt}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors shadow-sm flex items-center space-x-2 cursor-pointer"
              >
                {isSubmittingReattempt ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    <span>Submit Re-attempt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectedPubId ? (
        <>
          {/* Search and filters row */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm text-left animate-fade-in transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-slate-300 relative z-20">
            <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-start sm:items-center gap-3 w-full">
              {/* Search matches title or id */}
              <div className="relative flex sm:flex-1 items-center h-11 sm:h-9 w-full sm:max-w-md px-3 bg-white border border-slate-300 rounded-lg shadow-xs shrink-0 transition-all hover:border-slate-400 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by title"
                  value={fSearchText}
                  onChange={(e) => setFSearchText(e.target.value)}
                  className="w-full text-sm sm:text-xs pl-2 bg-transparent text-slate-900 border-none outline-none focus:ring-0 focus:outline-none"
                />
                {fSearchText && (
                  <X
                    className="h-3.5 w-3.5 text-slate-400 hover:text-red-500 cursor-pointer shrink-0 ml-1 transition-colors"
                    onClick={() => setFSearchText('')}
                    title="Clear search"
                  />
                )}
              </div>

              {/* Status */}
              <div className="w-full sm:w-[160px] shrink-0 relative z-30">
                <SearchableDropdown
                  options={['All statuses', 'Completed', 'Submitted', 'Re-attempted']}
                  value={fStatusFilter}
                  onChange={setFStatusFilter}
                  placeholder="Status..."
                  isMulti={false}
                  showSearch={false}
                />
              </div>

              {/* Date Range Picker */}
              <div className="w-full sm:w-[210px] shrink-0 relative z-20">
                <DateRangePicker
                  startDate={fStartDate}
                  endDate={fEndDate}
                  onChange={({ startDate, endDate }) => {
                    setFStartDate(startDate);
                    setFEndDate(endDate);
                  }}
                />
              </div>

              {hasActiveFilters && (
                <div className="shrink-0 w-full sm:w-auto">
                  <button
                    onClick={handleClearFilters}
                    className="h-9 w-full sm:w-auto px-4 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 border border-slate-200 text-xs font-bold rounded-lg transition-colors text-center cursor-pointer flex items-center justify-center"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Publications listings (Responsive table & card views) */}
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-left">
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-150 border-collapse text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase tracking-widest font-extrabold text-xs border-b border-slate-200">
                      <th className="p-4 text-center">S.No</th>
                      <th className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <div className="flex flex-col items-center">
                            <span>Publication</span>
                            <span>ID</span>
                          </div>
                          <button
                            onClick={() => setShowInfoModal(true)}
                            title="What is Publication ID?"
                            className="p-1 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </th>
                      <th className="p-4 text-left">Title</th>
                      <th className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span>Uploaded</span>
                          <span>Date</span>
                        </div>
                      </th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span>Reviewed</span>
                          <span>Date</span>
                        </div>
                      </th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-slate-650">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-400 italic">
                          Loading publications...
                        </td>
                      </tr>
                    ) : paginatedPubs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-400 italic">
                          No results found.
                        </td>
                      </tr>
                    ) : (
                      paginatedPubs.map((pub, index) => (
                        <tr key={pub.id} className="hover:bg-slate-50/50 transition-colors font-sans py-3">
                          <td className="p-4 text-slate-400 text-center">{pub.sno}</td>
                          <td className="p-4 font-mono font-bold text-slate-400 text-center">{pub.id}</td>
                          <td className="p-4 max-w-sm text-left">
                            <span className="font-bold text-slate-900 block leading-snug">{pub.title}</span>
                          </td>
                          <td className="p-4 text-slate-400 text-center font-medium">
                            {pub.submissionDate ? new Date(pub.submissionDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 text-[9px] uppercase font-mono font-extrabold rounded-full ${pub.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              pub.status === 'Re-attempted' ? 'bg-indigo-100 text-indigo-800' :
                                pub.status === 'Submitted' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                                  'bg-slate-100 text-slate-600'
                              }`}>
                              {pub.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400 text-center font-medium">
                            {pub.status === 'Submitted' ? '-' : (pub.lastUpdated ? new Date(pub.lastUpdated).toLocaleDateString() : '-')}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleSelectPub(pub.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-pure-white border border-platinum-silver text-slate-gray hover:text-emerald-500 hover:border-emerald-200 hover:shadow-xs hover:bg-emerald-50 transition-all focus:outline-none mx-auto cursor-pointer"
                              title="View Publication"
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
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-gray font-medium">
                    Showing <span className="font-bold text-charcoal">{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-bold text-charcoal">{Math.min(currentPage * itemsPerPage, totalItems)}</span>{' '}
                    of <span className="font-bold text-charcoal">{totalItems}</span> results
                  </p>
                  <nav className="isolate inline-flex -space-x-px rounded-xl shadow-xs" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="relative inline-flex items-center rounded-l-xl px-2 py-2 text-slate-gray ring-1 ring-inset ring-platinum-silver hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed bg-pure-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const p = idx + 1;
                      if (totalPages > 7 && (p < currentPage - 2 || p > currentPage + 2) && p !== 1 && p !== totalPages) {
                        if (p === 2 || p === totalPages - 1) return <span key={p} className="relative inline-flex items-center px-4 py-2 text-sm font-bold text-charcoal ring-1 ring-inset ring-platinum-silver bg-pure-white">...</span>;
                        return null;
                      }
                      return (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-bold transition-colors ${p === currentPage
                            ? 'z-10 bg-charcoal text-pure-white shadow-sm ring-1 ring-inset ring-charcoal'
                            : 'text-charcoal bg-pure-white ring-1 ring-inset ring-platinum-silver hover:bg-slate-50'
                            }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="relative inline-flex items-center rounded-r-xl px-2 py-2 text-slate-gray ring-1 ring-inset ring-platinum-silver hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed bg-pure-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-xl border border-platinum-silver bg-pure-white px-4 py-2 text-sm font-bold text-charcoal hover:bg-slate-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="relative ml-3 inline-flex items-center rounded-xl border border-platinum-silver bg-pure-white px-4 py-2 text-sm font-bold text-charcoal hover:bg-slate-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center bg-pure-white p-5 rounded-2xl border border-platinum-silver shadow-xs text-left animate-fade-in">
            <button
              onClick={() => {
                handleSelectPub(null);
              }}
              className="px-4 py-2 text-xs font-bold text-charcoal bg-frost-gray hover:bg-mist-silver border border-platinum-silver rounded-lg flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to My Publications List</span>
            </button>
          </div>

          {/* Drilling down panel - publication detail card */}
          {(() => {
            const target = directFetchedPub || publications.find(p => p.id === selectedPubId);
            if (!target) return <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm"><span className="text-sm font-bold text-slate-400 italic">Loading details...</span></div>;

            const canReattempt = (target.status === 'Completed' || target.reviewUrl) && !target.isReattempted && (target.reattemptCount || 0) < 1;

            return (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm text-left animate-fade-in space-y-6">

                {reattemptSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span>{reattemptSuccessMsg}</span>
                  </div>
                )}

                {/* Badges & Re-attempt Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-white border border-slate-200 font-mono font-bold px-3 py-1.5 rounded-lg text-xs text-slate-700 shadow-3xs">
                      ID: {target.id}
                    </span>
                    <span className={`px-3 py-1.5 rounded-lg text-xs uppercase font-mono font-extrabold shadow-3xs border ${target.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                      target.status === 'Re-attempted' ? 'bg-indigo-50 text-indigo-700 border-indigo-250' :
                        target.status === 'Submitted' ? 'bg-amber-50 text-amber-700 border-amber-250' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                      {target.status}
                    </span>
                  </div>

                  {canReattempt ? (
                    <button
                      onClick={() => setShowReattemptConfirm(true)}
                      className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center space-x-2 shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Re-attempt Submission (1 Attempt Allowed)</span>
                    </button>
                  ) : (target.reattemptCount || 0) >= 1 ? (
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
                      <span>Re-attempt Completed (1/1)</span>
                    </span>
                  ) : null}
                </div>

                {/* Title */}
                <h3 className="font-sans font-black text-slate-900 text-2xl leading-tight tracking-tight pt-1 text-center w-full">
                  {target.title}
                </h3>

                {/* Faculty Name Prominently Displayed & Dates */}
                <div className="pt-4 pb-2 border-t border-slate-200 text-xs font-semibold text-slate-600 flex flex-col items-center">
                  <div className="flex flex-col space-y-2 items-start">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Faculty Author:</span>
                      <span className="text-slate-800 font-extrabold">{target.author || currentUser.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Category:</span>
                      <span className="text-slate-800 font-extrabold uppercase">{target.category || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Date of Submission:</span>
                      <span className="text-slate-800 font-extrabold">
                        {target.submissionDate ? new Date(target.submissionDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </div>
                    {target.lastUpdated && target.status === 'Completed' && (
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Date Reviewed:</span>
                        <span className="text-slate-800 font-extrabold">
                          {new Date(target.lastUpdated).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Downloads Section — Modern Professional Workspace Hub */}
                <div className="border-t border-slate-200/80 pt-6 mt-2">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">Publication Document Repository</h4>
                        <p className="text-[11px] text-slate-400 font-medium">Official manuscript versions and review evaluation reports</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {1 + ((target.reviewUrls && target.reviewUrls.length > 0) ? target.reviewUrls.length : (target.reviewUrl ? 1 : 0)) + (target.reattemptManuscriptUrl ? 1 : 0) + ((target.reattemptReviewUrls && target.reattemptReviewUrls.length > 0) ? target.reattemptReviewUrls.length : (target.reattemptReviewUrl ? 1 : 0))} Documents
                    </span>
                  </div>

                  <div className="space-y-5">
                    {/* Initial Phase Section */}
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200/60 gap-2">
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          <span>Phase 1: Initial Submission & Review Reports</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
                          {target.submissionDate && (
                            <span className="bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                              <strong className="text-slate-700">Submitted:</strong> {new Date(target.submissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                          {target.lastUpdated && ((target.reviewUrls && target.reviewUrls.length > 0) || target.reviewUrl) && (
                            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs">
                              <strong className="text-emerald-900">Reviewed:</strong> {new Date(target.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {/* Original Manuscript PDF */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[11px] shrink-0 flex items-center justify-center w-10 h-10 border border-indigo-100">
                              PDF
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <span className="text-[9px] uppercase font-extrabold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block mb-1">
                                Original Submission
                              </span>
                              <h5 className="text-xs font-bold text-slate-800 truncate" title="Faculty Manuscript File">Faculty Manuscript File</h5>
                            </div>
                          </div>

                          {target.manuscriptUrl ? (
                            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                              <a
                                href={getAbsolutePdfUrl(target.manuscriptUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-98"
                              >
                                <Eye className="h-3.5 w-3.5 text-slate-600" />
                                <span>View Document</span>
                              </a>
                              <button
                                onClick={() => downloadFromUrl(target.manuscriptUrl, `Manuscript_Original_${target.id}.pdf`)}
                                className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-98"
                              >
                                <Download className="h-3.5 w-3.5 text-white" />
                                <span>Download PDF</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No file available</span>
                          )}
                        </div>

                        {/* Initial Review PDFs */}
                        {((target.reviewUrls && target.reviewUrls.length > 0) ? target.reviewUrls : (target.reviewUrl ? [target.reviewUrl] : [])).map((url, idx, arr) => (
                          <div key={`r-${idx}`} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[11px] shrink-0 flex items-center justify-center w-10 h-10 border border-emerald-100">
                                PDF
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <span className="text-[9px] uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                                  Review Evaluation
                                </span>
                                <h5 className="text-xs font-bold text-slate-800 truncate" title={`Evaluation Report ${arr.length > 1 ? `#${idx + 1}` : ''}`}>
                                  Evaluation Report {arr.length > 1 ? `#${idx + 1}` : ''}
                                </h5>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                              <a
                                href={getAbsolutePdfUrl(url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-98"
                              >
                                <Eye className="h-3.5 w-3.5 text-slate-600" />
                                <span>View Report</span>
                              </a>
                              <button
                                onClick={() => downloadFromUrl(url, `Review_Initial_${target.id}_${idx + 1}.pdf`)}
                                className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-98"
                              >
                                <Download className="h-3.5 w-3.5 text-white" />
                                <span>Download PDF</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Re-attempt Phase Section (If present) */}
                    {(target.reattemptManuscriptUrl || (target.reattemptReviewUrls && target.reattemptReviewUrls.length > 0) || target.reattemptReviewUrl) && (
                      <div className="bg-amber-50/40 rounded-2xl border border-amber-200/70 p-4 sm:p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-200/60 gap-2">
                          <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-wider text-left">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span>Phase 2: Re-attempt Submission & Final Review</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-amber-900">
                            {target.reattemptDate && (
                              <span className="bg-white px-2.5 py-0.5 rounded-md border border-amber-200 shadow-2xs">
                                <strong className="text-amber-950">Re-attempted:</strong> {new Date(target.reattemptDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                            {target.reattemptReviewedDate && (
                              <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs">
                                <strong className="text-emerald-900">Re-reviewed:</strong> {new Date(target.reattemptReviewedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {target.reattemptManuscriptUrl && (
                            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl font-black text-[11px] shrink-0 flex items-center justify-center w-10 h-10 border border-amber-100">
                                  PDF
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <span className="text-[9px] uppercase font-extrabold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mb-1">
                                    Revised Submission
                                  </span>
                                  <h5 className="text-xs font-bold text-slate-800 truncate">Re-attempted Manuscript File</h5>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                                <a
                                  href={getAbsolutePdfUrl(target.reattemptManuscriptUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-amber-100 hover:bg-amber-200 text-amber-900 active:scale-98"
                                >
                                  <Eye className="h-3.5 w-3.5 text-amber-900" />
                                  <span>View Document</span>
                                </a>
                                <button
                                  onClick={() => downloadFromUrl(target.reattemptManuscriptUrl, `Manuscript_Reattempt_${target.id}.pdf`)}
                                  className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-amber-600 hover:bg-amber-700 text-white shadow-xs active:scale-98"
                                >
                                  <Download className="h-3.5 w-3.5 text-white" />
                                  <span>Download PDF</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {((target.reattemptReviewUrls && target.reattemptReviewUrls.length > 0) ? target.reattemptReviewUrls : (target.reattemptReviewUrl ? [target.reattemptReviewUrl] : [])).map((url, idx, arr) => (
                            <div key={`re-r-${idx}`} className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[11px] shrink-0 flex items-center justify-center w-10 h-10 border border-emerald-100">
                                  PDF
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <span className="text-[9px] uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                                    Re-attempt Evaluation
                                  </span>
                                  <h5 className="text-xs font-bold text-slate-800 truncate">Re-attempt Evaluation Report {arr.length > 1 ? `#${idx + 1}` : ''}</h5>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                                <a
                                  href={getAbsolutePdfUrl(url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-98"
                                >
                                  <Eye className="h-3.5 w-3.5 text-slate-600" />
                                  <span>View Report</span>
                                </a>
                                <button
                                  onClick={() => downloadFromUrl(url, `Review_Reattempt_${target.id}_${idx + 1}.pdf`)}
                                  className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-98"
                                >
                                  <Download className="h-3.5 w-3.5 text-white" />
                                  <span>Download PDF</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
};
