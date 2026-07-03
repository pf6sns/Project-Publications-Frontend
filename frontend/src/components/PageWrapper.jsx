/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { getPublications, submitPublication, evaluatePublication } from '../services/publicationService';
import { Spinner } from './Spinner';

export default function PageWrapper({ Component, additionalProps = {} }) {
  const { currentUser, users } = useAuth();
  const { grantTemporaryAdmin, revokeTemporaryAdmin } = useRole();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublications().then(data => {
      setPublications(data);
      setLoading(false);
    });
  }, []);

  const handleSuccess = async (data) => {
    const res = await submitPublication(data, currentUser);
    if (res.success) {
      setPublications(prev => {
        if (res.isUpdate) {
          return prev.map(p => p.id === res.publication.id ? res.publication : p);
        }
        return [res.publication, ...prev];
      });
    }
  };

  const handleApprove = async (pubId, feedbackText, reviewedFileName) => {
    const updated = await evaluatePublication(pubId, 'approve', feedbackText, currentUser, reviewedFileName);
    if (updated) {
      setPublications(prev => prev.map(p => p.id === pubId ? updated : p));
    }
  };

  const handleReject = async (pubId, feedbackText, reviewedFileName) => {
    const updated = await evaluatePublication(pubId, 'reject', feedbackText, currentUser, reviewedFileName);
    if (updated) {
      setPublications(prev => prev.map(p => p.id === pubId ? updated : p));
    }
  };

  if (loading) {
    return <Spinner fullPage label="Loading System Data..." />;
  }

  return (
    <Component
      currentUser={currentUser}
      users={users}
      publications={publications}
      onSuccess={handleSuccess}
      onApprove={handleApprove}
      onReject={handleReject}
      grantTemporaryAdmin={grantTemporaryAdmin}
      revokeTemporaryAdmin={revokeTemporaryAdmin}
      {...additionalProps}
    />
  );
}
