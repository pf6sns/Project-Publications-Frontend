/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminReviews } from '../../components/EvaluationPanel';

export const AdminEvaluationPage = ({
  publications,
  onApprove,
  onReject,
  users,
  onAssignReviewer,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPubId, setSelectedPubId] = useState(location.state?.pubId || null);

  useEffect(() => {
    if (location.state?.pubId) {
      setSelectedPubId(location.state.pubId);
    }
  }, [location.state?.pubId]);
  return (
    <div className="space-y-6 w-full">
      <AdminReviews
        publications={publications}
        onApprove={onApprove}
        onReject={onReject}
        selectedPubId={selectedPubId}
        onSelectPub={(id) => {
          setSelectedPubId(id);
          if (!id) {
             // Navigate within the correct portal prefix
             const prefix = location.pathname.startsWith('/faculty') ? '/faculty' : '/admin';
             navigate(`${prefix}/queue`);
          }
        }}
        users={users}
        onAssignReviewer={onAssignReviewer}
      />
    </div>
  );
};
