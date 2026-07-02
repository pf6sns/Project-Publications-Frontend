/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UploadForm } from '../../components/publication/UploadForm';

export const UploadPage = ({ currentUser, publications, onSuccess }) => {
  return (
    <UploadForm
      currentUser={currentUser}
      publications={publications}
      onSuccess={onSuccess}
    />
  );
};
