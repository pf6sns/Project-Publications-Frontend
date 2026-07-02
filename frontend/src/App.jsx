/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
