/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Eye, FileText, CheckCircle2, AlertCircle, ArrowLeft, Download, UploadCloud, Trash2, Loader2 } from 'lucide-react';
import { downloadFromUrl } from '../services/uploadService';
import config from '../config';

export function AdminReviews({
  publications,
  onApprove,
  selectedPubId,
  onSelectPub,
  hideSensitiveInfo = false,
}) {
  const [errorMsg, setErrorMsg] = useState('');
  const [reviewFiles, setReviewFiles] = useState([]);
  const [activeView, setActiveView] = useState({ type: null, url: null }); // type: 'manuscript' | 'review_0' | null
  const [viewLoading, setViewLoading] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Revoke blob URL when component unmounts to free memory
  useEffect(() => () => { if (activeView.url) URL.revokeObjectURL(activeView.url); }, [activeView.url]);

  const handleView = async (url, type) => {
    if (activeView.type === type) {
      if (activeView.url) URL.revokeObjectURL(activeView.url);
      setActiveView({ type: null, url: null });
      return;
    }

    if (activeView.url) URL.revokeObjectURL(activeView.url);

    setViewLoading(type);
    try {
      const token = localStorage.getItem('rpms_token');
      const isProxyUrl = url.startsWith('/') || url.includes('/api/pdf/');
      let fetchUrl;
      if (isProxyUrl) {
        const relativePath = url.startsWith('/') ? url : new URL(url).pathname;
        const origin = new URL(config.apiBaseUrl).origin;
        fetchUrl = `${origin}${relativePath}`;
      } else {
        fetchUrl = `${config.apiBaseUrl}/download-proxy?url=${encodeURIComponent(url)}&filename=preview.pdf`;
      }

      const response = await fetch(fetchUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const raw = await response.blob();

      const fileBlob = new Blob([raw], { type: 'application/pdf' });
      setActiveView({ type, url: URL.createObjectURL(fileBlob) });
    } catch (err) {
      console.error('[EvaluationPanel] handleView failed:', err);
    } finally {
      setViewLoading(null);
    }
  };

  // Active Pending reviews (Submitted or Re-attempted)
  const pendingPubs = publications.filter(p => p.status === 'Submitted' || p.status === 'Re-attempted');
  const activePub = publications.find(p => p.id === selectedPubId);

  const handleApprove = async () => {
    if (!activePub) return;
    setErrorMsg('');
    if (reviewFiles.length === 0) {
      setErrorMsg('Please upload at least one reviewed document to proceed.');
      return;
    }
    if (reviewFiles.length > 5) {
      setErrorMsg('You can upload a maximum of 5 review PDF files.');
      return;
    }
    setSubmitting(true);
    try {
      await onApprove(activePub.id, reviewFiles);
      setReviewFiles([]);
      onSelectPub(null);
    } catch (err) {
      console.error('[EvaluationPanel] handleApprove failed:', err);
      setErrorMsg(err.message || 'Failed to submit review document.');
    } finally {
      setSubmitting(false);
    }
  };


  if (activePub) {
    const rList = (activePub.reviewUrls && activePub.reviewUrls.length > 0) ? activePub.reviewUrls : (activePub.reviewUrl ? [activePub.reviewUrl] : []);
    const reRList = (activePub.reattemptReviewUrls && activePub.reattemptReviewUrls.length > 0) ? activePub.reattemptReviewUrls : (activePub.reattemptReviewUrl ? [activePub.reattemptReviewUrl] : []);

    return (
      <div className="space-y-6">
        {/* Detail Return bar */}
        <div className="flex justify-between items-center bg-pure-white p-4 rounded-xl border border-platinum-silver shadow-xs transition-all duration-300 hover:scale-[1.005] hover:shadow-md">
          <button
            onClick={() => {
              setErrorMsg('');
              setReviewFiles([]);
              onSelectPub(null);
            }}
            className="px-4 py-2 text-xs font-bold text-charcoal bg-frost-gray hover:bg-mist-silver border border-platinum-silver rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Review Queue</span>
          </button>
        </div>

        <div className="bg-pure-white rounded-xl border border-platinum-silver shadow-sm transition-all duration-300 hover:scale-[1.005] hover:shadow-md overflow-hidden flex flex-col">
          {/* 1. Header Section: ID (Left), Title/Author (Center), Status (Right) */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/30">
            <div className="flex-1 text-left w-full md:w-auto">
              <span className="text-xs font-mono font-bold text-slate-gray bg-frost-gray px-3 py-1.5 rounded border border-platinum-silver inline-block">
                {activePub.id}
              </span>
            </div>

            <div className="flex-2 text-center w-full md:w-auto">
              <h2 className="text-xl font-extrabold text-charcoal leading-tight mb-1">{activePub.title}</h2>
              <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
                <span className="text-sm text-slate-gray font-medium">Author: {activePub.author || 'Unknown'}</span>
                {activePub.category && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 uppercase tracking-wide">
                      {activePub.category}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 text-right w-full md:w-auto flex justify-end">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border inline-block ${activePub.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                activePub.status === 'Re-attempted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                {activePub.status}
              </span>
            </div>
          </div>

          {/* 2. Middle Section: Uploaded Manuscripts */}
          <div className="p-6 md:p-8 space-y-5 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Publication Document Repository</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Official manuscript versions and evaluation reports</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {1 + rList.length + (activePub.reattemptManuscriptUrl ? 1 : 0) + reRList.length} Documents
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
                    {activePub.submissionDate && (
                      <span className="bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                        <strong className="text-slate-700">Submitted:</strong> {new Date(activePub.submissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                    {activePub.lastUpdated && rList.length > 0 && (
                      <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs">
                        <strong className="text-emerald-900">Reviewed:</strong> {new Date(activePub.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Original Manuscript */}
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

                    {activePub.manuscriptUrl ? (
                      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleView(activePub.manuscriptUrl, 'manuscript')}
                          className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-98"
                        >
                          {viewLoading === 'manuscript' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5 text-slate-600" />}
                          <span>{activeView.type === 'manuscript' ? 'Close View' : 'View Document'}</span>
                        </button>
                        <button
                          onClick={() => downloadFromUrl(activePub.manuscriptUrl, `Manuscript_Original_${activePub.id}.pdf`)}
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
                  {rList.map((url, idx) => (
                    <div key={`r-${idx}`} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[11px] shrink-0 flex items-center justify-center w-10 h-10 border border-emerald-100">
                          PDF
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <span className="text-[9px] uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                            Review Evaluation
                          </span>
                          <h5 className="text-xs font-bold text-slate-800 truncate" title={`Evaluation Report ${rList.length > 1 ? `#${idx + 1}` : ''}`}>
                            Evaluation Report {rList.length > 1 ? `#${idx + 1}` : ''}
                          </h5>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleView(url, `review_${idx}`)}
                          className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-98"
                        >
                          {viewLoading === `review_${idx}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5 text-slate-600" />}
                          <span>{activeView.type === `review_${idx}` ? 'Close View' : 'View Report'}</span>
                        </button>
                        <button
                          onClick={() => downloadFromUrl(url, `Review_Initial_${activePub.id}_${idx + 1}.pdf`)}
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
              {(activePub.reattemptManuscriptUrl || reRList.length > 0) && (
                <div className="bg-amber-50/40 rounded-2xl border border-amber-200/70 p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-200/60 gap-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-wider text-left">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Phase 2: Re-attempt Submission & Final Review</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-amber-900">
                      {activePub.reattemptDate && (
                        <span className="bg-white px-2.5 py-0.5 rounded-md border border-amber-200 shadow-2xs">
                          <strong className="text-amber-950">Re-attempted:</strong> {new Date(activePub.reattemptDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                      {activePub.reattemptReviewedDate && (
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs">
                          <strong className="text-emerald-900">Re-reviewed:</strong> {new Date(activePub.reattemptReviewedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {activePub.reattemptManuscriptUrl && (
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
                          <button
                            type="button"
                            onClick={() => handleView(activePub.reattemptManuscriptUrl, 'reattempt_manuscript')}
                            className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-amber-100 hover:bg-amber-200 text-amber-900 active:scale-98"
                          >
                            {viewLoading === 'reattempt_manuscript' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5 text-amber-900" />}
                            <span>{activeView.type === 'reattempt_manuscript' ? 'Close View' : 'View Document'}</span>
                          </button>
                          <button
                            onClick={() => downloadFromUrl(activePub.reattemptManuscriptUrl, `Manuscript_Reattempt_${activePub.id}.pdf`)}
                            className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-amber-600 hover:bg-amber-700 text-white shadow-xs active:scale-98"
                          >
                            <Download className="h-3.5 w-3.5 text-white" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {reRList.map((url, idx) => (
                      <div key={`re-r-${idx}`} className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[11px] shrink-0 flex items-center justify-center w-10 h-10 border border-emerald-100">
                            PDF
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <span className="text-[9px] uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                              Re-attempt Evaluation
                            </span>
                            <h5 className="text-xs font-bold text-slate-800 truncate">Re-attempt Evaluation Report {reRList.length > 1 ? `#${idx + 1}` : ''}</h5>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleView(url, `reattempt_review_${idx}`)}
                            className="flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-98"
                          >
                            {viewLoading === `reattempt_review_${idx}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5 text-slate-600" />}
                            <span>{activeView.type === `reattempt_review_${idx}` ? 'Close View' : 'View Report'}</span>
                          </button>
                          <button
                            onClick={() => downloadFromUrl(url, `Review_Reattempt_${activePub.id}_${idx + 1}.pdf`)}
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

              {/* Viewers */}
              {activeView.type === 'manuscript' && (
                <iframe
                  src={activeView.url}
                  className="w-full rounded-xl border border-slate-200 mt-2"
                  style={{ height: '640px' }}
                  title="Original Manuscript Viewer"
                />
              )}

              {activeView.type && activeView.type.startsWith('review_') && (
                <iframe
                  src={activeView.url}
                  className="w-full rounded-xl border border-emerald-200 mt-2"
                  style={{ height: '640px' }}
                  title="Original Review Viewer"
                />
              )}

              {activeView.type === 'reattempt_manuscript' && (
                <iframe
                  src={activeView.url}
                  className="w-full rounded-xl border border-indigo-200 mt-2"
                  style={{ height: '640px' }}
                  title="Re-attempted Manuscript Viewer"
                />
              )}

              {activeView.type && activeView.type.startsWith('reattempt_review_') && (
                <iframe
                  src={activeView.url}
                  className="w-full rounded-xl border border-emerald-300 mt-2"
                  style={{ height: '640px' }}
                  title="Re-attempted Review Viewer"
                />
              )}
          </div>

          {/* 3. Bottom Section: Upload Reviewed Document / Reviewed Document */}
          <div className="p-6 md:p-8 space-y-6 bg-slate-50/30">
            {activePub.status === 'Completed' ? (
              <>
                <h3 className="text-xs font-extrabold uppercase text-slate-gray tracking-wider text-left">Reviewed Documents</h3>
                <div className="grid grid-cols-1 gap-3">
                  {/* Initial Review PDFs */}
                  {rList.map((url, idx) => (
                    <div key={`c-r-${idx}`} className="border border-emerald-200 p-4 rounded-xl bg-emerald-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-emerald-100/50 rounded-lg border border-emerald-200 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-charcoal text-sm truncate max-w-sm">
                            Initial Evaluated Document {rList.length > 1 ? `#${idx + 1}` : ''}
                          </h4>
                          <p className="text-xs text-slate-gray font-mono mt-1">Reviewed on {activePub.lastUpdated ? new Date(activePub.lastUpdated).toLocaleString() : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                          <button
                            type="button"
                            onClick={() => handleView(url, `review_${idx}`)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center space-x-1.5 transition-colors text-xs font-bold w-full sm:w-auto shrink-0 shadow-sm"
                            title="View Reviewed Document"
                          >
                            {viewLoading === `review_${idx}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4 text-white" />}
                            <span>{activeView.type === `review_${idx}` ? 'Close' : `View Review ${rList.length > 1 ? idx + 1 : ''}`}</span>
                          </button>
                          <button
                            onClick={() => downloadFromUrl(url, `Review_Initial_${activePub.id}_${idx + 1}.pdf`)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center space-x-1.5 transition-colors text-xs font-bold w-full sm:w-auto shrink-0 shadow-sm"
                            title="Download Reviewed Document"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download Review {rList.length > 1 ? idx + 1 : ''}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Re-attempted Review PDFs */}
                  {reRList.map((url, idx) => (
                    <div key={`c-re-${idx}`} className="border border-emerald-300 p-4 rounded-xl bg-emerald-100/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-emerald-200/50 rounded-lg border border-emerald-300 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-slate-900 text-sm truncate max-w-sm">
                            Re-attempted Evaluated Document {reRList.length > 1 ? `#${idx + 1}` : ''}
                          </h4>
                          <p className="text-xs text-emerald-800 font-mono mt-1">Reviewed on {activePub.reattemptReviewedDate ? new Date(activePub.reattemptReviewedDate).toLocaleString() : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                          <button
                            type="button"
                            onClick={() => handleView(url, `reattempt_review_${idx}`)}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center justify-center space-x-1.5 transition-colors text-xs font-bold w-full sm:w-auto shrink-0 shadow-sm"
                            title="View Re-attempted Review Document"
                          >
                            {viewLoading === `reattempt_review_${idx}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4 text-white" />}
                            <span>{activeView.type === `reattempt_review_${idx}` ? 'Close' : `View Re-attempted Review ${reRList.length > 1 ? idx + 1 : ''}`}</span>
                          </button>
                          <button
                            onClick={() => downloadFromUrl(url, `Review_Reattempt_${activePub.id}_${idx + 1}.pdf`)}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center justify-center space-x-1.5 transition-colors text-xs font-bold w-full sm:w-auto shrink-0 shadow-sm"
                            title="Download Re-attempted Review Document"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download Re-attempted Review {reRList.length > 1 ? idx + 1 : ''}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xs font-extrabold uppercase text-slate-gray tracking-wider text-left">
                  {activePub.status === 'Re-attempted' ? 'Upload Re-attempted Review Documents (Up to 5 files)' : 'Upload Reviewed Documents (Up to 5 files)'}
                </h3>

                <div className="space-y-3 text-left">
                  {reviewFiles.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 bg-white hover:bg-slate-50 transition-colors flex flex-col items-center justify-center relative cursor-pointer group shadow-3xs">
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={(e) => {
                          const selected = Array.from(e.target.files || []);
                          if (selected.length > 0) {
                            setReviewFiles(prev => {
                              const combined = [...prev, ...selected];
                              if (combined.length > 5) {
                                setErrorMsg('You can upload a maximum of 5 review PDF files.');
                                return combined.slice(0, 5);
                              }
                              setErrorMsg('');
                              return combined;
                            });
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <UploadCloud className="h-10 w-10 text-slate-400 group-hover:text-emerald-500 transition-colors mb-4" />
                      <span className="text-sm font-bold text-charcoal">Drag and drop or browse to upload</span>
                      <span className="text-xs text-slate-500 mt-1.5 font-medium">Select up to 5 PDF files (Max 100 MB each)</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Selected Review Files ({reviewFiles.length}/5)
                        </span>
                        {reviewFiles.length < 5 && (
                          <label className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer underline">
                            + Add more files
                            <input
                              type="file"
                              multiple
                              accept=".pdf"
                              onChange={(e) => {
                                const selected = Array.from(e.target.files || []);
                                if (selected.length > 0) {
                                  setReviewFiles(prev => {
                                    const combined = [...prev, ...selected];
                                    if (combined.length > 5) {
                                      setErrorMsg('You can upload a maximum of 5 review PDF files.');
                                      return combined.slice(0, 5);
                                    }
                                    setErrorMsg('');
                                    return combined;
                                  });
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      <div className="space-y-2">
                        {reviewFiles.map((file, idx) => (
                          <div key={idx} className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-4 flex items-center justify-between shadow-xs animate-fade-in">
                            <div className="flex items-center space-x-3 truncate">
                              <div className="h-10 w-10 bg-emerald-100/50 border border-emerald-200 rounded-lg flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div className="truncate text-left">
                                <p className="text-xs font-bold text-slate-800 truncate">{idx + 1}. {file.name}</p>
                                <p className="text-[10px] text-emerald-700 font-semibold">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setReviewFiles(prev => prev.filter((_, i) => i !== idx))}
                              className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg hover:text-red-700 transition-all cursor-pointer shrink-0"
                              title="Remove file"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-200/50 rounded-lg p-3 text-xs text-red-700 flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={submitting}
                    className="flex-1 py-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 border border-emerald-500 shadow-sm rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer animate-fade-in"
                  >
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
                    <span>{submitting ? 'Submitting Review...' : 'Upload Document'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback: Submission Widget listing
  return (
    <div className="bg-pure-white rounded-xl border border-platinum-silver shadow-xs overflow-hidden transition-all duration-300 hover:scale-[1.005] hover:shadow-md">
      <div className="p-4 border-b border-platinum-silver flex items-center justify-between bg-ice-gray">
        <div>
          <h4 className="font-bold text-charcoal text-sm">Pending Submissions ({pendingPubs.length})</h4>
          <p className="text-[11px] text-slate-gray">Papers awaiting review</p>
        </div>
      </div>

      {pendingPubs.length === 0 ? (
        <div className="p-12 text-center text-slate-gray italic text-xs font-medium">
          No pending publications in the review queue.
        </div>
      ) : (
        <div className="divide-y divide-platinum-silver">
          {pendingPubs.map(pub => (
            <div
              key={pub.id}
              onClick={() => onSelectPub(pub.id)}
              className="p-4 hover:bg-ice-gray/40 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-1 text-left">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-[9px] font-mono font-bold text-slate-gray bg-frost-gray px-1.5 py-0.5 rounded border border-platinum-silver">
                    {pub.id}
                  </span>
                  {!hideSensitiveInfo && (
                    <span className="text-[9px] text-charcoal bg-frost-gray px-1.5 py-0.5 rounded font-mono font-bold border border-platinum-silver">
                      ₹150
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-charcoal line-clamp-1">{pub.title}</h4>
                <p className="text-xs text-slate-gray font-medium">
                  Author: {pub.author || 'Unknown'} • Division: {pub.department || 'N/A'}
                  {pub.category && ` • Category: ${pub.category}`}
                </p>
              </div>

              <div className="text-right flex items-center space-x-3 shrink-0 justify-end">
                <div className="text-xs text-slate-gray font-mono">
                  {pub.submissionDate ? new Date(pub.submissionDate).toLocaleDateString() : 'N/A'}
                </div>
                <button
                  type="button"
                  className="px-3.5 py-1.5 bg-frost-gray hover:bg-mist-silver text-charcoal border border-platinum-silver rounded text-xs font-bold shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-steel-gray" />
                  <span>Begin Review</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// ADMIN ANALYTICS VIEW
// -------------------------------------------------------------

export function AdminAnalyticsView({ publications }) {
  // Aggregate statistics per faculty member (using inline author/department fields)
  const facultySummaries = {};

  publications.forEach(pub => {
    const authorKey = pub.author || 'Unknown';
    if (!facultySummaries[authorKey]) {
      facultySummaries[authorKey] = {
        name: pub.author || 'Unknown Author',
        department: pub.department || 'Unknown Dept',
        total: 0,
        completed: 0,
        rate: 0,
      };
    }

    const s = facultySummaries[authorKey];
    s.total += 1;
    if (pub.status === 'Completed') s.completed += 1;
  });

  // Calculate rate
  const summariesList = Object.values(facultySummaries).map(s => {
    const nonPending = s.total - (s.total - s.completed); // pending count = total - completed
    s.rate = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
    return s;
  });

  return (
    <div className="bg-pure-white rounded-xl border border-platinum-silver shadow-xs overflow-hidden animate-fade-in transition-all duration-300 hover:scale-[1.005] hover:shadow-md">
      <div className="p-4 border-b border-platinum-silver bg-ice-gray flex items-center justify-between">
        <div>
          <h4 className="font-bold text-charcoal text-sm">Faculty Submissions</h4>
          <p className="text-[11px] text-slate-gray">Aggregated submission statistics and completion rates</p>
        </div>
      </div>
      {/* Mobile/Tablet view card list */}
      <div className="lg:hidden divide-y divide-platinum-silver">
        {summariesList.map((f, idx) => (
          <div key={idx} className="p-4 space-y-2 text-xs text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-frost-gray flex items-center justify-center font-serif text-[10px] font-bold text-charcoal border border-platinum-silver">
                  {idx + 1}
                </span>
                <span className="font-bold text-charcoal">{f.name}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-frost-gray text-charcoal border border-platinum-silver">
                {f.rate}% Completed
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">{f.department}</p>
            <div className="grid grid-cols-2 gap-2 text-center pt-2 text-[10px]">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="block text-[8px] uppercase text-slate-400 font-bold">Total</span>
                <span className="font-bold font-mono text-charcoal text-xs">{f.total}</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="block text-[8px] uppercase text-slate-400 font-bold">Completed</span>
                <span className="font-bold font-mono text-charcoal text-xs">{f.completed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-ice-gray text-slate-gray uppercase tracking-widest font-extrabold text-[9px] border-b border-platinum-silver">
              <th className="p-4">Faculty Name</th>
              <th className="p-4">Department</th>
              <th className="p-4 text-center font-mono">Total</th>
              <th className="p-4 text-center text-charcoal font-bold">Completed</th>
              <th className="p-4 text-right">Completion Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-platinum-silver text-slate-gray">
            {summariesList.map((f, idx) => (
              <tr key={idx} className="hover:bg-ice-gray/30 transition-colors font-medium">
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-frost-gray flex items-center justify-center font-serif text-[10px] font-bold text-charcoal border border-platinum-silver">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-charcoal">{f.name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-600 font-sans">{f.department}</td>
                <td className="p-4 text-center font-mono font-bold text-charcoal">{f.total}</td>
                <td className="p-4 text-center text-charcoal font-mono font-bold">{f.completed}</td>
                <td className="p-4 text-right">
                  <div className="inline-flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-frost-gray text-charcoal border border-platinum-silver">
                      {f.rate}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
