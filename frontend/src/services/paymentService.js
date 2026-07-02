/**
 * services/paymentService.js
 *
 * Payment Service.
 * All payment operations go through here.
 * No direct mock logic — delegates to paymentApi.
 *
 * Current: delegates to paymentApi mock (simulated UPI)
 * Future:  delegates to paymentApi → Razorpay SDK → backend
 */

import * as paymentApi from '../api/paymentApi';

/**
 * Processes a payment for a publication.
 *
 * @param {number} amount - Amount in INR
 * @param {string} category - Publication category name
 * @param {string} upiId - User's UPI ID
 * @returns {{ success: boolean, transactionId: string, date: string, amount: number, method: string, category: string }}
 */
export const executePayment = async (amount, category, upiId) => {
  return await paymentApi.processPayment(amount, category, upiId);
};
