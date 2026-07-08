/**
 * api/paymentApi.js
 *
 * Payment processing API layer.
 * Talks to real backend Razorpay integration.
 *
 * Flow:
 *   1. POST /api/payment/create-order/:customPublicationId → returns Razorpay order
 *   2. Client opens Razorpay checkout widget with the returned order_id
 *   3. On success, Razorpay webhook auto-verifies on the server side
 */

import { apiClient, unwrap } from './apiClient';

/**
 * Creates a Razorpay order for a publication.
 * POST /api/payment/create-order/:customPublicationId
 *
 * @param {string} customPublicationId - The publication's custom ID
 * @returns {{ orderId: string, amount: number, currency: string, key: string }}
 */
export const createOrder = async (customPublicationId) => {
  const res = await apiClient.post(`/payment/create-order/${customPublicationId}`);
  const body = unwrap(res);
  return body.data; // { orderId, amount, currency, key }
};

export const verifyPayment = async (verificationData) => {
  const res = await apiClient.post(`/payment/verify`, verificationData);
  const body = unwrap(res);
  return body.data;
};

export const fetchPaymentSettings = async () => {
  const res = await apiClient.get('/payment/settings');
  return unwrap(res).isPaymentEnabled;
};

export const updatePaymentSettings = async (isPaymentEnabled) => {
  const res = await apiClient.post('/payment/settings', { isPaymentEnabled });
  return unwrap(res).isPaymentEnabled;
};
