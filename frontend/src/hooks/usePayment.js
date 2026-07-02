import { useState } from 'react';
import * as paymentService from '../services/paymentService';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  const processPayment = async (amount, category, upiId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.executePayment(amount, category, upiId);
      setPaymentResult(result);
      return result;
    } catch (err) {
      setError(err.message || 'Payment failed');
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
    resetPayment
  };
}
