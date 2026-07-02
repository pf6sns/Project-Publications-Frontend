/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Building,
  GraduationCap,
  Link as LinkIcon
} from 'lucide-react';

export function UserProfile({ user, globalFields = [] }) {
  const name = user.name;
  const email = user.email;
  const dept = user.department;
  const phone = user.phone || '+91 8220479567';
  const profilePic = user.profilePic || '';
  const institution = user.institution || 'SNS College of Engineering';

  return (
    <div className="w-full flex items-center justify-center py-8 px-4 animate-fade-in text-left">
      {/* Centered Profile Card to avoid empty spaces and look extremely premium */}
      <div className="bg-pure-white rounded-3xl border border-platinum-silver shadow-xs hover-silver-glow p-8 md:p-10 w-full max-w-2xl relative overflow-hidden transition-all duration-350">
        
        {/* Subtle decorative clean top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-slate-400 via-slate-500 to-charcoal"></div>

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
            <h4 className="text-sm font-bold text-charcoal mb-4 uppercase tracking-wider">Web Profiles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {globalFields.map(field => {
                const value = user.profileUrls?.[field.id] || '';
                return (
                  <div key={field.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-platinum-silver/30">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center border border-platinum-silver/30 shrink-0">
                      <LinkIcon className="h-4 w-4 text-steel-gray" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">{field.name}</span>
                      {value ? (
                        <a href={value} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-blue-600 truncate hover:underline">
                          {value}
                        </a>
                      ) : (
                        <span className="block text-sm font-medium text-gray-300 italic"></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
