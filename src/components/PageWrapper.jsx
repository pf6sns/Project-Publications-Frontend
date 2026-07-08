/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import * as publicationService from '../services/publicationService';
import { facultyService } from '../services/facultyService';

export default function PageWrapper({ Component, additionalProps = {} }) {
  const { currentUser } = useAuth();
  const { grantTemporaryAdmin, revokeTemporaryAdmin } = useRole();

  const handleSuccess = async (data) => {
    return await publicationService.submitPublication(data);
  };

  const handleApprove = async (pubId, reviewFileObject) => {
    await publicationService.completeReview(pubId, reviewFileObject);
  };

  const handleCancelSubmission = async (customPublicationId) => {
    await publicationService.deletePublication(customPublicationId);
  };

  return (
    <Component
      currentUser={currentUser}
      publications={[]}
      onSuccess={handleSuccess}
      onApprove={handleApprove}
      grantTemporaryAdmin={grantTemporaryAdmin}
      revokeTemporaryAdmin={revokeTemporaryAdmin}
      isEditable={true}
      onSaveLinks={facultyService.updateSocialLinks}
      onCancelSubmission={handleCancelSubmission}
      {...additionalProps}
    />
  );
}
