/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};
