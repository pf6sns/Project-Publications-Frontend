/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as notifApi from '../api/notificationApi';

export const getNotifications = async (currentUser) => {
  return await notifApi.fetchNotifications(currentUser);
};

export const markNotificationsAsRead = async (currentUser) => {
  return await notifApi.markAllRead(currentUser);
};

export const clearNotifications = async (currentUser) => {
  return await notifApi.clearNotifications(currentUser);
};

export const markNotificationAsRead = async (id) => {
  return await notifApi.updateNotification(id, { read: true });
};

export const logSystemEvent = async (userId, userName, userRole, pubId, pubTitle, action, details, notifMessage, notifType) => {
  const timestamp = new Date().toISOString();
  const activity = {
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    userId, userName, userRole, publicationId: pubId, publicationTitle: pubTitle, action, details, timestamp
  };
  
  await notifApi.logActivity(activity);
};

export const notifyAdminNewPublication = async (pubId, pubTitle) => {
  const adminCurrentUser = { role: 'Admin' };
  const notifs = await notifApi.fetchNotifications(adminCurrentUser);
  const unreadNewPubNotif = notifs.find(n => n.type === 'NEW_PUBLICATION' && !n.read);

  if (unreadNewPubNotif) {
    const count = (unreadNewPubNotif.count || 1) + 1;
    await notifApi.updateNotification(unreadNewPubNotif.id, {
      count,
      message: `${count} New Publications`,
      timestamp: new Date().toISOString()
    });
  } else {
    await notifApi.addNotification({
      id: 'NOT-' + Math.floor(10000 + Math.random() * 90000),
      targetRole: 'Admin',
      type: 'NEW_PUBLICATION',
      title: 'New Publication Uploaded',
      message: '1 New Publication',
      count: 1,
      timestamp: new Date().toISOString(),
      read: false
    });
  }
};

export const notifyFacultyPublicationReviewed = async (facultyId, pubId, pubTitle) => {
  const facultyCurrentUser = { id: facultyId, role: 'Faculty' };
  const notifs = await notifApi.fetchNotifications(facultyCurrentUser);
  const existing = notifs.find(n => n.type === 'PUBLICATION_REVIEWED' && n.publicationId === pubId);

  if (!existing) {
    await notifApi.addNotification({
      id: 'NOT-' + Math.floor(10000 + Math.random() * 90000),
      userId: facultyId,
      publicationId: pubId,
      type: 'PUBLICATION_REVIEWED',
      title: 'Publication Reviewed',
      message: `Your publication "${pubTitle}" has been reviewed.`,
      timestamp: new Date().toISOString(),
      read: false
    });
  }
};
