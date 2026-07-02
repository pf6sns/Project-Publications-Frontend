/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { InstitutionStats } from '../../components/dashboard/StatisticCard';

export const AdminStatsPage = ({ publications }) => {
  return <InstitutionStats publications={publications} />;
};
