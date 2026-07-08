/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AdminReviews } from '../../components/EvaluationPanel';
import * as publicationService from '../../services/publicationService';

export const AdminEvaluationPage = ({
  publications,
  onApprove,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedPubId, setSelectedPubId] = useState(id || null);
  const [directFetchedPub, setDirectFetchedPub] = useState(null);

  useEffect(() => {
    if (id) {
      setSelectedPubId(id);
    } else {
      setSelectedPubId(null);
    }
  }, [id]);

  useEffect(() => {
    if (selectedPubId) {
      const found = publications.find(p => p.id === selectedPubId);
      if (!found) {
        publicationService.getPublicationDetail(selectedPubId)
          .then(pub => setDirectFetchedPub(pub))
          .catch(err => console.error("Failed to load publication details:", err));
      } else {
        setDirectFetchedPub(null);
      }
    } else {
      setDirectFetchedPub(null);
    }
  }, [selectedPubId, publications]);

  const combinedPublications = directFetchedPub 
    ? [...publications, directFetchedPub]
    : publications;

  return (
    <div className="space-y-6 w-full">
      <AdminReviews
        publications={combinedPublications}
        onApprove={onApprove}
        selectedPubId={selectedPubId}
        onSelectPub={(pubId) => {
          setSelectedPubId(pubId);
          const prefix = location.pathname.startsWith('/faculty') ? '/faculty' : '/admin';
          if (pubId) {
            navigate(`${prefix}/evaluation/${pubId}`);
          } else {
            navigate(`${prefix}/queue`);
          }
        }}
      />
    </div>
  );
};
