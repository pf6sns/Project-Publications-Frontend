/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { UserProfile } from '../../components/UserProfileTable';
import { useGlobalFields } from '../../hooks/useFaculty';

export const ProfilePage = ({ currentUser, publications, onUpdateProfile, isEditable = false, onSaveLinks }) => {
  const { fields, fetchFields } = useGlobalFields();

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return (
    <UserProfile
      user={currentUser}
      publications={publications}
      onUpdateProfile={onUpdateProfile}
      globalFields={fields}
      isEditable={isEditable}
      onSaveLinks={onSaveLinks}
    />
  );
};
