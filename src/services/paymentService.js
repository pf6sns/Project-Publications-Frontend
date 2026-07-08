/**
 * services/paymentService.js
 *
 * Payment Service.
 * Thin wrapper around paymentApi → Razorpay backend.
 */

import * as paymentApi from '../api/paymentApi';

/**
 * Creates a Razorpay order for a publication.
 *
 * @param {string} customPublicationId
 * @returns {{ orderId: string, amount: number, currency: string, key: string }}
 */
export const createOrder = async (customPublicationId) => {
  return await paymentApi.createOrder(customPublicationId);
};

export const verifyPayment = async (verificationData) => {
  return await paymentApi.verifyPayment(verificationData);
};
