// src/api/dashboardApi.js
import { apiClient, unwrap } from './apiClient';

export const fetchDashboard = async (institutionId, month, startDate, endDate) => {
  const res = await apiClient.get('/admin/dashboard', { params: { institutionId, startDate, endDate } });
  return unwrap(res).data;
};

export const exportDashboard = async (institutionId, month, startDate, endDate) => {
  const res = await apiClient.get('/admin/dashboard/export', { params: { institutionId, startDate, endDate } });
  return unwrap(res).downloadUrl; // direct S3 link to the generated .xlsx
};
