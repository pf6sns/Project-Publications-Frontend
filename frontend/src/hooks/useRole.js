/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRoleContext } from '../context/RoleContext';

export const useRole = () => {
  return useRoleContext();
};
