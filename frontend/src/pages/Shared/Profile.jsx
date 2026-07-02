/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../components/profile/UserProfileTable';

export const ProfilePage = ({ currentUser, publications, onUpdateProfile, globalFields }) => {
  return (
    <UserProfile
      user={currentUser}
      publications={publications}
      onUpdateProfile={onUpdateProfile}
      globalFields={globalFields}
    />
  );
};
