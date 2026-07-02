/**
 * api/paymentApi.js
 *
 * Payment processing API layer.
 * Currently simulates UPI payment with random transaction IDs.
 *
 * When backend is ready, replace with Razorpay SDK + API calls:
 *
 *   import Razorpay from 'razorpay';
 *   import { apiClient } from './apiClient';
 *
 *   // Step 1: Create order on backend
 *   const orderRes = await apiClient.post('/payments/create-order', { amount, category });
 *
 *   // Step 2: Open Razorpay checkout
 *   const razorpay = new Razorpay({ key: config.razorpayKey, ... });
 *   razorpay.open();
 *
 *   // Step 3: Verify payment on backend
 *   await apiClient.post('/payments/verify', { razorpay_payment_id, razorpay_order_id, ... });
 */

import { simulateNetwork } from './apiClient';

/**
 * Processes a payment.
 * Future: POST /api/payments/process → Razorpay integration
 *
 * @param {number} amount - Payment amount in INR
 * @param {string} category - Publication category name
 * @param {string} upiId - UPI ID entered by user
 * @returns {{ success: boolean, transactionId: string, date: string, amount: number, method: string, category: string }}
 */
export const processPayment = async (amount, category, upiId) => {
  // Simulate payment processing time
  await simulateNetwork(1500);

  if (!upiId || !upiId.includes('@')) {
    throw new Error('Invalid UPI ID');
  }

  const generatedTxn = 'TXN-' + Math.floor(1000000 + Math.random() * 9000000);
  const dateStr = new Date().toISOString();

  return {
    success: true,
    transactionId: generatedTxn,
    date: dateStr,
    amount,
    method: 'UPI',
    category,
  };
};
