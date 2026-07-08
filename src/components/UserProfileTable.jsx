/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Link as LinkIcon,
  Edit2,
  Check,
  X as XIcon,
  Loader2,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { facultyService } from '../services/facultyService';

export function UserProfile({ user, globalFields = [], isEditable = false, onSaveLinks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localLinks, setLocalLinks] = useState(user.socialLinks || []);
  const [isSaving, setIsSaving] = useState(false);
  const [showPublicationsModal, setShowPublicationsModal] = useState(false);
  const [modalPublications, setModalPublications] = useState([]);
  const [loadingPubs, setLoadingPubs] = useState(false);
  const [pubPage, setPubPage] = useState(1);
  const pubsPerPage = 5;

  const handleOpenPublications = async () => {
    setShowPublicationsModal(true);
    setLoadingPubs(true);
    setPubPage(1);
    try {
      const fullProfile = await facultyService.getFacultyById(user.user_id);
      setModalPublications(fullProfile.publications || []);
    } catch (err) {
      console.error('Failed to load publications:', err);
      alert('Failed to load publications.');
    } finally {
      setLoadingPubs(false);
    }
  };

  const name = user.name;
  const email = user.email;
  const dept = user.department;
  const phone = user.phone;
  const profilePic = user.profilePic || '';
  const institution = user.institution;

  return (
    <div className="w-full flex items-center justify-center py-8 px-4 animate-fade-in text-left">
      {/* Centered Profile Card to avoid empty spaces and look extremely premium */}
      <div className="bg-pure-white rounded-3xl border border-platinum-silver shadow-xs hover-silver-glow p-8 md:p-10 w-full max-w-2xl relative overflow-hidden transition-all duration-350">

        {/* Subtle decorative clean top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-slate-400 via-slate-500 to-charcoal"></div>

        {/* Top-Right Publications Button (Desktop) */}
        <button
          onClick={handleOpenPublications}
          className="hidden sm:flex absolute top-6 right-6 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-850 border border-indigo-100 text-xs font-bold rounded-xl items-center space-x-2 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer z-10"
          title="View Publications"
        >
          <BookOpen className="h-4.5 w-4.5 shrink-0" />
          <span>View Publications</span>
        </button>

        {/* Profile Header section */}
        <div className="flex flex-col items-center text-center pb-8 border-b border-platinum-silver/45">
          {/* Circular Avatar */}
          <div className="h-24 w-24 rounded-full border-2 border-platinum-silver/40 bg-slate-50 flex items-center justify-center shadow-sm overflow-hidden relative shrink-0 mb-4 select-none">
            {profilePic ? (
              <img src={profilePic} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-charcoal font-black text-3xl font-sans">
                {name.charAt(0)}
              </span>
            )}
          </div>

          {/* User Name */}
          <h3 className="text-2xl font-black text-charcoal tracking-tight uppercase leading-snug">
            {name}
          </h3>

          {/* Email Address */}
          <div className="flex items-center justify-center space-x-2 text-slate-gray text-sm font-medium select-all hover:text-charcoal transition-colors mt-2">
            <Mail className="h-4 w-4 text-steel-gray shrink-0" />
            <a href={`mailto:${email}`} className="hover:underline">{email}</a>
          </div>

          {/* Active status indicator badge */}
          <div className="mt-3 select-none">
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-md border border-emerald-100 uppercase tracking-wider">
              Active
            </span>
          </div>

          {/* Publications Button (Mobile/Tablet) */}
          <button
            onClick={handleOpenPublications}
            className="flex sm:hidden mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-850 border border-indigo-100 text-xs font-bold rounded-xl items-center justify-center space-x-2 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer w-full max-w-[200px]"
            title="View Publications"
          >
            <BookOpen className="h-4.5 w-4.5 shrink-0" />
            <span>View Publications</span>
          </button>
        </div>

        {/* Symmetric 2x2 Grid details - ONLY the required fields, no extra things */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">

          {/* 1. Institution */}
          <div className="bg-slate-50/45 p-5 rounded-2xl border border-platinum-silver/45 flex items-center space-x-4 hover:bg-slate-50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-platinum-silver/30 shadow-3xs shrink-0 select-none">
              <Building className="h-4.5 w-4.5 text-steel-gray" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider select-none">Institution</span>
              <span className="block text-sm font-bold text-charcoal leading-snug truncate">{institution}</span>
            </div>
          </div>

          {/* 2. Department */}
          <div className="bg-slate-50/45 p-5 rounded-2xl border border-platinum-silver/45 flex items-center space-x-4 hover:bg-slate-50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-platinum-silver/30 shadow-3xs shrink-0 select-none">
              <GraduationCap className="h-4.5 w-4.5 text-steel-gray" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider select-none">Department</span>
              <span className="block text-sm font-bold text-charcoal leading-snug truncate">{dept}</span>
            </div>
          </div>

          {/* 3. Email ID */}
          <div className="bg-slate-50/45 p-5 rounded-2xl border border-platinum-silver/45 flex items-center space-x-4 hover:bg-slate-50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-platinum-silver/30 shadow-3xs shrink-0 select-none">
              <Mail className="h-4.5 w-4.5 text-steel-gray" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider select-none">Email ID</span>
              <span className="block text-sm font-bold text-charcoal leading-snug truncate">
                {user.email || ''}
              </span>
            </div>
          </div>

          {/* 4. Phone Number */}
          <div className="bg-slate-50/45 p-5 rounded-2xl border border-platinum-silver/45 flex items-center space-x-4 hover:bg-slate-50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-platinum-silver/30 shadow-3xs shrink-0 select-none">
              <Phone className="h-4.5 w-4.5 text-steel-gray" />
            </div>
            <div className="flex-1 min-w-0 font-mono">
              <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider select-none">Phone Number</span>
              <span className="block text-sm font-bold text-charcoal leading-snug select-all truncate">{phone}</span>
            </div>
          </div>

        </div>

        {/* Global Profile URL Fields */}
        {globalFields && globalFields.length > 0 && (
          <div className="mt-8 border-t border-platinum-silver/45 pt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider">Web Profiles</h4>
              {isEditable && (
                !isEditing ? (
                  <button
                    onClick={() => {
                      setLocalLinks(user.socialLinks || []);
                      setIsEditing(true);
                    }}
                    className="flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Links</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={async () => {
                        setIsSaving(true);
                        try {
                          if (onSaveLinks) {
                            await onSaveLinks(localLinks);
                          } else {
                            await facultyService.updateSocialLinks(localLinks);
                          }
                          // Update local user state immediately for fast feedback
                          user.socialLinks = localLinks;
                          setIsEditing(false);
                        } catch (err) {
                          alert('Failed to save links: ' + err.message);
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      disabled={isSaving}
                      className="flex items-center space-x-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>Save</span>
                    </button>
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {globalFields.map(field => {
                const linksToUse = isEditing ? localLinks : (user.socialLinks || []);
                const currentLinkObj = linksToUse.find(s => s.social_media_name === field.name);
                const value = currentLinkObj ? currentLinkObj.social_media_link : '';
                return (
                  <div key={field.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-platinum-silver/30">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center border border-platinum-silver/30 shrink-0">
                      <LinkIcon className="h-4 w-4 text-steel-gray" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-0.5">{field.name}</span>
                      {isEditing ? (
                        <input
                          type="url"
                          value={value}
                          onChange={(e) => {
                            const newLinks = [...localLinks];
                            const idx = newLinks.findIndex(s => s.social_media_name === field.name);
                            if (idx >= 0) {
                              newLinks[idx].social_media_link = e.target.value;
                            } else {
                              newLinks.push({ social_media_name: field.name, social_media_link: e.target.value });
                            }
                            setLocalLinks(newLinks);
                          }}
                          placeholder={`https://...`}
                          className="w-full text-sm font-medium text-charcoal bg-white border border-platinum-silver/50 rounded-md px-2 py-1 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                      ) : (
                        value ? (
                          <a href={value} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-blue-600 truncate hover:underline">
                            {value}
                          </a>
                        ) : (
                          <span className="block text-sm font-medium text-gray-300 italic">No link added</span>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Publications Modal */}
      {showPublicationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-pure-white rounded-3xl border border-platinum-silver shadow-xl max-w-2xl w-full p-4 sm:p-6 md:p-8 animate-fade-in relative max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-platinum-silver/45 shrink-0">
              <div className="flex items-center space-x-2.5">
                <BookOpen className="h-5 w-5 text-indigo-650" />
                <h3 className="text-lg font-black text-charcoal tracking-tight uppercase">
                  Publications
                </h3>
              </div>
              <button 
                onClick={() => setShowPublicationsModal(false)}
                className="text-slate-gray hover:text-charcoal bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg border border-platinum-silver/40 transition-colors cursor-pointer"
              >
                <XIcon className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto py-4 sm:py-6">
              {loadingPubs ? (
                <div className="flex flex-col justify-center items-center py-12 space-y-3">
                  <Loader2 className="h-8 w-8 text-charcoal animate-spin" />
                  <p className="text-xs text-slate-gray font-medium animate-pulse">Fetching publications...</p>
                </div>
              ) : modalPublications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm font-bold text-slate-400">No publications found for this faculty member.</p>
                </div>
              ) : (
                <div className="w-full overflow-x-auto border border-platinum-silver/45 rounded-2xl">
                  <table className="w-full min-w-[420px] text-left text-xs text-slate-gray border-collapse">
                    <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-platinum-silver/45">
                      <tr>
                        <th className="px-2 py-1.5 sm:px-4 sm:py-3 text-left w-10">S.No</th>
                        <th className="px-2 py-1.5 sm:px-4 sm:py-3 text-left">Title</th>
                        <th className="px-2 py-1.5 sm:px-4 sm:py-3 text-left w-20">Status</th>
                        <th className="px-2 py-1.5 sm:px-4 sm:py-3 text-left w-24">Submission Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-platinum-silver/30">
                      {modalPublications
                        .slice((pubPage - 1) * pubsPerPage, pubPage * pubsPerPage)
                        .map((pub, idx) => (
                          <tr key={pub.custom_publication_id || idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-2 py-1.5 sm:px-4 sm:py-3 font-bold text-charcoal">
                              {(pubPage - 1) * pubsPerPage + idx + 1}
                            </td>
                            <td className="px-2 py-1.5 sm:px-4 sm:py-3 font-bold text-charcoal break-words">
                              {pub.title}
                            </td>
                            <td className="px-2 py-1.5 sm:px-4 sm:py-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-mono font-extrabold tracking-wider border inline-block ${
                                pub.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : pub.status === 'Submitted'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                  : 'bg-slate-50 text-charcoal border-platinum-silver'
                              }`}>
                                {pub.status}
                              </span>
                            </td>
                            <td className="px-2 py-1.5 sm:px-4 sm:py-3 font-mono font-medium text-slate-500">
                              {pub.submission_date 
                                ? new Date(pub.submission_date).toLocaleDateString()
                                : '—'
                              }
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer with Pagination */}
            {!loadingPubs && modalPublications.length > 0 && (
              <div className="flex items-center justify-between border-t border-platinum-silver/45 pt-4 shrink-0">
                <p className="text-[11px] text-slate-gray font-medium">
                  Showing <span className="font-bold text-charcoal">{(pubPage - 1) * pubsPerPage + 1}</span> to{' '}
                  <span className="font-bold text-charcoal">
                    {Math.min(pubPage * pubsPerPage, modalPublications.length)}
                  </span>{' '}
                  of <span className="font-bold text-charcoal">{modalPublications.length}</span> publications
                </p>
                
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setPubPage(p => Math.max(1, p - 1))}
                    disabled={pubPage <= 1}
                    className="p-1.5 rounded-lg border border-platinum-silver/45 text-slate-gray hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {Array.from({ length: Math.ceil(modalPublications.length / pubsPerPage) }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPubPage(p)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          p === pubPage
                            ? 'bg-charcoal text-white border-charcoal'
                            : 'bg-white text-charcoal border-platinum-silver/45 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPubPage(p => Math.min(Math.ceil(modalPublications.length / pubsPerPage), p + 1))}
                    disabled={pubPage >= Math.ceil(modalPublications.length / pubsPerPage)}
                    className="p-1.5 rounded-lg border border-platinum-silver/45 text-slate-gray hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
