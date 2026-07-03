/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, X, Search, Settings } from 'lucide-react';
import { SearchableDropdown } from '../../components/SearchableDropdown';
import { Modal } from '../../components/Modal';
import { assignMainAdmin, revokeMainAdmin } from '../../services/assignRoleService';
import { useAuth } from '../../hooks/useAuth';

const INSTITUTION_OPTIONS = [
  'All Institutions',
  'SNSCT',
  'SNSCE',
  'SNSRCAS',
  'SNSCAHS',
  'SNSCNURSING',
  'SNSCPHYSIO',
  'SNSCPHS',
  'DRSNSCEDU',
  'SNSBSPINE',
  'SNSACADEMY'
];

export const AssignRolePage = () => {
  const { users, setUsers } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(['All Institutions']);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Collapse search bar on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        searchQuery === ''
      ) {
        setIsSearchExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [searchQuery]);

  // Focus input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);
  
  const [confirmModalState, setConfirmModalState] = useState({ isOpen: false, userId: null, action: null });

  const confirmAction = async () => {
    const { userId, action } = confirmModalState;
    if (action === 'assign') {
      const nextUsers = await assignMainAdmin(userId);
      setUsers(nextUsers);
    } else if (action === 'revoke') {
      const nextUsers = await revokeMainAdmin(userId);
      setUsers(nextUsers);
    }
    setConfirmModalState({ isOpen: false, userId: null, action: null });
  };

  const handleAssign = (userId) => {
    setConfirmModalState({ isOpen: true, userId, action: 'assign' });
  };

  const handleRevoke = (userId) => {
    setConfirmModalState({ isOpen: true, userId, action: 'revoke' });
  };

  const filteredUsers = Object.values(users).filter(u => {
    if (u.role !== 'Faculty' && u.role !== 'Admin') return false; // Developer only manages Faculty and Admin
    if (u.id === 'DEV01') return false; // Do not show Developer
    
    // Filter by institution
    if (!selectedInstitution.includes('All Institutions')) {
      let userInst = u.institution;
      // Deterministically assign mock institution if none exists
      if (!userInst) {
        const hash = u.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const mod = hash % 4;
        if (mod === 0) userInst = 'SNSCT';
        else if (mod === 1) userInst = 'SNSCE';
        else if (mod === 2) userInst = 'SNSRCAS';
        else userInst = 'SNSCAHS';
      }
      if (!selectedInstitution.includes(userInst)) return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 text-left w-full">
      <Modal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState({ isOpen: false, userId: null, action: null })}
        title={confirmModalState.action === 'assign' ? 'Assign Main Admin' : 'Revoke Main Admin'}
        icon={confirmModalState.action === 'assign' ? ShieldCheck : X}
        maxWidthClass="max-w-md"
        footerActions={
          <>
            <button
              onClick={() => setConfirmModalState({ isOpen: false, userId: null, action: null })}
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
              className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors shadow-sm ${
                confirmModalState.action === 'assign' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Confirm
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          {confirmModalState.action === 'assign' 
            ? "Are you sure you want to assign the Main Admin role to this user? They will gain full administrative privileges."
            : "Are you sure you want to revoke the Main Admin role from this user? They will lose all administrative access."
          }
        </p>
      </Modal>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
        
        {/* Search and filters row */}
        <div className="mb-6 flex flex-col sm:flex-row sm:flex-wrap md:flex-nowrap items-start sm:items-center justify-between gap-3 w-full">
          {/* Search matches name or department - Dynamic Lens */}
          <div
            ref={searchContainerRef}
            className={`relative flex items-center h-10 transition-all duration-300 ease-out rounded-lg border shrink-0 ${isSearchExpanded
                ? 'w-full sm:w-64 md:w-72 px-3 bg-white border-slate-300 shadow-xs'
                : 'w-10 px-0 bg-slate-50 border-slate-200 shadow-none hover:bg-slate-100 hover:border-slate-300'
              }`}
          >
            <button
              type="button"
              onClick={() => {
                setIsSearchExpanded(!isSearchExpanded);
                if (isSearchExpanded) setSearchQuery('');
              }}
              className={`flex items-center justify-center rounded-lg transition-colors cursor-pointer shrink-0 ${isSearchExpanded
                  ? 'text-slate-400'
                  : 'w-10 h-10 text-slate-500 hover:text-charcoal'
                }`}
              title="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search user by name or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs pl-2 bg-transparent text-slate-900 border-none outline-none focus:ring-0 focus:outline-none transition-opacity duration-200 ${isSearchExpanded ? 'opacity-100 w-full pointer-events-auto' : 'opacity-0 w-0 pointer-events-none'
                }`}
            />
          </div>

          {/* Institution Dropdown */}
          <div className="w-full sm:w-64 md:w-72 shrink-0 relative z-20">
            <SearchableDropdown
              options={INSTITUTION_OPTIONS}
              value={selectedInstitution}
              onChange={setSelectedInstitution}
              placeholder="Search institution..."
              isMulti={true}
            />
          </div>
        </div>

        {/* Mobile/Tablet Card list */}
        <div className="lg:hidden space-y-4">
          {filteredUsers.map((user) => {
              return (
                <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-left transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-slate-300">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{user.name}</p>
                  </div>
                  <div className="text-[11px] text-slate-655 space-y-2">
                    <p><strong className="font-semibold">Department:</strong> {user.department}</p>
                    <div className="flex items-center gap-2">
                      <strong className="font-semibold">Role:</strong>
                      <select
                        value={user.role}
                        onChange={(e) => {
                          if (e.target.value === 'Admin') handleAssign(user.id);
                          else handleRevoke(user.id);
                        }}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded p-1 outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="Faculty">Faculty</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Desktop view table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-widest font-extrabold text-[9px] border-b border-slate-200">
                <th className="p-4 w-1/3">User Name</th>
                <th className="p-4 w-1/2">Department</th>
                <th className="p-4 w-1/6">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-800">
                        <p className="font-bold text-slate-800 text-xs">{user.name}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-700">{user.department}</p>
                      </td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => {
                            if (e.target.value === 'Admin') handleAssign(user.id);
                            else handleRevoke(user.id);
                          }}
                          className={`px-2 py-1 border rounded text-[11px] font-bold outline-none cursor-pointer ${
                            user.role === 'Admin' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 focus:border-emerald-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-slate-400'
                          }`}
                        >
                          <option value="Faculty">Faculty</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
