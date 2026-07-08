import { useState } from 'react';
import * as paymentService from '../services/paymentService';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

const loadRazorpaySDK = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

  /**
   * Creates a Razorpay order for a publication.
   *
   * @param {string} customPublicationId
   * @returns {{ orderId: string, amount: number, currency: string, key: string }}
   */
  const processPayment = async (customPublicationId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.createOrder(customPublicationId);
      setPaymentResult(result);
      return result;
    } catch (err) {
      setError(err.message || 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (verificationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.verifyPayment(verificationData);
      return result;
    } catch (err) {
      setError(err.message || 'Payment verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPayment = () => {
    setPaymentResult(null);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    error,
    paymentResult,
    processPayment,
    verifyPayment,
    resetPayment,
    loadRazorpaySDK
  };
}
