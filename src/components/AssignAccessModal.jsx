/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  AlertCircle, 
  CheckCircle2,
  Check
} from 'lucide-react';
import { Modal } from './Modal';

const PAGES = [
  { 
    id: 'dashboard', 
    label: 'Dashboard',
    features: [{ id: 'export_data', label: 'Export Data' }]
  },
  { 
    id: 'faculty_profiles', 
    label: 'Faculty Profiles',
    features: []
  },
  { id: 'queue', label: 'Submissions Queue' },
  { 
    id: 'upload', 
    label: 'Upload Manuscript',
    features: [
      { id: 'edit', label: 'Edit Manuscript' },
      { id: 'delete', label: 'Delete Manuscript' },
    ]
  },
  { id: 'assign_access', label: 'Assign Access' },
];

export function GrantAssessorModal({
  isOpen,
  onClose,
  facultyUser,
  type, // 'granted' (meaning opening selection) or 'revoked'
  onConfirmGrant,
  initialPages = [],
  initialFeatures = [],
}) {
  const [selectedPages, setSelectedPages] = useState(
    () => type === 'granted' ? initialPages : []
  );
  const [selectedFeatures, setSelectedFeatures] = useState(
    () => type === 'granted' ? initialFeatures : []
  );
  const [isSuccess, setIsSuccess] = useState(type === 'revoked');

  // Auto-close success popup after 2.5 seconds
  useEffect(() => {
    if (isOpen && isSuccess) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSuccess, onClose]);

  if (!isOpen || !facultyUser) return null;

  // Handle toggling a page
  const handleTogglePage = (pageId) => {
    setSelectedPages(prev => {
      if (prev.includes(pageId)) {
        return prev.filter(p => p !== pageId);
      } else {
        return [...prev, pageId];
      }
    });
  };

  const handleToggleFeature = (featureId, pageId) => {
    setSelectedFeatures(prev => {
      const isCurrentlySelected = prev.includes(featureId);
      if (isCurrentlySelected) {
        return prev.filter(f => f !== featureId);
      } else {
        // Auto-select parent page if not already selected
        setSelectedPages(prevPages => {
          if (!prevPages.includes(pageId)) {
            return [...prevPages, pageId];
          }
          return prevPages;
        });
        return [...prev, featureId];
      }
    });
  };

  const handleConfirmGrants = () => {
    let finalPages = [...selectedPages];
    
    // Auto-grant dependent pages
    if (selectedFeatures.includes('export_data') && !finalPages.includes('dashboard')) {
      finalPages.push('dashboard');
    }
    if ((selectedFeatures.includes('create_category') || selectedFeatures.includes('edit') || selectedFeatures.includes('delete')) && !finalPages.includes('upload')) {
      finalPages.push('upload');
    }
    if (selectedFeatures.includes('manage_profile_fields') && !finalPages.includes('faculty_profiles')) {
      finalPages.push('faculty_profiles');
    }

    if (onConfirmGrant) {
      onConfirmGrant(facultyUser.id, { pages: finalPages, features: selectedFeatures });
    }
    setIsSuccess(true);
  };

  if (isSuccess) {
    const isGranted = type === 'granted';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4 overflow-y-auto">
        <div className="w-full max-w-md overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-2xl animate-scale-in my-8">
          <div className={`p-5 flex items-center justify-between text-left text-white ${isGranted ? 'bg-emerald-600' : 'bg-red-650'}`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg">
                {isGranted ? <ShieldCheck className="h-5 w-5 text-white" /> : <AlertCircle className="h-5 w-5 text-white" />}
              </div>
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  {isGranted ? 'Access Granted' : 'Access Revoked'}
                </h3>
                <p className="text-[11px] text-white/90 mt-0.5">
                  Faculty Member: <span className="font-bold underline">{facultyUser.name}</span>
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
          <div className="p-6 space-y-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className={`p-3 rounded-full ${isGranted ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {isGranted ? <CheckCircle2 className="h-10 w-10" /> : <AlertCircle className="h-10 w-10" />}
              </div>
              <h4 className={`text-base font-extrabold ${isGranted ? 'text-emerald-700' : 'text-red-700'}`}>
                {isGranted ? 'Custom Privileges Applied' : 'Assessor Access Disabled'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                {isGranted ? (
                  <>Custom evaluation privileges have been successfully granted to <span className="font-bold text-slate-800">{facultyUser.name}</span>.</>
                ) : (
                  <>Evaluation privileges for <span className="font-bold text-slate-800">{facultyUser.name}</span> have been revoked.</>
                )}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
              <button onClick={onClose} className={`w-full max-w-xs py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer ${isGranted ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Granular Access"
      icon={ShieldCheck}
      maxWidthClass="max-w-xl"
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
            type="button" 
            onClick={handleConfirmGrants}
            disabled={selectedPages.length === 0 && selectedFeatures.length === 0}
            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4" />
            <span>Confirm & Assign</span>
          </button>
        </>
      }
    >
      <div>
        <p className="text-sm text-slate-500 mb-4">Select the pages to grant to <span className="font-bold">{facultyUser.name}</span>:</p>

        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-visible p-4 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-0.5">
            Access Controls
          </p>
          <div className="columns-1 sm:columns-2 gap-x-4">
            {PAGES.map(page => (
              <div key={page.id} className="flex flex-col space-y-2 break-inside-avoid mb-4">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600 shrink-0"
                    checked={selectedPages.includes(page.id)}
                    onChange={() => handleTogglePage(page.id)}
                  />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">
                    {page.label}
                  </span>
                </label>
                
                {page.features && page.features.length > 0 && (
                  <div className="flex flex-col space-y-2 pl-6 mt-1 border-l-2 border-slate-100 ml-1.5">
                    {page.features.map(feature => (
                      <label key={feature.id} className="flex items-center gap-2.5 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500 shrink-0"
                          checked={selectedFeatures.includes(feature.id)}
                          onChange={() => handleToggleFeature(feature.id, page.id)}
                        />
                        <span className="text-xs text-slate-600 group-hover:text-slate-800 leading-tight">
                          {feature.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
