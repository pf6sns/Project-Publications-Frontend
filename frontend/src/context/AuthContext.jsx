/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('rpms_users_record');
    if (saved) {
      const parsed = JSON.parse(saved);
      let updated = false;
      Object.keys(parsed).forEach(k => {
        if (mockUsers[k]) {
          if (parsed[k].email !== mockUsers[k].email) {
            parsed[k].email = mockUsers[k].email;
            updated = true;
          }
          if (parsed[k].designation !== mockUsers[k].designation) {
            parsed[k].designation = mockUsers[k].designation;
            updated = true;
          }
        }
      });
      if (updated) {
        localStorage.setItem('rpms_users_record', JSON.stringify(parsed));
      }
      return parsed;
    }
    return mockUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rpms_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      const savedMap = localStorage.getItem('rpms_users_record');
      if (savedMap) {
        const parsedMap = JSON.parse(savedMap);
        if (parsedMap[parsed.id]) {
          return parsedMap[parsed.id];
        }
      }
      return parsed;
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('rpms_users_record', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rpms_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rpms_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const inputEmail = email.trim().toLowerCase();
    const matched = Object.values(users).find(u => u.email.toLowerCase() === inputEmail);

    if (!matched) {
      return { success: false, error: 'Invalid credentials. Email address not registered.' };
    }

    if (matched.role === 'Faculty') {
      if (password !== 'faculty123') {
        return { success: false, error: 'Incorrect password. For Faculty, use: faculty123' };
      }
    } else if (matched.role === 'Admin') {
      if (password !== 'admin123') {
        return { success: false, error: 'Incorrect password. For Admin, use: admin123' };
      }
    }

    setCurrentUser(matched);
    return { success: true, user: matched };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (oldId, updatedUser) => {
    setUsers(prev => {
      const nextUsers = { ...prev };
      if (oldId !== updatedUser.id) {
        delete nextUsers[oldId];
      }
      nextUsers[updatedUser.id] = updatedUser;
      return nextUsers;
    });
    if (currentUser?.id === oldId) {
      setCurrentUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ users, setUsers, currentUser, setCurrentUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
