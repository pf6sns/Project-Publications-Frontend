/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTheme as useThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  return useThemeContext();
};
